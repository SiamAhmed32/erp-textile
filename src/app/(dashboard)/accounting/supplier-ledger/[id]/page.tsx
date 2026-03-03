"use client";

import { Container, DateRangeFilter, PageHeader } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetAllQuery, useGetByIdQuery } from "@/store/services/commonApi";
import { format } from "date-fns";
import {
    ArrowDownLeft,
    ArrowUpRight,
    Briefcase,
    CheckCircle2,
    FileText,
    MapPin,
    Printer
} from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

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

const fmt = (n: number) =>
    "৳ " + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

// ── Page ───────────────────────────────────────────────────────────────────────
export default function SupplierLedgerDetailPage() {
    const params = useParams();
    const supplierId = params?.id as string;

    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // Fetch supplier profile
    const { data: supplierData, isLoading: isLoadingSupplier } = useGetByIdQuery({
        path: "suppliers",
        id: supplierId,
    });
    const supplier = (supplierData as any)?.data;

    // Fetch specialized Supplier Ledger API
    const { data: ledgerPayload, isLoading: isLoadingEntries } = useGetAllQuery({
        path: `accounting/ledger/supplier/${supplierId}`,
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
                header: "Amount (৳)",
                className: "text-right",
                accessor: (row: LedgerEntry) => (
                    <div className="text-right">
                        <span className={cn(
                            " text-sm font-bold",
                            row.debit > 0 ? "text-emerald-600" : "text-rose-600"
                        )}>
                            {row.debit > 0 ? "-" : "+"} {fmt(row.debit || row.credit)}
                        </span>
                    </div>
                ),
            },
            {
                header: "Balance (৳)",
                className: "text-right",
                accessor: (row: LedgerEntry) => (
                    <div className="text-right">
                        <span
                            className={cn(
                                " text-sm font-bold",
                                row.balance > 0
                                    ? "text-rose-600"
                                    : row.balance < 0
                                        ? "text-emerald-600"
                                        : "text-zinc-400"
                            )}
                        >
                            {fmt(row.balance)}
                        </span>
                        <span className="text-[10px] text-zinc-400 ml-1">
                            {row.balance > 0 ? "Cr" : row.balance < 0 ? "Dr" : ""}
                        </span>
                    </div>
                ),
            },
        ],
        []
    );

    if (isLoadingSupplier) {
        return (
            <Container className="pb-10">
                <div className="h-64 flex items-center justify-center text-zinc-400 text-sm">
                    Loading supplier profile...
                </div>
            </Container>
        );
    }

    return (
        <Container className="pb-10">
            <PageHeader
                title={supplier?.name || "Supplier Ledger"}
                breadcrumbItems={[
                    { label: "Accounting", href: "/accounting/overview" },
                    { label: "Supplier Ledger", href: "/accounting/supplier-ledger" },
                    { label: supplier?.name || "Detail" },
                ]}
                backHref="/accounting/supplier-ledger"

            />

            {/* Stats - Full Width */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 mt-2">
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                        Total Paid
                    </p>
                    <div className="flex items-center justify-between">
                        <p className="text-3xl font-bold text-emerald-600  ">
                            {fmt(totalDebit)}
                        </p>
                        <ArrowDownLeft className="text-emerald-200 w-8 h-8 opacity-50" />
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">Payments Made</p>
                </div>
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                        Total Billed
                    </p>
                    <div className="flex items-center justify-between">
                        <p className="text-3xl font-bold text-rose-600  ">
                            {fmt(totalCredit)}
                        </p>
                        <ArrowUpRight className="text-rose-200 w-8 h-8 opacity-50" />
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">Accounts Payable</p>
                </div>
                <div
                    className={cn(
                        "rounded-xl p-5 border shadow-sm",
                        closingBalance > 0
                            ? "bg-rose-50 border-rose-200"
                            : closingBalance < 0
                                ? "bg-emerald-50 border-emerald-200"
                                : "bg-zinc-50 border-zinc-200"
                    )}
                >
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                        Balance Owed
                    </p>
                    <p
                        className={cn(
                            "text-3xl font-bold  ",
                            closingBalance > 0
                                ? "text-rose-700"
                                : closingBalance < 0
                                    ? "text-emerald-700"
                                    : "text-zinc-400"
                        )}
                    >
                        {fmt(closingBalance)}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                        {closingBalance > 0
                            ? <span className="text-rose-700 font-medium">We Owe Them (Cr)</span>
                            : closingBalance < 0
                                ? <span className="text-emerald-700 font-medium">Overpaid</span>
                                : "Fully Settled"}
                    </p>
                </div>
            </div>

            {/* Supplier Information Card */}
            <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Supplier Code</p>
                        </div>
                        <p className="text-sm font-bold text-zinc-900">{supplier?.supplierCode || "—"}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-3.5 h-3.5 text-zinc-400" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Contact Details</p>
                        </div>
                        <p className="text-sm font-semibold text-zinc-900">{supplier?.phone}</p>
                        <p className="text-xs text-zinc-500">{supplier?.email}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Location</p>
                        </div>
                        <p className="text-sm font-semibold text-zinc-900">{supplier?.location}</p>
                    </div>
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Business Address</p>
                        </div>
                        <p className="text-xs text-zinc-600 leading-relaxed font-medium">{supplier?.address}</p>
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
