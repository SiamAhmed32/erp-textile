import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  loading?: boolean;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  loading,
  className,
}) => {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border border-indigo-100 dark:border-indigo-900/30 shadow-sm bg-white dark:bg-slate-900 rounded-xl",
        className,
      )}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-button" />

      <CardContent className="pl-6 pr-4 py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Text */}
          <div className="space-y-1.5 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 truncate">
              {title}
            </p>
            {loading ? (
              <Skeleton className="h-8 w-24 rounded-lg" />
            ) : (
              <p className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
                {value}
              </p>
            )}
            {!loading && description && (
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                {description}
              </p>
            )}
          </div>

          {/* Icon box — primary tint */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-button">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
