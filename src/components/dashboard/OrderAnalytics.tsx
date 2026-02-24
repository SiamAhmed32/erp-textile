"use client";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetOrderAnalyticsQuery } from "@/store/services/analyticsApi";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfMonth, endOfDay } from "date-fns";
import DateFilter, { DateRange } from "./DateFilter";
import EmptyChartState from "./EmptyChartState";

const OrderAnalytics: React.FC = () => {
    const [dateRange, setDateRange] = React.useState<DateRange>({
        startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
        endDate: format(endOfDay(new Date()), "yyyy-MM-dd"),
        label: "This Month",
    });

    const { data, isLoading: apiLoading } = useGetOrderAnalyticsQuery({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
    });

    const chartData = data?.data || [];
    const isLoading = apiLoading && !data;
    const isEmpty = !isLoading && chartData.length === 0;

    return (
        <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <CardTitle className="text-base font-medium">Order Analytics</CardTitle>
                <DateFilter onFilterChange={setDateRange} />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-[300px] w-full" />
                ) : isEmpty ? (
                    <EmptyChartState message="No order history found" />
                ) : (
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(str) => {
                                        const date = new Date(str);
                                        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                                    }}
                                />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#f59e0b"
                                    fillOpacity={1}
                                    fill="url(#colorOrders)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderAnalytics;
