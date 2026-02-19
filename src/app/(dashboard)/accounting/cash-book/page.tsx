"use client";

import React, { useMemo, useState } from "react";
import { Box, Container, PrimaryHeading, PrimarySubHeading, ButtonPrimary, CustomModal } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wallet, CheckCircle2, AlertCircle, ArrowLeft, History, Info, Eye, UserPlus, FileDown, Calendar, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Mock data ─────────────────────────────────────────── */
interface Transaction {
    ref: string;
    date: string;
    type: string;
    amount: number;
    balance: number;
    note: string;
}

interface EmployeeIOU {
    id: string;
    name: string;
    designation: string;
    totalIssued: number;
    totalReturned: number;
    outstanding: number;
    lastTransaction: string;
    transactions: Transaction[];
}

const employees: EmployeeIOU[] = [
    {
        id: "1",
        name: "Salim Ahmed",
        designation: "Production Manager",
        totalIssued: 15000,
        totalReturned: 5000,
        outstanding: 10000,
        lastTransaction: "17 Feb 2026",
        transactions: [
            { ref: "JE-046", date: "15 Feb 2026", type: "Advance", amount: 15000, balance: 15000, note: "Travel advance issued" },
            { ref: "JE-048", date: "17 Feb 2026", type: "Return", amount: -5000, balance: 10000, note: "Partial return from trip" },
        ],
    },
    {
        id: "2",
        name: "Kamal Hossain",
        designation: "Executive (Admin)",
        totalIssued: 8000,
        totalReturned: 8000,
        outstanding: 0,
        lastTransaction: "16 Feb 2026",
        transactions: [
            { ref: "JE-044", date: "12 Feb 2026", type: "Advance", amount: 8000, balance: 8000, note: "Cash advance for supplies" },
            { ref: "JE-047", date: "16 Feb 2026", type: "Return", amount: -8000, balance: 0, note: "Fully settled with receipts" },
        ],
    },
    {
        id: "3",
        name: "Rina Begum",
        designation: "Support Staff",
        totalIssued: 5000,
        totalReturned: 0,
        outstanding: 5000,
        lastTransaction: "18 Feb 2026",
        transactions: [
            { ref: "JE-050", date: "18 Feb 2026", type: "Advance", amount: 5000, balance: 5000, note: "Petty cash issued" },
        ],
    },
];

const fmt = (n: number) => "৳ " + Math.abs(n).toLocaleString("en-IN");

function EmployeeFormModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    return (
        <CustomModal open={open} onOpenChange={(v) => !v && onClose()} title="Add New Employee Record" maxWidth="600px">
            <div className="space-y-4 pt-2 font-outfit">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Employee Full Name</label>
                    <input type="text" className="form-input" placeholder="e.g. Tanvir Ahmed" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Designation</label>
                        <input type="text" className="form-input" placeholder="e.g. Sales Officer" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Employee ID</label>
                        <input type="text" className="form-input" placeholder="e.g. EMP-1024" />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opening Advance Balance (৳)</label>
                    <input type="text" className="form-input" placeholder="0.00" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose} className="font-bold">Cancel</Button>
                    <ButtonPrimary onClick={onClose} className="font-bold">Register Employee</ButtonPrimary>
                </div>
            </div>
        </CustomModal>
    );
}

export default function CashBookPage() {
    const [viewMode, setViewMode] = useState<"list" | "details">("list");
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [search, setSearch] = useState("");

    const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

    const listColumns = useMemo(() => [
        {
            header: "Employee Details",
            accessor: (row: EmployeeIOU) => (
                <div className="py-2">
                    <div className="font-bold text-sm text-slate-900 leading-tight">{row.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-bold mt-0.5">{row.designation}</div>
                </div>
            )
        },
        {
            header: "Total Advance",
            className: "text-right",
            accessor: (row: EmployeeIOU) => <span className="font-mono text-sm text-amber-600 font-bold">{fmt(row.totalIssued)}</span>
        },
        {
            header: "Settled",
            className: "text-right",
            accessor: (row: EmployeeIOU) => <span className="font-mono text-sm text-emerald-600 font-bold">{fmt(row.totalReturned)}</span>
        },
        {
            header: "Current IOU",
            className: "text-right",
            accessor: (row: EmployeeIOU) => <span className="font-mono text-sm font-black text-red-600">{fmt(row.outstanding)}</span>
        },
        {
            header: "Last Activity",
            accessor: (row: EmployeeIOU) => <span className="text-xs text-slate-500 font-medium">{row.lastTransaction}</span>
        },
        {
            header: "Action",
            className: "text-right",
            accessor: (row: EmployeeIOU) => (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-black hover:bg-slate-100"
                    onClick={() => {
                        setSelectedEmployeeId(row.id);
                        setViewMode("details");
                    }}
                >
                    <Eye className="h-4 w-4" />
                </Button>
            )
        }
    ], []);

    const detailColumns = useMemo(() => [
        {
            header: "Ref No",
            accessor: (row: Transaction) => <span className="font-mono text-slate-500 font-bold">{row.ref}</span>
        },
        {
            header: "Date",
            accessor: (row: Transaction) => <span className="text-slate-600 font-medium">{row.date}</span>
        },
        {
            header: "Type",
            accessor: (row: Transaction) => (
                <span className={cn(
                    "inline-flex items-center rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-tight",
                    row.type === "Return" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                )}>
                    {row.type}
                </span>
            )
        },
        {
            header: "Amount",
            className: "text-right",
            accessor: (row: Transaction) => (
                <span className={cn("font-mono font-black",
                    row.amount > 0 ? "text-amber-600" : "text-emerald-700"
                )}>{row.amount > 0 ? "+" : ""}{fmt(row.amount)}</span>
            )
        },
        {
            header: "Balance",
            className: "text-right",
            accessor: (row: Transaction) => <span className="font-mono font-black text-slate-900">{fmt(row.balance)}</span>
        },
        {
            header: "Note",
            accessor: (row: Transaction) => <span className="text-slate-500 italic font-medium">{row.note}</span>
        }
    ], []);

    return (
        <Container className="space-y-6 !p-0 pb-10 font-outfit">
            <div className="flex justify-between items-start">
                <Box>
                    <PrimaryHeading>MOI / Cash Book</PrimaryHeading>
                    <PrimarySubHeading>Employee advances, petty cash management and IOU recovery tracking</PrimarySubHeading>
                </Box>
                {viewMode === "details" && (
                    <Button
                        variant="outline"
                        onClick={() => setViewMode("list")}
                        className="mt-2 border-slate-200 font-bold text-slate-600 h-9"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                    </Button>
                )}
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard title="Total Advanced" value="৳ 28,000" icon={Wallet} color="blue" description="Total cash out to team" />
                <StatsCard title="Settled to Date" value="৳ 13,000" icon={CheckCircle2} color="green" description="Successfully recovered/adjusted" />
                <StatsCard title="Net Outstanding" value="৳ 15,000" icon={AlertCircle} color="red" description="Active employee liabilities" />
            </div>

            {viewMode === "list" ? (
                <>
                    {/* Toolbar for List */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
                            <Input
                                placeholder="Search by employee name or designation..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-slate-50 border-slate-200 font-medium h-11"
                            />
                            <Button variant="outline" className="h-11 px-6 font-bold text-slate-600 border-slate-200 shrink-0">
                                Search
                            </Button>
                        </div>
                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-black text-white hover:bg-slate-800 shrink-0 h-11 px-8 font-black uppercase tracking-widest text-[11px] flex items-center gap-2"
                        >
                            <UserPlus className="size-4" /> Add Employee
                        </Button>
                    </div>

                    {/* Employee Table */}
                    <Box className="bg-white border-2 border-slate-100 rounded-2xl shadow-sm overflow-hidden p-0">
                        <CustomTable
                            data={employees}
                            columns={listColumns}
                            scrollAreaHeight="h-auto"
                            rowClassName="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                        />
                    </Box>
                </>
            ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                    {/* Detail Toolbar */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="size-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl">
                                {selectedEmployee?.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-slate-900 leading-tight">{selectedEmployee?.name}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{selectedEmployee?.designation}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input type="date" className="h-11 pl-10 bg-slate-50 border-slate-200 font-medium w-[160px]" />
                                </div>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input type="date" className="h-11 pl-10 bg-slate-50 border-slate-200 font-medium w-[160px]" />
                                </div>
                            </div>
                            <Button className="bg-emerald-600 text-white hover:bg-emerald-700 h-11 px-6 font-black uppercase tracking-widest text-[11px] flex items-center gap-2">
                                <FileDown className="size-4" /> Export PDF
                            </Button>
                        </div>
                    </div>

                    {/* Transaction History Table */}
                    <Box className="bg-white border-2 border-slate-100 rounded-2xl shadow-sm overflow-hidden p-0">
                        <div className="bg-slate-900 px-6 py-3 flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Transaction Timeline</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-slate-500 uppercase">Current Balance:</span>
                                <span className="font-mono font-black text-red-500 text-sm">{fmt(selectedEmployee?.outstanding || 0)}</span>
                            </div>
                        </div>
                        <CustomTable
                            data={selectedEmployee?.transactions || []}
                            columns={detailColumns}
                            scrollAreaHeight="h-auto"
                            rowClassName="border-b border-slate-50 last:border-0"
                        />
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Info className="size-3" /> All movements are automatically synced with financial journals
                        </div>
                    </Box>
                </div>
            )}

            <EmployeeFormModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </Container>
    );
}
