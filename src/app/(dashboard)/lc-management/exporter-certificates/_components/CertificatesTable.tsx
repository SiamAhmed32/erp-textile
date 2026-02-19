"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  FileText,
  ChevronDown,
  FileCheck,
  Settings2,
  Printer,
  Loader2,
} from "lucide-react";
import CustomTable from "@/components/reusables/CustomTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LCManagement } from "../../lc-managements/_components/types";
import { exportExporterCertificate } from "../../lc-managements/_components/lcPdf";
import { useLazyGetByIdQuery } from "@/store/services/commonApi";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Props = {
  data: LCManagement[];
  loading: boolean;
  page: number;
  totalPages: number;
  search: string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
};

const CertificatesTable = ({
  data,
  loading,
  page,
  totalPages,
  search,
  onSearchChange,
  onPageChange,
}: Props) => {
  const [certType, setCertType] = useState<"beneficiary" | "origin">(
    "beneficiary",
  );
  const [certDate, setCertDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Use Lazy Query to fetch full detailed LC (with nested buyer)
  const [
    triggerGetDetails,
    { data: fullLCResponse, isFetching: loadingDetails },
  ] = useLazyGetByIdQuery();
  const [
    triggerGetInvoice,
    { data: fullInvoiceResponse, isFetching: loadingInvoice },
  ] = useLazyGetByIdQuery();

  const lcFromApi = (fullLCResponse as any)?.data as LCManagement | undefined;
  const invoiceFromApi = (fullInvoiceResponse as any)?.data;

  const fullLC = useMemo(() => {
    if (!lcFromApi) return undefined;
    const enriched = { ...lcFromApi };
    if (invoiceFromApi) {
      if (!enriched.invoice) enriched.invoice = invoiceFromApi;
      else if (!enriched.invoice.order && invoiceFromApi.order) {
        enriched.invoice = { ...enriched.invoice, order: invoiceFromApi.order };
      }
    }
    return enriched;
  }, [lcFromApi, invoiceFromApi]);

  const isDataLoading = loadingDetails || loadingInvoice;

  const handleOpenDialog = async (
    lcId: string,
    type: "beneficiary" | "origin",
  ) => {
    setCertType(type);
    setIsDialogOpen(true);
    try {
      const lcRes = await triggerGetDetails({
        path: "lc-managements",
        id: lcId,
      }).unwrap();

      const lcData = (lcRes as any)?.data;
      if (lcData?.invoiceId) {
        await triggerGetInvoice({
          path: "invoices",
          id: lcData.invoiceId,
        }).unwrap();
      }
    } catch (err) {
      toast.error("Failed to fetch full LC details");
      setIsDialogOpen(false);
    }
  };

  const handleGenerate = () => {
    if (fullLC) {
      exportExporterCertificate(fullLC, certType, certDate);
      setIsDialogOpen(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "BBLC Number",
        accessor: (row: LCManagement) => (
          <span className="font-bold text-slate-900">{row.bblcNumber}</span>
        ),
      },
      {
        header: "Buyer Name",
        accessor: (row: LCManagement) => (
          <div className="flex flex-col">
            <span className="font-black text-slate-900 uppercase tracking-tight text-xs">
              {row.invoice?.order?.buyer?.name || "N/A"}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              {row.invoice?.order?.buyer?.merchandiser || "No Merchandiser"}
            </span>
          </div>
        ),
      },
      {
        header: "Invoice No",
        accessor: (row: LCManagement) => (
          <span className="font-medium text-slate-600">
            {row.invoice?.piNumber || "-"}
          </span>
        ),
      },
      {
        header: "Bank Details",
        accessor: (row: LCManagement) => (
          <div className="text-xs">
            <div className="font-bold text-slate-600">
              {row.lcIssueBankName}
            </div>
            <div className="text-slate-400 italic text-[10px]">
              {row.lcIssueBankBranch}
            </div>
          </div>
        ),
      },
      {
        header: "Actions",
        className: "w-40",
        accessor: (row: LCManagement) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-full border-blue-100 text-black hover:bg-blue-50 font-bold text-xs"
              >
                Create Certificate
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Certificate Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleOpenDialog(row.id, "beneficiary")}
              >
                <FileText className="mr-2 h-4 w-4 text-blue-500" />
                Beneficiary Certificate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleOpenDialog(row.id, "origin")}
              >
                <FileCheck className="mr-2 h-4 w-4 text-orange-500" />
                Certificate of Origin
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search LC, Buyer or Invoice..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 shadow-sm border-slate-200"
          />
        </div>
      </div>

      <CustomTable
        data={data}
        columns={columns}
        isLoading={loading}
        skeletonRows={5}
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange,
        }}
        scrollAreaHeight="h-[65vh]"
      />

      {/* Prepare Certificate Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-blue-600" />
              Prepare Certificate
            </DialogTitle>
          </DialogHeader>

          {isDataLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              <p className="text-sm font-medium text-slate-500 italic">
                Fetching full order details...
              </p>
            </div>
          ) : (
            <div className="grid gap-6 py-4 animate-in fade-in duration-300">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">
                  Document Type
                </Label>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm font-bold text-slate-900">
                    {certType === "beneficiary"
                      ? "Beneficiary Certificate"
                      : "Certificate of Origin"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Generating for LC: {fullLC?.bblcNumber}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="certDate"
                  className="text-xs font-bold uppercase text-slate-500"
                >
                  Certificate Date
                </Label>
                <Input
                  id="certDate"
                  type="date"
                  value={certDate}
                  onChange={(e) => setCertDate(e.target.value)}
                  className="h-10 shadow-sm"
                />
                <p className="text-[10px] text-slate-400 italic">
                  This date will appear at the top of the certificate.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 overflow-hidden">
                  <Label className="text-[10px] font-bold uppercase text-slate-400">
                    Buyer Name
                  </Label>
                  <p className="text-xs font-black text-blue-700 truncate">
                    {fullLC?.invoice?.order?.buyer?.name || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-slate-400">
                    PI Number
                  </Label>
                  <p className="text-xs font-bold truncate">
                    {fullLC?.invoice?.piNumber || "N/A"}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-yellow-100 bg-yellow-50/50">
                <p className="text-[10px] text-yellow-700 font-bold leading-tight">
                  * Ensure the Buyer Name and PI details are correct. They will
                  be printed exactly as shown here.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={loadingDetails}
            >
              Cancel
            </Button>
            <Button
              className="bg-black text-white hover:bg-black/90 shadow-lg px-8 transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={handleGenerate}
              disabled={isDataLoading || !fullLC}
            >
              <Printer className="mr-2 h-4 w-4" />
              Generate & Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(CertificatesTable);
