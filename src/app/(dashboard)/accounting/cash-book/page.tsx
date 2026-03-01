"use client";

import React, { useMemo, useState } from "react";
import {
  Container,
  InputField,
  DateRangeFilter,
  PageHeader,
} from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, History, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGetAllQuery } from "@/store/services/commonApi";
import TransactionEntryModal from "./_components/TransactionEntryModal";

const fmt = (n: number) =>
  "TK " + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

export default function CashBookPage() {
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const { data: apiResponse, isFetching: loading } = useGetAllQuery({
    path: "moi-cash-books/summaries",
    search,
    filters: {
      startDate: dateRange.start,
      endDate: dateRange.end,
    },
  });

  const staffMembers = useMemo(() => apiResponse?.data || [], [apiResponse]);

  const columns = useMemo(
    () => [
      {
        header: "Staff / Beneficiary",
        accessor: (row: any) => (
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm uppercase">
              {row.name}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              {row.designation}
            </span>
          </div>
        ),
      },
      {
        header: "Total Advanced",
        accessor: (row: any) => (
          <span className="text-sm font-medium">
            {fmt(row.totalIssuedAmount || 0)}
          </span>
        ),
      },
      {
        header: "Total Settled",
        accessor: (row: any) => (
          <span className="text-sm font-medium text-emerald-600">
            {fmt(row.totalReturnedAmount || 0)}
          </span>
        ),
      },
      {
        header: "Current Outstanding",
        accessor: (row: any) => (
          <span
            className={cn(
              "text-sm font-bold",
              (row.outstandingAmount || 0) > 0
                ? "text-rose-600"
                : "text-indigo-600",
            )}
          >
            {fmt(row.outstandingAmount || 0)}
          </span>
        ),
      },
      {
        header: "Last Activity",
        accessor: (row: any) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {row.lastTransaction
              ? new Date(row.lastTransaction).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "No activity"}
          </span>
        ),
      },
      {
        header: "Actions",
        className: "text-right pr-4",
        accessor: (row: any) => (
          <div className="flex items-center justify-end gap-2">
            <Link href={`/accounting/cash-book/${row.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-bold gap-1.5 border-slate-200"
              >
                <Eye className="h-3.5 w-3.5" />
                VIEW LEDGER
              </Button>
            </Link>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <Container className="pb-10 pt-4">
      <PageHeader
        title="MOI (Staff Cash Book)"
        description="Monitor advances, settlements and expenses for existing staff members."
        breadcrumbItems={[
          { label: "Accounting", href: "/accounting/overview" },
          { label: "Cash Book" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              className="bg-black text-white hover:bg-black/90 shadow-sm h-10 px-6 font-semibold"
              onClick={() => setIsEntryModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Record Transaction
            </Button>
          </div>
        }
      />

      <div className="space-y-4">
        {/* Filters Row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-2">
          <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 bg-white border-slate-200 rounded-lg pl-10 shadow-sm"
              />
            </div>
            <Button
              variant="outline"
              className="text-slate-500 h-11 border-slate-200 px-4"
              title="Audit Trail"
            >
              <History className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
            <DateRangeFilter
              start={dateRange.start}
              end={dateRange.end}
              onFilterChange={setDateRange}
            />
          </div>
        </div>

        {/* Table - Standard Design */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <CustomTable
            data={staffMembers}
            columns={columns}
            isLoading={loading}
            scrollAreaHeight="h-[calc(100vh-320px)]"
          />
        </div>
      </div>

      <TransactionEntryModal
        open={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
      />
    </Container>
  );
}
