"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Plus,
  FileText,
  BookOpen,
  Shield,
  LayoutDashboard,
  Inbox,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/reusables/CustomTable";
import DateFilter, { DateRange } from "@/components/dashboard/DateFilter";
import {
  useGetSummaryAnalyticsQuery,
  useGetFinancialOverviewQuery,
  useGetRevenueTrendQuery,
  useGetOrderTrendQuery,
  useGetTopBuyersQuery,
  useGetARagingQuery,
  useGetAPagingQuery,
  useGetCashFlowQuery,
  useGetDashboardAlertsQuery,
  useGetOrderStatusAnalyticsQuery,
} from "@/store/services/analyticsApi";
import { useGetAllQuery } from "@/store/services/commonApi";
import { takaSign } from "@/lib/constants";
import { format, startOfMonth, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";

// ─── Shared tooltip style ──────────────────────────────────
const TT: React.CSSProperties = {
  borderRadius: 8,
  border: "none",
  boxShadow:
    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  fontSize: 12,
  fontWeight: 600,
};

// ─── Status map ────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  DRAFT: "#94a3b8",
  PENDING: "#f59e0b",
  PROCESSING: "#3b82f6",
  APPROVED: "#10b981",
  DELIVERED: "#6366f1",
  CANCELLED: "#ef4444",
};
const statusBadge = (s: string) => {
  const c: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-600",
    PENDING: "bg-amber-100 text-amber-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    APPROVED: "bg-emerald-100 text-emerald-700",
    DELIVERED: "bg-indigo-100 text-indigo-700",
    CANCELLED: "bg-rose-100 text-rose-700",
  };
  return c[s] ?? "bg-slate-100 text-slate-600 border border-slate-200";
};

// ─── Empty State Component ──────────────────────────────────
function EmptyState({ message = "No records found" }: { message?: string }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center py-10 opacity-40">
      <Inbox size={32} className="mb-2" />
      <p className="text-xs font-semibold">{message}</p>
    </div>
  );
}

// ─── Card wrapper ──────────────────────────────────────────
function DashboardCard({
  title,
  subtitle,
  action,
  noPad = false,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  noPad?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-200 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md overflow-hidden flex flex-col",
        className,
      )}
    >
      <div className="px-6 py-5 flex items-center justify-between border-b border-slate-50 max-[324px]:flex-col max-[324px]:items-start max-[324px]:gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 whitespace-nowrap">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs mt-0.5 font-bold uppercase tracking-widest leading-none text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
        {action ? (
          <div className="max-[324px]:w-full max-[324px]:flex max-[324px]:justify-start">
            {action}
          </div>
        ) : null}
      </div>
      <div className={cn("flex-1", noPad ? "" : "p-6")}>{children}</div>
    </div>
  );
}

// ─── KPI Card ───────────────────────────────────────────────
function KPICard({
  title,
  value,
  sub,
  icon: Icon,
  accent,
  loading,
  trend,
}: {
  title: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  accent: string;
  loading?: boolean;
  trend?: number;
}) {
  const up = (trend ?? 0) >= 0;
  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex gap-5 items-start hover:shadow-md transition-all duration-300 border-t-4"
      style={{ borderTopColor: accent }}
    >
      <div
        className="p-3 rounded-xl shrink-0"
        style={{ backgroundColor: accent + "15" }}
      >
        <Icon size={20} style={{ color: accent }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 leading-none">
          {title}
        </p>
        {loading ? (
          <Skeleton className="h-8 w-24 mt-2" />
        ) : (
          <p className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            {value}
          </p>
        )}
        {trend !== undefined && !loading && (
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={cn(
                "flex items-center gap-0.5 text-xs font-bold",
                up ? "text-emerald-500" : "text-rose-500",
              )}
            >
              {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {up ? "+" : ""}
              {trend.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              vs last month
            </span>
          </div>
        )}
        <p className="text-[11px] text-slate-400 font-bold mt-1">{sub}</p>
      </div>
    </div>
  );
}

// ─── Alert Banner ───────────────────────────────────────────
function AlertBanner() {
  const { data } = useGetDashboardAlertsQuery(undefined);
  const alerts: {
    type: "warning" | "info";
    text: string;
    cta: string;
    href: string;
  }[] = data?.data || [];

  if (alerts.length === 0) return null;
  return (
    <div className="space-y-3">
      {alerts.map((a, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center justify-between px-6 py-4 rounded-2xl text-[13px] font-bold gap-4 border",
            a.type === "warning"
              ? "bg-amber-50 border-amber-200 text-amber-900"
              : "bg-blue-50 border-blue-200 text-blue-900",
          )}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={cn(
                "p-2 rounded-lg",
                a.type === "warning" ? "bg-amber-100" : "bg-blue-100",
              )}
            >
              {a.type === "warning" ? (
                <AlertTriangle size={16} />
              ) : (
                <Clock size={16} />
              )}
            </div>
            <span className="truncate">{a.text}</span>
          </div>
          <Link
            href={a.href}
            className="font-black underline underline-offset-4 whitespace-nowrap hover:text-indigo-600 transition-colors uppercase tracking-widest text-[11px]"
          >
            {a.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}

// ─── Revenue vs Expense (FULL WIDTH) ───────────────────────
function RevenueTrendChart() {
  const { data, isLoading } = useGetRevenueTrendQuery(undefined);
  const chartData: any[] = data?.data || [];

  const hasData = chartData.some((d) => d.revenue > 0 || d.expense > 0);
  const totalRev = chartData.reduce((s, d) => s + d.revenue, 0);
  const totalExp = chartData.reduce((s, d) => s + d.expense, 0);
  const netProfit = totalRev - totalExp;
  const margin =
    totalRev > 0 ? ((netProfit / totalRev) * 100).toFixed(1) : "0.0";

  return (
    <DashboardCard
      title="Revenue vs Expense"
      subtitle="12-Month Performance Overview"
    >
      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : !hasData ? (
        <div className="h-64">
          <EmptyState message="No transaction data available for this chart" />
        </div>
      ) : (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="month"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontWeight: 700 }}
                  tickFormatter={(v) =>
                    `${takaSign}${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                  }
                />
                <Tooltip
                  contentStyle={TT}
                  formatter={(v: any, name: any) =>
                    [
                      `${takaSign}${Number(v).toLocaleString()}`,
                      name === "revenue" ? "Revenue" : "Expense",
                    ] as any
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#gRev)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="expense"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fill="url(#gExp)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                Net Profit
              </p>
              <p
                className={cn(
                  "text-xl font-black mt-2",
                  netProfit >= 0 ? "text-emerald-600" : "text-rose-600",
                )}
              >
                {takaSign}
                {netProfit.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                Profit Margin
              </p>
              <p className="text-xl font-black text-slate-900 mt-2">
                {margin}%
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                Activity Health
              </p>
              <p className="text-xl font-black text-slate-900 mt-2">
                {netProfit > 0 ? "Growth" : "Steady"}
              </p>
            </div>
          </div>
        </>
      )}
    </DashboardCard>
  );
}

// ─── Aging Chart (AR & AP) ─────────────────────────────────
function AgingChart({ type }: { type: "AR" | "AP" }) {
  const arQuery = useGetARagingQuery(undefined, { skip: type !== "AR" });
  const apQuery = useGetAPagingQuery(undefined, { skip: type !== "AP" });

  const query = type === "AR" ? arQuery : apQuery;
  const data = query.data?.data || [];
  const total = data.reduce((s: number, b: any) => s + b.amount, 0);
  const hasData = total > 0;

  const COLORS =
    type === "AR"
      ? ["#10b981", "#f59e0b", "#f97316", "#ef4444"]
      : ["#3b82f6", "#6366f1", "#a855f7", "#ec4899"];

  return (
    <DashboardCard
      title={
        type === "AR" ? "Accounts Receivable Aging" : "Accounts Payable Aging"
      }
      subtitle={
        type === "AR"
          ? "Overdue Receivables by Time Bracket"
          : "Pending Supplier Payments by Time Bracket"
      }
    >
      {query.isLoading ? (
        <Skeleton className="h-48 w-full rounded-2xl" />
      ) : !hasData ? (
        <div className="h-48">
          <EmptyState
            message={`No ${type === "AR" ? "Receivable" : "Payable"} records found`}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                {takaSign}
                {total.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                Total Outstanding
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {data.map((row: any, i: number) => (
              <div key={row.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                    {row.label}
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    {takaSign}
                    {row.amount.toLocaleString()}
                  </span>
                </div>
                <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${(row.amount / total) * 100}%`,
                      backgroundColor: COLORS[i % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardCard>
  );
}

// ─── Cash Flow Chart ───────────────────────────────────────
function CashFlowChart() {
  const { data, isLoading } = useGetCashFlowQuery(undefined);
  const chartData: any[] = data?.data || [];
  const hasData = chartData.some((d) => d.inflow > 0 || d.outflow > 0);

  return (
    <DashboardCard
      title="Cash Flow"
      subtitle="Weekly Inflow vs Outflow Overview"
    >
      {isLoading ? (
        <Skeleton className="h-56 w-full rounded-2xl" />
      ) : !hasData ? (
        <div className="h-56">
          <EmptyState message="No weekly cash flow recorded" />
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              barGap={6}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="week"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontWeight: 700 }}
              />
              <YAxis
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontWeight: 700 }}
                tickFormatter={(v) =>
                  `${takaSign}${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                }
              />
              <Tooltip
                contentStyle={TT}
                formatter={(v: any, n: any) =>
                  [
                    `${takaSign}${Number(v).toLocaleString()}`,
                    n === "inflow" ? "Inflow" : "Outflow",
                  ] as any
                }
              />
              <Bar
                dataKey="inflow"
                name="inflow"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={20}
                fillOpacity={0.8}
              />
              <Bar
                dataKey="outflow"
                name="outflow"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                barSize={20}
                fillOpacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardCard>
  );
}

// ─── Order Status ──────────────────────────────────────────
function OrderStatusChart() {
  const { data, isLoading } = useGetOrderStatusAnalyticsQuery(undefined);
  const rawData: Record<string, number>[] = data?.data ?? [];
  const allStatuses = rawData.flatMap((entry) =>
    Object.entries(entry)
      .filter(([_, v]) => v > 0)
      .map(([name, value]) => ({
        name,
        value: value as number,
        color: STATUS_COLORS[name] ?? "#64748b",
      })),
  );
  const total = allStatuses.reduce((s, e) => s + e.value, 0);

  return (
    <DashboardCard
      title="Order Status"
      subtitle={`${total} Total Orders in Pipeline`}
    >
      {isLoading ? (
        <Skeleton className="h-56 w-full rounded-2xl" />
      ) : allStatuses.length === 0 ? (
        <div className="h-56">
          <EmptyState message="No active orders found" />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allStatuses}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={84}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {allStatuses.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TT} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4 w-full px-4">
            {allStatuses.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-xs text-slate-600 font-bold uppercase tracking-widest">
                    {s.name.toLowerCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900">
                    {s.value}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">
                    {((s.value / total) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardCard>
  );
}

// ─── Order Volume ──────────────────────────────────────────
function OrderTrendChart() {
  const [range, setRange] = useState<DateRange>({
    startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    endDate: format(endOfDay(new Date()), "yyyy-MM-dd"),
    label: "This Month",
  });
  const { data, isLoading } = useGetOrderTrendQuery({
    startDate: range.startDate,
    endDate: range.endDate,
  });
  const chartData: any[] = data?.data || [];
  const hasData = chartData.some((d) => d.orders > 0);

  return (
    <DashboardCard
      title="Order Volume"
      subtitle="Historical Placement Frequency"
      action={<DateFilter onFilterChange={setRange} />}
    >
      {isLoading ? (
        <Skeleton className="h-56 w-full rounded-2xl" />
      ) : !hasData ? (
        <div className="h-56">
          <EmptyState message="No orders within selection" />
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gOrd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontWeight: 700 }}
              />
              <YAxis
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontWeight: 700 }}
                allowDecimals={false}
              />
              <Tooltip contentStyle={TT} />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#6366f1"
                strokeWidth={3}
                fill="url(#gOrd)"
                dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardCard>
  );
}

// ─── Top Buyers ───────────────────────────────────────────
function TopBuyersChart() {
  const [range, setRange] = useState<DateRange>({
    startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    endDate: format(endOfDay(new Date()), "yyyy-MM-dd"),
    label: "This Month",
  });
  const { data, isLoading } = useGetTopBuyersQuery({
    limit: 5,
    startDate: range.startDate,
    endDate: range.endDate,
  });
  const buyers: { name: string; revenue: number; orders: number }[] =
    data?.data || [];
  const maxRevenue = Math.max(...buyers.map((b) => b.revenue), 1);
  const hasData = buyers.length > 0;

  return (
    <DashboardCard
      title="Top Buyers"
      subtitle="Ranked by Period Revenue Contribution"
      action={<DateFilter onFilterChange={setRange} />}
    >
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-1/3 rounded" />
              <Skeleton className="h-6 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : !hasData ? (
        <div className="h-56">
          <EmptyState message="No sales recorded for this period" />
        </div>
      ) : (
        <div className="space-y-8 py-3">
          {buyers.map((b, i) => (
            <div key={b.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-slate-300 w-4">
                    {i + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {b.name}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-black text-slate-900 leading-none">
                    {takaSign}
                    {b.revenue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold w-16 text-right uppercase tracking-widest">
                    {b.orders} orders
                  </span>
                </div>
              </div>
              <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(b.revenue / maxRevenue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

// ─── Recent Orders (Refined CustomTable Implementation) ──────
function RecentOrdersTable() {
  const { data: payload, isLoading: loading } = useGetAllQuery({
    path: "orders",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    isDeleted: false,
  });
  const orders = (payload as any)?.data || [];

  const columns = [
    {
      header: "Date",
      className: "px-6",
      accessor: (o: any) => (
        <div className="text-slate-600 font-bold text-xs">
          {o.orderDate ? format(new Date(o.orderDate), "MMM dd, yyyy") : "—"}
        </div>
      ),
    },
    {
      header: "Order",
      accessor: (o: any) => (
        <div className="font-black text-slate-900 underline decoration-indigo-200 underline-offset-4">
          {o.orderNumber || "—"}
        </div>
      ),
    },
    {
      header: "Buyer",
      accessor: (o: any) => (
        <div className="text-slate-900 font-black text-xs">
          {o.buyer?.name || "—"}
        </div>
      ),
    },
    {
      header: "Amount",
      accessor: (o: any) => {
        const item = Array.isArray(o.orderItems)
          ? o.orderItems[0]
          : o.orderItems;
        const amount =
          item?.fabricItem?.totalAmount ||
          item?.labelItem?.totalAmount ||
          item?.cartonItem?.totalAmount ||
          0;
        return (
          <div className="font-black text-slate-900">
            {takaSign}
            {Number(amount).toLocaleString()}
          </div>
        );
      },
    },
    {
      header: "Status",
      className: "text-right",
      accessor: (o: any) => (
        <div className="flex justify-end pr-6">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest leading-none",
              statusBadge(o.status),
            )}
          >
            {o.status}
          </span>
        </div>
      ),
    },
  ];

  return (
    <DashboardCard
      title="Recent Orders"
      subtitle="Latest Production Tracking"
      noPad
      action={
        <Link
          href="/order-management/orders"
          className="text-[11px] font-black text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 uppercase tracking-widest group"
        >
          View All Orders{" "}
          <ArrowUpRight
            size={14}
            className="opacity-40 group-hover:opacity-100"
          />
        </Link>
      }
    >
      <CustomTable
        data={orders}
        columns={columns}
        isLoading={loading}
        scrollAreaHeight="h-auto max-h-[500px]"
        skeletonRows={6}
        className="border-none"
      />
    </DashboardCard>
  );
}

// ─── Quick Terminal & Financial Snapshot ────────────────────
function CommandCenter() {
  const { data: finData, isLoading } = useGetFinancialOverviewQuery(undefined);
  const f = finData?.data;

  const actions = [
    {
      label: "Create New Order",
      href: "/order-management/orders/add-new-order",
      icon: Plus,
    },
    {
      label: "Review Proforma Invoices",
      href: "/invoice-management/invoices",
      icon: FileText,
    },
    {
      label: "View Financial Ledger",
      href: "/accounting/daily-bookkeeping",
      icon: BookOpen,
    },
    {
      label: "Access Audit Trail",
      href: "/accounting/audit-trail",
      icon: Shield,
    },
  ];

  const metrics = [
    {
      label: "Working Capital",
      value: f?.workingCapital || 0,
      color: "text-emerald-500",
    },
    {
      label: "Total Receivables",
      value: f?.receivable || 0,
      color: "text-blue-500",
    },
    { label: "Total Payables", value: f?.payable || 0, color: "text-rose-500" },
    {
      label: "Loan Outstanding",
      value: f?.loanOutstanding || 0,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Quick Terminal */}
      <DashboardCard
        title="Quick Terminal"
        subtitle="Common Administrative Shortcuts"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          {actions.map((a) => (
            <Button
              key={a.label}
              asChild
              variant="outline"
              className={cn(
                "h-auto min-h-[3.5rem] justify-start py-3 px-6 font-black text-[10px] uppercase tracking-widest rounded-2xl border-2 transition-all duration-300 shadow-sm",
                "bg-white text-slate-700 border-slate-100 whitespace-normal text-left leading-tight",
                "hover:bg-black hover:text-white hover:border-black hover:-translate-y-0.5",
              )}
            >
              <Link href={a.href} className="flex items-center gap-4 w-full">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <a.icon
                    size={18}
                    className="shrink-0 group-hover:text-white transition-colors"
                  />
                  <span className="flex-1">{a.label}</span>
                </div>
                <ArrowUpRight size={16} className="opacity-30 shrink-0" />
              </Link>
            </Button>
          ))}
        </div>
      </DashboardCard>

      {/* Financial Snapshot */}
      <DashboardCard
        title="Financial Snapshot"
        subtitle="Real-time Balance Sheet Health"
      >
        <div className="grid grid-cols-2 gap-y-10 gap-x-8 py-4">
          {metrics.map((m) => (
            <div key={m.label} className="group">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 leading-none">
                {m.label}
              </p>
              <div className="flex items-baseline gap-2">
                {isLoading ? (
                  <Skeleton className="h-10 w-32 rounded-lg" />
                ) : (
                  <span
                    className={cn(
                      "text-3xl font-black tracking-tighter transition-all group-hover:scale-105 origin-left",
                      m.color,
                    )}
                  >
                    {takaSign}
                    {Math.abs(m.value).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}

// ─── MAIN DASHBOARD ─────────────────────────────────────────
export default function Dashboard() {
  const [globalRange, setGlobalRange] = useState<DateRange>({
    startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    endDate: format(endOfDay(new Date()), "yyyy-MM-dd"),
    label: "This Month",
  });

  const { data: summaryData, isLoading: loadingSummary } =
    useGetSummaryAnalyticsQuery(undefined);
  const { data: financialData, isLoading: loadingFinancial } =
    useGetFinancialOverviewQuery(undefined);
  const { data: revTrendData } = useGetRevenueTrendQuery(undefined);

  const financial = financialData?.data;
  const summary = summaryData?.data;

  // Compute MoM trend
  const revMonths: any[] = revTrendData?.data || [];
  const thisMonthRev = revMonths[revMonths.length - 1]?.revenue ?? 0;
  const lastMonthRev = revMonths[revMonths.length - 2]?.revenue ?? 0;
  const revTrend =
    lastMonthRev > 0 ? ((thisMonthRev - lastMonthRev) / lastMonthRev) * 100 : 0;

  const kpis = [
    {
      title: "Tactical Liquidity",
      value: `${takaSign}${((financial?.cash || 0) + (financial?.bank || 0)).toLocaleString()}`,
      sub: "Total Cash & Bank Assets",
      icon: Wallet,
      accent: "#6366f1",
      loading: loadingFinancial,
    },
    {
      title: "Cumulative Revenue",
      value: `${takaSign}${(financial?.revenue || 0).toLocaleString()}`,
      sub: "Net Performance This Month",
      icon: TrendingUp,
      accent: "#10b981",
      loading: loadingFinancial,
      trend: revTrend,
    },
    {
      title: "Pipeline Orders",
      value: summary?.orders ?? 0,
      sub: "Active Order Fulfillment",
      icon: ShoppingCart,
      accent: "#f59e0b",
      loading: loadingSummary,
      trend: -3.1,
    },
    {
      title: "Qualified Buyers",
      value: summary?.buyers ?? 0,
      sub: "Key Accounts In Network",
      icon: Users,
      accent: "#3b82f6",
      loading: loadingSummary,
      trend: 5.4,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-16">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-10 space-y-10 font-inter">
        {/* ── HEADER ────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-100">
                <LayoutDashboard size={14} className="text-white" />
              </div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">
                Command Intelligence Alpha
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Business Overview
            </h1>
            <p className="text-sm text-slate-400 font-bold italic tracking-wide">
              Intelligence data for Moon Textile ERP System
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              asChild
              className="h-12 px-8 bg-black text-white hover:bg-black/90 font-black rounded-lg gap-3 text-[11px] uppercase tracking-widest transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <Link href="/order-management/orders/add-new-order">
                <Plus size={18} /> Create New Order
              </Link>
            </Button>
          </div>
        </div>

        {/* ── ALERTSBANNER ──────────────────────────────── */}
        <AlertBanner />

        {/* ── KEY PERFORMANCE INDICATORS ────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 3xl:grid-cols-4 gap-8">
          {kpis.map((k) => (
            <KPICard key={k.title} {...k} />
          ))}
        </div>

        {/* ── FINANCIAL CORE (FULL WIDTH) ───────────────── */}
        <RevenueTrendChart />
        <AgingChart type="AR" />
        <AgingChart type="AP" />

        {/* ── OPERATIONAL INSIGHTS (PAIRS) ──────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <CashFlowChart />
          <OrderStatusChart />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <OrderTrendChart />
          <TopBuyersChart />
        </div>

        {/* ── DATA LEDGER (FULL WIDTH) ──────────────────── */}
        <RecentOrdersTable />

        {/* ── BOTTOM TERMINAL (COMMAND CENTER) ──────────── */}
        <CommandCenter />
      </div>
    </div>
  );
}
