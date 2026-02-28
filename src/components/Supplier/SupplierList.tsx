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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomTable from "@/components/reusables/CustomTable";
import { Supplier } from "./types";
import { cn } from "@/lib/utils";

type Props = {
  suppliers: Supplier[];
  search: string;
  onSearchChange: (value: string) => void;
  sort: { field: string; dir: "asc" | "desc" };
  onSortChange: (sort: { field: string; dir: "asc" | "desc" }) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  onView: (supplier: Supplier) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showDeleted?: boolean;
  onToggleDeleted?: () => void;
  onRestore?: (supplier: Supplier) => void;
};

export function SupplierList({
  suppliers,
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
    { value: "name_asc", label: "Name A → Z", field: "name", dir: "asc" },
    { value: "name_desc", label: "Name Z → A", field: "name", dir: "desc" },
    { value: "email_asc", label: "Email A → Z", field: "email", dir: "asc" },
    { value: "email_desc", label: "Email Z → A", field: "email", dir: "desc" },
    {
      value: "location_asc",
      label: "Location A → Z",
      field: "location",
      dir: "asc",
    },
    {
      value: "location_desc",
      label: "Location Z → A",
      field: "location",
      dir: "desc",
    },
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

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessor: (row: Supplier) => (
          <Link
            href={`/suppliers/${row.id}`}
            className="font-semibold text-foreground hover:underline"
          >
            {row.name}
          </Link>
        ),
      },
      {
        header: "Email",
        accessor: "email" as keyof Supplier,
      },
      {
        header: "Supplier Code",
        accessor: (row: Supplier) => row.supplierCode || "—",
      },
      {
        header: "Phone",
        accessor: "phone" as keyof Supplier,
      },
      {
        header: "Location",
        accessor: "location" as keyof Supplier,
      },
      {
        header: "Opening Liab.",
        accessor: (row: Supplier) =>
          row.openingLiability
            ? `৳ ${row.openingLiability.toLocaleString()}`
            : "—",
      },
      {
        header: "Actions",
        className: "text-left w-40 pr-4",
        accessor: (row: Supplier) => (
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
                  title="Edit Supplier"
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
              placeholder="Search supplier name, email, code..."
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
            title={
              showDeleted ? "Show Active Suppliers" : "Show Deleted Suppliers"
            }
          >
            <Trash2 className="h-4 w-4" />
            {showDeleted ? "Exit Trash" : "Trash"}
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
                <span>
                  {sort.field === "createdAt" && sort.dir === "desc"
                    ? "Sort By"
                    : sortOptions.find(
                        (opt) =>
                          opt.field === sort.field && opt.dir === sort.dir,
                      )?.label}
                </span>
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
        data={suppliers}
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
