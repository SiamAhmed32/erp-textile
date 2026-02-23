"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Landmark,
  LucideIcon,
} from "lucide-react";
import { AccountingStat } from "./types";
import StatsCard from "@/components/dashboard/StatsCard";

interface AccountingStatsProps {
  stats: AccountingStat[];
}

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Landmark,
};

const colorMap: Record<
  string,
  "orange" | "green" | "red" | "blue" | "purple" | "indigo"
> = {
  green: "green",
  red: "red",
  emerald: "blue",
  amber: "orange",
};

const AccountingStats = ({ stats }: AccountingStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = iconMap[stat.icon] || DollarSign;

        return (
          <StatsCard
            key={index}
            title={stat.label}
            value={stat.value}
            icon={Icon}
            description={stat.subLabel}
            color={colorMap[stat.color] || "blue"}
          />
        );
      })}
    </div>
  );
};

export default AccountingStats;
