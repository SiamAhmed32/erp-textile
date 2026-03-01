import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LCManagement } from "./types";
import { numberToWords } from "@/utils/numberToWords";
import { normalizeLCItems } from "./utils";
import { drawHeader } from "@/utils/pdfHeader";

/* ═══════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════ */

const fmt = (dateString?: string) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate().toString().padStart(2, "0")}-${months[d.getMonth()]}-${d.getFullYear().toString().slice(-2)}`;
};

const fmtFull = (dateString?: string) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]}-${d.getDate().toString().padStart(2, "0")}, ${d.getFullYear()}`;
};

const fmtLong = (dateString?: string) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const money = (n: number) =>
  Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ═══════════════════════════════════════════════════
   1. COMMERCIAL INVOICE
   ═══════════════════════════════════════════════════ */

export const exportCommercialInvoicePdf = async (lc: LCManagement) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const margin = 12;
  const boxW = pw - margin * 2;
  const midX = pw / 2;
  const rightCol = midX + 2;
  const invoice = lc.invoice;
  const order = invoice?.order;
  const buyer = order?.buyer;
  const company = order?.companyProfile;
  const items = normalizeLCItems(lc);

  // ── Company Header (Exporter) ──
  const startY = await drawHeader(doc, company, "Commercial Invoice");
  let y = startY;

  y -= 2; // Adjust for LC specific layout
  // ── Outer border box ──
  const boxTop = y - 2;

  // ── Row 1: Buyer info (left) + Invoice details (right) ──
  doc.setLineWidth(0.4);

  // Left column - Buyer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.text("For Account & Risk of Messers", margin + 2, y + 2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text((buyer?.name || "N/A").toUpperCase(), margin + 2, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  const buyerAddr = buyer?.address || "";
  const buyerLoc = buyer?.location || "";
  const displayAddr = [buyerAddr, buyerLoc].filter(Boolean).join(", ");
  const addrLines = doc.splitTextToSize(displayAddr, midX - margin - 6);
  doc.text(addrLines, margin + 2, y + 13);

  // Right column - Invoice info
  doc.setFontSize(8);
  const rLabelX = rightCol + 2;
  const rValX = rightCol + 38;
  let ry = y + 2;

  doc.setFont("helvetica", "bold");
  doc.text("Invoice No", rLabelX, ry);
  doc.text(`:  ${invoice?.piNumber || "N/A"}`, rValX, ry);
  ry += 6;
  doc.text("Date", rLabelX, ry);
  doc.text(`:  ${fmtFull(invoice?.date)}`, rValX, ry);
  ry += 6;
  doc.text("B B L/C No", rLabelX, ry);
  doc.text(`:  ${lc.bblcNumber}`, rValX, ry);
  ry += 6;
  doc.text("Date of Opening", rLabelX, ry);
  doc.text(`:  ${fmt(lc.dateOfOpening)}`, rValX, ry);
  ry += 6;
  doc.text("L/C Issuing Bank", rLabelX, ry);
  doc.text(`:  ${lc.lcIssueBankName?.toUpperCase() || ""}`, rValX, ry);
  ry += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(`   ${lc.lcIssueBankBranch || ""}`, rValX, ry);

  y = Math.max(y + 13 + (Array.isArray(addrLines) ? addrLines.length : 1) * 3.5, ry + 4);

  // Vertical divider line in header
  doc.setLineWidth(0.3);
  doc.line(midX, boxTop, midX, y);

  // Divider line
  doc.line(margin, y, pw - margin, y);

  // ── Row 2: Notify Party (left) + Bank details already above ──
  y += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Notify Party", margin + 2, y);
  doc.text(`:  ${lc.notifyParty || "Same as"}`, margin + 30, y);

  doc.line(margin, y + 4, pw - margin, y + 4);
  y += 9;

  // ── Row 3: Destination (left) + IDs (right) ──
  doc.text("Destination", margin + 2, y);
  doc.text(`:  ${lc.destination || "Buyers Factory."}`, margin + 30, y);

  // Right side IDs
  let idy = y - 2;
  doc.setFontSize(7.5);
  doc.text("P.I No & Date", rLabelX, idy);
  doc.text(`:  ${invoice?.piNumber || ""} Date-${fmtFull(invoice?.date)}`, rValX, idy);
  idy += 5;
  doc.text("Export L/C No", rLabelX, idy);
  doc.text(`:  ${lc.exportLcNo}`, rValX, idy);
  idy += 5;
  doc.text("BIN No.", rLabelX, idy);
  doc.text(`:  ${lc.binNo}`, rValX, idy);
  idy += 5;
  doc.text("H.S Code NO", rLabelX, idy);
  doc.text(`:  ${lc.hsCodeNo}`, rValX, idy);

  y = Math.max(y + 6, idy + 5);
  doc.line(margin, y, pw - margin, y);

  // ── Remarks section ──
  y += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Remarks :", margin + 2, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const remarkLines = doc.splitTextToSize(lc.remarks || "", boxW - 30);
  doc.text(remarkLines, margin + 22, y);
  y += Math.max((Array.isArray(remarkLines) ? remarkLines.length : 1) * 3.5, 5) + 3;
  doc.line(margin, y, pw - margin, y);

  // ── Items table ──
  const tableData = items.map(item => [
    item.style,
    item.description,
    item.width,
    item.color,
    String(item.qty),
    `$  ${Number(item.unitPrice).toFixed(2)}`,
    `$  ${money(item.amount)}`,
  ]);

  const totalQty = items.reduce((s, i) => s + Number(i.qty), 0);

  // Add total row
  tableData.push([
    "", "", "", "",
    { content: `Total:  ${totalQty}`, styles: { fontStyle: "bold" as const, halign: "center" as const } } as any,
    { content: "US  $", styles: { fontStyle: "bold" as const, halign: "center" as const } } as any,
    { content: `$  ${money(Number(lc.amount))}`, styles: { fontStyle: "bold" as const } } as any,
  ]);

  autoTable(doc, {
    startY: y,
    head: [[
      "Style No/Po No",
      "Description",
      "Width",
      "Color",
      "Quantity\nIn Yds",
      "Unit Price\nInUS  $",
      "Amount In\nUS Dollar",
    ]],
    body: tableData,
    theme: "grid",
    styles: {
      fontSize: 7.5,
      cellPadding: 1.5,
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
      textColor: [0, 0, 0],
      font: "helvetica",
      valign: "middle",
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      halign: "center",
      lineWidth: 0.3,
    },
    columnStyles: {
      0: { cellWidth: 20, halign: "left" },
      1: { cellWidth: 40, halign: "left" },
      2: { cellWidth: 14, halign: "center" },
      3: { cellWidth: 18, halign: "center" },
      4: { cellWidth: 28, halign: "center" },
      5: { cellWidth: 28, halign: "center" },
      6: { cellWidth: 38, halign: "right" },
    },
    margin: { left: margin, right: margin },
    tableWidth: boxW,
  });

  let finalY = (doc as any).lastAutoTable.finalY;

  // ── Total Amount in Words ──
  finalY += 1;
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(margin, finalY, boxW, 8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text(
    `Total Amount (in word): US Dollar: ${numberToWords(Number(lc.amount))}`,
    margin + 2,
    finalY + 5,
  );

  // Draw outer border around everything
  const boxBottom = finalY + 8;
  doc.setLineWidth(0.5);
  doc.rect(margin, boxTop, boxW, boxBottom - boxTop);

  // Vertical divider in header rows
  doc.setLineWidth(0.2);

  // ── Footer info below the box ──
  let footY = boxBottom + 10;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");

  doc.text("CARRIER", margin + 2, footY);
  doc.setFont("helvetica", "normal");
  doc.text(lc.carrier || "", margin + 50, footY);

  doc.setFont("helvetica", "bold");
  footY += 6;
  doc.text("SALES TERM", margin + 2, footY);
  doc.setFont("helvetica", "normal");
  doc.text(lc.salesTerm || "", margin + 50, footY);

  // Right side weights
  const firstItem = order?.orderItems?.[0] as any;
  const netW =
    firstItem?.fabricItem?.totalNetWeight ||
    firstItem?.labelItem?.netWeightTotal ||
    firstItem?.cartonItem?.totalNetWeight ||
    "0.00";

  const grossW =
    firstItem?.fabricItem?.totalGrossWeight ||
    firstItem?.labelItem?.grossWeightTotal ||
    firstItem?.cartonItem?.totalGrossWeight ||
    "0.00";

  doc.setFont("helvetica", "bold");
  doc.text("TOTAL NET WEIGHT", rightCol, footY - 6);
  doc.setFont("helvetica", "normal");
  doc.text(`${netW} Kg`, rightCol + 45, footY - 6);

  doc.setFont("helvetica", "bold");
  doc.text("TOTAL GROSS WEIGHT", rightCol, footY);
  doc.setFont("helvetica", "normal");
  doc.text(`${grossW} Kg`, rightCol + 45, footY);

  doc.save(`Commercial_Invoice_${lc.bblcNumber}.pdf`);
};

/* ═══════════════════════════════════════════════════
   2. DELIVERY CHALLAN
   ═══════════════════════════════════════════════════ */

export const exportDeliveryChallanPdf = async (lc: LCManagement) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const margin = 14;
  const invoice = lc.invoice;
  const order = invoice?.order;
  const buyer = order?.buyer;
  const company = order?.companyProfile;

  // ── Company Header ──
  const startY = await drawHeader(doc, company, "DELIVERY CHALLAN", lc.dateOfOpening);
  let y = startY;

  // ── Info rows ──
  y += 12;
  doc.setFontSize(9);

  // Left column
  const lx = margin + 2;
  const lvx = margin + 31; // Consistent starting point for values
  doc.setFont("helvetica", "bold");
  doc.text("Challan No:", lx, y);
  doc.setFont("helvetica", "normal");
  doc.text((lc.challanNo || "-").toString().trim(), lvx, y);

  doc.setFont("helvetica", "bold");
  doc.text("L/C No:", lx, y + 6);
  doc.setFont("helvetica", "normal");
  doc.text(lc.exportLcNo || "-", lvx, y + 6);

  doc.setFont("helvetica", "bold");
  doc.text("B/B L/C No:", lx, y + 12);
  doc.setFont("helvetica", "normal");
  doc.text(lc.bblcNumber || "-", lvx, y + 12);

  // Right column
  const rx = pw / 2 + 10;
  const rvx = pw / 2 + 35;
  doc.setFont("helvetica", "bold");
  doc.text("Date:", rx, y);
  doc.setFont("helvetica", "normal");
  doc.text(fmtLong(lc.dateOfOpening), rvx, y);

  doc.setFont("helvetica", "bold");
  doc.text("P/I No:", rx, y + 6);
  doc.setFont("helvetica", "normal");
  doc.text(invoice?.piNumber || "-", rvx, y + 6);

  // ── Buyer Information ──
  y += 22;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Buyer Name :", lx, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  const buyerName = (buyer?.name || "N/A").toUpperCase();
  doc.text(buyerName, lx + 24, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const buyerAddr = buyer?.address || "";
  const buyerLoc = buyer?.location || "";
  const displayAddr = [buyerAddr, buyerLoc].filter(Boolean).join(", ");

  if (displayAddr) {
    const addrLines = doc.splitTextToSize(displayAddr, pw - margin * 2 - 20);
    doc.text(addrLines, lx, y + 6);
    y += ((Array.isArray(addrLines) ? addrLines.length : 1) * 4);
  }

  y += 14;

  // ── Table ──
  const firstItem = order?.orderItems?.[0] as any;
  const grossW =
    firstItem?.fabricItem?.totalGrossWeight ||
    firstItem?.labelItem?.grossWeightTotal ||
    firstItem?.cartonItem?.totalGrossWeight ||
    "0.00";

  autoTable(doc, {
    startY: y,
    head: [["Sl.", "Description of Goods", "Quantity", "Unit", "Gross Weight (Kg)"]],
    body: [
      [
        "1",
        `Goods as per LC ${invoice?.piNumber || lc.bblcNumber}`,
        "As per LC",
        "-",
        String(grossW),
      ],
    ],
    foot: [[
      { content: "Total Gross Weight", colSpan: 4, styles: { fontStyle: "bold" as const, halign: "left" as const } },
      { content: `${grossW} Kg`, styles: { fontStyle: "bold" as const, halign: "right" as const } },
    ]],
    theme: "grid",
    footStyles: {
      fillColor: [248, 250, 252], // slate-50
      textColor: [0, 0, 0],
      fontStyle: "bold",
      lineWidth: 0.2,
      lineColor: [0, 0, 0],
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
      textColor: [0, 0, 0],
      font: "helvetica",
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "left" },
      1: { cellWidth: 65, halign: "left" },
      2: { cellWidth: 30, halign: "center" },
      3: { cellWidth: 25, halign: "center" },
      4: { cellWidth: 35, halign: "right" },
    },
    margin: { left: margin, right: margin },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 12;

  // ── Transport info ──
  doc.setFontSize(9);
  const drx = pw / 2 + 10;
  const lvx2 = lx + 29; // Align with header lvx (lx is margin + 2, so lvx2 is margin + 31)
  const rvx2 = drx + 28;

  doc.setFont("helvetica", "bold");
  doc.text("Transport Mode:", lx, finalY);
  doc.setFont("helvetica", "normal");
  doc.text(lc.transportMode || "-", lvx2, finalY);

  doc.setFont("helvetica", "bold");
  doc.text("Vehicle No:", lx, finalY + 7);
  doc.setFont("helvetica", "normal");
  doc.text(lc.vehicleNo || "-", lvx2, finalY + 7);

  doc.setFont("helvetica", "bold");
  doc.text("Driver Name:", drx, finalY);
  doc.setFont("helvetica", "normal");
  doc.text(lc.driverName || "-", rvx2, finalY);

  doc.setFont("helvetica", "bold");
  doc.text("Contact No:", drx, finalY + 7);
  doc.setFont("helvetica", "normal");
  doc.text(lc.contactNo || "-", rvx2, finalY + 7);

  // ── Signatures ──
  const sigY = finalY + 40;
  doc.setLineWidth(0.3);
  const sigW = 40;

  // Left
  doc.line(margin + 5, sigY, margin + 5 + sigW, sigY);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Received By", margin + 14, sigY + 5);

  // Center
  const cx = pw / 2 - sigW / 2;
  doc.line(cx, sigY, cx + sigW, sigY);
  doc.text("Checked By", cx + 8, sigY + 5);

  // Right
  const rrx = pw - margin - 5 - sigW;
  doc.line(rrx, sigY, rrx + sigW, sigY);
  doc.text("Authorized Signature", rrx + 3, sigY + 5);

  doc.save(`Delivery_Challan_${lc.challanNo || lc.bblcNumber}.pdf`);
};

/* ═══════════════════════════════════════════════════
   3. BENEFICIARY CERTIFICATE
   ═══════════════════════════════════════════════════ */

export const exportBeneficiaryCertificatePdf = async (lc: LCManagement, date?: string) => {
  await generateCertificatePdf(lc, "Beneficiary Certificate", date);
};

/* ═══════════════════════════════════════════════════
   4. CERTIFICATE OF ORIGIN
   ═══════════════════════════════════════════════════ */

export const exportCertificateOfOriginPdf = async (lc: LCManagement, date?: string) => {
  await generateCertificatePdf(lc, "Certificate of Origin", date);
};

/* ─── shared certificate generator ─── */
const generateCertificatePdf = async (lc: LCManagement, title: string, date?: string) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const margin = 14;
  const invoice = lc.invoice;
  const order = invoice?.order;
  const buyer = order?.buyer;
  const company = order?.companyProfile;
  const items = normalizeLCItems(lc);

  // ── Company Header & Title ──
  const startY = await drawHeader(doc, company, title, date || lc.dateOfOpening);
  let y = startY;

  // ── Body paragraph ──
  y += 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  const bodyText =
    `This is to certify that the following mentioned products are of Bangladesh Origin and been ` +
    `delivered in accordance with the Proforma Invoice no :   ${invoice?.piNumber || ""} Date-${fmtFull(invoice?.date)}   , against ` +
    `Back-to-Back L/C No. ${lc.bblcNumber}  Date: ${fmt(lc.dateOfOpening)} in completing with the all other terms ` +
    `and conditions.`;
  const bodyLines = doc.splitTextToSize(bodyText, pw - margin * 2 - 4);
  doc.text(bodyLines, margin + 2, y);

  y += (Array.isArray(bodyLines) ? bodyLines.length : 1) * 4 + 8;

  // ── Buyer's Name ──
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.text("Buyer's Name", margin + 2, y);
  doc.setFont("helvetica", "bold");
  doc.text(`:  ${(buyer?.name || "").toUpperCase()}`, margin + 32, y);

  y += 14;

  // ── Items table ──
  const tableData = items.map(item => [
    item.style,
    item.description,
    item.width,
    item.color,
    String(item.qty),
    `$  ${Number(item.unitPrice).toFixed(2)}`,
    `${money(item.amount)}`,
  ]);

  const totalQty = items.reduce((s, i) => s + Number(i.qty), 0);

  tableData.push([
    "", "", "", "",
    { content: `Total:  ${totalQty}`, styles: { fontStyle: "bold" as const, halign: "center" as const } } as any,
    { content: "US  $", styles: { fontStyle: "bold" as const, halign: "center" as const } } as any,
    { content: `${money(Number(lc.amount))}`, styles: { fontStyle: "bold" as const } } as any,
  ]);

  autoTable(doc, {
    startY: y,
    head: [[
      "Style No/Po No",
      "Description",
      "Width",
      "Color",
      "Quantity\nIn Yds",
      "Unit Price\nIn US $",
      "Amount In\nUS Dollar",
    ]],
    body: tableData,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
      textColor: [0, 0, 0],
      font: "helvetica",
      valign: "middle",
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      halign: "center",
      lineWidth: 0.3,
    },
    columnStyles: {
      0: { cellWidth: 20, halign: "left" },
      1: { cellWidth: 38, halign: "left" },
      2: { cellWidth: 14, halign: "center" },
      3: { cellWidth: 16, halign: "center" },
      4: { cellWidth: 28, halign: "center" },
      5: { cellWidth: 28, halign: "center" },
      6: { cellWidth: 38, halign: "right" },
    },
    margin: { left: margin, right: margin },
  });

  let finalY = (doc as any).lastAutoTable.finalY;

  // ── Amount in words ──
  finalY += 1;
  doc.setDrawColor(0);
  doc.setLineWidth(0.2);
  doc.rect(margin, finalY, pw - margin * 2, 8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(
    `Total Amount (in word): US Dollar: ${numberToWords(Number(lc.amount))}`,
    margin + 2,
    finalY + 5,
  );

  // ── Signature ──
  const sigY = finalY + 45;
  doc.setLineWidth(0.3);
  doc.line(margin + 2, sigY, margin + 48, sigY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Authorised Signature", margin + 2, sigY + 5);
  doc.setFont("helvetica", "bolditalic");
  doc.text(`For ${company?.name || "Company"}.`, margin + 2, sigY + 10);

  const safeName = title.replace(/\s+/g, "_");
  doc.save(`${safeName}_${lc.bblcNumber}.pdf`);
};

/* ═══════════════════════════════════════════════════
   5. BILL OF EXCHANGE
   ═══════════════════════════════════════════════════ */

export const exportBillOfExchangePdf = async (lc: LCManagement) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const margin = 16;
  const invoice = lc.invoice;
  const order = invoice?.order;
  const buyer = order?.buyer;
  const company = order?.companyProfile;

  // ── Company Header ──
  const startY = await drawHeader(doc, company); // Bill of Exchange title is handled per copy

  const bankFull = `${lc.lcIssueBankName}, ${lc.lcIssueBankBranch}`;
  const amountStr = `US $ ${money(Number(lc.amount))}`;
  const amountWords = numberToWords(Number(lc.amount));
  const location = lc.billOfExchangeLocationBank || lc.billOfExchangeLocationClient || "Dhaka";
  const boeDate = fmt(lc.billOfExchangeDateClient || lc.dateOfOpening);

  const drawCopy = (
    copyNum: number,
    ordinal: string,
    otherOrdinal: string,
    copyStartY: number,
  ) => {
    let y = copyStartY;

    // ── Title ──
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text(`BILL OF EXCHANGE - ${copyNum}`, pw / 2, y, { align: "center" });

    // ── Left: amount + LC number ──
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`FOR ${amountStr}`, margin + 2, y);
    doc.text(`P.I No: ${invoice?.piNumber || "-"}`, margin + 2, y + 5);

    // ── Right: date + location ──
    doc.text(boeDate, pw - margin - 2, y, { align: "right" });
    doc.text(location, pw - margin - 2, y + 5, { align: "right" });

    // ── Body text ──
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const bodyText =
      `AT 120 SIGHT ${ordinal} of Exchange (${otherOrdinal} of the same tenor and date being unpaid) ` +
      `pay to the order of ${lc.lcIssueBankName || ""}, ${lc.lcIssueBankBranch || ""}, ${location}, Bangladesh ` +
      `the sum of`;
    const bodyLines = doc.splitTextToSize(bodyText, pw - margin * 2 - 4);
    doc.text(bodyLines, pw / 2, y, { align: "center", maxWidth: pw - margin * 2 });

    y += (Array.isArray(bodyLines) ? bodyLines.length : 1) * 4.5 + 4;

    // Amount in words
    doc.setFontSize(9);
    const wordsLine = `Total Amount (in word): US Dollar ${amountWords}`;
    const wordsLines = doc.splitTextToSize(wordsLine, pw - margin * 2);
    // Bold the words line
    doc.setFont("helvetica", "bold");
    doc.text(wordsLines, pw / 2, y, { align: "center", maxWidth: pw - margin * 2 });

    y += (Array.isArray(wordsLines) ? wordsLines.length : 1) * 4 + 3;

    // Value received line
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const valueLine = `Value received and charges the same on account of ${(buyer?.name || "Buyer").toUpperCase()}.`;
    doc.text(valueLine, pw / 2, y, { align: "center" });

    y += 5;
    const issuedLine = `ISSUED BY: ${lc.lcIssueBankName?.toUpperCase() || ""}, ${lc.lcIssueBankBranch || ""}, Bangladesh.`;
    doc.text(issuedLine, pw / 2, y, { align: "center" });

    y += 5;
    doc.text(
      `L/C No. & DATE ${lc.bblcNumber} Date: ${fmt(lc.dateOfOpening)}.`,
      pw / 2,
      y,
      { align: "center" },
    );

    y += 14;

    // ── TO block (left) ──
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(lc.lcIssueBankName?.toUpperCase() || "", margin + 12, y);
    doc.setFont("helvetica", "normal");
    doc.text("TO :", margin + 2, y + 4);
    doc.text(lc.lcIssueBankBranch || "", margin + 12, y + 4);
    doc.text(`${location}, Bangladesh.`, margin + 12, y + 8);

    // ── Signature (right) ──
    const sigX = pw - margin - 55;
    doc.setLineWidth(0.3);
    doc.line(sigX, y - 2, sigX + 50, y - 2);
    doc.setFontSize(8);
    doc.text("Authorised Signature", sigX + 8, y + 2);
    doc.setFont("helvetica", "bolditalic");
    doc.text(`For ${company?.name || "Company"}.`, sigX + 8, y + 7);

    return y + 15;
  };

  // ── Copy 1 ──
  const endOfCopy1 = drawCopy(1, "FIRST", "Second", startY + 10);

  // Separator line between copies
  doc.setDrawColor(180);
  doc.setLineWidth(0.2);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(margin, endOfCopy1, pw - margin, endOfCopy1);
  doc.setLineDashPattern([], 0);
  doc.setDrawColor(0);

  // ── Copy 2 ──
  drawCopy(2, "SECOND", "First", endOfCopy1 + 8);

  doc.save(`Bill_of_Exchange_${lc.bblcNumber}.pdf`);
};
