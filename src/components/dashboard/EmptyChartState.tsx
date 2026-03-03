import React from "react";
import { Database } from "lucide-react";

interface EmptyChartStateProps {
  message?: string;
  subtext?: string;
}

const EmptyChartState: React.FC<EmptyChartStateProps> = ({
  message = "No data available",
  subtext = "Try adjusting your filters to see more results",
}) => {
  return (
    <div className="flex h-[280px] w-full flex-col items-center justify-center space-y-2 transition-colors">
      <div className="text-center group">
        <p className="text-sm font-bold text-slate-400 dark:text-slate-600 tracking-tight">
          {message}
        </p>
        <p className="text-[10px] font-medium text-slate-400/60 dark:text-slate-600/60">
          {subtext}
        </p>
      </div>
    </div>
  );
};

export default EmptyChartState;
