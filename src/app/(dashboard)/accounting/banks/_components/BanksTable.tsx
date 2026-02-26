"use client";

import React, { useMemo } from "react";
import CustomTable from "@/components/reusables/CustomTable";
import { Bank } from "./types";
import { SquarePen, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
    data: Bank[];
    loading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onEdit: (bank: Bank) => void;
    onDelete: (bank: Bank) => void;
    onView: (bank: Bank) => void;
};

const BanksTable = ({
    data,
    loading,
    page,
    totalPages,
    onPageChange,
    onEdit,
    onDelete,
    onView,
}: Props) => {
    const columns = useMemo(
        () => [
            {
                header: "Bank Identity",
                accessor: (row: Bank) => (
                    <div className="flex items-center gap-4 py-1">
                        <div className="size-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-lg shadow-zinc-200">
                            {row.bankName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <div className="font-black text-zinc-900 text-[14px] tracking-tight uppercase leading-none mb-1">{row.bankName}</div>
                            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                                <span className="text-zinc-300">#</span>
                                {row.branchName || "Main Branch"}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                header: "Ledger Account",
                accessor: (row: Bank) => (
                    <div className="flex flex-col">
                        <span className="font-mono font-black text-zinc-800 text-[13px] tracking-tight">
                            {row.accountNumber.replace(/(.{4})/g, '$1 ')}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Primary Sub-Ledger</span>
                    </div>
                ),
            },
            {
                header: "Routing Data",
                accessor: (row: Bank) => (
                    <div className="flex flex-col gap-1">
                        {row.swiftCode && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-black text-zinc-400">SWIFT</span>
                                <span className="font-mono text-[11px] font-bold text-zinc-600">{row.swiftCode}</span>
                            </div>
                        )}
                        {row.routingNumber && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-black text-zinc-400">RTN</span>
                                <span className="font-mono text-[11px] font-bold text-zinc-600">{row.routingNumber}</span>
                            </div>
                        )}
                    </div>
                ),
            },
            {
                header: "Current Balance",
                accessor: (row: Bank) => (
                    <div className="flex flex-col">
                        <span className={cn(
                            "font-mono font-black text-[14px] tracking-tight",
                            row.balance < 0 ? "text-red-600" : "text-emerald-600"
                        )}>
                            ৳ {(row.balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Real-time Sync</span>
                    </div>
                ),
            },
            {
                header: "Ledger Status",
                accessor: (row: Bank) => (
                    <span
                        className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black border uppercase tracking-widest transition-all",
                            row.isDeleted
                                ? "bg-zinc-50 text-zinc-400 border-zinc-200"
                                : "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                        )}
                    >
                        <div
                            className={cn(
                                "h-1 w-1 rounded-full",
                                row.isDeleted ? "bg-zinc-300" : "bg-white animate-pulse"
                            )}
                        />
                        {row.isDeleted ? "Archived" : "Active"}
                    </span>
                ),
            },
            {
                header: "Actions",
                className: "text-right pr-6",
                accessor: (row: Bank) => (
                    <div className="flex justify-end gap-2">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all rounded-xl border border-transparent hover:border-zinc-200"
                            onClick={() => onView(row)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all rounded-xl border border-transparent hover:border-zinc-200"
                            onClick={() => onEdit(row)}
                        >
                            <SquarePen className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className={cn(
                                "h-9 w-9 transition-all rounded-xl border border-transparent",
                                row.isDeleted
                                    ? "text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100"
                                    : "text-zinc-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100"
                            )}
                            onClick={() => onDelete(row)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ),
            },
        ],
        [onEdit, onDelete, onView]
    );

    return (
        <CustomTable
            data={data}
            columns={columns}
            isLoading={loading}
            skeletonRows={5}
            pagination={{
                currentPage: page,
                totalPages,
                onPageChange,
            }}
            scrollAreaHeight="h-[calc(100vh-480px)]"
            rowClassName="group hover:bg-zinc-50/50 transition-colors cursor-default border-zinc-100"
        />
    );
};

export default BanksTable;
