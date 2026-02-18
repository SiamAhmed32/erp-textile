"use client";

import React, { useMemo } from 'react';
import { Input } from "@/components/ui/input";
import CustomTable from "@/components/reusables/CustomTable";
import { CustomerLedgerItem } from "./types";
import { cn } from "@/lib/utils";
import PrimaryButton from "@/components/reusables/PrimaryButton";
import { Search } from "lucide-react";

interface CustomerLedgerTableProps {
  data: CustomerLedgerItem[];
  onRowClick: (row: CustomerLedgerItem) => void;
  onSearchChange: (search: string) => void;
  onSearchSubmit: () => void;
  onAddCustomer: () => void;
  search: string;
}

const CustomerLedgerTable = ({
  data,
  onRowClick,
  onSearchChange,
  onSearchSubmit,
  onAddCustomer,
  search
}: CustomerLedgerTableProps) => {

  const columns = useMemo(
    () => [
      {
        header: "Customer",
        accessor: (row: CustomerLedgerItem) => (
          <div>
            <div className="font-semibold text-foreground text-sm uppercase">{row.customerName}</div>
            <div className="text-xs text-muted-foreground font-mono">{row.customerId}</div>
          </div>
        ),
      },
      {
        header: "Due Raised",
        accessor: (row: CustomerLedgerItem) => (
          <div className="font-mono font-medium text-amber-600">
            ৳ {(row.balance + (row.entries * 1000)).toLocaleString()}
          </div>
        ),
      },
      {
        header: "Received",
        accessor: (row: CustomerLedgerItem) => (
          <div className="font-mono font-medium text-emerald-600">
            ৳ {(row.entries * 1000).toLocaleString()}
          </div>
        ),
      },
      {
        header: "Outstanding",
        accessor: (row: CustomerLedgerItem) => (
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
        accessor: (row: CustomerLedgerItem) => {
          const isSettled = row.balance === 0;
          const isOverdue = row.balance > 50000;

          return (
            <div className="flex justify-end">
              <span className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                isSettled ? "bg-slate-100 text-slate-500" :
                  isOverdue ? "bg-red-50 text-red-700" :
                    "bg-amber-50 text-amber-700"
              )}>
                {isSettled ? 'SETTLED' : isOverdue ? 'OVERDUE' : 'OUTSTANDING'}
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
            placeholder="Search customers..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
          <PrimaryButton handleClick={onAddCustomer}>Add Customer</PrimaryButton>
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

export default React.memo(CustomerLedgerTable);
