"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface FormSkeletonProps {
  sections?: number;
  rowsPerSection?: number;
}

const FormSkeleton = ({
  sections = 3,
  rowsPerSection = 3,
}: FormSkeletonProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {Array.from({ length: sections }).map((_, sectionIndex) => (
        <Card
          key={sectionIndex}
          className="overflow-hidden border-slate-100 shadow-sm"
        >
          <CardHeader className="border-b border-slate-50 bg-slate-50/30 py-4">
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Logo/Image placeholder for the first section if needed */}
            {sectionIndex === 0 && (
              <div className="flex gap-6 items-center p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 mb-4">
                <Skeleton className="h-24 w-24 rounded-lg shrink-0" />
                <div className="space-y-2 grow">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-9 w-28 rounded-md" />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: rowsPerSection * 2 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>

            {/* Full width TextArea placeholder */}
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FormSkeleton;
