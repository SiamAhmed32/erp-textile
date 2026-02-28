"use client";

import React, { useMemo } from "react";
import CustomTable from "@/components/reusables/CustomTable";
import { AccountHeader } from "./types";
import {
    SquarePen,
    Eye,
    ShieldCheck,
    FolderTree,
    FileCode2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
    data: AccountHeader[];
    loading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onEdit: (header: AccountHeader) => void;
    onDelete: (header: AccountHeader) => void;
    onView: (header: AccountHeader) => void;
};

const AccountHeadersTable = ({
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
                header: "Ledger Hierarchy",
                accessor: (row: AccountHeader) => {
                    const isChild = !!row.parentId;
                    return (
                        <div className={cn(
                            "flex items-center py-1 gap-3",
                            isChild ? "ml-8" : "ml-0"
                        )}>
                            {/* Visual guide for children */}
                            {isChild && (
                                <div className="absolute left-10 w-px h-full bg-zinc-200 -top-4" />
                            )}
                            {isChild && (
                                <div className="absolute left-10 w-3 h-px bg-zinc-200" />
                            )}

                            <div className={cn(
                                "size-9 rounded-xl flex items-center justify-center shrink-0 border transition-all",
                                row.isControlAccount
                                    ? "bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-200"
                                    : "bg-zinc-50 border-zinc-200 text-zinc-400 group-hover:bg-white"
                            )}>
                                {row.isControlAccount ? <FolderTree className="w-4 h-4" /> : <FileCode2 className="w-4 h-4" />}
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "font-black tracking-tight uppercase leading-none",
                                        row.isControlAccount ? "text-zinc-900 text-[14px]" : "text-zinc-600 text-[13px]"
                                    )}>
                                        {row.name}
                                    </span>
                                    {row.isControlAccount && (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-100 text-[8px] font-black text-zinc-500 uppercase tracking-widest border border-zinc-200">
                                            <ShieldCheck className="w-2.5 h-2.5" />
                                            Anchor
                                        </div>
                                    )}
                                </div>
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1">
                                    {row.isControlAccount ? "Control Header" : "Sub-Ledger Head"}
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                header: "Financial Group",
                accessor: (row: AccountHeader) => {
                    const type = row.type?.toUpperCase();
                    const config: Record<string, string> = {
                        ASSET: "bg-sky-900 text-sky-50 border-sky-800 shadow-sky-100",
                        LIABILITY: "bg-rose-900 text-rose-50 border-rose-800 shadow-rose-100",
                        INCOME: "bg-emerald-900 text-emerald-50 border-emerald-800 shadow-emerald-100",
                        REVENUE: "bg-emerald-900 text-emerald-50 border-emerald-800 shadow-emerald-100",
                        EXPENSE: "bg-amber-900 text-amber-50 border-amber-800 shadow-amber-100",
                        EQUITY: "bg-violet-900 text-violet-50 border-violet-800 shadow-violet-100",
                    };

                    return (
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "inline-flex items-center rounded-lg px-2.5 py-1 text-[9px] font-black border uppercase tracking-widest shadow-sm",
                                config[type] || "bg-zinc-900 text-white"
                            )}>
                                {type}
                            </span>
                        </div>
                    );
                },
            },
            {
                header: "Utility",
                className: "text-right pr-6",
                accessor: (row: AccountHeader) => (
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
                    </div>
                ),
            },
        ],
        [onEdit, onView]
    );

    return (
        <CustomTable
            data={data}
            columns={columns}
            isLoading={loading}
            skeletonRows={10}
            pagination={{
                currentPage: page,
                totalPages,
                onPageChange,
            }}
            scrollAreaHeight="h-[calc(100vh-420px)]"
            rowClassName="group hover:bg-zinc-50/50 transition-all cursor-default relative overflow-visible"
        />
    );
};


export default AccountHeadersTable;
