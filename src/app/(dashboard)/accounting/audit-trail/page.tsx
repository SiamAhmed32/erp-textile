"use client";

import { Container, PageHeader } from "@/components/reusables";
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
import {
  ArrowUpDown,
  FileDown,
  History as HistoryIcon,
  CalendarDays,
} from "lucide-react";
import { DateRangeFilter } from "@/components/reusables";
import { useGetAllQuery } from "@/store/services/commonApi";
import { useGetSelfQuery } from "@/store/services/authApi";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { AuditEntry } from "./types";
import { exportAuditTrailToPdf } from "./auditTrailPdf";
import { notify } from "@/lib/notifications";

// Locally removed Interface AuditEntry (now in types.ts)

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "date",
    dir: "desc",
  });

  const { data: companyPayload } = useGetAllQuery({
    path: "company-profiles",
    limit: 1,
  });

  const companyProfile = (companyPayload as any)?.data?.[0];

  const { data: selfPayload } = useGetSelfQuery(undefined);
  const currentUser = (selfPayload as any)?.data;
  const userName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "System Admin";

  const handleExport = async () => {
    if (!auditItems || auditItems.length === 0) {
      notify.error("No data available to export.");
      return;
    }

    try {
      await exportAuditTrailToPdf(
        auditItems,
        companyProfile,
        userName,
        startDate,
        endDate,
      );
      notify.success("Audit Trail exported successfully.");
    } catch (error) {
      console.error("Export Error:", error);
      notify.error("Failed to export Audit Trail.");
    }
  };

  const {
    data: auditPayload,
    isFetching: isLoading,
    refetch,
  } = useGetAllQuery(
    {
      path: "accounting/ledger/audit-trail",
      // Remove page for report style, use high limit
      limit: 1000,
      sortBy: sort.field,
      sortOrder: sort.dir,
      filters: {
        startDate,
        endDate,
      },
    },
    { skip: !startDate || !endDate },
  );

  const auditItems = useMemo(() => {
    // Structure from commonApi/BaseController is { data: [...] }
    const raw = (auditPayload as any)?.data;
    return Array.isArray(raw) ? (raw as AuditEntry[]) : [];
  }, [auditPayload]);

  const sortOptions = [
    {
      value: "date_desc",
      label: "Newest First",
      field: "date",
      dir: "desc",
    },
    {
      value: "date_asc",
      label: "Oldest First",
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
        actions={
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2 bg-black h-11 px-4 rounded-lg border-slate-200  text-white font-semibold text-xs uppercase tracking-wider shadow-sm hover:bg-black/80 hover:text-white"
          >
            <FileDown className="size-3.5 " />
            <span>Export Trail</span>
          </Button>
        }
      />

      <div
        className="flex flex-col lg:flex-row lg:justify-end gap-4 p-4 sm:p-6 mb-6 rounded-xl"
        style={{ backgroundColor: "#F9FCFC" }}
      >
        {/* Date Selection */}
        <div className="flex flex-col gap-1.5 min-w-[200px] sm:min-w-[300px]">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1">
            Report Period
          </span>
          <DateRangeFilter
            start={startDate}
            end={endDate}
            onFilterChange={({ start, end }) => {
              setStartDate(start);
              setEndDate(end);
            }}
            placeholder="Select Range"
            className="h-11 shadow-sm border-slate-200 text-xs sm:text-sm"
          />
        </div>

        {/* Sort (Right) */}
        <div className="flex flex-col gap-1.5 min-w-[140px] sm:min-w-[180px]">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1">
            Sort Order
          </span>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 sm:px-3 h-11 shadow-sm">
            <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
            <Select
              value={currentSortValue}
              onValueChange={(val) => {
                const opt = sortOptions.find((o) => o.value === val);
                if (opt) {
                  setSort({
                    field: opt.field,
                    dir: opt.dir as "asc" | "desc",
                  });
                }
              }}
            >
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-[10px] sm:text-xs font-bold uppercase tracking-wider w-full">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent align="end">
                {sortOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-[10px] sm:text-xs font-medium"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {!startDate || !endDate ? (
        <div className="mt-10 py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <CalendarDays className="size-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Ready to generate report
          </h3>
          <p className="text-slate-500 max-w-sm mb-8">
            Please select a date range from the toolbar above to fetch the audit
            trail logs for that period.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
              <div className="size-1.5 rounded-full bg-slate-300" />
              Real-time Logs
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
              <div className="size-1.5 rounded-full bg-slate-300" />
              PDF Export Ready
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          <CustomTable
            data={auditItems}
            columns={columns}
            isLoading={isLoading}
            skeletonRows={10}
            scrollAreaHeight="h-[calc(100vh-320px)]"
            rowClassName="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0"
          />
          {!isLoading && auditItems.length > 0 && (
            <div className="mt-4 flex justify-between items-center px-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Showing {auditItems.length} Records
              </span>
              <span className="text-xs font-bold text-primary">
                End of Report
              </span>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default AuditTrailPage;
