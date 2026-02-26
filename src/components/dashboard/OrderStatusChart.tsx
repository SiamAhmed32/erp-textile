"use client";

import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrderStatusAnalyticsQuery } from "@/store/services/analyticsApi";
import EmptyChartState from "./EmptyChartState";

const STATUS_COLORS: Record<string, string> = {
    DRAFT: "#94a3b8",
    PENDING: "#f59e0b",
    PROCESSING: "#3b82f6",
    APPROVED: "#10b981",
    DELIVERED: "#6366f1",
    CANCELLED: "#ef4444",
};

const DEFAULT_COLOR = "#64748b";

interface ChartEntry {
    name: string;
    value: number;
    color: string;
}

const CustomTooltip = ({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { name: string; value: number }[];
}) => {
    if (active && payload && payload.length) {
        const { name, value } = payload[0];
        return (
            <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-sm">
                <p className="font-medium">{name}</p>
                <p className="text-muted-foreground">
                    Count: <span className="font-semibold text-foreground">{value}</span>
                </p>
            </div>
        );
    }
    return null;
};

const OrderStatusChart: React.FC = () => {
    const { data, isLoading: apiLoading } = useGetOrderStatusAnalyticsQuery(undefined);

    const isLoading = apiLoading && !data;

    // Transform API data: [{ DRAFT: 4 }, { PENDING: 0 }, ...] → chart-friendly array
    const rawData: Record<string, number>[] = data?.data ?? [];

    // All statuses (including zeros) — used for both the chart fallback and the legend
    const allStatuses: ChartEntry[] = rawData.flatMap((entry) =>
        Object.entries(entry).map(([name, value]) => ({
            name,
            value: value as number,
            color: STATUS_COLORS[name] ?? DEFAULT_COLOR,
        }))
    );

    const hasAnyValue = allStatuses.some((e) => e.value > 0);

    // For the pie: filter zeros only when there are non-zero values
    const displayData: ChartEntry[] = hasAnyValue
        ? allStatuses.filter((e) => e.value > 0)
        : allStatuses;

    const isEmpty = !isLoading && allStatuses.length === 0;

    return (
        <Card className="col-span-1">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium">
                    Order Status Overview
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-[360px] w-full" />
                ) : isEmpty ? (
                    <EmptyChartState message="No orders found" />
                ) : (
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={allStatuses}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={68}
                                    outerRadius={100}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {allStatuses.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            opacity={entry.value === 0 ? 0.2 : 1}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    formatter={(value) => (
                                        <span className="text-xs text-muted-foreground capitalize">
                                            {value.toLowerCase()}
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderStatusChart;
