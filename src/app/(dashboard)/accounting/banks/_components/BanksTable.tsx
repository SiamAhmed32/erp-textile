"use client";

import React, { useMemo } from "react";
import CustomTable from "@/components/reusables/CustomTable";
import { Bank } from "./types";
import { SquarePen, Trash2, Eye, ShieldCheck, ShieldAlert } from "lucide-react";
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
                header: "Bank Name",
                accessor: (row: Bank) => (
                    <div className="font-medium text-foreground">{row.bankName}</div>
                ),
            },
            {
                header: "Account Number",
                accessor: (row: Bank) => (
                    <span className="font-mono text-slate-600">{row.accountNumber}</span>
                ),
            },
            {
                header: "Branch",
                accessor: (row: Bank) => (
                    <div className="text-muted-foreground text-sm">{row.branchName || "N/A"}</div>
                ),
            },
            {
                header: "Linked Account",
                accessor: (row: Bank) => {
                    const head = row.accountHead;
                    if (!head) {
                        return (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
                                <ShieldAlert className="h-3 w-3" />
                                Not linked
                            </span>
                        );
                    }
                    return (
                        <div className="text-sm text-foreground max-w-[150px] truncate" title={head.name}>
                            {head.name}
                        </div>
                    );
                },
            },
            {
                header: "Status",
                accessor: (row: Bank) => (
                    <span
                        className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border",
                            row.isDeleted
                                ? "bg-slate-50 text-slate-500 border-slate-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        )}
                    >
                        <div
                            className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                row.isDeleted ? "bg-slate-400" : "bg-emerald-500"
                            )}
                        />
                        {row.isDeleted ? "Archived" : "Active"}
                    </span>
                ),
            },
            {
                header: "Actions",
                className: "text-right pr-4",
                accessor: (row: Bank) => (
                    <div className="flex justify-end gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            title="View Details"
                            className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
                            onClick={() => onView(row)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            title="Edit Bank"
                            className="h-7 w-7 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            onClick={() => onEdit(row)}
                        >
                            <SquarePen className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            title={row.isDeleted ? "Restore" : "Archive"}
                            className={cn(
                                "h-7 w-7 text-slate-500 transition-colors",
                                row.isDeleted
                                    ? "hover:text-emerald-600 hover:bg-emerald-50"
                                    : "hover:text-red-600 hover:bg-red-50"
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
            scrollAreaHeight="h-[calc(100vh-320px)]"
        />
    );
};

export default BanksTable;
