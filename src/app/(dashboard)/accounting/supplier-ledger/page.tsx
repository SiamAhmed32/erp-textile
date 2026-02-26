"use client";

import { Container, PageHeader } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
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
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Supplier } from "./_components/types";

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function SupplierLedgerPage() {
  const [search, setSearch] = useState("");

  const { data: supplierResponse, isLoading } = useGetAllQuery({
    path: "suppliers",
    limit: 100,
    search: search || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const suppliers = useMemo(
    () => ((supplierResponse as any)?.data || []) as Supplier[],
    [supplierResponse]
  );

  const columns = useMemo(() => [
    {
      header: "Supplier",
      accessor: (row: Supplier) => (
        <div className="flex items-center gap-3 py-1">
          <div className="size-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600 uppercase shrink-0">
            {row.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-sm text-zinc-900">{row.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                {row.supplierCode || "—"}
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
      header: "Contact",
      accessor: (row: Supplier) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Mail className="w-3 h-3 text-zinc-300" /> {row.email}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Phone className="w-3 h-3 text-zinc-300" /> {row.phone}
          </div>
        </div>
      ),
    },
    {
      header: "Opening Liability",
      accessor: (row: Supplier) => (
        <span className="font-mono text-sm font-semibold text-rose-600">
          ৳ {Number(row.openingLiability || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row: Supplier) =>
        !row.isDeleted ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <ShieldCheck className="w-3 h-3" /> Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-400 text-xs font-semibold border border-zinc-200">
            <XCircle className="w-3 h-3" /> Inactive
          </span>
        ),
    },
    {
      header: "Onboarded",
      accessor: (row: Supplier) => (
        <span className="text-xs text-zinc-500">
          {format(new Date(row.createdAt), "dd MMM yyyy")}
        </span>
      ),
    },
    {
      header: "Ledger",
      className: "text-right pr-4",
      accessor: (row: Supplier) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 gap-1.5 text-xs border-zinc-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all"
          asChild
        >
          <Link href={`/accounting/supplier-ledger/${row.id}`}>
            <BookOpen className="w-3.5 h-3.5" />
            View Ledger
          </Link>
        </Button>
      ),
    },
  ], []);

  return (
    <Container className="pb-10">
      <PageHeader
        title="Supplier Ledger"
        breadcrumbItems={[
          { label: "Accounting", href: "/accounting/overview" },
          { label: "Supplier Ledger" },
        ]}
        actions={
          <Button
            variant="outline"
            className="gap-2 border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-sm"
            asChild
          >
            <Link href="/suppliers">
              <ExternalLink className="w-4 h-4" />
              Manage Suppliers
            </Link>
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search by name, code or location..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <p className="text-sm text-zinc-400 ml-auto">
          {suppliers.length} supplier{suppliers.length !== 1 ? "s" : ""}
        </p>
      </div>

      <CustomTable
        data={suppliers}
        columns={columns}
        isLoading={isLoading}
        skeletonRows={8}
        scrollAreaHeight="h-[67vh]"
      />
    </Container>
  );
}
