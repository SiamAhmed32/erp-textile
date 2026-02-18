"use client";

import { Box } from "@/components/reusables";
import { cn } from "@/lib/utils";
import { Info, Plus, User } from 'lucide-react';
import { useState } from 'react';

const mockIOUs = [
    { id: '1', name: 'Salim Ahmed', date: '10 Feb', ref: 'JE-037', issued: 1000, returned: 400, status: 'Open' },
    { id: '2', name: 'Fatima Khatun', date: '12 Feb', ref: 'JE-038', issued: 5000, returned: 0, status: 'Open' },
    { id: '3', name: 'Jamal Uddin', date: '05 Jan', ref: 'JE-021', issued: 3000, returned: 3000, status: 'Closed' },
];

const CashBookPage = () => {
    const [selectedIOU, setSelectedIOU] = useState(mockIOUs[0]);

    return (
        <div className="space-y-6">
            {/* Alert Box */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex gap-3 text-amber-900 shadow-sm">
                <Info className="size-5 shrink-0 text-amber-500 mt-0.5" />
                <div className="text-[12px] leading-relaxed">
                    <strong>Read-only.</strong> Record employee advances via <strong>Bookkeeping → Journal</strong>.
                    Balances calculate automatically.
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Employee IOUs List */}
                <Box className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <Box className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-[13px] font-bold text-slate-900">Employee IOUs</h3>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary-dark transition-colors">
                            <Plus className="size-3.5" />
                            <span>New Journal Entry</span>
                        </button>
                    </Box>
                    <Box className="p-4 space-y-3">
                        {mockIOUs.map((iou) => {
                            const outstanding = iou.issued - iou.returned;
                            const progress = (iou.returned / iou.issued) * 100;
                            const isActive = selectedIOU.id === iou.id;

                            return (
                                <div
                                    key={iou.id}
                                    onClick={() => setSelectedIOU(iou)}
                                    className={cn(
                                        "p-4 rounded-xl border transition-all cursor-pointer group",
                                        isActive ? "bg-indigo-50/30 border-primary" : "bg-slate-50 border-slate-100 hover:border-slate-200"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex gap-3">
                                            <div className="size-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                                <User className="size-4" />
                                            </div>
                                            <div>
                                                <div className="text-[13px] font-bold text-slate-900 leading-tight">{iou.name}</div>
                                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">IOU-00{iou.id} · {iou.date} · {iou.ref}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={cn(
                                                "text-sm font-mono font-bold tracking-tight",
                                                iou.status === 'Open' ? "text-amber-600" : "text-slate-400"
                                            )}>
                                                ৳ {iou.issued.toLocaleString()}
                                            </div>
                                            <span className={cn(
                                                "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase mt-1 inline-block",
                                                iou.status === 'Open' ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-500"
                                            )}>
                                                {iou.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] font-mono font-medium">
                                            <span className="text-emerald-600">Returned: ৳ {iou.returned.toLocaleString()}</span>
                                            <span className="text-slate-500">O/S: ৳ {outstanding.toLocaleString()}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </Box>
                </Box>

                {/* Detail View */}
                <Box className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <Box className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-[13px] font-bold text-slate-900">{selectedIOU.name} — Detail</h3>
                    </Box>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="text-[9px] font-bold tracking-wider uppercase text-slate-400 px-6 py-3 border-b border-slate-100">Ref</th>
                                    <th className="text-[9px] font-bold tracking-wider uppercase text-slate-400 px-6 py-3 border-b border-slate-100">Date</th>
                                    <th className="text-[9px] font-bold tracking-wider uppercase text-slate-400 px-6 py-3 border-b border-slate-100">Event</th>
                                    <th className="text-[9px] font-bold tracking-wider uppercase text-slate-400 px-6 py-3 border-b border-slate-100">Issued</th>
                                    <th className="text-[9px] font-bold tracking-wider uppercase text-slate-400 px-6 py-3 border-b border-slate-100">Ret.</th>
                                    <th className="text-[9px] font-bold tracking-wider uppercase text-slate-400 px-6 py-3 border-b border-slate-100">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {selectedIOU.issued > 0 && (
                                    <tr className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-[11px] font-mono text-primary font-bold">{selectedIOU.ref}</td>
                                        <td className="px-6 py-4 text-[11px] text-slate-500">{selectedIOU.date}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-[9px] font-bold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">Issued</span>
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-mono font-bold text-red-500">৳ {selectedIOU.issued.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-[11px] text-slate-300">—</td>
                                        <td className="px-6 py-4 text-[11px] font-mono font-bold text-slate-900">৳ {selectedIOU.issued.toLocaleString()}</td>
                                    </tr>
                                )}
                                {selectedIOU.returned > 0 && (
                                    <tr className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-[11px] font-mono text-primary font-bold">JE-041</td>
                                        <td className="px-6 py-4 text-[11px] text-slate-500">14 Feb</td>
                                        <td className="px-6 py-4">
                                            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">Return</span>
                                        </td>
                                        <td className="px-6 py-4 text-[11px] text-slate-300">—</td>
                                        <td className="px-6 py-4 text-[11px] font-mono font-bold text-emerald-500">৳ {selectedIOU.returned.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-[11px] font-mono font-bold text-slate-900">৳ {(selectedIOU.issued - selectedIOU.returned).toLocaleString()}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Box>
            </div>
        </div>
    );
};

export default CashBookPage;
