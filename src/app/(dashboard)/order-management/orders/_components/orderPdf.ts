import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Order } from "./types";
import { formatDate } from "./helpers";

export const exportOrderToPdf = (order: Order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;

    // --- COMPANY HEADER ---
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 204); // Blue color
    doc.text(order.companyProfile?.name || "Moon Textile", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    const companyAddress = order.companyProfile?.address || "Bangladesh";
    const companyPhone = order.companyProfile?.phone || "";
    doc.text(companyAddress, pageWidth / 2, 26, { align: "center" });
    if (companyPhone) {
        doc.text(`(Phone: ${companyPhone})`, pageWidth / 2, 31, { align: "center" });
    }

    // --- ORDER TITLE ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Purchase Order", pageWidth / 2, 42, { align: "center" });

    // Horizontal line
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(margin, 46, pageWidth - margin, 46);

    // --- ORDER INFO BOX ---
    let yPos = 54;
    
    // Create a light gray box for order info
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, yPos - 4, pageWidth - 2 * margin, 24, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(0);
    
    // Left column
    doc.setFont("helvetica", "bold");
    doc.text("Order Number:", margin + 3, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(order.orderNumber || "-", margin + 32, yPos);

    doc.setFont("helvetica", "bold");
    doc.text("Location:", margin + 3, yPos + 6);
    doc.setFont("helvetica", "normal");
    doc.text("Bangladesh", margin + 32, yPos + 6);

    doc.setFont("helvetica", "bold");
    doc.text("Status:", margin + 3, yPos + 12);
    doc.setFont("helvetica", "normal");
    doc.text(order.status || "DRAFT", margin + 32, yPos + 12);

    // Right column - with proper spacing to avoid overlap
    const rightColX = pageWidth - 85;
    
    doc.setFont("helvetica", "bold");
    doc.text("Date:", rightColX, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(formatDate(order.orderDate) || "-", rightColX + 25, yPos);

    doc.setFont("helvetica", "bold");
    doc.text("Buyer:", rightColX, yPos + 6);
    doc.setFont("helvetica", "normal");
    doc.text(order.buyer?.name || "-", rightColX + 25, yPos + 6);

    doc.setFont("helvetica", "bold");
    doc.text("Delivery Date:", rightColX, yPos + 12);
    doc.setFont("helvetica", "normal");
    doc.text(formatDate(order.deliveryDate) || "-", rightColX + 25, yPos + 12);

    yPos += 30;

    // --- UNIFIED PRODUCT TABLE ---
    const orderItems = Array.isArray(order.orderItems)
        ? order.orderItems
        : order.orderItems ? [order.orderItems] : [];
    
    const orderItem = orderItems[0] as any;

    if (order.productType === "FABRIC" && orderItem?.fabricItem) {
        const fabric = orderItem.fabricItem;
        
        if (fabric.fabricItemData?.length) {
            const tableData = fabric.fabricItemData.map((d: any, index: number) => {
                // Only show Style No and Description in the first row
                if (index === 0) {
                    return [
                        fabric.styleNo || "-",
                        fabric.discription || "-",
                        d.color || "-",
                        d.netWeight?.toString() || "0.00",
                        d.grossWeight?.toString() || "0",
                        d.quantityYds?.toString() || "0.00",
                        d.unitPrice?.toString() || "0.00",
                        d.totalAmount?.toString() || "0.00"
                    ];
                } else {
                    return [
                        "", // Empty Style No for subsequent rows
                        "", // Empty Description for subsequent rows
                        d.color || "-",
                        d.netWeight?.toString() || "0.00",
                        d.grossWeight?.toString() || "0",
                        d.quantityYds?.toString() || "0.00",
                        d.unitPrice?.toString() || "0.00",
                        d.totalAmount?.toString() || "0.00"
                    ];
                }
            });

            // Calculate totals
            const totalNet = fabric.fabricItemData.reduce((sum: number, d: any) => sum + (parseFloat(d.netWeight) || 0), 0);
            const totalGross = fabric.fabricItemData.reduce((sum: number, d: any) => sum + (parseFloat(d.grossWeight) || 0), 0);
            const totalQty = fabric.fabricItemData.reduce((sum: number, d: any) => sum + (parseFloat(d.quantityYds) || 0), 0);
            const totalAmount = fabric.fabricItemData.reduce((sum: number, d: any) => sum + (parseFloat(d.totalAmount) || 0), 0);

            const totalRow = [
                "",
                "",
                "Total",
                totalNet.toFixed(2),
                totalGross.toString(),
                totalQty.toFixed(2),
                "",
                totalAmount.toFixed(2)
            ];
            tableData.push(totalRow);

            autoTable(doc, {
                startY: yPos,
                head: [[
                    "Style No",
                    "Description",
                    "Colour",
                    "Net Weight",
                    "Gross Weight",
                    "Qty (Yds)",
                    "Unit Price (US$)",
                    "Total (US$)"
                ]],
                body: tableData,
                theme: "grid",
                styles: { 
                    fontSize: 8, 
                    cellPadding: 2.5,
                    halign: 'center',
                    valign: 'middle'
                },
                headStyles: { 
                    fillColor: [241, 245, 249], 
                    textColor: [0, 0, 0],
                    fontStyle: "bold",
                    halign: 'center'
                },
                bodyStyles: { textColor: [0, 0, 0] },
                alternateRowStyles: { fillColor: [250, 250, 250] },
                columnStyles: {
                    0: { cellWidth: 25 }, // Style No
                    1: { cellWidth: 35 }, // Description
                    2: { cellWidth: 20 }, // Colour
                    3: { cellWidth: 22 }, // Net Weight
                    4: { cellWidth: 22 }, // Gross Weight
                    5: { cellWidth: 20 }, // Qty
                    6: { cellWidth: 25 }, // Unit Price
                    7: { cellWidth: 25 }  // Total
                },
                margin: { left: margin, right: margin },
                didParseCell: (data) => {
                    // Bold and gray background for total row
                    if (data.row.index === tableData.length - 1) {
                        data.cell.styles.fontStyle = "bold";
                        data.cell.styles.fillColor = [240, 240, 240];
                    }
                    // Merge cells for Style No and Description (first column spanning multiple rows)
                    if ((data.column.index === 0 || data.column.index === 1) && data.row.index > 0 && data.row.index < tableData.length - 1) {
                        if (data.cell.raw === "") {
                            data.cell.styles.fillColor = [255, 255, 255];
                        }
                    }
                }
            });
        }
    } else if (order.productType === "LABEL_TAG" && orderItem?.labelItem) {
        const label = orderItem.labelItem;
        
        if (label.labelItemData?.length) {
            const tableData = label.labelItemData.map((d: any, index: number) => {
                if (index === 0) {
                    return [
                        label.styleNo || "-",
                        d.desscription || "-",
                        d.color || "-",
                        d.netWeight?.toString() || "0.00",
                        d.grossWeight?.toString() || "0",
                        d.quantityDzn?.toString() || "0.00",
                        d.quantityPcs?.toString() || "0",
                        d.unitPrice?.toString() || "0.00",
                        d.totalAmount?.toString() || "0.00"
                    ];
                } else {
                    return [
                        "",
                        d.desscription || "-",
                        d.color || "-",
                        d.netWeight?.toString() || "0.00",
                        d.grossWeight?.toString() || "0",
                        d.quantityDzn?.toString() || "0.00",
                        d.quantityPcs?.toString() || "0",
                        d.unitPrice?.toString() || "0.00",
                        d.totalAmount?.toString() || "0.00"
                    ];
                }
            });

            const totalNet = label.labelItemData.reduce((sum: number, d: any) => sum + (parseFloat(d.netWeight) || 0), 0);
            const totalGross = label.labelItemData.reduce((sum: number, d: any) => sum + (parseFloat(d.grossWeight) || 0), 0);
            const totalDzn = label.labelItemData.reduce((sum: number, d: any) => sum + (parseFloat(d.quantityDzn) || 0), 0);
            const totalPcs = label.labelItemData.reduce((sum: number, d: any) => sum + (parseFloat(d.quantityPcs) || 0), 0);
            const totalAmount = label.labelItemData.reduce((sum: number, d: any) => sum + (parseFloat(d.totalAmount) || 0), 0);

            const totalRow = [
                "",
                "",
                "Total",
                totalNet.toFixed(2),
                totalGross.toString(),
                totalDzn.toFixed(2),
                totalPcs.toString(),
                "",
                totalAmount.toFixed(2)
            ];
            tableData.push(totalRow);

            autoTable(doc, {
                startY: yPos,
                head: [[
                    "Style No",
                    "Description",
                    "Colour",
                    "Net Weight",
                    "Gross Weight",
                    "Qty (Dzn)",
                    "Qty (Pcs)",
                    "Unit Price (US$)",
                    "Total (US$)"
                ]],
                body: tableData,
                theme: "grid",
                styles: { 
                    fontSize: 8, 
                    cellPadding: 2.5,
                    halign: 'center',
                    valign: 'middle'
                },
                headStyles: { 
                    fillColor: [241, 245, 249], 
                    textColor: [0, 0, 0],
                    fontStyle: "bold",
                    halign: 'center'
                },
                bodyStyles: { textColor: [0, 0, 0] },
                alternateRowStyles: { fillColor: [250, 250, 250] },
                columnStyles: {
                    0: { cellWidth: 22 },
                    1: { cellWidth: 30 },
                    2: { cellWidth: 18 },
                    3: { cellWidth: 20 },
                    4: { cellWidth: 20 },
                    5: { cellWidth: 18 },
                    6: { cellWidth: 18 },
                    7: { cellWidth: 22 },
                    8: { cellWidth: 22 }
                },
                margin: { left: margin, right: margin },
                didParseCell: (data) => {
                    if (data.row.index === tableData.length - 1) {
                        data.cell.styles.fontStyle = "bold";
                        data.cell.styles.fillColor = [240, 240, 240];
                    }
                }
            });
        }
    } else if (order.productType === "CARTON" && orderItem?.cartonItem) {
        const carton = orderItem.cartonItem;
        
        if (carton.cartonItemData?.length) {
            const tableData = carton.cartonItemData.map((d: any, index: number) => {
                if (index === 0) {
                    return [
                        carton.orderNo || "-",
                        d.cartonMeasurement || "-",
                        d.cartonPly || "-",
                        d.netWeight?.toString() || "0.00",
                        d.grossWeight?.toString() || "0",
                        d.cartonQty?.toString() || "0",
                        d.unit || "-",
                        d.unitPrice?.toString() || "0.00",
                        d.totalAmount?.toString() || "0.00"
                    ];
                } else {
                    return [
                        "",
                        d.cartonMeasurement || "-",
                        d.cartonPly || "-",
                        d.netWeight?.toString() || "0.00",
                        d.grossWeight?.toString() || "0",
                        d.cartonQty?.toString() || "0",
                        d.unit || "-",
                        d.unitPrice?.toString() || "0.00",
                        d.totalAmount?.toString() || "0.00"
                    ];
                }
            });

            const totalNet = carton.cartonItemData.reduce((sum: number, d: any) => sum + (parseFloat(d.netWeight) || 0), 0);
            const totalGross = carton.cartonItemData.reduce((sum: number, d: any) => sum + (parseFloat(d.grossWeight) || 0), 0);
            const totalQty = carton.cartonItemData.reduce((sum: number, d: any) => sum + (parseFloat(d.cartonQty) || 0), 0);
            const totalAmount = carton.cartonItemData.reduce((sum: number, d: any) => sum + (parseFloat(d.totalAmount) || 0), 0);

            const totalRow = [
                "",
                "",
                "Total",
                totalNet.toFixed(2),
                totalGross.toString(),
                totalQty.toString(),
                "",
                "",
                totalAmount.toFixed(2)
            ];
            tableData.push(totalRow);

            autoTable(doc, {
                startY: yPos,
                head: [[
                    "Order No",
                    "Measurement",
                    "Ply",
                    "Net Weight",
                    "Gross Weight",
                    "Qty",
                    "Unit",
                    "Unit Price (US$)",
                    "Total (US$)"
                ]],
                body: tableData,
                theme: "grid",
                styles: { 
                    fontSize: 8, 
                    cellPadding: 2.5,
                    halign: 'center',
                    valign: 'middle'
                },
                headStyles: { 
                    fillColor: [241, 245, 249], 
                    textColor: [0, 0, 0],
                    fontStyle: "bold",
                    halign: 'center'
                },
                bodyStyles: { textColor: [0, 0, 0] },
                alternateRowStyles: { fillColor: [250, 250, 250] },
                columnStyles: {
                    0: { cellWidth: 22 },
                    1: { cellWidth: 28 },
                    2: { cellWidth: 15 },
                    3: { cellWidth: 20 },
                    4: { cellWidth: 20 },
                    5: { cellWidth: 15 },
                    6: { cellWidth: 15 },
                    7: { cellWidth: 22 },
                    8: { cellWidth: 22 }
                },
                margin: { left: margin, right: margin },
                didParseCell: (data) => {
                    if (data.row.index === tableData.length - 1) {
                        data.cell.styles.fontStyle = "bold";
                        data.cell.styles.fillColor = [240, 240, 240];
                    }
                }
            });
        }
    }


    yPos = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : yPos + 10;

    // --- TOTAL AMOUNT IN WORDS ---
    if (orderItem) {
        const totalAmount = 
            orderItem.fabricItem?.totalAmount ||
            orderItem.labelItem?.totalAmount ||
            orderItem.cartonItem?.totalAmount ||
            0;

        // Convert number to words (simple implementation)
        const amountInWords = typeof totalAmount === 'number' 
            ? `US Dollar ${totalAmount.toFixed(2)}`
            : `US Dollar ${totalAmount}`;

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text(`Total Amount (in Words): ${amountInWords}`, margin, yPos);
        yPos += 10;
    }

    // --- REMARKS ---
    if (order.remarks && order.remarks.trim() !== "") {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text("Remarks:", margin, yPos);
        yPos += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const splitRemarks = doc.splitTextToSize(order.remarks, pageWidth - 2 * margin);
        doc.text(splitRemarks, margin, yPos);
        yPos += splitRemarks.length * 5 + 10;
    }

    // --- SIGNATURE SECTION ---
    // Add some space before signature section
    const signatureY = Math.max(yPos + 5, pageHeight - 50);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);

    // Left side - Buyer Acceptance (far left)
    doc.text("Buyer Acceptance", margin, signatureY + 10);

    // Right side - Authorised Signature (far right)
    doc.text("Authorised Signature", pageWidth - margin, signatureY + 10, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.text(`For ${order.companyProfile?.name || "Company"}`, pageWidth - margin, signatureY + 16, { align: "right" });



    const filename = `Order_${order.orderNumber}_${new Date().getTime()}.pdf`;
    doc.save(filename);
};
