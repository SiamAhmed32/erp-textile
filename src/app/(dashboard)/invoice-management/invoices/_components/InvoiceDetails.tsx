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

        // Right Column: PI Info (Right Aligned)
        const rightLabelX = 180; // Right edge for labels
        const rightValueX = 196; // Right edge for values
        doc.setFont("helvetica", "bold");
        doc.text("PI NO:", rightLabelX, currentY, { align: "right" });
        doc.text("Date:", rightLabelX, currentY + 5, { align: "right" });
        doc.text("Buyer:", rightLabelX, currentY + 10, { align: "right" });
        doc.text("Merchandiser:", rightLabelX, currentY + 15, { align: "right" });

        doc.setFont("helvetica", "normal");
        doc.text(invoice.piNumber || "-", rightValueX, currentY, { align: "right" });
        doc.text(formatDate(invoice.date), rightValueX, currentY + 5, { align: "right" });
        doc.text(buyer?.name || "-", rightValueX, currentY + 10, { align: "right" });
        doc.text(buyer?.merchandiser || "Mr. Shahin", rightValueX, currentY + 15, { align: "right" });

        currentY = 65;

        // Table Implementation
        let tableHead: string[][] = [];
        const tableBody: any[][] = [];
        let totalAmount = 0;

        if (order?.productType === "FABRIC" && item?.fabricItem) {
            tableHead = [["Colour", "Net Wt (Kg)", "Gross Wt (Kg)", "Qty (Yds)", "Unit Price", "Total Amount"]];

            // Add Item Header Row
            tableBody.push([
                {
                    content: `Style No: ${item.fabricItem.styleNo || "-"} | Description: ${item.fabricItem.discription || "-"} | Width: ${item.fabricItem.width || "-"}`,
                    colSpan: 6,
                    styles: { halign: "left", fontStyle: "bold", fillColor: [245, 245, 245] }
                }
            ]);

            const rows = item.fabricItem.fabricItemData || [];
            rows.forEach((row: any) => {
                const amount = parseFloat(row.totalAmount) || 0;
                totalAmount += amount;
                tableBody.push([
                    row.color || "-",
                    row.netWeight || "-",
                    row.grossWeight || "-",
                    row.quantityYds || "-",
                    row.unitPrice || "-",
                    amount.toFixed(2),
                ]);
            });
        } else if (order?.productType === "CARTON" && item?.cartonItem) {
            tableHead = [["Measurement", "Ply", "Unit", "Net Wt (Kg)", "Gross Wt (Kg)", "Qty", "Unit Price", "Total Amount"]];

            // Add Item Header Row
            tableBody.push([
                {
                    content: `Order No: ${item.cartonItem.orderNo || "-"}`,
                    colSpan: 8,
                    styles: { halign: "left", fontStyle: "bold", fillColor: [245, 245, 245] }
                }
            ]);

            const rows = item.cartonItem.cartonItemData || [];
            rows.forEach((row: any) => {
                const amount = parseFloat(row.totalAmount) || 0;
                totalAmount += amount;
                tableBody.push([
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
            tableHead = [["Color", "Net Wt (Kg)", "Gross Wt (Kg)", "Qty Dzn", "Qty Pcs", "Unit Price", "Total Amount"]];

            // Add Item Header Row
            tableBody.push([
                {
                    content: `Style No: ${item.labelItem.styleNo || "-"}`,
                    colSpan: 7,
                    styles: { halign: "left", fontStyle: "bold", fillColor: [245, 245, 245] }
                }
            ]);

            const rows = item.labelItem.labelItemData || [];
            rows.forEach((row: any) => {
                const amount = parseFloat(row.totalAmount) || 0;
                totalAmount += amount;
                tableBody.push([
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
        doc.text(amountInWords(totalAmount), 27, currentY); // Narrow space

        currentY += 6; // Narrow space

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

        // Authorized Signature & Buyer Acceptance
        currentY += 32; // Big space before signature

        // Buyer Acceptance (Left)
        doc.setFont("helvetica", "normal");
        doc.line(14, currentY, 60, currentY); // Add line for Buyer Acceptance
        doc.text("Buyer Acceptance", 14, currentY + 4);

        // Authorized Signature (Right)
        doc.setFont("helvetica", "bold");
        doc.text(`For ${company?.name || "Moon Textile."}`, 196, currentY, { align: "right" });
        doc.setFont("helvetica", "normal");
        doc.text("Authorized Signature", 196, currentY + 4, { align: "right" });

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
