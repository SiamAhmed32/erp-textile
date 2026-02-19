"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, SquarePen, Trash2, BookOpen, Receipt, History, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomModal } from "@/components/reusables";

const mockEntries = [
    { id: 'JE-2024-001', date: '18 Feb 2026', type: 'Customer Due', party: 'Rahim Corp', amount: 75000, narration: 'Sold goods on credit', status: 'Posted' },
    { id: 'JE-2024-002', date: '17 Feb 2026', type: 'Expense', party: 'Office Expense', amount: 5000, narration: 'Monthly office rent', status: 'Posted' },
    { id: 'JE-2024-003', date: '16 Feb 2026', type: 'Receipt', party: 'Karim Traders', amount: 30000, narration: 'Payment received', status: 'Posted' },
];

function JournalEntryDetailsModal({ open, onClose, entry }: { open: boolean; onClose: () => void; entry: any }) {
    if (!entry) return null;

    return (
        <CustomModal
            open={open}
            onOpenChange={(val) => { if (!val) onClose(); }}
            title="Journal Entry Details"
            maxWidth="600px"
        >
            <div className="space-y-4 py-2">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Entry ID</p>
                        <p className="text-base font-black text-slate-900">{entry.id}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Date</p>
                        <p className="text-sm font-bold text-slate-700">{entry.date}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Type</p>
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                            {entry.type}
                        </span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Party / Head</p>
                        <p className="text-sm font-bold text-slate-900">{entry.party}</p>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Narration</p>
                    <p className="text-sm text-slate-600 italic">"{entry.narration}"</p>
                </div>

                <div className="flex justify-between items-center pt-2">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</p>
                        <p className="text-2xl font-black text-secondary">৳ {entry.amount.toLocaleString()}</p>
                    </div>
                    <Button onClick={onClose} className="bg-secondary text-white">
                        Close
                    </Button>
                </div>
            </div>
        </CustomModal>
    );
}

export default function DailyBookkeepingList() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<any>(null);

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
                <div className="flex gap-1 justify-end pr-4">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
                        onClick={() => {
                            setSelectedEntry(row);
                            setIsDetailsModalOpen(true);
                        }}
                    >
                        <Eye className="h-4 w-4" />
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

                <CustomTable
                    data={mockEntries}
                    columns={columns}
                    isLoading={false}
                    scrollAreaHeight="h-[calc(100vh-320px)]"
                />
            </div>

            <JournalEntryDetailsModal
                open={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                entry={selectedEntry}
            />
        </Container>
    );
}
