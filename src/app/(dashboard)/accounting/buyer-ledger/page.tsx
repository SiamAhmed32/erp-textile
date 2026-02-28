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

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function BuyerLedgerPage() {
  const [search, setSearch] = useState("");

  const { data: buyerResponse, isLoading } = useGetAllQuery({
    path: "accounting/ledger/buyers/balances",
    limit: 100,
    search: search || undefined,
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
          <div className="font-mono font-bold text-sm text-zinc-600">
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
          <div className="font-mono font-bold text-sm text-emerald-600">
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search by name, merchandiser or location..."
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
            {buyers.length} Records
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
