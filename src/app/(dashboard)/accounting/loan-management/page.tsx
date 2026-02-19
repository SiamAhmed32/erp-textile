"use client";

import React, { useMemo, useState } from "react";
import { Box, Container, PrimaryHeading, PrimarySubHeading, ButtonPrimary, CustomModal } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Landmark, CheckCircle2, TrendingDown, ArrowLeft, History, Info, Banknote, Eye, UserPlus, FileDown, Calendar, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Mock ──────────────────────────────────────────────── */
interface ScheduleItem {
    no: number;
    date: string;
    principal: number;
    interest: number;
    total: number;
    balance: number;
    status: "paid" | "upcoming" | "overdue";
}

interface Loan {
    id: string;
    lender: string;
    type: "bank" | "director" | "personal";
    interestRate: number;
    principal: number;
    paid: number;
    outstanding: number;
    startDate: string;
    status: "active" | "settled";
    schedule: ScheduleItem[];
}

const loans: Loan[] = [
    {
        id: "L1",
        lender: "National Bank Limited",
        type: "bank",
        interestRate: 9.5,
        principal: 500000,
        paid: 133716,
        outstanding: 366284,
        startDate: "Jan 2025",
        status: "active",
        schedule: [
            { no: 1, date: "Mar 2025", principal: 10000, interest: 3958, total: 13958, balance: 490000, status: "paid" },
            { no: 2, date: "Jun 2025", principal: 10000, interest: 3879, total: 13879, balance: 480000, status: "paid" },
            { no: 3, date: "Sep 2025", principal: 10000, interest: 3800, total: 13800, balance: 470000, status: "paid" },
            { no: 4, date: "Dec 2025", principal: 10000, interest: 3721, total: 13721, balance: 460000, status: "paid" },
            { no: 5, date: "Mar 2026", principal: 10000, interest: 3642, total: 13642, balance: 450000, status: "upcoming" },
            { no: 6, date: "Jun 2026", principal: 10000, interest: 3563, total: 13563, balance: 440000, status: "upcoming" },
        ],
    },
    {
        id: "L2",
        lender: "Mr. Rahman (Director)",
        type: "director",
        interestRate: 0,
        principal: 200000,
        paid: 66667,
        outstanding: 133333,
        startDate: "Jul 2025",
        status: "active",
        schedule: [
            { no: 1, date: "Oct 2025", principal: 33333, interest: 0, total: 33333, balance: 166667, status: "paid" },
            { no: 2, date: "Jan 2026", principal: 33334, interest: 0, total: 33334, balance: 133333, status: "paid" },
            { no: 3, date: "Apr 2026", principal: 33333, interest: 0, total: 33333, balance: 100000, status: "upcoming" },
            { no: 4, date: "Jul 2026", principal: 33333, interest: 0, total: 33333, balance: 66667, status: "upcoming" },
            { no: 5, date: "Oct 2026", principal: 33334, interest: 0, total: 33334, balance: 33333, status: "upcoming" },
            { no: 6, date: "Jan 2027", principal: 33333, interest: 0, total: 33333, balance: 0, status: "upcoming" },
        ],
    },
];

const fmt = (n: number) => "৳ " + Math.abs(n).toLocaleString("en-IN");

function StakeholderFormModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    return (
        <CustomModal open={open} onOpenChange={(v) => !v && onClose()} title="Add New Stakeholder / Lender" maxWidth="600px">
            <div className="space-y-4 pt-2 font-outfit">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lender Name</label>
                    <input type="text" className="form-input" placeholder="e.g. Brac Bank" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lender Type</label>
                        <select className="form-input"><option>Bank</option><option>Director</option><option>Personal</option></select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interest Rate (%)</label>
                        <input type="text" className="form-input" placeholder="0.00" />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initial Principal (৳)</label>
                    <input type="text" className="form-input" placeholder="0.00" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose} className="font-bold">Cancel</Button>
                    <ButtonPrimary onClick={onClose} className="font-bold">Save Stakeholder</ButtonPrimary>
                </div>
            </div>
        </CustomModal>
    );
}

export default function LoanManagementPage() {
    const [viewMode, setViewMode] = useState<"list" | "details">("list");
    const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [search, setSearch] = useState("");

    const selectedLoan = loans.find(l => l.id === selectedLoanId);

    const listColumns = useMemo(() => [
        {
            header: "Lender Details",
            accessor: (row: Loan) => (
                <div className="py-2">
                    <div className="font-bold text-sm text-slate-900 leading-tight">{row.lender}</div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-bold mt-0.5">{row.type} · since {row.startDate}</div>
                </div>
            )
        },
        {
            header: "Principal",
            className: "text-right",
            accessor: (row: Loan) => <span className="font-mono text-sm text-slate-600 font-bold">{fmt(row.principal)}</span>
        },
        {
            header: "Repaid",
            className: "text-right",
            accessor: (row: Loan) => <span className="font-mono text-sm text-emerald-600 font-bold">{fmt(row.paid)}</span>
        },
        {
            header: "Outstanding",
            className: "text-right",
            accessor: (row: Loan) => <span className="font-mono text-sm font-black text-red-600">{fmt(row.outstanding)}</span>
        },
        {
            header: "Status",
            accessor: (row: Loan) => (
                <span className={cn(
                    "inline-flex items-center rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em]",
                    row.status === "settled" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                )}>
                    {row.status}
                </span>
            )
        },
        {
            header: "Action",
            className: "text-right",
            accessor: (row: Loan) => (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-black hover:bg-slate-100"
                    onClick={() => {
                        setSelectedLoanId(row.id);
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
            header: "#",
            accessor: (row: ScheduleItem) => <span className="font-mono text-slate-400 font-bold">{row.no}</span>
        },
        {
            header: "Due Date",
            accessor: (row: ScheduleItem) => <span className="text-slate-600 font-medium">{row.date}</span>
        },
        {
            header: "Principal",
            className: "text-right",
            accessor: (row: ScheduleItem) => <span className="font-mono text-slate-700 font-medium">{fmt(row.principal)}</span>
        },
        {
            header: "Interest",
            className: "text-right",
            accessor: (row: ScheduleItem) => <span className="font-mono text-slate-500">{row.interest > 0 ? fmt(row.interest) : "—"}</span>
        },
        {
            header: "Total",
            className: "text-right",
            accessor: (row: ScheduleItem) => <span className="font-mono font-black text-slate-900">{fmt(row.total)}</span>
        },
        {
            header: "Balance",
            className: "text-right",
            accessor: (row: ScheduleItem) => <span className="font-mono font-black text-slate-400">{fmt(row.balance)}</span>
        },
        {
            header: "Status",
            accessor: (row: ScheduleItem) => (
                <span className={cn(
                    "inline-flex items-center rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-tight",
                    row.status === "paid" ? "bg-emerald-50 text-emerald-600" :
                        row.status === "overdue" ? "bg-red-50 text-red-600" :
                            "bg-slate-100 text-slate-500"
                )}>
                    {row.status}
                </span>
            )
        }
    ], []);

    return (
        <Container className="space-y-6 !p-0 pb-10 font-outfit">
            <div className="flex justify-between items-start">
                <Box>
                    <PrimaryHeading>Loan Management</PrimaryHeading>
                    <PrimarySubHeading>Lifecycle tracking for bank facilities, credit lines, and director loans</PrimarySubHeading>
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
                <StatsCard title="Total Principal" value="৳ 7,00,000" icon={Landmark} color="blue" description="Gross debt facilities" />
                <StatsCard title="Settled Amount" value="৳ 2,00,383" icon={CheckCircle2} color="green" description="Principal recovered" />
                <StatsCard title="Net Liability" value="৳ 4,99,617" icon={TrendingDown} color="red" description="Active current debt" />
            </div>

            {viewMode === "list" ? (
                <>
                    {/* Standardized Toolbar - Matches Image Reference */}
                    <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 flex-1 min-w-[300px]">
                            <Input
                                placeholder="Search by lender name or type..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-white border-slate-200 focus:bg-white transition-all font-medium h-10 flex-1"
                            />
                            <Button variant="outline" className="h-10 px-6 font-bold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 shrink-0">
                                Search
                            </Button>
                        </div>

                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-black text-white hover:bg-slate-800 shrink-0 h-10 px-8 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 ml-auto"
                        >
                            <UserPlus className="size-3.5" /> Add Stakeholder
                        </Button>
                    </div>

                    {/* Loan Table */}
                    <Box className="bg-white border-2 border-slate-100 rounded-2xl shadow-sm overflow-hidden p-0">
                        <CustomTable
                            data={loans}
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
                                <Banknote className="size-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-slate-900 leading-tight">{selectedLoan?.lender}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{selectedLoan?.type} FACILITY</p>
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
                                <FileDown className="size-4" /> Export Schedule
                            </Button>
                        </div>
                    </div>

                    {/* Amortization Schedule Table */}
                    <Box className="bg-white border-2 border-slate-100 rounded-2xl shadow-sm overflow-hidden p-0">
                        <div className="bg-slate-900 px-6 py-3 flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Amortization Schedule</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-slate-500 uppercase">Interest Rate:</span>
                                <span className="font-mono font-black text-amber-500 text-sm">{selectedLoan?.interestRate}% APR</span>
                            </div>
                        </div>
                        <CustomTable
                            data={selectedLoan?.schedule || []}
                            columns={detailColumns}
                            scrollAreaHeight="h-auto"
                            rowClassName="border-b border-slate-50 last:border-0"
                        />
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Info className="size-3" /> Repayment plans are structured based on facility agreements
                        </div>
                    </Box>
                </div>
            )}

            <StakeholderFormModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </Container>
    );
}
