"use client";

import {
  Container,
  CustomModal,
  InputField,
  PageHeader,
  SelectBox,
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
  ArrowUpDown,
  Briefcase,
  CheckCircle2,
  Eye,
  History,
  Landmark,
  Plus,
  TrendingDown,
  UserCircle2
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

import { notify } from "@/lib/notifications";
import { useGetAllQuery, usePostMutation } from "@/store/services/commonApi";

/* ─── Types ──────────────────────────────────────────────── */
interface Loan {
  id: string;
  lenderName: string;
  loanType: string;
  interestRate: number;
  principalAmount: number;
  startDate: string;
  status: "active" | "settled";
  repayments: any[];
}

const fmt = (n: number) =>
  "৳ " + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

const initialFormData = {
  lenderName: "",
  loanType: "",
  interestRate: "",
  principalAmount: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  remarks: "",
  companyProfileId: "",
};

function StakeholderFormModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [createLoan, { isLoading }] = usePostMutation();

  const { data: companiesPayload } = useGetAllQuery({
    path: "company-profiles",
    limit: 100,
  });

  const companies = useMemo(
    () => ((companiesPayload as any)?.data || []) as any[],
    [companiesPayload],
  );

  // Auto-select first company profile if none selected
  React.useEffect(() => {
    if (companies.length > 0 && !formData.companyProfileId) {
      setFormData((prev) => ({ ...prev, companyProfileId: companies[0].id }));
    }
  }, [companies, formData.companyProfileId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setFormData(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        ...formData,
        principalAmount:
          parseFloat(
            String(formData.principalAmount).replace(/[^0-9.]/g, ""),
          ) || 0,
        interestRate:
          parseFloat(String(formData.interestRate).replace(/[^0-9.]/g, "")) ||
          0,
      };

      if (!payload.endDate) delete payload.endDate;
      if (!payload.loanType) delete payload.loanType;
      if (!payload.remarks) delete payload.remarks;

      await createLoan({
        path: "accounting/loans",
        body: {
          ...payload,
          companyProfileId: payload.companyProfileId || companies[0]?.id,
        },
        invalidate: ["accounting/loans"],
      }).unwrap();

      notify.success("Debt stakeholder registered successfully");
      onClose();
      resetForm();
    } catch (err: any) {
      notify.error(
        err?.data?.message ||
        "Could not register the stakeholder. Please try again.",
      );
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={(val) => !val && onClose()}
      title={
        <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-black text-zinc-400">
          Origination — <span className="text-zinc-900">New Stakeholder</span>
        </div>
      }
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
            name="loanType"
            value={formData.loanType}
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
        <SelectBox
          label="Associated Business Profile"
          name="companyProfileId"
          value={formData.companyProfileId}
          onChange={handleChange as any}
          options={companies.map((c) => ({ _id: c.id, name: c.name }))}
          placeholder="Select Company Profile"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Total Principal (৳)"
            name="principalAmount"
            value={formData.principalAmount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Disbursement Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
            <InputField
              label="Maturity / End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <InputField
          label="Remarks / Notes"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Optional notes..."
        />
        <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
          <Button
            type="button"
            variant="ghost"
            disabled={isLoading}
            className="h-12 px-8 rounded-xl font-bold text-zinc-500 hover:bg-zinc-100"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 px-10 rounded-xl bg-zinc-900 text-white font-bold hover:bg-black transition-all"
          >
            {isLoading ? "Saving..." : "Save Stakeholder"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}

export default function LoanManagementPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "createdAt",
    dir: "desc",
  });

  const { data: loansResponse, isLoading: isLoadingLoans } = useGetAllQuery({
    path: "accounting/loans",
    page,
    limit: 10,
    search: search || undefined,
    sortBy: sort.field,
    sortOrder: sort.dir,
  });

  const loans = useMemo(() => {
    return ((loansResponse as any)?.data || []) as Loan[];
  }, [loansResponse]);

  const sortOptions = [
    { label: "Date Added (Newest)", field: "createdAt", dir: "desc" },
    { label: "Date Added (Oldest)", field: "createdAt", dir: "asc" },
    { label: "Lender Name (A-Z)", field: "lenderName", dir: "asc" },
    { label: "Principal: High to Low", field: "principalAmount", dir: "desc" },
  ];

  const listColumns = useMemo(
    () => [
      {
        header: "Lender Entity",
        accessor: (row: Loan) => (
          <div className="flex items-center gap-3 py-1">
            <div
              className={cn(
                "size-9 rounded-lg flex items-center justify-center border font-semibold text-[10px]",
                row.loanType === "bank"
                  ? "bg-zinc-900 border-zinc-900 text-white shadow-sm"
                  : row.loanType === "director"
                    ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                    : "bg-amber-50 border-amber-100 text-amber-700",
              )}
            >
              {row.loanType === "bank" ? (
                <Landmark size={14} />
              ) : row.loanType === "director" ? (
                <Briefcase size={14} />
              ) : (
                <UserCircle2 size={14} />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-zinc-900 text-sm whitespace-nowrap">
                {row.lenderName}
              </span>
              <span className="text-xs text-zinc-500 whitespace-nowrap mt-0.5">
                {row.loanType
                  ? row.loanType.charAt(0).toUpperCase() + row.loanType.slice(1)
                  : "Other"}{" "}
                Debt
              </span>
            </div>
          </div>
        ),
      },
      {
        header: "Principal",
        accessor: (row: Loan) => (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-900">
              ৳ {Number(row.principalAmount).toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500 mt-0.5">
              {row.interestRate}% Interest
            </span>
          </div>
        ),
      },
      {
        header: "Outstanding Balance",
        accessor: (row: Loan) => {
          const paidPrincipal =
            row.repayments?.reduce((sum, r) => sum + Number(r.principal), 0) ||
            0;
          const outstanding = Number(row.principalAmount) - paidPrincipal;
          const settledPct =
            Math.min(
              100,
              Math.round((paidPrincipal / Number(row.principalAmount)) * 100),
            ) || 0;

          return (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-rose-600">
                ৳ {outstanding.toLocaleString()}
              </span>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-16 h-1 bg-emerald-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${settledPct}%` }}
                  />
                </div>
                <span className="text-[10px] text-zinc-500 font-medium">
                  {settledPct}%
                </span>
              </div>
            </div>
          );
        },
      },
      {
        header: "Status",
        accessor: (row: Loan) => {
          const paidPrincipal =
            row.repayments?.reduce((sum, r) => sum + Number(r.principal), 0) ||
            0;
          const isSettled = paidPrincipal >= Number(row.principalAmount);
          return (
            <div>
              {isSettled ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3" /> Settled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100">
                  <TrendingDown className="w-3 h-3" /> Amortizing
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: "Action",
        className: "text-right pr-6",
        accessor: (row: Loan) => (
          <Link
            href={`/accounting/loan-management/${row.id}`}
            className="inline-flex justify-end"
          >
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 gap-1.5 text-xs border-zinc-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all font-medium"
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
        title="Debt Portfolio"
        breadcrumbItems={[
          { label: "Accounting", href: "/accounting/overview" },
          { label: "Debt Portfolio" },
        ]}
        actions={
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 px-4 bg-zinc-900 text-white font-bold rounded-md hover:bg-black transition-all flex items-center gap-2 text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Stakeholder
          </Button>
        }
      />

      {/* Toolbar - Standardized for Consistency */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between py-2">
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <div className="relative flex-1">
            <Input
              placeholder="Search lender entity or liability type..."
              className="h-11 bg-white border-zinc-200 rounded-lg shadow-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button
            className="bg-black text-white hover:bg-black/90 font-bold px-6 h-11 rounded-lg"
            onClick={() => setPage(1)}
          >
            Search
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Group */}
          <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 h-11 shadow-sm shrink-0">
            <ArrowUpDown className="h-4 w-4 text-zinc-400 shrink-0" />
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1">
              Sort By
            </span>
            <Select
              value={sort.field + "_" + sort.dir}
              onValueChange={(value: string) => {
                const [f, d] = value.split("_");
                setSort({ field: f, dir: d as any });
                setPage(1);
              }}
            >
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-xs font-bold uppercase tracking-wider w-[140px]">
                <SelectValue placeholder="Sort entries" />
              </SelectTrigger>
              <SelectContent
                align="end"
                className="rounded-xl shadow-xl border-zinc-200"
              >
                {sortOptions.map((o) => (
                  <SelectItem
                    key={o.field + "_" + o.dir}
                    value={o.field + "_" + o.dir}
                    className="text-xs font-semibold py-2.5"
                  >
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            className="h-11 px-4 rounded-lg border-zinc-200 bg-white text-zinc-600 font-semibold text-xs uppercase tracking-wider gap-2 flex items-center shadow-sm hover:bg-zinc-50"
          >
            <History className="w-4 h-4 text-zinc-400" />
            <span>Audit Trail</span>
          </Button>

          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2 hidden sm:block whitespace-nowrap">
            {(loansResponse as any)?.meta?.total || 0} Records
          </p>
        </div>
      </div>

      <CustomTable
        data={loans}
        columns={listColumns}
        isLoading={isLoadingLoans}
        pagination={{
          currentPage: page,
          totalPages: (loansResponse as any)?.meta?.pagination?.totalPages || 1,
          onPageChange: setPage,
        }}
        scrollAreaHeight="h-[calc(100vh-350px)]"
        rowClassName="group hover:bg-zinc-50/50 transition-colors cursor-default border-b border-zinc-100 last:border-0"
      />

      <StakeholderFormModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </Container>
  );
}
