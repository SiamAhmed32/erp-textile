"use client";

import {
  Container,
  DateRangeFilter,
  PageHeader,
  SearchBar,
} from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useGetAllQuery } from "@/store/services/commonApi";
import { ArrowUpDown, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import TransactionEntryModal from "./_components/TransactionEntryModal";

const fmt = (n: number) =>
  "TK " + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

export default function CashBookPage() {
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "createdAt",
    dir: "desc",
  });

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const handleSearchSubmit = () => {
    setDebouncedSearch(searchInput);
    setPage(1);
  };

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
    search: debouncedSearch || undefined,
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
          <div className="flex items-center gap-2">
            <Button
              className="bg-black text-white hover:bg-black/90 shadow-sm h-9 sm:h-10 px-3 sm:px-6 font-semibold text-xs sm:text-sm"
              onClick={() => setIsEntryModalOpen(true)}
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Record Transaction</span>
              <span className="sm:hidden">Record</span>
            </Button>
          </div>
        }
      />

      <div className="space-y-4">
        {/* Toolbar — Search + DateRange + Sort (2 filters → 2 rows on tablet/mobile) */}
        <div className="flex flex-col gap-3 py-2 mb-2">
          {/* DESKTOP VIEW (>1280px): Single row */}
          <div className="hidden xl:flex items-center justify-between gap-3">
            <SearchBar
              placeholder="Search staff members..."
              value={searchInput}
              onChange={setSearchInput}
              onSearch={handleSearchSubmit}
              containerClassName="max-w-[350px]"
            />
            <div className="flex items-center gap-2">
              <DateRangeFilter
                start={dateRange.start}
                end={dateRange.end}
                onFilterChange={(range) => {
                  setDateRange(range);
                  setPage(1);
                }}
                className="h-11 text-xs"
              />

              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-11 shadow-sm shrink-0">
                <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1">
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
                  <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-xs font-semibold uppercase tracking-wider w-[140px]">
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

          {/* TABLET & MOBILE VIEW (<1280px) */}
          <div className="flex xl:hidden flex-col gap-2 sm:gap-3">
            {/* Row 1: Search + Sort */}
            <div className="flex items-center gap-2">
              <SearchBar
                placeholder="Search staff members..."
                value={searchInput}
                onChange={setSearchInput}
                onSearch={handleSearchSubmit}
                showButton
                inputClassName="h-10 sm:h-11"
              />
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 sm:px-3 h-10 sm:h-11 shadow-sm shrink-0">
                <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="hidden sm:block text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1">
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
                  <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-[10px] sm:text-xs font-semibold uppercase tracking-wider w-[80px] sm:w-[130px]">
                    <SelectValue placeholder="Sort" />
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

            {/* Row 2: Date Range */}
            <div className="flex items-center gap-2">
              <DateRangeFilter
                start={dateRange.start}
                end={dateRange.end}
                onFilterChange={(range) => {
                  setDateRange(range);
                  setPage(1);
                }}
                className="h-10 sm:h-11 text-[10px] sm:text-xs flex-1"
              />
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
