"use client";

import React, { useMemo, useState } from "react";
import {
  Container,
  CustomModal,
  InputField,
  DateRangeFilter,
} from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Wallet, CheckCircle2, AlertCircle, Eye } from "lucide-react";
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

const fmt = (n: number) => "৳ " + Math.abs(n).toLocaleString("en-IN");

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
      onOpenChange={(val) => {
        if (!val) {
          onClose();
          resetForm();
        }
      }}
      title="Add New Employee Record"
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit} className="space-y-1">
        <InputField
          label="Employee Full Name"
          name="employeeName"
          value={formData.employeeName}
          onChange={handleChange}
          placeholder="e.g. Tanvir Ahmed"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
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
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onClose();
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-8 bg-black text-white hover:bg-black/90"
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
        header: "Employee",
        accessor: (row: EmployeeIOU) => (
          <div className="font-semibold text-foreground">{row.name}</div>
        ),
      },
      {
        header: "Designation",
        accessor: (row: EmployeeIOU) => row.designation,
      },
      {
        header: "Total Advance",
        accessor: (row: EmployeeIOU) => fmt(row.totalIssuedAmount),
      },
      {
        header: "Settled",
        accessor: (row: EmployeeIOU) => fmt(row.totalReturnedAmount),
      },
      {
        header: "Current IOU",
        accessor: (row: EmployeeIOU) => fmt(row.outstandingAmount),
      },
      {
        header: "Last Activity",
        accessor: (row: EmployeeIOU) => row.lastTransaction,
      },
      {
        header: "Action",
        accessor: (row: EmployeeIOU) => (
          <Link href={`/accounting/cash-book/${row.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
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
    <Container className="pb-10">
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total Employees"
            value={employees.length}
            icon={Wallet}
            color="blue"
          />
          <StatsCard
            title="Total Advanced"
            value="৳ 28,000"
            icon={Wallet}
            color="orange"
          />
          <StatsCard
            title="Settled Amount"
            value="৳ 13,000"
            icon={CheckCircle2}
            color="green"
          />
          <StatsCard
            title="Outstanding Amount"
            value="৳ 15,000"
            icon={AlertCircle}
            color="red"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
            <Input
              placeholder="Search by employee name or designation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              className="bg-black text-white hover:bg-black/80"
              onClick={() => {}}
            >
              Search
            </Button>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
            <DateRangeFilter
              start={dateRange.start}
              end={dateRange.end}
              onFilterChange={setDateRange}
              placeholder="Activity Dates"
            />
            <Button
              className="bg-black text-white hover:bg-black/90"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Employee
            </Button>
          </div>
        </div>

        {/* Employee Table */}
        <CustomTable
          data={employees}
          columns={listColumns}
          scrollAreaHeight="h-[calc(100vh-320px)]"
        />
      </div>

      <EmployeeFormModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </Container>
  );
}
