"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Pencil } from "lucide-react";
import { Container, Flex, PrimaryText } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { useGetByIdQuery } from "@/store/services/commonApi";
import { Invoice, InvoiceApiItem } from "./types";
import { formatDate, normalizeInvoice, statusBadgeClass, numberToWords } from "./helpers";
import InvoiceReadOnly from "./InvoiceReadOnly";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type Props = {
    id: string;
    shouldExport?: boolean;
};

const InvoiceDetails = ({ id, shouldExport = false }: Props) => {
    const router = useRouter();

    const [invoice, setInvoice] = React.useState<Invoice | null>(null);
    const [error, setError] = React.useState("");
    const exportTriggered = React.useRef(false);
    const { data: invoicePayload, isFetching: loading, error: invoiceError } = useGetByIdQuery({
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
            parsed?.error ||
            "Failed to load invoice";
        setError(message);
    }, [invoiceError]);

    const handleExportPdf = React.useCallback(() => {
        if (!invoice) return;
        const doc = new jsPDF();
        const order = invoice.order;
        const terms = invoice.invoiceTerms;
        const buyer = order?.buyer;
        const company = order?.companyProfile;

        // Handle both object and array for orderItems
        const orderItems = order?.orderItems;
        const firstItem = Array.isArray(orderItems) ? orderItems[0] : orderItems;
        const item = (firstItem as any) || null;

        // Helper to convert number to words
        const amountInWords = (amount: number) => {
            return `US Dollar ${numberToWords(amount)}`;
        };

        // Header - Company Info
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        const companyName = company?.name || "Moon Textile.";
        doc.text(companyName, 105, 15, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const companyAddress = company?.address || "House No#16, Road No 01, Sector#10, Uttara, Dhaka-1230, Bangladesh.";
        doc.text(companyAddress, 105, 20, { align: "center" });
        const companyEmail = company?.email ? `(Mail: ${company?.email})` : "(Mail: moontes011@gmail.com)";
        doc.text(companyEmail, 105, 24, { align: "center" });

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Proforma Invoice", 105, 32, { align: "center" });

        // Info Grid
        doc.setFontSize(9);
        let currentY = 45;

        // Left Column: Customer Info
        doc.setFont("helvetica", "bold");
        const buyerName = buyer?.name || "CUSTOMER NAME";
        doc.text(buyerName.toUpperCase(), 14, currentY);
        doc.setFont("helvetica", "normal");
        const buyerAddress = buyer?.address || "CUSTOMER ADDRESS";
        const splitAddress = doc.splitTextToSize(buyerAddress, 80);
        doc.text(splitAddress, 14, currentY + 4);

        // Right Column: PI Info
        const rightColX = 140;
        doc.setFont("helvetica", "bold");
        doc.text("PI NO:", rightColX, currentY);
        doc.text("Date:", rightColX, currentY + 5);
        doc.text("Buyer:", rightColX, currentY + 10);
        doc.text("Merchandiser:", rightColX, currentY + 15);

        doc.setFont("helvetica", "normal");
        doc.text(invoice.piNumber || "-", rightColX + 25, currentY);
        doc.text(formatDate(invoice.date), rightColX + 25, currentY + 5);
        doc.text(buyer?.name || "-", rightColX + 25, currentY + 10);
        doc.text(buyer?.merchandiser || "Mr. Shahin", rightColX + 25, currentY + 15);

        currentY = 65;

        // Table Implementation
        let tableHead: string[][] = [];
        let tableBody: any[][] = [];
        let totalAmount = 0;

        if (order?.productType === "FABRIC" && item?.fabricItem) {
            tableHead = [["Style No", "Description", "GSM", "Width", "Colour", "Net Wt (Kg)", "Gross Wt (Kg)", "Qty (Yds)", "Unit Price", "Total Amount"]];
            const rows = item.fabricItem.fabricItemData || [];
            tableBody = rows.map((row: any) => {
                const amount = parseFloat(row.totalAmount) || 0;
                totalAmount += amount;
                return [
                    item.fabricItem.styleNo || "-",
                    item.fabricItem.discription || "-",
                    row.gsm || "-",
                    item.fabricItem.width || "-",
                    row.color || "-",
                    row.netWeight || "-",
                    row.grossWeight || "-",
                    row.quantityYds || "-",
                    row.unitPrice || "-",
                    amount.toFixed(2),
                ];
            });
        } else if (order?.productType === "CARTON" && item?.cartonItem) {
            tableHead = [["Order No", "Measurement", "Ply", "Unit", "Net Wt (Kg)", "Gross Wt (Kg)", "Qty", "Unit Price", "Total Amount"]];
            const rows = item.cartonItem.cartonItemData || [];
            tableBody = rows.map((row: any) => {
                const amount = parseFloat(row.totalAmount) || 0;
                totalAmount += amount;
                return [
                    item.cartonItem.orderNo || "-",
                    row.cartonMeasurement || "-",
                    row.cartonPly || "-",
                    row.unit || "-",
                    row.netWeight || "-",
                    row.grossWeight || "-",
                    row.cartonQty || "-",
                    row.unitPrice || "-",
                    amount.toFixed(2),
                ];
            });
        } else if (order?.productType === "LABEL_TAG" && item?.labelItem) {
            tableHead = [["Style No", "Description", "Color", "Net Wt (Kg)", "Gross Wt (Kg)", "Qty Dzn", "Qty Pcs", "Unit Price", "Total Amount"]];
            const rows = item.labelItem.labelItemData || [];
            tableBody = rows.map((row: any) => {
                const amount = parseFloat(row.totalAmount) || 0;
                totalAmount += amount;
                return [
                    item.labelItem.styleNo || "-",
                    row.desscription || "-",
                    row.color || "-",
                    row.netWeight || "-",
                    row.grossWeight || "-",
                    row.quantityDzn || "-",
                    row.quantityPcs || "-",
                    row.unitPrice || "-",
                    amount.toFixed(2),
                ];
            });
        }

        if (tableHead.length > 0) {
            // Add Total row
            tableBody.push([
                { content: "Total", colSpan: tableHead[0].length - 1, styles: { halign: "right", fontStyle: "bold" } },
                { content: totalAmount.toFixed(2), styles: { fontStyle: "bold" } }
            ]);

            autoTable(doc, {
                startY: currentY,
                head: tableHead,
                body: tableBody,
                theme: "grid",
                styles: { fontSize: 7, cellPadding: 1.5, halign: "center" },
                headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, fontStyle: "bold" },
                columnStyles: {
                    0: { halign: "left" },
                    1: { halign: "left" },
                },
            });

            currentY = (doc as any).lastAutoTable.finalY + 10;
        } else {
            currentY += 10;
        }

        // Footer Section
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text("In Word:", 14, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(amountInWords(totalAmount), 30, currentY);

        currentY += 10;

        // Payment & Terms
        doc.setFont("helvetica", "bold");
        doc.text(`Payment:`, 14, currentY);
        doc.setFont("helvetica", "normal");
        const paymentText = terms?.payment || "As per regular terms.";
        const splitPayment = doc.splitTextToSize(paymentText, 90);
        doc.text(splitPayment, 30, currentY);

        doc.setFont("helvetica", "bold");
        doc.text(`Origin:`, 110, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(terms?.origin || "Bangladesh", 125, currentY);

        currentY += 8;
        doc.setFont("helvetica", "bold");
        doc.text(`Delivery:`, 14, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(terms?.delivery || "-", 30, currentY);

        doc.setFont("helvetica", "bold");
        doc.text(`SWIFT Code:`, 110, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(terms?.swiftCode || "-", 130, currentY);

        currentY += 5;
        doc.setFont("helvetica", "bold");
        doc.text(`Advising Bank:`, 14, currentY);
        doc.setFont("helvetica", "normal");
        const bankText = terms?.advisingBank || "-";
        const splitBank = doc.splitTextToSize(bankText, 90);
        doc.text(splitBank, 35, currentY);

        doc.setFont("helvetica", "bold");
        doc.text(`VAT No:`, 110, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(terms?.binNo || "-", 125, currentY);

        currentY += 5;
        doc.setFont("helvetica", "bold");
        doc.text(`HS Code:`, 110, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(terms?.hsCode || "-", 125, currentY);

        currentY += 15;

        // Banking Details for MOON TEXTILE
        doc.setFont("helvetica", "bold");
        doc.text(`Bank Name: ${company?.bankName || "National Bank Limited"}`, 14, currentY);
        doc.text(`${company?.branchName || "Pragati Sarani Branch, Dhaka"}`, 14, currentY + 4);
        doc.text(`A/C Name: ${company?.name || "Moon Textile"}`, 14, currentY + 8);
        doc.text(`A/C No: ${company?.bankAccountNumber || "0116-3112001201"}`, 14, currentY + 12);

        // Authorized Signature
        doc.setFont("helvetica", "bold");
        doc.text(`For ${company?.name || "Moon Textile."}`, 180, currentY + 25, { align: "right" });
        doc.text("Authorized Signature", 180, currentY + 29, { align: "right" });

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
