"use client";

import { Container, PageHeader } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flex } from "@/components/reusables";
import { cn } from "@/lib/utils";
import { useGetAllQuery, usePostMutation } from "@/store/services/commonApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Bookmark,
  Building,
  CheckCircle2,
  FileText,
  Info,
  Plus,
  Receipt,
  Scale,
  Send,
  Trash2,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { notify } from "@/lib/notifications";
import { z } from "zod";

// Import supplier creation requirements
import { SupplierForm } from "@/components/Supplier/SupplierForm";
import { SupplierFormData } from "@/components/Supplier/types";

const emptySupplier: SupplierFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  location: "",
  supplierCode: "",
  openingLiability: 0,
};

/* ─── Validation Schema (mirrors backend journalEntry.validation.ts) ─────── */
const journalEntrySchema = z.object({
  date: z.string().nonempty("Date is required"),
  category: z.enum([
    "BUYER_DUE",
    "RECEIPT",
    "SUPPLIER_DUE",
    "PAYMENT",
    "JOURNAL",
    "CONTRA",
  ]),
  narration: z.string().optional(), // optional — backend: z.string().max(1000).optional()
  buyerId: z.string().uuid().optional(), // optional — backend: only needed for BUYER_DUE / RECEIPT
  supplierId: z.string().uuid().optional(), // optional — backend: only needed for SUPPLIER_DUE / PAYMENT
  companyProfileId: z.string().uuid(),
  lines: z
    .array(
      z.object({
        accountHeadId: z.string().uuid("Account head is required"),
        type: z.enum(["DEBIT", "CREDIT"]),
        amount: z.number().positive("Must be greater than 0"),
        bankId: z.string().uuid().optional(), // optional — backend: sub-ledger only when bank involved
      }),
    )
    .min(2, "At least 2 lines required"),
});

type JournalFormValues = z.infer<typeof journalEntrySchema>;

/* ─── Category Configs ────────────────────────────────────────────────────── */
const categoryConfigs: Record<
  string,
  { label: string; icon: any; desc: string }
> = {
  RECEIPT: {
    label: "Receipt",
    icon: Receipt,
    desc: "Record a payment received from a buyer.",
  },
  PAYMENT: {
    label: "Payment",
    icon: Send,
    desc: "Record a payment sent to a supplier.",
  },
  JOURNAL: {
    label: "Journal",
    icon: FileText,
    desc: "General adjustment: payroll, depreciation, etc.",
  },
  CONTRA: {
    label: "Contra",
    icon: Undo2,
    desc: "Transfer funds between cash and bank accounts.",
  },
};

/* ─── Helper: Required & Optional labels ─────────────────────────────────── */
function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="text-xs font-semibold text-zinc-700">
      {children}{" "}
      <span className="text-destructive ml-0.5" title="This field is required">
        *
      </span>
    </Label>
  );
}

function OptionalLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="text-xs font-semibold text-zinc-700">
      {children}{" "}
      <span className="text-zinc-400 font-normal ml-1 text-[11px]">
        (optional)
      </span>
    </Label>
  );
}

function HelperText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] text-zinc-400 flex items-start gap-1 mt-1">
      <Info className="w-3 h-3 mt-0.5 shrink-0" />
      {children}
    </p>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-[11px] text-destructive font-medium flex items-center gap-1 mt-1">
      <AlertTriangle className="w-3 h-3 shrink-0" />
      {message}
    </p>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function BookkeepingCreatePage() {
  const router = useRouter();
  const [postEntry, { isLoading: isPosting }] = usePostMutation();

  // Ref guard: prevents StrictMode double-firing on append
  const isAppendingRef = useRef(false);

  // Fetch sub-ledger data
  const { data: accountsData } = useGetAllQuery({
    path: "accounting/accountHeads",
    limit: 1000,
  });
  const { data: buyersData } = useGetAllQuery({ path: "buyers", limit: 1000 });
  const { data: suppliersData, refetch: refetchSuppliers } = useGetAllQuery({
    path: "suppliers",
    limit: 1000,
  });

  // Supplier Creation State
  const [isSupplierFormOpen, setIsSupplierFormOpen] = useState(false);
  const [supplierFormData, setSupplierFormData] =
    useState<SupplierFormData>(emptySupplier);
  const [supplierFormErrors, setSupplierFormErrors] = useState<
    Partial<Record<keyof SupplierFormData, string>>
  >({});
  const [postSupplier] = usePostMutation();

  const handleCreateSupplierSubmit = async () => {
    // Basic validation
    const errors: Partial<Record<keyof SupplierFormData, string>> = {};
    if (!supplierFormData.name?.trim())
      errors.name = "Supplier name is required";
    if (!supplierFormData.email?.trim()) errors.email = "Email is required";
    if (!supplierFormData.phone?.trim())
      errors.phone = "Phone number is required";
    if (!supplierFormData.address?.trim())
      errors.address = "Address is required";
    if (!supplierFormData.location?.trim())
      errors.location = "Location is required";
    setSupplierFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      notify.error("Please fill in all required fields correctly.");
      return;
    }

    try {
      const response = await postSupplier({
        path: "suppliers",
        body: {
          ...supplierFormData,
          openingLiability: supplierFormData.openingLiability
            ? Number(supplierFormData.openingLiability)
            : undefined,
        },
        invalidate: ["suppliers"],
      }).unwrap();

      notify.success("Supplier created successfully");
      setIsSupplierFormOpen(false);
      setSupplierFormData(emptySupplier);

      // Select the newly created supplier
      if (response && response.data && response.data.id) {
        setValue("supplierId", response.data.id);
      }
      refetchSuppliers();
    } catch (err: any) {
      const message =
        err?.data?.message ||
        "Could not create the supplier. Please try again.";
      console.error("Create Supplier Error:", err);
      notify.error(message);
    }
  };

  const handleSupplierFormChange = (
    field: keyof SupplierFormData,
    value: string | number,
  ) => {
    setSupplierFormData((prev: SupplierFormData) => ({
      ...prev,
      [field]: value,
    }));
    if (supplierFormErrors[field]) {
      setSupplierFormErrors(
        (prev: Partial<Record<keyof SupplierFormData, string>>) => ({
          ...prev,
          [field]: undefined,
        }),
      );
    }
  };
  const { data: banksData } = useGetAllQuery({
    path: "accounting/banks",
    limit: 1000,
  });
  // Company profile — auto-selected (single-company ERP)
  const { data: companyData } = useGetAllQuery({
    path: "company-profiles",
    limit: 10,
  });

  const accounts = (accountsData?.data || []) as any[];
  const buyers = (buyersData?.data || []) as any[];
  const suppliers = (suppliersData?.data || []) as any[];
  const banks = (banksData?.data || []) as any[];
  const companyProfileId: string =
    ((companyData as any)?.data?.[0]?.id as string) ?? "";

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JournalFormValues>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category: "JOURNAL",
      lines: [
        { accountHeadId: "", type: "DEBIT", amount: 0 },
        { accountHeadId: "", type: "CREDIT", amount: 0 },
      ],
      companyProfileId: "", // will be set via useEffect once company-profiles loads
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });
  const activeCategory = watch("category");
  // useWatch gives a live subscription on nested array values — fixes stale
  // snapshot issue where watch("lines") wouldn't recompute on typed input.
  const watchLines = useWatch({ control, name: "lines" });

  // Auto-set companyProfileId as soon as it loads from API
  useEffect(() => {
    if (companyProfileId) {
      setValue("companyProfileId", companyProfileId);
    }
  }, [companyProfileId, setValue]);

  // Guarded append: safe against StrictMode double-fire
  const handleAddLine = useCallback(() => {
    if (isAppendingRef.current) return;
    isAppendingRef.current = true;
    append({ accountHeadId: "", type: "DEBIT", amount: 0, bankId: undefined });
    setTimeout(() => {
      isAppendingRef.current = false;
    }, 50);
  }, [append]);

  const totals = useMemo(() => {
    return watchLines.reduce(
      (acc, line) => {
        const amt = Number(line.amount) || 0;
        if (line.type === "DEBIT") acc.debit += amt;
        else acc.credit += amt;
        return acc;
      },
      { debit: 0, credit: 0 },
    );
  }, [watchLines]);

  const isBalanced = totals.debit === totals.credit && totals.debit > 0;

  const onSubmit: SubmitHandler<JournalFormValues> = async (data) => {
    if (!isBalanced) {
      notify.error("Voucher is not balanced. Debits must equal Credits.");
      return;
    }
    try {
      await postEntry({
        path: "accounting/journal-entries",
        body: data,
        invalidate: ["accounting/journal-entries"],
      }).unwrap();

      notify.success("Journal entry saved as DRAFT successfully.");
      router.push("/accounting/daily-bookkeeping");
    } catch (error: any) {
      notify.error(
        error?.data?.error?.message ||
          error?.data?.message ||
          "Could not save the journal entry. Please try again.",
      );
    }
  };

  const currentConfig = categoryConfigs[activeCategory];

  return (
    <Container className="pb-32 max-w-[1200px]!">
      {/* ── Standard PageHeader ─────────────────────────────────────────── */}
      <PageHeader
        title="New Journal Entry"
        breadcrumbItems={[
          { label: "Accounting", href: "/accounting/overview" },
          {
            label: "Daily Bookkeeping",
            href: "/accounting/daily-bookkeeping",
          },
          { label: "New Entry" },
        ]}
        backHref="/accounting/daily-bookkeeping"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              onClick={() => router.back()}
            >
              Discard
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isPosting || !isBalanced}
              className={cn(
                "transition-all",
                isBalanced
                  ? "bg-black text-white hover:bg-black/90"
                  : "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed",
              )}
            >
              {isPosting
                ? "Saving..."
                : isBalanced
                  ? "Save as Draft"
                  : "Voucher Unbalanced"}
            </Button>
          </div>
        }
      />

      <div className="mt-8">
        <Tabs
          value={activeCategory}
          onValueChange={(v) => {
            setValue("category", v as any);
            const defaultReceivable = accounts.find(
              (a) =>
                a.type === "ASSET" &&
                (a.name.toLowerCase().includes("receivable") ||
                  a.name.toLowerCase().includes("reachable")),
            );
            const defaultPayable = accounts.find(
              (a) =>
                a.type === "LIABILITY" &&
                a.name.toLowerCase().includes("payable"),
            );

            if (v === "RECEIPT") {
              setValue("lines", [
                {
                  accountHeadId: "",
                  type: "DEBIT",
                  amount: 0,
                  bankId: undefined,
                },
                {
                  accountHeadId: defaultReceivable?.id || "",
                  type: "CREDIT",
                  amount: 0,
                  bankId: undefined,
                },
              ]);
            } else if (v === "PAYMENT") {
              setValue("lines", [
                {
                  accountHeadId: defaultPayable?.id || "",
                  type: "DEBIT",
                  amount: 0,
                  bankId: undefined,
                },
                {
                  accountHeadId: "",
                  type: "CREDIT",
                  amount: 0,
                  bankId: undefined,
                },
              ]);
            } else {
              setValue("lines", [
                {
                  accountHeadId: "",
                  type: "DEBIT",
                  amount: 0,
                  bankId: undefined,
                },
                {
                  accountHeadId: "",
                  type: "CREDIT",
                  amount: 0,
                  bankId: undefined,
                },
              ]);
            }
          }}
          className="w-full"
        >
          <TabsList className="tab-premium-list w-full! max-w-5xl mx-auto overflow-x-auto flex-nowrap">
            {Object.entries(categoryConfigs).map(([key, config]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="tab-premium-trigger flex-1 min-w-fit"
              >
                <Flex className="items-center gap-2">
                  <config.icon className="size-4" />
                  <span className="font-bold text-[10px] uppercase tracking-[0.2em]">
                    {config.label}
                  </span>
                </Flex>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* ── Left Column: Voucher Form ─────────────────────────────────── */}
        <div className="xl:col-span-8 space-y-6">
          {/* Card: Entry Details */}
          <Card className="border-none overflow-hidden shadow-2xl shadow-zinc-200/50 bg-white rounded-2xl">
            <CardHeader className="bg-zinc-900 py-6 px-8 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                    {currentConfig && <currentConfig.icon size={20} />}
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5">
                      VOUCHER CLASSIFICATION
                    </p>
                    <h3 className="text-2xl font-black text-white tracking-tighter italic">
                      {currentConfig?.label}
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5">
                    FISCAL PERIOD
                  </p>
                  <p className="text-white font-black tracking-tighter italic">
                    FY-{new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              {/* Date & Narration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-zinc-50/50 border border-zinc-100">
                <div className="space-y-1.5">
                  <RequiredLabel>Entry Date</RequiredLabel>
                  <Input
                    type="date"
                    {...register("date")}
                    className="bg-white h-11 rounded-xl border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 transition-all"
                  />
                  <FieldError message={errors.date?.message} />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <OptionalLabel>Transaction Narration</OptionalLabel>
                  <Input
                    {...register("narration")}
                    placeholder="e.g. Received payment from buyer for Invoice #1001"
                    className="bg-white h-11 rounded-xl border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 transition-all"
                  />
                  <HelperText>
                    A brief description of this transaction. Helps during audit.
                  </HelperText>
                </div>
              </div>

              {/* Buyer sub-ledger (BUYER_DUE / RECEIPT only) */}
              {(activeCategory === "BUYER_DUE" ||
                activeCategory === "RECEIPT") && (
                <div className="space-y-1.5">
                  <OptionalLabel>Buyer</OptionalLabel>
                  <Controller
                    name="buyerId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) =>
                          field.onChange(val === "__none__" ? undefined : val)
                        }
                        value={field.value || "__none__"}
                      >
                        <SelectTrigger className="bg-white h-11 rounded-xl border-zinc-200">
                          <SelectValue placeholder="Select a buyer..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">
                            — No buyer attached —
                          </SelectItem>
                          {buyers.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.name}
                              {b.location ? ` (${b.location})` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <HelperText>
                    Link this entry to a specific buyer for sub-ledger tracking.
                    Leave blank for general entries.
                  </HelperText>
                </div>
              )}

              {/* Supplier sub-ledger (SUPPLIER_DUE / PAYMENT only) */}
              {(activeCategory === "SUPPLIER_DUE" ||
                activeCategory === "PAYMENT") && (
                <div className="space-y-1.5">
                  <OptionalLabel>Supplier</OptionalLabel>
                  <Controller
                    name="supplierId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) => {
                          if (val === "__create__") {
                            setIsSupplierFormOpen(true);
                            // Reset the inner value so it doesn't stay stuck on "__create__"
                            field.onChange(field.value);
                          } else {
                            field.onChange(
                              val === "__none__" ? undefined : val,
                            );
                          }
                        }}
                        value={field.value || "__none__"}
                      >
                        <SelectTrigger className="bg-white h-11 rounded-xl border-zinc-200">
                          <SelectValue placeholder="Select a supplier..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">
                            — No supplier attached —
                          </SelectItem>
                          <SelectItem
                            value="__create__"
                            className="text-indigo-600 font-medium"
                          >
                            + Create New Supplier
                          </SelectItem>
                          {suppliers.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <HelperText>
                    Link this entry to a specific supplier for sub-ledger
                    tracking. Leave blank for general entries.
                  </HelperText>
                </div>
              )}

              {/* ── Voucher Lines ─────────────────────────────────────── */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                      <FileText size={14} />
                      Voucher Lines
                      <span className="text-destructive">*</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Minimum 2 lines required. Total debits must equal total
                      credits.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddLine}
                    className="gap-2 border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  >
                    <Plus size={14} />
                    Add Line
                  </Button>
                </div>

                {/* Lines */}
                <div className="space-y-4">
                  {fields.map((field, index) => {
                    // Determine if this line should be fully locked to AR/AP
                    const isLockedCredit =
                      activeCategory === "RECEIPT" && index === 1;
                    const isLockedDebit =
                      activeCategory === "PAYMENT" && index === 0;
                    const isLineLocked = isLockedCredit || isLockedDebit;

                    return (
                      <div
                        key={field.id}
                        className="grid grid-cols-12 gap-4 items-start p-6 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-100 transition-all duration-300"
                      >
                        {/* Account Head — required */}
                        <div className="col-span-12 md:col-span-5 space-y-1.5">
                          <RequiredLabel>Ledger Account</RequiredLabel>
                          <Controller
                            name={`lines.${index}.accountHeadId`}
                            control={control}
                            render={({ field: selectField }) => (
                              <Select
                                onValueChange={selectField.onChange}
                                value={selectField.value || ""}
                                disabled={isLineLocked}
                              >
                                <SelectTrigger
                                  className={cn(
                                    "bg-white h-11 rounded-xl border-zinc-200",
                                    isLineLocked &&
                                      "opacity-60 cursor-not-allowed bg-zinc-50",
                                    errors.lines?.[index]?.accountHeadId &&
                                      "border-red-400 focus:ring-red-400",
                                  )}
                                >
                                  <SelectValue placeholder="Select account head..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-[240px]">
                                  {accounts.map((a) => (
                                    <SelectItem key={a.id} value={a.id}>
                                      {a.name}
                                      {a.code ? ` — ${a.code}` : ""}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          <FieldError
                            message={
                              errors.lines?.[index]?.accountHeadId?.message
                            }
                          />
                        </div>

                        {/* Debit / Credit toggle — required */}
                        <div className="col-span-6 md:col-span-3 space-y-1.5">
                          <RequiredLabel>Entry Side</RequiredLabel>
                          <div className="flex h-11 rounded-xl overflow-hidden border border-zinc-200">
                            <button
                              type="button"
                              onClick={() => {
                                if (!isLineLocked)
                                  setValue(`lines.${index}.type`, "DEBIT");
                              }}
                              disabled={isLineLocked}
                              className={cn(
                                "flex-1 h-full text-[10px] font-black uppercase tracking-widest transition-all",
                                watchLines[index]?.type === "DEBIT"
                                  ? "bg-zinc-900 text-white"
                                  : "bg-white text-zinc-400 hover:bg-zinc-50",
                                isLineLocked &&
                                  watchLines[index]?.type !== "DEBIT"
                                  ? "opacity-30 cursor-not-allowed hidden"
                                  : "",
                                isLineLocked &&
                                  watchLines[index]?.type === "DEBIT"
                                  ? "cursor-not-allowed opacity-80"
                                  : "",
                              )}
                            >
                              DR
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!isLineLocked)
                                  setValue(`lines.${index}.type`, "CREDIT");
                              }}
                              disabled={isLineLocked}
                              className={cn(
                                "flex-1 h-full text-[10px] font-black uppercase tracking-widest transition-all",
                                watchLines[index]?.type === "CREDIT"
                                  ? "bg-zinc-900 text-white"
                                  : "bg-white text-zinc-400 hover:bg-zinc-50",
                                isLineLocked &&
                                  watchLines[index]?.type !== "CREDIT"
                                  ? "opacity-30 cursor-not-allowed hidden"
                                  : "",
                                isLineLocked &&
                                  watchLines[index]?.type === "CREDIT"
                                  ? "cursor-not-allowed opacity-80"
                                  : "",
                              )}
                            >
                              CR
                            </button>
                          </div>
                        </div>

                        {/* Amount — required */}
                        <div className="col-span-4 md:col-span-3 space-y-1.5">
                          <RequiredLabel>Amount (৳)</RequiredLabel>
                          <Input
                            type="number"
                            step="any"
                            placeholder="0.00"
                            {...register(`lines.${index}.amount`, {
                              valueAsNumber: true,
                            })}
                            className={cn(
                              "font-mono bg-white h-11 rounded-xl border-zinc-200",
                              errors.lines?.[index]?.amount &&
                                "border-red-400 focus:ring-red-400",
                            )}
                          />
                          <FieldError
                            message={errors.lines?.[index]?.amount?.message}
                          />
                        </div>

                        {/* Remove button */}
                        <div className="col-span-2 md:col-span-1 pt-6 flex justify-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 2 || isLineLocked}
                            className="h-9 w-9 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-20 transition-all"
                            title="Remove this line"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>

                        {/* Bank sub-ledger — optional, full row */}
                        <div className="col-span-12 pt-2 border-t border-zinc-50">
                          <div className="flex items-center gap-3">
                            <OptionalLabel>Bank Sub-ledger</OptionalLabel>
                            <div className="w-56">
                              <Controller
                                name={`lines.${index}.bankId`}
                                control={control}
                                render={({ field: bankField }) => (
                                  <Select
                                    onValueChange={(val) =>
                                      bankField.onChange(
                                        val === "__none__" ? undefined : val,
                                      )
                                    }
                                    value={bankField.value || "__none__"}
                                  >
                                    <SelectTrigger className="h-8 bg-white text-xs">
                                      <SelectValue placeholder="N/A" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="__none__">
                                        N/A — Not a bank transaction
                                      </SelectItem>
                                      {banks.map((b) => (
                                        <SelectItem key={b.id} value={b.id}>
                                          {b.bankName}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>
                            <span className="text-[11px] text-zinc-400">
                              Only fill if this line involves a specific bank
                              account.
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column: Balance Status & Category ───────────────────── */}
        <div className="xl:col-span-4 space-y-6 sticky top-8">
          {/* Balance Checker */}
          <Card className="border-none overflow-hidden shadow-2xl shadow-zinc-200/50 bg-white rounded-2xl">
            <CardHeader className="bg-zinc-900 py-6 px-8 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                  <Scale size={20} />
                </div>
                <div>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5">
                    Internal Controls
                  </p>
                  <h3 className="text-xl font-black text-white tracking-tight italic">
                    Voucher Balance
                  </h3>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-zinc-100">
                  <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                    Total Debits
                  </span>
                  <span className="font-mono font-black text-xl text-zinc-900 italic">
                    ৳ {totals.debit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-zinc-100">
                  <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                    Total Credits
                  </span>
                  <span className="font-mono font-black text-xl text-zinc-900 italic">
                    ৳ {totals.credit.toLocaleString()}
                  </span>
                </div>

                <div
                  className={cn(
                    "p-6 rounded-2xl border transition-all duration-500",
                    isBalanced
                      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                      : "bg-rose-50 border-rose-100 text-rose-700",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "size-10 rounded-xl flex items-center justify-center shadow-sm",
                        isBalanced
                          ? "bg-emerald-500 text-white"
                          : "bg-rose-500 text-white",
                      )}
                    >
                      {isBalanced ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <AlertTriangle size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none mb-1">
                        Status: {isBalanced ? "Balanced" : "Variance Detected"}
                      </p>
                      <p className="text-lg font-black tracking-tight italic">
                        {isBalanced
                          ? "Audit Compliant"
                          : `৳ ${Math.abs(totals.debit - totals.credit).toLocaleString()} variance`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guideline note */}
          <div className="bg-zinc-50/50 border border-zinc-100 rounded-[1.5rem] p-6">
            <div className="flex items-start gap-3">
              <Scale className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-zinc-700 mb-1">
                  How it works
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Entries are saved as{" "}
                  <span className="font-semibold text-zinc-700">DRAFT</span> and
                  do not affect account balances until they are formally{" "}
                  <span className="font-semibold text-zinc-700">POSTED</span>{" "}
                  through the bookkeeping command center.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supplier Creation Modal */}
      <SupplierForm
        open={isSupplierFormOpen}
        mode="create"
        data={supplierFormData}
        errors={supplierFormErrors}
        onClose={() => {
          setIsSupplierFormOpen(false);
          setSupplierFormData(emptySupplier);
          setSupplierFormErrors({});
        }}
        onChange={handleSupplierFormChange}
        onSubmit={handleCreateSupplierSubmit}
      />
    </Container>
  );
}
