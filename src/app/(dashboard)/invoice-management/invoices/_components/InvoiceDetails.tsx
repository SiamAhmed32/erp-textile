"use client";

import { Container, Flex, PrimaryText } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { useGetByIdQuery } from "@/store/services/commonApi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ArrowLeft, Download, Pencil, Printer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { formatDate, normalizeInvoice, numberToWords, statusBadgeClass } from "./helpers";
import { InvoiceFormModal } from "./InvoiceFormModal";
import InvoiceReadOnly from "./InvoiceReadOnly";
import { Invoice, InvoiceApiItem } from "./types";

type Props = {
    id: string;
    shouldExport?: boolean;
};

const InvoiceDetails = ({ id, shouldExport = false }: Props) => {
    const router = useRouter();

    const [invoice, setInvoice] = React.useState<Invoice | null>(null);
    const [error, setError] = React.useState("");
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
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
        const title = "Proforma Invoice";
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, 105, 32, { align: "center" });
        doc.line(105 - titleWidth / 2, 33, 105 + titleWidth / 2, 33); // Underline

        // Info Grid
        doc.setFontSize(9);
        let currentY = 45;

        // Left Column: Customer Info
        doc.setFont("helvetica", "bold");
        const buyerName = buyer?.name || "CUSTOMER NAME";
        doc.text(buyerName.toUpperCase(), 14, currentY);
        doc.setFont("helvetica", "normal");
        const buyerAddress = buyer?.address || "CUSTOMER ADDRESS";
        const buyerLocation = buyer?.location ? `, ${buyer.location}` : "";
        const fullAddress = `${buyerAddress}${buyerLocation}`;
        const splitAddress = doc.splitTextToSize(fullAddress, 85);
        doc.text(splitAddress, 14, currentY + 4);

        // Right Column: PI Info
        const infoX = 145; // Label start X
        const valueX = 175; // Value start X
        const valueWidth = 25; // Max width for values to trigger wrap

        doc.setFont("helvetica", "bold");
        doc.text("PI NO:", infoX, currentY);
        doc.setFont("helvetica", "normal");
        const piNoText = invoice.piNumber || "-";
        const splitPi = doc.splitTextToSize(piNoText, valueWidth);
        doc.text(splitPi, valueX, currentY);
        currentY += splitPi.length * 4.5;

        doc.setFont("helvetica", "bold");
        doc.text("Date:", infoX, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(formatDate(invoice.date), valueX, currentY);
        currentY += 5;

        // Buyer wrapping
        doc.setFont("helvetica", "bold");
        doc.text("Buyer:", infoX, currentY);
        doc.setFont("helvetica", "normal");
        const buyerNameText = buyer?.name || "-";
        const splitBuyer = doc.splitTextToSize(buyerNameText, valueWidth);
        doc.text(splitBuyer, valueX, currentY);
        currentY += splitBuyer.length * 4.5; // Dynamic spacing

        // Merchandiser wrapping
        doc.setFont("helvetica", "bold");
        doc.text("Merchandiser:", infoX, currentY);
        doc.setFont("helvetica", "normal");
        const merchNameText = buyer?.merchandiser || "Mr. Shahin";
        const splitMerch = doc.splitTextToSize(merchNameText, valueWidth);
        doc.text(splitMerch, valueX, currentY);
        currentY += splitMerch.length * 4.5;

        currentY = Math.max(currentY + 5, 65); // Dynamic Y with minimum offset

        // Table Implementation
        let tableHead: string[][] = [];
        const tableBody: any[][] = [];
        let totalAmount = 0;

        if (order?.productType === "FABRIC" && item?.fabricItem) {
            tableHead = [["Style No", "Description", "Width", "Colour", "Net Wt (Kg)", "Gross Wt (Kg)", "Qty (Yds)", "Unit Price", "Total Amount"]];

            const rows = item.fabricItem.fabricItemData || [];
            rows.forEach((row: any, index: number) => {
                const amount = parseFloat(row.totalAmount) || 0;
                totalAmount += amount;

                const styleInfo = index === 0 ? [
                    { content: item.fabricItem.styleNo || "-", rowSpan: rows.length, styles: { halign: "center", valign: "middle" } },
                    { content: item.fabricItem.discription || "-", rowSpan: rows.length, styles: { halign: "center", valign: "middle" } },
                    { content: item.fabricItem.width || "-", rowSpan: rows.length, styles: { halign: "center", valign: "middle" } }
                ] : [];

                tableBody.push([
                    ...styleInfo,
                    row.color || "-",
                    row.netWeight || "-",
                    row.grossWeight || "-",
                    row.quantityYds || "-",
                    row.unitPrice || "-",
                    amount.toFixed(2),
                ]);
            });
        } else if (order?.productType === "CARTON" && item?.cartonItem) {
            tableHead = [["Order No", "Measurement", "Ply", "Unit", "Net Wt (Kg)", "Gross Wt (Kg)", "Qty", "Unit Price", "Total Amount"]];

            const rows = item.cartonItem.cartonItemData || [];
            rows.forEach((row: any, index: number) => {
                const amount = parseFloat(row.totalAmount) || 0;
                totalAmount += amount;

                const styleInfo = index === 0 ? [
                    { content: item.cartonItem.orderNo || "-", rowSpan: rows.length, styles: { halign: "center", valign: "middle" } }
                ] : [];

                tableBody.push([
                    ...styleInfo,
                    row.cartonMeasurement || "-",
                    row.cartonPly || "-",
                    row.unit || "-",
                    row.netWeight || "-",
                    row.grossWeight || "-",
                    row.cartonQty || "-",
                    row.unitPrice || "-",
                    amount.toFixed(2),
                ]);
            });
        } else if (order?.productType === "LABEL_TAG" && item?.labelItem) {
            tableHead = [["Style No", "Color", "Net Wt (Kg)", "Gross Wt (Kg)", "Qty Dzn", "Qty Pcs", "Unit Price", "Total Amount"]];

            const rows = item.labelItem.labelItemData || [];
            rows.forEach((row: any, index: number) => {
                const amount = parseFloat(row.totalAmount) || 0;
                totalAmount += amount;

                const styleInfo = index === 0 ? [
                    { content: item.labelItem.styleNo || "-", rowSpan: rows.length, styles: { halign: "center", valign: "middle" } }
                ] : [];

                tableBody.push([
                    ...styleInfo,
                    row.color || "-",
                    row.netWeight || "-",
                    row.grossWeight || "-",
                    row.quantityDzn || "-",
                    row.quantityPcs || "-",
                    row.unitPrice || "-",
                    amount.toFixed(2),
                ]);
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
                headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], lineWidth: 0.1, fontStyle: "bold" },
                columnStyles: {
                    0: { halign: "left" },
                    1: { halign: "left" },
                },
            });

            currentY = (doc as any).lastAutoTable.finalY + 6; // Narrow space
        } else {
            currentY += 6;
        }

        // Footer Section
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text("In Word:", 14, currentY);
        doc.setFont("helvetica", "normal");
        const words = amountInWords(totalAmount);
        const splitWords = doc.splitTextToSize(words, 160); // Wrap to almost full width
        doc.text(splitWords, 27, currentY);
        currentY += splitWords.length * 4;

        // Payment & Terms
        doc.setFont("helvetica", "bold");
        doc.text(`Payment:`, 14, currentY);
        doc.setFont("helvetica", "normal");
        const paymentText = terms?.payment || "As per regular terms.";
        const splitPayment = doc.splitTextToSize(paymentText, 100);
        doc.text(splitPayment, 27, currentY);

        doc.setFont("helvetica", "bold");
        doc.text(`Origin:`, 110, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(terms?.origin || "Bangladesh", 120, currentY);

        currentY += splitPayment.length * 4; // Add height of payment text
        // Removed extra increment between payment and delivery

        doc.setFont("helvetica", "bold");
        doc.text(`Delivery:`, 14, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(terms?.delivery || "-", 27, currentY);

        doc.setFont("helvetica", "bold");
        doc.text(`SWIFT Code:`, 110, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(terms?.swiftCode || "-", 130, currentY);

        currentY += 4;
        doc.setFont("helvetica", "bold");
        doc.text(`Advising Bank:`, 14, currentY);
        doc.setFont("helvetica", "normal");
        const bankText = terms?.advisingBank || "-";
        const splitBank = doc.splitTextToSize(bankText, 70);
        doc.text(splitBank, 35, currentY);

        doc.setFont("helvetica", "bold");
        doc.text(`VAT No:`, 110, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(terms?.binNo || "-", 122, currentY);

        currentY += 4;
        doc.setFont("helvetica", "bold");
        doc.text(`HS Code:`, 110, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(terms?.hsCode || "-", 124, currentY);

        currentY += 15;

        // Banking Details for MOON TEXTILE
        doc.setFont("helvetica", "bold");
        doc.text(`Bank Name:`, 14, currentY);
        doc.setFont("helvetica", "normal");
        doc.text(`${company?.bankName || "National Bank Limited"}`, 32, currentY);

        currentY += 4;
        doc.text(`${company?.branchName || "Pragati Sarani Branch, Dhaka"}`, 14, currentY);
        currentY += 4;
        doc.text(`A/C Name: ${company?.name || "Moon Textile"}`, 14, currentY);
        currentY += 4;
        doc.text(`A/C No: ${company?.bankAccountNumber || "0116-3112001201"}`, 14, currentY);

        // Authorized Signature & Buyer Acceptance (Positioned at bottom)
        const pageHeight = doc.internal.pageSize.getHeight();
        const footerY = pageHeight - 20; // Position from bottom

        // Buyer Acceptance (Left)
        const leftStartX = 14;
        const leftEndX = 70;
        const leftCenterX = (leftStartX + leftEndX) / 2;
        doc.setFont("helvetica", "normal");
        doc.line(leftStartX, footerY, leftEndX, footerY);
        doc.text("Buyer Acceptance", leftCenterX, footerY + 5, { align: "center" });

        // Authorized Signature (Right)
        const rightStartX = 150;
        const rightEndX = 196;
        const rightCenterX = (rightStartX + rightEndX) / 2;

        doc.line(rightStartX, footerY, rightEndX, footerY); // Upper border for section
        doc.setFont("helvetica", "bold");
        doc.text(`For ${company?.name || "Moon Textile."}`, rightCenterX, footerY + 5, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.text("Authorized Signature", rightCenterX, footerY + 9, { align: "center" });

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
            <div className="print:hidden">
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
                        <Button variant="outline" onClick={() => setIsEditModalOpen(true)} disabled={!invoice}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </div>
                </Flex>

                {error && <PrimaryText className="mt-4 text-sm text-destructive">{error}</PrimaryText>}
                {loading && <PrimaryText className="mt-2 text-sm text-muted-foreground">Loading invoice...</PrimaryText>}

                <div className="mt-4" />

                {invoice && <InvoiceReadOnly invoice={invoice} />}
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
        </Container>
    );
};

export default InvoiceDetails;
