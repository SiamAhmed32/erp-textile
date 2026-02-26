"use client";

import { Container, PageHeader } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllQuery } from "@/store/services/commonApi";
import { format } from "date-fns";
import {
    BookOpen,
    ExternalLink,
    Mail,
    MapPin,
    Phone,
    Search,
    ShieldCheck,
    UserCheck,
    Users,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Buyer } from "./_components/types";


// ── Main Page ──────────────────────────────────────────────────────────────────
export default function BuyerLedgerPage() {
    const [search, setSearch] = useState("");

    const { data: buyerResponse, isLoading } = useGetAllQuery({
        path: "buyers",
        limit: 100,
        search: search || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const buyers = useMemo(() => ((buyerResponse as any)?.data || []) as Buyer[], [buyerResponse]);

    const columns = useMemo(() => [
        {
            header: "Buyer",
            accessor: (row: Buyer) => (
                <div className="flex items-center gap-3 py-1">
                    <div className="size-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600 uppercase shrink-0">
                        {row.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-zinc-900">{row.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                                <UserCheck className="w-3 h-3" /> {row.merchandiser}
                            </span>
                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {row.location}
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "Contact",
            accessor: (row: Buyer) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Mail className="w-3 h-3 text-zinc-300" /> {row.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Phone className="w-3 h-3 text-zinc-300" /> {row.phone}
                    </div>
                </div>
            ),
        },
        {
            header: "Status",
            accessor: (row: Buyer) =>
                !row.isDeleted ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" /> Active
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-400 text-xs font-semibold border border-zinc-200">
                        <XCircle className="w-3 h-3" /> Inactive
                    </span>
                ),
        },
        {
            header: "Onboarded",
            accessor: (row: Buyer) => (
                <span className="text-xs text-zinc-500">
                    {format(new Date(row.createdAt), "dd MMM yyyy")}
                </span>
            ),
        },
        {
            header: "Ledger",
            className: "text-right pr-4",
            accessor: (row: Buyer) => (
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 gap-1.5 text-xs border-zinc-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all"
                    asChild
                >
                    <Link href={`/accounting/buyer-ledger/${row.id}`}>
                        <BookOpen className="w-3.5 h-3.5" />
                        View Ledger
                    </Link>
                </Button>
            ),
        },
    ], []);

    return (
        <Container className="pb-10">
            <PageHeader
                title="Buyer Ledger"
                breadcrumbItems={[
                    { label: "Accounting", href: "/accounting/overview" },
                    { label: "Buyer Ledger" },
                ]}
                actions={
                    <Button
                        variant="outline"
                        className="gap-2 border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-sm"
                        asChild
                    >
                        <Link href="/buyers">
                            <ExternalLink className="w-4 h-4" />
                            Manage Buyers
                        </Link>
                    </Button>
                }
            />

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                        Total Buyers
                    </p>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-zinc-900">
                            {buyers.length}
                        </p>
                        <div className="size-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-2">Active trade accounts</p>
                </div>

                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                        Accounts Receivable
                    </p>
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-indigo-600 font-mono">
                            {/* In a real scenario, this would be fetched from a summary API */}
                            ৳ 0.00
                        </p>
                        <div className="size-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-400 border border-indigo-100">
                            <BookOpen className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-2">Total outstanding payments</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-xl">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                        Quick Actions
                    </p>
                    <div className="flex gap-2 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs h-8"
                            asChild
                        >
                            <Link href="/accounting/overview">
                                Overview
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-zinc-100 border-zinc-200 text-zinc-900 hover:bg-zinc-200 text-xs h-8"
                            onClick={() => window.print()}
                        >
                            Print List
                        </Button>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 bg-zinc-50/50 p-2 rounded-lg border border-zinc-100">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        placeholder="Search by name, merchandiser or location..."
                        className="pl-9 h-10 border-zinc-200 focus-visible:ring-zinc-900"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-zinc-500 bg-white px-3 py-1.5 rounded-md border border-zinc-200 shadow-sm">
                        Showing {buyers.length} Records
                    </p>
                </div>
            </div>

            <CustomTable
                data={buyers}
                columns={columns}
                isLoading={isLoading}
                skeletonRows={8}
                scrollAreaHeight="h-[55vh]"
            />
        </Container>
    );
}
