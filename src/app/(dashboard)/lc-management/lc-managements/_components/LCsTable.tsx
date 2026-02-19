"use client";

import React, { useMemo } from "react";
import { SquarePen, Eye, FileDown, Trash2 } from "lucide-react";
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
import PrimaryButton from "@/components/reusables/PrimaryButton";

type Props = {
  data: LCManagement[];
  loading: boolean;
  error: string;
  page: number;
  totalPages: number;
  search: string;
  dateFrom: string;
  dateTo: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onAddLC: () => void;
  onRowClick: (row: LCManagement) => void;
  onView: (row: LCManagement) => void;
  onEdit: (row: LCManagement) => void;
  onExport: (row: LCManagement) => void;
  onDelete: (row: LCManagement) => void;
};

const LCsTable = ({
  data,
  loading,
  error,
  page,
  totalPages,
  search,
  dateFrom,
  dateTo,
  onSearchChange,
  onSearchSubmit,
  onDateFromChange,
  onDateToChange,
  onPageChange,
  onAddLC,
  onRowClick,
  onView,
  onEdit,
  onExport,
  onDelete,
}: Props) => {
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
          <span>{new Date(row.issueDate).toLocaleDateString()}</span>
        ),
      },
      {
        header: "Expiry Date",
        accessor: (row: LCManagement) => (
          <span>{new Date(row.expiryDate).toLocaleDateString()}</span>
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
          </div>
        ),
      },
    ],
    [onDelete, onEdit, onExport, onView],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <Input
            placeholder="Search BBLC, Bank, Branch..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Button variant="outline" onClick={onSearchSubmit}>
            Search
          </Button>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
          <div className="flex w-full gap-2 sm:max-w-[280px]">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
            />
          </div>
          <PrimaryButton handleClick={onAddLC}>Create BBLC</PrimaryButton>
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
