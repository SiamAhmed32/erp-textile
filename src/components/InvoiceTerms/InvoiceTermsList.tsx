"use client";

import React, { useMemo } from "react";
import { Search, Eye, SquarePen, Trash2, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomTable from "@/components/reusables/CustomTable";
import { InvoiceTerms } from "./types";
import { cn } from "@/lib/utils";

type Props = {
  terms: InvoiceTerms[];
  search: string;
  onSearchChange: (value: string) => void;
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
    { value: "name_asc", label: "Name A → Z", field: "name", dir: "asc" },
    { value: "name_desc", label: "Name Z → A", field: "name", dir: "desc" },
    {
      value: "payment_asc",
      label: "Payment A → Z",
      field: "payment",
      dir: "asc",
    },
    {
      value: "payment_desc",
      label: "Payment Z → A",
      field: "payment",
      dir: "desc",
    },
  ];

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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Search Group */}
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <div className="relative flex-1">
            <Input
              placeholder="Search by name, payment, or delivery terms"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-11 bg-white border-slate-200 rounded-lg shadow-sm"
            />
          </div>
          <Button
            variant="outline"
            className="h-11 px-6 bg-white border-slate-200 font-medium"
          >
            Search
          </Button>
        </div>

        {/* Right: Sort Group */}
        <div className="flex items-center gap-2 lg:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-11 px-4 gap-2 bg-white border-slate-200 rounded-lg font-medium",
                  (sort.field !== "name" || sort.dir !== "asc") &&
                    "bg-purple-50 border-purple-200 text-purple-700",
                )}
              >
                <ArrowUpDown className="h-4 w-4 opacity-50" />
                <span>Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl shadow-xl border-slate-200/60 p-1"
            >
              {sortOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() =>
                    onSortChange({
                      field: opt.field,
                      dir: opt.dir as "asc" | "desc",
                    })
                  }
                  className={cn(
                    "rounded-lg my-0.5",
                    sort.field === opt.field && sort.dir === opt.dir
                      ? "bg-purple-50 text-purple-700"
                      : "",
                  )}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
