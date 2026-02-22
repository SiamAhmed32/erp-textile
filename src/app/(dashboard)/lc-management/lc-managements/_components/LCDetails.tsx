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
import { Container, PageHeader, DetailsSkeleton } from "@/components/reusables";
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
import { normalizeLCItems } from "./utils";

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

  // 2. Fetch full Invoice to get orderId
  const { data: invoicePayload } = useGetByIdQuery(
    {
      path: "invoices",
      id: lc?.invoiceId,
    },
    { skip: !lc?.invoiceId },
  );

  const fullInvoice = (invoicePayload as any)?.data;

  // 3. Fetch full Order to get companyProfile and detailed buyer
  const { data: orderPayload } = useGetByIdQuery(
    {
      path: "orders",
      id: fullInvoice?.orderId,
    },
    { skip: !fullInvoice?.orderId },
  );

  const fullOrder = (orderPayload as any)?.data;

  // Enrich LC object with full invoice and deep order (company/buyer) relations
  const enrichedLc = React.useMemo(() => {
    if (!lc) return undefined;

    // Deep clone to safely merge
    const newLc = JSON.parse(JSON.stringify(lc));

    if (fullInvoice) {
      newLc.invoice = { ...newLc.invoice, ...fullInvoice };
    }

    // Merge the full order into the invoice
    if (fullOrder && newLc.invoice) {
      newLc.invoice.order = {
        ...(newLc.invoice.order || {}),
        ...fullOrder,
      };
    }

    return newLc;
  }, [lc, fullInvoice, fullOrder]);

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
    (type: string, date?: string) => {
      if (!lc) return;
      switch (type) {
        case "commercial-invoice":
          exportCommercialInvoicePdf(enrichedLc!);
          break;
        case "delivery-challan":
          exportDeliveryChallanPdf(enrichedLc!);
          break;
        case "beneficiary-certificate":
          exportBeneficiaryCertificatePdf(enrichedLc!, date);
          break;
        case "certificate-of-origin":
          exportCertificateOfOriginPdf(enrichedLc!, date);
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

  const normalizedItems = React.useMemo(() => {
    if (!enrichedLc) return [];
    return normalizeLCItems(enrichedLc);
  }, [enrichedLc]);

  return (
    <Container className="pb-10 pt-6">
      {loading ? (
        <DetailsSkeleton />
      ) : (
        <>
          <PageHeader
            title={lc ? `LC: ${lc.bblcNumber}` : "LC Details"}
            backHref="/lc-management/lc-managements"
            breadcrumbItems={[
              { label: "Dashboard", href: "/" },
              { label: "LC Management", href: "/lc-management/lc-managements" },
              { label: lc?.bblcNumber || "Details" },
            ]}
            actions={
              <div className="flex flex-wrap gap-2">
                {lc && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-slate-200 hover:bg-slate-50 shadow-sm"
                      >
                        <Download className="h-4 w-4" />
                        Quick Export
                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-60 rounded-xl shadow-2xl border-slate-100"
                    >
                      <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
                        Direct Download
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

                <Button
                  className="bg-black text-white hover:bg-black/90 shadow-sm"
                  size="sm"
                  asChild
                  disabled={!lc}
                >
                  <Link href={`/lc-management/lc-managements/${id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit LC Details
                  </Link>
                </Button>
              </div>
            }
          />

          {enrichedLc && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <LCReadOnly
                lc={enrichedLc}
                items={normalizedItems}
                onExport={handleExport}
              />
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default LCDetails;
