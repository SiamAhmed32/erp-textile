"use client";

import React from "react";
import { ArrowUpDown, Plus } from "lucide-react";
import { SearchBar } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BankToolbarProps {
  searchInput: string;
  setSearchInput: (val: string) => void;
  onSearch: () => void;
  sort: { field: string; dir: "asc" | "desc" } | null;
  setSort: (sort: { field: string; dir: "asc" | "desc" }) => void;
  onAdd: () => void;
}

export default function BankToolbar({
  searchInput,
  setSearchInput,
  onSearch,
  sort,
  setSort,
  onAdd,
}: BankToolbarProps) {
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
    sortOptions.find(
      (opt) => opt.field === sort?.field && opt.dir === sort?.dir,
    )?.value || "createdAt_desc";

  return (
    <div className="flex flex-col gap-2 sm:gap-3 w-full min-w-0">
      {/* Mobile row 2: Add */}
      <Button
        onClick={onAdd}
        className="h-10 sm:hidden bg-black text-white hover:bg-black/90 font-bold rounded-lg gap-2 px-4 self-start w-auto"
      >
        <Plus className="h-4 w-4" />
        Add Bank
      </Button>

      {/* Mobile row 3 + Tablet/Desktop row: Search + Filter */}
      {/* <div className="flex flex-col sm:flex-row items-center gap-2 xl:gap-3 w-full min-w-0 xl:justify-between"> */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-2 mb-4">
        <SearchBar
          placeholder="Search banks..."
          value={searchInput}
          onChange={setSearchInput}
          onSearch={onSearch}
          containerClassName="flex-1 md:flex-[65] lg:flex-none lg:w-full lg:max-w-md min-w-0"
          inputClassName="h-10 sm:h-11 text-xs sm:text-sm"
        />

        <div className="ml-auto hidden sm:flex items-center gap-1.5 sm:gap-2 bg-white border border-slate-200 rounded-lg px-2 sm:px-3 h-10 sm:h-11 shadow-sm shrink md:flex-[35] lg:flex-none lg:w-auto min-w-0 overflow-hidden">
          <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="hidden lg:block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1">
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
            <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-[10px] sm:text-xs font-bold uppercase tracking-wider w-full min-w-0 overflow-hidden [&>span]:block [&>span]:truncate">
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

      {/* Mobile row 4: Full-width sort */}
      <div className="flex sm:hidden items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 h-10 shadow-sm w-full min-w-0">
        <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
        <Select
          value={currentSortValue}
          onValueChange={(val) => {
            const opt = sortOptions.find((o) => o.value === val);
            if (opt)
              setSort({ field: opt.field, dir: opt.dir as "asc" | "desc" });
          }}
        >
          <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-[10px] font-bold uppercase tracking-wider w-full min-w-0">
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
  );
}
