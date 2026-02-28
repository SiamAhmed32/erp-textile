"use client";

import { cn } from "@/lib/utils";
import { Container, PageHeader } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllQuery } from "@/store/services/commonApi";
import {
  BookOpen,
  ExternalLink,
  MapPin,
  Phone,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function SupplierLedgerPage() {
  const [search, setSearch] = useState("");

  const { data: supplierResponse, isLoading } = useGetAllQuery({
    path: "accounting/ledger/suppliers/balances",
    limit: 100,
    search: search || undefined,
  });

  const suppliers = useMemo(
    () => ((supplierResponse as any)?.data || []) as any[],
    [supplierResponse],
  );

  const totalLiability = useMemo(() => {
    return suppliers.reduce((sum, s) => sum + (Number(s.balance) || 0), 0);
  }, [suppliers]);

  const columns = useMemo(
    () => [
      {
        header: "Supplier",
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
        header: "Due Balance",
        accessor: (row: any) => (
          <div
            className={cn(
              "font-mono font-bold text-sm",
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
            <Link href={`/accounting/supplier-ledger/${row.id}`}>
              <BookOpen className="w-3.5 h-3.5" />
              View Statement
            </Link>
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <Container className="pb-10">
      <PageHeader
        title="Supplier Ledger Summary"
        breadcrumbItems={[
          { label: "Accounting", href: "/accounting/overview" },
          { label: "Supplier Ledger" },
        ]}
        icon={Users}
        actions={
          <Button
            variant="outline"
            className="gap-2 border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-sm font-bold"
            asChild
          >
            <Link href="/suppliers">
              <ExternalLink className="w-4 h-4" />
              Manage Suppliers
            </Link>
          </Button>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">
            Total Suppliers
          </p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-zinc-900">
              {suppliers.length}
            </p>
            <div className="size-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2">
            Active business partners
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">
            Total Payables
          </p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-rose-600 font-mono italic">
              ৳{" "}
              {totalLiability.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </p>
            <div className="size-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-400 border border-rose-100">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2">
            Current aggregate obligations
          </p>
        </div>

        <div className="bg-white border border-rose-100 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest mb-1">
            Quick Actions
          </p>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs h-8 font-bold"
              asChild
            >
              <Link href="/accounting/overview">Overview</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50 text-xs h-8 font-bold"
              onClick={() => window.print()}
            >
              Print List
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar - Standardized for Consistency */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 mb-4">
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search by name or location..."
              className="pl-9 h-11 border-zinc-200 bg-white text-sm rounded-lg shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="bg-black text-white hover:bg-black/90 font-bold px-6 h-11 rounded-lg">
            Search
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2 hidden sm:block">
            {suppliers.length} Records
          </p>
        </div>
      </div>

      <CustomTable
        data={suppliers}
        columns={columns}
        isLoading={isLoading}
        skeletonRows={8}
        scrollAreaHeight="h-[55vh]"
      />
    </Container>
  );
}
