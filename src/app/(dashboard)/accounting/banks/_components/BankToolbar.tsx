"use client";

import React from "react";
import { Search, ChevronDown, ArrowUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      value: "bankName_asc",
      label: "Bank Name A - Z",
      field: "bankName",
      dir: "asc",
    },
    {
      value: "bankName_desc",
      label: "Bank Name Z - A",
      field: "bankName",
      dir: "desc",
    },
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

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-1">
      {/* Left: Search Group */}
      <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search bank name or account no..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="pl-9 h-11 bg-white border-slate-200 rounded-lg shadow-sm"
          />
        </div>
        <Button
          onClick={onSearch}
          className="h-11 px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg"
        >
          Search
        </Button>
      </div>

      {/* Right: Actions Group */}
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-11 px-4 gap-2 bg-white border-slate-200 rounded-lg font-medium",
                sort !== null &&
                  "bg-purple-50 border-purple-200 text-purple-700",
              )}
            >
              <ArrowUpDown className="h-4 w-4 opacity-50" />
              <span>Sort</span>
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
                  sort?.field === opt.field && sort?.dir === opt.dir
                    ? "bg-purple-50 text-purple-700"
                    : "",
                )}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          className="h-11 bg-black text-white hover:bg-black/90 shadow-sm"
          onClick={onAdd}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Bank
        </Button>
      </div>
    </div>
  );
}
