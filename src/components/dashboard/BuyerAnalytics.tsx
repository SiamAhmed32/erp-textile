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
import { generateMockAnalytics } from "@/utils/mockData";

const BuyerAnalytics: React.FC = () => {
    const [dateRange, setDateRange] = React.useState<DateRange>({
        startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
        endDate: format(endOfDay(new Date()), "yyyy-MM-dd"),
        label: "This Month",
    });

    const { data, isLoading: apiLoading } = useGetBuyerAnalyticsQuery({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
    });

    const mockData = React.useMemo(() =>
        generateMockAnalytics(dateRange.startDate, dateRange.endDate, "buyer"),
        [dateRange]
    );

    const chartData = (data?.data && data.data.length > 0) ? data.data : mockData;
    const isLoading = apiLoading && !data;

    return (
        <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <CardTitle className="text-base font-medium">Buyer Analytics</CardTitle>
                <DateFilter onFilterChange={setDateRange} />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-[300px] w-full" />
                ) : (
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: "transparent" }}
                                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#6366f1"
                                    radius={[4, 4, 0, 0]}
                                    barSize={30}
                                >
                                    {chartData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#6366f1" : "#818cf8"} />
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
