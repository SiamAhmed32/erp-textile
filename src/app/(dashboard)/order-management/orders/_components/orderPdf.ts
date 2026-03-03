import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Order } from "./types";
import { drawHeader } from "@/utils/pdfHeader";

export const exportOrderToPdf = async (order: Order) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Get order items
  const orderItems = Array.isArray(order.orderItems)
    ? order.orderItems
    : order.orderItems
      ? [order.orderItems]
      : [];
  const item = orderItems[0] || null;
  const fabricItem = item?.fabricItem;
  const labelItem = item?.labelItem;
  const cartonItem = item?.cartonItem;

  // Header - Logo, Company Info, Title
  const startY = await drawHeader(doc, order.companyProfile, "Order Invoice", order.orderDate || undefined);
  let currentY = startY;

  // ── Header Information Table Layout (Buyer vs Doc Details) ──
  const margin = 14;
  const col1X = margin;
  const col2X = 130; // Label column start
  const col2ValX = 160; // Value column start
  const rightColWidth = 40;

  // Left Column: Buyer Information
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("FOR ACCOUNT & RISK OF MESSERS:", col1X, currentY);
  currentY += 6;
  
  doc.setFontSize(11);
  doc.setTextColor(0);
  const buyerNameStr = (order.buyer?.name || "N/A").toUpperCase();
  doc.text(buyerNameStr, col1X, currentY);
  currentY += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const buyerAddr = order.buyer?.address || "";
  const buyerLoc = order.buyer?.location || "";
  const fullAddr = [buyerAddr, buyerLoc].filter(Boolean).join(", ");
  const splitAddress = doc.splitTextToSize(fullAddr, 100);
  doc.text(splitAddress, col1X, currentY);
  const addressHeight = splitAddress.length * 4.5;

  // Right Column: Order & Timeline Info (Sync with Left)
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

  drawRow("Date:", order.orderDate ? new Date(order.orderDate).toLocaleDateString("en-GB") : "-");
  drawRow("Order No:", order.orderNumber || "-");
  drawRow("Status:", order.status || "-");
  if (order.deliveryDate) {
    drawRow("Delivery:", new Date(order.deliveryDate).toLocaleDateString("en-GB"));
  }

  currentY = Math.max(currentY + addressHeight + 8, ry + 5);

  // Product Table
  let tableFinalY = currentY;
  let totalOrderAmount = 0;

  if (order.productType === "FABRIC" && fabricItem?.fabricItemData) {
    const rows = fabricItem.fabricItemData;
    const tableData = rows.map((row: any, index: number) => {
      const qty = Number(row.quantityYds) || 0;
      const price = Number(row.unitPrice) || 0;
      const amount = Number(row.totalAmount) || (qty * price);
      totalOrderAmount += amount;
      return [
        index === 0 ? (fabricItem?.styleNo || "-") : "",
        index === 0 ? (fabricItem?.discription || "-") : "",
        index === 0 ? (fabricItem?.width || "-") : "",
        row.color || "-",
        row.netWeight ?? "-",
        row.grossWeight ?? "-",
        qty.toString(),
        `$${price.toFixed(2)}`,
        `$${amount.toFixed(2)}`,
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [["Style No", "Description", "Width", "Colour", "Net Weight", "Gross Weight", "Qty (Yds)", "Unit Price", "Total (US$)"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2, halign: "center", font: "helvetica", textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
      headStyles: { fillColor: [248, 250, 252], fontStyle: "bold" },
      columnStyles: { 0: { halign: "left" }, 1: { halign: "left" } },
    });
    tableFinalY = (doc as any).lastAutoTable.finalY;
  } else if (order.productType === "LABEL_TAG" && labelItem?.labelItemData) {
    const rows = labelItem.labelItemData;
    const tableData = rows.map((row: any, index: number) => {
      const qty = Number(row.quantityDzn || row.quantityPcs || 0);
      const price = Number(row.unitPrice) || 0;
      const amount = Number(row.totalAmount) || (qty * price);
      totalOrderAmount += amount;
      return [
        index === 0 ? (labelItem?.styleNo || "-") : "",
        row.desscription || "-",
        row.color || "-",
        row.netWeight ?? "-",
        row.grossWeight ?? "-",
        row.quantityDzn ?? "-",
        row.quantityPcs ?? "-",
        `$${price.toFixed(2)}`,
        `$${amount.toFixed(2)}`,
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [["Style No", "Description", "Colour", "Net Weight", "Gross Weight", "Qty (Dzn)", "Qty (Pcs)", "Unit Price", "Total (US$)"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2, halign: "center", font: "helvetica", textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
      headStyles: { fillColor: [248, 250, 252], fontStyle: "bold" },
    });
    tableFinalY = (doc as any).lastAutoTable.finalY;
  } else if (order.productType === "CARTON" && cartonItem?.cartonItemData) {
    const rows = cartonItem.cartonItemData;
    const tableData = rows.map((row: any, index: number) => {
      const qty = Number(row.cartonQty) || 0;
      const price = Number(row.unitPrice) || 0;
      const amount = Number(row.totalAmount) || (qty * price);
      totalOrderAmount += amount;
      return [
        index === 0 ? (cartonItem?.orderNo || "-") : "",
        row.cartonMeasurement || "-",
        row.cartonPly || "-",
        qty.toString(),
        row.netWeight ?? "-",
        row.grossWeight ?? "-",
        row.unit || "-",
        `$${price.toFixed(2)}`,
        `$${amount.toFixed(2)}`,
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [["Order No", "Measurement", "Ply", "Qty", "Net Weight", "Gross Weight", "Unit", "Unit Price", "Total (US$)"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2, halign: "center", font: "helvetica", textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
      headStyles: { fillColor: [248, 250, 252], fontStyle: "bold" },
    });
    tableFinalY = (doc as any).lastAutoTable.finalY;
  }

  currentY = tableFinalY;

  // ── Total & Amount in Words ─────────────────────────────────
  autoTable(doc, {
    startY: currentY,
    body: [[
      { content: "Grand Total Amount (US$):", styles: { halign: "right", fontStyle: "bold" } },
      { content: `$${totalOrderAmount.toFixed(2)}`, styles: { halign: "right", fontStyle: "bold" } },
    ]],
    theme: "plain",
    styles: { fontSize: 9, cellPadding: 1, textColor: [0, 0, 0] },
    columnStyles: { 0: { cellWidth: 154 }, 1: { cellWidth: 32 } },
  });
  currentY = (doc as any).lastAutoTable.finalY + 5;

  // Amount in Word Box
  const { numberToWords } = await import("@/utils/numberToWords");
  doc.setDrawColor(0);
  doc.rect(margin, currentY, 182, 9);
  doc.setFontSize(8.5);
  doc.text(`Total Amount (in Words): US Dollar ${numberToWords(totalOrderAmount)}`, margin + 2, currentY + 6);
  currentY += 16;

  // Remarks
  if (order.remarks) {
    doc.setFont("helvetica", "bold");
    doc.text("Remarks: ", margin, currentY);
    doc.setFont("helvetica", "normal");
    const splitRemarks = doc.splitTextToSize(order.remarks, 150);
    doc.text(splitRemarks, margin + 20, currentY);
    currentY += splitRemarks.length * 4.5 + 5;
  }

  // ── Banking Context ─────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.text("Banking Details / Exporter Identity:", margin, currentY);
  currentY += 5;
  doc.setFont("helvetica", "normal");
  doc.text(`Bank Name: ${order.companyProfile?.bankName || "National Bank Limited"}`, margin, currentY);
  currentY += 4;
  doc.text(`A/C Name: ${order.companyProfile?.name || "Moon Textile"}`, margin, currentY);
  currentY += 4;
  doc.text(`A/C No: ${order.companyProfile?.bankAccountNumber || "0116-3112001201"}`, margin, currentY);
  currentY += 10;

  // ── Signature Section ────────────────────────────────────────
  const pageHeight = doc.internal.pageSize.getHeight();
  if (currentY > pageHeight - 40) doc.addPage();
  const footerY = pageHeight - 25;

  doc.setLineWidth(0.3);
  // Left Signature
  doc.line(margin, footerY, margin + 45, footerY);
  doc.setFontSize(8);
  doc.text("Bayer Acceptance", margin, footerY + 5);

  // Right Signature
  const rightX = 150;
  doc.line(rightX, footerY, 196, footerY);
  doc.setFont("helvetica", "bold");
  doc.text(`For ${order.companyProfile?.name || "Moon Textile."}`, rightX, footerY + 12);
  doc.setFont("helvetica", "normal");
  doc.text("Authorised Signature", rightX, footerY + 5);

  // Save the PDF
  doc.save(`Order_Invoice_${order.orderNumber}.pdf`);
};
