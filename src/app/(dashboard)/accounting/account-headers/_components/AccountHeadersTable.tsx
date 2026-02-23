"use client";

import React, { useMemo } from "react";
import CustomTable from "@/components/reusables/CustomTable";
import { AccountHeader } from "./types";
import { SquarePen, Trash2, Eye } from "lucide-react";
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
                header: "Code",
                accessor: (row: AccountHeader) => (
                    <span className="font-mono font-semibold">{row.code}</span>
                ),
            },
            {
                header: "Account Name",
                accessor: (row: AccountHeader) => (
                    <div className="font-medium text-foreground">{row.name}</div>
                ),
            },
            {
                header: "Type",
                accessor: (row: AccountHeader) => {
                    const type = row.type?.toUpperCase();
                    let badgeClass = "";

                    switch (type) {
                        case "ASSET":
                            badgeClass = "bg-blue-50 text-blue-700 border-blue-100";
                            break;
                        case "LIABILITY":
                            badgeClass = "bg-purple-50 text-purple-700 border-purple-100";
                            break;
                        case "REVENUE":
                            badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
                            break;
                        case "EXPENSE":
                            badgeClass = "bg-amber-50 text-amber-700 border-amber-100";
                            break;
                        case "EQUITY":
                            badgeClass = "bg-slate-50 text-slate-700 border-slate-100";
                            break;
                        default:
                            badgeClass = "bg-gray-50 text-gray-700 border-gray-100";
                    }

                    return (
                        <span
                            className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                                badgeClass
                            )}
                        >
                            {type}
                        </span>
                    );
                },
            },
            {
                header: "Description",
                accessor: (row: AccountHeader) => (
                    <div className="text-muted-foreground text-xs">
                        {row.description?.substring(0, 30) || "N/A"}
                    </div>
                ),
            },
            {
                header: "Actions",
                className: "text-right pr-4",
                accessor: (row: AccountHeader) => (
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
                            title="Edit Account"
                            className="h-7 w-7 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            onClick={() => onEdit(row)}
                        >
                            <SquarePen className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            title="Delete"
                            className="h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
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
        // <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
        // </div>
    );
};

export default AccountHeadersTable;
