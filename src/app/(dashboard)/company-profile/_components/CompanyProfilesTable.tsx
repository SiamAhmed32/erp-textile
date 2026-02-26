"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ChevronDown, ArrowUpDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  onToggleDeleted = () => { },
  onRestore = () => { },
}: Props) => {
  const sortOptions = [
    { label: "Company Name (A-Z)", field: "name", dir: "asc" },
    { label: "Created Date (Newest)", field: "createdAt", dir: "desc" },
    { label: "Created Date (Oldest)", field: "createdAt", dir: "asc" },
  ];

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
              <p className="text-xs text-muted-foreground">
                {row.city || "-"} {row.country ? `, ${row.country}` : ""}
              </p>
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
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${row.status === "active"
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Search Group */}
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <div className="relative flex-1">
            <Input
              placeholder="Search by company name, email, or website"
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
          <Button
            variant={showDeleted ? "destructive" : "outline"}
            className={cn(
              "h-11 px-4 gap-2 rounded-lg font-medium",
              !showDeleted && "bg-white border-slate-200 text-slate-500",
            )}
            onClick={onToggleDeleted}
            title={showDeleted ? "Show Active Companies" : "Show Deleted Companies"}
          >
            <Trash2 className="h-4 w-4" />
            {showDeleted ? "Exit Trash" : "Trash"}
          </Button>
        </div>

        {/* Right: Filters Group */}
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-11 px-4 gap-2 bg-white border-slate-200 rounded-lg font-medium",
                  typeFilter !== "all" &&
                  "bg-blue-50 border-blue-200 text-blue-700",
                )}
              >
                <span>
                  {typeFilter === "all"
                    ? "All Types"
                    : companyTypeOptions.find((o) => o.value === typeFilter)
                      ?.label || typeFilter}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl shadow-xl border-slate-200/60 p-1"
            >
              <DropdownMenuItem
                onClick={() => onTypeFilterChange("all")}
                className={cn(
                  "rounded-lg my-0.5",
                  typeFilter === "all" ? "bg-blue-50 text-blue-700" : "",
                )}
              >
                All Types
              </DropdownMenuItem>
              {companyTypeOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => onTypeFilterChange(opt.value)}
                  className={cn(
                    "rounded-lg my-0.5",
                    typeFilter === opt.value ? "bg-blue-50 text-blue-700" : "",
                  )}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-11 px-4 gap-2 bg-white border-slate-200 rounded-lg font-medium",
                  statusFilter !== "all" &&
                  "bg-amber-50 border-amber-200 text-amber-700",
                )}
              >
                <span>
                  {statusFilter === "all"
                    ? "All Status"
                    : statusOptions.find((o) => o.value === statusFilter)
                      ?.label || statusFilter}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl shadow-xl border-slate-200/60 p-1"
            >
              <DropdownMenuItem
                onClick={() => onStatusFilterChange("all")}
                className={cn(
                  "rounded-lg my-0.5",
                  statusFilter === "all" ? "bg-amber-50 text-amber-700" : "",
                )}
              >
                All Status
              </DropdownMenuItem>
              {statusOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => onStatusFilterChange(opt.value)}
                  className={cn(
                    "rounded-lg my-0.5",
                    statusFilter === opt.value
                      ? "bg-amber-50 text-amber-700"
                      : "",
                  )}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Menu */}
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
                  {sort.field === "name" && sort.dir === "asc"
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
              {[
                { label: "Company Name (A-Z)", field: "name", dir: "asc" },
                {
                  label: "Created Date (Newest)",
                  field: "createdAt",
                  dir: "desc",
                },
                {
                  label: "Created Date (Oldest)",
                  field: "createdAt",
                  dir: "asc",
                },
              ].map((opt, idx) => (
                <DropdownMenuItem
                  key={idx}
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
