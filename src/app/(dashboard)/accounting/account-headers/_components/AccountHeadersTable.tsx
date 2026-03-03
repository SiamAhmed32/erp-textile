"use client";

import React, { useMemo } from "react";
import CustomTable from "@/components/reusables/CustomTable";
import { AccountHeader } from "./types";
import {
  SquarePen,
  Eye,
  ShieldCheck,
  FolderTree,
  FileCode2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  data: AccountHeader[];
  loading: boolean;
  onEdit: (header: AccountHeader) => void;
  onDelete: (header: AccountHeader) => void;
  onView: (header: AccountHeader) => void;
};

const AccountHeadersTable = ({
  data,
  loading,
  onEdit,
  onDelete,
  onView,
}: Props) => {
  const columns = useMemo(
    () => [
      {
        header: "Ledger Hierarchy",
        accessor: (row: AccountHeader) => {
          const isChild = !!row.parentId;
          return (
            <div
              className={cn(
                "flex items-center py-2 gap-3 relative",
                isChild ? "ml-8" : "ml-0",
              )}
            >
              {/* Visual guide for children */}
              {isChild && (
                <>
                  <div className="absolute left-[-1.5rem] w-px h-[calc(100%+2rem)] bg-zinc-200 -top-4" />
                  <div className="absolute left-[-1.5rem] w-4 h-px bg-zinc-200 top-1/2" />
                </>
              )}

              <div
                className={cn(
                  "size-10 rounded-xl flex items-center justify-center shrink-0 border transition-all",
                  row.isControlAccount
                    ? "bg-zinc-100 border-zinc-200 text-zinc-900 shadow-sm"
                    : "bg-zinc-50 border-zinc-100 text-zinc-400",
                )}
              >
                {row.isControlAccount ? (
                  <FolderTree size={18} />
                ) : (
                  <FileCode2 size={18} />
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-bold tracking-tight text-sm truncate",
                      row.isControlAccount
                        ? "text-zinc-900"
                        : "text-zinc-700 font-semibold",
                    )}
                  >
                    {row.name}
                  </span>
                  {row.isControlAccount && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-[9px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-200/50">
                      <ShieldCheck size={10} />
                      Anchor
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest mt-0.5">
                  {row.isControlAccount ? "Control Header" : "Sub-Ledger Head"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        header: "Financial Group",
        accessor: (row: AccountHeader) => {
          const type = (row.type || "").toUpperCase();
          const config: Record<string, string> = {
            ASSET: "bg-sky-50 text-sky-700 border-sky-100",
            LIABILITY: "bg-rose-50 text-rose-700 border-rose-100",
            INCOME: "bg-emerald-50 text-emerald-700 border-emerald-100",
            REVENUE: "bg-emerald-50 text-emerald-700 border-emerald-100",
            EXPENSE: "bg-amber-50 text-amber-700 border-amber-100",
            EQUITY: "bg-violet-50 text-violet-700 border-violet-100",
          };

          return (
            <div className="flex items-center">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-0.5 text-[10px] font-bold border uppercase tracking-widest",
                  config[type] || "bg-zinc-100 text-zinc-600 border-zinc-200",
                )}
              >
                {type}
              </span>
            </div>
          );
        },
      },
      {
        header: "Utility Actions",
        className: "text-right pr-6",
        accessor: (row: AccountHeader) => (
          <div className="flex justify-end gap-1.5">
            <Button
              size="icon"
              variant="ghost"
              className="size-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all rounded-lg border border-transparent hover:border-zinc-200"
              onClick={() => onView(row)}
            >
              <Eye size={16} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all rounded-lg border border-transparent hover:border-zinc-200"
              onClick={() => onEdit(row)}
            >
              <SquarePen size={16} />
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onView],
  );

  return (
    <CustomTable
      data={data}
      columns={columns}
      isLoading={loading}
      skeletonRows={10}
      scrollAreaHeight="h-[calc(100vh-320px)]"
      rowClassName="group hover:bg-zinc-50/50 transition-all border-b border-zinc-50 last:border-0"
    />
  );
};

export default AccountHeadersTable;
