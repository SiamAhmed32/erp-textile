"use client";

import { Container, PageHeader } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { cn } from "@/lib/utils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function BuyerLedgerPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "createdAt",
    dir: "desc",
  });

  const { data: buyerResponse, isLoading } = useGetAllQuery({
    path: "accounting/ledger/buyers/balances",
    page,
    limit: 10,
    search: search || undefined,
    sortBy: sort.field,
    sortOrder: sort.dir,
  });

  const buyers = useMemo(
    () => ((buyerResponse as any)?.data || []) as any[],
    [buyerResponse],
  );

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
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {row.phone}
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
        header: "Total Invoiced",
        accessor: (row: any) => (
          <div className=" font-bold text-sm text-zinc-600">
            ৳{" "}
            {(Number(row.totalInvoiced) || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </div>
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
        header: "Due Balance",
        accessor: (row: any) => (
          <div
            className={cn(
              " font-bold text-sm",
              (Number(row.balance) || 0) > 0
                ? "text-rose-600"
                : "text-emerald-600",
            )}
          >
            ৳{" "}
            {(Number(row.balance) || 0).toLocaleString("en-IN", {
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
          { label: "Accounting", href: "/accounting/overview" },
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

      {/* Toolbar - Standardized for Consistency */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 mb-4">
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <div className="relative flex-1">
            <Input
              placeholder="Search by name, merchandiser or location..."
              className="h-11 border-zinc-200 bg-white text-sm rounded-lg shadow-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button className="bg-black text-white hover:bg-black/90 font-bold px-6 h-11 rounded-lg">
            Search
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {/* Sort Group */}
          <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 h-11 shadow-sm shrink-0">
            <ArrowUpDown className="h-4 w-4 text-zinc-400 shrink-0" />
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1">
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
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-xs font-bold uppercase tracking-wider w-[140px]">
                <SelectValue placeholder="Newest First" />
              </SelectTrigger>
              <SelectContent
                align="end"
                className="rounded-xl shadow-xl border-zinc-200"
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
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2 hidden sm:block">
            {buyerResponse?.meta?.total || 0} Records
          </p>
        </div>
      </div>

      <CustomTable
        data={buyers}
        columns={columns}
        isLoading={isLoading}
        skeletonRows={8}
        pagination={{
          currentPage: page,
          totalPages: (buyerResponse as any)?.meta?.pagination?.totalPages || 1,
          onPageChange: setPage,
        }}
        scrollAreaHeight="h-[55vh]"
      />
    </Container>
  );
}
