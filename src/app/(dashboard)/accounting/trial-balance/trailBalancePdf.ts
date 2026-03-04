import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { drawHeader } from "@/utils/pdfHeader";

export const exportTrialBalanceToPdf = async (data: any) => {
    const doc = new jsPDF("l", "mm", "a4"); // Landscape for multi-column financial reports
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    const { report, company, period, generatedAt } = data;

    // --- Header Section ---
    const startY = await drawHeader(doc, company, "TRIAL BALANCE REPORT", generatedAt);
    let currentY = startY;

    // Meta info (Filters applied)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100);

    const periodText = `Report Period: ${format(new Date(period.startDate), "dd MMM yyyy")} to ${format(new Date(period.endDate), "dd MMM yyyy")}`;
    doc.text(periodText, margin, currentY);
    currentY += 6;

    // --- Table Data Preparation ---
    const tableRows = report.map((item: any) => [
        item.accountName,
        item.accountType.replace(/_/g, " "),
        item.openingDebit > 0 ? item.openingDebit.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00",
        item.openingCredit > 0 ? item.openingCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00",
        item.periodDebit > 0 ? item.periodDebit.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00",
        item.periodCredit > 0 ? item.periodCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00",
        item.closingDebit > 0 ? item.closingDebit.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00",
        item.closingCredit > 0 ? item.closingCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00",
    ]);

    // Totals
    const totals = report.reduce((acc: any, curr: any) => ({
        opDr: acc.opDr + curr.openingDebit,
        opCr: acc.opCr + curr.openingCredit,
        perDr: acc.perDr + curr.periodDebit,
        perCr: acc.perCr + curr.periodCredit,
        clDr: acc.clDr + curr.closingDebit,
        clCr: acc.clCr + curr.closingCredit,
    }), { opDr: 0, opCr: 0, perDr: 0, perCr: 0, clDr: 0, clCr: 0 });

    tableRows.push([
        { content: "GRAND SUMMARY TOTALS", colSpan: 2, styles: { fontStyle: "bold", fillColor: [248, 250, 252], textColor: [71, 85, 105] } },
        { content: totals.opDr.toLocaleString("en-IN", { minimumFractionDigits: 2 }), styles: { fontStyle: "bold", fillColor: [248, 250, 252] } },
        { content: totals.opCr.toLocaleString("en-IN", { minimumFractionDigits: 2 }), styles: { fontStyle: "bold", fillColor: [248, 250, 252] } },
        { content: totals.perDr.toLocaleString("en-IN", { minimumFractionDigits: 2 }), styles: { fontStyle: "bold", fillColor: [248, 250, 252], textColor: [79, 70, 229] } },
        { content: totals.perCr.toLocaleString("en-IN", { minimumFractionDigits: 2 }), styles: { fontStyle: "bold", fillColor: [248, 250, 252], textColor: [225, 29, 72] } },
        { content: totals.clDr.toLocaleString("en-IN", { minimumFractionDigits: 2 }), styles: { fontStyle: "bold", fillColor: [248, 250, 252], textColor: [15, 23, 42] } },
        { content: totals.clCr.toLocaleString("en-IN", { minimumFractionDigits: 2 }), styles: { fontStyle: "bold", fillColor: [248, 250, 252], textColor: [15, 23, 42] } },
    ]);

    // --- Render Table ---
    autoTable(doc, {
        startY: currentY,
        head: [[
            { content: "Account Head / Category", rowSpan: 2 },
            { content: "Type", rowSpan: 2 },
            { content: "Opening Balance", colSpan: 2, styles: { halign: "center" } },
            { content: "Period Activity", colSpan: 2, styles: { halign: "center" } },
            { content: "Closing Balance", colSpan: 2, styles: { halign: "center" } },
        ], [
            "Debit", "Credit", "Debit", "Credit", "Debit", "Credit"
        ]],
        body: tableRows,
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
            fillColor: [15, 23, 42], // Slate-900 
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center",
            fontSize: 9,
        },
        columnStyles: {
            0: { cellWidth: "auto" },
            1: { cellWidth: 35 },
            2: { halign: "right", cellWidth: 30 },
            3: { halign: "right", cellWidth: 30 },
            4: { halign: "right", cellWidth: 30 },
            5: { halign: "right", cellWidth: 30 },
            6: { halign: "right", cellWidth: 30 },
            7: { halign: "right", cellWidth: 30 },
        },
        alternateRowStyles: {
            fillColor: [252, 254, 255], 
        },
        margin: { left: margin, right: margin }
    });

    const finalY = (doc as any).lastAutoTable.finalY || currentY;

    // --- Footer Section ---
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

        // Printed By info
        const printStr = `Printed on ${format(new Date(), "dd MMM yyyy, hh:mm a")}`;
        doc.text(printStr, margin, doc.internal.pageSize.getHeight() - 10);
        
        doc.text(
            "Moon ERP - Financial Reports",
            pageWidth - margin,
            doc.internal.pageSize.getHeight() - 10,
            { align: "right" }
          );
    }

    // Save PDF
    const filename = `Trial_Balance_${format(new Date(period.startDate), "yyyyMMdd")}_to_${format(new Date(period.endDate), "yyyyMMdd")}.pdf`;
    doc.save(filename);
};
