"use client";

import React, { useMemo, useState } from "react";
import { Container } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileDown,
  Wallet,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ─── Mock data ─────────────────────────────────────────── */
interface Transaction {
  ref: string;
  date: string;
  type: string;
  amount: number;
  balance: number;
  note: string;
}

interface EmployeeIOU {
  id: string;
  name: string;
  designation: string;
  totalIssued: number;
  totalReturned: number;
  outstanding: number;
  lastTransaction: string;
  transactions: Transaction[];
}

const employees: EmployeeIOU[] = [
  {
    id: "1",
    name: "Salim Ahmed",
    designation: "Production Manager",
    totalIssued: 15000,
    totalReturned: 5000,
    outstanding: 10000,
    lastTransaction: "17 Feb 2026",
    transactions: [
      {
        ref: "JE-046",
        date: "15 Feb 2026",
        type: "Advance",
        amount: 15000,
        balance: 15000,
        note: "Travel advance issued",
      },
      {
        ref: "JE-048",
        date: "17 Feb 2026",
        type: "Return",
        amount: -5000,
        balance: 10000,
        note: "Partial return from trip",
      },
    ],
  },
  {
    id: "2",
    name: "Kamal Hossain",
    designation: "Executive (Admin)",
    totalIssued: 8000,
    totalReturned: 8000,
    outstanding: 0,
    lastTransaction: "16 Feb 2026",
    transactions: [
      {
        ref: "JE-044",
        date: "12 Feb 2026",
        type: "Advance",
        amount: 8000,
        balance: 8000,
        note: "Cash advance for supplies",
      },
      {
        ref: "JE-047",
        date: "16 Feb 2026",
        type: "Return",
        amount: -8000,
        balance: 0,
        note: "Fully settled with receipts",
      },
    ],
  },
  {
    id: "3",
    name: "Rina Begum",
    designation: "Support Staff",
    totalIssued: 5000,
    totalReturned: 0,
    outstanding: 5000,
    lastTransaction: "18 Feb 2026",
    transactions: [
      {
        ref: "JE-050",
        date: "18 Feb 2026",
        type: "Advance",
        amount: 5000,
        balance: 5000,
        note: "Petty cash issued",
      },
    ],
  },
];

const fmt = (n: number) => "৳ " + Math.abs(n).toLocaleString("en-IN");

import { useGetByIdQuery, useGetAllQuery } from "@/store/services/commonApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function CashBookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // 1. Fetch Employee Summary for Stats
  const { data: summaryResponse, isLoading: isSummaryLoading } = useGetByIdQuery({
    path: "moi-cash-books/employee",
    id: `${id}/summary`,
  });

  const employee = summaryResponse?.data;

  // 2. Fetch Transaction History
  const { data: transactionsResponse, isLoading: isTxLoading } = useGetAllQuery({
    path: `moi-cash-books/employee/${id}`,
    filters: {
      startDate: dateRange.start,
      endDate: dateRange.end,
    },
  });

  const transactions = transactionsResponse?.data || [];

  const detailColumns = useMemo(
    () => [
      {
        header: "Ref No",
        accessor: (row: any) => row.journalEntry?.voucherNo || row.id.slice(0, 8),
      },
      {
        header: "Date",
        accessor: (row: any) => new Date(row.createdAt).toLocaleDateString(),
      },
      {
        header: "Type",
        accessor: (row: any) => (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              row.type === "SETTLE"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600",
            )}
          >
            {row.type}
          </span>
        ),
      },
      {
        header: "Amount",
        accessor: (row: any) => (
          <span
            className={cn(
              "font-mono font-bold",
              row.type === "ISSUE" ? "text-amber-600" : "text-emerald-700",
            )}
          >
            {row.type === "ISSUE" ? "+" : "-"}
            {fmt(row.amount)}
          </span>
        ),
      },
      {
        header: "Note",
        accessor: (row: any) => row.note || row.journalEntry?.narration || "N/A",
      },
    ],
    [],
  );

  if (!isSummaryLoading && !employee) {
    return (
      <Container className="pb-10">
        <div className="space-y-4">
          <Link href="/accounting/cash-book">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <p className="text-muted-foreground">Employee not found.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pb-10">
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Employee"
            value={employee?.name || ""}
            icon={Wallet}
            loading={isSummaryLoading}
          />
          <StatsCard
            title="Total Advanced"
            value={fmt(employee?.totalIssuedAmount || 0)}
            icon={Wallet}
            loading={isSummaryLoading}
          />
          <StatsCard
            title="Settled"
            value={fmt(employee?.totalReturnedAmount || 0)}
            icon={CheckCircle2}
            loading={isSummaryLoading}
          />
          <StatsCard
            title="Outstanding"
            value={fmt(employee?.outstandingAmount || 0)}
            icon={AlertCircle}
            loading={isSummaryLoading}
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/accounting/cash-book">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </Link>
            <div>
              <h3 className="font-bold text-lg text-foreground leading-tight">
                {isSummaryLoading ? <Skeleton className="h-6 w-32" /> : employee?.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isSummaryLoading ? <Skeleton className="h-4 w-24" /> : employee?.designation}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
            <div className="flex w-full gap-2 sm:max-w-[260px]">
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <Button className="bg-black text-white hover:bg-black/90">
              <FileDown className="size-4 mr-2" /> Export PDF
            </Button>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
          {isTxLoading ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <CustomTable
              data={transactions}
              columns={detailColumns}
              scrollAreaHeight="h-[calc(100vh-320px)]"
            />
          )}
        </div>
      </div>
    </Container>
  );
}
