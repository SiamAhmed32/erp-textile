"use client";

import React, { useMemo } from "react";
import CustomTable from "@/components/reusables/CustomTable";
import { AccountHeader } from "./types";
import { SquarePen, Trash2, Eye, GitFork, ShieldCheck, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { takaSign } from "@/lib/constants";

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
                header: "Account Code",
                accessor: (row: AccountHeader) => (
                    <div className="flex flex-col">
                        <span className="font-mono text-[13px] font-bold text-zinc-900">{row.code || "N/A"}</span>
                        {row.isControlAccount && (
                            <span className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase mt-0.5 px-1.5 py-0.5 border border-zinc-200 rounded bg-zinc-50 flex items-center gap-1 w-fit">
                                <ShieldCheck className="h-2.5 w-2.5" />
                                Control
                            </span>
                        )}
                    </div>
                ),
            },
            {
                header: "Account Name",
                accessor: (row: AccountHeader) => (
                    <div className="flex flex-col">
                        <div className="font-bold text-zinc-900 text-[14px] tracking-tight">{row.name}</div>
                        {row.parent && (
                            <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-0.5">
                                <GitFork className="h-3 w-3" />
                                <span>Sub-account of: <span className="font-semibold text-zinc-500">{row.parent.name}</span></span>
                            </div>
                        )}
                    </div>
                ),
            },
            {
                header: "Financial Group",
                accessor: (row: AccountHeader) => {
                    const type = row.type?.toUpperCase();
                    let badgeClass = "";

                    switch (type) {
                        case "ASSET":
                            badgeClass = "bg-sky-50 text-sky-700 border-sky-100";
                            break;
                        case "LIABILITY":
                            badgeClass = "bg-rose-50 text-rose-700 border-rose-100";
                            break;
                        case "INCOME":
                        case "REVENUE":
                            badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
                            break;
                        case "EXPENSE":
                            badgeClass = "bg-amber-50 text-amber-700 border-amber-100";
                            break;
                        case "EQUITY":
                            badgeClass = "bg-violet-50 text-violet-700 border-violet-100";
                            break;
                        default:
                            badgeClass = "bg-zinc-50 text-zinc-700 border-zinc-200";
                    }

                    return (
                        <span
                            className={cn(
                                "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border uppercase tracking-widest",
                                badgeClass
                            )}
                        >
                            {type}
                        </span>
                    );
                },
            },
            {
                header: "Opening Balance",
                className: "text-right",
                accessor: (row: AccountHeader) => (
                    <div className="flex flex-col items-end">
                        <div className="text-[14px] font-mono font-black text-zinc-900">
                            ৳ {row.openingBalance?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                ),
            },
            {
                header: "Actions",
                className: "text-right pr-4",
                accessor: (row: AccountHeader) => (
                    <div className="flex justify-end gap-1.5">
                        <Button
                            size="icon"
                            variant="ghost"
                            title="Quick View"
                            className="h-8 w-8 text-slate-400 hover:text-secondary hover:bg-secondary/10 transition-all rounded-lg"
                            onClick={() => onView(row)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            title="Modify Account"
                            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg"
                            onClick={() => onEdit(row)}
                        >
                            <SquarePen className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            title="Archive"
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-lg"
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
            skeletonRows={8}
            pagination={{
                currentPage: page,
                totalPages,
                onPageChange,
            }}
            scrollAreaHeight="h-[calc(100vh-320px)]"
        />
    );
};


export default AccountHeadersTable;
