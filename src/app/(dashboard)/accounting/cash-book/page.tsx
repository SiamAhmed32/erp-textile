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
import { Search, Plus, History, Eye, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGetAllQuery } from "@/store/services/commonApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionEntryModal from "./_components/TransactionEntryModal";

const fmt = (n: number) =>
  "TK " + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

export default function CashBookPage() {
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "createdAt",
    dir: "desc",
  });

  const sortOptions = [
    {
      value: "createdAt_desc",
      label: "Newest First",
      field: "createdAt",
      dir: "desc",
    },
    {
      value: "createdAt_asc",
      label: "Oldest First",
      field: "createdAt",
      dir: "asc",
    },
    {
      value: "updatedAt_desc",
      label: "Recently Updated",
      field: "updatedAt",
      dir: "desc",
    },
    { value: "name_asc", label: "Name (A-Z)", field: "name", dir: "asc" },
  ];

  const currentSortValue =
    sortOptions.find((opt) => opt.field === sort.field && opt.dir === sort.dir)
      ?.value || "createdAt_desc";

  const handleSortChange = (newSort: {
    field: string;
    dir: "asc" | "desc";
  }) => {
    setSort(newSort);
    setPage(1);
  };

  const { data: apiResponse, isFetching: loading } = useGetAllQuery({
    path: "moi-cash-books/summaries",
    page,
    limit: 10,
    search,
    sortBy: sort.field,
    sortOrder: sort.dir,
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
        breadcrumbItems={[
          { label: "Accounting", href: "/accounting/overview" },
          { label: "Cash Book" },
        ]}
        actions={
          <div className="items-center gap-2 hidden lg:flex">
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
              <Input
                placeholder="Search staff members..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-11 bg-white border-slate-200 rounded-lg shadow-sm"
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
              onFilterChange={(range) => {
                setDateRange(range);
                setPage(1);
              }}
            />

            {/* Sort Group */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-11 shadow-sm shrink-0">
              <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1">
                Sort By
              </span>
              <Select
                value={currentSortValue}
                onValueChange={(val) => {
                  const opt = sortOptions.find((o) => o.value === val);
                  if (opt)
                    handleSortChange({
                      field: opt.field,
                      dir: opt.dir as "asc" | "desc",
                    });
                }}
              >
                <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-xs font-bold uppercase tracking-wider w-[140px]">
                  <SelectValue placeholder="Newest First" />
                </SelectTrigger>
                <SelectContent
                  align="end"
                  className="rounded-xl shadow-xl border-slate-200"
                >
                  {sortOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs font-semibold py-2.5"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <CustomTable
          data={staffMembers}
          columns={columns}
          isLoading={loading}
          pagination={{
            currentPage: page,
            totalPages: (apiResponse as any)?.meta?.pagination?.totalPages || 1,
            onPageChange: setPage,
          }}
          scrollAreaHeight="h-[calc(100vh-320px)]"
        />
      </div>

      <TransactionEntryModal
        open={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
      />
    </Container>
  );
}
