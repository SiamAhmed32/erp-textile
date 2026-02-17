import React from 'react';
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye } from "lucide-react";
import CustomTable from "@/components/reusables/CustomTable";
import { SupplierLedgerItem } from "./types";
import { Box, Flex } from "@/components/reusables";
import { Button } from '@/components/ui/button';
import PrimaryButton from '@/components/reusables/PrimaryButton';

interface SupplierLedgerTableProps {
    data: SupplierLedgerItem[];
    onRowClick: (row: SupplierLedgerItem) => void;
    onSearchChange: (search: string) => void;
    onSearchSubmit: () => void;
    onAddSupplier: () => void;
    search: string;
}

const SupplierLedgerTable = ({ data, onRowClick, onSearchChange, onSearchSubmit, onAddSupplier, search }: SupplierLedgerTableProps) => {
    const columns = [
        {
            header: "SUPPLIER",
            accessor: (row: SupplierLedgerItem) => (
                <Box className="flex flex-col">
                    <span className="font-semibold text-foreground uppercase">{row.supplierName}</span>
                    <span className="text-xs text-muted-foreground">{row.supplierId}</span>
                </Box>
            )
        },
        {
            header: "ADDRESS",
            accessor: (row: SupplierLedgerItem) => <span className="text-xs">{row.address}</span>
        },
        {
            header: "ENTRIES",
            accessor: (row: SupplierLedgerItem) => row.entries,
            className: "text-center"
        },
        {
            header: "BALANCE",
            accessor: (row: SupplierLedgerItem) => (
                <span className={`font-semibold ${row.balance < 0 ? 'text-secondary' : 'text-green-600'}`}>
                    {row.balance < 0 ? `-$${Math.abs(row.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${row.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
            ),
            className: "text-right"
        },
        {
            header: "ACTIONS",
            accessor: (row: SupplierLedgerItem) => (
                <Flex className="justify-end p-1">
                    <Box
                        className="h-8 w-8 flex items-center justify-center rounded-md border text-secondary hover:bg-slate-100 transition-colors cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRowClick(row);
                        }}
                    >
                        <Eye className="h-4 w-4" />
                    </Box>
                </Flex>
            ),
            className: "text-right"
        }
    ];

    return (
        <Box className="space-y-4">
            <Flex className="items-center justify-between">
                <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search suppliers..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    {/* <Button variant="outline" onClick={onSearchSubmit}>
                        Search
                    </Button> */}
                </div>
                <PrimaryButton handleClick={onAddSupplier}>
                    + Add Supplier
                </PrimaryButton>
            </Flex>
            <CustomTable
                data={data}
                columns={columns}
                onRowClick={onRowClick}
                scrollAreaHeight="h-[calc(100vh-450px)]"
                className="bg-white rounded-lg shadow-sm border-none overflow-hidden"
            />
        </Box>
    );
};

export default React.memo(SupplierLedgerTable);
