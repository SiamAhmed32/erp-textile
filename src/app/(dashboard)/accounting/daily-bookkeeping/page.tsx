"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, SquarePen, Trash2 } from "lucide-react";

// Mock Data for Journal Entries
const mockEntries = [
    { id: 'JE-2024-001', date: '2024-02-18', type: 'Customer Due', party: 'Rahim Corp', amount: 75000, narration: 'Sold goods on credit', status: 'Posted' },
    { id: 'JE-2024-002', date: '2024-02-17', type: 'Expense', party: 'Office Expense', amount: 5000, narration: 'Monthly office rent', status: 'Posted' },
    { id: 'JE-2024-003', date: '2024-02-16', type: 'Receipt', party: 'Karim Traders', amount: 30000, narration: 'Payment received', status: 'Posted' },
];

export default function DailyBookkeepingList() {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const columns = useMemo(() => [
        {
            header: "Entry ID",
            accessor: (row: any) => <span className="font-mono text-xs">{row.id}</span>
        },
        {
            header: "Date",
            accessor: (row: any) => row.date
        },
        {
            header: "Type",
            accessor: (row: any) => row.type
        },
        {
            header: "Party / Head",
            accessor: (row: any) => <span className="font-medium">{row.party}</span>
        },
        {
            header: "Amount",
            accessor: (row: any) => <span className="font-mono">৳ {row.amount.toLocaleString()}</span>
        },
        {
            header: "Narration",
            accessor: (row: any) => row.narration
        },
        {
            header: "Actions",
            className: "text-left w-40 pr-4",
            accessor: (row: any) => (
                <div className="flex justify-end gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        title="View Detail"
                        className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        title="Edit"
                        className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SquarePen className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        title="Delete"
                        className="h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        }
    ], []);

    return (
        <Container className="py-8">
            <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex w-full max-w-sm items-center gap-2">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search entry"
                            className="w-full"
                        />
                        <Button variant="outline" className="shrink-0">
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </div>
                    <Button
                        onClick={() => router.push('/accounting/daily-bookkeeping/create')}
                        className="bg-black text-white hover:bg-black/90"
                    >
                        New Entry
                    </Button>
                </div>

                <CustomTable
                    data={mockEntries}
                    columns={columns}
                    isLoading={false}
                    pagination={{
                        currentPage: 1,
                        totalPages: 1,
                        onPageChange: () => { }
                    }}
                    scrollAreaHeight="h-[calc(100vh-350px)]"
                />
            </div>
        </Container>
    );
}
