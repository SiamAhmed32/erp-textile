"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Loan } from "./types";
import { Flex, Box } from "@/components/reusables";
import Link from 'next/link';

interface ActiveLoansProps {
    loans: Loan[];
}

const ActiveLoans = ({ loans }: ActiveLoansProps) => {
    return (
        <Card className="border-none shadow-sm flex-1">
            <CardContent className="p-6">
                <Flex className="justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-secondary">Active Loans</h3>
                    <Link href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</Link>
                </Flex>

                <div className="space-y-6">
                    {loans.map((loan) => {
                        const percentage = (loan.outstanding / loan.total) * 100;
                        return (
                            <div key={loan.id} className="space-y-2">
                                <Flex className="justify-between items-end">
                                    <Box>
                                        <p className="text-sm font-bold text-secondary leading-tight">{loan.name}</p>
                                        <p className="text-xs text-muted-foreground uppercase">{loan.type}</p>
                                    </Box>
                                    <Box className="text-right">
                                        <p className="text-sm font-bold text-secondary">
                                            ${loan.outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">
                                            of ${loan.total.toLocaleString()}
                                        </p>
                                    </Box>
                                </Flex>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${loan.color} transition-all duration-500`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default ActiveLoans;
