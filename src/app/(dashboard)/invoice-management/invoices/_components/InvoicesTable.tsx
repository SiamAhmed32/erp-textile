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
import { PrimaryText } from "@/components/reusables";
import { Invoice } from "./types";
import { formatDate, statusBadgeClass } from "./helpers";
import InvoiceActions from "./InvoiceActions";

type Props = {
  data: Invoice[];
  loading: boolean;
  page: number;
  totalPages: number;
  search: string;
  statusFilter: string;
  typeFilter: string;
  dateFrom: string;
  dateTo: string;
  counts: { all: number; FABRIC: number; LABEL_TAG: number; CARTON: number };
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onStatusFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onAddInvoice: () => void;
  onRowClick: (row: Invoice) => void;
  onView: (row: Invoice) => void;
  onEdit: (row: Invoice) => void;
  onExport: (row: Invoice) => void;
  onDelete: (row: Invoice) => void;
};

const InvoicesTable = ({
  data,
  loading,
  page,
  totalPages,
  search,
  statusFilter,
  typeFilter,
  dateFrom,
  dateTo,
  counts,
  onSearchChange,
  onSearchSubmit,
  onStatusFilterChange,
  onTypeFilterChange,
  onDateFromChange,
  onDateToChange,
  onPageChange,
  onAddInvoice,
  onRowClick,
  onView,
  onEdit,
  onExport,
  onDelete,
}: Props) => {
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
        accessor: (row: Invoice) => (
          <InvoiceActions
            onView={() => onView(row)}
            onEdit={() => onEdit(row)}
            onExport={() => onExport(row)}
            onDelete={() => onDelete(row)}
          />
        ),
        className: "text-right",
      },
    ],
    [onDelete, onEdit, onExport, onView],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground">All Invoices</p>
            <p className="text-2xl font-semibold">{counts.all}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground">Labels & Tags</p>
            <p className="text-2xl font-semibold">{counts.LABEL_TAG}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground">Fabric</p>
            <p className="text-2xl font-semibold">{counts.FABRIC}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground">Cartons</p>
            <p className="text-2xl font-semibold">{counts.CARTON}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <Input
            placeholder="Search PI number, order, terms"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Button variant="outline" onClick={onSearchSubmit}>
            Search
          </Button>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
          <div className="w-full sm:max-w-[160px]">
            <Select value={typeFilter} onValueChange={onTypeFilterChange}>
              <SelectTrigger>
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
          <div className="w-full sm:max-w-[160px]">
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger>
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
          <div className="flex w-full gap-2 sm:max-w-[260px]">
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
          <Button
            className="bg-black text-white hover:bg-black/90"
            onClick={onAddInvoice}
          >
            Create PI
          </Button>
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
