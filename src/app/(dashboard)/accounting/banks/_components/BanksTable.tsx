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
            <div className="size-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600 uppercase shrink-0">
              {row.bankName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <div className="font-semibold text-zinc-900 text-sm leading-none mb-1">
                {row.bankName}
              </div>
              <div className="text-zinc-500 text-[11px] font-medium">
                {row.branchName || "Main Branch"}
              </div>
            </div>
          </div>
        ),
      },
      {
        header: "Account Logic",
        accessor: (row: Bank) => (
          <div className="flex flex-col">
            <span className=" font-bold text-zinc-700 text-sm tracking-tight">
              {row.accountNumber.replace(/(.{4})/g, "$1 ")}
            </span>
            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
              Primary Account
            </span>
          </div>
        ),
      },
      {
        header: "Routing Data",
        accessor: (row: Bank) => (
          <div className="flex flex-col gap-0.5">
            {row.swiftCode && (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-zinc-400 uppercase">
                  Swift
                </span>
                <span className=" text-[11px] font-semibold text-zinc-600">
                  {row.swiftCode}
                </span>
              </div>
            )}
            {row.routingNumber && (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-zinc-400 uppercase">
                  Rtn
                </span>
                <span className=" text-[11px] font-semibold text-zinc-600">
                  {row.routingNumber}
                </span>
              </div>
            )}
          </div>
        ),
      },
      {
        header: "Current Balance",
        accessor: (row: Bank) => (
          <div className="flex flex-col">
            <span
              className={cn(
                " font-bold text-[14px] tracking-tight",
                row.balance < 0 ? "text-rose-600" : "text-emerald-600",
              )}
            >
              ৳{" "}
              {(row.balance || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
              Closing Balance
            </span>
          </div>
        ),
      },
      {
        header: "Status",
        accessor: (row: Bank) => (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all",
              row.isDeleted
                ? "bg-zinc-100 text-zinc-500"
                : "bg-emerald-50 text-emerald-700",
            )}
          >
            {row.isDeleted ? "Archived" : "Active"}
          </span>
        ),
      },
      {
        header: "Actions",
        className: "text-right pr-6",
        accessor: (row: Bank) => (
          <div className="flex justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-zinc-400 hover:text-zinc-900"
              onClick={() => onView(row)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-zinc-400 hover:text-zinc-900"
              onClick={() => onEdit(row)}
            >
              <SquarePen className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "h-8 w-8 transition-all",
                row.isDeleted
                  ? "text-zinc-400 hover:text-emerald-600"
                  : "text-zinc-400 hover:text-rose-600",
              )}
              onClick={() => onDelete(row)}
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
      scrollAreaHeight="h-[calc(100vh-480px)]"
      rowClassName="group hover:bg-zinc-50/50 transition-colors cursor-default border-zinc-100"
    />
  );
};

export default BanksTable;
