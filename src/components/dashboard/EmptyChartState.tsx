import React from "react";
import { Database } from "lucide-react";

interface EmptyChartStateProps {
    message?: string;
    subtext?: string;
}

const EmptyChartState: React.FC<EmptyChartStateProps> = ({
    message = "No data available",
    subtext = "Try adjusting your filters to see more results"
}) => {
    return (
        <div className="flex h-[300px] w-full flex-col items-center justify-center space-y-3 rounded-lg border border-dashed bg-muted/5 transition-colors">
            <div className="rounded-full bg-muted/20 p-4">
                <Database className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">{message}</p>
                <p className="text-xs text-muted-foreground/60">{subtext}</p>
            </div>
        </div>
    );
};

export default EmptyChartState;
