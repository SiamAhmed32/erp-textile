"use client";

import { Container, PageHeader, SearchBar } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useGetAllQuery } from "@/store/services/commonApi";
import { format } from "date-fns";
import { BookOpen, ExternalLink, Users, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Buyer } from "./_components/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function BuyerLedgerPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "createdAt",
    dir: "desc",
  });

  const handleSearchSubmit = () => {
    // Search is applied from current input value.
    setPage(1);
  };

  const { data: buyerResponse, isLoading } = useGetAllQuery({
    path: "accounting/ledger/buyers/balances",
    page,
    limit: 10,
    search: searchInput.trim() || undefined,
    sortBy: sort.field,
    sortOrder: sort.dir,
  });

  const buyers = useMemo(
    () =>
      ((buyerResponse as any)?.data ||
        (buyerResponse as any)?.data?.data ||
        []) as any[],
    [buyerResponse],
  );

  const totalPages = useMemo(() => {
    const meta =
      (buyerResponse as any)?.meta || (buyerResponse as any)?.data?.meta;
    return meta?.pagination?.totalPages || meta?.totalPages || 1;
  }, [buyerResponse]);

  const visibleBuyers = useMemo(() => {
    let rows = [...buyers];
    const query = searchInput.trim().toLowerCase();

    if (query) {
      rows = rows.filter((row: any) =>
        [row.name, row.email, row.merchandiser, row.location, row.phone]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query)),
      );
    }

    rows.sort((a: any, b: any) => {
      const dir = sort.dir === "asc" ? 1 : -1;

      if (sort.field === "createdAt" || sort.field === "updatedAt") {
        const aTime = new Date(a?.[sort.field] ?? 0).getTime();
        const bTime = new Date(b?.[sort.field] ?? 0).getTime();
        if (aTime !== bTime) return (aTime - bTime) * dir;
        const byName = String(a?.name || "").localeCompare(
          String(b?.name || ""),
        );
        if (byName !== 0) return byName * dir;
        return String(a?.id || "").localeCompare(String(b?.id || "")) * dir;
      }

      return String(a?.name || "").localeCompare(String(b?.name || "")) * dir;
    });

    return rows;
  }, [buyers, searchInput, sort]);

  const columns = useMemo(
    () => [
      {
        header: "Buyer",
        accessor: (row: any) => (
          <div className="flex items-center gap-3 py-1">
            <div className="size-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600 uppercase shrink-0">
              {row.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-sm text-zinc-900">{row.name}</p>
            </div>
          </div>
        ),
      },
      {
        header: "Phone",
        accessor: (row: any) => (
          <div className="text-xs text-zinc-600 font-medium">{row.phone}</div>
        ),
      },
      {
        header: "Location",
        accessor: (row: any) => (
          <div className="text-xs text-zinc-500">{row.location}</div>
        ),
      },
      {
        header: "Total Received",
        accessor: (row: any) => (
          <div className=" font-bold text-sm text-emerald-600">
            ৳{" "}
            {(Number(row.totalReceived) || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </div>
        ),
      },
      {
        header: "Ledger",
        className: "text-right pr-4",
        accessor: (row: any) => (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 gap-1.5 text-xs border-zinc-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all font-bold"
            asChild
          >
            <Link href={`/accounting/buyer-ledger/${row.id}`}>
              <BookOpen className="w-3.5 h-3.5" />
              View Statement
            </Link>
          </Button>
        ),
      },
    ],
    [],
  );

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
  ];

  const currentSortValue =
    sortOptions.find((opt) => opt.field === sort.field && opt.dir === sort.dir)
      ?.value || "createdAt_desc";

  return (
    <Container className="pb-10">
      <PageHeader
        title="Buyer Ledger Summary"
        breadcrumbItems={[

          { label: "Buyer Ledger" },
        ]}
        icon={Users}
        actions={
          <Button
            variant="outline"
            className="gap-2 border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-sm font-bold"
            asChild
          >
            <Link href="/buyers">
              <ExternalLink className="w-4 h-4" />
              Manage Buyers
            </Link>
          </Button>
        }
      />

      {/* Toolbar — Search + Sort (single filter → fits one row) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-2 mb-4">
        {/* Left: Search Group */}
        <SearchBar
          placeholder="Search by name, merchandiser or location..."
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearchSubmit}
          // containerClassName="xl:max-w-md"
          inputClassName="h-10 sm:h-11"
        />

        {/* Right: Sort Group */}
        <div className="flex items-center gap-2 xl:justify-end">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 sm:px-3 h-11 shadow-sm shrink-0">
            <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1">
              Sort By
            </span>
            <Select
              value={currentSortValue}
              onValueChange={(val) => {
                const opt = sortOptions.find((o) => o.value === val);
                if (opt) {
                  setSort({
                    field: opt.field,
                    dir: opt.dir as "asc" | "desc",
                  });
                  setPage(1);
                }
              }}
            >
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-[10px] sm:text-xs font-bold uppercase tracking-wider w-full sm:w-[140px]">
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
        data={visibleBuyers}
        columns={columns}
        isLoading={isLoading}
        skeletonRows={10}
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange: setPage,
        }}
        scrollAreaHeight="h-[calc(100vh-320px)]"
        rowClassName="group hover:bg-zinc-50/50 transition-all border-b border-zinc-50 last:border-0"
      />
    </Container>
  );
}
