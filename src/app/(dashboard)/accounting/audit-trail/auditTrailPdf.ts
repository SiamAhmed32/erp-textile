import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { AuditEntry } from "./types";
import { drawHeader } from "@/utils/pdfHeader";

const getCategoryLabel = (category: string) => {
  return category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const getEntryAmount = (entry: AuditEntry): number => {
  if (!entry.lines || entry.lines.length === 0) return 0;
  return entry.lines
    .filter((l) => l.type === "DEBIT")
    .reduce((sum, l) => sum + Number(l.amount), 0);
};

export const exportAuditTrailToPdf = async (
  items: AuditEntry[],
  companyProfile: any,
  userName: string,
  dateFrom?: string,
  dateTo?: string
) => {
  const doc = new jsPDF("l", "mm", "a4"); // Landscape for audit trails (standard)
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // Header
  const title = "System Audit Trail Report";
  const startY = await drawHeader(doc, companyProfile, title, new Date());
  let currentY = startY;

  // Meta info (Filters applied)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100);

  let metaText = "";
  if (dateFrom && dateTo) {
    metaText += `Report Period: ${format(new Date(dateFrom), "dd MMM yyyy")} to ${format(new Date(dateTo), "dd MMM yyyy")}`;
  }

  if (metaText) {
    doc.text(metaText, margin, currentY);
    currentY += 6;
  }

  // Table Data
  const tableData = items.map((row) => {
    const amount = getEntryAmount(row);
    return [
      format(new Date(row.date), "dd MMM yyyy\nhh:mm a"),
      row.voucherNo,
      getCategoryLabel(row.category),
      row.buyer?.name || row.supplier?.name || "General Ledger",
      row.narration || "—",
      `BDT ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [["Date & Time", "Voucher No", "Type", "Entity / Party", "Narration", "Amount"]],
    body: tableData,
    theme: "grid",
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      valign: "middle",
      font: "helvetica",
      textColor: [30, 41, 59], // Slate-800
      lineColor: [226, 232, 240], // Slate-200
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [15, 23, 42], // Slate-900 (Industry Standard)
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 35, halign: "left" },
      1: { cellWidth: 35, fontStyle: "bold", halign: "center" },
      2: { cellWidth: 30, halign: "center" },
      3: { cellWidth: 45 },
      4: { cellWidth: "auto" },
      5: { cellWidth: 40, halign: "right", fontStyle: "bold" },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Slate-50
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY || currentY;

  // Footer: Printed by info
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    
    // Page X of Y
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );

    // Printed By
    const printStr = `Printed by: ${userName} on ${format(new Date(), "dd MMM yyyy, hh:mm a")}`;
    doc.text(printStr, margin, doc.internal.pageSize.getHeight() - 10);
    
    // System ID (Optional but industry standard)
    doc.text(
        "Moon ERP - Audit Trail Module",
        pageWidth - margin,
        doc.internal.pageSize.getHeight() - 10,
        { align: "right" }
      );
  }

  // Save PDF
  const filename = `Audit_Trail_${format(new Date(), "yyyyMMdd_HHmm")}.pdf`;
  doc.save(filename);
};
