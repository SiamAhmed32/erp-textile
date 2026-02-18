"use client";

import { Box, Container, PrimaryHeading, PrimarySubHeading } from "@/components/reusables";
import { cn } from "@/lib/utils";
import {
    ArrowRight
} from 'lucide-react';
import RecentTransactions from "./_components/RecentTransactions";
import {
    mockAccountingStats,
    mockRecentTransactions
} from "./_components/types";

const AccountingOverviewPage = () => {
    return (
        <Container className="space-y-6 !p-0">
            <Box>
                <PrimaryHeading>Accounting Dashboard</PrimaryHeading>
                <PrimarySubHeading>Overview of your financial performance and transactions</PrimarySubHeading>
            </Box>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockAccountingStats.map((stat, i) => (
                    <Box key={i} className={cn(
                        "bg-white border border-slate-200 rounded-xl p-5 shadow-sm border-t-4",
                        stat.color === 'green' ? "border-t-emerald-500" :
                            stat.color === 'red' ? "border-t-red-500" :
                                stat.color === 'amber' ? "border-t-amber-500" : "border-t-primary"
                    )}>
                        <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">{stat.label}</div>
                        <div className={cn(
                            "text-2xl font-black tracking-tight mb-1",
                            stat.color === 'green' ? "text-emerald-600" :
                                stat.color === 'red' ? "text-red-600" :
                                    stat.color === 'amber' ? "text-amber-600" : "text-primary"
                        )}>
                            {stat.value}
                        </div>
                        <div className="text-[11px] text-slate-500">{stat.subLabel}</div>
                    </Box>
                ))}
            </div>

            {/* 2-Step Flow Section */}
            <Box className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <Box className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-900">The 2-Step Flow for Every Due</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Always record the due first, then clear it when money moves</p>
                    </div>
                </Box>
                <Box className="p-6">
                    <div className="space-y-6">
                        {/* Customer Flow */}
                        <div>
                            <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="p-1 bg-indigo-50 rounded text-base">📥</span> Customer owes YOU
                            </div>
                            <div className="flex items-stretch gap-2">
                                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
                                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[11px] font-bold mx-auto mb-2">1</div>
                                    <div className="text-[12px] font-bold text-slate-800">Customer Due</div>
                                    <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">Record invoice/credit sale → customer balance goes up</div>
                                </div>
                                <div className="flex items-center text-slate-300 px-1">
                                    <ArrowRight className="size-4" />
                                </div>
                                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] font-bold mx-auto mb-2">2</div>
                                    <div className="text-[12px] font-bold text-slate-800">Receipt</div>
                                    <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">Customer pays → balance goes down, cash comes in</div>
                                </div>
                                <div className="flex items-center text-slate-300 px-1">
                                    <ArrowRight className="size-4" />
                                </div>
                                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-lg p-3 text-center opacity-50">
                                    <div className="w-6 h-6 rounded-full bg-slate-300 text-white flex items-center justify-center text-[11px] font-bold mx-auto mb-2">✓</div>
                                    <div className="text-[12px] font-bold text-slate-800">Settled</div>
                                    <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">Outstanding = 0, ledger closes</div>
                                </div>
                            </div>
                        </div>

                        {/* Supplier Flow */}
                        <div>
                            <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="p-1 bg-red-50 rounded text-base">📤</span> YOU owe supplier
                            </div>
                            <div className="flex items-stretch gap-2">
                                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
                                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[11px] font-bold mx-auto mb-2">1</div>
                                    <div className="text-[12px] font-bold text-slate-800">Supplier Due</div>
                                    <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">Record purchase/credit bill → your liability goes up</div>
                                </div>
                                <div className="flex items-center text-slate-300 px-1">
                                    <ArrowRight className="size-4" />
                                </div>
                                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] font-bold mx-auto mb-2">2</div>
                                    <div className="text-[12px] font-bold text-slate-800">Payment</div>
                                    <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">You pay them → balance goes down, cash goes out</div>
                                </div>
                                <div className="flex items-center text-slate-300 px-1">
                                    <ArrowRight className="size-4" />
                                </div>
                                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-lg p-3 text-center opacity-50">
                                    <div className="w-6 h-6 rounded-full bg-slate-300 text-white flex items-center justify-center text-[11px] font-bold mx-auto mb-2">✓</div>
                                    <div className="text-[12px] font-bold text-slate-800">Settled</div>
                                    <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">Outstanding = 0, ledger closes</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            </Box>

            {/* Recent Entries Table */}
            <Box className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden text-primary">
                <Box className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">Recent Entries</h3>
                    <button className="text-[11px] font-bold text-primary hover:underline">View All →</button>
                </Box>
                <div className="p-0">
                    <RecentTransactions transactions={mockRecentTransactions} />
                </div>
            </Box>
        </Container>
    );
};

export default AccountingOverviewPage;
