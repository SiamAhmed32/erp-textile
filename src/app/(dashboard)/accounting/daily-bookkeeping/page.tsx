"use client";

import {
  Container,
  CustomModal,
  DateRangeFilter,
  PageHeader,
} from "@/components/reusables";
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
  useDeleteOneMutation,
  useGetAllQuery,
  usePostMutation,
} from "@/store/services/commonApi";
import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { notify } from "@/lib/notifications";

// ── Types ─────────────────────────────────────────────────────────────────────
interface JournalLine {
  id: string;
  accountHead: { name: string; code: string };
  type: "DEBIT" | "CREDIT";
  amount: number;
}

interface JournalEntry {
  id: string;
  voucherNo: string;
  date: string;
  category:
    | "BUYER_DUE"
    | "RECEIPT"
    | "SUPPLIER_DUE"
    | "PAYMENT"
    | "JOURNAL"
    | "CONTRA";
  narration: string;
  status: "DRAFT" | "POSTED";
  lines: JournalLine[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  RECEIPT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PAYMENT: "bg-rose-50 text-rose-700 border-rose-200",
  CONTRA: "bg-indigo-50 text-indigo-700 border-indigo-200",
  JOURNAL: "bg-zinc-100 text-zinc-700 border-zinc-200",
  BUYER_DUE: "bg-amber-50 text-amber-700 border-amber-200",
  SUPPLIER_DUE: "bg-sky-50 text-sky-700 border-sky-200",
};

const API_PATH = "accounting/journal-entries";

function getTotalAmount(lines: JournalLine[]) {
  return lines
    .filter((l) => l.type === "DEBIT")
    .reduce((acc, l) => acc + Number(l.amount), 0);
}

// ── Details Modal ──────────────────────────────────────────────────────────────
function ViewModal({
  open,
  onClose,
  entry,
}: {
  open: boolean;
  onClose: () => void;
  entry: JournalEntry | null;
}) {
  if (!entry) return null;
  const total = getTotalAmount(entry.lines);

  return (
    <CustomModal
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={
        <span className="text-sm font-semibold text-zinc-700">
          Voucher —{" "}
          <span className="font-semibold text-zinc-900">{entry.voucherNo}</span>
        </span>
      }
      maxWidth="660px"
    >
      <div className="space-y-5 py-2">
        {/* Header strip */}
        <div className="bg-zinc-900 rounded-2xl p-5 text-white relative overflow-hidden">
          <FileText className="absolute top-4 right-4 w-16 h-16 opacity-10" />
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div>
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">
                Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                {entry.status === "POSTED" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-400" />
                )}
                <span className="font-bold">{entry.status}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">
                Date
              </p>
              <p className="font-bold mt-1">
                {format(new Date(entry.date), "dd MMM yyyy")}
              </p>
            </div>
          </div>
        </div>

        {/* Lines */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            Ledger Lines
          </p>
          <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-100">
            {entry.lines.map((line) => (
              <div
                key={line.id}
                className="flex items-center justify-between px-4 py-3 bg-white hover:bg-zinc-50"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {line.accountHead.name}
                  </p>
                  <p className="text-xs font-medium text-zinc-400">
                    {line.accountHead.code || "—"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      line.type === "DEBIT"
                        ? "text-indigo-600"
                        : "text-zinc-700",
                    )}
                  >
                    ৳{" "}
                    {Number(line.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase",
                      line.type === "DEBIT"
                        ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                        : "bg-zinc-50 border-zinc-200 text-zinc-500",
                    )}
                  >
                    {line.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center px-4 py-3 bg-zinc-900 rounded-xl text-white">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Total
            </span>
            <span className="font-bold">
              ৳ {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Narration */}
        {entry.narration && (
          <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">
              Narration
            </p>
            <p className="text-sm text-zinc-600">{entry.narration}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
          <Button
            variant="outline"
            className="h-9 px-4 gap-2 text-sm border-zinc-200"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button
            onClick={onClose}
            className="h-9 px-5 bg-zinc-900 text-white hover:bg-black text-sm"
          >
            Close
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}

// ── Post Confirmation Modal ────────────────────────────────────────────────────
function PostConfirmModal({
  open,
  entry,
  onClose,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  entry: JournalEntry | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  return (
    <CustomModal
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title="Confirm Post Entry"
      maxWidth="440px"
    >
      <div className="space-y-4 pt-2">
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              This action is irreversible
            </p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Posting <span className="font-bold">{entry?.voucherNo}</span> will
              permanently update all account balances in the General Ledger. You
              will not be able to edit or delete this entry afterwards — only
              reverse it.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-zinc-200"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isLoading ? "Posting..." : "Yes, Post It"}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}

// ── Delete Confirmation Modal ──────────────────────────────────────────────────
function DeleteConfirmModal({
  open,
  entry,
  onClose,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  entry: JournalEntry | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  return (
    <CustomModal
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title="Delete Draft Entry"
      maxWidth="420px"
    >
      <div className="space-y-4 pt-2">
        <p className="text-sm text-zinc-600 leading-relaxed">
          Are you sure you want to permanently delete draft voucher{" "}
          <span className="font-bold text-zinc-900">{entry?.voucherNo}</span>?
          This cannot be undone.
        </p>
        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-zinc-200"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "Deleting..." : "Delete Draft"}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}

// ── Reverse Confirmation Modal ─────────────────────────────────────────────────
function ReverseConfirmModal({
  open,
  entry,
  onClose,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  entry: JournalEntry | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  return (
    <CustomModal
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title="Reverse Posted Entry"
      maxWidth="440px"
    >
      <div className="space-y-4 pt-2">
        <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
          <RefreshCw className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-indigo-800">
              A counter-entry will be created
            </p>
            <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
              This will create a new journal entry that cancels the effect of{" "}
              <span className=" font-bold">{entry?.voucherNo}</span>.
              Both entries will remain in the ledger as a permanent audit
              record.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-zinc-200"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isLoading ? "Reversing..." : "Yes, Reverse It"}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function DailyBookkeepingList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "createdAt",
    dir: "desc",
  });

  // Modal state
  const [viewEntry, setViewEntry] = useState<JournalEntry | null>(null);
  const [postEntry, setPostEntry] = useState<JournalEntry | null>(null);
  const [deleteEntry, setDeleteEntry] = useState<JournalEntry | null>(null);
  const [reverseEntry, setReverseEntry] = useState<JournalEntry | null>(null);

  // API hooks — backend supports: category, status, dateFrom, dateTo, search
  const { data, isLoading, refetch } = useGetAllQuery({
    path: API_PATH,
    page,
    limit: 10,
    search: search || undefined,
    sort: null,
    sortBy: sort.field,
    sortOrder: sort.dir,
    filters: {
      ...(categoryFilter !== "all" ? { category: categoryFilter } : {}),
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    },
  });

  const [postMutation, { isLoading: isPosting }] = usePostMutation();
  const [deleteOne, { isLoading: isDeleting }] = useDeleteOneMutation();
  const [reverseMutation, { isLoading: isReversing }] = usePostMutation();

  const entries = useMemo(() => (data?.data || []) as JournalEntry[], [data]);

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
      label: "Transaction Date (Newest)",
      field: "date",
      dir: "desc",
    },
    {
      value: "date_asc",
      label: "Transaction Date (Oldest)",
      field: "date",
      dir: "asc",
    },
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

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handlePost = async () => {
    if (!postEntry) return;
    try {
      await postMutation({
        path: `${API_PATH}/${postEntry.id}/post`,
        body: {},
        invalidate: [API_PATH],
      }).unwrap();
      notify.success(`${postEntry.voucherNo} posted to General Ledger.`);
      setPostEntry(null);
      refetch();
    } catch (err: any) {
      notify.error(
        err?.data?.error?.message ||
          err?.data?.message ||
          "Could not post the entry. Please try again.",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteEntry) return;
    try {
      await deleteOne({
        path: `${API_PATH}/${deleteEntry.id}`,
        invalidate: [API_PATH],
      }).unwrap();
      notify.success(`Draft ${deleteEntry.voucherNo} deleted.`);
      setDeleteEntry(null);
      refetch();
    } catch (err: any) {
      notify.error(
        err?.data?.error?.message ||
          err?.data?.message ||
          "Could not delete the draft. Please try again.",
      );
    }
  };

  const handleReverse = async () => {
    if (!reverseEntry) return;
    try {
      await reverseMutation({
        path: `${API_PATH}/${reverseEntry.id}/reverse`,
        body: {},
        invalidate: [API_PATH],
      }).unwrap();
      notify.success(`Reversal entry created for ${reverseEntry.voucherNo}.`);
      setReverseEntry(null);
      refetch();
    } catch (err: any) {
      notify.error(
        err?.data?.error?.message ||
          err?.data?.message ||
          "Could not reverse the entry. Please try again.",
      );
    }
  };

  // ── Table Columns ──────────────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      {
        header: "Voucher No.",
        accessor: (row: JournalEntry) => (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-900">
              {row.voucherNo}
            </span>
            <span className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              {format(new Date(row.date), "dd MMM yyyy")}
            </span>
          </div>
        ),
      },
      {
        header: "Category",
        accessor: (row: JournalEntry) => (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border",
              CATEGORY_COLORS[row.category] || "bg-zinc-100",
            )}
          >
            {row.category.replace("_", " ")}
          </span>
        ),
      },
      {
        header: "Narration",
        accessor: (row: JournalEntry) => (
          <div className="text-sm text-zinc-500 max-w-[260px] truncate">
            {row.narration || (
              <span className="text-zinc-300 italic">No narration</span>
            )}
          </div>
        ),
      },
      {
        header: "Amount",
        accessor: (row: JournalEntry) => (
          <span className="text-sm font-semibold text-zinc-900">
            ৳{" "}
            {getTotalAmount(row.lines).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
        ),
      },
      {
        header: "Status",
        accessor: (row: JournalEntry) =>
          row.status === "POSTED" ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              Posted
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit bg-amber-50 text-amber-700 font-semibold text-xs border border-amber-200">
              <Clock className="w-3 h-3" />
              Draft
            </span>
          ),
      },
      {
        header: "Actions",
        className: "text-right pr-4",
        accessor: (row: JournalEntry) => (
          <div className="flex items-center justify-end gap-1">
            {/* View — always */}
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"
              title="View details"
              onClick={() => setViewEntry(row)}
            >
              <Eye className="h-4 w-4" />
            </Button>

            {row.status === "DRAFT" && (
              <>
                {/* Edit — DRAFT only */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Edit draft"
                  asChild
                >
                  <Link href={`/accounting/daily-bookkeeping/${row.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>

                {/* Post — DRAFT only */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  title="Post to General Ledger"
                  onClick={() => setPostEntry(row)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </Button>

                {/* Delete — DRAFT only */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  title="Delete draft"
                  onClick={() => setDeleteEntry(row)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}

            {row.status === "POSTED" && (
              /* Reverse — POSTED only */
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                title="Reverse this entry"
                onClick={() => setReverseEntry(row)}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <Container className="pb-10">
      <PageHeader
        title="Daily Bookkeeping"
        breadcrumbItems={[
          { label: "Accounting", href: "/accounting/overview" },
          { label: "Daily Bookkeeping" },
        ]}
        actions={
          <Button
            className="bg-black text-white hover:bg-black/90 shadow-sm"
            asChild
          >
            <Link href="/accounting/daily-bookkeeping/create">
              <Plus className="mr-2 h-4 w-4" />
              New Journal Entry
            </Link>
          </Button>
        }
      />

      {/* Toolbar - Standardized for Consistency */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between py-2 mb-4">
        {/* Search Group */}
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search voucher no. or narration..."
              className="pl-9 h-11 border-zinc-200 bg-white text-sm rounded-lg shadow-sm"
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

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <div className="w-[170px]">
            <Select
              value={categoryFilter}
              onValueChange={(v) => {
                setCategoryFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-11 text-xs font-semibold border-zinc-200 bg-white shadow-sm rounded-lg uppercase tracking-wider">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl">
                <SelectItem
                  value="all"
                  className="text-xs font-semibold rounded-lg my-0.5"
                >
                  All Categories
                </SelectItem>
                <SelectItem
                  value="RECEIPT"
                  className="text-xs font-semibold rounded-lg my-0.5"
                >
                  Receipt
                </SelectItem>
                <SelectItem
                  value="PAYMENT"
                  className="text-xs font-semibold rounded-lg my-0.5"
                >
                  Payment
                </SelectItem>
                <SelectItem
                  value="JOURNAL"
                  className="text-xs font-semibold rounded-lg my-0.5"
                >
                  Journal
                </SelectItem>
                <SelectItem
                  value="CONTRA"
                  className="text-xs font-semibold rounded-lg my-0.5"
                >
                  Contra
                </SelectItem>
                <SelectItem
                  value="CONTRA"
                  className="text-xs font-semibold rounded-lg my-0.5"
                >
                  Contra
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="w-[140px]">
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-11 text-xs font-semibold border-zinc-200 bg-white shadow-sm rounded-lg uppercase tracking-wider">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl">
                <SelectItem
                  value="all"
                  className="text-xs font-semibold rounded-lg my-0.5"
                >
                  All Status
                </SelectItem>
                <SelectItem
                  value="DRAFT"
                  className="text-xs font-semibold rounded-lg my-0.5"
                >
                  Draft
                </SelectItem>
                <SelectItem
                  value="POSTED"
                  className="text-xs font-semibold rounded-lg my-0.5"
                >
                  Posted
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <DateRangeFilter
            start={dateFrom}
            end={dateTo}
            onFilterChange={({ start, end }) => {
              setDateFrom(start);
              setDateTo(end);
              setPage(1);
            }}
            placeholder="Entry Date"
            startLabel="From Date"
            endLabel="To Date"
          />

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
        </div>
      </div>

      {/* Table */}
      <CustomTable
        data={entries}
        columns={columns}
        isLoading={isLoading}
        skeletonRows={8}
        pagination={{
          currentPage: page,
          totalPages: data?.meta?.pagination?.totalPages || 1,
          onPageChange: setPage,
        }}
        scrollAreaHeight="h-[67vh]"
      />

      {/* Modals */}
      <ViewModal
        open={!!viewEntry}
        onClose={() => setViewEntry(null)}
        entry={viewEntry}
      />
      <PostConfirmModal
        open={!!postEntry}
        entry={postEntry}
        onClose={() => setPostEntry(null)}
        onConfirm={handlePost}
        isLoading={isPosting}
      />
      <DeleteConfirmModal
        open={!!deleteEntry}
        entry={deleteEntry}
        onClose={() => setDeleteEntry(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
      <ReverseConfirmModal
        open={!!reverseEntry}
        entry={reverseEntry}
        onClose={() => setReverseEntry(null)}
        onConfirm={handleReverse}
        isLoading={isReversing}
      />
    </Container>
  );
}
