"use client";

import React from "react";
import { Search, ChevronDown, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DateRangeFilter } from "@/components/reusables";

interface SupplierToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  sort: { field: string; dir: "asc" | "desc" };
  setSort: (sort: { field: string; dir: "asc" | "desc" }) => void;
}

export default function SupplierToolbar({
  search,
  setSearch,
  status,
  setStatus,
  sort,
  setSort,
}: SupplierToolbarProps) {
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "overdue", label: "Overdue" },
  ];

  const sortOptions = [
    { value: "name_asc", label: "Name A → Z", field: "name", dir: "asc" },
    { value: "name_desc", label: "Name Z → A", field: "name", dir: "desc" },
    // {
    //   value: "liability_asc",
    //   label: "Liability Low-High",
    //   field: "openingLiability",
    //   dir: "asc",
    // },
    // {
    //   value: "liability_desc",
    //   label: "Liability High-Low",
    //   field: "openingLiability",
    //   dir: "desc",
    // },
  ];

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Left: Search Group */}
      <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
        <div className="relative flex-1">
          <Input
            placeholder="Search supplier name, code, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 bg-white border-slate-200 rounded-lg shadow-sm"
          />
        </div>
        <Button className="h-11 px-6 bg-black text-white hover:bg-black/80 font-medium">
          Search
        </Button>
      </div>

      {/* Right: Filters Group */}
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-11 px-4 gap-2 bg-white border-slate-200 rounded-lg font-medium",
                status !== "all" && "bg-blue-50 border-blue-200 text-blue-700",
              )}
            >
              <span>
                {statusOptions.find((s) => s.value === status)?.label}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-xl shadow-xl border-slate-200/60 p-1"
          >
            {statusOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                className={cn(
                  "rounded-lg my-0.5",
                  status === opt.value ? "bg-blue-50 text-blue-700" : "",
                )}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Dropdown */}
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
                    (opt) => opt.field === sort.field && opt.dir === sort.dir,
                  )?.label}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-xl shadow-xl border-slate-200/60 p-1"
          >
            {sortOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() =>
                  setSort({ field: opt.field, dir: opt.dir as "asc" | "desc" })
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
  );
}
