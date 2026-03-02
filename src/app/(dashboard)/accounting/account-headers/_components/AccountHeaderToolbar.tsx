"use client";

import React from "react";
import { ChevronDown, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between py-2">
      {/* Left: Search Group */}
      <div className="flex w-full gap-2 lg:max-w-sm lg:flex-1">
        <div className="relative flex-1">
          <Input
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="h-11 bg-white border-slate-200 rounded-lg shadow-sm"
          />
        </div>
        <Button
          onClick={onSearch}
          className="h-11 px-3 sm:px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg shrink-0"
        >
          <Search className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>

      {/* Right: Filters Group */}
      <div className="grid grid-cols-2 lg:flex lg:flex-wrap items-center gap-2 lg:justify-end">
        {/* Type Filter */}
        <div className="w-full">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-11 bg-white border-slate-200 rounded-lg shadow-sm font-semibold text-[10px] sm:text-xs uppercase tracking-wider">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent
              align="end"
              className="rounded-xl shadow-xl border-slate-200"
            >
              {typeOptions.map((opt) => (
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

        {/* Sort Group */}
        <div className="col-span-2 sm:col-auto flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 sm:px-3 h-11 shadow-sm">
          <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="hidden xs:block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1">
            Sort By
          </span>
          <Select
            value={currentSortValue}
            onValueChange={(val) => {
              const opt = sortOptions.find((o) => o.value === val);
              if (opt)
                setSort({ field: opt.field, dir: opt.dir as "asc" | "desc" });
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
  );
}
