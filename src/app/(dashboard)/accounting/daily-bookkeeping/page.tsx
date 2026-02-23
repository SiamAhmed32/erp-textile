"use client";

import StatsCard from "@/components/dashboard/StatsCard";
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
import { BookOpen, Eye, History, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DateRangeFilter } from "@/components/reusables";

const mockEntries = [
  {
    id: "JE-2024-001",
    date: "18 Feb 2026",
    type: "Customer Due",
    party: "Rahim Corp",
    amount: 75000,
    narration: "Sold goods on credit",
    status: "Posted",
  },
  {
    id: "JE-2024-002",
    date: "17 Feb 2026",
    type: "Expense",
    party: "Office Expense",
    amount: 5000,
    narration: "Monthly office rent",
    status: "Posted",
  },
  {
    id: "JE-2024-003",
    date: "16 Feb 2026",
    type: "Receipt",
    party: "Karim Traders",
    amount: 30000,
    narration: "Payment received",
    status: "Posted",
  },
];

import { Separator } from "@/components/ui/separator";

function JournalEntryDetailsModal({
  open,
  onClose,
  entry,
}: {
  open: boolean;
  onClose: () => void;
  entry: any;
}) {
  if (!entry) return null;

  return (
    <CustomModal
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
      title="Journal Entry Details"
      maxWidth="600px"
    >
      <div className="space-y-6 pt-2">
        {/* ID and Date section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Voucher ID
            </p>
            <p className="text-sm font-semibold text-slate-900">{entry.id}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Posting Date
            </p>
            <p className="text-sm font-semibold text-slate-900">{entry.date}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Transaction Type
            </p>
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">
              {entry.type}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Party / Ledger Head
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {entry.party}
            </p>
          </div>
        </div>

        <Separator />

        {/* Narration Box */}
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground mb-1">
            Narration / Memo
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {entry.narration || "—"}
          </p>
        </div>

        <Separator />

        {/* Footer section with highlighted amount */}
        <div className="flex flex-col sm:flex-row justify-between items-end bg-white pt-2 gap-4">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground mb-1">
              Total Transaction Value
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-secondary">
                ৳ {entry.amount.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-400">BDT</span>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={onClose}
              className="flex-1 sm:flex-none h-10 px-8 bg-black text-white hover:bg-black/90 font-bold"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </CustomModal>
  );
}

export default function DailyBookkeepingList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const columns = useMemo(
    () => [
      {
        header: "Entry ID",
        accessor: (row: any) => row.id,
      },
      {
        header: "Date",
        accessor: (row: any) => row.date,
      },
      {
        header: "Type",
        accessor: (row: any) => (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">
            {row.type.toUpperCase()}
          </span>
        ),
      },
      {
        header: "Party / Head",
        accessor: (row: any) => (
          <div className="font-semibold text-foreground">{row.party}</div>
        ),
      },
      {
        header: "Amount",
        accessor: (row: any) => `৳ ${row.amount.toLocaleString()}`,
      },
      {
        header: "Narration",
        accessor: (row: any) => row.narration,
      },
      {
        header: "Actions",
        accessor: (row: any) => (
          <div className="flex gap-1 justify-end pr-4">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
              onClick={() => {
                setSelectedEntry(row);
                setIsDetailsModalOpen(true);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <Container className="pb-10">
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total Entries"
            value={mockEntries.length}
            icon={BookOpen}
            color="blue"
          />
          <StatsCard
            title="Today's Entries"
            value="14"
            icon={BookOpen}
            color="orange"
          />
          <StatsCard
            title="Total Volume"
            value="৳ 3.4M"
            icon={Receipt}
            color="green"
          />
          <StatsCard
            title="Pending Checks"
            value="2"
            icon={History}
            color="red"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
            <Input
              placeholder="Search voucher ID, party name or narration..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline" onClick={() => {}}>
              Search
            </Button>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
            <div className="w-full sm:max-w-[160px]">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="receipt">Receipt</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="journal">Journal</SelectItem>
                  <SelectItem value="contra">Contra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DateRangeFilter
              start={dateRange.start}
              end={dateRange.end}
              onStartChange={(val) =>
                setDateRange((prev) => ({ ...prev, start: val }))
              }
              onEndChange={(val) =>
                setDateRange((prev) => ({ ...prev, end: val }))
              }
              placeholder="Voucher Dates"
            />
            <Button
              className="bg-black text-white hover:bg-black/90"
              onClick={() =>
                router.push("/accounting/daily-bookkeeping/create")
              }
            >
              New Entry
            </Button>
          </div>
        </div>

        <CustomTable
          data={mockEntries}
          columns={columns}
          isLoading={false}
          scrollAreaHeight="h-[calc(100vh-320px)]"
        />
      </div>

      <JournalEntryDetailsModal
        open={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        entry={selectedEntry}
      />
    </Container>
  );
}
