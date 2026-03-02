"use client";

import React from "react";
import { Search, ChevronDown, ArrowUpDown, Plus } from "lucide-react";
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
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      {/* ── DESKTOP (≥ xl = 1280px): single row ── */}
      <div className="hidden xl:flex items-center justify-between gap-3 w-full">
        {/* Left: Search */}
        <div className="flex gap-2 max-w-md flex-1">
          <Input
            placeholder="Search banks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="h-11 bg-white border-slate-200 rounded-lg shadow-sm flex-1"
          />
          <Button
            onClick={onSearch}
            className="h-11 px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg shrink-0"
          >
            Search
          </Button>
        </div>

        {/* Right: Sort + Add */}
        <div className="flex items-center gap-2">
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
          <Button
            onClick={onAdd}
            className="h-11 px-4 bg-black text-white hover:bg-black/90 font-bold rounded-lg shrink-0 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Bank
          </Button>
        </div>
      </div>

      {/* ── TABLET & MOBILE (< xl): stacked rows ── */}
      <div className="flex xl:hidden flex-col gap-2 sm:gap-3">
        {/* Row 1: Search + Sort */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1">
            <Input
              placeholder="Search banks..."
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

        {/* Row 2: Add Bank button (full width on mobile) */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onAdd}
            className="h-10 sm:h-11 flex-1 bg-black text-white hover:bg-black/90 font-bold rounded-lg gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Bank
          </Button>
        </div>
      </div>
    </div>
  );
}
