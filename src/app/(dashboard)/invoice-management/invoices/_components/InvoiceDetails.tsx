"use client";

import {
  Container,
  PageHeader,
  PrimaryText,
  DetailsSkeleton,
} from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { useGetByIdQuery, usePatchMutation } from "@/store/services/commonApi";
import { notify } from "@/lib/notifications";
import { ArrowLeft, Download, Pencil, Copy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import {
  normalizeInvoice,
  statusBadgeClass,
} from "./helpers";
import { InvoiceFormModal } from "./InvoiceFormModal";
import InvoiceReadOnly from "./InvoiceReadOnly";
import { Invoice, InvoiceApiItem } from "./types";
import { exportInvoiceToPdf } from "./invoicePdf";

type Props = {
  id: string;
  shouldExport?: boolean;
};

const InvoiceDetails = ({ id, shouldExport = false }: Props) => {
  const router = useRouter();

  const [invoice, setInvoice] = React.useState<Invoice | null>(null);
  const [error, setError] = React.useState("");
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = React.useState(false);
  const exportTriggered = React.useRef(false);
  const {
    data: invoicePayload,
    isFetching: loading,
    error: invoiceError,
  } = useGetByIdQuery({
    path: "invoices",
    id,
  });

  React.useEffect(() => {
    const item = (invoicePayload as any)?.data as InvoiceApiItem | undefined;
    if (!item) return;
    setInvoice(normalizeInvoice(item));
    setError("");
  }, [invoicePayload]);

  React.useEffect(() => {
    const parsed = invoiceError as any;
    if (!parsed) return;
    const message =
      parsed?.data?.error?.message ||
      parsed?.data?.message ||
      "Could not load the invoice details. Please try again.";
    setError(message);
    notify.error(message);
    console.error("Load Invoice Error:", parsed);
  }, [invoiceError]);

  const handleExportPdf = React.useCallback(async () => {
    if (!invoice) return;
    await exportInvoiceToPdf(invoice);
  }, [invoice]);

  React.useEffect(() => {
    if (!shouldExport || !invoice || exportTriggered.current) return;
    exportTriggered.current = true;
    handleExportPdf();
  }, [invoice, shouldExport, handleExportPdf]);

  return (
    <Container className="pb-10 pt-6">
      <div className="print:hidden">
        <PageHeader
          title={invoice?.piNumber || "Invoice Details"}
          backHref="/invoice-management/invoices"
          breadcrumbItems={[
            //{ label: "Dashboard", href: "/" },
            {
              label: "Invoice Management",
              href: "/invoice-management/invoices",
            },
            { label: invoice?.piNumber || "Details" },
          ]}
          actions={
            <div className="flex flex-wrap gap-2">
              {invoice && (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusBadgeClass(invoice.status)}`}
                >
                  {invoice.status}
                </span>
              )}
              <Button
                variant="outline"
                onClick={handleExportPdf}
                disabled={!invoice}
                className="shadow-sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDuplicateModalOpen(true)}
                disabled={!invoice}
                className="shadow-sm"
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </Button>
              <Button
                className="bg-black text-white hover:bg-black/90 shadow-sm"
                onClick={() => setIsEditModalOpen(true)}
                disabled={!invoice}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Invoice
              </Button>
            </div>
          }
        />

        {error && (
          <PrimaryText className="mt-4 text-sm text-destructive">
            {error}
          </PrimaryText>
        )}

        {loading ? (
          <DetailsSkeleton />
        ) : (
          invoice && (
            <>
              <div className="mt-4" />
              <InvoiceReadOnly invoice={invoice} />
            </>
          )
        )}
      </div>

      {invoice && (
        <InvoiceFormModal
          open={isEditModalOpen}
          mode="edit"
          invoiceId={invoice.id}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            // The details will be refreshed by the query hook as it invalidates "invoices"
          }}
        />
      )}

      {invoice && (
        <InvoiceFormModal
          open={isDuplicateModalOpen}
          mode="create"
          duplicateId={invoice.id}
          onClose={() => setIsDuplicateModalOpen(false)}
          onSuccess={() => {
            setIsDuplicateModalOpen(false);
          }}
        />
      )}
    </Container>
  );
};

export default InvoiceDetails;
