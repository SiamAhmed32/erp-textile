"use client";

import React, { useMemo, useState } from "react";
import {
  Container,
  CustomModal,
  InputField,
  SelectBox,
} from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import StatsCard from "@/components/dashboard/StatsCard";
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
    schedule: [
      {
        no: 1,
        date: "Mar 2025",
        principalAmount: 10000,
        interest: 3958,
        total: 13958,
        balance: 490000,
        status: "paid",
      },
      {
        no: 2,
        date: "Jun 2025",
        principalAmount: 10000,
        interest: 3879,
        total: 13879,
        balance: 480000,
        status: "paid",
      },
      {
        no: 3,
        date: "Sep 2025",
        principalAmount: 10000,
        interest: 3800,
        total: 13800,
        balance: 470000,
        status: "paid",
      },
      {
        no: 4,
        date: "Dec 2025",
        principalAmount: 10000,
        interest: 3721,
        total: 13721,
        balance: 460000,
        status: "paid",
      },
      {
        no: 5,
        date: "Mar 2026",
        principalAmount: 10000,
        interest: 3642,
        total: 13642,
        balance: 450000,
        status: "upcoming",
      },
      {
        no: 6,
        date: "Jun 2026",
        principalAmount: 10000,
        interest: 3563,
        total: 13563,
        balance: 440000,
        status: "upcoming",
      },
    ],
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
    schedule: [
      {
        no: 1,
        date: "Oct 2025",
        principalAmount: 33333,
        interest: 0,
        total: 33333,
        balance: 166667,
        status: "paid",
      },
      {
        no: 2,
        date: "Jan 2026",
        principalAmount: 33334,
        interest: 0,
        total: 33334,
        balance: 133333,
        status: "paid",
      },
      {
        no: 3,
        date: "Apr 2026",
        principalAmount: 33333,
        interest: 0,
        total: 33333,
        balance: 100000,
        status: "upcoming",
      },
      {
        no: 4,
        date: "Jul 2026",
        principalAmount: 33333,
        interest: 0,
        total: 33333,
        balance: 66667,
        status: "upcoming",
      },
      {
        no: 5,
        date: "Oct 2026",
        principalAmount: 33334,
        interest: 0,
        total: 33334,
        balance: 33333,
        status: "upcoming",
      },
      {
        no: 6,
        date: "Jan 2027",
        principalAmount: 33333,
        interest: 0,
        total: 33333,
        balance: 0,
        status: "upcoming",
      },
    ],
  },
];

const fmt = (n: number) => "৳ " + Math.abs(n).toLocaleString("en-IN");

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
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
      title="Add New Stakeholder / Lender"
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit} className="space-y-0">
        <InputField
          label="Lender Name"
          name="lenderName"
          value={formData.lenderName}
          onChange={handleChange}
          placeholder="e.g. Brac Bank"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <SelectBox
            label="Lender Type"
            name="lenderType"
            value={formData.lenderType}
            onChange={handleSelectChange}
            options={[
              { _id: "bank", name: "Bank" },
              { _id: "director", name: "Director" },
              { _id: "personal", name: "Personal" },
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
          label="Initial Principal (৳)"
          name="principal"
          value={formData.principal}
          onChange={handleChange}
          placeholder="0.00"
          required
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

  const filteredLoans = useMemo(() => {
    return loans.filter((l) => {
      const matchesSearch =
        l.lender.toLowerCase().includes(search.toLowerCase()) ||
        l.type.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const listColumns = useMemo(
    () => [
      {
        header: "Lender",
        accessor: (row: Loan) => (
          <div className="font-semibold text-foreground">{row.lender}</div>
        ),
      },
      {
        header: "Type",
        accessor: (row: Loan) => (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">
            {row.type.toUpperCase()}
          </span>
        ),
      },
      {
        header: "Principal",
        accessor: (row: Loan) => fmt(row.principalAmount),
      },
      {
        header: "Repaid",
        accessor: (row: Loan) => fmt(row.paidAmount),
      },
      {
        header: "Outstanding",
        accessor: (row: Loan) => fmt(row.outstandingAmount),
      },
      {
        header: "Status",
        accessor: (row: Loan) => (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              row.status === "settled"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600",
            )}
          >
            {row.status.toUpperCase()}
          </span>
        ),
      },
      {
        header: "Action",
        accessor: (row: Loan) => (
          <Link href={`/accounting/loan-management/${row.id}`}>
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
            title="Active Loans"
            value={loans.filter((l) => l.status === "active").length}
            icon={Landmark}
            color="blue"
          />
          <StatsCard
            title="Total Principal Amount"
            value="৳ 7,00,000"
            icon={Landmark}
            color="orange"
          />
          <StatsCard
            title="Settled Amount"
            value="৳ 2,00,383"
            icon={CheckCircle2}
            color="green"
          />
          <StatsCard
            title="Net Liability"
            value="৳ 4,99,617"
            icon={TrendingDown}
            color="red"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Search Group */}
          <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
            <div className="relative flex-1">
              <Input
                placeholder="Search lender name or type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 bg-white border-slate-200 rounded-lg shadow-sm"
              />
            </div>
            <Button
              variant="outline"
              className="h-11 px-6 bg-white border-slate-200 font-medium"
            >
              Search
            </Button>
          </div>

          {/* Right: Filters Group */}
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-11 px-4 gap-2 bg-white border-slate-200 rounded-lg font-medium",
                    statusFilter !== "all" &&
                      "bg-amber-50 border-amber-200 text-amber-700",
                  )}
                >
                  <span>
                    {statusFilter === "all"
                      ? "All Status"
                      : statusFilter.charAt(0).toUpperCase() +
                        statusFilter.slice(1)}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl shadow-xl border-slate-200/60 p-1"
              >
                {["all", "active", "settled"].map((opt) => (
                  <DropdownMenuItem
                    key={opt}
                    onClick={() => setStatusFilter(opt)}
                    className={cn(
                      "rounded-lg my-0.5 capitalize",
                      statusFilter === opt ? "bg-amber-50 text-amber-700" : "",
                    )}
                  >
                    {opt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 px-4 gap-2 bg-white border-slate-200 rounded-lg font-medium"
                >
                  <ArrowUpDown className="h-4 w-4 opacity-50" />
                  <span>Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl shadow-xl border-slate-200/60 p-1"
              >
                <DropdownMenuItem className="rounded-lg my-0.5">
                  Lender Name
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg my-0.5">
                  Principal: High to Low
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg my-0.5">
                  Principal: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg my-0.5">
                  Outstanding Amount
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              className="h-11 bg-black text-white hover:bg-black/90 shadow-sm"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Stakeholder
            </Button>
          </div>
        </div>

        {/* Loan Table */}
        <CustomTable
          data={filteredLoans}
          columns={listColumns}
          scrollAreaHeight="h-[calc(100vh-320px)]"
        />
      </div>

      <StakeholderFormModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </Container>
  );
}
