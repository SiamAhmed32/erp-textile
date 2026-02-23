"use client";

import React, { useMemo, useState } from "react";
import { Container, CustomModal, InputField } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Eye,
  Landmark,
  ListTree,
  PieChart,
  SquarePen,
  Trash2,
  X,
  ChevronDown,
  ArrowUpDown,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectBox } from "@/components/reusables";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data for Account Headers
const mockHeaders = [
  {
    id: "1001",
    name: "Cash in Hand",
    type: "Asset",
    category: "Current Asset",
    balanceAmount: 150000,
  },
  {
    id: "1002",
    name: "Bank Asia",
    type: "Asset",
    category: "Bank",
    balanceAmount: 2500000,
  },
  {
    id: "2001",
    name: "Accounts Payable",
    type: "Liability",
    category: "Current Liability",
    balanceAmount: 50000,
  },
  {
    id: "3001",
    name: "Sales Revenue",
    type: "Revenue",
    category: "Operating",
    balanceAmount: 4500000,
  },
  {
    id: "4001",
    name: "Office Rent",
    type: "Expense",
    category: "Operating",
    balanceAmount: 20000,
  },
];

const initialFormData = {
  accountCode: "",
  accountName: "",
  accountType: "",
  parentCategory: "",
  openingAmount: "",
};

function HeaderFormModal({
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
      title="Create Account Header"
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit} className="space-y-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <InputField
            label="Account Code"
            name="accountCode"
            value={formData.accountCode}
            onChange={handleChange}
            placeholder="e.g. 1003"
            required
          />
          <SelectBox
            label="Account Type"
            name="accountType"
            value={formData.accountType}
            onChange={handleSelectChange}
            options={[
              { _id: "Asset", name: "Asset" },
              { _id: "Liability", name: "Liability" },
              { _id: "Revenue", name: "Revenue" },
              { _id: "Expense", name: "Expense" },
              { _id: "Equity", name: "Equity" },
            ]}
            required
          />
        </div>
        <InputField
          label="Account Name"
          name="accountName"
          value={formData.accountName}
          onChange={handleChange}
          placeholder="e.g. Petty Cash"
          required
        />
        <SelectBox
          label="Parent Category"
          name="parentCategory"
          value={formData.parentCategory}
          onChange={handleSelectChange}
          options={[
            { _id: "Current Asset", name: "Current Asset" },
            { _id: "Fixed Asset", name: "Fixed Asset" },
            { _id: "Current Liability", name: "Current Liability" },
            { _id: "Long Term Debt", name: "Long Term Debt" },
            { _id: "Operating Expense", name: "Operating Expense" },
          ]}
        />
        <InputField
          label="Opening Amount (৳)"
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
            Save Header
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}

function HeaderDetailsModal({
  open,
  onClose,
  header,
}: {
  open: boolean;
  onClose: () => void;
  header: any;
}) {
  if (!header) return null;

  return (
    <CustomModal
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
      title="Account Header Details"
      maxWidth="500px"
    >
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Account Code
            </p>
            <p className="text-sm font-bold text-slate-900">{header.id}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Account Type
            </p>
            <p className="text-sm font-bold text-slate-900">{header.type}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Account Name
            </p>
            <p className="text-sm font-bold text-slate-900">{header.name}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Category
            </p>
            <p className="text-sm font-bold text-slate-900">
              {header.category}
            </p>
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Current Balance
          </p>
          <p className="text-xl font-black text-secondary">
            ৳ {header.balanceAmount.toLocaleString()}
          </p>
        </div>
        <div className="flex justify-end pt-2">
          <Button
            onClick={onClose}
            className="bg-black text-white hover:bg-black/90"
          >
            Close
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}

export default function AccountHeadersPage() {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedHeader, setSelectedHeader] = useState<any>(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [sort, setSort] = useState({ field: "id", dir: "asc" });

  const sortOptions = [
    { label: "Account Code", field: "id", dir: "asc" },
    { label: "Account Name (A-Z)", field: "name", dir: "asc" },
    { label: "Balance: High to Low", field: "balanceAmount", dir: "desc" },
    { label: "Balance: Low to High", field: "balanceAmount", dir: "asc" },
  ];

  const filteredHeaders = useMemo(() => {
    const result = mockHeaders.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.id.toLowerCase().includes(search.toLowerCase()) ||
        h.category.toLowerCase().includes(search.toLowerCase());
      const matchesType =
        typeFilter === "all" ||
        h.type.toLowerCase() === typeFilter.toLowerCase();
      return matchesSearch && matchesType;
    });

    // Apply Sorting
    result.sort((a: any, b: any) => {
      const fieldA = a[sort.field];
      const fieldB = b[sort.field];

      if (typeof fieldA === "string") {
        return sort.dir === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      return sort.dir === "asc" ? fieldA - fieldB : fieldB - fieldA;
    });

    return result;
  }, [search, typeFilter, sort]);

  const columns = useMemo(
    () => [
      {
        header: "Code",
        accessor: (row: any) => row.id,
      },
      {
        header: "Account Name",
        accessor: (row: any) => (
          <div className="font-semibold text-foreground">{row.name}</div>
        ),
      },
      {
        header: "Type",
        accessor: (row: any) => (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              row.type === "Asset"
                ? "bg-blue-50 text-blue-600"
                : row.type === "Liability"
                  ? "bg-purple-50 text-purple-600"
                  : row.type === "Revenue"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600",
            )}
          >
            {row.type.toUpperCase()}
          </span>
        ),
      },
      {
        header: "Category",
        accessor: (row: any) => row.category,
      },
      {
        header: "Balance",
        accessor: (row: any) => `৳ ${row.balanceAmount.toLocaleString()}`,
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
                setSelectedHeader(row);
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
            title="Total Heads"
            value="38"
            icon={ListTree}
            color="blue"
          />
          <StatsCard
            title="Asset Accounts"
            value="12"
            icon={PieChart}
            color="green"
          />
          <StatsCard
            title="Liability"
            value="9"
            icon={Activity}
            color="orange"
          />
          <StatsCard
            title="Profit/Loss"
            value="৳ 14.2M"
            icon={Landmark}
            color="purple"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Search Group */}
          <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
            <div className="relative flex-1">
              <Input
                placeholder="Search account name, code or category..."
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
            {/* Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-11 px-4 gap-2 bg-white border-slate-200 rounded-lg font-medium",
                    typeFilter !== "all" &&
                      "bg-blue-50 border-blue-200 text-blue-700",
                  )}
                >
                  <span>
                    {typeFilter === "all"
                      ? "All Types"
                      : typeFilter.charAt(0).toUpperCase() +
                        typeFilter.slice(1)}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl shadow-xl border-slate-200/60 p-1"
              >
                {["all", "asset", "liability", "revenue", "expense"].map(
                  (opt) => (
                    <DropdownMenuItem
                      key={opt}
                      onClick={() => setTypeFilter(opt)}
                      className={cn(
                        "rounded-lg my-0.5 capitalize",
                        typeFilter === opt ? "bg-blue-50 text-blue-700" : "",
                      )}
                    >
                      {opt}
                    </DropdownMenuItem>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-11 px-4 gap-2 bg-white border-slate-200 rounded-lg font-medium",
                    (sort.field !== "id" || sort.dir !== "asc") &&
                      "bg-purple-50 border-purple-200 text-purple-700",
                  )}
                >
                  <ArrowUpDown className="h-4 w-4 opacity-50" />
                  <span>
                    {sort.field === "id" && sort.dir === "asc"
                      ? "Sort By"
                      : sortOptions.find(
                          (opt) =>
                            opt.field === sort.field && opt.dir === sort.dir,
                        )?.label}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl shadow-xl border-slate-200/60 p-1"
              >
                {sortOptions.map((opt, idx) => (
                  <DropdownMenuItem
                    key={idx}
                    onClick={() =>
                      setSort({
                        field: opt.field,
                        dir: opt.dir as "asc" | "desc",
                      })
                    }
                    className={cn(
                      "rounded-lg my-0.5",
                      sort.field === opt.field && sort.dir === opt.dir
                        ? "bg-purple-50 text-purple-700"
                        : "",
                    )}
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              className="h-11 bg-black text-white hover:bg-black/90 shadow-sm"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Header
            </Button>
          </div>
        </div>

        {/* Ledger Table */}
        <CustomTable
          data={filteredHeaders}
          columns={columns}
          isLoading={false}
          scrollAreaHeight="h-[calc(100vh-320px)]"
        />
      </div>

      <HeaderFormModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <HeaderDetailsModal
        open={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        header={selectedHeader}
      />
    </Container>
  );
}
