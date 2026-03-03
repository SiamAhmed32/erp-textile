"use client";

import React from "react";
import {
  Wallet,
  Landmark,
  ArrowUpCircle,
  ArrowDownCircle,
  Banknote,
  Scale,
} from "lucide-react";
import StatsCard from "./StatsCard";
import { useGetFinancialOverviewQuery } from "@/store/services/analyticsApi";
import { takaSign } from "@/lib/constants";

const AccountingStats: React.FC = () => {
  const { data: financialData, isLoading } =
    useGetFinancialOverviewQuery(undefined);
  const financial = financialData?.data;

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined) return "0.00";
    return val.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Cash Balance"
        value={`${takaSign}${formatCurrency(financial?.cash)}`}
        icon={Wallet}
        description="Physical cash on hand"
        loading={isLoading}
        className="border-emerald-100 dark:border-emerald-900/30"
      />
      <StatsCard
        title="Bank Balance"
        value={`${takaSign}${formatCurrency(financial?.bank)}`}
        icon={Landmark}
        description="Total in all bank accounts"
        loading={isLoading}
        className="border-blue-100 dark:border-blue-900/30"
      />
      <StatsCard
        title="Net Profit (Monthly)"
        value={`${takaSign}${formatCurrency(financial?.netProfit)}`}
        icon={ArrowUpCircle}
        description="Revenue minus expenses"
        loading={isLoading}
        className="border-indigo-100 dark:border-indigo-900/30"
      />
      <StatsCard
        title="Working Capital"
        value={`${takaSign}${formatCurrency(financial?.workingCapital)}`}
        icon={Scale}
        description="Net liquid assets"
        loading={isLoading}
        className="border-purple-100 dark:border-purple-900/30"
      />
    </div>
  );
};

export default AccountingStats;
