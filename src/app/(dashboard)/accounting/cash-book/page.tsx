"use client";

import React, { useMemo, useState } from "react";
import {
  Container,
  CustomModal,
  InputField,
  DateRangeFilter,
  PageHeader,
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
  Filter,
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

const fmt = (n: number) =>
  "৳ " + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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
      title={
        <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-black text-zinc-400">
          Payroll Context —{" "}
          <span className="text-zinc-900">Advance Registration</span>
        </div>
      }
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
            <div className="size-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-[12px] text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-all">
              {row.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-zinc-900 text-sm">
                {row.name}
              </span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                {row.designation}
              </span>
            </div>
          </div>
        ),
      },
      {
        header: "Total Advanced",
        accessor: (row: EmployeeIOU) => (
          <div className="flex flex-col">
            <span className="text-sm font-mono font-bold text-zinc-900">
              {fmt(row.totalIssuedAmount)}
            </span>
          </div>
        ),
      },
      {
        header: "Settled",
        accessor: (row: EmployeeIOU) => (
          <div className="flex flex-col">
            <span className="text-sm font-mono font-bold text-emerald-600">
              {fmt(row.totalReturnedAmount)}
            </span>
          </div>
        ),
      },
      {
        header: "Net Outstanding",
        accessor: (row: EmployeeIOU) => (
          <div className="flex flex-col">
            <span
              className={cn(
                "text-sm font-bold font-mono",
                row.outstandingAmount > 0
                  ? "text-rose-600"
                  : "text-emerald-600",
              )}
            >
              {fmt(row.outstandingAmount)}
            </span>
          </div>
        ),
      },
      {
        header: "Last Transaction",
        accessor: (row: EmployeeIOU) => (
          <div className="flex items-center gap-2 text-zinc-500 font-medium text-xs">
            <History size={12} />
            {row.lastTransaction}
          </div>
        ),
      },
      {
        header: "Action",
        className: "text-right pr-6",
        accessor: (row: EmployeeIOU) => (
          <Link
            href={`/accounting/cash-book/${row.id}`}
            className="inline-flex justify-end"
          >
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 gap-1.5 text-xs border-zinc-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all font-bold"
            >
              <Eye className="w-3.5 h-3.5" />
              View
            </Button>
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <Container className="pb-10 space-y-6">
      <PageHeader
        title="Petty Cash Book"
        breadcrumbItems={[
          { label: "Accounting", href: "/accounting/overview" },
          { label: "Petty Cash Book" },
        ]}
        icon={Wallet}
        actions={
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 px-4 bg-zinc-900 text-white font-bold rounded-md hover:bg-black transition-all flex items-center gap-2 text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Beneficiary
          </Button>
        }
      />

      {/* Premium Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Active Leads
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-zinc-900">
              {employees.length}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              Operational
            </span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Total Advanced
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900 font-semibold italic tracking-tight">
              ৳ 28.0K
            </span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Settled
          </p>
          <div className="flex items-baseline justify-between font-semibold">
            <span className="text-2xl font-bold text-emerald-600 italic tracking-tight">
              ৳ 13.0K
            </span>
            <div className="flex items-center text-emerald-500 animate-pulse">
              <ArrowUpRight size={14} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-rose-100 rounded-xl p-5 shadow-sm space-y-3">
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
            Net Exposure
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600 font-semibold italic tracking-tight">
              ৳ 15.0K
            </span>
            <div className="flex items-center text-rose-500">
              <AlertCircle size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar - Standardized for Consistency */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between py-2 mb-4">
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search beneficiary by name or role..."
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
          <div className="hidden lg:block">
            <DateRangeFilter
              start={dateRange.start}
              end={dateRange.end}
              onFilterChange={setDateRange}
              placeholder="Activity Dates"
            />
          </div>
          <Button
            variant="outline"
            className="h-11 px-4 rounded-lg border-zinc-200 bg-white text-zinc-600 font-semibold text-xs uppercase tracking-wider gap-2 flex items-center shadow-sm hover:bg-zinc-50"
          >
            <History className="w-4 h-4 text-zinc-400" />
            <span>Audit Trail</span>
          </Button>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2 hidden sm:block">
            {employees.length} Records
          </p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <CustomTable
          data={employees}
          columns={listColumns}
          scrollAreaHeight="h-[calc(100vh-450px)]"
          rowClassName="group hover:bg-zinc-50/50 transition-colors cursor-default border-b border-zinc-100 last:border-0"
        />
      </div>

      <EmployeeFormModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </Container>
  );
}
