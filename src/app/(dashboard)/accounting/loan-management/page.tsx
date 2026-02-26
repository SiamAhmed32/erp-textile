"use client";

import React, { useMemo, useState } from "react";
import {
  Container,
  CustomModal,
  InputField,
  SelectBox,
  PageHeader
} from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Landmark,
  CheckCircle2,
  TrendingDown,
  Eye,
  Search,
  Plus,
  ChevronDown,
  ArrowUpDown,
  UserCircle2,
  Briefcase,
  ShieldAlert,
  History,
  FileText,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ─── Mock ──────────────────────────────────────────────── */
interface ScheduleItem {
  no: number;
  date: string;
  principalAmount: number;
  interest: number;
  total: number;
  balance: number;
  status: "paid" | "upcoming" | "overdue";
}

interface Loan {
  id: string;
  lender: string;
  type: "bank" | "director" | "personal";
  interestRate: number;
  principalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  startDate: string;
  status: "active" | "settled";
  schedule: ScheduleItem[];
}

const loans: Loan[] = [
  {
    id: "L1",
    lender: "National Bank Limited",
    type: "bank",
    interestRate: 9.5,
    principalAmount: 500000,
    paidAmount: 133716,
    outstandingAmount: 366284,
    startDate: "Jan 2025",
    status: "active",
    schedule: [], // truncated for brevity
  },
  {
    id: "L2",
    lender: "Mr. Rahman (Director)",
    type: "director",
    interestRate: 0,
    principalAmount: 200000,
    paidAmount: 66667,
    outstandingAmount: 133333,
    startDate: "Jul 2025",
    status: "active",
    schedule: [], // truncated for brevity
  },
];

const fmt = (n: number) => "৳ " + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

const initialFormData = {
  lenderName: "",
  lenderType: "",
  interestRate: "",
  principal: "",
};

function StakeholderFormModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setFormData(initialFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    resetForm();
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={(val) => !val && onClose()}
      title={<div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-black text-zinc-400">Origination — <span className="text-zinc-900">New Stakeholder</span></div>}
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <InputField
          label="Lender Entity Name"
          name="lenderName"
          value={formData.lenderName}
          onChange={handleChange}
          placeholder="e.g. Brac Bank"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <SelectBox
            label="Liability Type"
            name="lenderType"
            value={formData.lenderType}
            onChange={handleChange as any}
            options={[
              { _id: "bank", name: "Commercial Bank" },
              { _id: "director", name: "Director Loan" },
              { _id: "personal", name: "Personal Debt" },
            ]}
          />
          <InputField
            label="Interest Rate (%)"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
        <InputField
          label="Total Principal (৳)"
          name="principal"
          value={formData.principal}
          onChange={handleChange}
          placeholder="0.00"
          required
        />
        <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
          <Button
            type="button"
            variant="ghost"
            className="h-12 px-8 rounded-xl font-bold text-zinc-500 hover:bg-zinc-100"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-12 px-10 rounded-xl bg-zinc-900 text-white font-bold hover:bg-black transition-all"
          >
            Save Stakeholder
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}

export default function LoanManagementPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState({ field: "lender", dir: "asc" });

  const sortOptions = [
    { label: "Lender Name (A-Z)", field: "lender", dir: "asc" },
    { label: "Lender Name (Z-A)", field: "lender", dir: "desc" },
    { label: "Principal: High to Low", field: "principalAmount", dir: "desc" },
    { label: "Principal: Low to High", field: "principalAmount", dir: "asc" },
    { label: "Outstanding: High to Low", field: "outstandingAmount", dir: "desc" },
  ];

  const filteredLoans = useMemo(() => {
    const result = loans.filter((l) => {
      const matchesSearch = l.lender.toLowerCase().includes(search.toLowerCase()) || l.type.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a: any, b: any) => {
      const fieldA = a[sort.field];
      const fieldB = b[sort.field];
      if (typeof fieldA === "string") {
        return sort.dir === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
      }
      return sort.dir === "asc" ? fieldA - fieldB : fieldB - fieldA;
    });

    return result;
  }, [search, statusFilter, sort]);

  const listColumns = useMemo(
    () => [
      {
        header: "Lender Entity",
        accessor: (row: Loan) => (
          <div className="flex items-center gap-4 py-1">
            <div className={cn(
              "size-10 rounded-2xl flex items-center justify-center border font-black text-[12px]",
              row.type === "bank" ? "bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-200" :
                row.type === "director" ? "bg-indigo-50 border-indigo-100 text-indigo-700" :
                  "bg-amber-50 border-amber-100 text-amber-700"
            )}>
              {row.type === "bank" ? <Landmark size={18} /> :
                row.type === "director" ? <Briefcase size={18} /> : <UserCircle2 size={18} />}
            </div>
            <div className="flex flex-col">
              <span className="font-black text-zinc-900 text-[14px] uppercase tracking-tight">{row.lender}</span>
              <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1.5 mt-0.5">
                <ShieldAlert size={12} className="text-zinc-300" />
                {row.type.toUpperCase()} DEBT
              </span>
            </div>
          </div>
        ),
      },
      {
        header: "Investment Matrix",
        accessor: (row: Loan) => (
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-[14px] font-mono font-black text-zinc-900 italic">
                ৳ {row.principalAmount.toLocaleString()}
              </span>
              <span className="text-[10px] font-black text-zinc-400">@ {row.interestRate}%</span>
            </div>
            <span className="text-[9px] font-black text-zinc-400 tracking-widest uppercase mt-0.5">Principal Origin</span>
          </div>
        ),
      },
      {
        header: "Outstanding Balance",
        accessor: (row: Loan) => (
          <div className="flex flex-col">
            <span className="text-[15px] font-black text-rose-600 font-mono italic">
              ৳ {row.outstandingAmount.toLocaleString()}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-20 h-1 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${(row.paidAmount / row.principalAmount) * 100}%` }}
                />
              </div>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                {Math.round((row.paidAmount / row.principalAmount) * 100)}% Settled
              </span>
            </div>
          </div>
        ),
      },
      {
        header: "Lifecycle",
        accessor: (row: Loan) => (
          <div className="flex items-center gap-2">
            {row.status === "settled" ? (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-black text-[10px] border border-emerald-100 uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3" />
                Closed
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 text-amber-700 font-black text-[10px] border border-amber-100 uppercase tracking-widest">
                <TrendingDown className="w-3 h-3" />
                Amortizing
              </div>
            )}
          </div>
        ),
      },
      {
        header: "Action",
        className: "text-right pr-6",
        accessor: (row: Loan) => (
          <Link href={`/accounting/loan-management/${row.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all rounded-xl border border-transparent hover:border-zinc-200"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <Container className="pb-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Landmark className="w-3 h-3" />
            <span>Liability & Equity Treasury</span>
          </div>
          <h1 className="text-5xl font-black text-zinc-900 tracking-tight italic">Debt Portfolio</h1>
          <p className="text-zinc-500 text-sm font-medium">Manage long-term liabilities, stakeholder loans, and amortization schedules.</p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="h-12 px-8 bg-zinc-900 text-white font-bold rounded-xl hover:bg-black transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Stakeholder
        </Button>
      </div>

      {/* Premium Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 space-y-4">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Active Credits</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900">{loans.length}</span>
            <span className="text-[10px] font-black text-emerald-500 uppercase">Operational</span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 space-y-4">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Total Principal</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 italic">৳ 7.5M</span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 space-y-4">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Portfolio Settlement</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 italic">28%</span>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Weighted Avg</span>
          </div>
        </div>
        <div className="bg-zinc-900 rounded-[2rem] p-6 space-y-4 text-white">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Net Exposure</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black italic">৳ 4.9M</span>
          </div>
        </div>
      </div>

      {/* Premium Toolbar */}
      <div className="bg-zinc-50/50 border border-zinc-200 rounded-[2rem] p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
          <Input
            placeholder="Search lender entity or liability type..."
            className="h-12 pl-11 border-zinc-200 bg-white rounded-2xl focus:ring-zinc-900 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 flex-1 md:flex-none px-6 rounded-2xl border-zinc-200 bg-white font-black text-zinc-600 gap-2">
                <ArrowUpDown className="w-4 h-4 text-zinc-400" />
                <span>{sortOptions.find(o => o.field === sort.field && o.dir === sort.dir)?.label || "Sort"}</span>
                <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl border-zinc-200 shadow-2xl p-2 w-56">
              {sortOptions.map((opt, idx) => (
                <DropdownMenuItem
                  key={idx}
                  onClick={() => setSort({ field: opt.field, dir: opt.dir as any })}
                  className="rounded-xl font-bold py-2 text-zinc-600 hover:bg-zinc-50"
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="h-12 px-6 rounded-2xl border-zinc-200 text-zinc-600 font-bold gap-2">
            <History className="w-4 h-4" />
            Audit
          </Button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        <CustomTable
          data={filteredLoans}
          columns={listColumns}
          scrollAreaHeight="h-[calc(100vh-480px)]"
          rowClassName="group hover:bg-zinc-50/50 transition-colors cursor-default"
        />
      </div>

      <StakeholderFormModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </Container>
  );
}
