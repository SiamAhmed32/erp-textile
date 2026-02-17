import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-20" />
                ) : (
                    <>
                        <div className="text-2xl font-bold">{value}</div>
                        {description && (
                            <p className="text-xs text-muted-foreground">{description}</p>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default StatsCard;
