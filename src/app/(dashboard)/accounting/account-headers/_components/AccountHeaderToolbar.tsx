"use client";

import React from "react";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AccountHeaderToolbarProps {
  searchInput: string;
  setSearchInput: (val: string) => void;
  onSearch: () => void;
  type: string;
  setType: (val: string) => void;
  sort: { field: string; dir: "asc" | "desc" };
  setSort: (sort: { field: string; dir: "asc" | "desc" }) => void;
}

export default function AccountHeaderToolbar({
  searchInput,
  setSearchInput,
  onSearch,
  type,
  setType,
  sort,
  setSort,
}: AccountHeaderToolbarProps) {
  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "ASSET", label: "Asset" },
    { value: "LIABILITY", label: "Liability" },
    { value: "REVENUE", label: "Revenue" },
    { value: "EXPENSE", label: "Expense" },
    { value: "EQUITY", label: "Equity" },
  ];

  const sortOptions = [
    { value: "name_asc", label: "Name A → Z", field: "name", dir: "asc" },
    { value: "name_desc", label: "Name Z → A", field: "name", dir: "desc" },
    { value: "code_asc", label: "Code A → Z", field: "code", dir: "asc" },
    { value: "code_desc", label: "Code Z → A", field: "code", dir: "desc" },
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
  ];

  const activeSortLabel = sortOptions.find(
    (opt) => opt.field === sort.field && opt.dir === sort.dir,
  )?.label;

  const isDefaultSort = sort.field === "createdAt" && sort.dir === "desc";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Left: Search Group */}
      <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
        <div className="relative flex-1">
          <Input
            placeholder="Search account name or code..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="h-11 bg-white border-slate-200 rounded-lg shadow-sm"
          />
        </div>
        <Button
          onClick={onSearch}
          className="h-11 px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg"
        >
          Search
        </Button>
      </div>

      {/* Right: Filters Group */}
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        {/* Type Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-11 px-4 gap-2 bg-white border-slate-200 rounded-lg font-semibold text-xs uppercase tracking-wider",
                type !== "all" &&
                  "bg-zinc-100 border-zinc-300 text-zinc-900 hover:bg-zinc-200",
              )}
            >
              <span>{typeOptions.find((t) => t.value === type)?.label}</span>
              <ChevronDown className="h-4 w-4 opacity-50 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-xl shadow-xl border-slate-200/60 p-1"
          >
            {typeOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setType(opt.value)}
                className={cn(
                  "rounded-lg my-0.5 font-semibold text-xs tracking-wide transition-colors",
                  type === opt.value
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-50",
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
                "h-11 px-4 gap-2 bg-white border-slate-200 rounded-lg font-semibold text-xs uppercase tracking-wider",
                !isDefaultSort &&
                  "bg-zinc-100 border-zinc-300 text-zinc-900 hover:bg-zinc-200",
              )}
            >
              <ArrowUpDown className="h-4 w-4 opacity-50 text-slate-400" />
              <span>{isDefaultSort ? "Sort by" : activeSortLabel}</span>
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
                  "rounded-lg my-0.5 font-semibold text-xs tracking-wide transition-colors",
                  sort.field === opt.field && sort.dir === opt.dir
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-50",
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
