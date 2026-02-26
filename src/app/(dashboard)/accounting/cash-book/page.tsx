"use client";

import React, { useMemo, useState } from "react";
import {
  Container,
  CustomModal,
  InputField,
  DateRangeFilter,
  PageHeader
} from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  CheckCircle2,
  AlertCircle,
  Eye,
  Search,
  Plus,
  History,
  UserCircle2,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ─── Mock data ─────────────────────────────────────────── */
interface EmployeeIOU {
  id: string;
  name: string;
  designation: string;
  totalIssuedAmount: number;
  totalReturnedAmount: number;
  outstandingAmount: number;
  lastTransaction: string;
}

const employees: EmployeeIOU[] = [
  {
    id: "1",
    name: "Salim Ahmed",
    designation: "Production Manager",
    totalIssuedAmount: 15000,
    totalReturnedAmount: 5000,
    outstandingAmount: 10000,
    lastTransaction: "17 Feb 2026",
  },
  {
    id: "2",
    name: "Kamal Hossain",
    designation: "Executive (Admin)",
    totalIssuedAmount: 8000,
    totalReturnedAmount: 8000,
    outstandingAmount: 0,
    lastTransaction: "16 Feb 2026",
  },
  {
    id: "3",
    name: "Rina Begum",
    designation: "Support Staff",
    totalIssuedAmount: 5000,
    totalReturnedAmount: 0,
    outstandingAmount: 5000,
    lastTransaction: "18 Feb 2026",
  },
];

const fmt = (n: number) => "৳ " + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

const initialFormData = {
  employeeName: "",
  designation: "",
  employeeId: "",
  openingAmount: "",
};

function EmployeeFormModal({
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
      title={<div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-black text-zinc-400">Payroll Context — <span className="text-zinc-900">Advance Registration</span></div>}
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <InputField
          label="Employee Full Name"
          name="employeeName"
          value={formData.employeeName}
          onChange={handleChange}
          placeholder="e.g. Tanvir Ahmed"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="e.g. Sales Officer"
            required
          />
          <InputField
            label="Employee ID"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            placeholder="e.g. EMP-1024"
          />
        </div>
        <InputField
          label="Opening Advance Amount (৳)"
          name="openingAmount"
          value={formData.openingAmount}
          onChange={handleChange}
          placeholder="0.00"
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
            Register Employee
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}

export default function CashBookPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const listColumns = useMemo(
    () => [
      {
        header: "Beneficiary / Employee",
        accessor: (row: EmployeeIOU) => (
          <div className="flex items-center gap-4 py-1">
            <div className="size-10 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center font-black text-[12px] text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-all">
              {row.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex flex-col">
              <span className="font-black text-zinc-900 text-[14px] uppercase tracking-tight italic">{row.name}</span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{row.designation}</span>
            </div>
          </div>
        ),
      },
      {
        header: "Life-To-Date Issuance",
        accessor: (row: EmployeeIOU) => (
          <div className="flex flex-col">
            <span className="text-[14px] font-mono font-black text-zinc-900">
              {fmt(row.totalIssuedAmount)}
            </span>
            <span className="text-[9px] font-black text-zinc-400 tracking-widest uppercase mt-0.5">Total Advanced</span>
          </div>
        ),
      },
      {
        header: "Liquidated (Settled)",
        accessor: (row: EmployeeIOU) => (
          <div className="flex flex-col">
            <span className="text-[14px] font-mono font-black text-emerald-600">
              {fmt(row.totalReturnedAmount)}
            </span>
            <span className="text-[9px] font-black text-zinc-400 tracking-widest uppercase mt-0.5">Salary Adjustments</span>
          </div>
        ),
      },
      {
        header: "Net Outstanding IOU",
        accessor: (row: EmployeeIOU) => (
          <div className="flex flex-col">
            <span className={cn(
              "text-[15px] font-black font-mono italic",
              row.outstandingAmount > 0 ? "text-rose-600" : "text-zinc-300"
            )}>
              {fmt(row.outstandingAmount)}
            </span>
            {row.outstandingAmount > 0 ? (
              <span className="text-[9px] font-black text-rose-400/80 uppercase tracking-widest mt-0.5 animate-pulse">Pending Collection</span>
            ) : (
              <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mt-0.5">Clear Account</span>
            )}
          </div>
        ),
      },
      {
        header: "Recent Trace",
        accessor: (row: EmployeeIOU) => (
          <div className="flex items-center gap-2 text-zinc-400 font-bold text-[11px]">
            <History size={12} />
            {row.lastTransaction}
          </div>
        ),
      },
      {
        header: "Action",
        className: "text-right pr-6",
        accessor: (row: EmployeeIOU) => (
          <Link href={`/accounting/cash-book/${row.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all rounded-xl border border-transparent hover:border-zinc-200"
            >
              <ChevronRight className="h-4 w-4" />
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
            <Coins className="w-3 h-3" />
            <span>Liquidity & Employee Treasury</span>
          </div>
          <h1 className="text-5xl font-black text-zinc-900 tracking-tight italic">Petty Cash Book</h1>
          <p className="text-zinc-500 text-sm font-medium">Internal cash reconciliation, office expenses, and employee advance tracking.</p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="h-12 px-8 bg-zinc-900 text-white font-bold rounded-xl hover:bg-black transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Employee Record
        </Button>
      </div>

      {/* Premium Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 space-y-4">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Beneficiaries</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900">{employees.length}</span>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Leads</span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 space-y-4">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Total Advanced</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 italic">৳ 28,000</span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 space-y-4">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Salary Liquidation</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 italic">৳ 13,000</span>
            <div className="flex items-center text-emerald-500"><ArrowUpRight size={16} /></div>
          </div>
        </div>
        <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-6 space-y-4">
          <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest text-rose-400">Net Exposure (IOUs)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 italic">৳ 15,000</span>
            <div className="flex items-center text-rose-500"><AlertCircle size={16} /></div>
          </div>
        </div>
      </div>

      {/* Premium Toolbar */}
      <div className="bg-zinc-50/50 border border-zinc-200 rounded-[2rem] p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
          <Input
            placeholder="Search beneficiary by name or role..."
            className="h-12 pl-11 border-zinc-200 bg-white rounded-2xl focus:ring-zinc-900 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="hidden lg:block">
            <DateRangeFilter
              start={dateRange.start}
              end={dateRange.end}
              onFilterChange={setDateRange}
              placeholder="Activity Dates"
            />
          </div>
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-zinc-200 text-zinc-600 font-bold gap-2">
            <Filter className="w-4 h-4" />
            Refine
          </Button>
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-zinc-200 text-zinc-600 font-bold gap-2">
            <History className="w-4 h-4" />
            Audit
          </Button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        <CustomTable
          data={employees}
          columns={listColumns}
          scrollAreaHeight="h-[calc(100vh-480px)]"
          rowClassName="group hover:bg-zinc-50 transition-colors cursor-default"
        />
      </div>

      <EmployeeFormModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </Container>
  );
}
