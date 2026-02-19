"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  FileText,
  FileCheck,
  Pencil,
  Truck,
  Receipt,
  Banknote,
  Shield,
  Download,
} from "lucide-react";
import { Container, Flex } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetByIdQuery } from "@/store/services/commonApi";
import { LCManagement } from "./types";
import LCReadOnly from "./LCReadOnly";
import {
  exportCommercialInvoicePdf,
  exportDeliveryChallanPdf,
  exportBeneficiaryCertificatePdf,
  exportCertificateOfOriginPdf,
  exportBillOfExchangePdf,
} from "./lcPdf";

type Props = {
  id: string;
  shouldExport?: boolean;
};

const LCDetails = ({ id, shouldExport = false }: Props) => {
  const exportTriggered = React.useRef(false);

  const {
    data: lcPayload,
    isFetching: loading,
    error: lcError,
  } = useGetByIdQuery({
    path: "lc-managements",
    id,
  });

  const lc = (lcPayload as any)?.data as LCManagement | undefined;

  // Supplementary fetch for detailed invoice to get buyer info if not in LC payload
  const { data: invoicePayload } = useGetByIdQuery(
    {
      path: "invoices",
      id: lc?.invoiceId,
    },
    { skip: !lc?.invoiceId },
  );

  const fullInvoice = (invoicePayload as any)?.data;

  // Enrich LC object with full invoice/order/buyer if missing
  const enrichedLc = React.useMemo(() => {
    if (!lc) return undefined;
    const newLc = { ...lc };
    if (!newLc.invoice && fullInvoice) {
      newLc.invoice = fullInvoice;
    } else if (newLc.invoice && !newLc.invoice.order && fullInvoice?.order) {
      newLc.invoice.order = fullInvoice.order;
    }
    return newLc;
  }, [lc, fullInvoice]);

  React.useEffect(() => {
    const error = lcError as any;
    if (error) {
      console.error(
        "Load LC Error:",
        error?.data?.message || "Failed to load LC management",
      );
    }
  }, [lcError]);

  const handleExport = React.useCallback(
    (type: string) => {
      if (!lc) return;
      switch (type) {
        case "commercial-invoice":
          exportCommercialInvoicePdf(enrichedLc!);
          break;
        case "delivery-challan":
          exportDeliveryChallanPdf(enrichedLc!);
          break;
        case "beneficiary-certificate":
          exportBeneficiaryCertificatePdf(enrichedLc!);
          break;
        case "certificate-of-origin":
          exportCertificateOfOriginPdf(enrichedLc!);
          break;
        case "bill-of-exchange":
          exportBillOfExchangePdf(enrichedLc!);
          break;
      }
    },
    [enrichedLc, lc],
  );

  React.useEffect(() => {
    if (!shouldExport || !enrichedLc || exportTriggered.current) return;
    exportTriggered.current = true;
    handleExport("commercial-invoice");
  }, [enrichedLc, shouldExport, handleExport]);

  return (
    <Container className="pb-10 pt-6">
      <Flex className="flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-6 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/lc-management/lc-managements">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block" />
          <h1 className="text-xl font-bold tracking-tight">
            {lc ? `LC: ${lc.bblcNumber}` : "LC Details"}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {lc && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-slate-200 hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" />
                  Export
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-60 rounded-xl shadow-2xl border-slate-100"
              >
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
                  Download Document
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="rounded-lg my-0.5 gap-3 focus:bg-blue-50"
                  onClick={() => handleExport("commercial-invoice")}
                >
                  <Receipt className="h-4 w-4 text-blue-500" />
                  Commercial Invoice
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-lg my-0.5 gap-3 focus:bg-amber-50"
                  onClick={() => handleExport("delivery-challan")}
                >
                  <Truck className="h-4 w-4 text-amber-500" />
                  Delivery Challan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="rounded-lg my-0.5 gap-3 focus:bg-emerald-50"
                  onClick={() => handleExport("beneficiary-certificate")}
                >
                  <FileText className="h-4 w-4 text-emerald-500" />
                  Beneficiary Certificate
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-lg my-0.5 gap-3 focus:bg-orange-50"
                  onClick={() => handleExport("certificate-of-origin")}
                >
                  <FileCheck className="h-4 w-4 text-orange-500" />
                  Certificate of Origin
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="rounded-lg my-0.5 gap-3 focus:bg-violet-50"
                  onClick={() => handleExport("bill-of-exchange")}
                >
                  <Banknote className="h-4 w-4 text-violet-500" />
                  Bill of Exchange
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="outline" size="sm" asChild disabled={!lc}>
            <Link href={`/lc-management/lc-managements/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit LC
            </Link>
          </Button>
        </div>
      </Flex>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 animate-pulse">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Loading LC Data...
          </p>
        </div>
      )}

      {enrichedLc && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <LCReadOnly lc={enrichedLc} />
        </div>
      )}
    </Container>
  );
};

export default LCDetails;
