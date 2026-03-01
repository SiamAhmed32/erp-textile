"use client";

import React from "react";
import { CustomModal } from "@/components/reusables";
import { Bank } from "./types";
import { Landmark, Building2, Hash, Globe, CreditCard, Activity, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bank: Bank | null;
};

const BankDetailsModal = ({ open, onOpenChange, bank }: Props) => {
    if (!bank) return null;

    return (
        <CustomModal
            open={open}
            onOpenChange={onOpenChange}
            title=""
            maxWidth="620px"
        >
            <div className="space-y-0">
                {/* ── Header Strip ──────────────────────────────────────────────── */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-6 pt-6 pb-5 mb-5">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-white border border-zinc-200 text-zinc-500 uppercase tracking-widest">
                            <Landmark className="w-3 h-3" />
                            Sub-Ledger Account
                        </span>
                        <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-widest",
                            bank.isDeleted ? "bg-red-50 text-red-700 border-red-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full", bank.isDeleted ? "bg-red-400" : "bg-emerald-400")} />
                            {bank.isDeleted ? "Archived" : "Active"}
                        </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 tracking-tight leading-tight">
                                {bank.bankName}
                            </h2>
                            <div className="flex items-center gap-1.5 mt-1.5 text-zinc-400 text-xs font-medium">
                                <Building2 className="w-3 h-3" />
                                <span>{bank.branchName || "Main Branch"}</span>
                            </div>
                        </div>

                        <div className="shrink-0 text-right">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                                Account No.
                            </p>
                            <span className=" text-sm font-bold text-zinc-700 bg-white border border-zinc-200 px-2.5 py-1 rounded-md inline-block">
                                {bank.accountNumber}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Details Grid ─────────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <DetailRow
                        label="Routing Number"
                        value={bank.routingNumber || "—"}
                        icon={<Activity className="w-3.5 h-3.5" />}
                    />
                    <DetailRow
                        label="SWIFT / BIC"
                        value={bank.swiftCode || "—"}
                        icon={<Globe className="w-3.5 h-3.5" />}
                    />
                    <DetailRow
                        label="Registration Date"
                        value={new Date(bank.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                        icon={<Calendar className="w-3.5 h-3.5" />}
                    />
                    <DetailRow
                        label="Internal ID"
                        value={<span className=" text-[11px] text-zinc-400 break-all">{bank.id}</span>}
                        icon={<Hash className="w-3.5 h-3.5" />}
                    />
                </div>

                {/* ── Sub-Ledger Info ─────────────────────────────────────── */}
                <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-5 mb-5">
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest">Accounting Context</h3>
                    </div>
                    <p className="text-sm text-blue-800 leading-relaxed font-medium">
                        This bank account functions as a <span className="font-bold underline">Sub-Ledger</span>.
                        Transactions are posted to the central <span className="font-bold">"Cash at Bank"</span> control account,
                        tagged specifically with this account's unique identifier.
                    </p>
                </div>

                {/* ── Footer ───────────────────────────────────────────────── */}
                <div className="flex justify-end pt-1">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="h-11 px-10 rounded-lg bg-zinc-900 text-white text-sm font-bold hover:bg-black transition-all active:scale-95 shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </CustomModal>
    );
};

function DetailRow({ label, value, icon }: { label: string; value: string | React.ReactNode; icon: React.ReactNode }) {
    return (
        <div className="px-5 py-4 rounded-xl bg-white border border-zinc-100 shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
                <span className="text-zinc-400">{icon}</span>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {label}
                </p>
            </div>
            <div className="text-[13px] font-bold text-zinc-800">{value}</div>
        </div>
    );
}

export default BankDetailsModal;
