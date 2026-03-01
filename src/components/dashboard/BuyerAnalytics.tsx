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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetBuyerAnalyticsQuery } from "@/store/services/analyticsApi";
import { Skeleton } from "@/components/ui/skeleton";
import DateFilter, { DateRange } from "./DateFilter";
import { format, startOfMonth, endOfDay } from "date-fns";
import EmptyChartState from "./EmptyChartState";

const BuyerAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    endDate: format(endOfDay(new Date()), "yyyy-MM-dd"),
    label: "This Month",
  });

  const { data, isLoading: apiLoading } = useGetBuyerAnalyticsQuery({
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
          Strategic Partners
        </CardTitle>
        <DateFilter onFilterChange={setDateRange} />
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : isEmpty ? (
          <EmptyChartState message="No buyer data found" />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(str) => {
                    const [y, m, d] = str.split("-").map(Number);
                    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
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
                <Bar
                  dataKey="count"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#6366f1" : "#818cf8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BuyerAnalytics;
