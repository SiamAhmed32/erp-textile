"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onSearch?: () => void;
    className?: string;
    containerClassName?: string;
    showButton?: boolean;
    buttonText?: string;
    inputClassName?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Search...",
    value,
    onChange,
    onSearch,
    className,
    containerClassName,
    showButton = false,
    buttonText = "Search",
    inputClassName,
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && onSearch) {
            onSearch();
        }
    };

    return (
        <div className={cn("flex w-full gap-2 flex-1", containerClassName)}>
            <div className={cn("relative flex-1", className)}>
                <Search className="h-4 w-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3" />
                <Input
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "h-11 bg-white border-slate-200 rounded-lg shadow-sm pl-9",
                        inputClassName
                    )}
                />
            </div>
            {showButton && (
                <Button
                    onClick={onSearch}
                    className="h-11 px-3 sm:px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg shrink-0"
                >
                    <Search className="h-4 w-4 sm:hidden" />
                    <span className="hidden sm:inline text-xs">{buttonText}</span>
                </Button>
            )}
        </div>
    );
};

export default SearchBar;
