"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Truck, BookOpen, ClipboardList, Landmark, ArrowRight } from "lucide-react";
import { ModuleSummary } from "./types";
import { Flex, Box } from "@/components/reusables";

interface ModuleSummariesProps {
    modules: ModuleSummary[];
}

const iconMap: Record<string, any> = {
    Users,
    Truck,
    BookOpen,
    ClipboardList,
    Landmark,
};

const ModuleSummaries = ({ modules }: ModuleSummariesProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => {
                const Icon = iconMap[module.icon] || BookOpen;
                return (
                    <Link href={module.href} key={index} className="group">
                        <Card className="border-none shadow-sm hover:shadow-md transition-all h-full relative overflow-hidden">
                            <CardContent className="p-6">
                                <Flex className="justify-between items-start mb-4">
                                    <Box className={`p-3 rounded-xl ${module.color}`}>
                                        <Icon className="h-6 w-6 text-secondary" />
                                    </Box>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </Flex>

                                <Box className="mb-6">
                                    <h3 className="text-lg font-bold text-secondary mb-1">{module.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-tight">
                                        {module.description}
                                    </p>
                                </Box>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                    {module.metrics.map((metric, mIndex) => (
                                        <div key={mIndex}>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
                                                {metric.label}
                                            </p>
                                            <p className="text-sm font-bold text-secondary">
                                                {metric.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
};

export default ModuleSummaries;
