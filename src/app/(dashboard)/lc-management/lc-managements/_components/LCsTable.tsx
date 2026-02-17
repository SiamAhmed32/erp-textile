"use client";

import React, { useMemo } from "react";
import { Edit, Eye, FileDown, MoreHorizontal, Trash2 } from "lucide-react";
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
        header: "Invoice No",
        accessor: (row: LCManagement) => (
          <span className="text-xs">{row.invoice?.piNumber || "-"}</span>
        ),
      },
      {
        header: "Actions",
        className: "text-right",
        accessor: (row: LCManagement) => (
          <div className="flex justify-end pr-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(row)}>
                  <Eye className="mr-2 h-4 w-4" /> View Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(row)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit LC
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport(row)}>
                  <FileDown className="mr-2 h-4 w-4" /> Export PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive font-medium"
                  onClick={() => onDelete(row)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
