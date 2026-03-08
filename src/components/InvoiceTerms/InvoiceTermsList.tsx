"use client";

import React, { useMemo } from "react";
import { Eye, SquarePen, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomTable from "@/components/reusables/CustomTable";
import { InvoiceTerms } from "./types";
import { cn } from "@/lib/utils";
import { SearchBar } from "../reusables";

type Props = {
  terms: InvoiceTerms[];
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  sort: { field: string; dir: "asc" | "desc" };
  onSortChange: (sort: { field: string; dir: "asc" | "desc" }) => void;
  onCreate: () => void;
  onEdit: (terms: InvoiceTerms) => void;
  onDelete: (terms: InvoiceTerms) => void;
  onView: (terms: InvoiceTerms) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
};

export function InvoiceTermsList({
  terms,
  search,
  onSearchChange,
  onSearchSubmit,
  sort,
  onSortChange,
  onCreate,
  onEdit,
  onDelete,
  onView,
  page,
  totalPages,
  onPageChange,
  loading = false,
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

  const currentSortValue = useMemo(() => {
    return sortOptions.find((opt) => opt.field === sort.field && opt.dir === sort.dir)
      ?.value || "createdAt_desc";
  }, [sort, sortOptions]);

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessor: (row: InvoiceTerms) => (
          <span className="font-semibold text-foreground">{row.name}</span>
        ),
      },
      {
        header: "Payment",
        accessor: "payment" as keyof InvoiceTerms,
      },
      {
        header: "Delivery",
        accessor: "delivery" as keyof InvoiceTerms,
      },
      {
        header: "Origin",
        accessor: "origin" as keyof InvoiceTerms,
      },
      {
        header: "SWIFT",
        accessor: "swiftCode" as keyof InvoiceTerms,
      },
      {
        header: "Actions",
        className: "text-left w-40 pr-4",
        accessor: (row: InvoiceTerms) => (
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
            <Button
              size="icon"
              variant="ghost"
              title="Edit Terms"
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
          </div>
        ),
      },
    ],
    [onView, onEdit, onDelete],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          placeholder="Search..."
          value={search}
          onChange={onSearchChange}
          onSearch={onSearchSubmit}
          inputClassName="h-10 sm:h-11"
        />

        {/* Right: Sort Group */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 xl:justify-end">
          <div className="col-span-2 sm:col-auto flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 sm:px-3 h-11 shadow-sm">
            <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="hidden xs:block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1">
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
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-[10px] sm:text-xs font-bold uppercase tracking-wider w-full sm:w-[140px]">
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
        data={terms}
        columns={columns}
        isLoading={loading}
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange,
        }}
        scrollAreaHeight="h-[calc(100vh-320px)]"
      />
    </div>
  );
}
