"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, SquarePen, Trash2, BookOpen, Receipt, History, Plus } from "lucide-react";
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
    const [typeFilter, setTypeFilter] = useState("all");

    const columns = useMemo(() => [
        {
            header: "Entry ID",
            accessor: (row: any) => row.id,
        },
        {
            header: "Date",
            accessor: (row: any) => row.date,
        },
        {
            header: "Type",
            accessor: (row: any) => (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">
                    {row.type.toUpperCase()}
                </span>
            )
        },
        {
            header: "Party / Head",
            accessor: (row: any) => (
                <div className="font-semibold text-foreground">{row.party}</div>
            )
        },
        {
            header: "Amount",
            accessor: (row: any) => `৳ ${row.amount.toLocaleString()}`,
        },
        {
            header: "Narration",
            accessor: (row: any) => row.narration,
        },
        {
            header: "Actions",
            accessor: (row: any) => (
                <div className="flex gap-1">
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
        <Container className="pb-10">
            <div className="space-y-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatsCard title="Total Entries" value={mockEntries.length} icon={BookOpen} color="blue" />
                    <StatsCard title="Today's Entries" value="14" icon={BookOpen} color="orange" />
                    <StatsCard title="Total Volume" value="৳ 3.4M" icon={Receipt} color="green" />
                    <StatsCard title="Pending Checks" value="2" icon={History} color="red" />
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
                        <Input
                            placeholder="Search voucher ID, party name or narration..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant="outline" onClick={() => { }}>
                            Search
                        </Button>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
                        <div className="w-full sm:max-w-[160px]">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="receipt">Receipt</SelectItem>
                                    <SelectItem value="payment">Payment</SelectItem>
                                    <SelectItem value="journal">Journal</SelectItem>
                                    <SelectItem value="contra">Contra</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-full gap-2 sm:max-w-[260px]">
                            <Input type="date" />
                            <Input type="date" />
                        </div>
                        <Button
                            className="bg-black text-white hover:bg-black/90"
                            onClick={() => router.push('/accounting/daily-bookkeeping/create')}
                        >
                            New Entry
                        </Button>
                    </div>
                </div>

                {/* Entry Table */}
                <CustomTable
                    data={mockEntries}
                    columns={columns}
                    isLoading={false}
                    scrollAreaHeight="h-[calc(100vh-320px)]"
                />
            </div>
        </Container>
    );
}
