"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Download,
  User,
  List,
  Plus,
  Wallet,
  ShieldCheck,
  History,
} from "lucide-react";
import { Container, PageHeader, DetailsSkeleton } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useGetByIdQuery, useGetAllQuery } from "@/store/services/commonApi";
import { cn } from "@/lib/utils";
import TransactionEntryModal from "../_components/TransactionEntryModal";

const fmt = (n: number) =>
  "TK " + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

export default function CashBookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // 1. Fetch Staff Summary
  const { data: summaryResponse, isLoading: isSummaryLoading } =
    useGetByIdQuery({
      path: "moi-cash-books/employee",
      id: `${id}/summary`,
    });

  const staff = summaryResponse?.data;

  // 2. Fetch Transaction History
  const { data: transactionsResponse, isLoading: isTxLoading } = useGetAllQuery(
    {
      path: `moi-cash-books/employee/${id}`,
      filters: {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
    },
  );

  const transactions = transactionsResponse?.data || [];

  if (isSummaryLoading) {
    return (
      <Container className="pb-10 pt-6">
        <DetailsSkeleton />
      </Container>
    );
  }

  if (!staff) {
    return (
      <Container className="pb-10 pt-6">
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm border-dashed">
          <p className="text-muted-foreground font-medium">Record not found.</p>
          <Link href="/accounting/cash-book" className="mt-4 inline-block">
            <Button variant="outline" className="border-slate-200">
              Back to List
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pb-10 pt-6 space-y-6">
      <PageHeader
        title={`${staff.name}'s Ledger`}
        backHref="/accounting/cash-book"
        breadcrumbItems={[
          { label: "Accounting", href: "/accounting/overview" },
          { label: "Cash Book", href: "/accounting/cash-book" },
          { label: staff.name },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 border-slate-200 shadow-sm h-10 font-bold px-5"
              onClick={() => window.print()}
            >
              <Download className="h-4 w-4" />
              Export Statement
            </Button>
            <Button
              className="bg-black text-white hover:bg-black/90 shadow-sm h-10 px-6 font-bold"
              onClick={() => setIsEntryModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </div>
        }
      />

      <div className="grid gap-6">
        {/* Staff Overview Card */}
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b py-3 px-6">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                <User className="h-3.5 w-3.5" />
                Staff Information
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100 uppercase">
                <ShieldCheck className="h-3 w-3" />
                Verified Member
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8 py-8 px-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
                Designation
              </p>
              <p className="font-semibold text-slate-900 border-l-2 border-slate-200 pl-3">
                {staff.designation || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
                Total Advanced
              </p>
              <p className="font-semibold text-slate-900 border-l-2 border-slate-200 pl-3">
                {fmt(staff.totalIssuedAmount || 0)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest text-emerald-600">
                Total Settled
              </p>
              <p className="font-semibold text-emerald-600 border-l-2 border-emerald-200 pl-3">
                {fmt(staff.totalReturnedAmount || 0)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
                Outstanding Balance
              </p>
              <p
                className={cn(
                  "font-bold border-l-2 pl-3",
                  (staff.outstandingAmount || 0) > 0
                    ? "text-rose-600 border-rose-200"
                    : "text-indigo-600 border-indigo-200",
                )}
              >
                {fmt(staff.outstandingAmount || 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History Card */}
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-6 bg-slate-50/50 border-b">
            <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
              <History className="h-3.5 w-3.5" />
              Transaction Ledger
            </CardTitle>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="h-8 rounded-md border border-slate-200 px-3 text-[10px] font-bold uppercase focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-sm"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
              />
              <span className="text-[10px] text-muted-foreground font-black mx-1">
                TO
              </span>
              <input
                type="date"
                className="h-8 rounded-md border border-slate-200 px-3 text-[10px] font-bold uppercase focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-sm"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/30 hover:bg-slate-50/30 border-b transition-none">
                  <TableHead className="font-bold text-[11px] text-slate-600 h-10 px-6 uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="font-bold text-[11px] text-slate-600 h-10 uppercase tracking-wider">
                    Ref / Voucher
                  </TableHead>
                  <TableHead className="font-bold text-[11px] text-slate-600 h-10 uppercase tracking-wider">
                    Type
                  </TableHead>
                  <TableHead className="font-bold text-[11px] text-slate-600 h-10 uppercase tracking-wider">
                    Narration / Purpose
                  </TableHead>
                  <TableHead className="text-right font-bold text-[11px] text-slate-600 h-10 px-6 uppercase tracking-wider">
                    Amount (TK)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isTxLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell
                        colSpan={5}
                        className="h-12 animate-pulse bg-slate-50/10"
                      />
                    </TableRow>
                  ))
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-slate-400 text-[10px] uppercase tracking-widest font-bold"
                    >
                      Empty Transaction Set
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx: any) => (
                    <TableRow
                      key={tx.id}
                      className="hover:bg-slate-50/40 transition-colors border-b last:border-0"
                    >
                      <TableCell className="text-xs px-6 font-medium text-slate-600 whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-400 uppercase">
                        {tx.voucherNo ||
                          `CB-${tx.id.slice(0, 6).toUpperCase()}`}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center rounded px-2.5 py-0.5 text-[10px] font-bold uppercase border leading-none",
                            tx.type === "SETTLE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : tx.type === "ISSUE"
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : "bg-slate-100 text-slate-700 border-slate-200",
                          )}
                        >
                          {tx.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col py-2">
                          <span className="text-xs font-semibold text-slate-800">
                            {tx.purpose}
                          </span>
                          {tx.remarks && (
                            <span className="text-[10px] text-slate-400 font-medium italic truncate max-w-[300px]">
                              {tx.remarks}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-bold px-6 text-sm",
                          tx.type === "ISSUE"
                            ? "text-slate-900"
                            : "text-emerald-700",
                        )}
                      >
                        {tx.type === "ISSUE" ? "+" : "-"}{" "}
                        {Math.abs(tx.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <TransactionEntryModal
        open={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        defaultEmployeeId={id}
      />
    </Container>
  );
}
