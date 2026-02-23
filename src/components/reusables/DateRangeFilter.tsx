"use client";

import React, { useState, useEffect } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  start: string;
  end: string;
  onFilterChange: (range: { start: string; end: string }) => void;
  className?: string;
  placeholder?: string;
}

/**
 * DateRangeFilter Component
 *
 * DESIGN PATTERN: Deferred State (Apply Pattern)
 * As a senior developer, we want to ensure that expensive operations (like API re-fetching)
 * only happen when the user has finished their selection.
 * This component uses local state for the inputs and only calls onFilterChange when "Apply" is clicked.
 */
export default function DateRangeFilter({
  start,
  end,
  onFilterChange,
  className,
  placeholder = "Date Range",
}: DateRangeFilterProps) {
  // Local state to hold values before "Apply" is clicked
  const [tempStart, setTempStart] = useState(start);
  const [tempEnd, setTempEnd] = useState(end);
  const [isOpen, setIsOpen] = useState(false);

  // Sync with props if they change externally (e.g. parent clears all)
  useEffect(() => {
    setTempStart(start);
    setTempEnd(end);
  }, [start, end]);

  const hasValue = start || end;

  const handleApply = () => {
    onFilterChange({ start: tempStart, end: tempEnd });
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempStart("");
    setTempEnd("");
    onFilterChange({ start: "", end: "" });
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-10 px-4 gap-2 bg-white border-slate-200 rounded-lg font-medium transition-all hover:bg-slate-50 text-sm shadow-sm shrink-0",
            hasValue &&
              "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100",
            className,
          )}
        >
          <Calendar className="h-4 w-4 opacity-50" />
          <span>
            {start && end
              ? `${start} - ${end}`
              : start
                ? `From ${start}`
                : end
                  ? `Until ${end}`
                  : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 p-5 rounded-2xl shadow-2xl border-slate-200/70 space-y-4"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              From Date
            </p>
            <Input
              type="date"
              value={tempStart}
              onChange={(e) => setTempStart(e.target.value)}
              className="h-10 bg-slate-50 border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
              To Date
            </p>
            <Input
              type="date"
              value={tempEnd}
              onChange={(e) => setTempEnd(e.target.value)}
              className="h-10 bg-slate-50 border-slate-200"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button
            variant="ghost"
            className="flex-1 h-9 rounded-lg text-slate-500 hover:text-slate-900"
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button
            className="flex-1 h-9 rounded-lg bg-black text-white hover:bg-black/90"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
