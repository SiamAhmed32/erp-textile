"use client";

import StatsCard from "@/components/dashboard/StatsCard";
import { Container, CustomModal, InputField } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowUpCircle, Building } from "lucide-react";
import React, { useMemo, useState } from "react";

/* ─── Mock Data ───────────────────────────────────────────── */
interface Transaction {
    ref: string;
    date: string;
    type: string;
    amount: number;
    balance: number;
    narration: string;
}

interface SupplierRow {
    name: string;
    code: string;
    raised: number;
    paid: number;
    outstanding: number;
    status: "settled" | "active" | "overdue";
    transactions: Transaction[];
}

const suppliers: SupplierRow[] = [
    {
        name: "Karim Traders",
        code: "SUPP-001",
        raised: 32500,
        paid: 20000,
        outstanding: 12500,
        status: "active",
        transactions: [
            { ref: "JE-039", date: "17 Feb 2026", type: "Supplier Due", amount: 32500, balance: 32500, narration: "Purchased raw materials on credit" },
            { ref: "JE-038", date: "17 Feb 2026", type: "Payment", amount: -20000, balance: 12500, narration: "Partial payment made" },
        ],
    },
    {
        name: "National Supply Co",
        code: "SUPP-002",
        raised: 36000,
        paid: 16500,
        outstanding: 19500,
        status: "overdue",
        transactions: [
            { ref: "JE-032", date: "10 Feb 2026", type: "Supplier Due", amount: 36000, balance: 36000, narration: "Machinery spare parts" },
            { ref: "JE-031", date: "12 Feb 2026", type: "Payment", amount: -16500, balance: 19500, narration: "Part payment via cheque" },
        ],
    },
    {
        name: "Delta Imports",
        code: "SUPP-003",
        raised: 0,
        paid: 0,
        outstanding: 0,
        status: "settled",
        transactions: [],
    },
];

const fmt = (n: number) => "৳ " + Math.abs(n).toLocaleString("en-IN");

const initialFormData = {
    supplierName: "",
    supplierCode: "",
    email: "",
    openingLiability: "",
    address: "",
};

function SupplierFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => setFormData(initialFormData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: API call to create supplier
        onClose();
        resetForm();
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={(val) => {
                if (!val) {
                    onClose();
                    resetForm();
                }
            }}
            title="Add New Supplier"
            maxWidth="600px"
        >
            <form onSubmit={handleSubmit} className="space-y-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <InputField
                        label="Supplier Name"
                        name="supplierName"
                        value={formData.supplierName}
                        onChange={handleChange}
                        placeholder="e.g. Karim Traders"
                        required
                    />
                    <InputField
                        label="Supplier Code"
                        name="supplierCode"
                        value={formData.supplierCode}
                        onChange={handleChange}
                        placeholder="e.g. SUPP-004"
                        required
                    />
                </div>
                <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vendor@example.com"
                />
                <InputField
                    label="Opening Liability (৳)"
                    name="openingLiability"
                    value={formData.openingLiability}
                    onChange={handleChange}
                    placeholder="0.00"
                />
                <div className="mb-4">
                    <Label htmlFor="address">Company Details / Address</Label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                        placeholder="Supplier office address..."
                        className="font-primary input_field w-full px-4 py-2 border focus:outline-none focus:border-transparent focus:ring-2 focus:ring-button transition border-borderBg min-h-[80px]"
                    />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => { onClose(); resetForm(); }}>
                        Cancel
                    </Button>
                    <Button type="submit" className="px-8 bg-secondary hover:bg-secondary/90 text-white">
                        Create Supplier
                    </Button>
                </div>
            </form>
        </CustomModal>
    );
}

export default function SupplierLedgerPage() {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const columns = useMemo(() => [
        {
            header: "Supplier",
            accessor: (row: SupplierRow) => (
                <div className="font-semibold text-foreground">{row.name}</div>
            )
        },
        {
            header: "Code",
            accessor: (row: SupplierRow) => row.code,
        },
        {
            header: "Due Raised",
            accessor: (row: SupplierRow) => fmt(row.raised),
        },
        {
            header: "Paid",
            accessor: (row: SupplierRow) => fmt(row.paid),
        },
        {
            header: "Outstanding",
            accessor: (row: SupplierRow) => fmt(row.outstanding),
        },
        {
            header: "Status",
            accessor: (row: SupplierRow) => (
                <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    row.status === "settled" ? "bg-emerald-50 text-emerald-600" :
                        row.status === "overdue" ? "bg-red-50 text-red-600" :
                            "bg-amber-50 text-amber-600"
                )}>
                    {row.status.toUpperCase()}
                </span>
            )
        }
    ], []);

    const renderExpandedRow = (row: SupplierRow) => {
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
                                                t.type === "Payment" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                            )}>{t.type}</span>
                                        </td>
                                        <td className={cn("px-5 py-3 text-right font-mono font-black border-r border-slate-50",
                                            t.amount > 0 ? "text-amber-600" : "text-red-700"
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
        <Container className="pb-10">
            <div className="space-y-4">
                {/* Stats Cards - 4 column grid matching InvoicesTable */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatsCard title="Total Suppliers" value={suppliers.length} icon={Building} color="blue" />
                    <StatsCard title="Total Due Raised" value="৳ 68,500" icon={Building} color="orange" />
                    <StatsCard title="Amount Paid" value="৳ 36,500" icon={ArrowUpCircle} color="green" />
                    <StatsCard title="Outstanding" value="৳ 32,000" icon={AlertCircle} color="red" />
                </div>

                {/* Toolbar - matching InvoicesTable layout */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
                        <Input
                            placeholder="Search supplier name, code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant="outline" onClick={() => { }}>
                            Search
                        </Button>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
                        <div className="w-full sm:max-w-[160px]">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
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
                        <div className="flex w-full gap-2 sm:max-w-[260px]">
                            <Input type="date" />
                            <Input type="date" />
                        </div>
                        <Button
                            className="bg-black text-white hover:bg-black/90"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Add Supplier
                        </Button>
                    </div>
                </div>

                {/* Supplier Table */}
                <CustomTable
                    data={suppliers}
                    columns={columns}
                    onRowClick={(row) => setExpanded(expanded === row.code ? null : row.code)}
                    rowClassName="cursor-pointer"
                    scrollAreaHeight="h-[calc(100vh-320px)]"
                />
                {suppliers.map(s => expanded === s.code && <div key={`exp-${s.code}`}>{renderExpandedRow(s)}</div>)}
            </div>

            <SupplierFormModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </Container>
    );
}
