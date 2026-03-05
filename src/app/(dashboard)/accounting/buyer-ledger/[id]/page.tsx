"use client";

import { Container, DateRangeFilter, PageHeader } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Button } from "@/components/ui/button";
import { useGetAllQuery, useGetByIdQuery } from "@/store/services/commonApi";
import { format } from "date-fns";
import {
    ArrowDownLeft,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    FileText,
    MapPin,
    Printer,
    Plus,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────
interface LedgerEntry {
    id: string;
    date: string;
    voucherNo: string;
    category: string;
    narration: string;
    accountName: string;
    debitedAccountName: string;
    debit: number;
    credit: number;
    balance: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
    "৳ " + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

// ── Page ───────────────────────────────────────────────────────────────────────
export default function BuyerLedgerDetailPage() {
    const params = useParams();
    const buyerId = params?.id as string;

    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // Fetch buyer profile
    const { data: buyerData, isLoading: isLoadingBuyer } = useGetByIdQuery({
        path: "buyers",
        id: buyerId,
    });
    const buyer = (buyerData as any)?.data;

    // Fetch dedicated Ledger API for this buyer
    const { data: ledgerPayload, isLoading: isLoadingEntries } = useGetAllQuery({
        path: `accounting/ledger/buyer/${buyerId}`,
        limit: 500,
        filters: {
            ...(dateFrom ? { startDate: dateFrom } : {}),
            ...(dateTo ? { endDate: dateTo } : {}),
        },
    });

    const rows = useMemo(() => {
        const payload = (ledgerPayload as any)?.data;
        if (Array.isArray(payload?.data)) return payload.data as LedgerEntry[];
        if (Array.isArray(payload)) return payload as LedgerEntry[];
        return [] as LedgerEntry[];
    }, [ledgerPayload]);

    const { totalDebit, totalCredit, closingBalance } = useMemo(() => {
        let td = 0;
        let tc = 0;
        const cb = rows.length > 0 ? rows[rows.length - 1].balance : 0;

        rows.forEach((row) => {
            td += row.debit;
            tc += row.credit;
        });

        return { totalDebit: td, totalCredit: tc, closingBalance: cb };
    }, [rows]);

    const columns = useMemo(
        () => [
            {
                header: "Date",
                accessor: (row: LedgerEntry) => (
                    <span className="text-xs text-zinc-500 whitespace-nowrap">
                        {format(new Date(row.date), "dd MMM yyyy")}
                    </span>
                ),
            },
            {
                header: "Voucher",
                accessor: (row: LedgerEntry) => (
                    <span className=" text-sm font-semibold text-zinc-900">
                        {row.voucherNo}
                    </span>
                ),
            },
            {
                header: "Account",
                accessor: (row: LedgerEntry) => (
                    <span className="text-sm font-medium text-zinc-700">
                        {row.debitedAccountName}
                    </span>
                ),
            },
            {
                header: "Category",
                accessor: (row: LedgerEntry) => (
                    <span className="text-xs font-medium text-zinc-600 capitalize">
                        {row.category.replace("_", " ")}
                    </span>
                ),
            },
            {
                header: "Narration",
                accessor: (row: LedgerEntry) => (
                    <span className="text-sm text-zinc-500 max-w-[200px] truncate block">
                        {row.narration || <span className="text-zinc-300 italic">—</span>}
                    </span>
                ),
            },
            {
                header: "Buyer Amount (৳)",
                className: "text-right",
                accessor: (row: LedgerEntry) => (
                    <div className="text-right">
                        <span className={cn(
                            " text-sm font-bold",
                            row.debit > 0 ? "text-indigo-600" : "text-emerald-600"
                        )}>
                            {fmt(row.debit || row.credit)}
                        </span>
                    </div>
                ),
            },
        ],
        []
    );

    if (isLoadingBuyer) {
        return (
            <Container className="pb-10">
                <div className="h-64 flex items-center justify-center text-zinc-400 text-sm">
                    Loading buyer profile...
                </div>
            </Container>
        );
    }

    return (
        <Container className="pb-10">
            <PageHeader
                title={buyer?.name || "Buyer Ledger"}
                breadcrumbItems={[
                    { label: "Accounting", href: "/accounting/overview" },
                    { label: "Buyer Ledger", href: "/accounting/buyer-ledger" },
                    { label: buyer?.name || "Detail" },
                ]}
                backHref="/accounting/buyer-ledger"

            />



            {/* Buyer Information Card */}
            <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Merchandiser</p>
                        </div>
                        <p className="text-sm font-bold text-zinc-900">{buyer?.merchandiser || "—"}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-3.5 h-3.5 text-zinc-400" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Contact Details</p>
                        </div>
                        <p className="text-sm font-semibold text-zinc-900">{buyer?.phone}</p>
                        <p className="text-xs text-zinc-500">{buyer?.email}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Location</p>
                        </div>
                        <p className="text-sm font-semibold text-zinc-900">{buyer?.location}</p>
                    </div>
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Business Address</p>
                        </div>
                        <p className="text-xs text-zinc-600 leading-relaxed font-medium">{buyer?.address}</p>
                    </div>
                </div>
            </div>

            {/* Action Filters & Transaction Table */}
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Transaction History
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                <CheckCircle2 className="w-3 h-3" /> POSTED
                            </span>
                            <span className="text-zinc-200">|</span>
                            <span className="text-xs text-zinc-400">
                                {rows.length} entries
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <DateRangeFilter
                            start={dateFrom}
                            end={dateTo}
                            onFilterChange={({ start, end }) => {
                                setDateFrom(start);
                                setDateTo(end);
                            }}
                            placeholder="Filter by Date"
                        />
                        <Button
                            variant="outline"
                            className="gap-2 border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                            onClick={() => window.print()}
                        >
                            <Printer className="w-4 h-4" />
                            Print
                        </Button>
                    </div>
                </div>

                <div className="mt-2">
                    <CustomTable
                        data={rows}
                        columns={columns}
                        isLoading={isLoadingEntries}
                        skeletonRows={6}
                        scrollAreaHeight="h-[52vh]"
                    />
                </div>



            </div>

        </Container>
    );
}
