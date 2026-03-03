"use client";

import { Container, PageHeader } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ArrowUpDown,
  FileDown,
  History as HistoryIcon,
  Search,
} from "lucide-react";
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
  return entry.lines
    .filter((l) => l.type === "DEBIT")
    .reduce((sum, l) => sum + Number(l.amount), 0);
};

// ── Page ───────────────────────────────────────────────────────────────────────
const AuditTrailPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "createdAt",
    dir: "desc",
  });

  const handleSearchSubmit = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const { data: auditPayload, isLoading } = useGetAllQuery({
    path: "accounting/ledger/audit-trail",
    page,
    limit: 10,
    search: search || undefined,
    sortBy: sort.field,
    sortOrder: sort.dir,
  });

  const auditItems = useMemo(() => {
    const raw =
      (auditPayload as any)?.data?.data || (auditPayload as any)?.data;
    return Array.isArray(raw) ? (raw as AuditEntry[]) : [];
  }, [auditPayload]);

  const totalPages = useMemo(() => {
    const meta =
      (auditPayload as any)?.meta || (auditPayload as any)?.data?.meta;
    return meta?.pagination?.totalPages || meta?.totalPages || 1;
  }, [auditPayload]);

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
      value: "date_desc",
      label: "Date (Newest)",
      field: "date",
      dir: "desc",
    },
    {
      value: "date_asc",
      label: "Date (Oldest)",
      field: "date",
      dir: "asc",
    },
  ];

  const currentSortValue =
    sortOptions.find((opt) => opt.field === sort.field && opt.dir === sort.dir)
      ?.value || "createdAt_desc";

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
        // icon={HistoryIcon}
        // actions={
        //   <Button
        //     variant="outline"
        //     className="flex items-center gap-2 h-11 px-4 rounded-lg border-slate-200 bg-white text-slate-600 font-semibold text-xs uppercase tracking-wider shadow-sm hover:bg-slate-50"
        //   >
        //     <FileDown className="size-3.5" />
        //     <span>Export All</span>
        //   </Button>
        // }
      />

      {/* Toolbar — Search + Sort (single filter → fits one row) */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between py-2 mb-4">
        {/* Left: Search Group */}
        <div className="flex w-full gap-2 xl:max-w-md xl:flex-1">
          <div className="relative flex-1">
            <Input
              placeholder="Search voucher no. or narration..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              className="h-11 bg-white border-slate-200 rounded-lg shadow-sm"
            />
          </div>
          <Button
            onClick={handleSearchSubmit}
            className="h-11 px-3 sm:px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg shrink-0"
          >
            <Search className="h-5 w-5 sm:hidden" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>

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
