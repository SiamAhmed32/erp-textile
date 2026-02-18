import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LCManagement } from "./types";
import { numberToWords } from "@/utils/numberToWords";

export const exportLCToPdf = (lc: LCManagement) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  let y = margin + 5;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const invoice = lc.invoice;
  const order = invoice?.order;
  const buyer = order?.buyer;
  const company = order?.companyProfile;

  // Set font to Times for professional serif look matching LCDocumentView
  doc.setFont("times", "normal");

  // Draw Main Outer Box with thicker border (matching border-2)
  doc.setLineWidth(0.6);
  doc.rect(margin, y, pageWidth - 2 * margin, 240); 

  // --- TOP ROW ---
  doc.line(margin, y + 30, pageWidth - margin, y + 30); // Horizontal row divider
  doc.line(pageWidth / 2, y, pageWidth / 2, y + 30);   // Vertical column divider

  // Left: Account of Messers
  doc.setFontSize(8);
  doc.setFont("times", "bolditalic");
  doc.text("For Account & Risk of Messers:", margin + 3, y + 6);
  
  doc.setFontSize(10);
  doc.setFont("times", "bold");
  doc.text(buyer?.name || "CUSTOMER NAME", margin + 3, y + 13);
  
  doc.setFontSize(8);
  doc.setFont("times", "normal");
  const addressLines = doc.splitTextToSize(buyer?.address || "CUSTOMER ADDRESS", (pageWidth / 2) - 10);
  doc.text(addressLines, margin + 3, y + 18);

  // Right: Document Metadata
  doc.setFontSize(9);
  const labelsX = (pageWidth / 2) + 3;
  const valuesX = pageWidth - 15;

  const metadata = [
    ["Invoice No", `: ${invoice?.piNumber || "N/A"}`],
    ["Date", `: ${formatDate(invoice?.date)}`],
    ["B B L/C No.", `: ${lc.bblcNumber || "N/A"}`],
    ["Date of Opening", `: ${formatDate(lc.dateOfOpening)}`],
  ];

  metadata.forEach((row, i) => {
    doc.setFont("times", "bold");
    doc.text(row[0], labelsX, y + 8 + (i * 6));
    doc.text(row[1], valuesX, y + 8 + (i * 6), { align: "right" });
  });

  y += 30;

  // --- SECOND ROW (Notify Party & Bank) ---
  doc.line(margin, y + 25, pageWidth - margin, y + 25); 
  doc.line(pageWidth / 2, y, pageWidth / 2, y + 25);   

  // Left: Notify Party
  doc.setFontSize(10);
  doc.setFont("times", "bold");
  doc.text("Notify Party :", margin + 3, y + 8);
  doc.setFont("times", "normal");
  doc.text(lc.notifyParty || "Same as buyer", margin + 28, y + 8);

  // Right: Bank Details
  doc.setFont("times", "bold");
  doc.text("L/C Issuing Bank :", (pageWidth / 2) + 3, y + 8);
  doc.setFontSize(9);
  doc.text(lc.lcIssueBankName || "N/A", (pageWidth / 2) + 35, y + 8, { maxWidth: 55 });
  doc.setFont("times", "normal");
  doc.text(lc.lcIssueBankBranch || "N/A", (pageWidth / 2) + 35, y + 13, { maxWidth: 55 });

  y += 25;

  // --- THIRD ROW (Destination & PI/Export Details) ---
  doc.line(margin, y + 30, pageWidth - margin, y + 30); 
  doc.line(pageWidth / 2, y, pageWidth / 2, y + 30);   

  // Left: Destination
  doc.setFontSize(10);
  doc.setFont("times", "bold");
  doc.text("Destination :", margin + 3, y + 10);
  doc.setFont("times", "normal");
  doc.text(lc.destination || "Customers Factory", margin + 28, y + 10);

  // Right: PI / Export LC / BIN / HS
  doc.setFontSize(9);
  const docDetails = [
    ["P.I.No. & Date", `: ${invoice?.piNumber} Date-${formatDate(invoice?.date)}`],
    ["Export L/C No", `: ${lc.exportLcNo} DATED: ${formatDate(lc.exportLcDate)}`],
    ["BIN No.", `: ${lc.binNo}`],
    ["H.S Code NO", `: ${lc.hsCodeNo}`],
  ];

  docDetails.forEach((row, i) => {
    doc.setFont("times", "bold");
    doc.text(row[0], (pageWidth / 2) + 3, y + 7 + (i * 6));
    doc.text(row[1], (pageWidth / 2) + 30, y + 7 + (i * 6));
  });

  y += 30;

  // --- REMARKS SECTION ---
  doc.line(margin, y + 15, pageWidth - margin, y + 15);
  doc.setFontSize(10);
  doc.setFont("times", "bold");
  doc.text("Remarks :", margin + 3, y + 8);
  doc.setFont("times", "italic");
  doc.setFontSize(9);
  const remarksLines = doc.splitTextToSize(lc.remarks || "", pageWidth - margin - 35);
  doc.text(remarksLines, margin + 22, y + 8);

  y += 15;

  // --- TABLE SECTION ---
  const tableData: any[] = [];
  const orderItems = Array.isArray(order?.orderItems) ? order.orderItems : (order?.orderItems ? [order.orderItems] : []);

  orderItems.forEach((item: any) => {
    if (item.fabricId && item.fabricItem) {
      const f = item.fabricItem;
      const data = Array.isArray(f.fabricItemData) ? f.fabricItemData : [f.fabricItemData];
      data.forEach((d: any) => {
        tableData.push([
          f.styleNo || order.orderNumber,
          f.discription || "Fabric Item",
          f.width || "N/A",
          d.color || "N/A",
          d.quantityYds || 0,
          `$ ${Number(d.unitPrice || 0).toFixed(2)}`,
          `$ ${Number(d.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        ]);
      });
    } else if (item.labelId && item.labelItem) {
        const label = item.labelItem;
        const data = Array.isArray(label.labelItemData) ? label.labelItemData : [];
        data.forEach((d: any) => {
            tableData.push([
                label.styleNo || order.orderNumber,
                d.desscription || "Label Item",
                "N/A",
                d.color || "N/A",
                d.quantityPcs || d.quantityDzn || 0,
                `$ ${Number(d.unitPrice || 0).toFixed(2)}`,
                `$ ${Number(d.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            ]);
        });
    }
  });

  autoTable(doc, {
    startY: y,
    head: [["STYLE NO/PO NO", "DESCRIPTION", "WIDTH", "COLOR", "QUANTITY IN YDS", "UNIT PRICE IN US $", "AMOUNT IN US DOLLAR"]],
    body: tableData,
    theme: "plain",
    styles: {
      font: "times",
      fontSize: 8,
      cellPadding: 1.5,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      halign: "center",
      textColor: [0, 0, 0],
    },
    headStyles: {
      fontStyle: "bold",
      fillColor: [240, 240, 240],
      lineWidth: 0.3,
    },
    columnStyles: {
      1: { halign: "left", cellWidth: "auto" },
      6: { halign: "right", fontStyle: "bold" },
    },
    margin: { left: margin, right: margin },
  });

  y = (doc as any).lastAutoTable.finalY;

  // --- TOTAL ROW ---
  doc.line(margin, y, pageWidth - margin, y);
  doc.setFontSize(9);
  doc.setFont("times", "bolditalic");
  doc.text("TOTAL :", pageWidth - 100, y + 6);
  
  doc.setFont("times", "bold");
  const totalQty = tableData.reduce((sum, row) => sum + Number(row[4] || 0), 0);
  doc.text(`${totalQty}`, pageWidth - 70, y + 6, { align: "center" });
  doc.text("US $", pageWidth - 45, y + 6, { align: "center" });
  doc.text(`$ ${Number(lc.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, pageWidth - 12, y + 6, { align: "right" });

  doc.line(margin, y + 10, pageWidth - margin, y + 10);
  y += 10;

  // --- AMOUNT IN WORDS (FIXED OVERFLOW) ---
  doc.setFontSize(10);
  doc.setFont("times", "bold");
  const words = `Total Amount (in word): US Dollar: ${numberToWords(Number(lc.amount))}`;
  const wordLines = doc.splitTextToSize(words, pageWidth - (2 * margin) - 4);
  doc.text(wordLines, margin + 4, y + 6);
  
  // Close the main box dynamically based on content height
  const finalBoxHeight = y + (wordLines.length * 5) + 2 - (margin + 5);
  doc.setLineWidth(0.6);
  doc.rect(margin, margin + 5, pageWidth - 2 * margin, finalBoxHeight);
  y += (wordLines.length * 5) + 5;

  // --- SHIPPING & WEIGHTS (OUTSIDE BOX) ---
  y += 10;
  doc.setFontSize(9);
  doc.setFont("times", "bold");
  
  const footers = [
    ["CARRIER", `: ${lc.carrier || "N/A"}`, "TOTAL NET WEIGHT", `: ${(order?.orderItems?.[0] as any)?.fabricItem?.totalNetWeight || "N/A"} KG`],
    ["SALES TERM", `: ${lc.salesTerm || "N/A"}`, "TOTAL GROSS WEIGHT", `: ${(order?.orderItems?.[0] as any)?.fabricItem?.totalGrossWeight || "N/A"} KG`],
  ];

  footers.forEach((row, i) => {
    doc.text(row[0], margin + 2, y + (i * 6));
    doc.text(row[1], margin + 35, y + (i * 6));
    doc.text(row[2], pageWidth / 2 + 10, y + (i * 6));
    doc.text(row[3], pageWidth / 2 + 55, y + (i * 6));
  });

  // --- SIGNATURES ---
  y += 35;
  doc.setLineWidth(0.2);
  doc.line(margin + 5, y, margin + 55, y);
  doc.line(pageWidth - 75, y, pageWidth - 15, y);

  doc.setFontSize(8);
  doc.setFont("times", "bold");
  doc.text("APPROVED BY", margin + 30, y + 5, { align: "center" });
  
  doc.setFontSize(10);
  doc.text(`For ${company?.name || "COMPANY NAME"}`, pageWidth - 45, y - 5, { align: "center" });
  doc.setFontSize(8);
  doc.text("AUTHORIZED SIGNATORY", pageWidth - 45, y + 5, { align: "center" });

  doc.save(`LC_BBLC_${lc.bblcNumber || "document"}.pdf`);
};

export const exportExporterCertificate = (lc: LCManagement, type: "beneficiary" | "origin", customDate?: string) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const title = type === "beneficiary" ? "Beneficiary Certificate" : "Certificate of Origin";
  const certDate = customDate ? formatDate(customDate) : formatDate(new Date().toISOString());

  doc.setFont("times", "normal");
  
  // Date line
  doc.setFontSize(10);
  doc.setFont("times", "bold");
  doc.text(`Date : ${certDate}`, margin, y);
  y += 15;

  // Title
  doc.setFontSize(22);
  doc.setFont("times", "bold");
  doc.text(title, pageWidth / 2, y, { align: "center" });
  
  // Underline for title
  doc.setLineWidth(0.8);
  doc.line((pageWidth/2) - (doc.getTextWidth(title) / 2), y + 2, (pageWidth/2) + (doc.getTextWidth(title) / 2), y + 2);
  y += 20;

  // Declaration Paragraph
  doc.setFontSize(10);
  doc.setFont("times", "bold");
  const piNo = lc.invoice?.piNumber || "N/A";
  const piDate = formatDate(lc.invoice?.date);
  const lcNo = lc.bblcNumber || "N/A";
  const lcDate = formatDate(lc.dateOfOpening);

  const declarationText = `This is to certify that the following mentioned products are of Bangladesh Origin and been delivered in accordance with the Proforma Invoice no :  ${piNo} Date-${piDate} , against Back-to-Back L/C No. ${lcNo} Date: ${lcDate} in completing with the all other terms and conditions.`;
  
  const splitText = doc.splitTextToSize(declarationText, pageWidth - (2 * margin));
  doc.text(splitText, margin, y, { lineHeightFactor: 1.5 });
  y += (splitText.length * 6) + 10;

  // Buyer's Name
  doc.setFont("times", "bold");
  doc.text("Buyer's Name   :", margin, y);
  doc.text(lc.invoice?.order?.buyer?.name || "N/A", margin + 28, y);
  y += 15;

  // Table Data Preparation
  const tableData: any[] = [];
  const orderItems = Array.isArray(lc.invoice?.order?.orderItems) ? lc.invoice.order.orderItems : (lc.invoice?.order?.orderItems ? [lc.invoice.order.orderItems] : []);

  orderItems.forEach((item: any) => {
    if (item.fabricId && item.fabricItem) {
      const f = item.fabricItem;
      const data = Array.isArray(f.fabricItemData) ? f.fabricItemData : [f.fabricItemData];
      data.forEach((d: any) => {
        tableData.push([
          f.styleNo || "N/A",
          f.discription || "Fabric Item",
          f.width || "",
          d.color || "N/A",
          d.quantityYds || 0,
          `$      ${Number(d.unitPrice || 0).toFixed(2)}`,
          `$      ${Number(d.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        ]);
      });
    } else if (item.labelId && item.labelItem) {
        const label = item.labelItem;
        const data = Array.isArray(label.labelItemData) ? label.labelItemData : [];
        data.forEach((d: any) => {
            tableData.push([
                label.styleNo || "N/A",
                d.desscription || "Label Item",
                "",
                d.color || "N/A",
                d.quantityPcs || d.quantityDzn || 0,
                `$      ${Number(d.unitPrice || 0).toFixed(2)}`,
                `$      ${Number(d.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            ]);
        });
    }
  });

  autoTable(doc, {
    startY: y,
    head: [["Style No/Po No", "Description", "Width", "Color", "Quantity In Yds", "Unit Price In US $", "Amount In US Dollar"]],
    body: tableData,
    theme: "plain",
    styles: {
      font: "times",
      fontSize: 8,
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      halign: "center",
      textColor: [0, 0, 0],
      valign: "middle"
    },
    headStyles: {
      fontStyle: "bold",
      fillColor: undefined, // No fill matching image 
      lineWidth: 0.2, // Thicker header border
    },
    columnStyles: {
      1: { halign: "left", cellWidth: "auto" },
      6: { halign: "right", fontStyle: "bold" },
    },
    margin: { left: margin, right: margin },
  });

  y = (doc as any).lastAutoTable.finalY;

  // Total Row
  doc.line(margin, y, pageWidth - margin, y);
  doc.setFontSize(9);
  doc.setFont("times", "bold");
  const totalQty = tableData.reduce((sum, row) => sum + Number(row[4] || 0), 0);
  
  doc.text("Total:", pageWidth - 90, y + 6);
  doc.text(`${totalQty}`, pageWidth - 58, y + 6, { align: "center" });
  doc.text("US $", pageWidth - 38, y + 6, { align: "center" });
  doc.text(`$  ${Number(lc.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, pageWidth - margin - 2, y + 6, { align: "right" });
  
  doc.line(margin, y + 10, pageWidth - margin, y + 10);
  y += 10;

  // Amount In Words
  doc.setFontSize(9);
  doc.setFont("times", "bold");
  const wordValue = numberToWords(Number(lc.amount));
  doc.text(`Total Amount (in word): US Dollar: ${wordValue}`, margin, y + 6);
  y += 15;

  doc.save(`${title.replace(/ /g, "_")}_${lc.bblcNumber || "document"}.pdf`);
};

