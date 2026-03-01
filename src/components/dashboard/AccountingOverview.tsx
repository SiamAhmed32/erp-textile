"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetFinancialOverviewQuery } from "@/store/services/analyticsApi";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyChartState from "./EmptyChartState";
import { takaSign } from "@/lib/constants";
import {
  TrendingUp,
  CircleDollarSign,
  Scale,
  LayoutDashboard,
} from "lucide-react";

const AccountingOverview: React.FC = () => {
  const { data: financialData, isLoading } =
    useGetFinancialOverviewQuery(undefined);
  const financial = financialData?.data;

  const performanceData = [
    { name: "Revenue", value: financial?.revenue || 0, color: "#10b981" },
    { name: "Expense", value: financial?.expense || 0, color: "#ef4444" },
  ];

  const assetLiabilityData = [
    {
      name: "Liquid Assets",
      value:
        (financial?.cash || 0) +
        (financial?.bank || 0) +
        (financial?.receivable || 0),
      color: "#6366f1",
    },
    {
      name: "Liabilities",
      value: (financial?.payable || 0) + (financial?.loanOutstanding || 0),
      color: "#f43f5e",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[350px] w-full rounded-xl" />
        <Skeleton className="h-[350px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden rounded-2xl p-0 bg-white dark:bg-slate-950">
      <CardHeader className="bg-slate-900 dark:bg-black pb-8 pt-8 px-8 border-none m-0 shadow-[0_1px_rgba(255,255,255,0.05)]">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <LayoutDashboard className="h-4 w-4 text-emerald-400" />
              </div>
              Financial Intelligence
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium ml-10">
              Real-time fiscal performance & liquidity analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              {financial?.revenue
                ? ((financial.netProfit / financial.revenue) * 100).toFixed(1)
                : 0}
              % Margin
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 bg-white dark:bg-slate-950">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] divide-y md:divide-y-0 md:divide-x divide-slate-50 dark:divide-slate-800/50">
          {/* Left Side: Performance Bar Chart */}
          <div className="p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <CircleDollarSign className="h-3.5 w-3.5 text-emerald-500" />
              Profit & Loss Overview
            </h3>

            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#94a3b8", fontWeight: 600 }}
                  />
                  <YAxis
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#94a3b8" }}
                    tickFormatter={(val) =>
                      `${takaSign}${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`
                    }
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: any) => [
                      `${takaSign}${Number(value).toLocaleString()}`,
                      "",
                    ]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={45}>
                    {performanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Current Net Profit
                </p>
                <p
                  className={`text-sm font-black ${financial?.netProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {takaSign}
                  {financial?.netProfit?.toLocaleString() || 0}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Reporting Cycle
                </p>
                <p className="text-sm font-black text-slate-700 dark:text-slate-300">
                  Monthly
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Structure Pie Chart */}
          <div className="p-6 flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
              <Scale className="h-3.5 w-3.5 text-indigo-500" />
              Capital Structure
            </h3>

            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetLiabilityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {assetLiabilityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        fillOpacity={0.85}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: any) => [
                      `${takaSign}${Number(value).toLocaleString()}`,
                      "",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Liquidity
                </span>
                <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                  {(
                    (assetLiabilityData[0].value /
                      (assetLiabilityData[0].value +
                        assetLiabilityData[1].value)) *
                    100
                  ).toFixed(0)}
                  %
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-2 mt-4">
              {assetLiabilityData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-slate-500">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {takaSign}
                    {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400">
                  Health Index
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${financial?.workingCapital > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                >
                  {financial?.workingCapital > 0 ? "Optimal" : "Check-up req."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountingOverview;
