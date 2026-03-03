"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ChevronDown, ArrowUpDown, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrimaryText } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { CompanyProfile } from "./types";
import { companyTypeOptions, statusOptions } from "./constants";
import { formatDate } from "./helpers";
import CompanyAvatar from "./CompanyAvatar";
import CompanyActions from "./CompanyActions";
import { cn } from "@/lib/utils";

type Props = {
  data: CompanyProfile[];
  loading: boolean;
  page: number;
  totalPages: number;
  search: string;
  typeFilter: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  sort: { field: string; dir: "asc" | "desc" };
  onSortChange: (sort: { field: string; dir: "asc" | "desc" }) => void;
  onPageChange: (page: number) => void;
  onRowClick: (row: CompanyProfile) => void;
  onDelete: (row: CompanyProfile) => void;
  showDeleted?: boolean;
  onToggleDeleted?: () => void;
  onRestore?: (row: CompanyProfile) => void;
};

const CompanyProfilesTable = ({
  data,
  loading,
  page,
  totalPages,
  search,
  typeFilter,
  statusFilter,
  onSearchChange,
  onTypeFilterChange,
  onStatusFilterChange,
  sort,
  onSortChange,
  onPageChange,
  onRowClick,
  onDelete,
  showDeleted = false,
  onToggleDeleted = () => {},
  onRestore = () => {},
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
    { value: "name_asc", label: "Title (A-Z)", field: "name", dir: "asc" },
  ];

  const currentSortValue =
    sortOptions.find((opt) => opt.field === sort.field && opt.dir === sort.dir)
      ?.value || "createdAt_desc";

  const columns = useMemo(
    () => [
      {
        header: "Company Name",
        accessor: (row: CompanyProfile) => (
          <div className="flex items-center gap-3">
            <CompanyAvatar name={row.name} logoUrl={row.logoUrl} />
            <div>
              <Link
                href={`/company-profile/${row.id}`}
                className="font-semibold text-foreground"
                onClick={(event) => event.stopPropagation()}
              >
                {row.name || "Unnamed Company"}
              </Link>
            </div>
          </div>
        ),
      },
      {
        header: "Email",
        accessor: (row: CompanyProfile) => row.email || "-",
      },
      {
        header: "Website",
        accessor: (row: CompanyProfile) => row.website || "-",
      },
      {
        header: "Type",
        accessor: (row: CompanyProfile) =>
          companyTypeOptions.find((option) => option.value === row.companyType)
            ?.label ||
          row.companyType ||
          "-",
      },
      {
        header: "Created Date",
        accessor: (row: CompanyProfile) => formatDate(row.createdAt),
      },
      {
        header: "Status",
        accessor: (row: CompanyProfile) => (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              row.status === "active"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {row.status === "active" ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        header: "Actions",
        className: "text-left w-40 pr-4",
        accessor: (row: CompanyProfile) => (
          <CompanyActions
            id={row.id}
            onDelete={() => onDelete(row)}
            showDeleted={showDeleted}
            onRestore={() => onRestore(row)}
          />
        ),
      },
    ],
    [onDelete, onRestore, showDeleted],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* Left: Search Group */}
        <div className="flex w-full gap-2 xl:max-w-md xl:flex-1">
          <div className="relative flex-1">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-11 bg-white border-slate-200 rounded-lg shadow-sm"
            />
          </div>
          <Button className="h-11 px-3 sm:px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg shrink-0">
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
              showDeleted ? "Show Active Companies" : "Show Deleted Companies"
            }
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">
              {showDeleted ? "Exit Trash" : "Trash"}
            </span>
          </Button>
        </div>

        {/* Right: Filters Group */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 xl:justify-end">
          {/* Type Filter */}
          <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-2 sm:px-3 h-11 shadow-sm shrink-0">
            <span className="hidden xs:block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1">
              Type
            </span>
            <Select value={typeFilter} onValueChange={onTypeFilterChange}>
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-[10px] sm:text-xs font-bold uppercase tracking-wider w-full sm:w-[120px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent
                align="end"
                className="rounded-xl shadow-xl border-zinc-200"
              >
                <SelectItem
                  value="all"
                  className="text-xs font-semibold py-2.5"
                >
                  All Types
                </SelectItem>
                {companyTypeOptions.map((opt) => (
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

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-2 sm:px-3 h-11 shadow-sm shrink-0">
            <span className="hidden xs:block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1">
              Status
            </span>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-[10px] sm:text-xs font-bold uppercase tracking-wider w-full sm:w-[110px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent
                align="end"
                className="rounded-xl shadow-xl border-zinc-200"
              >
                <SelectItem
                  value="all"
                  className="text-xs font-semibold py-2.5"
                >
                  All Status
                </SelectItem>
                {statusOptions.map((opt) => (
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

          {/* Sort Filter */}
          <div className="col-span-2 sm:col-auto flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-2 sm:px-3 h-11 shadow-sm shrink-0">
            <ArrowUpDown className="h-4 w-4 text-zinc-400 shrink-0" />
            <span className="hidden xs:block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1">
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
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent
                align="end"
                className="rounded-xl shadow-xl border-zinc-200"
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
          Loading company profiles...
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
        scrollAreaHeight="h-[calc(100vh-300px)]"
      />
    </div>
  );
};

export default React.memo(CompanyProfilesTable);
