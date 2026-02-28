"use client";

import { Box, Container, PageHeader } from "@/components/reusables";
import { cn } from "@/lib/utils";
import { FileDown, Loader2, History as HistoryIcon } from "lucide-react";
import { useGetAllQuery } from "@/store/services/commonApi";
import { format } from "date-fns";
import { useMemo } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface AuditEntry {
    id: string;
    voucherNo: string;
    category: string;
    date: string;
    narration: string;
    status: string;
    buyer?: { name: string } | null;
    supplier?: { name: string } | null;
    createdBy?: {
        firstName: string;
        lastName: string;
        email: string;
    };
    lines?: {
        type: string;
        amount: string | number;
        accountHead?: { name: string };
    }[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const getCategoryColor = (category: string) => {
    switch (category) {
        case "CUSTOMER_DUE":
            return "amber";
        case "RECEIPT":
            return "emerald";
        case "SUPPLIER_DUE":
            return "amber";
        case "PAYMENT":
            return "red";
        case "CONTRA":
            return "slate";
        default:
            return "indigo";
    }
};

const getCategoryLabel = (category: string) => {
    return category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const getCategoryTags = (entry: AuditEntry) => {
    const tags: string[] = [];

    switch (entry.category) {
        case "CUSTOMER_DUE":
            tags.push("Receivable Created");
            break;
        case "RECEIPT":
            tags.push("Due Reduced", "Cash In");
            break;
        case "SUPPLIER_DUE":
            tags.push("Payable Created");
            break;
        case "PAYMENT":
            tags.push("Due Reduced", "Cash Out");
            break;
        default:
            tags.push("General Ledger");
    }

    if (entry.status === "POSTED") tags.push("Balanced ✓");
    if (entry.status === "DRAFT") tags.push("Draft");

    return tags;
};

const getEntryAmount = (entry: AuditEntry): number => {
    if (!entry.lines || entry.lines.length === 0) return 0;
    // Sum all debit amounts (which equals credit amounts for a balanced entry)
    return entry.lines
        .filter((l) => l.type === "DEBIT")
        .reduce((sum, l) => sum + Number(l.amount), 0);
};

// ── Page ───────────────────────────────────────────────────────────────────────
const AuditTrailPage = () => {
    const { data: auditPayload, isLoading } = useGetAllQuery({
        path: "accounting/ledger/audit-trail",
        limit: 50,
        sort: null,
    });

    const auditItems = useMemo(() => {
        const raw = (auditPayload as any)?.data?.data || (auditPayload as any)?.data;
        if (Array.isArray(raw)) return raw as AuditEntry[];
        return [] as AuditEntry[];
    }, [auditPayload]);

    return (
        <Container className="pb-10">
            <PageHeader
                title="System Audit Trail"
                breadcrumbItems={[
                    { label: "Accounting", href: "/accounting/overview" },
                    { label: "Audit Trail" },
                ]}
                icon={HistoryIcon}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">

                {/* Audit Timeline */}
                <Box className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <Box className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-[13px] font-bold text-slate-900">Audit Trail</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">Nothing is ever deleted — full transaction history</p>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            <FileDown className="size-3.5" />
                            <span>Export All</span>
                        </button>
                    </Box>
                    <Box className="p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-16 text-zinc-400 gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-sm">Loading audit trail...</span>
                            </div>
                        ) : auditItems.length === 0 ? (
                            <div className="flex items-center justify-center py-16 text-zinc-400 text-sm">
                                No journal entries found
                            </div>
                        ) : (
                            <div className="space-y-0">
                                {auditItems.map((item, i) => {
                                    const color = getCategoryColor(item.category);
                                    const amount = getEntryAmount(item);
                                    const tags = getCategoryTags(item);

                                    return (
                                        <div key={item.id} className="flex gap-6 group">
                                            <div className="flex flex-col items-center w-4 shrink-0">
                                                <div className={cn(
                                                    "size-3 rounded-full border-2 border-white ring-2 ring-offset-0 ring-current transition-all group-hover:scale-125",
                                                    color === "amber" ? "text-amber-500" :
                                                        color === "emerald" ? "text-emerald-500" :
                                                            color === "red" ? "text-red-500" : "text-primary"
                                                )} />
                                                {i !== auditItems.length - 1 && (
                                                    <div className="w-[1px] flex-1 bg-slate-100 my-1 group-hover:bg-slate-200 transition-all" />
                                                )}
                                            </div>
                                            <div className="pb-8 flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-[13px] font-bold text-slate-900 group-hover:text-primary transition-colors">
                                                        {item.voucherNo} · {getCategoryLabel(item.category)}
                                                        {(item.buyer?.name || item.supplier?.name) && (
                                                            <span className="text-slate-400 font-normal">
                                                                {" "}— {item.buyer?.name || item.supplier?.name}
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <span className="text-[11px] font-mono text-slate-400">
                                                        {format(new Date(item.date), "dd MMM yyyy")}
                                                    </span>
                                                </div>
                                                <div className="text-[11px] text-slate-500 mb-2 font-mono tracking-tight">
                                                    ৳ {amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })} · {item.narration || "No narration"}
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {tags.map((tag, j) => (
                                                        <span
                                                            key={j}
                                                            className={cn(
                                                                "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter",
                                                                tag.includes("✓") ? "bg-slate-100 text-slate-500" :
                                                                    tag.includes("Reduced") ? "bg-emerald-50 text-emerald-600" :
                                                                        tag.includes("Cash In") ? "bg-emerald-50 text-emerald-600" :
                                                                            tag.includes("Cash Out") ? "bg-red-50 text-red-600" :
                                                                                tag.includes("Draft") ? "bg-yellow-50 text-yellow-600" :
                                                                                    "bg-amber-50 text-amber-600"
                                                            )}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Box>
                </Box>

                {/* Registry Reference */}
                <Box className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-fit sticky top-6">
                    <Box className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-[12px] font-bold text-slate-900">Entry Type Reference</h3>
                    </Box>
                    <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-4 py-3 font-bold text-slate-400 uppercase text-[9px]">Type</th>
                                <th className="px-4 py-3 font-bold text-slate-400 uppercase text-[9px]">Updates</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { type: "Buyer Due", color: "bg-amber-50 text-amber-600", updates: "Buyer Ledger ↑" },
                                { type: "Receipt", color: "bg-emerald-50 text-emerald-600", updates: "Buyer Ledger ↓ + Cash ↑" },
                                { type: "Supplier Due", color: "bg-amber-50 text-amber-600", updates: "Supplier Ledger ↑" },
                                { type: "Payment", color: "bg-red-50 text-red-600", updates: "Supplier Ledger ↓ + Cash ↓" },
                                { type: "Journal", color: "bg-indigo-50 text-primary", updates: "Any account heads" },
                                { type: "Contra", color: "bg-slate-50 text-slate-500", updates: "Reverses source entry" },
                            ].map((ref, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <span className={cn("px-2 py-0.5 rounded-full font-bold text-[9px] uppercase", ref.color)}>
                                            {ref.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-500">{ref.updates}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </div>
        </Container>
    );
};

export default AuditTrailPage;
