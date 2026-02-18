"use client";

import React, { useMemo } from 'react';
import { Input } from "@/components/ui/input";
import CustomTable from "@/components/reusables/CustomTable";
import { SupplierLedgerItem } from "./types";
import { cn } from "@/lib/utils";
import PrimaryButton from "@/components/reusables/PrimaryButton";
import { Search } from "lucide-react";

interface SupplierLedgerTableProps {
    data: SupplierLedgerItem[];
    onRowClick: (row: SupplierLedgerItem) => void;
    onSearchChange: (search: string) => void;
    onSearchSubmit: () => void;
    onAddSupplier: () => void;
    search: string;
}

const SupplierLedgerTable = ({
    data,
    onRowClick,
    onSearchChange,
    onSearchSubmit,
    onAddSupplier,
    search
}: SupplierLedgerTableProps) => {

    const columns = useMemo(
        () => [
            {
                header: "Supplier",
                accessor: (row: SupplierLedgerItem) => (
                    <div>
                        <div className="font-semibold text-foreground text-sm uppercase">{row.supplierName}</div>
                        <div className="text-xs text-muted-foreground font-mono">{row.supplierId}</div>
                    </div>
                ),
            },
            {
                header: "Due Raised",
                accessor: (row: SupplierLedgerItem) => (
                    <div className="font-mono font-medium text-amber-600">
                        ৳ {(row.balance + (row.entries * 1200)).toLocaleString()}
                    </div>
                ),
            },
            {
                header: "Paid",
                accessor: (row: SupplierLedgerItem) => (
                    <div className="font-mono font-medium text-emerald-600">
                        ৳ {(row.entries * 1200).toLocaleString()}
                    </div>
                ),
            },
            {
                header: "Outstanding",
                accessor: (row: SupplierLedgerItem) => (
                    <div className={cn(
                        "font-mono font-bold",
                        row.balance === 0 ? "text-muted-foreground" : "text-destructive"
                    )}>
                        ৳ {row.balance.toLocaleString()}
                    </div>
                ),
            },
            {
                header: "Status",
                className: "text-right",
                accessor: (row: SupplierLedgerItem) => {
                    const isSettled = row.balance === 0;

                    return (
                        <div className="flex justify-end">
                            <span className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                                isSettled ? "bg-slate-100 text-slate-500" :
                                    "bg-red-50 text-red-700"
                            )}>
                                {isSettled ? 'SETTLED' : 'YOU OWE'}
                            </span>
                        </div>
                    )
                },
            },
        ],
        []
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex w-full gap-2 lg:max-w-md lg:flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search suppliers..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
                    <PrimaryButton handleClick={onAddSupplier}>Add Supplier</PrimaryButton>
                </div>
            </div>

            <CustomTable
                data={data}
                columns={columns}
                isLoading={false}
                pagination={{
                    currentPage: 1,
                    totalPages: 1,
                    onPageChange: () => { },
                }}
                onRowClick={onRowClick}
                scrollAreaHeight="h-[calc(100vh-380px)]"
                rowClassName="cursor-pointer hover:bg-muted/50 transition-colors"
            />
        </div>
    );
};

export default React.memo(SupplierLedgerTable);
