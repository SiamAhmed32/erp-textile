"use client";

import React from "react";
import {
  PrimaryHeading,
  PrimarySubHeading,
  Container,
  Flex,
  SectionGap,
} from "@/components/reusables";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentOrders from "@/components/dashboard/RecentOrders";
import {
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  LayoutDashboard,
  Wallet,
  CircleDollarSign,
  TrendingUp,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { useGetCountQuery } from "@/store/services/commonApi";
import {
  useGetSummaryAnalyticsQuery,
  useGetFinancialOverviewQuery,
} from "@/store/services/analyticsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DateFilter from "@/components/dashboard/DateFilter";
import BuyerAnalytics from "@/components/dashboard/BuyerAnalytics";
import OrderAnalytics from "@/components/dashboard/OrderAnalytics";
import UserAnalytics from "@/components/dashboard/UserAnalytics";
import OrderStatusChart from "@/components/dashboard/OrderStatusChart";
import AccountingStats from "@/components/dashboard/AccountingStats";
import AccountingOverview from "@/components/dashboard/AccountingOverview";
import { takaSign } from "@/lib/constants";

const Dashboard = () => {
  const { data: summaryData, isLoading: loadingSummary } =
    useGetSummaryAnalyticsQuery(undefined);

  const { data: financialData, isLoading: loadingFinancial } =
    useGetFinancialOverviewQuery(undefined);

  const summary = summaryData?.data;
  const financial = financialData?.data;

  // INDUSTRY STANDARD: The 'Big 4' Pulse Metrics
  // We combine Operational and Financial data into a single strategic row.
  const pulseMetrics = [
    {
      title: "Total Liquidity",
      value: `${takaSign}${((financial?.cash || 0) + (financial?.bank || 0)).toLocaleString()}`,
      description: "Total Cash & Bank Balance",
      icon: Wallet,
      color: "border-indigo-100",
      loading: loadingFinancial,
    },
    {
      title: "Net Revenue",
      value: `${takaSign}${financial?.revenue?.toLocaleString() || 0}`,
      description: "Sales performance this month",
      icon: CircleDollarSign,
      color: "border-emerald-100",
      loading: loadingFinancial,
    },
    {
      title: "Active Orders",
      value: summary?.orders ?? 0,
      description: "Orders currently in production",
      icon: ShoppingCart,
      color: "border-orange-100",
      loading: loadingSummary,
    },
    {
      title: "Buyer Portfolio",
      value: summary?.buyers ?? 0,
      description: "Total active business partners",
      icon: Users,
      color: "border-blue-100",
      loading: loadingSummary,
    },
  ];

  return (
    <Container className="py-8 bg-slate-50/40 dark:bg-transparent min-h-screen">
      <Flex className="flex-col gap-10">
        {/* TIER 0: STRATEGIC HEADER */}
        <Flex className="justify-between items-end w-full">
          <div className="space-y-1">
            <Flex className="items-center gap-2 mb-2">
              <div className="bg-button/10 text-button p-1.5 rounded-lg">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-button/60">
                Global Control System
              </span>
            </Flex>
            <PrimaryHeading className="tracking-tighter text-4xl">
              Command Center
            </PrimaryHeading>
            <PrimarySubHeading className="text-slate-500 font-medium max-w-lg">
              Synchronized intelligence from production floor to balance sheet.
            </PrimarySubHeading>
          </div>

          <div className="hidden xl:flex items-center gap-4">
            <div className="text-right px-4 border-r border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Business Health
              </p>
              <div className="flex items-center justify-end gap-2 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700">
                  All Nodes Active
                </span>
              </div>
            </div>
            <DateFilter onFilterChange={() => {}} />
          </div>
        </Flex>

        {/* TIER 1: THE PULSE (Strategic KPI Row) */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {pulseMetrics.map((metric, idx) => (
            <StatsCard
              key={idx}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              description={metric.description}
              loading={metric.loading}
              className={`shadow-sm transition-all hover:shadow-md ${metric.color}`}
            />
          ))}
        </div>

        {/* TIER 2: ANALYTICAL ENGINE */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
          <AccountingOverview />
          <div className="flex flex-col gap-6">
            <OrderStatusChart />
            <OrderAnalytics />
          </div>
        </div>

        {/* TIER 3: SECONDARY INSIGHTS */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <BuyerAnalytics />
          <UserAnalytics />
        </div>

        {/* TIER 4: OPERATIONAL ACTIVITY */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
          <div className="lg:col-span-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm p-0">
            <div className="px-6 py-5 border-none flex items-center justify-between bg-slate-900 dark:bg-black">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <Package className="h-4 w-4 text-orange-400" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">
                  Transactions Ledger
                </h3>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/5"
              >
                <Link href="/order-management/orders">Record History</Link>
              </Button>
            </div>
            <RecentOrders />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group rounded-2xl p-0 bg-white dark:bg-slate-950">
              <CardHeader className="bg-slate-900 dark:bg-black pb-5 pt-5 border-none m-0 px-6">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                  <div className="p-1.5 bg-white/10 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-indigo-400" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2.5 p-6 bg-white dark:bg-slate-950">
                <Button
                  asChild
                  className="w-full justify-between h-11 bg-slate-900 hover:bg-black group/btn overflow-hidden relative border-none rounded-xl"
                >
                  <Link
                    href="/order-management/orders/add-new-order"
                    className="relative z-10 w-full flex items-center justify-between"
                  >
                    <span className="text-xs font-black uppercase tracking-widest text-[#f59e0b]">
                      New Order Record
                    </span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 text-orange-400" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between h-11 border-slate-100 dark:border-slate-800 hover:bg-slate-50 transition-all rounded-xl border"
                >
                  <Link
                    href="/invoice-management/invoices"
                    className="flex w-full items-center justify-between"
                  >
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Proforma Invoices
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-300" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between h-11 border-slate-100 dark:border-slate-800 hover:bg-slate-50 transition-all rounded-xl border"
                >
                  <Link
                    href="/accounting/daily-bookkeeping"
                    className="flex w-full items-center justify-between"
                  >
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Financial Ledger
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-300" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between h-11 border-slate-100 dark:border-slate-800 hover:bg-slate-50 transition-all rounded-xl border"
                >
                  <Link
                    href="/accounting/audit-trail"
                    className="flex w-full items-center justify-between"
                  >
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                      System Audit
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-300" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl relative overflow-hidden group p-0">
              <CardHeader className="bg-slate-900 dark:bg-black py-6 px-8 border-none m-0">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-white flex items-center justify-between">
                  <span>Revenue Performance</span>
                  <div className="p-1.5 bg-white/10 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 pb-8 relative z-10">
                <div className="space-y-1 mb-8">
                  <h3 className="text-5xl font-black flex items-baseline gap-1.5 tracking-tighter text-slate-900 dark:text-white">
                    {financial?.revenue
                      ? (
                          (financial?.netProfit / financial?.revenue) *
                          100
                        ).toFixed(1)
                      : "0.0"}
                    <span className="text-xl font-bold opacity-40">%</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Operating Yield Margin
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div className="text-xs space-y-1">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                      Capital Reserve
                    </p>
                    <p className="font-black text-slate-900 dark:text-white text-lg tracking-tight">
                      {takaSign}
                      {financial?.workingCapital?.toLocaleString() || 0}
                    </p>
                  </div>
                  <Link
                    href="/accounting/trial-balance"
                    className="p-3 bg-slate-50 dark:bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 rounded-2xl transition-all border border-slate-100 dark:border-white/5 group/link"
                  >
                    <ArrowUpRight className="h-5 w-5 text-slate-400 dark:text-white/70 group-hover/link:text-emerald-400 group-hover/link:scale-110" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Flex>
    </Container>
  );
};

export default Dashboard;
