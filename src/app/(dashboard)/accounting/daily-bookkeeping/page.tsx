"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, PrimaryHeading, PrimarySubHeading } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, SquarePen, Trash2, BookOpen, Receipt, ArrowUpDown, History, Plus, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for Journal Entries
const mockEntries = [
    { id: 'JE-2024-001', date: '18 Feb 2026', type: 'Customer Due', party: 'Rahim Corp', amount: 75000, narration: 'Sold goods on credit', status: 'Posted' },
    { id: 'JE-2024-002', date: '17 Feb 2026', type: 'Expense', party: 'Office Expense', amount: 5000, narration: 'Monthly office rent', status: 'Posted' },
    { id: 'JE-2024-003', date: '16 Feb 2026', type: 'Receipt', party: 'Karim Traders', amount: 30000, narration: 'Payment received', status: 'Posted' },
];

export default function DailyBookkeepingList() {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const columns = useMemo(() => [
        {
            header: "Entry ID",
            accessor: (row: any) => <span className="font-mono text-xs font-bold text-slate-500">{row.id}</span>
        },
        {
            header: "Date",
            accessor: (row: any) => <span className="text-xs text-slate-600 font-medium">{row.date}</span>
        },
        {
            header: "Type",
            accessor: (row: any) => (
                <span className="inline-flex items-center rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-tight bg-slate-100 text-slate-600">
                    {row.type}
                </span>
            )
        },
        {
            header: "Party / Head",
            accessor: (row: any) => (
                <div className="py-2">
                    <span className="font-bold text-slate-900">{row.party}</span>
                </div>
            )
        },
        {
            header: "Amount",
            className: "text-right",
            accessor: (row: any) => <span className="font-mono font-black text-slate-900">৳ {row.amount.toLocaleString()}</span>
        },
        {
            header: "Narration",
            accessor: (row: any) => <span className="text-xs text-slate-500 italic line-clamp-1">{row.narration}</span>
        },
        {
            header: "Actions",
            className: "text-right w-32 pr-4",
            accessor: (row: any) => (
                <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-black hover:bg-slate-100">
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-black hover:bg-slate-100">
                        <SquarePen className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        }
    ], []);

    return (
        <Container className="space-y-6 !p-0 pb-10 font-outfit">
            <Box>
                <PrimaryHeading>Daily Bookkeeping</PrimaryHeading>
                <PrimarySubHeading>Chronological record of all financial movements and journal vouchers</PrimarySubHeading>
            </Box>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard title="Today's Entries" value="14" icon={BookOpen} color="blue" description="Vouchers created today" />
                <StatsCard title="Total Volume" value="৳ 3.4M" icon={Receipt} color="green" description="Total value recorded" />
                <StatsCard title="Pending Checks" value="2" icon={History} color="orange" description="Requires authorization" />
            </div>

            {/* Standardized Toolbar - Matches Image Reference */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 flex-1 min-w-[300px]">
                    <Input
                        placeholder="Search voucher ID, party name or narration..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-white border-slate-200 focus:bg-white transition-all font-medium h-10 flex-1"
                    />
                    <Button variant="outline" className="h-10 px-6 font-bold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 shrink-0">
                        Search
                    </Button>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[140px] h-10 bg-white border-slate-200 font-bold text-slate-600">
                            <SelectValue placeholder="All Voucher Types" />
                        </SelectTrigger>
                        <SelectContent className="font-outfit">
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="receipt">Receipt</SelectItem>
                            <SelectItem value="payment">Payment</SelectItem>
                            <SelectItem value="journal">Journal</SelectItem>
                            <SelectItem value="contra">Contra</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-1">
                        <Input type="date" className="h-10 w-[130px] bg-white border-slate-200 font-medium text-xs" />
                        <Input type="date" className="h-10 w-[130px] bg-white border-slate-200 font-medium text-xs" />
                    </div>

                    <Button
                        onClick={() => router.push('/accounting/daily-bookkeeping/create')}
                        className="bg-black text-white hover:bg-slate-800 shrink-0 h-10 px-8 font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
                    >
                        <Plus className="size-4" /> New Entry
                    </Button>
                </div>
            </div>

            {/* Entry Table */}
            <Box className="bg-white border-2 border-slate-100 rounded-2xl shadow-sm overflow-hidden p-0">
                <CustomTable
                    data={mockEntries}
                    columns={columns}
                    isLoading={false}
                    scrollAreaHeight="h-auto"
                    rowClassName="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                />
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                    <Info className="size-3" /> Double-entry validation is applied to all bookkeeping records
                </div>
            </Box>
        </Container>
    );
}
