"use client";

import React, { useMemo } from 'react';
import CustomTable from "@/components/reusables/CustomTable";
import { Transaction } from "./types";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

interface RecentTransactionsProps {
    transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {

    const columns = useMemo(
        () => [
            {
                header: "Ref #",
                accessor: (row: Transaction) => (
                    <div className="font-mono text-xs text-muted-foreground">
                        JE-2026-00{row.id}
                    </div>
                ),
            },
            {
                header: "Type",
                accessor: (row: Transaction) => (
                    <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium uppercase",
                        row.type === 'income' ? "bg-emerald-50 text-emerald-700" :
                            row.type === 'expense' ? "bg-red-50 text-red-700" :
                                "bg-indigo-50 text-indigo-700"
                    )}>
                        {row.type === 'income' ? 'Receipt' : row.type === 'expense' ? 'Payment' : 'Journal'}
                    </span>
                ),
            },
            {
                header: "Party",
                accessor: (row: Transaction) => (
                    <div>
                        <div className="font-semibold text-foreground text-sm uppercase">{row.category}</div>
                        <div className="text-xs text-muted-foreground uppercase">General Ledger</div>
                    </div>
                ),
            },
            {
                header: "Narration",
                accessor: (row: Transaction) => (
                    <div className="text-sm text-foreground max-w-[300px] truncate" title={row.description}>
                        {row.description}
                    </div>
                ),
            },
            {
                header: "Amount",
                accessor: (row: Transaction) => (
                    <div className={cn(
                        "font-mono font-bold",
                        row.amount > 0 ? "text-emerald-600" : "text-red-600"
                    )}>
                        ৳ {Math.abs(row.amount).toLocaleString()}
                    </div>
                ),
            },
            {
                header: "Action",
                className: "text-right",
                accessor: (row: Transaction) => (
                    <div className="flex justify-end">
                        <button className="p-1 rounded-md hover:bg-muted transition-colors">
                            <MoreHorizontal className="size-4 text-muted-foreground" />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <CustomTable
            data={transactions}
            columns={columns}
            isLoading={false}
            pagination={{
                currentPage: 1,
                totalPages: 1,
                onPageChange: () => { },
            }}
            // Simple list, no sorting/filtering needed for "Recent" widget usually, or add if needed
            scrollAreaHeight="h-auto"
            rowClassName="cursor-pointer hover:bg-muted/50 transition-colors"
        />
    );
};

export default React.memo(RecentTransactions);
