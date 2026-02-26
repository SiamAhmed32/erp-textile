"use client";

import React, { useMemo } from "react";
import { Container, PageHeader } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import {
  Landmark,
  CheckCircle2,
  TrendingDown,
  ArrowLeft,
  Banknote,
  FileDown,
  PlusCircle,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useGetByIdQuery, usePostMutation } from "@/store/services/commonApi";
import { toast } from "sonner";
import { format } from "date-fns";
import { CustomModal, InputField } from "@/components/reusables";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────── */
interface LoanRepayment {
  id: string;
  installmentNo: number;
  date: string;
  principal: number;
  interest: number;
  totalPaid: number;
  remainingBalance: number;
}

interface Loan {
  id: string;
  lenderName: string;
  loanType: string;
  interestRate: number;
  principalAmount: number;
  startDate: string;
  remarks: string;
  repayments: LoanRepayment[];
}

const fmt = (n: number) => "৳ " + Math.abs(Number(n)).toLocaleString("en-IN", { minimumFractionDigits: 2 });

function RepaymentModal({
  open,
  onClose,
  loanId,
  nextInstallment,
}: {
  open: boolean;
  onClose: () => void;
  loanId: string;
  nextInstallment: number;
}) {
  const [formData, setFormData] = React.useState({
    installmentNo: String(nextInstallment),
    date: new Date().toISOString().split("T")[0],
    principal: "",
    interest: "0",
  });
  const [recordRepayment, { isLoading }] = usePostMutation();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await recordRepayment({
        path: `accounting/loans/${loanId}/repayments`,
        body: {
          ...formData,
          installmentNo: Number(formData.installmentNo),
          principal: Number(formData.principal),
          interest: Number(formData.interest),
        },
        invalidate: [`accounting/loans`],
      }).unwrap();

      toast.success("Repayment recorded successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to record repayment");
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={(val) => !val && onClose()}
      title={<div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-black text-zinc-400">Treasury — <span className="text-zinc-900">Record Repayment</span></div>}
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} className="space-y-5 py-2">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Installment #"
            name="installmentNo"
            type="number"
            value={formData.installmentNo}
            onChange={handleChange}
            required
          />
          <InputField
            label="Payment Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Principal Paid (৳)"
            name="principal"
            value={formData.principal}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
          <InputField
            label="Interest Paid (৳)"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
          <Button type="button" variant="ghost" disabled={isLoading} onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isLoading} className="bg-zinc-900 text-white font-bold px-8">
            {isLoading ? "Processing..." : "Record Payment"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}

export default function LoanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [isRepaymentModalOpen, setIsRepaymentModalOpen] = React.useState(false);

  const { data: loanResponse, isLoading: isLoadingLoan } = useGetByIdQuery({
    path: `accounting/loans`,
    id: id,
  });

  const loan = (loanResponse as any)?.data as Loan;

  const detailColumns = useMemo(
    () => [
      {
        header: "#",
        accessor: (row: LoanRepayment) => (
          <span className="font-semibold text-zinc-500 text-sm">#{row.installmentNo}</span>
        ),
      },
      {
        header: "Payment Date",
        accessor: (row: LoanRepayment) => (
          <span className="text-zinc-700 font-medium text-sm">{format(new Date(row.date), "dd MMM yyyy")}</span>
        ),
      },
      {
        header: "Principal",
        accessor: (row: LoanRepayment) => (
          <span className="font-semibold text-zinc-900 text-sm">
            {fmt(Number(row.principal))}
          </span>
        ),
      },
      {
        header: "Interest",
        accessor: (row: LoanRepayment) => (
          <span className="text-amber-600 font-medium text-sm">
            {Number(row.interest) > 0 ? fmt(Number(row.interest)) : "—"}
          </span>
        ),
      },
      {
        header: "Total Paid",
        accessor: (row: LoanRepayment) => (
          <span className="font-semibold text-emerald-600 text-sm">{fmt(Number(row.totalPaid))}</span>
        ),
      },
      {
        header: "Remaining Balance",
        accessor: (row: LoanRepayment) => (
          <span className="text-zinc-500 font-medium text-sm">{fmt(Number(row.remainingBalance))}</span>
        ),
      },
    ],
    [],
  );

  const stats = useMemo(() => {
    if (!loan) return { paid: 0, interestPaid: 0, outstanding: 0 };
    const paid = loan.repayments?.reduce((sum, r) => sum + Number(r.principal), 0) || 0;
    const interestPaid = loan.repayments?.reduce((sum, r) => sum + Number(r.interest), 0) || 0;
    const outstanding = Math.max(0, Number(loan.principalAmount) - paid);
    return { paid, interestPaid, outstanding };
  }, [loan]);

  if (isLoadingLoan) {
    return (
      <Container className="py-20 text-center">
        <div className="animate-pulse text-zinc-400 font-black uppercase tracking-widest">Securing Treasury Data...</div>
      </Container>
    );
  }

  if (!loan) {
    return (
      <Container className="pb-10 text-center py-24">
        <div className="size-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-zinc-100">
          <ShieldAlert className="size-8 text-zinc-300" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">Stakeholder Record Missing</h2>
        <p className="text-zinc-500 mt-2 max-w-sm mx-auto">This debt facility might have been archived or the ID is incorrect in the treasury system.</p>
        <Link href="/accounting/loan-management">
          <Button variant="outline" className="mt-8 rounded-xl h-11 px-8 font-bold border-zinc-200">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Portfolio
          </Button>
        </Link>
      </Container>
    );
  }

  const completionPercent = Math.min(100, (stats.paid / Number(loan.principalAmount)) * 100);

  return (
    <Container className="pb-10 space-y-6">
      <PageHeader
        title={loan.lenderName || "Stakeholder Detail"}
        breadcrumbItems={[
          { label: "Accounting", href: "/accounting/overview" },
          { label: "Debt Portfolio", href: "/accounting/loan-management" },
          { label: "Details" },
        ]}
        backHref="/accounting/loan-management"
        actions={
          <div className="flex gap-2">
            <Button
              onClick={() => setIsRepaymentModalOpen(true)}
              className="h-9 px-4 bg-zinc-900 text-white font-bold rounded-md hover:bg-black transition-all flex items-center gap-2 text-sm shadow-sm"
            >
              <PlusCircle className="size-4" />
              Record Repayment
            </Button>
            <Button variant="outline" className="h-9 px-4 rounded-md border-zinc-200 bg-white text-zinc-600 font-bold gap-2 text-sm shadow-sm">
              <FileDown className="size-4 text-zinc-400" />
              Export Schedule
            </Button>
          </div>
        }
      />

      {/* Entity Card */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="flex items-center gap-4">
          <div className="size-12 bg-zinc-100 border border-zinc-200 rounded-lg flex items-center justify-center text-zinc-600">
            <Banknote className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-xl text-zinc-900 leading-tight">
                {loan.lenderName}
              </h3>
              <span className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border",
                stats.outstanding <= 0
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-amber-50 text-amber-600 border-amber-100"
              )}>
                {stats.outstanding <= 0 ? "Fully Settled" : "Active Facility"}
              </span>
            </div>
            <p className="text-xs font-medium text-zinc-500 uppercase flex items-center gap-2 mt-1.5">
              <span className="bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200 text-[10px] text-zinc-600 font-bold">
                {(loan.loanType || 'GENERAL').toUpperCase()}
              </span>
              <span className="size-1 bg-zinc-300 rounded-full" />
              DISBURSED {format(new Date(loan.startDate), "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        <div className="text-left md:text-right">
          <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest">Remarks</p>
          <p className="text-sm font-medium text-zinc-700 max-w-sm">{loan.remarks || "No additional remarks"}</p>
        </div>
      </div>

      {/* Loan Progress Meter */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Repayment Progress</p>
            <h4 className="text-2xl font-black text-zinc-900 mt-1">{completionPercent.toFixed(1)}% <span className="text-xs text-zinc-400 font-medium">SETTLED</span></h4>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Target Principal</p>
            <p className="text-sm font-bold text-zinc-900">{fmt(loan.principalAmount)}</p>
          </div>
        </div>
        <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
          <div
            className="h-full bg-emerald-500 transition-all duration-1000 ease-out flex items-center justify-end px-1"
            style={{ width: `${completionPercent}%` }}
          >
            {completionPercent > 10 && <div className="size-1.5 bg-white rounded-full shadow-sm animate-pulse" />}
          </div>
        </div>
        <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest pt-1">
          <span>Origination</span>
          <span>Fully Settled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Landmark className="size-8" />
          </div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Principal Facility</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900">{fmt(loan.principalAmount)}</span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Rate of Interest</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900">{loan.interestRate}%</span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Per Annum</span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Repaid</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{fmt(stats.paid)}</span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Interest Expenses</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900">{fmt(stats.interestPaid)}</span>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Net Outstandings</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{fmt(stats.outstanding)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h3 className="font-semibold text-zinc-900 text-sm">Amortization History</h3>
            <p className="text-xs text-zinc-500 font-medium">Tracking principal reductions and interest expenses.</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Installments</span>
            <p className="font-bold text-zinc-900 font-mono text-sm">{loan.repayments?.length || 0}</p>
          </div>
        </div>
        <CustomTable
          data={loan.repayments || []}
          columns={detailColumns}
          scrollAreaHeight="h-[calc(100vh-500px)]"
        />
      </div>

      <RepaymentModal
        open={isRepaymentModalOpen}
        onClose={() => setIsRepaymentModalOpen(false)}
        loanId={loan.id}
        nextInstallment={(loan.repayments?.length || 0) + 1}
      />
    </Container>
  );
}
