"use client";

import React, { useMemo } from 'react';
import CustomTable from "@/components/reusables/CustomTable";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Loader2 } from "lucide-react";

interface RecentTransactionsProps {
    transactions: any[];
    isLoading?: boolean;
}

const RecentTransactions = ({ transactions, isLoading }: RecentTransactionsProps) => {

    const columns = useMemo(
        () => [
            {
                header: "Ref #",
                accessor: (row: any) => (
                    <div className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                        {row.voucherNo}
                    </div>
                ),
            },
            {
                header: "Category",
                accessor: (row: any) => (
                    <span className={cn(
                        "inline-flex items-center rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                        row.category === 'RECEIPT' ? "bg-emerald-50 text-emerald-700" :
                            row.category === 'PAYMENT' ? "bg-rose-50 text-rose-700" :
                                "bg-zinc-100 text-zinc-600"
                    )}>
                        {row.category.replace('_', ' ')}
                    </span>
                ),
            },
            {
                header: "Entity",
                accessor: (row: any) => (
                    <div>
                        <div className="font-bold text-zinc-900 text-xs truncate max-w-[120px]">
                            {row.buyer?.name || row.supplier?.name || "General Ledger"}
                        </div>
                    </div>
                ),
            },
            {
                header: "Narration",
                accessor: (row: any) => (
                    <div className="text-[11px] text-zinc-500 max-w-[200px] truncate font-medium" title={row.narration}>
                        {row.narration || "—"}
                    </div>
                ),
            },
            {
                header: "Amount",
                className: "text-right",
                accessor: (row: any) => {
                    // Sum debits for amount
                    const amount = (row.lines || [])
                        .filter((l: any) => l.type === 'DEBIT')
                        .reduce((sum: number, l: any) => sum + Number(l.amount), 0);

                    return (
                        <div className={cn(
                            "font-mono font-black text-xs text-right",
                            row.category === 'RECEIPT' ? "text-emerald-600" :
                                row.category === 'PAYMENT' ? "text-rose-600" : "text-zinc-900"
                        )}>
                            ৳ {amount.toLocaleString()}
                        </div>
                    );
                },
            },
            {
                header: "",
                className: "text-right",
                accessor: (row: any) => (
                    <div className="flex justify-end">
                        <button className="p-1 rounded-md hover:bg-zinc-100 transition-colors">
                            <MoreHorizontal className="size-4 text-zinc-400" />
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
            isLoading={isLoading}
            skeletonRows={5}
            // Simple list, no pagination for home widget
            scrollAreaHeight="h-auto"
            rowClassName="cursor-pointer hover:bg-zinc-50/50 transition-colors border-b border-zinc-100 last:border-0"
        />
    );
};

export default React.memo(RecentTransactions);
