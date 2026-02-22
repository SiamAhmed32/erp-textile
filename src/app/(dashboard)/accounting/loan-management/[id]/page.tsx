"use client";

import React, { useMemo } from "react";
import { Container } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Landmark,
  CheckCircle2,
  TrendingDown,
  ArrowLeft,
  Banknote,
  FileDown,
} from "lucide-react";
import Link from "next/link";

/* ─── Mock ──────────────────────────────────────────────── */
interface ScheduleItem {
  no: number;
  date: string;
  principalAmount: number;
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
  principalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
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
    principalAmount: 500000,
    paidAmount: 133716,
    outstandingAmount: 366284,
    startDate: "Jan 2025",
    status: "active",
    schedule: [
      {
        no: 1,
        date: "Mar 2025",
        principalAmount: 10000,
        interest: 3958,
        total: 13958,
        balance: 490000,
        status: "paid",
      },
      {
        no: 2,
        date: "Jun 2025",
        principalAmount: 10000,
        interest: 3879,
        total: 13879,
        balance: 480000,
        status: "paid",
      },
      {
        no: 3,
        date: "Sep 2025",
        principalAmount: 10000,
        interest: 3800,
        total: 13800,
        balance: 470000,
        status: "paid",
      },
      {
        no: 4,
        date: "Dec 2025",
        principalAmount: 10000,
        interest: 3721,
        total: 13721,
        balance: 460000,
        status: "paid",
      },
      {
        no: 5,
        date: "Mar 2026",
        principalAmount: 10000,
        interest: 3642,
        total: 13642,
        balance: 450000,
        status: "upcoming",
      },
      {
        no: 6,
        date: "Jun 2026",
        principalAmount: 10000,
        interest: 3563,
        total: 13563,
        balance: 440000,
        status: "upcoming",
      },
    ],
  },
  {
    id: "L2",
    lender: "Mr. Rahman (Director)",
    type: "director",
    interestRate: 0,
    principalAmount: 200000,
    paidAmount: 66667,
    outstandingAmount: 133333,
    startDate: "Jul 2025",
    status: "active",
    schedule: [
      {
        no: 1,
        date: "Oct 2025",
        principalAmount: 33333,
        interest: 0,
        total: 33333,
        balance: 166667,
        status: "paid",
      },
      {
        no: 2,
        date: "Jan 2026",
        principalAmount: 33334,
        interest: 0,
        total: 33334,
        balance: 133333,
        status: "paid",
      },
      {
        no: 3,
        date: "Apr 2026",
        principalAmount: 33333,
        interest: 0,
        total: 33333,
        balance: 100000,
        status: "upcoming",
      },
      {
        no: 4,
        date: "Jul 2026",
        principalAmount: 33333,
        interest: 0,
        total: 33333,
        balance: 66667,
        status: "upcoming",
      },
      {
        no: 5,
        date: "Oct 2026",
        principalAmount: 33334,
        interest: 0,
        total: 33334,
        balance: 33333,
        status: "upcoming",
      },
      {
        no: 6,
        date: "Jan 2027",
        principalAmount: 33333,
        interest: 0,
        total: 33333,
        balance: 0,
        status: "upcoming",
      },
    ],
  },
];

const fmt = (n: number) => "৳ " + Math.abs(n).toLocaleString("en-IN");

export default function LoanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const loan = loans.find((l) => l.id === id);

  const detailColumns = useMemo(
    () => [
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
        accessor: (row: ScheduleItem) => (
          <span className="font-mono font-bold text-slate-700">
            {fmt(row.principalAmount)}
          </span>
        ),
      },
      {
        header: "Interest",
        accessor: (row: ScheduleItem) => (
          <span className="text-amber-600 font-medium">
            {row.interest > 0 ? fmt(row.interest) : "—"}
          </span>
        ),
      },
      {
        header: "Total",
        accessor: (row: ScheduleItem) => (
          <span className="font-bold text-slate-900">{fmt(row.total)}</span>
        ),
      },
      {
        header: "Balance",
        accessor: (row: ScheduleItem) => (
          <span className="text-slate-500">{fmt(row.balance)}</span>
        ),
      },
      {
        header: "Status",
        accessor: (row: ScheduleItem) => (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              row.status === "paid"
                ? "bg-emerald-50 text-emerald-600"
                : row.status === "overdue"
                  ? "bg-red-50 text-red-600"
                  : "bg-slate-100 text-slate-500"
            }`}
          >
            {row.status.toUpperCase()}
          </span>
        ),
      },
    ],
    [],
  );

  if (!loan) {
    return (
      <Container className="pb-10 text-center py-20">
        <p className="text-muted-foreground">Loan record not found.</p>
        <Link href="/accounting/loan-management">
          <Button variant="outline" size="sm" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="pb-10">
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Principal Amount"
            value={fmt(loan.principalAmount)}
            icon={Landmark}
            color="blue"
          />
          <StatsCard
            title="Interest Rate"
            value={`${loan.interestRate}% APR`}
            icon={Landmark}
            color="orange"
          />
          <StatsCard
            title="Paid Amount"
            value={fmt(loan.paidAmount)}
            icon={CheckCircle2}
            color="green"
          />
          <StatsCard
            title="Outstanding Amount"
            value={fmt(loan.outstandingAmount)}
            icon={TrendingDown}
            color="red"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/accounting/loan-management">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="size-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                <Banknote className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 leading-tight">
                  {loan.lender}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {loan.type.toUpperCase()} FACILITY
                </p>
              </div>
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
          data={loan.schedule}
          columns={detailColumns}
          scrollAreaHeight="h-[calc(100vh-320px)]"
        />
      </div>
    </Container>
  );
}
