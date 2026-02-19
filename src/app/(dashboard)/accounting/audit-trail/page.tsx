"use client";

import { Box } from "@/components/reusables";
import { cn } from "@/lib/utils";
import { FileDown } from 'lucide-react';

const auditItems = [
    {
        id: 'JE-041',
        type: 'Customer Due',
        party: 'Rahim Corp',
        date: '18 Feb 2026',
        amount: 75000,
        narration: 'Due created from invoice INV-099',
        tags: ['Receivable Created', 'Balanced ✓'],
        color: 'amber'
    },
    {
        id: 'JE-040',
        type: 'Receipt',
        party: 'Rahim Corp',
        date: '18 Feb 2026',
        amount: 50000,
        narration: 'Partial payment received',
        tags: ['Due Reduced ৳50,000', 'Cash In', 'Balanced ✓'],
        color: 'emerald'
    },
    {
        id: 'JE-039',
        type: 'Supplier Due',
        party: 'Karim Traders',
        date: '17 Feb 2026',
        amount: 32500,
        narration: 'Purchased raw materials on credit',
        tags: ['Payable Created', 'Balanced ✓'],
        color: 'amber'
    },
    {
        id: 'JE-038',
        type: 'Payment',
        party: 'Karim Traders',
        date: '17 Feb 2026',
        amount: 20000,
        narration: 'Partial payment made',
        tags: ['Due Reduced ৳20,000', 'Cash Out', 'Balanced ✓'],
        color: 'red'
    },
    {
        id: 'JE-037',
        type: 'Journal',
        party: 'General',
        date: '16 Feb 2026',
        amount: 8000,
        narration: 'Monthly depreciation entry',
        tags: ['General Ledger', 'Balanced ✓'],
        color: 'indigo'
    },
];

const AuditTrailPage = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Audit Timeline */}
                <Box className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <Box className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-[13px] font-bold text-slate-900">Audit Trail</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">Nothing is ever deleted — full transaction history</p>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            <FileDown className="size-3.5" />
                            <span>Export All</span>
                        </button>
                    </Box>
                    <Box className="p-6">
                        <div className="space-y-0">
                            {auditItems.map((item, i) => (
                                <div key={item.id} className="flex gap-6 group">
                                    <div className="flex flex-col items-center w-4 shrink-0">
                                        <div className={cn(
                                            "size-3 rounded-full border-2 border-white ring-2 ring-offset-0 ring-current transition-all group-hover:scale-125",
                                            item.color === 'amber' ? "text-amber-500" :
                                                item.color === 'emerald' ? "text-emerald-500" :
                                                    item.color === 'red' ? "text-red-500" : "text-primary"
                                        )} />
                                        {i !== auditItems.length - 1 && (
                                            <div className="w-[1px] flex-1 bg-slate-100 my-1 group-hover:bg-slate-200 transition-all" />
                                        )}
                                    </div>
                                    <div className="pb-8 flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-[13px] font-bold text-slate-900 group-hover:text-primary transition-colors">
                                                {item.id} · {item.type} — {item.party}
                                            </h4>
                                            <span className="text-[11px] font-mono text-slate-400">{item.date}</span>
                                        </div>
                                        <div className="text-[11px] text-slate-500 mb-2 font-mono tracking-tight">
                                            ৳ {item.amount.toLocaleString()} · {item.narration}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {item.tags.map((tag, j) => (
                                                <span
                                                    key={j}
                                                    className={cn(
                                                        "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter",
                                                        tag.includes('✓') ? "bg-slate-100 text-slate-500" :
                                                            tag.includes('Reduced') ? "bg-emerald-50 text-emerald-600" :
                                                                tag.includes('Receipt') ? "bg-emerald-50 text-emerald-600" :
                                                                    "bg-amber-50 text-amber-600"
                                                    )}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Box>
                </Box>

                {/* Registry Reference */}
                <Box className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-fit sticky top-6">
                    <Box className="px-6 py-4 border-b border-slate-100">
                        <h3 className="text-[12px] font-bold text-slate-900">Entry Type Reference</h3>
                    </Box>
                    <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-4 py-3 font-bold text-slate-400 uppercase text-[9px]">Type</th>
                                <th className="px-4 py-3 font-bold text-slate-400 uppercase text-[9px]">Updates</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { type: 'Customer Due', color: 'bg-amber-50 text-amber-600', updates: 'Customer Ledger ↑' },
                                { type: 'Receipt', color: 'bg-emerald-50 text-emerald-600', updates: 'Customer Ledger ↓ + Cash ↑' },
                                { type: 'Supplier Due', color: 'bg-amber-50 text-amber-600', updates: 'Supplier Ledger ↑' },
                                { type: 'Payment', color: 'bg-red-50 text-red-600', updates: 'Supplier Ledger ↓ + Cash ↓' },
                                { type: 'Journal', color: 'bg-indigo-50 text-primary', updates: 'Any account heads' },
                                { type: 'Contra', color: 'bg-slate-50 text-slate-500', updates: 'Reverses source entry' },
                            ].map((ref, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <span className={cn("px-2 py-0.5 rounded-full font-bold text-[9px] uppercase", ref.color)}>
                                            {ref.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-500">{ref.updates}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </div>
        </div>
    );
};

export default AuditTrailPage;
