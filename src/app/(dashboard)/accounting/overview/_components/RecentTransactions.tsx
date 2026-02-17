"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Transaction } from "./types";
import { Flex, Box } from "@/components/reusables";
import Link from 'next/link';

interface RecentTransactionsProps {
    transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
    return (
        <Card className="border-none shadow-sm flex-1">
            <CardContent className="p-6">
                <Flex className="justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-secondary">Recent Transactions</h3>
                    <Link href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</Link>
                </Flex>

                <div className="space-y-4">
                    {transactions.map((t) => {
                        const isIncome = t.type === 'income';
                        const isExpense = t.type === 'expense';

                        return (
                            <Flex key={t.id} className="items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <Flex className="items-center gap-4">
                                    <Box className={`p-2 rounded-full ${isIncome ? 'bg-green-50 text-green-600' :
                                            isExpense ? 'bg-red-50 text-red-600' :
                                                'bg-slate-50 text-slate-400'
                                        }`}>
                                        {isIncome ? <TrendingUp className="h-4 w-4" /> :
                                            isExpense ? <TrendingDown className="h-4 w-4" /> :
                                                <Minus className="h-4 w-4" />}
                                    </Box>
                                    <Box>
                                        <p className="text-sm font-bold text-secondary leading-tight">{t.description}</p>
                                        <p className="text-xs text-muted-foreground">{t.category}</p>
                                    </Box>
                                </Flex>
                                <Box className="text-right">
                                    <p className={`text-sm font-bold ${isIncome ? 'text-green-600' :
                                            isExpense ? 'text-red-500' :
                                                'text-secondary'
                                        }`}>
                                        {t.amount > 0 ? `+${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                </Box>
                            </Flex>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentTransactions;
