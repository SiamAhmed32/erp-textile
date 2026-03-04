"use client";

import { Container, PageHeader, DateRangeFilter } from "@/components/reusables";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllQuery, useLazyGetAllQuery } from "@/store/services/commonApi";
import { CalendarDays, FileDown } from "lucide-react";
import { useMemo, useState } from "react";
import { exportTrialBalanceToPdf } from "./trailBalancePdf";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  n === 0 ? "0.00" : n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

export default function TrialBalancePage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useGetAllQuery(
    {
      path: "financial-reports/trial-balance",
      filters: { startDate, endDate },
    },
    { skip: !startDate || !endDate },
  );
  const [triggerGenerateReport] = useLazyGetAllQuery();

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      const response = await triggerGenerateReport({
        path: "financial-reports/generate-report",
        filters: { startDate, endDate },
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
        className: "min-w-[220px] px-6",
        accessor: (row: any) => (
          <div className="flex flex-col py-0.5">
            <span className="font-semibold text-slate-900 text-[13px]">
              {row.accountName}
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              {row.accountCode ? `CODE: ${row.accountCode}` : ""}
            </span>
          </div>
        ),
      },
      {
        header: "TYPE",
        className: "w-[120px] text-center border-l border-slate-200",
        accessor: (row: any) => (
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {row.accountType.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        header: "OP. DEBIT",
        className: "text-right w-[100px] text-[12px] border-l border-slate-200",
        accessor: (row: any) => (
          <span className="font-medium text-slate-700">
            {fmt(row.openingDebit)}
          </span>
        ),
      },
      {
        header: "OP. CREDIT",
        className: "text-right w-[100px] text-[12px]",
        accessor: (row: any) => (
          <span className="font-medium text-slate-700">
            {fmt(row.openingCredit)}
          </span>
        ),
      },
      {
        header: "PER. DEBIT",
        className: "text-right w-[100px] text-[12px] border-l border-slate-200",
        accessor: (row: any) => (
          <span className="font-semibold text-slate-900">
            {fmt(row.periodDebit)}
          </span>
        ),
      },
      {
        header: "PER. CREDIT",
        className: "text-right w-[100px] text-[12px]",
        accessor: (row: any) => (
          <span className="font-semibold text-slate-900">
            {fmt(row.periodCredit)}
          </span>
        ),
      },
      {
        header: "CL. DEBIT",
        className: "text-right w-[100px] text-[12px] border-l border-slate-200",
        accessor: (row: any) => (
          <span className="font-bold text-slate-900">
            {fmt(row.closingDebit)}
          </span>
        ),
      },
      {
        header: "CL. CREDIT",
        className: "text-right w-[100px] text-[12px]",
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
            variant="outline"
            onClick={handleExportPdf}
            disabled={isExporting || !startDate || !endDate}
            className="flex items-center gap-2 bg-black h-11 px-4 rounded-lg border-slate-200  text-white font-semibold text-xs uppercase tracking-wider shadow-sm hover:bg-black/80 hover:text-white disabled:opacity-50"
          >
            <FileDown className="size-3.5 " />
            <span>{isExporting ? "Exporting..." : "Export Report"}</span>
          </Button>
        }
      />

      <div
        className="flex flex-col lg:flex-row lg:justify-end gap-4 p-4 sm:p-6 mb-6 rounded-xl"
        style={{ backgroundColor: "#F9FCFC" }}
      >
        <div className="flex flex-col gap-1.5 min-w-[200px] sm:min-w-[300px]">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] px-1">
            Report Period
          </span>
          <DateRangeFilter
            start={startDate}
            end={endDate}
            onFilterChange={({ start, end }) => {
              setStartDate(start);
              setEndDate(end);
            }}
            placeholder="Select Range"
            className="h-11 shadow-sm border-slate-200 text-xs sm:text-sm"
          />
        </div>
      </div>

      <div className="min-h-[400px]">
        {!startDate || !endDate ? (
          <div className="mt-10 py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <CalendarDays className="size-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Ready to generate report
            </h3>
            <p className="text-slate-500 max-w-sm mb-8">
              Please select a date range from the toolbar above to fetch the
              trial balance for that period.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
                <div className="size-1.5 rounded-full bg-slate-300" />
                Real-time Sync
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
                <div className="size-1.5 rounded-full bg-slate-300" />
                PDF Export Ready
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="relative animate-in fade-in duration-500 border rounded-xl overflow-hidden shadow-sm bg-white">
            <div className="overflow-auto h-[calc(100vh-320px)] border-separate border-spacing-0">
              <Table className="w-full border-separate border-spacing-0">
                <TableHeader className="sticky top-0 z-30">
                  {/* Grouped Header (PDF Style) */}
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead
                      rowSpan={2}
                      className="bg-zinc-900 text-white font-bold text-[11px] uppercase tracking-widest px-6 h-12 border-r border-zinc-800"
                    >
                      Account Head / Category
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className="bg-zinc-900 text-white font-bold text-[11px] uppercase tracking-widest text-center h-12 border-r border-zinc-800"
                    >
                      Type
                    </TableHead>
                    <TableHead
                      colSpan={2}
                      className="bg-zinc-800 text-white font-bold text-[10px] uppercase tracking-[0.2em] text-center h-10 border-b border-r border-zinc-700"
                    >
                      Opening Balance
                    </TableHead>
                    <TableHead
                      colSpan={2}
                      className="bg-zinc-800 text-white font-bold text-[10px] uppercase tracking-[0.2em] text-center h-10 border-b border-r border-zinc-700"
                    >
                      Period Activity
                    </TableHead>
                    <TableHead
                      colSpan={2}
                      className="bg-zinc-800 text-white font-bold text-[10px] uppercase tracking-[0.2em] text-center h-10 border-b border-zinc-700"
                    >
                      Closing Balance
                    </TableHead>
                  </TableRow>
                  {/* Sub Header */}
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="bg-zinc-900 text-zinc-400 font-bold text-[9px] uppercase tracking-widest text-right h-8 border-r border-zinc-800">
                      Debit
                    </TableHead>
                    <TableHead className="bg-zinc-900 text-zinc-400 font-bold text-[9px] uppercase tracking-widest text-right h-8 border-r border-zinc-800">
                      Credit
                    </TableHead>
                    <TableHead className="bg-zinc-900 text-zinc-400 font-bold text-[9px] uppercase tracking-widest text-right h-8 border-r border-zinc-800">
                      Debit
                    </TableHead>
                    <TableHead className="bg-zinc-900 text-zinc-400 font-bold text-[9px] uppercase tracking-widest text-right h-8 border-r border-zinc-800">
                      Credit
                    </TableHead>
                    <TableHead className="bg-zinc-900 text-zinc-400 font-bold text-[9px] uppercase tracking-widest text-right h-8 border-r border-zinc-800">
                      Debit
                    </TableHead>
                    <TableHead className="bg-zinc-900 text-zinc-400 font-bold text-[9px] uppercase tracking-widest text-right h-8">
                      Credit
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((row: any, rowIndex: number) => (
                    <TableRow
                      key={rowIndex}
                      className="group border-none hover:bg-slate-50 transition-colors"
                    >
                      {columns.map((column, colIndex) => (
                        <TableCell
                          key={colIndex}
                          className={cn(
                            "py-3 border-b border-slate-100",
                            column.className,
                          )}
                        >
                          {typeof column.accessor === "function"
                            ? column.accessor(row)
                            : row[column.accessor]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                  {/* Industry Standard Totals Row (Inside TableBody for Perfect Alignment) */}
                  <TableRow className="bg-slate-50 hover:bg-slate-50 border-none sticky bottom-0 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                    <TableCell className="py-4 px-6 border-b border-slate-200">
                      <span className="font-bold text-[11px] uppercase tracking-[0.2em] text-slate-500">
                        Grand Summary Totals
                      </span>
                    </TableCell>
                    <TableCell className="border-l border-b border-slate-200" />
                    <TableCell className="text-right py-4 pr-4 border-l border-b border-slate-200">
                      <span className="text-[12px] font-bold text-slate-900">
                        {fmt(totals.opDr)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-4 pr-4 border-b border-slate-200">
                      <span className="text-[12px] font-bold text-slate-900">
                        {fmt(totals.opCr)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-4 pr-4 border-l border-b border-slate-200">
                      <span className="text-[12px] font-bold text-slate-900">
                        {fmt(totals.perDr)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-4 pr-4 border-b border-slate-200">
                      <span className="text-[12px] font-bold text-slate-900">
                        {fmt(totals.perCr)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-4 pr-4 border-l border-b border-slate-200">
                      <span className="text-[12px] font-bold text-slate-900">
                        {fmt(totals.clDr)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-4 pr-4 border-b border-slate-200">
                      <span className="text-[12px] font-bold text-slate-900">
                        {fmt(totals.clCr)}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
