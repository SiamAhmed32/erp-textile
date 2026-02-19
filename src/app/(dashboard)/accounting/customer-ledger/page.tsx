"use client";

import React, { useMemo, useState } from "react";
import { Box, Container, PrimaryHeading, PrimarySubHeading, ButtonPrimary, CustomModal } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserRound, ArrowDownCircle, AlertCircle, History, Plus, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Mock Data ───────────────────────────────────────────── */
interface Transaction {
    ref: string;
    date: string;
    type: string;
    amount: number;
    balance: number;
    narration: string;
}

interface CustomerRow {
    name: string;
    code: string;
    raised: number;
    received: number;
    outstanding: number;
    status: "settled" | "active" | "overdue";
    transactions: Transaction[];
}

const customers: CustomerRow[] = [
    {
        name: "Rahim Corporation",
        code: "CUST-001",
        raised: 75000,
        received: 50000,
        outstanding: 25000,
        status: "active",
        transactions: [
            { ref: "JE-041", date: "18 Feb 2026", type: "Customer Due", amount: 75000, balance: 75000, narration: "Due created from INV-099" },
            { ref: "JE-040", date: "18 Feb 2026", type: "Receipt", amount: -50000, balance: 25000, narration: "Partial payment received" },
        ],
    },
    {
        name: "Nadia Enterprises",
        code: "CUST-002",
        raised: 54000,
        received: 54000,
        outstanding: 0,
        status: "settled",
        transactions: [
            { ref: "JE-036", date: "15 Feb 2026", type: "Customer Due", amount: 54000, balance: 54000, narration: "Due from INV-097" },
            { ref: "JE-035", date: "16 Feb 2026", type: "Receipt", amount: -54000, balance: 0, narration: "Full payment received" },
        ],
    },
    {
        name: "Bashir Trading Co",
        code: "CUST-003",
        raised: 32500,
        received: 17500,
        outstanding: 15000,
        status: "overdue",
        transactions: [
            { ref: "JE-034", date: "12 Feb 2026", type: "Customer Due", amount: 32500, balance: 32500, narration: "Due from INV-095" },
            { ref: "JE-033", date: "14 Feb 2026", type: "Receipt", amount: -17500, balance: 15000, narration: "Partial cheque cleared" },
        ],
    },
];

const fmt = (n: number) => "৳ " + Math.abs(n).toLocaleString("en-IN");

function CustomerFormModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    return (
        <CustomModal open={open} onOpenChange={(v) => !v && onClose()} title="Add New Customer" maxWidth="600px">
            <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Name</label>
                        <input type="text" className="form-input" placeholder="e.g. Acme Corp" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Code</label>
                        <input type="text" className="form-input" placeholder="e.g. CUST-004" />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Email</label>
                    <input type="email" className="form-input" placeholder="email@example.com" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opening Balance (৳)</label>
                    <input type="text" className="form-input" placeholder="0.00" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Address / Description</label>
                    <textarea className="form-input min-h-[80px]" placeholder="Billing address details..." />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose} className="font-bold">Cancel</Button>
                    <ButtonPrimary onClick={onClose} className="font-bold">Create Customer</ButtonPrimary>
                </div>
            </div>
        </CustomModal>
    );
}

export default function CustomerLedgerPage() {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const columns = useMemo(() => [
        {
            header: "Customer",
            accessor: (row: CustomerRow) => (
                <div className="py-2">
                    <div className="font-bold text-sm text-slate-900 leading-tight">{row.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-bold mt-0.5">{row.code}</div>
                </div>
            )
        },
        {
            header: "Due Raised",
            className: "text-right",
            accessor: (row: CustomerRow) => <span className="font-mono text-sm text-amber-600 font-bold">{fmt(row.raised)}</span>
        },
        {
            header: "Received",
            className: "text-right",
            accessor: (row: CustomerRow) => <span className="font-mono text-sm text-emerald-600 font-bold">{fmt(row.received)}</span>
        },
        {
            header: "Outstanding",
            className: "text-right",
            accessor: (row: CustomerRow) => <span className="font-mono text-sm font-black text-red-600">{fmt(row.outstanding)}</span>
        },
        {
            header: "Status",
            accessor: (row: CustomerRow) => (
                <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em]",
                    row.status === "settled" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                        row.status === "overdue" ? "bg-red-50 text-red-600 border border-red-100" :
                            "bg-amber-50 text-amber-600 border border-amber-100"
                )}>
                    {row.status}
                </span>
            )
        }
    ], []);

    const renderExpandedRow = (row: CustomerRow) => {
        if (expanded !== row.code) return null;
        return (
            <div className="bg-slate-50/50 p-6 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Financial Timeline</span>
                    <div className="h-px flex-1 bg-slate-200" />
                </div>
                {row.transactions.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-900">
                                <tr>
                                    <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300 border-r border-slate-800">Ref No</th>
                                    <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300 border-r border-slate-800">Date</th>
                                    <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300 border-r border-slate-800">Entry Type</th>
                                    <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300 border-r border-slate-800 text-right">Amount</th>
                                    <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300 border-r border-slate-800 text-right">Running Balance</th>
                                    <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300">Narration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {row.transactions.map((t, i) => (
                                    <tr key={i} className="text-xs hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3 font-mono text-slate-500 font-bold border-r border-slate-50">{t.ref}</td>
                                        <td className="px-5 py-3 text-slate-600 font-medium border-r border-slate-50">{t.date}</td>
                                        <td className="px-5 py-3 border-r border-slate-50">
                                            <span className={cn(
                                                "inline-block rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-tight",
                                                t.type === "Receipt" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                            )}>{t.type}</span>
                                        </td>
                                        <td className={cn("px-5 py-3 text-right font-mono font-black border-r border-slate-50",
                                            t.amount > 0 ? "text-amber-600" : "text-emerald-700"
                                        )}>{t.amount > 0 ? "+" : ""}{fmt(t.amount)}</td>
                                        <td className="px-5 py-3 text-right font-mono font-black text-slate-900 border-r border-slate-50">{fmt(t.balance)}</td>
                                        <td className="px-5 py-3 text-slate-500 italic font-medium">{t.narration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        No financial transactions recorded.
                    </div>
                )}
            </div>
        );
    };

    return (
        <Container className="space-y-6 !p-0 pb-10 font-outfit">
            <Box>
                <PrimaryHeading>Customer Ledger</PrimaryHeading>
                <PrimarySubHeading>Consolidated financial view of customer accounts and payment history</PrimarySubHeading>
            </Box>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard title="Total Due Raised" value="৳ 1,61,500" icon={UserRound} color="orange" description="Gross invoiced amount" />
                <StatsCard title="Amount Received" value="৳ 1,21,500" icon={ArrowDownCircle} color="green" description="Cleared through receipts" />
                <StatsCard title="Outstanding" value="৳ 40,000" icon={AlertCircle} color="red" description="Total current receivable" />
            </div>

            {/* Standardized Toolbar - Exactly like Image 2 */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
                    <Input
                        placeholder="Search customer name or code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-slate-50 border-slate-200 focus:bg-white transition-all shadow-inner font-medium h-11"
                    />
                    <Button variant="outline" className="shrink-0 h-11 px-6 font-bold text-slate-600 hover:bg-slate-50 border-slate-200">
                        Search
                    </Button>
                </div>
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
                    <div className="w-full sm:max-w-[160px]">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-11 bg-slate-50 border-slate-200 font-bold text-slate-600">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="settled">Settled</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-full gap-2 sm:max-w-[280px]">
                        <Input type="date" className="h-11 bg-slate-50 border-slate-200 font-medium" />
                        <Input type="date" className="h-11 bg-slate-50 border-slate-200 font-medium" />
                    </div>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-black text-white hover:bg-slate-800 shrink-0 h-11 px-8 font-black uppercase tracking-widest text-[11px] flex items-center gap-2"
                    >
                        <UserPlus className="size-4" /> Add Customer
                    </Button>
                </div>
            </div>

            {/* Customer Table - Premium Look */}
            <Box className="bg-white border-2 border-slate-100 rounded-2xl shadow-sm overflow-hidden p-0">
                <CustomTable
                    data={customers}
                    columns={columns}
                    onRowClick={(row) => setExpanded(expanded === row.code ? null : row.code)}
                    scrollAreaHeight="h-auto"
                    rowClassName="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 cursor-pointer transition-colors"
                />
                {customers.map(c => expanded === c.code && <div key={`exp-${c.code}`}>{renderExpandedRow(c)}</div>)}
            </Box>

            <CustomerFormModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </Container>
    );
}
