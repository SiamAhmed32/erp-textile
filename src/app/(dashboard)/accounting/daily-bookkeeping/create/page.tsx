"use client";

import {
  Container,
} from "@/components/reusables";
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
import { cn } from "@/lib/utils";
import { useGetAllQuery, usePostMutation } from "@/store/services/commonApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  ArrowLeft,
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
  Undo2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

/* ─── Validation Schema ────────────────────────────────────── */
const journalEntrySchema = z.object({
  date: z.string().nonempty("Date is required"),
  category: z.enum(["BUYER_DUE", "RECEIPT", "SUPPLIER_DUE", "PAYMENT", "JOURNAL", "CONTRA"]),
  narration: z.string().optional(),
  buyerId: z.string().uuid().optional(),
  supplierId: z.string().uuid().optional(),
  companyProfileId: z.string().uuid(),
  lines: z.array(z.object({
    accountHeadId: z.string().uuid("Required"),
    type: z.enum(["DEBIT", "CREDIT"]),
    amount: z.number().positive("Must be > 0"),
    bankId: z.string().uuid().optional(),
  })).min(2, "At least 2 lines required")
});

type JournalFormValues = z.infer<typeof journalEntrySchema>;

/* ─── UI Constants ────────────────────────────────────────── */
const categoryConfigs: Record<string, { label: string; icon: any; color: string; desc: string }> = {
  BUYER_DUE: { label: "Buyer Due", icon: Bookmark, color: "amber", desc: "Recognize sales revenue and buyer obligation." },
  RECEIPT: { label: "Receipt", icon: Receipt, color: "emerald", desc: "Record payment received from a buyer." },
  SUPPLIER_DUE: { label: "Supplier Due", icon: Building, color: "purple", desc: "Recognize purchase expense and supplier obligation." },
  PAYMENT: { label: "Payment", icon: Send, color: "indigo", desc: "Record payment sent to a supplier." },
  JOURNAL: { label: "Journal", icon: FileText, color: "zinc", desc: "Standard adjustment for payroll, depreciation, etc." },
  CONTRA: { label: "Contra", icon: Undo2, color: "sky", desc: "Transfer funds between your own cash and bank accounts." }
};

export default function BookkeepingCreatePage() {
  const router = useRouter();
  const [postEntry, { isLoading: isPosting }] = usePostMutation();

  // ── Ref guard: prevents StrictMode double-firing append ──
  const isAppendingRef = useRef(false);

  // Fetch required data
  const { data: accountsData } = useGetAllQuery({ path: "accounting/accountHeads", limit: 1000 });
  const { data: buyersData } = useGetAllQuery({ path: "buyers", limit: 1000 });
  const { data: suppliersData } = useGetAllQuery({ path: "suppliers", limit: 1000 });
  const { data: banksData } = useGetAllQuery({ path: "accounting/banks", limit: 1000 });

  const accounts = (accountsData?.data || []) as any[];
  const buyers = (buyersData?.data || []) as any[];
  const suppliers = (suppliersData?.data || []) as any[];
  const banks = (banksData?.data || []) as any[];

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<JournalFormValues>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category: "JOURNAL",
      lines: [
        { accountHeadId: "", type: "DEBIT", amount: 0 },
        { accountHeadId: "", type: "CREDIT", amount: 0 }
      ],
      companyProfileId: "3d0afbda-6b2b-4013-895c-7680da86376e"
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });
  const activeCategory = watch("category");
  const watchLines = watch("lines");

  // ── Guarded append: safe against StrictMode double-fire ──
  const handleAddLine = useCallback(() => {
    if (isAppendingRef.current) return;
    isAppendingRef.current = true;
    append({ accountHeadId: "", type: "DEBIT", amount: 0, bankId: undefined });
    // Release the guard after a tick
    setTimeout(() => {
      isAppendingRef.current = false;
    }, 50);
  }, [append]);

  const totals = useMemo(() => {
    return watchLines.reduce((acc, line) => {
      const amt = Number(line.amount) || 0;
      if (line.type === "DEBIT") acc.debit += amt;
      else acc.credit += amt;
      return acc;
    }, { debit: 0, credit: 0 });
  }, [watchLines]);

  const isBalanced = totals.debit === totals.credit && totals.debit > 0;

  const onSubmit: SubmitHandler<JournalFormValues> = async (data) => {
    if (!isBalanced) {
      toast.error("Voucher is not balanced. Debits must equal Credits.");
      return;
    }

    try {
      await postEntry({
        path: "accounting/journal-entries",
        body: data,
        invalidate: ["accounting/journal-entries"]
      }).unwrap();

      toast.success("Voucher created as draft successfully");
      router.push("/accounting/daily-bookkeeping");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to establish journal entry.");
    }
  };

  const currentConfig = categoryConfigs[activeCategory];

  return (
    <Container className="py-8 space-y-10 !max-w-[1200px] pb-32 font-outfit">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Button variant="ghost" size="sm" asChild className="text-zinc-500 hover:text-zinc-900 -ml-2">
            <Link href="/accounting/daily-bookkeeping">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Bookkeeping
            </Link>
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px]">
              <Scale className="w-3 h-3" />
              <span>Financial Posting Engine</span>
            </div>
            <h1 className="text-5xl font-black text-zinc-900 tracking-tight italic">New Voucher</h1>
            <p className="text-zinc-500 text-sm font-medium">Draft a new transaction according to double-entry standards.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 px-8 rounded-2xl border-zinc-200 font-bold text-zinc-600 hover:bg-zinc-50" onClick={() => router.back()}>
            Discard
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isPosting}
            className={cn(
              "h-12 px-10 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl",
              isBalanced ? "bg-zinc-900 text-white hover:bg-black" : "bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200"
            )}
          >
            {isPosting ? "Posting..." : isBalanced ? "Post Draft Voucher" : "Voucher Unbalanced"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* Left Column: Voucher Details (8 cols) */}
        <div className="xl:col-span-8 space-y-8">

          <Card className="rounded-[2.5rem] border-zinc-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-zinc-900 border-b border-white/5 py-8 px-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                    {currentConfig && <currentConfig.icon size={24} />}
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Transaction Classification</p>
                    <h2 className="text-2xl font-black text-white italic">{currentConfig?.label} Entry</h2>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Period Context</p>
                  <p className="text-white font-black italic">{new Date().getFullYear()} Global Ledger</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-10">

              {/* ── Classification Context ──────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Entry Date</Label>
                  <Input type="date" {...register("date")} className="h-12 bg-white rounded-xl border-zinc-200 font-bold" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Transaction Narration</Label>
                  <Input {...register("narration")} placeholder="Professional explanation of this ledger entry..." className="h-12 bg-white rounded-xl border-zinc-200 font-medium" />
                </div>
              </div>

              {/* ── Sub-Ledger Logic ───────────────────────────────── */}
              {(activeCategory === "BUYER_DUE" || activeCategory === "RECEIPT") && (
                <div className="space-y-3">
                  <Label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Info size={14} className="text-zinc-900" /> Attached Buyer Entity
                  </Label>
                  <Controller
                    name="buyerId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) => field.onChange(val === "__none__" ? undefined : val)}
                        value={field.value || "__none__"}
                      >
                        <SelectTrigger className="h-12 bg-white rounded-xl border-zinc-200 font-medium">
                          <SelectValue placeholder="Select Buyer Profile..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-zinc-200 shadow-xl">
                          <SelectItem value="__none__" className="text-zinc-400 italic text-xs">
                            — No Buyer Selected —
                          </SelectItem>
                          {buyers.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.name} ({b.location})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}

              {(activeCategory === "SUPPLIER_DUE" || activeCategory === "PAYMENT") && (
                <div className="space-y-3">
                  <Label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Info size={14} className="text-zinc-900" /> Attached Supplier Entity
                  </Label>
                  <Controller
                    name="supplierId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) => field.onChange(val === "__none__" ? undefined : val)}
                        value={field.value || "__none__"}
                      >
                        <SelectTrigger className="h-12 bg-white rounded-xl border-zinc-200 font-medium">
                          <SelectValue placeholder="Select Supplier Profile..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-zinc-200 shadow-xl">
                          <SelectItem value="__none__" className="text-zinc-400 italic text-xs">
                            — No Supplier Selected —
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
                </div>
              )}

              {/* ── Ledger Items (The Grid) ────────────────────────── */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} /> Voucher Lines
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleAddLine}
                    className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-zinc-900 gap-2"
                  >
                    <Plus size={14} /> Add Segment
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="group relative grid grid-cols-12 gap-4 items-end p-4 rounded-3xl border border-zinc-100 bg-white hover:border-zinc-300 transition-all">

                      {/* Account Selection — shadcn Select */}
                      <div className="col-span-12 md:col-span-5 space-y-2">
                        <Label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest px-1">Ledger Account</Label>
                        <Controller
                          name={`lines.${index}.accountHeadId`}
                          control={control}
                          render={({ field: selectField }) => (
                            <Select
                              onValueChange={selectField.onChange}
                              value={selectField.value || ""}
                            >
                              <SelectTrigger className="h-12 rounded-xl border-zinc-200 font-medium bg-white">
                                <SelectValue placeholder="Account Head..." />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-zinc-200 shadow-xl max-h-[240px]">
                                {accounts.map((a) => (
                                  <SelectItem key={a.id} value={a.id}>
                                    {a.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.lines?.[index]?.accountHeadId && (
                          <p className="text-[10px] text-red-500 font-bold px-1">
                            {errors.lines[index]?.accountHeadId?.message}
                          </p>
                        )}
                      </div>

                      {/* Side Toggle */}
                      <div className="col-span-12 md:col-span-3 space-y-2">
                        <Label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest px-1">Entry Side</Label>
                        <div className="flex rounded-xl overflow-hidden border border-zinc-200">
                          <button
                            type="button"
                            onClick={() => setValue(`lines.${index}.type`, "DEBIT")}
                            className={cn("flex-1 h-12 text-[10px] font-black uppercase tracking-widest transition-all", watchLines[index]?.type === "DEBIT" ? "bg-zinc-900 text-white" : "bg-white text-zinc-400 hover:bg-zinc-50")}
                          >DR</button>
                          <button
                            type="button"
                            onClick={() => setValue(`lines.${index}.type`, "CREDIT")}
                            className={cn("flex-1 h-12 text-[10px] font-black uppercase tracking-widest transition-all", watchLines[index]?.type === "CREDIT" ? "bg-zinc-900 text-white" : "bg-white text-zinc-400 hover:bg-zinc-50")}
                          >CR</button>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="col-span-10 md:col-span-3 space-y-2">
                        <Label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest px-1">Value (৳)</Label>
                        <Input
                          type="number"
                          step="any"
                          {...register(`lines.${index}.amount`, { valueAsNumber: true })}
                          className="h-12 rounded-xl border-zinc-200 font-mono font-black italic text-lg"
                        />
                        {errors.lines?.[index]?.amount && (
                          <p className="text-[10px] text-red-500 font-bold px-1">
                            {errors.lines[index]?.amount?.message}
                          </p>
                        )}
                      </div>

                      {/* Remove */}
                      <div className="col-span-2 md:col-span-1 flex justify-center pb-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 2}
                          className="h-12 w-12 rounded-xl text-zinc-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-20 transition-all"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>

                      {/* Bank Sub-ledger — shadcn Select */}
                      <div className="col-span-12 pt-2 border-t border-zinc-50 flex items-center gap-4">
                        <div className="flex-1 flex gap-4 items-center">
                          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest whitespace-nowrap">Bank Sub-ledger:</span>
                          <div className="w-64">
                            <Controller
                              name={`lines.${index}.bankId`}
                              control={control}
                              render={({ field: bankField }) => (
                                <Select
                                  onValueChange={(val) => bankField.onChange(val === "__none__" ? undefined : val)}
                                  value={bankField.value || "__none__"}
                                >
                                  <SelectTrigger className="h-9 rounded-lg border-zinc-200 bg-white text-xs font-medium text-zinc-500">
                                    <SelectValue placeholder="N/A" />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-xl border-zinc-200 shadow-xl">
                                    <SelectItem value="__none__" className="text-zinc-400 italic text-xs">
                                      N/A
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
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* Right Column: Summaries & Controls (4 cols) */}
        <div className="xl:col-span-4 space-y-8">

          <Card className="rounded-[2.5rem] bg-zinc-900 text-white p-10 space-y-8 shadow-2xl shadow-zinc-200 sticky top-10">
            <div className="space-y-1">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Double Entry Verification</p>
              <h3 className="text-3xl font-black italic">Voucher Status</h3>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Total Debits</span>
                <span className="text-2xl font-black font-mono italic">৳ {totals.debit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Total Credits</span>
                <span className="text-2xl font-black font-mono italic">৳ {totals.credit.toLocaleString()}</span>
              </div>

              <div className={cn(
                "p-6 rounded-[2rem] border transition-all duration-700",
                isBalanced ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-zinc-800 border-zinc-700 text-zinc-400"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn("size-10 rounded-xl flex items-center justify-center", isBalanced ? "bg-emerald-500 text-white" : "bg-zinc-700")}>
                    {isBalanced ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">{isBalanced ? "Voucher Balanced" : "Balance Mismatch"}</p>
                    <p className="text-lg font-black italic">{isBalanced ? "Verification Success" : `৳ ${Math.abs(totals.debit - totals.credit).toLocaleString()} Variance`}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-[10px] font-bold text-zinc-500 leading-relaxed uppercase tracking-widest">Entry Templates</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(categoryConfigs).map(([key, config]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setValue("category", key as any)}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all active:scale-95 group",
                      activeCategory === key ? "bg-white border-white text-zinc-900 shadow-xl" : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    )}
                  >
                    <config.icon size={18} className={cn("mb-3", activeCategory === key ? "text-zinc-900" : "text-zinc-500 group-hover:text-zinc-300")} />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">{config.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="bg-zinc-50 border border-zinc-200 rounded-[2.5rem] p-10 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Standard Guideline</h4>
              <Info size={14} className="text-zinc-400" />
            </div>
            <p className="text-[11px] font-medium text-zinc-500 leading-relaxed italic">
              Entries are created as <span className="text-zinc-900 font-black uppercase tracking-widest">DRAFT</span>.
              They do not impact the general ledger balances until they are formally
              <span className="text-zinc-900 font-black uppercase tracking-widest"> POSTED</span> through the audit trail or bookkeeping command center.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
