"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InPageLoaderProps {
  message?: string;
  className?: string;
}

const InPageLoader = ({
  message = "Loading data...",
  className,
}: InPageLoaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 w-full animate-in fade-in duration-700 bg-slate-50/30 rounded-2xl border border-dashed border-slate-200/60",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 h-8">
        {/* Modern minimal pulsing bars */}
        <div className="w-1 h-6 bg-primary/40 animate-pulse" />
        <div className="w-1 h-8 bg-primary animate-pulse [animation-delay:0.2s]" />
        <div className="w-1 h-6 bg-primary/40 animate-pulse [animation-delay:0.4s]" />
      </div>

      <div className="mt-6 flex flex-col items-center gap-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.25em] animate-pulse">
          {message}
        </p>
        <div className="h-0.5 w-12 bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-primary/40 animate-loading-bar"
            style={{ width: "40%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default InPageLoader;
