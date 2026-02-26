"use client";

import { Container, CustomModal } from "@/components/reusables";
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
import { useGetAllQuery } from "@/store/services/commonApi";
import { format } from "date-fns";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  History,
  Plus,
  Printer,
  Search
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

// ── types ──────────────────────────────────────────────────────────────────
interface JournalLine {
  id: string;
  accountHead: {
    name: string;
    code: string;
  };
  type: "DEBIT" | "CREDIT";
  amount: number;
}

interface JournalEntry {
  id: string;
  voucherNo: string;
  date: string;
  category: "BUYER_DUE" | "RECEIPT" | "SUPPLIER_DUE" | "PAYMENT" | "JOURNAL" | "CONTRA";
  narration: string;
  status: "DRAFT" | "POSTED";
  lines: JournalLine[];
  amount?: number; // Total amount usually not in model but calculated or returned as meta
}

// ── Details Modal ──────────────────────────────────────────────────────────
function JournalEntryDetailsModal({
  open,
  onClose,
  entry,
}: {
  open: boolean;
  onClose: () => void;
  entry: JournalEntry | null;
}) {
  if (!entry) return null;

  const totalDebit = entry.lines.filter(l => l.type === "DEBIT").reduce((acc, l) => acc + Number(l.amount), 0);

  return (
    <CustomModal
      open={open}
      onOpenChange={(val) => !val && onClose()}
      title={<div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-black text-zinc-400">Transaction Certificate — <span className="text-zinc-900">{entry.voucherNo}</span></div>}
      maxWidth="720px"
    >
      <div className="space-y-8 py-4 px-2">
        {/* Header Information */}
        <div className="bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <FileText className="w-32 h-32" />
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-10">
            <div className="space-y-1">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Entry Status</p>
              <div className="flex items-center gap-2">
                {entry.status === "POSTED" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Clock className="w-5 h-5 text-amber-400" />}
                <span className="text-2xl font-black italic uppercase tracking-tight">{entry.status}</span>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Posting Date</p>
              <span className="text-2xl font-black italic uppercase tracking-tight">
                {format(new Date(entry.date), "dd MMM yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* Ledger Lines */}
        <div className="space-y-3">
          <div className="px-4 flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            <span>Ledger Distribution</span>
            <span>Debit / Credit Balance</span>
          </div>

          <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-100 bg-zinc-50/50">
            {entry.lines.map((line) => (
              <div key={line.id} className="p-4 flex items-center justify-between bg-white hover:bg-zinc-50 transition-colors">
                <div className="space-y-1">
                  <p className="text-xs font-black text-zinc-900 uppercase tracking-tight">
                    {line.accountHead.name}
                  </p>
                  <p className="text-[9px] font-bold text-zinc-400 font-mono tracking-widest">
                    {line.accountHead.code || "N/A"}
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <span className={cn(
                    "font-mono text-[14px] font-black",
                    line.type === "DEBIT" ? "text-indigo-600" : "text-zinc-900"
                  )}>
                    ৳ {Number(line.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className={cn(
                    "text-[9px] font-black px-2 py-0.5 rounded uppercase border",
                    line.type === "DEBIT" ? "bg-indigo-50 border-indigo-100 text-indigo-700" : "bg-zinc-50 border-zinc-200 text-zinc-500"
                  )}>
                    {line.type}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-zinc-900 rounded-2xl flex items-center justify-between shadow-xl shadow-zinc-200">
            <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Voucher Value</span>
            <div className="flex items-baseline gap-2 text-white">
              <span className="text-lg font-black tracking-widest text-zinc-500">BDT</span>
              <span className="text-3xl font-black tracking-tight italic">
                ৳ {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Narration */}
        <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 space-y-2">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Transaction Memo</p>
          <p className="text-sm text-zinc-700 font-medium leading-relaxed italic">
            "{entry.narration || "No memo available for this voucher."}"
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-zinc-100 pt-6">
          <Button variant="outline" className="h-12 px-6 rounded-xl font-bold gap-2 text-zinc-600 border-zinc-200">
            <Printer className="w-4 h-4" />
            Print Voucher
          </Button>
          <Button
            onClick={onClose}
            className="h-12 px-10 rounded-xl bg-zinc-900 text-white font-bold hover:bg-black transition-all"
          >
            Close Details
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}

// ── Main Controller ────────────────────────────────────────────────────────
export default function DailyBookkeepingList() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const { data, isLoading } = useGetAllQuery({
    path: "accounting/journal-entries",
    page,
    limit: 10,
    search: search || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
  });

  const entries = useMemo(() => (data?.data || []) as JournalEntry[], [data]);

  const columns = useMemo(() => [
    {
      header: "Voucher Index",
      accessor: (row: JournalEntry) => (
        <div className="flex flex-col py-1">
          <span className="font-mono text-[14px] font-black text-zinc-900 tracking-tight italic">{row.voucherNo}</span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
            <Clock className="w-2.5 h-2.5" />
            {format(new Date(row.date), "dd MMM yyyy")}
          </span>
        </div>
      )
    },
    {
      header: "Classification",
      accessor: (row: JournalEntry) => {
        const categoryColors: Record<string, string> = {
          RECEIPT: "bg-emerald-50 text-emerald-700 border-emerald-100",
          PAYMENT: "bg-rose-50 text-rose-700 border-rose-100",
          CONTRA: "bg-indigo-50 text-indigo-700 border-indigo-100",
          JOURNAL: "bg-zinc-100 text-zinc-700 border-zinc-200",
          BUYER_DUE: "bg-amber-50 text-amber-700 border-amber-100",
          SUPPLIER_DUE: "bg-sky-50 text-sky-700 border-sky-100",
        };
        return (
          <span className={cn(
            "inline-flex items-center rounded-full px-2.5 py-1 text-[9px] font-black uppercase border tracking-widest",
            categoryColors[row.category] || "bg-zinc-100"
          )}>
            {row.category.replace("_", " ")}
          </span>
        );
      }
    },
    {
      header: "Narration Feed",
      accessor: (row: JournalEntry) => (
        <div className="text-xs text-zinc-600 font-medium max-w-[300px] line-clamp-2 italic leading-relaxed">
          {row.narration || "—"}
        </div>
      )
    },
    {
      header: "Flow Status",
      accessor: (row: JournalEntry) => (
        <div className="flex items-center gap-2">
          {row.status === "POSTED" ? (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-black text-[10px] border border-emerald-100">
              <CheckCircle2 className="w-3 h-3" />
              POSTED
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 text-amber-700 font-black text-[10px] border border-amber-100">
              <Clock className="w-3 h-3" />
              DRAFT
            </div>
          )}
        </div>
      )
    },
    {
      header: "Actions",
      className: "text-right pr-6",
      accessor: (row: JournalEntry) => (
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all rounded-xl"
          onClick={() => setSelectedEntry(row)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ], []);

  return (
    <Container className="pb-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            <BookOpen className="w-3 h-3" />
            <span>General Ledger Archive</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight italic">Daily Bookkeeping</h1>
          <p className="text-zinc-500 text-sm font-medium">Verify, audit, and post chronological accounting vouchers.</p>
        </div>

        <Button
          onClick={() => router.push("/accounting/daily-bookkeeping/create")}
          className="h-12 px-8 bg-zinc-900 text-white font-bold rounded-xl hover:bg-black transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Journal Entry
        </Button>
      </div>

      {/* Premium Toolbar */}
      <div className="bg-zinc-50/50 border border-zinc-200 rounded-[2rem] p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
          <Input
            placeholder="Search voucher index or narration..."
            className="h-12 pl-11 border-zinc-200 bg-white rounded-2xl focus:ring-zinc-900 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-12 w-full md:w-[200px] border-zinc-200 bg-white rounded-2xl font-bold text-zinc-600">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-zinc-200 shadow-2xl">
            <SelectItem value="all" className="font-bold">Global Archive</SelectItem>
            <SelectItem value="RECEIPT">Receipts</SelectItem>
            <SelectItem value="PAYMENT">Payments</SelectItem>
            <SelectItem value="JOURNAL">General Journals</SelectItem>
            <SelectItem value="CONTRA">Contra Transfers</SelectItem>
            <SelectItem value="BUYER_DUE">Buyer Invoices</SelectItem>
            <SelectItem value="SUPPLIER_DUE">Supplier Invoices</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="h-12 px-6 rounded-2xl border-zinc-200 text-zinc-600 font-bold gap-2">
          <History className="w-4 h-4" />
          Audit Logs
        </Button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-[2.5rem] shadow-sm overflow-hidden">
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
          scrollAreaHeight="h-[calc(100vh-450px)]"
          rowClassName="group hover:bg-zinc-50/50 transition-colors cursor-default"
        />
      </div>

      <JournalEntryDetailsModal
        open={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        entry={selectedEntry}
      />
    </Container>
  );
}
