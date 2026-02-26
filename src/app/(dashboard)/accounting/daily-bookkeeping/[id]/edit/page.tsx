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
import { cn } from "@/lib/utils";
import {
    useGetAllQuery,
    useGetByIdQuery,
    usePatchMutation,
} from "@/store/services/commonApi";
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
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
    Controller,
    SubmitHandler,
    useFieldArray,
    useForm,
    useWatch,
} from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

/* ─── Schema (mirrors backend update validation) ─────────────────────────── */
const editSchema = z.object({
    date: z.string().nonempty("Date is required"),
    category: z.enum([
        "BUYER_DUE",
        "RECEIPT",
        "SUPPLIER_DUE",
        "PAYMENT",
        "JOURNAL",
        "CONTRA",
    ]),
    narration: z.string().optional(),
    buyerId: z.string().uuid().optional(),
    supplierId: z.string().uuid().optional(),
    lines: z
        .array(
            z.object({
                accountHeadId: z.string().uuid("Account head is required"),
                type: z.enum(["DEBIT", "CREDIT"]),
                amount: z.number().positive("Must be greater than 0"),
                bankId: z.string().uuid().optional(),
            })
        )
        .min(2, "At least 2 lines required"),
});

type EditFormValues = z.infer<typeof editSchema>;

const API_PATH = "accounting/journal-entries";

const categoryConfigs: Record<
    string,
    { label: string; icon: any; desc: string }
> = {
    BUYER_DUE: { label: "Buyer Due", icon: Bookmark, desc: "Sales revenue and buyer obligation." },
    RECEIPT: { label: "Receipt", icon: Receipt, desc: "Payment received from a buyer." },
    SUPPLIER_DUE: { label: "Supplier Due", icon: Building, desc: "Purchase expense and supplier obligation." },
    PAYMENT: { label: "Payment", icon: Send, desc: "Payment sent to a supplier." },
    JOURNAL: { label: "Journal", icon: FileText, desc: "General adjustment entry." },
    CONTRA: { label: "Contra", icon: Undo2, desc: "Transfer between cash and bank accounts." },
};

/* ─── Label helpers ─────────────────────────────────────────────────────── */
function RequiredLabel({ children }: { children: React.ReactNode }) {
    return (
        <Label className="text-xs font-semibold text-zinc-700">
            {children} <span className="text-red-500 ml-0.5">*</span>
        </Label>
    );
}
function OptionalLabel({ children }: { children: React.ReactNode }) {
    return (
        <Label className="text-xs font-semibold text-zinc-700">
            {children}{" "}
            <span className="text-zinc-400 font-normal ml-1 text-[11px]">(optional)</span>
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
        <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            {message}
        </p>
    );
}

/* ─── Page ─────────────────────────────────────────────────────────────── */
export default function BookkeepingEditPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const isAppendingRef = useRef(false);

    const [patchEntry, { isLoading: isSaving }] = usePatchMutation();

    // Fetch the existing entry
    const { data: entryData, isLoading: isLoadingEntry } = useGetByIdQuery({
        path: API_PATH,
        id,
    });
    const entry = entryData?.data as any;

    // Fetch sub-ledger data
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
        reset,
        formState: { errors },
    } = useForm<EditFormValues>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            category: "JOURNAL",
            lines: [
                { accountHeadId: "", type: "DEBIT", amount: 0 },
                { accountHeadId: "", type: "CREDIT", amount: 0 },
            ],
        },
    });

    // Once entry loads, populate the form
    useEffect(() => {
        if (!entry) return;
        reset({
            date: entry.date
                ? new Date(entry.date).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
            category: entry.category || "JOURNAL",
            narration: entry.narration || "",
            buyerId: entry.buyerId || undefined,
            supplierId: entry.supplierId || undefined,
            lines: (entry.lines || []).map((l: any) => ({
                accountHeadId: l.accountHeadId,
                type: l.type,
                amount: Number(l.amount),
                bankId: l.bankId || undefined,
            })),
        });
    }, [entry, reset]);

    const { fields, append, remove } = useFieldArray({ control, name: "lines" });
    const activeCategory = watch("category");
    const watchLines = useWatch({ control, name: "lines" });

    const handleAddLine = useCallback(() => {
        if (isAppendingRef.current) return;
        isAppendingRef.current = true;
        append({ accountHeadId: "", type: "DEBIT", amount: 0, bankId: undefined });
        setTimeout(() => { isAppendingRef.current = false; }, 50);
    }, [append]);

    const totals = useMemo(() => {
        return (watchLines || []).reduce(
            (acc, line) => {
                const amt = Number(line.amount) || 0;
                if (line.type === "DEBIT") acc.debit += amt;
                else acc.credit += amt;
                return acc;
            },
            { debit: 0, credit: 0 }
        );
    }, [watchLines]);

    const isBalanced = totals.debit === totals.credit && totals.debit > 0;

    const onSubmit: SubmitHandler<EditFormValues> = async (data) => {
        if (!isBalanced) {
            toast.error("Voucher is not balanced. Debits must equal Credits.");
            return;
        }
        try {
            await patchEntry({
                path: `${API_PATH}/${id}`,
                body: data,
                invalidate: [API_PATH],
            }).unwrap();
            toast.success("Journal entry updated successfully.");
            router.push("/accounting/daily-bookkeeping");
        } catch (err: any) {
            // POSTED entries cannot be edited — backend will reject
            toast.error(
                err?.data?.error?.message ||
                err?.data?.message ||
                "Failed to update entry."
            );
        }
    };

    if (isLoadingEntry) {
        return (
            <Container className="pb-10">
                <div className="h-64 flex items-center justify-center text-zinc-400 text-sm">
                    Loading entry...
                </div>
            </Container>
        );
    }

    // Guard: only DRAFT can be edited
    if (entry && entry.status === "POSTED") {
        return (
            <Container className="pb-10">
                <PageHeader
                    title="Edit Journal Entry"
                    breadcrumbItems={[
                        { label: "Accounting", href: "/accounting/overview" },
                        { label: "Daily Bookkeeping", href: "/accounting/daily-bookkeeping" },
                        { label: "Edit" },
                    ]}
                    backHref="/accounting/daily-bookkeeping"
                />
                <div className="flex items-start gap-3 p-5 bg-amber-50 border border-amber-200 rounded-xl mt-4">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-amber-800">
                            This entry cannot be edited
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                            Voucher <span className="font-mono font-bold">{entry.voucherNo}</span> is already POSTED
                            and is locked. To correct it, use the Reverse action from the list page.
                        </p>
                    </div>
                </div>
            </Container>
        );
    }

    const currentConfig = categoryConfigs[activeCategory];

    return (
        <Container className="pb-32 !max-w-[1200px]">
            <PageHeader
                title={`Edit — ${entry?.voucherNo || "Journal Entry"}`}
                breadcrumbItems={[
                    { label: "Accounting", href: "/accounting/overview" },
                    { label: "Daily Bookkeeping", href: "/accounting/daily-bookkeeping" },
                    { label: "Edit" },
                ]}
                backHref="/accounting/daily-bookkeeping"
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="border-zinc-200 text-zinc-600"
                            onClick={() => router.back()}
                        >
                            Discard
                        </Button>
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSaving || !isBalanced}
                            className={cn(
                                "transition-all",
                                isBalanced
                                    ? "bg-black text-white hover:bg-black/90"
                                    : "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
                            )}
                        >
                            {isSaving ? "Saving..." : isBalanced ? "Save Changes" : "Voucher Unbalanced"}
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start mt-4">
                {/* ── Left: Form ────────────────────────────────────────────────── */}
                <div className="xl:col-span-8 space-y-6">
                    <Card>
                        <CardHeader className="bg-zinc-900 rounded-t-xl py-5 px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-lg bg-white/10 flex items-center justify-center text-white">
                                        {currentConfig && <currentConfig.icon size={18} />}
                                    </div>
                                    <div>
                                        <p className="text-zinc-400 text-[10px] font-semibold uppercase tracking-widest">
                                            Editing Classification
                                        </p>
                                        <h2 className="text-lg font-bold text-white">
                                            {currentConfig?.label} Entry
                                        </h2>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-zinc-400 text-[10px] font-semibold uppercase tracking-widest">
                                        Fiscal Year
                                    </p>
                                    <p className="text-white font-semibold">
                                        {new Date().getFullYear()}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6">
                            {/* Date & Narration */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-xl bg-zinc-50 border border-zinc-100">
                                <div className="space-y-1.5">
                                    <RequiredLabel>Entry Date</RequiredLabel>
                                    <Input type="date" {...register("date")} className="bg-white" />
                                    <FieldError message={errors.date?.message} />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <OptionalLabel>Transaction Narration</OptionalLabel>
                                    <Input
                                        {...register("narration")}
                                        placeholder="e.g. Received payment from buyer for Invoice #1001"
                                        className="bg-white"
                                    />
                                    <HelperText>
                                        A brief description that helps during audit.
                                    </HelperText>
                                </div>
                            </div>

                            {/* Buyer sub-ledger */}
                            {(activeCategory === "BUYER_DUE" || activeCategory === "RECEIPT") && (
                                <div className="space-y-1.5">
                                    <OptionalLabel>Buyer</OptionalLabel>
                                    <Controller
                                        name="buyerId"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={(val) => field.onChange(val === "__none__" ? undefined : val)}
                                                value={field.value || "__none__"}
                                            >
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="Select a buyer..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__none__">— No buyer attached —</SelectItem>
                                                    {buyers.map((b) => (
                                                        <SelectItem key={b.id} value={b.id}>
                                                            {b.name}{b.location ? ` (${b.location})` : ""}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <HelperText>Link to a buyer for sub-ledger tracking.</HelperText>
                                </div>
                            )}

                            {/* Supplier sub-ledger */}
                            {(activeCategory === "SUPPLIER_DUE" || activeCategory === "PAYMENT") && (
                                <div className="space-y-1.5">
                                    <OptionalLabel>Supplier</OptionalLabel>
                                    <Controller
                                        name="supplierId"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={(val) => field.onChange(val === "__none__" ? undefined : val)}
                                                value={field.value || "__none__"}
                                            >
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="Select a supplier..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__none__">— No supplier attached —</SelectItem>
                                                    {suppliers.map((s) => (
                                                        <SelectItem key={s.id} value={s.id}>
                                                            {s.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <HelperText>Link to a supplier for sub-ledger tracking.</HelperText>
                                </div>
                            )}

                            {/* Voucher Lines */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                                            <FileText size={14} />
                                            Voucher Lines
                                            <span className="text-red-500">*</span>
                                        </h3>
                                        <p className="text-xs text-zinc-400 mt-0.5">
                                            Minimum 2 lines. Total debits must equal total credits.
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

                                <div className="space-y-3">
                                    {fields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="grid grid-cols-12 gap-3 items-start p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-colors"
                                        >
                                            {/* Account Head */}
                                            <div className="col-span-12 md:col-span-5 space-y-1.5">
                                                <RequiredLabel>Ledger Account</RequiredLabel>
                                                <Controller
                                                    name={`lines.${index}.accountHeadId`}
                                                    control={control}
                                                    render={({ field: sf }) => (
                                                        <Select onValueChange={sf.onChange} value={sf.value || ""}>
                                                            <SelectTrigger
                                                                className={cn(
                                                                    "bg-white",
                                                                    errors.lines?.[index]?.accountHeadId && "border-red-400"
                                                                )}
                                                            >
                                                                <SelectValue placeholder="Select account head..." />
                                                            </SelectTrigger>
                                                            <SelectContent className="max-h-[240px]">
                                                                {accounts.map((a) => (
                                                                    <SelectItem key={a.id} value={a.id}>
                                                                        {a.name}{a.code ? ` — ${a.code}` : ""}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                <FieldError message={errors.lines?.[index]?.accountHeadId?.message} />
                                            </div>

                                            {/* Dr / Cr toggle */}
                                            <div className="col-span-6 md:col-span-3 space-y-1.5">
                                                <RequiredLabel>Entry Side</RequiredLabel>
                                                <div className="flex rounded-lg overflow-hidden border border-zinc-200">
                                                    {(["DEBIT", "CREDIT"] as const).map((side) => (
                                                        <button
                                                            key={side}
                                                            type="button"
                                                            onClick={() => setValue(`lines.${index}.type`, side)}
                                                            className={cn(
                                                                "flex-1 h-9 text-xs font-semibold uppercase tracking-wider transition-all",
                                                                watchLines?.[index]?.type === side
                                                                    ? "bg-zinc-900 text-white"
                                                                    : "bg-white text-zinc-400 hover:bg-zinc-50"
                                                            )}
                                                        >
                                                            {side === "DEBIT" ? "Dr" : "Cr"}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Amount */}
                                            <div className="col-span-4 md:col-span-3 space-y-1.5">
                                                <RequiredLabel>Amount (৳)</RequiredLabel>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    placeholder="0.00"
                                                    {...register(`lines.${index}.amount`, { valueAsNumber: true })}
                                                    className={cn(
                                                        "font-mono bg-white",
                                                        errors.lines?.[index]?.amount && "border-red-400"
                                                    )}
                                                />
                                                <FieldError message={errors.lines?.[index]?.amount?.message} />
                                            </div>

                                            {/* Remove */}
                                            <div className="col-span-2 md:col-span-1 pt-6 flex justify-center">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length <= 2}
                                                    className="h-9 w-9 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-20"
                                                    title="Remove line"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>

                                            {/* Bank sub-ledger */}
                                            <div className="col-span-12 pt-2 border-t border-zinc-50">
                                                <div className="flex items-center gap-3">
                                                    <OptionalLabel>Bank Sub-ledger</OptionalLabel>
                                                    <div className="w-56">
                                                        <Controller
                                                            name={`lines.${index}.bankId`}
                                                            control={control}
                                                            render={({ field: bf }) => (
                                                                <Select
                                                                    onValueChange={(val) =>
                                                                        bf.onChange(val === "__none__" ? undefined : val)
                                                                    }
                                                                    value={bf.value || "__none__"}
                                                                >
                                                                    <SelectTrigger className="h-8 bg-white text-xs">
                                                                        <SelectValue placeholder="N/A" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="__none__">N/A — Not a bank transaction</SelectItem>
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
                                                        Only fill if this line involves a bank account.
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Right: Balance & Category ──────────────────────────────────── */}
                <div className="xl:col-span-4 space-y-4">
                    <Card className="bg-zinc-900 text-white sticky top-10">
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">
                                    Double Entry Check
                                </p>
                                <h3 className="text-xl font-bold mt-1">Voucher Balance</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                    <span className="text-zinc-400 text-sm">Total Debits</span>
                                    <span className="font-mono font-bold text-lg">
                                        ৳ {totals.debit.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                    <span className="text-zinc-400 text-sm">Total Credits</span>
                                    <span className="font-mono font-bold text-lg">
                                        ৳ {totals.credit.toLocaleString()}
                                    </span>
                                </div>
                                <div
                                    className={cn(
                                        "p-4 rounded-xl border transition-all duration-500",
                                        isBalanced
                                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                            : "bg-zinc-800 border-zinc-700 text-zinc-500"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                "size-8 rounded-lg flex items-center justify-center",
                                                isBalanced ? "bg-emerald-500 text-white" : "bg-zinc-700 text-zinc-500"
                                            )}
                                        >
                                            {isBalanced ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider">
                                                {isBalanced ? "Balanced" : "Not Balanced"}
                                            </p>
                                            <p className="text-sm font-bold">
                                                {isBalanced
                                                    ? "Ready to save"
                                                    : `৳ ${Math.abs(totals.debit - totals.credit).toLocaleString()} variance`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Category selector */}
                            <div className="space-y-3 pt-2">
                                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                    Entry Type <span className="text-red-400 ml-0.5">*</span>
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(categoryConfigs).map(([key, config]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setValue("category", key as any)}
                                            title={config.desc}
                                            className={cn(
                                                "p-3 rounded-xl border text-left transition-all active:scale-95",
                                                activeCategory === key
                                                    ? "bg-white border-white text-zinc-900 shadow-lg"
                                                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                                            )}
                                        >
                                            <config.icon
                                                size={16}
                                                className={cn("mb-2", activeCategory === key ? "text-zinc-900" : "text-zinc-500")}
                                            />
                                            <p className="text-[10px] font-semibold uppercase tracking-wider leading-none">
                                                {config.label}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            <Scale className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                Only <span className="font-semibold text-zinc-700">DRAFT</span> entries
                                can be edited. Once posted, create a{" "}
                                <span className="font-semibold text-zinc-700">Reversal</span> entry instead.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
