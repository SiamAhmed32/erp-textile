"use client";

import React, { useMemo } from "react";
import {
  SquarePen,
  Eye,
  FileDown,
  Trash2,
  RotateCcw,
  ArrowUpDown,
  Search,
} from "lucide-react";
import CustomTable from "@/components/reusables/CustomTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LCManagement } from "./types";
import { DateRangeFilter } from "@/components/reusables";
import { formatDate } from "./utils";
import { cn } from "@/lib/utils";

export type LCsTableProps = {
  data: LCManagement[];
  loading: boolean;
  error: string;
  page: number;
  totalPages: number;
  search: string;
  dateFrom: string;
  dateTo: string;
  expiryDateFrom: string;
  expiryDateTo: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onExpiryDateFromChange: (value: string) => void;
  onExpiryDateToChange: (value: string) => void;
  minAmount: string;
  maxAmount: string;
  onMinAmountChange: (value: string) => void;
  onMaxAmountChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onRowClick: (row: LCManagement) => void;
  onView: (row: LCManagement) => void;
  onEdit: (row: LCManagement) => void;
  onExport: (row: LCManagement) => void;
  onDelete: (row: LCManagement) => void;
  showDeleted?: boolean;
  onToggleDeleted?: () => void;
  onRestore?: (row: LCManagement) => void;
  sort: { field: string; dir: "asc" | "desc" };
  onSortChange: (sort: { field: string; dir: "asc" | "desc" }) => void;
};

const LCsTable: React.FC<LCsTableProps> = ({
  data,
  loading,
  error,
  page,
  totalPages,
  search,
  dateFrom,
  dateTo,
  expiryDateFrom,
  expiryDateTo,
  onSearchChange,
  onSearchSubmit,
  onDateFromChange,
  onDateToChange,
  onExpiryDateFromChange,
  onExpiryDateToChange,
  minAmount,
  maxAmount,
  onMinAmountChange,
  onMaxAmountChange,
  onPageChange,
  onRowClick,
  onView,
  onEdit,
  onExport,
  onDelete,
  showDeleted = false,
  onToggleDeleted = () => {},
  onRestore = () => {},
  sort,
  onSortChange,
}) => {
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
        header: "BBLC Number",
        accessor: (row: LCManagement) => (
          <span className="font-semibold text-foreground underline">
            {row.bblcNumber}
          </span>
        ),
      },
      {
        header: "Issue Bank",
        accessor: (row: LCManagement) => (
          <div>
            <div className="font-medium">{row.lcIssueBankName}</div>
            <div className="text-xs text-muted-foreground">
              {row.lcIssueBankBranch}
            </div>
          </div>
        ),
      },
      {
        header: "Buyer",
        accessor: (row: LCManagement) => (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 uppercase tracking-tight text-[11px]">
              {row.invoice?.order?.buyer?.name || "N/A"}
            </span>
          </div>
        ),
      },
      {
        header: "Amount",
        accessor: (row: LCManagement) => (
          <span className="font-semibold">
            ${Number(row.amount).toLocaleString()}
          </span>
        ),
      },
      {
        header: "Issue Date",
        accessor: (row: LCManagement) => (
          <span>{formatDate(row.issueDate)}</span>
        ),
      },
      {
        header: "Expiry Date",
        accessor: (row: LCManagement) => (
          <span className="font-medium">{formatDate(row.expiryDate)}</span>
        ),
      },
      {
        header: "PI No",
        accessor: (row: LCManagement) => (
          <span className="text-xs">{row.invoice?.piNumber || "-"}</span>
        ),
      },
      {
        header: "Actions",
        className: "text-left w-40 pr-4",
        accessor: (row: LCManagement) => (
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
                  title="Edit LC"
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
                  title="Export PDF"
                  className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExport(row);
                  }}
                >
                  <FileDown className="h-4 w-4" />
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
    [onDelete, onEdit, onExport, onView, onRestore, showDeleted],
  );

  return (
    <div className="space-y-4">
      {/* TOOLBAR PARENT (flex-col gap-3) */}
      <div className="flex flex-col gap-3">
        {/* DESKTOP VIEW (>1024px) */}
        <div className="hidden lg:flex flex-col gap-3">
          {/* Desktop Row 1: Search (Left) & Filters (Right) */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 lg:w-full lg:max-w-md xl:max-w-lg">
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
                className="h-11 bg-white border-slate-200 rounded-lg shadow-sm flex-1 lg:max-w-xs xl:max-w-sm"
              />
              <Button
                onClick={onSearchSubmit}
                className="h-11 px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg shrink-0"
              >
                Search
              </Button>
              <Button
                variant={showDeleted ? "destructive" : "outline"}
                className={cn(
                  "h-11 px-4 gap-2 rounded-lg font-medium shrink-0",
                  !showDeleted && "bg-white border-slate-200 text-slate-500",
                )}
                onClick={onToggleDeleted}
                title={showDeleted ? "Show Active LCs" : "Show Deleted LCs"}
              >
                <Trash2 className="h-4 w-4" />
                <span>{showDeleted ? "Exit" : "Trash"}</span>
              </Button>
            </div>

            {/* Desktop Filters (Right Align) */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-11 shadow-sm shrink-0">
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
                  <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-xs font-bold uppercase tracking-wider w-[130px]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {sortOptions.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="text-xs"
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Large Desktop Filters (>1440px) */}
              <div className="hidden xl:flex items-center gap-3">
                <DateRangeFilter
                  start={dateFrom}
                  end={dateTo}
                  onFilterChange={({ start, end }) => {
                    onDateFromChange(start);
                    onDateToChange(end);
                  }}
                  placeholder="Issue Range"
                  className="h-11 text-xs w-[200px]"
                />
                <DateRangeFilter
                  start={expiryDateFrom}
                  end={expiryDateTo}
                  onFilterChange={({ start, end }) => {
                    onExpiryDateFromChange(start);
                    onExpiryDateToChange(end);
                  }}
                  placeholder="Expiry Range"
                  className="h-11 text-xs w-[200px]"
                />
              </div>
            </div>
          </div>

          {/* Desktop Row 2: For 1024-1440 screens (Issue/Expiry/Amount) */}
          <div className="flex xl:hidden items-center justify-end gap-3">
            <DateRangeFilter
              start={dateFrom}
              end={dateTo}
              onFilterChange={({ start, end }) => {
                onDateFromChange(start);
                onDateToChange(end);
              }}
              placeholder="Issue Range"
              className="h-11 text-xs w-[200px]"
            />
            <DateRangeFilter
              start={expiryDateFrom}
              end={expiryDateTo}
              onFilterChange={({ start, end }) => {
                onExpiryDateFromChange(start);
                onExpiryDateToChange(end);
              }}
              placeholder="Expiry Range"
              className="h-11 text-xs w-[200px]"
            />
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-11 shadow-sm shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest border-r pr-2 mr-1">
                Amount
              </span>
              <Input
                type="number"
                placeholder="Min"
                value={minAmount}
                onChange={(e) => onMinAmountChange(e.target.value)}
                className="border-0 p-0 h-auto w-16 focus-visible:ring-0 text-xs font-bold"
              />
              <span className="text-slate-300">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxAmount}
                onChange={(e) => onMaxAmountChange(e.target.value)}
                className="border-0 p-0 h-auto w-16 focus-visible:ring-0 text-xs font-bold"
              />
            </div>
          </div>

          {/* Desktop Row 2: For >1440 screens (Amount only) */}
          <div className="hidden xl:flex items-center justify-end gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-11 shadow-sm shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest border-r pr-2 mr-1">
                Amount
              </span>
              <Input
                type="number"
                placeholder="Min"
                value={minAmount}
                onChange={(e) => onMinAmountChange(e.target.value)}
                className="border-0 p-0 h-auto w-16 focus-visible:ring-0 text-xs font-bold"
              />
              <span className="text-slate-300">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxAmount}
                onChange={(e) => onMaxAmountChange(e.target.value)}
                className="border-0 p-0 h-auto w-16 focus-visible:ring-0 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* TABLET / MOBILE VIEW (<1024px) */}
        <div className="flex lg:hidden flex-col gap-2">
          {/* Mobile Row 1: Search & Trash */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
              className="h-11 bg-white border-slate-200 rounded-lg shadow-sm flex-1"
            />
            <Button
              onClick={onSearchSubmit}
              className="h-11 px-3 sm:px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg shrink-0"
            >
              <Search className="h-5 w-5 sm:hidden" />
              <span className="hidden sm:inline">Search</span>
            </Button>
            <Button
              variant={showDeleted ? "destructive" : "outline"}
              className={cn(
                "h-11 px-3 sm:px-4 gap-2 rounded-lg font-medium shrink-0",
                !showDeleted && "bg-white border-slate-200 text-slate-500",
              )}
              onClick={onToggleDeleted}
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">
                {showDeleted ? "Exit" : "Trash"}
              </span>
            </Button>
          </div>

          {/* Mobile Row 2: Sort By & Issue Range */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-11 shadow-sm shrink-0 flex-1">
              <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
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
                <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-[10px] sm:text-xs font-bold uppercase tracking-wider w-full">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent align="end">
                  {sortOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DateRangeFilter
              start={dateFrom}
              end={dateTo}
              onFilterChange={({ start, end }) => {
                onDateFromChange(start);
                onDateToChange(end);
              }}
              placeholder="Issue Range"
              className="h-11 text-[10px] sm:text-xs flex-1"
            />
          </div>

          {/* Mobile Row 3: Amount & Expiry Range */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 sm:gap-2 bg-white border border-slate-200 rounded-lg px-2 h-11 shadow-sm flex-1">
              <span className="text-[9px] sm:text-xs font-bold text-slate-500 uppercase tracking-tighter sm:tracking-widest border-r pr-1 sm:pr-2 mr-1 shrink-0">
                Amt
              </span>
              <Input
                type="number"
                placeholder="Min"
                value={minAmount}
                onChange={(e) => onMinAmountChange(e.target.value)}
                className="border-0 p-0 h-auto w-full focus-visible:ring-0 text-[10px] sm:text-xs font-bold"
              />
              <span className="text-slate-300">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxAmount}
                onChange={(e) => onMaxAmountChange(e.target.value)}
                className="border-0 p-0 h-auto w-full focus-visible:ring-0 text-[10px] sm:text-xs font-bold"
              />
            </div>
            <DateRangeFilter
              start={expiryDateFrom}
              end={expiryDateTo}
              onFilterChange={({ start, end }) => {
                onExpiryDateFromChange(start);
                onExpiryDateToChange(end);
              }}
              placeholder="Expiry Range"
              className="h-11 text-[10px] sm:text-xs flex-1"
            />
          </div>
        </div>
      </div>

      <CustomTable
        data={data}
        columns={columns}
        isLoading={loading}
        skeletonRows={10}
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange,
        }}
        onRowClick={onRowClick}
        scrollAreaHeight="h-[67vh]"
      />
    </div>
  );
};

export default React.memo(LCsTable);
