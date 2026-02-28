"use client";

import React, { useMemo } from "react";
import { SquarePen, Eye, FileDown, Trash2, RotateCcw } from "lucide-react";
import CustomTable from "@/components/reusables/CustomTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LCManagement } from "./types";
import { DateRangeFilter } from "@/components/reusables";
import { formatDate } from "./utils";

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
}) => {
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <Input
            placeholder="Search BBLC, Bank, Branch..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 bg-white border-slate-200 rounded-lg shadow-sm"
          />
          <Button
            onClick={onSearchSubmit}
            className="h-11 px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg"
          >
            Search
          </Button>
          <Button
            variant={showDeleted ? "destructive" : "outline"}
            className={`h-11 px-4 gap-2 rounded-lg font-medium ${!showDeleted ? "bg-white border-slate-200 text-slate-500" : ""}`}
            onClick={onToggleDeleted}
            title={showDeleted ? "Show Active LCs" : "Show Deleted LCs"}
          >
            <Trash2 className="h-4 w-4" />
            {showDeleted ? "Exit Trash" : "Trash"}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <DateRangeFilter
            start={dateFrom}
            end={dateTo}
            onFilterChange={({ start, end }) => {
              onDateFromChange(start);
              onDateToChange(end);
            }}
            placeholder="Issue Range"
          />
          <DateRangeFilter
            start={expiryDateFrom}
            end={expiryDateTo}
            onFilterChange={({ start, end }) => {
              onExpiryDateFromChange(start);
              onExpiryDateToChange(end);
            }}
            placeholder="Expiry Range"
          />
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Min Amnt"
              value={minAmount}
              onChange={(e) => onMinAmountChange(e.target.value)}
              className="h-11 w-24 border-slate-200"
            />
            <span className="text-slate-400">-</span>
            <Input
              type="number"
              placeholder="Max Amnt"
              value={maxAmount}
              onChange={(e) => onMaxAmountChange(e.target.value)}
              className="h-11 w-24 border-slate-200"
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
