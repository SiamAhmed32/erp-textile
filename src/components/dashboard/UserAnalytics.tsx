"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUserAnalyticsQuery } from "@/store/services/analyticsApi";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfMonth, endOfDay } from "date-fns";
import DateFilter, { DateRange } from "./DateFilter";
import EmptyChartState from "./EmptyChartState";

const UserAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    endDate: format(endOfDay(new Date()), "yyyy-MM-dd"),
    label: "This Month",
  });

  const { data, isLoading: apiLoading } = useGetUserAnalyticsQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const chartData = data?.data || [];
  const isLoading = apiLoading && !data;
  const isEmpty = !isLoading && chartData.length === 0;

  return (
    <Card className="col-span-1 border-none shadow-sm overflow-hidden rounded-2xl p-0">
      <CardHeader className="bg-slate-900 dark:bg-black py-6 px-8 flex flex-row items-center justify-between space-y-0 border-none m-0">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-white">
          Resource Utilization
        </CardTitle>
        <DateFilter onFilterChange={setDateRange} />
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : isEmpty ? (
          <EmptyChartState message="No user activity data" />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(str) => {
                    const [y, m, d] = str.split("-").map(Number);
                    const date = new Date(y, m - 1, d);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  labelFormatter={(str) => {
                    const [y, m, d] = String(str).split("-").map(Number);
                    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
                <Line
                  type="linear"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#10b981",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserAnalytics;
