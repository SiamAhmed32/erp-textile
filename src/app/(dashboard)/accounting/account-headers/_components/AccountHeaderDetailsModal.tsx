"use client";

import React from "react";
import { CustomModal } from "@/components/reusables";
import { AccountHeader } from "./types";
import { Building2, Calendar, Hash, Info, GitFork, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    header: AccountHeader | null;
};

// ─── Type color map ───────────────────────────────────────────────────────────
// Maps account type to a subtle background + text combo for the header strip

const TYPE_PALETTE: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    ASSET: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", dot: "bg-sky-400" },
    LIABILITY: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-400" },
    EQUITY: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-400" },
    INCOME: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" },
    EXPENSE: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400" },
};

const fallbackPalette = { bg: "bg-zinc-50", text: "text-zinc-700", border: "border-zinc-200", dot: "bg-zinc-400" };

const AccountHeaderDetailsModal = ({ open, onOpenChange, header }: Props) => {
    if (!header) return null;

    const palette = TYPE_PALETTE[header.type] ?? fallbackPalette;

    return (
        <CustomModal
            open={open}
            onOpenChange={onOpenChange}
            title=""
            maxWidth="620px"
        >
            <div className="space-y-0">

                {/* ── Hero Strip ──────────────────────────────────────────────
                    Light-colored, type-aware. Not black — that's reserved for
                    the button only. Clean, breathable, readable.
                ─────────────────────────────────────────────────────────────── */}
                <div className={cn(
                    "rounded-xl border px-6 pt-6 pb-5 mb-5",
                    palette.bg,
                    palette.border
                )}>
                    {/* Type + Control badge row */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border",
                            palette.bg,
                            palette.text,
                            palette.border
                        )}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", palette.dot)} />
                            {header.type}
                        </span>

                        {header.isControlAccount && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white border border-zinc-200 text-zinc-600">
                                <ShieldCheck className="w-3 h-3" />
                                Control Account
                            </span>
                        )}
                    </div>

                    {/* Name */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900 tracking-tight leading-tight">
                                {header.name}
                            </h2>
                            {header.parent && (
                                <div className="flex items-center gap-1.5 mt-1.5 text-zinc-400 text-xs">
                                    <GitFork className="w-3 h-3" />
                                    <span>Sub-account of</span>
                                    <span className="font-semibold text-zinc-600">{header.parent.name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Opening Balance */}
                    <div className="mt-5 pt-4 border-t border-current/10" style={{ borderColor: "inherit" }}>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                            Opening Balance
                        </p>
                        <p className={cn("text-3xl font-black font-mono tracking-tight", palette.text)}>
                            ৳{" "}
                            {header.openingBalance?.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                            })}
                        </p>
                    </div>
                </div>

                {/* ── Details Grid ─────────────────────────────────────────── */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <DetailRow
                        label="Parent Classification"
                        value={header.parent ? header.parent.name : "Top-Level Account"}
                    />
                    <DetailRow
                        label="Account Mode"
                        value={header.isControlAccount ? "Control / Summary" : "Posting Account"}
                    />
                    <DetailRow
                        label="Registry Date"
                        value={new Date(header.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    />
                    <DetailRow
                        label="System UUID"
                        value={
                            <span className="font-mono text-[11px] text-zinc-400 break-all">
                                {header.id}
                            </span>
                        }
                    />
                </div>

                {/* ── Description / Notes ──────────────────────────────────── */}
                <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-5 py-4 mb-5">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                        Managerial Notes
                    </p>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        {header.description || (
                            <span className="italic text-zinc-400">
                                No operational notes specified for this ledger head.
                            </span>
                        )}
                    </p>
                </div>

                {/* ── Footer ───────────────────────────────────────────────── */}
                <div className="flex justify-end pt-1">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="h-10 px-8 rounded-lg bg-zinc-900 text-white text-sm font-semibold hover:bg-black transition-colors active:scale-[0.98]"
                    >
                        Close
                    </button>
                </div>

            </div>
        </CustomModal>
    );
};

// ─── DetailRow ────────────────────────────────────────────────────────────────
// Simple two-line label/value block — no icon clutter

function DetailRow({
    label,
    value,
}: {
    label: string;
    value: string | React.ReactNode;
}) {
    return (
        <div className="px-4 py-3 rounded-xl bg-white border border-zinc-200">
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                {label}
            </p>
            <div className="text-sm font-semibold text-zinc-800">{value}</div>
        </div>
    );
}

export default AccountHeaderDetailsModal;