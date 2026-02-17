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
  color?: "orange" | "green" | "red" | "blue" | "purple" | "indigo";
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  loading,
  className,
  color = "blue",
}) => {
  const iconBoxVariants = {
    orange: "bg-orange-500",
    green: "bg-emerald-500",
    red: "bg-rose-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    indigo: "bg-indigo-500",
  };

  const borderVariants = {
    orange: "border-orange-100 dark:border-orange-900/20",
    green: "border-emerald-100 dark:border-emerald-900/20",
    red: "border-rose-100 dark:border-rose-900/20",
    blue: "border-blue-100 dark:border-blue-900/20",
    purple: "border-purple-100 dark:border-purple-900/20",
    indigo: "border-indigo-100 dark:border-indigo-900/20",
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden border bg-white dark:bg-slate-900 transition-all duration-300",
        borderVariants[color],
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1 text-left">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {title}
            </p>
            {loading ? (
              <Skeleton className="h-8 w-24 rounded-lg" />
            ) : (
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {value}
              </h3>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500",
              iconBoxVariants[color],
            )}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>

        {!loading && description && (
          <div className="mt-3 flex items-center gap-1.5">
            <div
              className={cn("h-1.5 w-1.5 rounded-full", iconBoxVariants[color])}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-none">
              {description}
            </p>
          </div>
        )}
      </CardContent>

      {/* Decorative gradient background */}
      <div
        className={cn(
          "absolute -right-4 -bottom-4 h-24 w-24 rounded-full opacity-[0.03] blur-3xl",
          iconBoxVariants[color],
        )}
      />
    </Card>
  );
};

export default StatsCard;
