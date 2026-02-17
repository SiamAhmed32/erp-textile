import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LCManagement } from "./types";

export const exportLCToPdf = (lc: LCManagement) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Header - Company Name
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text("MOON TEXTILE", pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 8;

  // Company Sub-header
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text("ERP SYSTEM - LC MANAGEMENT MODULE", pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 12;

  // Horizontal line
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.5);
  doc.line(15, yPosition, pageWidth - 15, yPosition);
  yPosition += 15;

  // Document Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text("BACK-TO-BACK LETTER OF CREDIT (BBLC)", 15, yPosition);
  
  // Expiry Badge placeholder (Text)
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`BBLC NO: ${lc.bblcNumber}`, pageWidth - 15, yPosition, { align: "right" });
  yPosition += 12;

  // Info Grid - Section 1: Opening Details
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85); // Slate 700
  doc.text("1. OPENING DETAILS", 15, yPosition);
  yPosition += 6;

  const openingDetails = [
    ["Date of Opening", formatDate(lc.dateOfOpening)],
    ["Issue Date", formatDate(lc.issueDate)],
    ["Expiry Date", formatDate(lc.expiryDate)],
    ["Notify Party", lc.notifyParty || "N/A"],
    ["Destination", lc.destination || "N/A"],
  ];

  autoTable(doc, {
    startY: yPosition,
    body: openingDetails,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50, textColor: [100, 116, 139] },
      1: { textColor: [15, 23, 42] },
    },
    margin: { left: 15 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Info Grid - Section 2: Financial & Banking
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("2. FINANCIAL & BANKING", 15, yPosition);
  yPosition += 6;

  const financialDetails = [
    ["LC Amount", `US$ ${Number(lc.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`],
    ["Issuing Bank", lc.lcIssueBankName],
    ["Bank Branch", lc.lcIssueBankBranch],
  ];

  autoTable(doc, {
    startY: yPosition,
    body: financialDetails,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50, textColor: [100, 116, 139] },
      1: { textColor: [15, 23, 42] },
    },
    margin: { left: 15 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Info Grid - Section 3: Linked Proforma Invoice
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("3. LINKED DOCUMENTS", 15, yPosition);
  yPosition += 6;

  const linkedDetails = [
    ["PI Number", lc.invoice?.piNumber || "N/A"],
    ["Order Number", lc.invoice?.order?.orderNumber || "N/A"],
    ["Buyer", lc.invoice?.order?.buyer?.name || "N/A"],
    ["Product Type", lc.invoice?.order?.productType || "N/A"],
  ];

  autoTable(doc, {
    startY: yPosition,
    body: linkedDetails,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50, textColor: [100, 116, 139] },
      1: { textColor: [15, 23, 42] },
    },
    margin: { left: 15 },
  });

  // Footer / Signatures
  yPosition = 250;
  doc.setDrawColor(226, 232, 240);
  doc.line(20, yPosition, 80, yPosition);
  doc.line(pageWidth - 80, yPosition, pageWidth - 20, yPosition);

  yPosition += 5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("PREPARED BY", 50, yPosition, { align: "center" });
  doc.text("AUTHORISED SIGNATORY", pageWidth - 50, yPosition, { align: "center" });

  yPosition += 5;
  doc.setFont("helvetica", "normal");
  doc.text(`${lc.user?.firstName || "System"} ${lc.user?.lastName || "User"}`, 50, yPosition, { align: "center" });
  doc.text("MOON TEXTILE", pageWidth - 50, yPosition, { align: "center" });

  // Save the PDF
  doc.save(`LC_BBLC_${lc.bblcNumber}.pdf`);
};
