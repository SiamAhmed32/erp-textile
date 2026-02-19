"use client";

import React, { useMemo, useState } from "react";
import { Container, CustomModal, InputField } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Landmark, CheckCircle2, TrendingDown, ArrowLeft, Info, Banknote, Eye, FileDown } from "lucide-react";
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

const initialFormData = {
    lenderName: "",
    lenderType: "",
    interestRate: "",
    principal: "",
};

function StakeholderFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => setFormData(initialFormData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onClose();
        resetForm();
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={(val) => {
                if (!val) { onClose(); resetForm(); }
            }}
            title="Add New Stakeholder / Lender"
            maxWidth="600px"
        >
            <form onSubmit={handleSubmit} className="space-y-1">
                <InputField
                    label="Lender Name"
                    name="lenderName"
                    value={formData.lenderName}
                    onChange={handleChange}
                    placeholder="e.g. Brac Bank"
                    required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
                    <div className="mb-4">
                        <Label htmlFor="lenderType">Lender Type</Label>
                        <select
                            id="lenderType"
                            name="lenderType"
                            value={formData.lenderType}
                            onChange={(e) => setFormData((prev) => ({ ...prev, lenderType: e.target.value }))}
                            className="font-primary input_field w-full h-[42px] px-4 py-2 border focus:outline-none focus:border-transparent focus:ring-2 focus:ring-button transition border-borderBg"
                        >
                            <option value="">Select Type</option>
                            <option value="bank">Bank</option>
                            <option value="director">Director</option>
                            <option value="personal">Personal</option>
                        </select>
                    </div>
                    <InputField
                        label="Interest Rate (%)"
                        name="interestRate"
                        value={formData.interestRate}
                        onChange={handleChange}
                        placeholder="0.00"
                    />
                </div>
                <InputField
                    label="Initial Principal (৳)"
                    name="principal"
                    value={formData.principal}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                />
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => { onClose(); resetForm(); }}>
                        Cancel
                    </Button>
                    <Button type="submit" className="px-8 bg-secondary hover:bg-secondary/90 text-white">
                        Save Stakeholder
                    </Button>
                </div>
            </form>
        </CustomModal>
    );
}

export default function LoanManagementPage() {
    const [viewMode, setViewMode] = useState<"list" | "details">("list");
    const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const selectedLoan = loans.find(l => l.id === selectedLoanId);

    const listColumns = useMemo(() => [
        {
            header: "Lender",
            accessor: (row: Loan) => (
                <div className="font-semibold text-foreground">{row.lender}</div>
            )
        },
        {
            header: "Type",
            accessor: (row: Loan) => (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">
                    {row.type.toUpperCase()}
                </span>
            ),
        },
        {
            header: "Principal",
            accessor: (row: Loan) => fmt(row.principal),
        },
        {
            header: "Repaid",
            accessor: (row: Loan) => fmt(row.paid),
        },
        {
            header: "Outstanding",
            accessor: (row: Loan) => fmt(row.outstanding),
        },
        {
            header: "Status",
            accessor: (row: Loan) => (
                <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    row.status === "settled" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                )}>
                    {row.status.toUpperCase()}
                </span>
            )
        },
        {
            header: "Action",
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
            accessor: (row: ScheduleItem) => row.no,
        },
        {
            header: "Due Date",
            accessor: (row: ScheduleItem) => row.date,
        },
        {
            header: "Principal",
            accessor: (row: ScheduleItem) => fmt(row.principal),
        },
        {
            header: "Interest",
            accessor: (row: ScheduleItem) => row.interest > 0 ? fmt(row.interest) : "—",
        },
        {
            header: "Total",
            accessor: (row: ScheduleItem) => fmt(row.total),
        },
        {
            header: "Balance",
            accessor: (row: ScheduleItem) => fmt(row.balance),
        },
        {
            header: "Status",
            accessor: (row: ScheduleItem) => (
                <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    row.status === "paid" ? "bg-emerald-50 text-emerald-600" :
                        row.status === "overdue" ? "bg-red-50 text-red-600" :
                            "bg-slate-100 text-slate-500"
                )}>
                    {row.status.toUpperCase()}
                </span>
            )
        }
    ], []);

    return (
        <Container className="pb-10">
            <div className="space-y-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatsCard title="Active Loans" value={loans.filter(l => l.status === "active").length} icon={Landmark} color="blue" />
                    <StatsCard title="Total Principal" value="৳ 7,00,000" icon={Landmark} color="orange" />
                    <StatsCard title="Settled Amount" value="৳ 2,00,383" icon={CheckCircle2} color="green" />
                    <StatsCard title="Net Liability" value="৳ 4,99,617" icon={TrendingDown} color="red" />
                </div>

                {viewMode === "list" ? (
                    <>
                        {/* Toolbar */}
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
                                <Input
                                    placeholder="Search by lender name or type..."
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
                                    Add Stakeholder
                                </Button>
                            </div>
                        </div>

                        {/* Loan Table */}
                        <CustomTable
                            data={loans}
                            columns={listColumns}
                            rowClassName="cursor-pointer"
                            scrollAreaHeight="h-[calc(100vh-320px)]"
                        />
                    </>
                ) : (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        {/* Back Button */}
                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                onClick={() => setViewMode("list")}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                            </Button>
                        </div>

                        {/* Detail Toolbar */}
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="size-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                                    <Banknote className="size-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 leading-tight">{selectedLoan?.lender}</h3>
                                    <p className="text-xs text-muted-foreground">{selectedLoan?.type.toUpperCase()} FACILITY · {selectedLoan?.interestRate}% APR</p>
                                </div>
                            </div>
                            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
                                <div className="flex w-full gap-2 sm:max-w-[260px]">
                                    <Input type="date" />
                                    <Input type="date" />
                                </div>
                                <Button className="bg-black text-white hover:bg-black/90">
                                    <FileDown className="size-4 mr-2" /> Export Schedule
                                </Button>
                            </div>
                        </div>

                        {/* Amortization Schedule Table */}
                        <CustomTable
                            data={selectedLoan?.schedule || []}
                            columns={detailColumns}
                            scrollAreaHeight="h-[calc(100vh-400px)]"
                        />
                    </div>
                )}
            </div>

            <StakeholderFormModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </Container>
    );
}
