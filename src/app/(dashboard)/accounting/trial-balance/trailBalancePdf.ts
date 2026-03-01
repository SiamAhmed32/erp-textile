import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { drawHeader } from "@/utils/pdfHeader";

export const exportTrialBalanceToPdf = async (data: any) => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    const { report, company, period, generatedAt } = data;

    // --- Header Section ---
    const startY = await drawHeader(doc, company, "TRIAL BALANCE", generatedAt);
    let y = startY;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    const periodText = `Period: ${format(new Date(period.startDate), "dd MMM yyyy")} to ${format(new Date(period.endDate), "dd MMM yyyy")}`;
    doc.text(periodText, margin, y);
    
    const genText = `Generated on: ${format(new Date(generatedAt), "dd/MM/yyyy HH:mm")}`;
    doc.text(genText, pageWidth - margin, y, { align: "right" });
    y += 10;

    // --- Table Data Preparation ---
    const tableRows = report.map((item: any) => [
        item.accountName,
        item.accountType.replace(/_/g, " "),
        item.openingDebit > 0 ? item.openingDebit.toLocaleString() : "-",
        item.openingCredit > 0 ? item.openingCredit.toLocaleString() : "-",
        item.periodDebit > 0 ? item.periodDebit.toLocaleString() : "-",
        item.periodCredit > 0 ? item.periodCredit.toLocaleString() : "-",
        item.closingDebit > 0 ? item.closingDebit.toLocaleString() : "-",
        item.closingCredit > 0 ? item.closingCredit.toLocaleString() : "-",
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
        { content: "GRAND TOTAL", colSpan: 2, styles: { fontStyle: "bold", fillColor: [240, 240, 240] } },
        { content: totals.opDr.toLocaleString(), styles: { fontStyle: "bold", fillColor: [240, 240, 240] } },
        { content: totals.opCr.toLocaleString(), styles: { fontStyle: "bold", fillColor: [240, 240, 240] } },
        { content: totals.perDr.toLocaleString(), styles: { fontStyle: "bold", fillColor: [240, 240, 240] } },
        { content: totals.perCr.toLocaleString(), styles: { fontStyle: "bold", fillColor: [240, 240, 240] } },
        { content: totals.clDr.toLocaleString(), styles: { fontStyle: "bold", fillColor: [240, 240, 240] } },
        { content: totals.clCr.toLocaleString(), styles: { fontStyle: "bold", fillColor: [240, 240, 240] } },
    ]);

    // --- Render Table ---
    autoTable(doc, {
        startY: y,
        head: [[
            { content: "Account Name", rowSpan: 2 },
            { content: "Type", rowSpan: 2 },
            { content: "Opening Balance", colSpan: 2, styles: { halign: "center" } },
            { content: "Period Activity", colSpan: 2, styles: { halign: "center" } },
            { content: "Closing Balance", colSpan: 2, styles: { halign: "center" } },
        ], [
            "Debit", "Credit", "Debit", "Credit", "Debit", "Credit"
        ]],
        body: tableRows,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [40, 40, 40], textColor: 255, halign: "center" },
        columnStyles: {
            2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "right" },
            5: { halign: "right" },
            6: { halign: "right" },
            7: { halign: "right" },
        },
        margin: { left: margin, right: margin }
    });

    // --- Footer Section ---
    const finalY = (doc as any).lastAutoTable.finalY + 30;
    doc.setFontSize(10);
    doc.line(margin, finalY, margin + 50, finalY);
    doc.text("Prepared By", margin, finalY + 5);

    doc.line(pageWidth - margin - 50, finalY, pageWidth - margin, finalY);
    doc.text("Authorized Signature", pageWidth - margin, finalY + 5, { align: "right" });

    doc.save(`Trial_Balance_${format(new Date(period.startDate), "yyyy-MM-dd")}_to_${format(new Date(period.endDate), "yyyy-MM-dd")}.pdf`);
};
