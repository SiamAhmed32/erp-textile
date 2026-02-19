"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, PrimaryHeading, PrimarySubHeading, ButtonPrimary } from "@/components/reusables";
import { cn } from "@/lib/utils";
import {
    ArrowLeft, Info, CheckCircle2, AlertCircle, Bookmark,
    History, FileText, Landmark, Undo2, Receipt, Send, Building
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */
interface FormHeaderProps {
    title: string;
    sub: string;
    icon: React.ReactNode;
    color: "amber" | "emerald" | "purple" | "indigo";
}

/* ─── Sub-Components ─────────────────────────────────────── */

function FormHeader({ title, sub, icon, color }: FormHeaderProps) {
    const caps = {
        amber: "border-amber-500 text-amber-600",
        emerald: "border-emerald-500 text-emerald-600",
        purple: "border-purple-500 text-purple-600",
        indigo: "border-indigo-500 text-indigo-600"
    };
    return (
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/20 flex items-center justify-between font-outfit">
            <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-xl border-2 bg-white shadow-sm flex items-center justify-center", caps[color])}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-black tracking-tight text-slate-900">{title}</h3>
                    <p className="text-xs font-medium text-slate-400">{sub}</p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full whitespace-nowrap">Secure Entry</span>
            </div>
        </div>
    );
}

function HighlightBox({ color, text, icon }: { color: string; text: string; icon?: React.ReactNode }) {
    return (
        <div className={cn("p-4 rounded-xl border flex gap-3 items-start",
            color === "amber" ? "bg-amber-50/50 border-amber-100 text-amber-900" :
                color === "emerald" ? "bg-emerald-50/50 border-emerald-100 text-emerald-900" :
                    "bg-indigo-50/50 border-indigo-100 text-indigo-900"
        )}>
            {icon && <div className="mt-0.5">{icon}</div>}
            <p className="text-[11px] font-medium leading-relaxed">{text}</p>
        </div>
    );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5 group">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-primary transition-colors">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}

function LedgerPreview({ entries }: { entries: { head: string; type: string; amount: string; note: string }[] }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Transaction Balance</span>
                <div className="h-px flex-1 bg-slate-100" />
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-slate-50/30">
                {entries.map((entry, i) => (
                    <div key={i} className="px-4 py-3 border-b border-slate-100 last:border-0 flex justify-between items-center group hover:bg-white transition-colors">
                        <div className="flex items-center gap-3">
                            <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded border-2",
                                entry.type === "DR" ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                            )}>{entry.type}</span>
                            <div>
                                <p className="text-xs font-bold text-slate-700">{entry.head}</p>
                                <p className="text-[9px] text-slate-400 italic font-medium">{entry.note}</p>
                            </div>
                        </div>
                        <span className="font-mono text-xs font-black text-slate-900 tracking-tighter">৳ {entry.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Tab Types ──────────────────────────────────────────── */
const tabs = [
    { group: "Customer", items: [{ key: "custdue", label: "📋 Customer Due" }, { key: "receipt", label: "📥 Receipt" }] },
    { group: "Supplier", items: [{ key: "suppdue", label: "📋 Supplier Due" }, { key: "payment", label: "📤 Payment" }] },
    { group: "General", items: [{ key: "journal", label: "📓 Journal" }, { key: "contra", label: "↩ Contra" }] },
];

/* ─── Mock Data ───────────────────────────────────────────── */
const custDues: Record<string, string> = {
    rahim: "Outstanding: ৳ 40,000. Last payment received 5 days ago.",
    nadia: "Outstanding: ৳ 18,000. Next installment due in 2 days.",
    bashir: "Outstanding: ৳ 36,000 (Overdue). Restricted from new credit.",
};

export default function BookkeepingCreatePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("custdue");
    const [custHint, setCustHint] = useState("");

    return (
        <Container className="py-8 space-y-6 !max-w-[1250px] !p-0 pb-20 font-outfit">
            {/* Header Area */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => router.push("/accounting/daily-bookkeeping")}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors w-fit"
                >
                    <ArrowLeft className="size-3.5" /> Back to Dashboard
                </button>
                <Box>
                    <PrimaryHeading>Create Entry</PrimaryHeading>
                    <PrimarySubHeading>Record new financial movement, customer dues, or system adjustments</PrimarySubHeading>
                </Box>
            </div>

            {/* Premium Tab Bar */}
            <div className="flex items-center gap-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
                {tabs.map((g) => (
                    <div key={g.group} className="flex flex-col gap-2 min-w-max">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{g.group} Entities</span>
                        <div className="flex gap-1.5">
                            {g.items.map(t => (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-xs font-bold transition-all border",
                                        activeTab === t.key
                                            ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200 scale-105"
                                            : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-white"
                                    )}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Form Logic (3/5) */}
                <div className="lg:col-span-3 space-y-6">
                    <Box className="bg-white border-2 border-slate-100 rounded-2xl shadow-sm overflow-hidden min-h-[600px]">
                        {activeTab === "custdue" && (
                            <>
                                <FormHeader title="Customer Due" sub="Sold on credit terms" icon={<Bookmark size={20} />} color="amber" />
                                <div className="p-6 space-y-6">
                                    <HighlightBox color="amber" icon={<Info size={16} />} text="Recording a sale where payment is deferred. This will increase the customer's outstanding balance." />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Posting Date"><input type="date" className="form-input" defaultValue="2026-02-19" /></FormField>
                                        <FormField label="Draft Reference"><input type="text" value="DRAFT-JE-202" readOnly className="form-input bg-slate-50 font-mono text-slate-400" /></FormField>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Customer" required>
                                            <select className="form-input shadow-inner"><option>Select Customer</option><option>Rahim Corp</option></select>
                                        </FormField>
                                        <FormField label="Gross Due (৳)" required><input type="text" placeholder="0.00" className="form-input text-lg font-black" /></FormField>
                                    </div>
                                    <FormField label="Memo / Narration"><input type="text" placeholder="Explain the transaction context..." className="form-input" /></FormField>
                                    <LedgerPreview entries={[
                                        { head: "Accounts Receivable", type: "DR", amount: "75,000", note: "Customer Asset Increase" },
                                        { head: "Sales Revenue", type: "CR", amount: "75,000", note: "Income Realized" },
                                    ]} />
                                    <div className="pt-4">
                                        <ButtonPrimary icon={<CheckCircle2 size={18} />} className="w-full justify-center py-4 text-sm font-black tracking-widest leading-none">COMMIT TRANSACTION</ButtonPrimary>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === "receipt" && (
                            <>
                                <FormHeader title="Receipt" sub="Customer payment received" icon={<Receipt size={20} />} color="emerald" />
                                <div className="p-6 space-y-6">
                                    <HighlightBox color="emerald" icon={<CheckCircle2 size={16} />} text="Settling customer dues. This will decrease their outstanding balance and increase your cash/bank." />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Posting Date"><input type="date" className="form-input" defaultValue="2026-02-19" /></FormField>
                                        <FormField label="Payment Method"><select className="form-input"><option>Cash in Hand</option><option>Bank Transfer</option><option>Cheque</option></select></FormField>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Customer" required>
                                            <select className="form-input shadow-inner" onChange={(e) => setCustHint(custDues[e.target.value.toLowerCase().split(' ')[0]] || "")}>
                                                <option>Select Customer</option><option>Rahim Corp</option><option>Nadia Ent.</option>
                                            </select>
                                        </FormField>
                                        <FormField label="Amount Paid (৳)" required><input type="text" placeholder="0.00" className="form-input text-lg font-black" /></FormField>
                                    </div>
                                    {custHint && <HighlightBox color="amber" icon={<AlertCircle size={16} />} text={custHint} />}
                                    <FormField label="Memo"><input type="text" placeholder="e.g. Cleared invoice #402" className="form-input" /></FormField>
                                    <LedgerPreview entries={[
                                        { head: "Cash / Bank", type: "DR", amount: "50,000", note: "Liquid Asset Increase" },
                                        { head: "Accounts Receivable", type: "CR", amount: "50,000", note: "Customer Due Reduced" },
                                    ]} />
                                    <div className="pt-4">
                                        <ButtonPrimary icon={<CheckCircle2 size={18} />} className="w-full justify-center py-4 text-sm font-black tracking-widest leading-none">POST RECEIPT</ButtonPrimary>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === "suppdue" && (
                            <>
                                <FormHeader title="Supplier Due" sub="Purchase on credit" icon={<Building size={20} />} color="purple" />
                                <div className="p-6 space-y-6">
                                    <HighlightBox color="purple" icon={<Info size={16} />} text="Recording a purchase where payment is deferred. This will increase your accounts payable." />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Posting Date"><input type="date" className="form-input" defaultValue="2026-02-19" /></FormField>
                                        <FormField label="Reference No"><input type="text" placeholder="Bill/Invoce #" className="form-input" /></FormField>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Supplier" required>
                                            <select className="form-input shadow-inner"><option>Select Supplier</option><option>Habib Textiles</option><option>Global Yarns</option></select>
                                        </FormField>
                                        <FormField label="Total Amount (৳)" required><input type="text" placeholder="0.00" className="form-input text-lg font-black" /></FormField>
                                    </div>
                                    <FormField label="Ledger Head (Debit)"><select className="form-input"><option>Inventory Purchase</option><option>Office Supplies</option><option>Maintenance</option></select></FormField>
                                    <FormField label="Narration"><input type="text" placeholder="Describe the purchase..." className="form-input" /></FormField>
                                    <LedgerPreview entries={[
                                        { head: "Expense / Inventory", type: "DR", amount: "1,20,000", note: "Cost Recognized" },
                                        { head: "Accounts Payable", type: "CR", amount: "1,20,000", note: "Liability Increased" },
                                    ]} />
                                    <div className="pt-4">
                                        <ButtonPrimary icon={<CheckCircle2 size={18} />} className="w-full justify-center py-4 text-sm font-black tracking-widest leading-none">COMMIT PURCHASE</ButtonPrimary>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === "payment" && (
                            <>
                                <FormHeader title="Supplier Payment" sub="Settling vendor outstanding" icon={<Send size={20} />} color="indigo" />
                                <div className="p-6 space-y-6">
                                    <HighlightBox color="indigo" icon={<CheckCircle2 size={16} />} text="Paying a vendor. This will decrease your accounts payable and decrease your cash/bank balance." />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Posting Date"><input type="date" className="form-input" defaultValue="2026-02-19" /></FormField>
                                        <FormField label="Payment Account"><select className="form-input"><option>Cash in Hand</option><option>City Bank - 902</option><option>Dutch Bangla - 102</option></select></FormField>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Supplier" required>
                                            <select className="form-input shadow-inner"><option>Select Supplier</option><option>Habib Textiles</option></select>
                                        </FormField>
                                        <FormField label="Payment Amount (৳)" required><input type="text" placeholder="0.00" className="form-input text-lg font-black" /></FormField>
                                    </div>
                                    <FormField label="Instrument No (Cheque/TRX)"><input type="text" placeholder="Optional" className="form-input" /></FormField>
                                    <LedgerPreview entries={[
                                        { head: "Accounts Payable", type: "DR", amount: "80,000", note: "Liability Reduced" },
                                        { head: "Cash / Bank Account", type: "CR", amount: "80,000", note: "Liquid Asset Reduction" },
                                    ]} />
                                    <div className="pt-4">
                                        <ButtonPrimary icon={<CheckCircle2 size={18} />} className="w-full justify-center py-4 text-sm font-black tracking-widest leading-none">POST PAYMENT</ButtonPrimary>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === "journal" && (
                            <>
                                <FormHeader title="Journal Voucher" sub="Adjustments & general entries" icon={<FileText size={20} />} color="purple" />
                                <div className="p-6 space-y-6">
                                    <HighlightBox color="indigo" icon={<Info size={16} />} text="Standard double-entry adjustment. Use this for payroll, depreciation, or correction of errors." />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Posting Date"><input type="date" className="form-input" defaultValue="2026-02-19" /></FormField>
                                        <FormField label="Voucher Ref"><input type="text" placeholder="JV-2026-04" className="form-input" /></FormField>
                                    </div>
                                    <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField label="Debit Account" required><select className="form-input"><option>Select Account</option><option>Salary Expense</option><option>Office Rent</option></select></FormField>
                                            <FormField label="Debit Amount (৳)" required><input type="text" placeholder="0.00" className="form-input font-bold" /></FormField>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField label="Credit Account" required><select className="form-input"><option>Select Account</option><option>Cash in Hand</option><option>Salary Payable</option></select></FormField>
                                            <FormField label="Credit Amount (৳)" required><input type="text" placeholder="0.00" className="form-input font-bold" /></FormField>
                                        </div>
                                    </div>
                                    <FormField label="Memo / Narration"><input type="text" placeholder="Full explanation of the entry..." className="form-input" /></FormField>
                                    <div className="pt-4">
                                        <ButtonPrimary icon={<CheckCircle2 size={18} />} className="w-full justify-center py-4 text-sm font-black tracking-widest leading-none">POST JOURNAL</ButtonPrimary>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === "contra" && (
                            <>
                                <FormHeader title="Contra Entry" sub="Internal cash/bank movements" icon={<Undo2 size={20} />} color="indigo" />
                                <div className="p-6 space-y-6">
                                    <HighlightBox color="emerald" icon={<Info size={16} />} text="Use contra entries for transferring funds between your own accounts (e.g., Bank deposit, cash withdrawal)." />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Posting Date"><input type="date" className="form-input" defaultValue="2026-02-19" /></FormField>
                                        <FormField label="Transaction Type">
                                            <select className="form-input">
                                                <option>Cash to Bank (Deposit)</option>
                                                <option>Bank to Cash (Withdrawal)</option>
                                                <option>Bank to Bank (Transfer)</option>
                                            </select>
                                        </FormField>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Transfer From" required>
                                            <select className="form-input"><option>Cash in Hand</option><option>City Bank</option></select>
                                        </FormField>
                                        <FormField label="Transfer To" required>
                                            <select className="form-input"><option>City Bank</option><option>Cash in Hand</option></select>
                                        </FormField>
                                    </div>
                                    <FormField label="Amount (৳)" required><input type="text" placeholder="0.00" className="form-input text-lg font-black" /></FormField>
                                    <LedgerPreview entries={[
                                        { head: "Target Account", type: "DR", amount: "25,000", note: "Internal Inflow" },
                                        { head: "Source Account", type: "CR", amount: "25,000", note: "Internal Outflow" },
                                    ]} />
                                    <div className="pt-4">
                                        <ButtonPrimary icon={<CheckCircle2 size={18} />} className="w-full justify-center py-4 text-sm font-black tracking-widest leading-none">POST CONTRA</ButtonPrimary>
                                    </div>
                                </div>
                            </>
                        )}
                    </Box>
                </div>

                {/* Side Panels (2/5) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Visual Guide */}
                    <Box className="bg-slate-900 border-none rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><Info size={80} /></div>
                        <h3 className="text-sm font-black tracking-[0.2em] mb-4">ENTITY LOGIC</h3>
                        <div className="space-y-4">
                            {[
                                { t: "Customer Ledger", d: "Affects Receivables and Revenue.", icon: <Bookmark size={14} className="text-slate-400 group-hover:text-white" /> },
                                { t: "Supplier Ledger", d: "Affects Payables and Expenses.", icon: <Send size={14} className="text-slate-400 group-hover:text-white" /> },
                                { t: "General Ledger", d: "Adjustments, Salaries, Loans (MOI).", icon: <Landmark size={14} className="text-slate-400 group-hover:text-white" /> },
                                { t: "Reversals (Contra)", d: "Zero-sum correction logic.", icon: <Undo2 size={14} className="text-slate-400 group-hover:text-white" /> }
                            ].map(i => (
                                <div key={i.t} className="flex gap-4 items-start group cursor-default">
                                    <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-primary transition-colors flex items-center justify-center">
                                        {i.icon}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{i.t}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{i.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Box>

                    {/* Timeline */}
                    <Box className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-[11px] font-black tracking-[0.15em] text-slate-400 uppercase">Audit History</h3>
                            <History size={14} className="text-slate-300" />
                        </div>
                        <div className="divide-y divide-slate-50">
                            {[
                                { id: "JE-041", type: "Sale", party: "Rahim Corp", amt: "+ ৳ 75k", color: "text-amber-500" },
                                { id: "JE-040", type: "Pmt", party: "Nadia Ent.", amt: "- ৳ 12k", color: "text-emerald-500" },
                                { id: "JE-039", type: "Exp", party: "Office Rent", amt: "- ৳ 45k", color: "text-red-500" },
                            ].map(item => (
                                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300"><FileText size={16} /></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">{item.party}</p>
                                            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase">{item.id} · {item.type}</p>
                                        </div>
                                    </div>
                                    <p className={cn("text-xs font-black font-mono", item.color)}>{item.amt}</p>
                                </div>
                            ))}
                        </div>
                    </Box>
                </div>
            </div>
        </Container>
    );
}
