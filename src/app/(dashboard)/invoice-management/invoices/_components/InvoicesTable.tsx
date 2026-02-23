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
import StatsCard from "@/components/dashboard/StatsCard";
import { FileText, Tag, Layers, Box } from "lucide-react";

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
  counts: { all: number; FABRIC: number; LABEL_TAG: number; CARTON: number };
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
  counts,
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
        className: "text-left w-40 pr-4",
        accessor: (row: Invoice) => (
          <div className="flex items-center justify-end">
            <InvoiceActions
              onView={() => onView(row)}
              onEdit={() => onEdit(row)}
              onDuplicate={() => onDuplicate(row)}
              onExport={() => onExport(row)}
              onDelete={() => onDelete(row)}
            />
          </div>
        ),
      },
    ],
    [onDelete, onEdit, onDuplicate, onExport, onView],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="All Invoices"
          value={counts.all}
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Labels & Tags"
          value={counts.LABEL_TAG}
          icon={Tag}
          color="orange"
        />
        <StatsCard
          title="Fabric"
          value={counts.FABRIC}
          icon={Layers}
          color="purple"
        />
        <StatsCard
          title="Cartons"
          value={counts.CARTON}
          icon={Box}
          color="green"
        />
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
          <DateRangeFilter
            start={startDate}
            end={endDate}
            onFilterChange={({ start, end }) => {
              onStartDateChange(start);
              onEndDateChange(end);
            }}
            placeholder="Invoice Dates"
          />
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
