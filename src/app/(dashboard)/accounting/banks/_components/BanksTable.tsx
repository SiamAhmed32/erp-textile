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
          <div className="flex items-center gap-3 py-1">
            <div className="size-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 uppercase shrink-0">
              {row.bankName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <div className="font-bold text-slate-900 text-[13px] leading-tight mb-0.5">
                {row.bankName}
              </div>
              <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                {row.branchName || "Main Branch"}
              </div>
            </div>
          </div>
        ),
      },
      {
        header: "Account Details",
        accessor: (row: Bank) => (
          <div className="flex flex-col">
            <span className="font-bold text-slate-700 text-xs tracking-tight">
              {row.accountNumber.replace(/(.{4})/g, "$1 ")}
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
              Primary Account
            </span>
          </div>
        ),
      },
      {
        header: "Routing / SWIFT",
        accessor: (row: Bank) => (
          <div className="flex flex-col gap-0.5">
            {row.swiftCode && (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black text-slate-300 uppercase">
                  SWIFT
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {row.swiftCode}
                </span>
              </div>
            )}
            {row.routingNumber && (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black text-slate-300 uppercase">
                  RTN
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {row.routingNumber}
                </span>
              </div>
            )}
          </div>
        ),
      },
      {
        header: "Balance",
        accessor: (row: Bank) => (
          <div className="flex flex-col">
            <span
              className={cn(
                "font-bold text-[13px] tracking-tight",
                row.balance < 0 ? "text-red-600" : "text-emerald-600",
              )}
            >
              ৳{" "}
              {(row.balance || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
              Current Closing
            </span>
          </div>
        ),
      },
      {
        header: "Status",
        accessor: (row: Bank) => (
          <span
            className={cn(
              "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter",
              row.isDeleted
                ? "bg-slate-100 text-slate-500"
                : "bg-emerald-50 text-emerald-600",
            )}
          >
            {row.isDeleted ? "Archived" : "Active ✓"}
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
              className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onView(row);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
            >
              <SquarePen className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "h-8 w-8 transition-colors rounded-md",
                row.isDeleted
                  ? "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                  : "text-slate-400 hover:text-red-600 hover:bg-red-50",
              )}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete, onView],
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
      rowClassName="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0"
    />
  );
};

export default BanksTable;
