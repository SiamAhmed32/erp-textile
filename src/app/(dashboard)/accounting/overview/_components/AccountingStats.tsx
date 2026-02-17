"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Landmark } from "lucide-react";
import { AccountingStat } from "./types";
import { Flex, Box } from "@/components/reusables";

interface AccountingStatsProps {
    stats: AccountingStat[];
}

const iconMap: Record<string, any> = {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Landmark,
};

const AccountingStats = ({ stats }: AccountingStatsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = iconMap[stat.icon] || DollarSign;
                const isPositive = stat.trend === 'up';
                const isNegative = stat.trend === 'down';

                return (
                    <Card key={index} className="border-none shadow-sm h-full">
                        <CardContent className="p-6">
                            <Flex className="justify-between items-start">
                                <Box className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground uppercase">{stat.label}</p>
                                    <h3 className={`text-2xl font-bold ${isNegative ? 'text-red-500' : 'text-secondary'}`}>
                                        {stat.value}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">{stat.subLabel}</p>
                                </Box>
                                <Box className={`p-2 rounded-lg ${isPositive ? 'bg-green-50 text-green-600' :
                                        isNegative ? 'bg-red-50 text-red-600' :
                                            stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                                                stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-slate-50 text-slate-600'
                                    }`}>
                                    <Icon className="h-5 w-5" />
                                </Box>
                            </Flex>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default AccountingStats;
