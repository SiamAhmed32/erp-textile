import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Banknote, BarChart3 } from "lucide-react";
import { SupplierStats } from "./types";
import { Box, Flex } from "@/components/reusables";

interface StatsCardsProps {
    stats: SupplierStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
    return (
        <Box className="grid gap-4 md:grid-cols-3 text-secondary">
            <Card className="border-none shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                    <Flex className="h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                        <Truck className="h-6 w-6" />
                    </Flex>
                    <Box>
                        <p className="text-sm font-medium text-muted-foreground">Total Suppliers</p>
                        <h3 className="text-2xl font-bold">{stats.totalSuppliers}</h3>
                    </Box>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                    <Flex className="h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
                        <Banknote className="h-6 w-6" />
                    </Flex>
                    <Box>
                        <p className="text-sm font-medium text-muted-foreground">Total Payables</p>
                        <h3 className="text-2xl font-bold text-red-600">
                            {stats.totalPayables < 0 ? `-$${Math.abs(stats.totalPayables).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${stats.totalPayables.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </h3>
                    </Box>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                    <Flex className="h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                        <BarChart3 className="h-6 w-6" />
                    </Flex>
                    <Box>
                        <p className="text-sm font-medium text-muted-foreground">Avg. Balance</p>
                        <h3 className="text-2xl font-bold text-orange-600">
                            {stats.avgBalance < 0 ? `-$${Math.abs(stats.avgBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${stats.avgBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </h3>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default StatsCards;
