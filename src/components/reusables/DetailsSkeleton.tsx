"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Flex } from "@/components/reusables";

const DetailsSkeleton = () => {
  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Top action bar skeleton */}
      <Flex className="justify-between items-center mb-6 pb-6 border-b border-slate-100">
        <Flex className="gap-4 items-center">
          <Skeleton className="h-9 w-24 rounded-md" /> {/* Back button */}
          <Skeleton className="h-8 w-48" /> {/* Title */}
        </Flex>
        <Flex className="gap-2">
          <Skeleton className="h-9 w-32 rounded-md" /> {/* Export button */}
          <Skeleton className="h-9 w-32 rounded-md" /> {/* Edit button */}
        </Flex>
      </Flex>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main details) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
            <Skeleton className="h-6 w-40 mb-6" /> {/* Section Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
            <Skeleton className="h-6 w-40 mb-6" />
            <Skeleton className="h-32 w-full" />{" "}
            {/* Large text area or table */}
          </div>
        </div>

        {/* Right Column (Sidebar details) */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsSkeleton;
