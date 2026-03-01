"use client";

import React, { useMemo, useState } from "react";
import { Container, PageHeader, DateRangeFilter } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAllQuery, useLazyGetAllQuery } from "@/store/services/commonApi";
import { Skeleton } from "@/components/ui/skeleton";
import { exportTrialBalanceToPdf } from "./trailBalancePdf";

const fmt = (n: number) =>
  n === 0 ? "0.00" : n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

export default function TrialBalancePage() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const [appliedDateRange, setAppliedDateRange] = useState(dateRange);
  const [search, setSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useGetTrialBalanceQuery(appliedDateRange);
  const [triggerGenerateReport] = useLazyGetAllQuery();

  function useGetTrialBalanceQuery({
    start,
    end,
  }: {
    start: string;
    end: string;
  }) {
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
        await exportTrialBalanceToPdf(response.data);
      }
    } catch (error) {
      console.error("Export Error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const reportData = useMemo(() => apiResponse?.data || [], [apiResponse]);

  const filteredData = useMemo(() => {
    if (!search) return reportData;
    const lowerSearch = search.toLowerCase();
    return reportData.filter(
      (item: any) =>
        item.accountName.toLowerCase().includes(lowerSearch) ||
        (item.accountCode &&
          item.accountCode.toLowerCase().includes(lowerSearch)),
    );
  }, [reportData, search]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc: any, curr: any) => ({
        opDr: acc.opDr + curr.openingDebit,
        opCr: acc.opCr + curr.openingCredit,
        perDr: acc.perDr + curr.periodDebit,
        perCr: acc.perCr + curr.periodCredit,
        clDr: acc.clDr + curr.closingDebit,
        clCr: acc.clCr + curr.closingCredit,
      }),
      { opDr: 0, opCr: 0, perDr: 0, perCr: 0, clDr: 0, clCr: 0 },
    );
  }, [filteredData]);

  const columns = useMemo(
    () => [
      {
        header: "ACCOUNT HEAD / CATEGORY",
        className: "w-[30%] min-w-[200px]",
        accessor: (row: any) => (
          <div className="flex flex-col py-0.5">
            <span className="font-semibold text-slate-900 text-[13px]">
              {row.accountName}
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              {row.accountType.replace(/_/g, " ")}{" "}
              {row.accountCode ? `• ${row.accountCode}` : ""}
            </span>
          </div>
        ),
      },
      {
        header: "OP. DEBIT",
        className: "text-right w-[11%] text-[12px]",
        accessor: (row: any) => (
          <span className="font-medium text-slate-500">
            {fmt(row.openingDebit)}
          </span>
        ),
      },
      {
        header: "OP. CREDIT",
        className: "text-right w-[11%] text-[12px]",
        accessor: (row: any) => (
          <span className="font-medium text-slate-500">
            {fmt(row.openingCredit)}
          </span>
        ),
      },
      {
        header: "PER. DEBIT",
        className: "text-right w-[11%] text-[12px]",
        accessor: (row: any) => (
          <span className="font-semibold text-indigo-600">
            {fmt(row.periodDebit)}
          </span>
        ),
      },
      {
        header: "PER. CREDIT",
        className: "text-right w-[11%] text-[12px]",
        accessor: (row: any) => (
          <span className="font-semibold text-rose-600">
            {fmt(row.periodCredit)}
          </span>
        ),
      },
      {
        header: "CL. DEBIT",
        className: "text-right w-[11%] text-[12px]",
        accessor: (row: any) => (
          <span className="font-bold text-slate-900">
            {fmt(row.closingDebit)}
          </span>
        ),
      },
      {
        header: "CL. CREDIT",
        className: "text-right w-[11%] text-[12px]",
        accessor: (row: any) => (
          <span className="font-bold text-slate-900">
            {fmt(row.closingCredit)}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <Container className="pb-10 pt-4 space-y-4">
      <PageHeader
        title="Trial Balance"
        breadcrumbItems={[
          { label: "Accounting", href: "/accounting/overview" },
          { label: "Trial Balance" },
        ]}
        actions={
          <Button
            className="bg-black text-white hover:bg-black/90 shadow-sm h-10 px-6 font-semibold"
            onClick={handleExportPdf}
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export Report"}
          </Button>
        }
      />

      {/* Filter Toolbar Group */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between py-1">
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            <Input
              placeholder="Search by account name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 bg-white border-slate-200 rounded-lg pl-10 shadow-sm focus-visible:ring-slate-200"
            />
          </div>
          <Button
            className="h-11 px-8 bg-black hover:bg-black/90 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all"
            disabled={isFetching || isLoading}
            onClick={handleGenerateReport}
          >
            Search
          </Button>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
          <DateRangeFilter
            start={dateRange.start}
            end={dateRange.end}
            onFilterChange={setDateRange}
            placeholder="Report Dates"
          />
        </div>
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="relative">
            <CustomTable
              data={filteredData}
              columns={columns}
              scrollAreaHeight="h-[calc(100vh-320px)]"
              rowClassName="group hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
            />

            {/* Premium Totals Footer - Sticky */}
            <div className="bg-slate-50 border-t-2 border-slate-200 flex items-stretch h-12 sticky bottom-0 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
              <div className="w-[30%] flex items-center px-6 font-bold text-[10px] uppercase tracking-widest text-slate-500">
                Grand Summary Totals
              </div>
              <div className="w-[11%] flex items-center justify-end pr-4 text-[11px] font-bold text-slate-500">
                {fmt(totals.opDr)}
              </div>
              <div className="w-[11%] flex items-center justify-end pr-4 text-[11px] font-bold text-slate-500">
                {fmt(totals.opCr)}
              </div>
              <div className="w-[11%] flex items-center justify-end pr-4 text-[11px] font-bold text-indigo-700">
                {fmt(totals.perDr)}
              </div>
              <div className="w-[11%] flex items-center justify-end pr-4 text-[11px] font-bold text-rose-700">
                {fmt(totals.perCr)}
              </div>
              <div className="w-[11%] flex items-center justify-end pr-4 text-[11px] font-black text-slate-900">
                {fmt(totals.clDr)}
              </div>
              <div className="w-[11%] flex items-center justify-end pr-4 text-[11px] font-black text-slate-900">
                {fmt(totals.clCr)}
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
