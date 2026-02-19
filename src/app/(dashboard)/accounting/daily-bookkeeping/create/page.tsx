"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, InputField, SelectBox, PrimaryHeading } from "@/components/reusables";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    ArrowLeft, Info, CheckCircle2, AlertCircle, Bookmark,
    History, FileText, Landmark, Undo2, Receipt, Send, Building, Save, X
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */
interface FormHeaderProps {
    title: string;
    sub: string;
    icon: React.ReactNode;
    color: "amber" | "emerald" | "purple" | "indigo";
}

/* ─── Sub-Components ─────────────────────────────────────── */

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

function LedgerPreview({ entries }: { entries: { head: string; type: string; amount: string; note: string }[] }) {
    return (
        <div className="space-y-3 mt-6">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction Balance Preview</span>
                <div className="h-px flex-1 bg-slate-100" />
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50/30">
                {entries.map((entry, i) => (
                    <div key={i} className="px-4 py-3 border-b border-slate-100 last:border-0 flex justify-between items-center group hover:bg-white transition-colors">
                        <div className="flex items-center gap-3">
                            <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded border",
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
    const [formData, setFormData] = useState<any>({
        date: "2026-02-19",
        refId: "AUTO-DRAFT-001",
        customer: "",
        supplier: "",
        account: "",
        method: "",
        amount: "",
        memo: "",
        drAccount: "",
        debitAmount: "",
        crAccount: "",
        creditAmount: "",
        type: "",
        from: "",
        to: "",
        head: "",
        instrument: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
        if (name === "customer") {
            setCustHint(custDues[value.toLowerCase().split(' ')[0]] || "");
        }
    };

    const getTabTitle = () => {
        for (const g of tabs) {
            const match = g.items.find(t => t.key === activeTab);
            if (match) return match.label.substring(3); // Remove icon
        }
        return "New Entry";
    };

    const getTabIcon = () => {
        switch (activeTab) {
            case "custdue": return <Bookmark className="size-5" />;
            case "receipt": return <Receipt className="size-5" />;
            case "suppdue": return <Building className="size-5" />;
            case "payment": return <Send className="size-5" />;
            case "journal": return <FileText className="size-5" />;
            case "contra": return <Undo2 className="size-5" />;
            default: return <Bookmark className="size-5" />;
        }
    };

    return (
        <Container className="py-6 space-y-6 !max-w-[1200px] pb-20 font-outfit">
            {/* Header Area */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                    <Link
                        href="/accounting/daily-bookkeeping"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-black transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Daily Bookkeeping
                    </Link>
                    <PrimaryHeading className="!text-black">Create Entry</PrimaryHeading>
                </div>
                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <Button variant="outline" onClick={() => router.push("/accounting/daily-bookkeeping")} className="h-10 px-6 font-bold">
                        Cancel
                    </Button>
                    <Button className="h-10 px-6 bg-black text-white hover:bg-black/90 font-bold flex items-center gap-2">
                        <Save className="size-4" /> Post Entry
                    </Button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Entry Type Selector (Card) */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Entry Type Selection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {tabs.flatMap(g => g.items).map(t => (
                                <button
                                    key={t.key}
                                    onClick={() => { setActiveTab(t.key); setCustHint(""); }}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-xs font-bold transition-all border",
                                        activeTab === t.key
                                            ? "bg-black border-black text-white shadow-md shadow-slate-200"
                                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                                    )}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Form Details */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-900">
                            {getTabIcon()}
                        </div>
                        <CardTitle>Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Form contents... unchanged from previous implementation */}
                        {/* Common Header Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <InputField
                                label="Posting Date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                            <InputField
                                label="Reference ID"
                                name="refId"
                                value={formData.refId}
                                onChange={handleChange}
                                disabled
                                className="bg-slate-50 font-mono text-slate-400"
                            />
                        </div>

                        {/* Dynamic Content based on Tab */}
                        {activeTab === "custdue" && (
                            <div className="space-y-6">
                                <HighlightBox color="amber" icon={<Info size={16} />} text="Recording a sale where payment is deferred. This will increase the customer's outstanding balance." />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <SelectBox
                                        label="Customer"
                                        name="customer"
                                        value={formData.customer}
                                        onChange={handleSelectChange}
                                        options={[
                                            { _id: "Rahim Corp", name: "Rahim Corp" },
                                            { _id: "Nadia Ent", name: "Nadia Ent" }
                                        ]}
                                        required
                                    />
                                    <InputField
                                        label="Due Amount (৳)"
                                        name="amount"
                                        value={formData.amount}
                                        placeholder="0.00"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <InputField
                                    label="Narration / Memo"
                                    name="memo"
                                    value={formData.memo}
                                    placeholder="Explain the transaction context..."
                                    onChange={handleChange}
                                />
                                <LedgerPreview entries={[
                                    { head: "Accounts Receivable", type: "DR", amount: "75,000", note: "Customer Asset Increase" },
                                    { head: "Sales Revenue", type: "CR", amount: "75,000", note: "Income Realized" },
                                ]} />
                            </div>
                        )}

                        {activeTab === "receipt" && (
                            <div className="space-y-6">
                                <HighlightBox color="emerald" icon={<CheckCircle2 size={16} />} text="Settling customer dues. This will decrease their outstanding balance and increase your cash/bank." />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <SelectBox
                                        label="Customer"
                                        name="customer"
                                        value={formData.customer}
                                        onChange={handleSelectChange}
                                        options={[
                                            { _id: "Rahim Corp", name: "Rahim Corp" },
                                            { _id: "Nadia Ent", name: "Nadia Ent" }
                                        ]}
                                        required
                                    />
                                    <SelectBox
                                        label="Payment Method"
                                        name="method"
                                        value={formData.method}
                                        onChange={handleSelectChange}
                                        options={[
                                            { _id: "cash", name: "Cash in Hand" },
                                            { _id: "bank", name: "Bank Transfer" }
                                        ]}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <InputField
                                        label="Paid Amount (৳)"
                                        name="amount"
                                        value={formData.amount}
                                        placeholder="0.00"
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="flex items-end pb-1">
                                        {custHint && <HighlightBox color="amber" text={custHint} />}
                                    </div>
                                </div>
                                <InputField
                                    label="Narration"
                                    name="memo"
                                    value={formData.memo}
                                    placeholder="e.g. Cleared invoice #402"
                                    onChange={handleChange}
                                />
                                <LedgerPreview entries={[
                                    { head: "Cash / Bank", type: "DR", amount: "50,000", note: "Liquid Asset Increase" },
                                    { head: "Accounts Receivable", type: "CR", amount: "50,000", note: "Customer Due Reduced" },
                                ]} />
                            </div>
                        )}

                        {activeTab === "suppdue" && (
                            <div className="space-y-6">
                                <HighlightBox color="purple" icon={<Info size={16} />} text="Recording a purchase where payment is deferred. This will increase your accounts payable." />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SelectBox
                                        label="Supplier"
                                        name="supplier"
                                        value={formData.supplier}
                                        onChange={handleSelectChange}
                                        options={[
                                            { _id: "Habib", name: "Habib Textiles" },
                                            { _id: "Global", name: "Global Yarns" }
                                        ]}
                                        required
                                    />
                                    <InputField
                                        label="Total Amount (৳)"
                                        name="amount"
                                        value={formData.amount}
                                        placeholder="0.00"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SelectBox
                                        label="Ledger Head (Debit)"
                                        name="head"
                                        value={formData.head}
                                        onChange={handleSelectChange}
                                        options={[
                                            { _id: "inventory", name: "Inventory Purchase" },
                                            { _id: "supplies", name: "Office Supplies" }
                                        ]}
                                    />
                                    <InputField
                                        label="Narration"
                                        name="memo"
                                        value={formData.memo}
                                        placeholder="Describe the purchase..."
                                        onChange={handleChange}
                                    />
                                </div>
                                <LedgerPreview entries={[
                                    { head: "Expense / Inventory", type: "DR", amount: "1,20,000", note: "Cost Recognized" },
                                    { head: "Accounts Payable", type: "CR", amount: "1,20,000", note: "Liability Increased" },
                                ]} />
                            </div>
                        )}

                        {activeTab === "payment" && (
                            <div className="space-y-6">
                                <HighlightBox color="indigo" icon={<CheckCircle2 size={16} />} text="Paying a vendor. This will decrease your accounts payable and decrease your cash/bank balance." />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SelectBox
                                        label="Supplier"
                                        name="supplier"
                                        value={formData.supplier}
                                        onChange={handleSelectChange}
                                        options={[{ _id: "Habib", name: "Habib Textiles" }]}
                                        required
                                    />
                                    <InputField
                                        label="Payment Amount (৳)"
                                        name="amount"
                                        value={formData.amount}
                                        placeholder="0.00"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SelectBox
                                        label="Payment Account"
                                        name="account"
                                        value={formData.account}
                                        onChange={handleSelectChange}
                                        options={[
                                            { _id: "cash", name: "Cash in Hand" },
                                            { _id: "bank", name: "City Bank - 902" }
                                        ]}
                                    />
                                    <InputField
                                        label="Instrument No (Cheque/TRX)"
                                        name="instrument"
                                        value={formData.instrument}
                                        placeholder="Optional"
                                        onChange={handleChange}
                                    />
                                </div>
                                <LedgerPreview entries={[
                                    { head: "Accounts Payable", type: "DR", amount: "80,000", note: "Liability Reduced" },
                                    { head: "Cash / Bank Account", type: "CR", amount: "80,000", note: "Liquid Asset Reduction" },
                                ]} />
                            </div>
                        )}

                        {activeTab === "journal" && (
                            <div className="space-y-6">
                                <HighlightBox color="indigo" icon={<Info size={16} />} text="Standard double-entry adjustment. Use this for payroll, depreciation, or correction of errors." />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                                    <div className="space-y-4">
                                        <SelectBox
                                            label="Debit Account"
                                            name="drAccount"
                                            value={formData.drAccount}
                                            onChange={handleSelectChange}
                                            options={[
                                                { _id: "salary", name: "Salary Expense" },
                                                { _id: "rent", name: "Office Rent" }
                                            ]}
                                            required
                                        />
                                        <InputField label="Debit Amount (৳)" name="debitAmount" value={formData.debitAmount} placeholder="0.00" onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-4">
                                        <SelectBox
                                            label="Credit Account"
                                            name="crAccount"
                                            value={formData.crAccount}
                                            onChange={handleSelectChange}
                                            options={[
                                                { _id: "cash", name: "Cash in Hand" },
                                                { _id: "salaryPayable", name: "Salary Payable" }
                                            ]}
                                            required
                                        />
                                        <InputField label="Credit Amount (৳)" name="creditAmount" value={formData.creditAmount} placeholder="0.00" onChange={handleChange} required />
                                    </div>
                                </div>
                                <InputField
                                    label="Narration"
                                    name="memo"
                                    value={formData.memo}
                                    placeholder="Full explanation of the entry..."
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        {activeTab === "contra" && (
                            <div className="space-y-6">
                                <HighlightBox color="emerald" icon={<Info size={16} />} text="Use contra entries for transferring funds between your own accounts (e.g., Bank deposit, cash withdrawal)." />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SelectBox
                                        label="Transaction Type"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleSelectChange}
                                        options={[
                                            { _id: "deposit", name: "Cash to Bank (Deposit)" },
                                            { _id: "withdrawal", name: "Bank to Cash (Withdrawal)" },
                                            { _id: "transfer", name: "Bank to Bank (Transfer)" }
                                        ]}
                                    />
                                    <InputField
                                        label="Amount (৳)"
                                        name="amount"
                                        value={formData.amount}
                                        placeholder="0.00"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SelectBox
                                        label="Transfer From"
                                        name="from"
                                        value={formData.from}
                                        onChange={handleSelectChange}
                                        options={[{ _id: "cash", name: "Cash in Hand" }, { _id: "bank", name: "City Bank" }]}
                                    />
                                    <SelectBox
                                        label="Transfer To"
                                        name="to"
                                        value={formData.to}
                                        onChange={handleSelectChange}
                                        options={[{ _id: "bank", name: "City Bank" }, { _id: "cash", name: "Cash in Hand" }]}
                                    />
                                </div>
                                <LedgerPreview entries={[
                                    { head: "Target Account", type: "DR", amount: "25,000", note: "Internal Inflow" },
                                    { head: "Source Account", type: "CR", amount: "25,000", note: "Internal Outflow" },
                                ]} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Container>
    );
}
