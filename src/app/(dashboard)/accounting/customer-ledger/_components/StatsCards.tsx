import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp } from "lucide-react";
import { CustomerStats } from "./types";
import { Box, Flex } from "@/components/reusables";

interface StatsCardsProps {
    stats: CustomerStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
    return (
        <Box className="grid gap-4 md:grid-cols-3 text-secondary">
            <Card className="border-none shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                    <Flex className="h-12 w-12 items-center justify-center rounded-lg bg-slate-50 text-secondary">
                        <Users className="h-6 w-6" />
                    </Flex>
                    <Box>
                        <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                        <h3 className="text-2xl font-bold">{stats.totalCustomers}</h3>
                    </Box>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                    <Flex className="h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                        <DollarSign className="h-6 w-6" />
                    </Flex>
                    <Box>
                        <p className="text-sm font-medium text-muted-foreground">Total Receivables</p>
                        <h3 className="text-2xl font-bold text-green-600">${stats.totalReceivables.toLocaleString()}</h3>
                    </Box>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                    <Flex className="h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                        <TrendingUp className="h-6 w-6" />
                    </Flex>
                    <Box>
                        <p className="text-sm font-medium text-muted-foreground">Avg. Balance</p>
                        <h3 className="text-2xl font-bold text-orange-600">${stats.avgBalance.toLocaleString()}</h3>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default StatsCards;
