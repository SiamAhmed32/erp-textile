"use client";

import React from "react";
import { CustomModal } from "@/components/reusables";
import { AccountHeader } from "./types";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, Hash, Info, UserCircle } from "lucide-react";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    header: AccountHeader | null;
};

const AccountHeaderDetailsModal = ({ open, onOpenChange, header }: Props) => {
    if (!header) return null;

    const DetailItem = ({
        icon: Icon,
        label,
        value,
        className = "",
    }: {
        icon: any;
        label: string;
        value: string | number;
        className?: string;
    }) => (
        <div className={cn("flex items-start gap-3 p-3 rounded-lg bg-slate-50/50 border border-slate-100/50", className)}>
            <div className="mt-0.5 p-1.5 rounded-md bg-white border border-slate-200 shadow-sm text-slate-500">
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                    {label}
                </p>
                <p className="text-sm font-semibold text-slate-900">{value}</p>
            </div>
        </div>
    );

    return (
        <CustomModal
            open={open}
            onOpenChange={onOpenChange}
            title="Account Header Details"
            maxWidth="600px"
        >
            <div className="space-y-6 pt-4">
                {/* Header Section */}
                <div className="relative overflow-hidden p-6 rounded-xl bg-slate-900 text-white shadow-lg">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 uppercase tracking-wider">
                                    {header.type}
                                </span>
                                <h3 className="text-2xl font-black mt-2 tracking-tight">
                                    {header.name}
                                </h3>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">
                                    Account Code
                                </p>
                                <div className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 font-mono text-sm font-bold">
                                    {header.code}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">
                                Opening Balance
                            </p>
                            <p className="text-3xl font-black text-emerald-400">
                                ৳ {(header.openingBalance || 0).toLocaleString("en-IN")}
                            </p>
                        </div>
                    </div>
                    {/* Background Decoration */}
                    <div className="absolute -right-8 -bottom-8 opacity-10">
                        <Building2 className="h-40 w-40" />
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                        icon={Hash}
                        label="Internal ID"
                        value={header.id.substring(0, 13)}
                    />
                    <DetailItem
                        icon={Building2}
                        label="Company profile"
                        value={header.companyProfile?.name || "N/A"}
                    />
                    <DetailItem
                        icon={Calendar}
                        label="Created At"
                        value={new Date(header.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    />
                    <DetailItem
                        icon={UserCircle}
                        label="Last Updated"
                        value={new Date(header.updatedAt).toLocaleDateString()}
                    />
                </div>

                {/* Description Section */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2 text-slate-500">
                        <Info className="h-4 w-4" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">
                            Description
                        </p>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                        {header.description || "No description provided for this account header."}
                    </p>
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="bg-black text-white hover:bg-black/90 px-8"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </CustomModal>
    );
};

// Helper function for cn
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}

export default AccountHeaderDetailsModal;
