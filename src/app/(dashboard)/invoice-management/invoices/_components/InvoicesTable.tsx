"use client";

import React, { useMemo } from "react";
import CustomTable from "@/components/reusables/CustomTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrimaryText, DateRangeFilter } from "@/components/reusables";
import { Invoice } from "./types";
import { formatDate, statusBadgeClass } from "./helpers";
import InvoiceActions from "./InvoiceActions";
import { Trash2, ArrowUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  data: Invoice[];
  loading: boolean;
  page: number;
  totalPages: number;
  search: string;
  statusFilter: string;
  typeFilter: string;
  startDate: string;
  endDate: string;

  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onStatusFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onRowClick: (row: Invoice) => void;
  onView: (row: Invoice) => void;
  onEdit: (row: Invoice) => void;
  onDuplicate: (row: Invoice) => void;
  onExport: (row: Invoice) => void;
  onDelete: (row: Invoice) => void;
  showDeleted: boolean;
  onToggleDeleted: () => void;
  onRestore: (row: Invoice) => void;
  sort: { field: string; dir: "asc" | "desc" };
  onSortChange: (sort: { field: string; dir: "asc" | "desc" }) => void;
};

const InvoicesTable = ({
  data,
  loading,
  page,
  totalPages,
  search,
  statusFilter,
  typeFilter,
  startDate,
  endDate,

  onSearchChange,
  onSearchSubmit,
  onStatusFilterChange,
  onTypeFilterChange,
  onStartDateChange,
  onEndDateChange,
  onPageChange,
  onRowClick,
  onView,
  onEdit,
  onDuplicate,
  onExport,
  onDelete,
  showDeleted = false,
  onToggleDeleted = () => {},
  onRestore = () => {},
  sort,
  onSortChange,
}: Props) => {
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
        header: "PI No",
        accessor: (row: Invoice) => (
          <div className="font-semibold text-foreground">{row.piNumber}</div>
        ),
      },
      {
        header: "Type",
        accessor: (row: Invoice) => row.order?.productType || "-",
      },
      {
        header: "Order No",
        accessor: (row: Invoice) => row.order?.orderNumber || row.orderId,
      },
      {
        header: "Date",
        accessor: (row: Invoice) => formatDate(row.date),
      },
      {
        header: "Status",
        accessor: (row: Invoice) => (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(
              row.status,
            )}`}
          >
            {row.status}
          </span>
        ),
      },

      {
        header: "Terms",
        accessor: (row: Invoice) => row.invoiceTerms?.name || "-",
      },
      {
        header: "Created By",
        accessor: (row: Invoice) =>
          row.user?.displayName || row.user?.email || "-",
      },
      {
        header: "Actions",
        className: "text-left w-40 pr-4",
        accessor: (row: Invoice) => (
          <div className="flex items-center justify-end">
            <InvoiceActions
              onView={() => onView(row)}
              onEdit={() => onEdit(row)}
              onDuplicate={() => onDuplicate(row)}
              onExport={() => onExport(row)}
              onDelete={() => onDelete(row)}
              showDeleted={showDeleted}
              onRestore={() => onRestore(row)}
            />
          </div>
        ),
      },
    ],
    [onDelete, onEdit, onDuplicate, onExport, onView, onRestore, showDeleted],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex w-full gap-2 xl:max-w-md xl:flex-1">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 bg-white border-slate-200 rounded-lg shadow-sm"
          />
          <Button
            className="h-11 px-3 sm:px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg shrink-0"
            onClick={onSearchSubmit}
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
            title={
              showDeleted ? "Show Active Invoices" : "Show Deleted Invoices"
            }
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">
              {showDeleted ? "Exit Trash" : "Trash"}
            </span>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 xl:w-auto xl:shrink-0">
          <div className="w-full">
            <Select value={typeFilter} onValueChange={onTypeFilterChange}>
              <SelectTrigger className="h-11 text-[10px] sm:text-xs">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {["LABEL_TAG", "FABRIC", "CARTON"].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="h-11 text-[10px] sm:text-xs">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {["DRAFT", "SENT", "APPROVED", "CANCELLED"].map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full col-span-2 sm:col-auto">
            <DateRangeFilter
              start={startDate}
              end={endDate}
              onFilterChange={({ start, end }) => {
                onStartDateChange(start);
                onEndDateChange(end);
              }}
              placeholder="Invoice Dates"
              className="h-11 text-[10px] sm:text-xs w-full"
            />
          </div>

          {/* Sort Group */}
          <div className="col-span-2 sm:col-auto flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 sm:px-3 h-11 shadow-sm shrink-0">
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

      {loading && (
        <PrimaryText className="text-sm text-muted-foreground">
          Loading invoices...
        </PrimaryText>
      )}

      <CustomTable
        data={data}
        columns={columns}
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange,
        }}
        onRowClick={onRowClick}
        rowClassName="cursor-pointer"
        scrollAreaHeight="h-[calc(100vh-320px)]"
      />
    </div>
  );
};

export default React.memo(InvoicesTable);
