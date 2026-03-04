"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { drawHeader } from "@/utils/pdfHeader";
import { formatDate, numberToWords } from "./helpers";
import { Invoice } from "./types";

export const exportInvoiceToPdf = async (invoice: Invoice) => {
  const doc = new jsPDF();
  const order = invoice.order;
  const terms = invoice.invoiceTerms;
  const buyer = order?.buyer;
  const company = order?.companyProfile;

  const orderItems = order?.orderItems;
  const firstItem = Array.isArray(orderItems) ? orderItems[0] : orderItems;
  const item = (firstItem as any) || null;

  const startY = await drawHeader(doc, company, "Proforma Invoice", invoice.date);
  let currentY = startY;

  const margin = 14;
  const col1X = margin;
  const col2X = 130;
  const col2ValX = 160;
  const rightColWidth = 40;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("FOR ACCOUNT & RISK OF MESSERS:", col1X, currentY);
  currentY += 6;

  doc.setFontSize(11);
  doc.setTextColor(0);
  const buyerName = (buyer?.name || "N/A").toUpperCase();
  doc.text(buyerName, col1X, currentY);
  currentY += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const buyerAddress = buyer?.address || "";
  const buyerLocation = buyer?.location || "";
  const fullAddress = [buyerAddress, buyerLocation].filter(Boolean).join(", ");
  const splitAddress = doc.splitTextToSize(fullAddress, 100);
  doc.text(splitAddress, col1X, currentY);
  const addressHeight = splitAddress.length * 4.5;

  let ry = startY;
  const drawRow = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(label, col2X, ry);
    doc.setFont("helvetica", "normal");
    const splitVal = doc.splitTextToSize(value || "-", rightColWidth);
    doc.text(splitVal, col2ValX, ry);
    ry += Math.max(splitVal.length * 4.5, 6);
  };

  drawRow("Date:", formatDate(invoice.date));
  drawRow("PI NO:", invoice.piNumber || "-");
  drawRow("Buyer:", buyer?.name || "-");
  drawRow("Merchandiser:", buyer?.merchandiser || "-");

  currentY = Math.max(currentY + addressHeight + 8, ry + 5);

  let tableHead: string[][] = [];
  const tableBody: any[][] = [];
  let totalAmount = 0;

  if (order?.productType === "FABRIC" && item?.fabricItem) {
    tableHead = [[
      "Style No",
      "Description",
      "Width",
      "Colour",
      "Net Wt",
      "Gross Wt",
      "Qty (Yds)",
      "Unit Price",
      "Total (US$)",
    ]];
    const rows = item.fabricItem.fabricItemData || [];
    rows.forEach((row: any, index: number) => {
      const qty = parseFloat(row.quantityYds) || 0;
      const price = parseFloat(row.unitPrice) || 0;
      const amount = parseFloat(row.totalAmount) || qty * price;
      totalAmount += amount;
      tableBody.push([
        index === 0 ? item.fabricItem.styleNo : "",
        index === 0 ? item.fabricItem.discription : "",
        index === 0 ? item.fabricItem.width : "",
        row.color || "-",
        row.netWeight || "-",
        row.grossWeight || "-",
        qty.toString(),
        price.toFixed(2),
        amount.toFixed(2),
      ]);
    });
  } else if (order?.productType === "CARTON" && item?.cartonItem) {
    tableHead = [[
      "Order No",
      "Measurement",
      "Ply",
      "Unit",
      "Net Wt",
      "Gross Wt",
      "Qty",
      "Unit Price",
      "Total (US$)",
    ]];
    const rows = item.cartonItem.cartonItemData || [];
    rows.forEach((row: any, index: number) => {
      const qty = parseFloat(row.cartonQty) || 0;
      const price = parseFloat(row.unitPrice) || 0;
      const amount = parseFloat(row.totalAmount) || qty * price;
      totalAmount += amount;
      tableBody.push([
        index === 0 ? item.cartonItem.orderNo : "",
        row.cartonMeasurement || "-",
        row.cartonPly || "-",
        row.unit || "-",
        row.netWeight || "-",
        row.grossWeight || "-",
        qty.toString(),
        price.toFixed(2),
        amount.toFixed(2),
      ]);
    });
  } else if (order?.productType === "LABEL_TAG" && item?.labelItem) {
    tableHead = [[
      "Style No",
      "Color",
      "Net Wt",
      "Gross Wt",
      "Qty (Dzn)",
      "Qty (Pcs)",
      "Unit Price",
      "Total (US$)",
    ]];
    const rows = item.labelItem.labelItemData || [];
    rows.forEach((row: any, index: number) => {
      const qty = parseFloat(row.quantityDzn || row.quantityPcs || 0);
      const price = parseFloat(row.unitPrice) || 0;
      const amount = parseFloat(row.totalAmount) || qty * price;
      totalAmount += amount;
      tableBody.push([
        index === 0 ? item.labelItem.styleNo || "-" : "",
        row.color || "-",
        row.netWeight || "-",
        row.grossWeight || "-",
        row.quantityDzn || "-",
        row.quantityPcs || "-",
        price.toFixed(2),
        amount.toFixed(2),
      ]);
    });
  }

  autoTable(doc, {
    startY: currentY,
    head: tableHead,
    body: tableBody,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
      halign: "center",
      font: "helvetica",
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    headStyles: { fillColor: [248, 250, 252], fontStyle: "bold" },
    columnStyles: { 0: { halign: "left" }, 1: { halign: "left" } },
    didDrawPage: (data) => {
      currentY = data.cursor?.y || currentY;
    },
  });

  currentY = (doc as any).lastAutoTable.finalY;

  doc.setLineWidth(0.1);
  doc.line(margin, currentY, 196, currentY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Total Amount (US$):", 140, currentY + 6, { align: "left" });
  doc.text(`${totalAmount.toFixed(2)}`, 190, currentY + 6, { align: "right" });
  currentY += 10;

  doc.setDrawColor(0);
  doc.rect(margin, currentY, 182, 9);
  doc.setFontSize(8.5);
  doc.text(
    `Total Amount (in Words): US Dollar ${numberToWords(totalAmount)}`,
    margin + 2,
    currentY + 6,
  );
  currentY += 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Additional Terms and Condition:", margin, currentY);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY + 1, margin + 55, currentY + 1);
  currentY += 7;

  doc.setFontSize(8.5);
  const drawTerm = (num: string, label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${num}. ${label}:`, margin, currentY);
    doc.setFont("helvetica", "normal");
    const textX = margin + 35;
    const splitVal = doc.splitTextToSize(value || "-", 150);
    doc.text(splitVal, textX, currentY);
    currentY += Math.max(splitVal.length * 4.5, 6);
  };

  drawTerm("01", "Payment", terms?.payment || "As per regular terms.");
  drawTerm("02", "Delivery", terms?.delivery || "-");
  drawTerm("03", "Advising Bank", terms?.advisingBank || "-");
  drawTerm("04", "Negotiation", "15 (fifteen) days from the date of delivery.");
  drawTerm("05", "Original", "Bangladeshi");
  drawTerm("06", "Swift Code", terms?.swiftCode || "-");
  drawTerm("07", "BIN NO", terms?.binNo || "00-1159972-0102");
  drawTerm("08", "H.S.Code", terms?.hsCode || "62171000");

  currentY += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Banking Details (Exporter):", margin, currentY);
  currentY += 5;
  doc.setFont("helvetica", "normal");
  doc.text(`Bank Name: ${company?.bankName || "National Bank Limited"}`, margin, currentY);
  currentY += 4;
  doc.text(`${company?.branchName || "Pragati Sarani Branch, Dhaka"}`, margin, currentY);
  currentY += 4;
  doc.text(`A/C Name: ${company?.name || "Moon Textile"}`, margin, currentY);
  currentY += 4;
  doc.text(`A/C No: ${company?.bankAccountNumber || "0116-3112001201"}`, margin, currentY);

  const pageHeight = doc.internal.pageSize.getHeight();
  if (currentY > pageHeight - 40) doc.addPage();
  const footerY = pageHeight - 25;

  doc.setLineWidth(0.3);
  doc.line(margin, footerY, margin + 45, footerY);
  doc.setFontSize(8);
  doc.text("Buyer Acceptance", margin + 22.5, footerY + 5, { align: "center" });

  const rightX = 150;
  doc.line(rightX, footerY, 196, footerY);
  doc.setFont("helvetica", "bold");
  doc.text((company?.name || "Moon Textile").toUpperCase(), 173, footerY + 12, {
    align: "center",
  });
  doc.setFont("helvetica", "normal");
  doc.text("Authorised Signature", 173, footerY + 5, { align: "center" });

  const filename = `PI_${invoice.piNumber || "Invoice"}.pdf`;
  doc.save(filename);
};

