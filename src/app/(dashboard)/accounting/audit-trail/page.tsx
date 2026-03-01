"use client";

import { Container, PageHeader } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileDown, History as HistoryIcon } from "lucide-react";
import { useGetAllQuery } from "@/store/services/commonApi";
import { format } from "date-fns";
import { useMemo, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface AuditEntry {
  id: string;
  voucherNo: string;
  category: string;
  date: string;
  narration: string;
  status: string;
  buyer?: { name: string } | null;
  supplier?: { name: string } | null;
  createdBy?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  lines?: {
    type: string;
    amount: string | number;
    accountHead?: { name: string };
  }[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const getCategoryColor = (category: string) => {
  switch (category) {
    case "CUSTOMER_DUE":
      return "amber";
    case "RECEIPT":
      return "emerald";
    case "SUPPLIER_DUE":
      return "amber";
    case "PAYMENT":
      return "red";
    case "CONTRA":
      return "slate";
    default:
      return "indigo";
  }
};

const getCategoryLabel = (category: string) => {
  return category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const getCategoryTags = (entry: AuditEntry) => {
  const tags: string[] = [];

  switch (entry.category) {
    case "CUSTOMER_DUE":
      tags.push("Receivable Created");
      break;
    case "RECEIPT":
      tags.push("Due Reduced", "Cash In");
      break;
    case "SUPPLIER_DUE":
      tags.push("Payable Created");
      break;
    case "PAYMENT":
      tags.push("Due Reduced", "Cash Out");
      break;
    default:
      tags.push("General Ledger");
  }

  if (entry.status === "POSTED") tags.push("Balanced ✓");
  if (entry.status === "DRAFT") tags.push("Draft");

  return tags;
};

const getEntryAmount = (entry: AuditEntry): number => {
  if (!entry.lines || entry.lines.length === 0) return 0;
  // Sum all debit amounts (which equals credit amounts for a balanced entry)
  return entry.lines
    .filter((l) => l.type === "DEBIT")
    .reduce((sum, l) => sum + Number(l.amount), 0);
};

// ── Page ───────────────────────────────────────────────────────────────────────
const AuditTrailPage = () => {
  const [page, setPage] = useState(1);
  const { data: auditPayload, isLoading } = useGetAllQuery({
    path: "accounting/ledger/audit-trail",
    page,
    limit: 10,
    sort: null,
  });

  const auditItems = useMemo(() => {
    const raw =
      (auditPayload as any)?.data?.data || (auditPayload as any)?.data;
    if (Array.isArray(raw)) return raw as AuditEntry[];
    return [] as AuditEntry[];
  }, [auditPayload]);

  const totalPages = (auditPayload as any)?.meta?.pagination?.totalPages || 1;

  const columns = useMemo(
    () => [
      {
        header: "Date",
        accessor: (row: AuditEntry) => (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 text-xs">
              {format(new Date(row.date), "dd MMM yyyy")}
            </span>
            <span className="text-[10px] text-slate-400  ">
              {format(new Date(row.date), "hh:mm a")}
            </span>
          </div>
        ),
      },
      {
        header: "Voucher & Type",
        accessor: (row: AuditEntry) => (
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-[13px]">
              {row.voucherNo}
            </span>
            <span
              className={cn(
                "text-[9px] font-bold uppercase tracking-wider",
                getCategoryColor(row.category) === "amber"
                  ? "text-amber-600"
                  : getCategoryColor(row.category) === "emerald"
                    ? "text-emerald-600"
                    : getCategoryColor(row.category) === "red"
                      ? "text-red-600"
                      : "text-primary",
              )}
            >
              {getCategoryLabel(row.category)}
            </span>
          </div>
        ),
      },
      {
        header: "Entity / Party",
        accessor: (row: AuditEntry) => (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-700 text-xs">
              {row.buyer?.name || row.supplier?.name || "General Ledger"}
            </span>
            <span className="text-[10px] text-slate-400">
              {row.buyer ? "Buyer" : row.supplier ? "Supplier" : "N/A"}
            </span>
          </div>
        ),
      },
      {
        header: "Narration",
        accessor: (row: AuditEntry) => (
          <p
            className="text-[11px] text-slate-500 max-w-[250px] truncate"
            title={row.narration}
          >
            {row.narration || "—"}
          </p>
        ),
      },
      {
        header: "Amount",
        className: "text-right",
        accessor: (row: AuditEntry) => (
          <span className=" font-bold text-slate-900 text-xs text-right block w-full">
            ৳{" "}
            {getEntryAmount(row).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </span>
        ),
      },
      {
        header: "Tags",
        accessor: (row: AuditEntry) => (
          <div className="flex flex-wrap gap-1">
            {getCategoryTags(row)
              .slice(0, 2)
              .map((tag, j) => (
                <span
                  key={j}
                  className={cn(
                    "text-[8px] font-bold px-1 py-0.5 rounded uppercase tracking-tighter",
                    tag.includes("✓")
                      ? "bg-slate-100 text-slate-500"
                      : tag.includes("Reduced")
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600",
                  )}
                >
                  {tag}
                </span>
              ))}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <Container className="pb-10">
      <PageHeader
        title="System Audit Trail"
        breadcrumbItems={[
          { label: "Accounting", href: "/accounting/overview" },
          { label: "Audit Trail" },
        ]}
        icon={HistoryIcon}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2 hidden sm:block">
            {(auditPayload as any)?.meta?.total || 0} Records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 h-11 px-4 rounded-lg border-zinc-200 bg-white text-zinc-600 font-semibold text-xs uppercase tracking-wider shadow-sm hover:bg-zinc-50"
          >
            <FileDown className="size-3.5" />
            <span>Export All</span>
          </Button>
        </div>
      </div>

      <CustomTable
        data={auditItems}
        columns={columns}
        isLoading={isLoading}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: setPage,
        }}
        scrollAreaHeight="h-[calc(100vh-320px)]"
        rowClassName="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0"
      />
    </Container>
  );
};

export default AuditTrailPage;
