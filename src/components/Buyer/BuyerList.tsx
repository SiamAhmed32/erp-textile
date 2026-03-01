"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Eye,
  SquarePen,
  Trash2,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomTable from "@/components/reusables/CustomTable";
import { Buyer } from "./types";
import { cn } from "@/lib/utils";

type Props = {
  buyers: Buyer[];
  search: string;
  onSearchChange: (value: string) => void;
  sort: { field: string; dir: "asc" | "desc" };
  onSortChange: (sort: { field: string; dir: "asc" | "desc" }) => void;
  onEdit: (buyer: Buyer) => void;
  onDelete: (buyer: Buyer) => void;
  onView: (buyer: Buyer) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showDeleted?: boolean;
  onToggleDeleted?: () => void;
  onRestore?: (buyer: Buyer) => void;
};

export function BuyerList({
  buyers,
  search,
  onSearchChange,
  sort,
  onSortChange,
  onEdit,
  onDelete,
  onView,
  page,
  totalPages,
  onPageChange,
  showDeleted = false,
  onToggleDeleted = () => {},
  onRestore = () => {},
}: Props) {
  const sortOptions = [
    {
      value: "createdAt_desc",
      label: "Newest First",
      field: "createdAt",
      dir: "desc",
    },
    {
      value: "createdAt_asc",
      label: "Oldest First",
      field: "createdAt",
      dir: "asc",
    },
    {
      value: "updatedAt_desc",
      label: "Recently Updated",
      field: "updatedAt",
      dir: "desc",
    },
  ];

  const currentSortValue =
    sortOptions.find((opt) => opt.field === sort.field && opt.dir === sort.dir)
      ?.value || "createdAt_desc";

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessor: (row: Buyer) => (
          <Link
            href={`/buyers/${row.id}`}
            className="font-semibold text-foreground hover:underline"
          >
            {row.name}
          </Link>
        ),
      },
      {
        header: "Email",
        accessor: "email" as keyof Buyer,
      },
      {
        header: "Merchandiser",
        accessor: "merchandiser" as keyof Buyer,
      },
      {
        header: "Phone",
        accessor: "phone" as keyof Buyer,
      },
      {
        header: "Location",
        accessor: "location" as keyof Buyer,
      },
      {
        header: "Actions",
        className: "text-left w-40 pr-4",
        accessor: (row: Buyer) => (
          <div className="flex justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              title="View Detail"
              className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onView(row);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {!showDeleted && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  title="Edit Buyer"
                  className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
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
                  title="Delete"
                  className="h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(row);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {showDeleted && (
              <Button
                size="icon"
                variant="ghost"
                title="Restore"
                className="h-7 w-7 text-slate-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(row);
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [onView, onEdit, onDelete, onRestore, showDeleted],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Search Group */}
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <div className="relative flex-1">
            <Input
              placeholder="Search buyer name, email, merchandiser..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-11 bg-white border-slate-200 rounded-lg shadow-sm"
            />
          </div>
          <Button className="h-11 px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg">
            Search
          </Button>
          <Button
            variant={showDeleted ? "destructive" : "outline"}
            className={cn(
              "h-11 px-4 gap-2 rounded-lg font-medium",
              !showDeleted && "bg-white border-slate-200 text-slate-500",
            )}
            onClick={onToggleDeleted}
            title={showDeleted ? "Show Active Buyers" : "Show Deleted Buyers"}
          >
            <Trash2 className="h-4 w-4" />
            {showDeleted ? "Exit Trash" : "Trash"}
          </Button>
        </div>

        {/* Right: Sort Group */}
        <div className="flex items-center gap-2 lg:justify-end">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-11 shadow-sm">
            <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1">
              Sort By
            </span>
            <Select
              value={currentSortValue}
              onValueChange={(val) => {
                const opt = sortOptions.find((o) => o.value === val);
                if (opt)
                  onSortChange({
                    field: opt.field,
                    dir: opt.dir as "asc" | "desc",
                  });
              }}
            >
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-xs font-bold uppercase tracking-wider w-[140px]">
                <SelectValue placeholder="Newest First" />
              </SelectTrigger>
              <SelectContent
                align="end"
                className="rounded-xl shadow-xl border-slate-200"
              >
                {sortOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-xs font-semibold py-2.5"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <CustomTable
        data={buyers}
        columns={columns}
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange,
        }}
        scrollAreaHeight="h-[calc(100vh-350px)]"
      />
    </div>
  );
}
