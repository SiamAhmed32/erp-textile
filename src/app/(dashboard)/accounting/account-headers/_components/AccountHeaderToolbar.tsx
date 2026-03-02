"use client";

import React from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="flex flex-col gap-3 py-2">
      {/* DESKTOP VIEW (>1280px): Search + Type + Sort in one row */}
      <div className="hidden xl:flex items-center justify-between gap-3">
        {/* Left: Search Group */}
        <div className="flex w-full gap-2 max-w-md flex-1">
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
            className="h-11 px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg shrink-0"
          >
            Search
          </Button>
        </div>

        {/* Right: Type Filter + Sort */}
        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <div className="w-[140px]">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-11 bg-white border-slate-200 rounded-lg shadow-sm font-semibold text-xs uppercase tracking-wider">
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
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-11 shadow-sm shrink-0">
            <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1">
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
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-xs font-bold uppercase tracking-wider w-[140px]">
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

      {/* TABLET & MOBILE VIEW (<1280px): Stacked rows */}
      <div className="flex xl:hidden flex-col gap-2 sm:gap-3">
        {/* Row 1: Search + Sort */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Input
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className="h-10 sm:h-11 bg-white border-slate-200 rounded-lg shadow-sm flex-1"
            />
            <Button
              onClick={onSearch}
              className="h-10 sm:h-11 px-3 sm:px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg shrink-0"
            >
              <Search className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline text-xs">Search</span>
            </Button>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 sm:px-3 h-10 sm:h-11 shadow-sm shrink-0">
            <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="hidden sm:block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1">
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
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-[10px] sm:text-xs font-bold uppercase tracking-wider w-[80px] sm:w-[130px]">
                <SelectValue placeholder="Sort" />
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

        {/* Row 2: Type Filter */}
        <div className="flex items-center gap-2">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-10 sm:h-11 text-[10px] sm:text-xs min-w-[120px] flex-1 font-bold bg-white border-slate-200 rounded-lg shadow-sm uppercase tracking-wider">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-xl border-slate-200">
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
      </div>
    </div>
  );
}
