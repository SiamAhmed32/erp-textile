"use client";

import { Box } from "@/components/reusables";
import { cn } from "@/lib/utils";
import { Banknote, Info, Plus } from 'lucide-react';
import { useState } from 'react';

const mockLoans = [
    {
        id: '1',
        name: 'BRAC Bank Ltd',
        meta: 'LOAN-001 · 9% p.a. · Ends Dec 2027',
        total: 500000,
        paid: 150000,
        status: 'Active',
        repayments: [
            { ref: 'JE-010', num: '01', date: 'Jan 2026', principal: 25000, interest: 3750, total: 28750, remaining: 475000 },
            { ref: 'JE-025', num: '02', date: 'Feb 2026', principal: 25000, interest: 3562, total: 28562, remaining: 450000 },
            { ref: '—', num: '03', date: 'Mar 2026 (due)', principal: 25000, interest: 3375, total: 28375, remaining: 425000, isDue: true },
        ]
    },
    {
        id: '2',
        name: 'Mr. Hasan (Personal)',
        meta: 'LOAN-002 · 0% · Ends Jun 2026',
        total: 200000,
        paid: 50000,
        status: 'Due Soon',
        repayments: [
            { ref: 'JE-012', num: '01', date: 'Jan 2026', principal: 10000, interest: 0, total: 10000, remaining: 190000 },
        ]
    },
];

const LoanManagementPage = () => {
    const [selectedLoan, setSelectedLoan] = useState(mockLoans[0]);

    return (
        <div className="space-y-6">
            {/* Alert Box */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex gap-3 text-indigo-900 shadow-sm">
                <Info className="size-5 shrink-0 text-indigo-500 mt-0.5" />
                <div className="text-[12px] leading-relaxed">
                    <strong>Read-only.</strong> Record loans and repayments via <strong>Bookkeeping → Journal</strong>.
                    Remaining balance calculates automatically.
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Loans List */}
                <Box className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <Box className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-[13px] font-bold text-slate-900">Active Loans</h3>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary-dark transition-colors">
                            <Plus className="size-3.5" />
                            <span>New Journal Entry</span>
                        </button>
                    </Box>
                    <Box className="p-4 space-y-3">
                        {mockLoans.map((loan) => {
                            const remaining = loan.total - loan.paid;
                            const progress = (loan.paid / loan.total) * 100;
                            const isActive = selectedLoan.id === loan.id;

                            return (
                                <div
                                    key={loan.id}
                                    onClick={() => setSelectedLoan(loan)}
                                    className={cn(
                                        "p-4 rounded-xl border transition-all cursor-pointer group",
                                        isActive ? "bg-indigo-50/30 border-primary" : "bg-slate-50 border-slate-100 hover:border-slate-200"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex gap-3">
                                            <div className="size-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                                <Banknote className="size-4" />
                                            </div>
                                            <div>
                                                <div className="text-[13px] font-bold text-slate-900 leading-tight">{loan.name}</div>
                                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{loan.meta}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={cn(
                                                "text-sm font-mono font-bold tracking-tight",
                                                loan.status === 'Active' ? "text-primary" : "text-amber-600"
                                            )}>
                                                ৳ {loan.total.toLocaleString()}
                                            </div>
                                            <span className={cn(
                                                "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase mt-1 inline-block",
                                                loan.status === 'Active' ? "bg-indigo-100 text-primary" : "bg-amber-100 text-amber-700"
                                            )}>
                                                {loan.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] font-mono font-medium">
                                            <span className="text-primary">Paid: ৳ {loan.paid.toLocaleString()}</span>
                                            <span className="text-slate-500">Remaining: ৳ {remaining.toLocaleString()}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </Box>
                </Box>

                {/* Repayments Detail */}
                <Box className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <Box className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-[13px] font-bold text-slate-900">{selectedLoan.name} — Repayments</h3>
                    </Box>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="text-[9px] font-bold tracking-wider uppercase text-slate-400 px-6 py-3 border-b border-slate-100">Ref</th>
                                    <th className="text-[9px] font-bold tracking-wider uppercase text-slate-400 px-6 py-3 border-b border-slate-100">#</th>
                                    <th className="text-[9px] font-bold tracking-wider uppercase text-slate-400 px-6 py-3 border-b border-slate-100">Date</th>
                                    <th className="text-[9px] font-bold tracking-wider uppercase text-slate-400 px-6 py-3 border-b border-slate-100">Principal</th>
                                    <th className="text-[9px] font-bold tracking-wider uppercase text-slate-400 px-6 py-3 border-b border-slate-100 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {selectedLoan.repayments.map((r, i) => (
                                    <tr
                                        key={i}
                                        className={cn(
                                            "hover:bg-slate-50/50 transition-colors group",
                                            r.isDue ? "bg-indigo-50/50" : ""
                                        )}
                                    >
                                        <td className="px-6 py-4 text-[11px] font-mono text-primary font-bold">{r.ref}</td>
                                        <td className="px-6 py-4 text-[11px] font-mono text-slate-400">{r.num}</td>
                                        <td className="px-6 py-4">
                                            <div className={cn("text-[11px]", r.isDue ? "text-primary font-bold" : "text-slate-500")}>
                                                {r.date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-mono font-bold text-red-500">৳ {r.principal.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-[11px] font-mono font-bold text-slate-900 text-right">৳ {r.total.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Box>
            </div>
        </div>
    );
};

export default LoanManagementPage;
