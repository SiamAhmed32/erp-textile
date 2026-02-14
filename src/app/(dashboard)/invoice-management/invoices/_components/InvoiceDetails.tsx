"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, Pencil } from "lucide-react";
import { Container, Flex, PrimaryText } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { apiRequest, extractItem } from "@/lib/api";
import { Invoice, InvoiceApiItem } from "./types";
import { formatDate, normalizeInvoice, statusBadgeClass } from "./helpers";
import InvoiceReadOnly from "./InvoiceReadOnly";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type Props = {
    id: string;
};

const InvoiceDetails = ({ id }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const shouldExport = searchParams.get("export") === "pdf";

    const [invoice, setInvoice] = React.useState<Invoice | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const exportTriggered = React.useRef(false);

    const fetchInvoice = React.useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const payload = await apiRequest(`/invoices/${id}`);
            const item = extractItem<InvoiceApiItem>(payload);
            if (!item) {
                setError("Invoice not found");
                return;
            }
            setInvoice(normalizeInvoice(item));
        } catch (err: any) {
            setError(err.message || "Failed to load invoice");
        } finally {
            setLoading(false);
        }
    }, [id]);

    React.useEffect(() => {
        fetchInvoice();
    }, [fetchInvoice]);

    const handleExportPdf = React.useCallback(() => {
        if (!invoice) return;
        const doc = new jsPDF();
        const order = invoice.order;
        const terms = invoice.invoiceTerms;

        doc.setFontSize(16);
        doc.text("Proforma Invoice", 14, 18);
        doc.setFontSize(10);
        doc.text(`PI No: ${invoice.piNumber}`, 14, 24);
        doc.text(`Date: ${formatDate(invoice.date)}`, 14, 30);
        doc.text(`Status: ${invoice.status}`, 14, 36);
        if (order?.orderNumber) doc.text(`Order: ${order.orderNumber}`, 14, 42);

        autoTable(doc, {
            startY: 48,
            head: [["Order Overview", ""]],
            body: [
                ["Product Type", order?.productType || "-"],
                ["Order Date", formatDate(order?.orderDate)],
                ["Delivery Date", formatDate(order?.deliveryDate)],
            ],
            theme: "striped",
            styles: { fontSize: 9 },
            headStyles: { fillColor: [31, 41, 55] },
        });

        let startY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : 60;
        const item = order?.orderItems?.[0] || {};

        if (order?.productType === "FABRIC" && item.fabricItem) {
            autoTable(doc, {
                startY,
                head: [["Fabric Details", ""]],
                body: [
                    ["Style No", item.fabricItem.styleNo || "-"],
                    ["Description", item.fabricItem.discription || "-"],
                    ["Width", item.fabricItem.width || "-"],
                ],
                theme: "striped",
                styles: { fontSize: 9 },
                headStyles: { fillColor: [31, 41, 55] },
            });
            startY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 6 : startY;
            const rows = item.fabricItem.fabricItemData || [];
            if (rows.length) {
                autoTable(doc, {
                    startY,
                    head: [["Color", "Net", "Gross", "Qty (Yds)", "Unit Price", "Total"]],
                    body: rows.map((row: any) => [
                        row.color || "-",
                        row.netWeight ?? "-",
                        row.grossWeight ?? "-",
                        row.quantityYds ?? "-",
                        row.unitPrice ?? "-",
                        row.totalAmount ?? "-",
                    ]),
                    theme: "striped",
                    styles: { fontSize: 8 },
                });
            }
        }

        if (order?.productType === "LABEL_TAG" && item.labelItem) {
            autoTable(doc, {
                startY,
                head: [["Label Details", ""]],
                body: [["Style No", item.labelItem.styleNo || "-"]],
                theme: "striped",
                styles: { fontSize: 9 },
                headStyles: { fillColor: [31, 41, 55] },
            });
            startY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 6 : startY;
            const rows = item.labelItem.labelItemData || [];
            if (rows.length) {
                autoTable(doc, {
                    startY,
                    head: [["Desc", "Color", "Net", "Gross", "Qty Dzn", "Qty Pcs", "Unit Price", "Total"]],
                    body: rows.map((row: any) => [
                        row.desscription || "-",
                        row.color || "-",
                        row.netWeight ?? "-",
                        row.grossWeight ?? "-",
                        row.quantityDzn ?? "-",
                        row.quantityPcs ?? "-",
                        row.unitPrice ?? "-",
                        row.totalAmount ?? "-",
                    ]),
                    theme: "striped",
                    styles: { fontSize: 8 },
                });
            }
        }

        if (order?.productType === "CARTON" && item.cartonItem) {
            autoTable(doc, {
                startY,
                head: [["Carton Details", ""]],
                body: [["Order No", item.cartonItem.orderNo || "-"]],
                theme: "striped",
                styles: { fontSize: 9 },
                headStyles: { fillColor: [31, 41, 55] },
            });
            startY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 6 : startY;
            const rows = item.cartonItem.cartonItemData || [];
            if (rows.length) {
                autoTable(doc, {
                    startY,
                    head: [["Measurement", "Ply", "Qty", "Net", "Gross", "Unit", "Unit Price", "Total"]],
                    body: rows.map((row: any) => [
                        row.cartonMeasurement || "-",
                        row.cartonPly || "-",
                        row.cartonQty ?? "-",
                        row.netWeight ?? "-",
                        row.grossWeight ?? "-",
                        row.unit || "-",
                        row.unitPrice ?? "-",
                        row.totalAmount ?? "-",
                    ]),
                    theme: "striped",
                    styles: { fontSize: 8 },
                });
            }
        }

        startY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : startY;
        autoTable(doc, {
            startY,
            head: [["Invoice Terms", ""]],
            body: [
                ["Payment", terms?.payment || "-"],
                ["Delivery", terms?.delivery || "-"],
                ["Advising Bank", terms?.advisingBank || "-"],
                ["Negotiation", terms?.negotiation || "-"],
                ["Origin", terms?.origin || "-"],
                ["SWIFT Code", terms?.swiftCode || "-"],
                ["BIN No", terms?.binNo || "-"],
                ["HS Code", terms?.hsCode || "-"],
                ["Remarks", terms?.remarks || "-"],
            ],
            theme: "striped",
            styles: { fontSize: 9 },
            headStyles: { fillColor: [31, 41, 55] },
        });

        const filename = `${invoice.piNumber || invoice.id}.pdf`;
        doc.save(filename);
    }, [invoice]);

    React.useEffect(() => {
        if (!shouldExport || !invoice || exportTriggered.current) return;
        exportTriggered.current = true;
        handleExportPdf();
    }, [invoice, shouldExport, handleExportPdf]);

    return (
        <Container className="pb-10 pt-6">
            <Flex className="flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/invoice-management/invoices">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Invoices
                        </Link>
                    </Button>
                    {invoice && (
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(invoice.status)}`}>
                            {invoice.status}
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={handleExportPdf} disabled={!invoice}>
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                    </Button>
                    <Button variant="outline" asChild disabled={!invoice}>
                        <Link href={`/invoice-management/invoices/${id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                </div>
            </Flex>

            {error && <PrimaryText className="mt-4 text-sm text-destructive">{error}</PrimaryText>}
            {loading && <PrimaryText className="mt-2 text-sm text-muted-foreground">Loading invoice...</PrimaryText>}

            <div className="mt-4" />

            {invoice && <InvoiceReadOnly invoice={invoice} />}
        </Container>
    );
};

export default InvoiceDetails;
