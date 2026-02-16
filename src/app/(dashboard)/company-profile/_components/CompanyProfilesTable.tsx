"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
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
  onAddCompany: () => void;
  onPageChange: (page: number) => void;
  onRowClick: (row: CompanyProfile) => void;
  onDelete: (row: CompanyProfile) => void;
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
  onAddCompany,
  onPageChange,
  onRowClick,
  onDelete,
}: Props) => {
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
        className: "text-sm ",
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
        accessor: (row: CompanyProfile) => (
          <CompanyActions id={row.id} onDelete={() => onDelete(row)} />
        ),
        className: "text-right",
      },
    ],
    [onDelete],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <Input
            placeholder="Search by company name, email, or website"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Button variant="outline" className="shrink-0">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
          <div className="w-full sm:max-w-[180px]">
            <Select value={typeFilter} onValueChange={onTypeFilterChange}>
              <SelectTrigger className="whitespace-nowrap">
                <SelectValue
                  placeholder="Filter by type"
                  className="whitespace-nowrap"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {companyTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:max-w-[180px]">
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="whitespace-nowrap">
                <SelectValue
                  placeholder="Filter by status"
                  className="whitespace-nowrap"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="bg-black text-white hover:bg-black/90"
            onClick={onAddCompany}
          >
            Add Company
          </Button>
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
