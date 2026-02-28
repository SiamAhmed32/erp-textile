"use client";

import React from "react";
import { Container, PageHeader } from "@/components/reusables";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  Wallet,
  Calendar,
  ChevronRight,
  PieChart,
  History,
  Landmark
} from "lucide-react";
import { format } from "date-fns";
import RecentTransactions from "./_components/RecentTransactions";
import { useGetAllQuery } from "@/store/services/commonApi";

// ── Shared Premium Stat Card ─────────────────────────────────────────────
const PremiumStatCard = ({
  label,
  value,
  subLabel,
  icon: Icon,
  trend,
  color
}: {
  label: string,
  value: string,
  subLabel: string,
  icon: any,
  trend?: string,
  color: string
}) => (
  <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 space-y-6 shadow-sm hover:shadow-xl hover:shadow-zinc-200 transition-all duration-500 group relative overflow-hidden">
    <div className={cn(
      "absolute -right-4 -top-4 w-24 h-24 opacity-[0.03] group-hover:scale-125 transition-transform duration-700",
      color === "green" ? "text-emerald-500" : color === "red" ? "text-rose-500" : "text-zinc-500"
    )}>
      <Icon size={96} strokeWidth={1} />
    </div>

    <div className="flex items-center justify-between relative z-10">
      <div className={cn(
        "p-3 rounded-2xl border",
        color === "green" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
          color === "red" ? "bg-rose-50 border-rose-100 text-rose-600" :
            "bg-zinc-100 border-zinc-200 text-zinc-900"
      )}>
        <Icon size={20} />
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
          trend.startsWith("+") ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
        )}>
          {trend.startsWith("+") ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
          {trend}
        </div>
      )}
    </div>

    <div className="space-y-1 relative z-10">
      <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
      <h3 className="text-3xl font-black text-zinc-900 tracking-tighter italic">{value}</h3>
      <p className="text-zinc-500 text-[11px] font-medium">{subLabel}</p>
    </div>
  </div>
);

const AccountingOverviewPage = () => {
  // Fetch high-level stats
  const { data: statsPayload, isLoading: isLoadingStats } = useGetAllQuery({
    path: "accounting/ledger/stats",
  });
  const stats = (statsPayload as any)?.data || {};

  // Fetch recent transactions (using audit trail API)
  const { data: auditPayload, isLoading: isLoadingAudit } = useGetAllQuery({
    path: "accounting/ledger/audit-trail",
    limit: 5,
  });

  const recentEntries = React.useMemo(() => {
    const raw = (auditPayload as any)?.data;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
  }, [auditPayload]);

  // Fetch banks for sub-ledger card
  const { data: banksPayload } = useGetAllQuery({
    path: "accounting/banks",
    limit: 3,
  });
  const banks = (banksPayload as any)?.data || [];

  const fmt = (val: number = 0) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(val).replace("BDT", "৳");
  };

  return (
    <Container className="space-y-10 pb-20">
      {/* Header with Title & Date Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Activity className="w-3 h-3" />
            <span>Corporate Treasury</span>
          </div>
          <h1 className="text-5xl font-black text-zinc-900 tracking-tight italic">Accounting Overview</h1>
          <p className="text-zinc-500 text-sm font-medium">Real-time ledger audit and global liquidity dashboard.</p>
        </div>

        <div className="bg-zinc-900 rounded-2xl px-6 py-3 flex items-center gap-4 text-white shadow-2xl shadow-zinc-200">
          <Calendar className="w-4 h-4 text-zinc-500" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Financial Period</span>
            <span className="text-xs font-black tracking-tight">{format(new Date(), "MMMM yyyy")}</span>
          </div>
        </div>
      </div>

      {/* KPI Scoring Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PremiumStatCard
          label="Current Liquidity"
          value={isLoadingStats ? "..." : fmt(stats.cashAndBankBalance)}
          subLabel="Total across all bank sub-ledgers"
          icon={Landmark}
          color="zinc"
        />
        <PremiumStatCard
          label="Total Receivables"
          value={isLoadingStats ? "..." : fmt(stats.totalReceivables)}
          subLabel="Outstanding buyer dues (AR)"
          icon={TrendingUp}
          color="green"
        />
        <PremiumStatCard
          label="Total Obligations"
          value={isLoadingStats ? "..." : fmt(stats.totalPayables)}
          subLabel="Current supplier payables (AP)"
          icon={TrendingDown}
          color="red"
        />
        <PremiumStatCard
          label="Net Position"
          value={isLoadingStats ? "..." : fmt((stats.totalReceivables || 0) - (stats.totalPayables || 0))}
          subLabel="Current AR / AP delta"
          icon={PieChart}
          color="zinc"
        />
      </div>

      {/* Main Action Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Entry Feed — 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 rounded-xl">
                  <Receipt className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight italic">Journal Real-Time Activity</h3>
              </div>
              <button className="text-[10px] font-black text-zinc-400 hover:text-zinc-900 uppercase tracking-widest transition-colors flex items-center gap-1">
                Full Archive <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="p-0">
              <RecentTransactions
                transactions={recentEntries}
              />
            </div>
          </div>
        </div>

        {/* Sub-Ledger Quick Access — 1/3 width */}
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-zinc-300">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Wallet className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="space-y-1">
                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest leading-none">Sub-Ledger Control</p>
                <h3 className="text-2xl font-black tracking-tight italic">Bank Integration</h3>
              </div>

              <div className="space-y-4">
                {banks.map((bank: any) => (
                  <div key={bank.id} className="bg-zinc-800/50 rounded-2xl p-4 flex items-center justify-between border border-zinc-700/50 group-hover:bg-zinc-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-[10px]">
                        {bank.bankName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[11px] font-black tracking-tight">{bank.bankName}</p>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase">{bank.accountNumber}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black italic">৳ {(Number(bank.currentBalance) || 0).toLocaleString()}</span>
                  </div>
                ))}
                {banks.length === 0 && (
                  <p className="text-zinc-500 text-[10px] italic">No bank accounts linked</p>
                )}
              </div>

              <button className="w-full h-12 bg-white text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/5">
                Manage Sub-Ledgers
              </button>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-[2.5rem] p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Alerts</h4>
              <div className="size-2 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-50 rounded-lg shrink-0">
                  <History className="w-3 h-3 text-rose-600" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-zinc-900 leading-tight">System Audit Active</p>
                  <p className="text-[10px] font-medium text-zinc-500 mt-0.5">Continuous ledger verification is enabled.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AccountingOverviewPage;
