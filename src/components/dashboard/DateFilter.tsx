"use client";

import React, { useState } from "react";
import { format, subDays, startOfWeek, startOfMonth, subMonths, startOfYear, subYears, endOfDay, startOfDay } from "date-fns";
import { ChevronDown, Calendar } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type DateRange = {
    startDate: string;
    endDate: string;
    label: string;
};

interface DateFilterProps {
    onFilterChange: (range: DateRange) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ onFilterChange }) => {
    const [selectedLabel, setSelectedLabel] = useState("This Month");

    const filters = [
        {
            label: "Today", getValue: () => ({
                startDate: format(startOfDay(new Date()), "yyyy-MM-dd"),
                endDate: format(endOfDay(new Date()), "yyyy-MM-dd")
            })
        },
        {
            label: "This Week", getValue: () => ({
                startDate: format(startOfWeek(new Date()), "yyyy-MM-dd"),
                endDate: format(endOfDay(new Date()), "yyyy-MM-dd")
            })
        },
        {
            label: "This Month", getValue: () => ({
                startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
                endDate: format(endOfDay(new Date()), "yyyy-MM-dd")
            })
        },
        {
            label: "Last Month", getValue: () => {
                const lastMonth = subMonths(new Date(), 1);
                return {
                    startDate: format(startOfMonth(lastMonth), "yyyy-MM-dd"),
                    endDate: format(startOfDay(startOfMonth(new Date())), "yyyy-MM-dd")
                };
            }
        },
        {
            label: "This Year", getValue: () => ({
                startDate: format(startOfYear(new Date()), "yyyy-MM-dd"),
                endDate: format(endOfDay(new Date()), "yyyy-MM-dd")
            })
        },
        {
            label: "Last Year", getValue: () => {
                const lastYear = subYears(new Date(), 1);
                return {
                    startDate: format(startOfYear(lastYear), "yyyy-MM-dd"),
                    endDate: format(startOfDay(startOfYear(new Date())), "yyyy-MM-dd")
                };
            }
        },
    ];

    const handleSelect = (filter: typeof filters[0]) => {
        setSelectedLabel(filter.label);
        const range = filter.getValue();
        onFilterChange({ ...range, label: filter.label });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{selectedLabel}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                {filters.map((filter) => (
                    <DropdownMenuItem
                        key={filter.label}
                        onClick={() => handleSelect(filter)}
                        className="cursor-pointer"
                    >
                        {filter.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DateFilter;
