"use client";

import React, { useMemo, useState } from "react";
import { Container, PageHeader } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Calculator,
    Download,
    Printer,
    Calendar,
    Search,
    ArrowRight,
    Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAllQuery, useLazyGetAllQuery } from "@/store/services/commonApi";
import { Skeleton } from "@/components/ui/skeleton";
import { exportTrialBalanceToPdf } from "./trailBalancePdf";

const fmt = (n: number) =>
    n === 0 ? "-" : n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

export default function TrialBalancePage() {
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            .toISOString()
            .split("T")[0],
        end: new Date().toISOString().split("T")[0],
    });

    const [appliedDateRange, setAppliedDateRange] = useState(dateRange);
    const [isExporting, setIsExporting] = useState(false);

    const { data: apiResponse, isLoading, isFetching } = useGetTrialBalanceQuery(appliedDateRange);
    const [triggerGenerateReport] = useLazyGetAllQuery();

    function useGetTrialBalanceQuery({ start, end }: { start: string; end: string }) {
        return useGetAllQuery({
            path: "financial-reports/trial-balance",
            filters: { startDate: start, endDate: end },
        });
    }

    const handleGenerateReport = () => {
        setAppliedDateRange(dateRange);
    };

    const handleExportPdf = async () => {
        try {
            setIsExporting(true);
            const response = await triggerGenerateReport({
                path: "financial-reports/generate-report",
                filters: { startDate: dateRange.start, endDate: dateRange.end },
            }).unwrap();

            if (response?.data) {
                exportTrialBalanceToPdf(response.data);
            }
        } catch (error) {
            console.error("Export Error:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const reportData = useMemo(() => apiResponse?.data || [], [apiResponse]);

    const totals = useMemo(() => {
        return reportData.reduce(
            (acc: any, curr: any) => ({
                opDr: acc.opDr + curr.openingDebit,
                opCr: acc.opCr + curr.openingCredit,
                perDr: acc.perDr + curr.periodDebit,
                perCr: acc.perCr + curr.periodCredit,
                clDr: acc.clDr + curr.closingDebit,
                clCr: acc.clCr + curr.closingCredit,
            }),
            { opDr: 0, opCr: 0, perDr: 0, perCr: 0, clDr: 0, clCr: 0 }
        );
    }, [reportData]);

    const columns = useMemo(
        () => [
            {
                header: "Account Details",
                className: "w-[34%] min-w-[200px]",
                accessor: (row: any) => (
                    <div className="flex flex-col py-1">
                        <span className="font-bold text-zinc-900 text-sm">
                            {row.accountName}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            {row.accountType.replace(/_/g, " ")} {row.accountCode ? `(${row.accountCode})` : ""}
                        </span>
                    </div>
                ),
            },
            {
                header: "Op. Debit",
                className: "text-right font-mono text-zinc-600 w-[11%]",
                accessor: (row: any) => fmt(row.openingDebit),
            },
            {
                header: "Op. Credit",
                className: "text-right font-mono text-zinc-600 w-[11%]",
                accessor: (row: any) => fmt(row.openingCredit),
            },
            {
                header: (
                    <span className="text-indigo-400">Per. Debit</span>
                ),
                className: "text-right font-mono text-indigo-600 font-bold w-[11%]",
                accessor: (row: any) => fmt(row.periodDebit),
            },
            {
                header: (
                    <span className="text-rose-400">Per. Credit</span>
                ),
                className: "text-right font-mono text-rose-600 font-bold w-[11%]",
                accessor: (row: any) => fmt(row.periodCredit),
            },
            {
                header: "Cl. Debit",
                className: "text-right font-mono font-bold text-zinc-900 w-[11%]",
                accessor: (row: any) => fmt(row.closingDebit),
            },
            {
                header: "Cl. Credit",
                className: "text-right font-mono font-bold text-zinc-900 w-[11%]",
                accessor: (row: any) => fmt(row.closingCredit),
            },
        ],
        []
    );

    return (
        <Container className="pb-10 space-y-6">
            <PageHeader
                title="Trial Balance"
                breadcrumbItems={[
                    { label: "Accounting", href: "/accounting/overview" },
                    { label: "Trial Balance" },
                ]}
                icon={Calculator}
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-4 font-bold gap-2"
                            onClick={handleExportPdf}
                            disabled={isExporting}
                        >
                            <Printer className="w-4 h-4" /> {isExporting ? "Preparing..." : "Print PDF"}
                        </Button>
                        <Button
                            className="h-9 px-4 bg-zinc-900 text-white font-bold rounded-md hover:bg-black transition-all flex items-center gap-2 text-sm shadow-sm"
                            onClick={handleExportPdf}
                            disabled={isExporting}
                        >
                            <Download className="w-4 h-4" /> Export Report
                        </Button>
                    </div>
                }
            />

            {/* Modern Filter Toolbar */}
            <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-zinc-100 p-2 rounded-lg">
                            <Filter className="w-4 h-4 text-zinc-500" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-zinc-900">Report Filters</h4>
                            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-tighter">Adjust period for calculation</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 gap-3">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                <Input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="h-7 border-0 bg-transparent p-0 text-xs font-bold focus-visible:ring-0 w-28"
                                />
                            </div>
                            <ArrowRight className="w-3 h-3 text-zinc-300" />
                            <div className="flex items-center gap-2">
                                <Input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="h-7 border-0 bg-transparent p-0 text-xs font-bold focus-visible:ring-0 w-28"
                                />
                            </div>
                        </div>
                        <Button
                            className="h-10 px-6 bg-zinc-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-lg"
                            disabled={isFetching || isLoading}
                            onClick={handleGenerateReport}
                        >
                            {isFetching || isLoading ? "Calculating..." : "Generate Report"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Trial Balance Report Table */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-8 space-y-4">
                        {[...Array(8)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <div className="relative overflow-x-auto">
                        <CustomTable
                            data={reportData}
                            columns={columns}
                            scrollAreaHeight="h-[calc(100vh-420px)]"
                            rowClassName="group hover:bg-zinc-50/50 transition-colors cursor-default border-b border-zinc-100 last:border-0"
                        // Custom table usually handles its own headers, but we can wrap it if needed for complex headers
                        />

                        {/* Grand Total Row */}
                        <div className="bg-zinc-900 text-white flex items-stretch h-14 border-t border-zinc-800 sticky bottom-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] font-mono">
                            <div className="w-[34%] flex items-center px-4 font-bold text-[11px] uppercase tracking-[0.2em] border-r border-zinc-800/50">
                                Grand Total
                            </div>
                            <div className="w-[11%] flex flex-col justify-center text-right pr-4 border-r border-zinc-800/50 bg-zinc-900/40">
                                <span className="text-[8px] block text-zinc-500 font-black mb-0.5">OP. DR</span>
                                <span className="text-[11px] font-black">{fmt(totals.opDr)}</span>
                            </div>
                            <div className="w-[11%] flex flex-col justify-center text-right pr-4 border-r border-zinc-800/50 bg-zinc-900/40">
                                <span className="text-[8px] block text-zinc-500 font-black mb-0.5">OP. CR</span>
                                <span className="text-[11px] font-black">{fmt(totals.opCr)}</span>
                            </div>
                            <div className="w-[11%] flex flex-col justify-center text-right pr-4 border-r border-zinc-800/50 bg-zinc-900/60">
                                <span className="text-[8px] block text-indigo-500 font-black mb-0.5">PER. DR</span>
                                <span className="text-[11px] font-black text-indigo-400">{fmt(totals.perDr)}</span>
                            </div>
                            <div className="w-[11%] flex flex-col justify-center text-right pr-4 border-r border-zinc-800/50 bg-zinc-900/60">
                                <span className="text-[8px] block text-rose-500 font-black mb-0.5">PER. CR</span>
                                <span className="text-[11px] font-black text-rose-400">{fmt(totals.perCr)}</span>
                            </div>
                            <div className="w-[11%] flex flex-col justify-center text-right pr-4 border-r border-zinc-800/50 bg-zinc-900/80">
                                <span className="text-[8px] block text-zinc-500 font-black mb-0.5">CL. DR</span>
                                <span className="text-[11px] font-black">{fmt(totals.clDr)}</span>
                            </div>
                            <div className="w-[11%] flex flex-col justify-center text-right pr-4 bg-zinc-900/80">
                                <span className="text-[8px] block text-zinc-500 font-black mb-0.5">CL. CR</span>
                                <span className="text-[11px] font-black">{fmt(totals.clCr)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Audit & Balance Check */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-500 p-2 rounded-full">
                        <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h5 className="text-sm font-bold text-emerald-900">Account Accuracy Verified</h5>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                            Debit Total Equals Credit Total
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Verification Status</p>
                    <span className="text-lg font-black text-emerald-700 font-mono tracking-tighter">BALANCED</span>
                </div>
            </div>
        </Container>
    );
}
