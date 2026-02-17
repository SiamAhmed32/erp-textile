import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Order } from "./types";

export const exportOrderToPdf = (order: Order) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

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

  // Header - Company Name
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(order.companyProfile?.name || "Moon Textile", pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 7;

  // Company Address
  if (order.companyProfile?.address) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(order.companyProfile.address, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 5;
  }

  // Company Phone
  if (order.companyProfile?.phone) {
    doc.setFontSize(10);
    doc.text(order.companyProfile.phone, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 5;
  }

  // Horizontal line
  doc.setLineWidth(0.5);
  doc.line(15, yPosition, pageWidth - 15, yPosition);
  yPosition += 10;

  // Document Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Order Invoice", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 10;

  // Buyer and Order Information
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  // Left side - Buyer Info
  const leftX = 15;
  doc.setFont("helvetica", "bold");
  doc.text(order.buyer?.name || "[Buyer Name]", leftX, yPosition);
  doc.setFont("helvetica", "normal");
  yPosition += 5;
  if (order.buyer?.email) {
    doc.text(order.buyer.email, leftX, yPosition);
    yPosition += 5;
  }
  if (order.buyer?.phone) {
    doc.text(order.buyer.phone, leftX, yPosition);
    yPosition += 5;
  }
  if (order.buyer?.address) {
    doc.text(order.buyer.address, leftX, yPosition);
    yPosition += 5;
  }
  if (order.buyer?.location) {
    doc.text(order.buyer.location, leftX, yPosition);
    yPosition += 5;
  }

  // Right side - Order Details
  const rightX = pageWidth - 15;
  let rightY = yPosition - 25;
  doc.setFont("helvetica", "bold");
  doc.text("Date: ", rightX - 60, rightY);
  doc.setFont("helvetica", "normal");
  doc.text(
    order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-",
    rightX,
    rightY,
    { align: "right" }
  );
  rightY += 5;

  doc.setFont("helvetica", "bold");
  doc.text("Order No: ", rightX - 60, rightY);
  doc.setFont("helvetica", "normal");
  doc.text(`${order.orderNumber} (${order.status})`, rightX, rightY, {
    align: "right",
  });
  rightY += 5;

  if (order.deliveryDate) {
    doc.setFont("helvetica", "bold");
    doc.text("Delivery: ", rightX - 60, rightY);
    doc.setFont("helvetica", "normal");
    doc.text(
      new Date(order.deliveryDate).toLocaleDateString(),
      rightX,
      rightY,
      { align: "right" }
    );
  }

  yPosition += 10;

  // Product Table
  if (order.productType === "FABRIC" && fabricItem?.fabricItemData) {
    const rows = fabricItem.fabricItemData;
    const tableData = rows.map((row: any) => [
      fabricItem.styleNo || "-",
      fabricItem.discription || "-",
      fabricItem.width || "-",
      row.color || "-",
      row.netWeight ?? "-",
      row.grossWeight ?? "-",
      row.quantityYds ?? "-",
      `$${row.unitPrice ?? "0.00"}`,
      `$${row.totalAmount ?? "0.00"}`,
    ]);

    // Calculate totals
    const totalNetWeight = rows.reduce(
      (sum, row) => sum + (Number(row.netWeight) || 0),
      0
    );
    const totalGrossWeight = rows.reduce(
      (sum, row) => sum + (Number(row.grossWeight) || 0),
      0
    );
    const totalQuantity = rows.reduce(
      (sum, row) => sum + (Number(row.quantityYds) || 0),
      0
    );
    const totalAmount = rows.reduce(
      (sum, row) => sum + (Number(row.totalAmount) || 0),
      0
    );

    tableData.push([
      { content: "Total", colSpan: 4, styles: { fontStyle: "bold" } },
      totalNetWeight.toFixed(2),
      totalGrossWeight.toFixed(2),
      totalQuantity.toFixed(2),
      "",
      `$${totalAmount.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [
        [
          "Style No/Po Number",
          "Description",
          "Width",
          "Colour",
          "Net Weight",
          "Gross Weight",
          "Qty (Yds)",
          "Unit Price (US$)",
          "Total (US$)",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [71, 85, 105], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 25 },
        2: { cellWidth: 15 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 18 },
        7: { cellWidth: 22 },
        8: { cellWidth: 22 },
      },
    });
  } else if (order.productType === "LABEL_TAG" && labelItem?.labelItemData) {
    const rows = labelItem.labelItemData;
    const tableData = rows.map((row: any) => [
      labelItem.styleNo || "-",
      row.desscription || "-",
      row.color || "-",
      row.netWeight ?? "-",
      row.grossWeight ?? "-",
      row.quantityDzn ?? "-",
      row.quantityPcs ?? "-",
      `$${row.unitPrice ?? "0.00"}`,
      `$${row.totalAmount ?? "0.00"}`,
    ]);

    const totalNetWeight = rows.reduce(
      (sum, row) => sum + (Number(row.netWeight) || 0),
      0
    );
    const totalGrossWeight = rows.reduce(
      (sum, row) => sum + (Number(row.grossWeight) || 0),
      0
    );
    const totalQuantityDzn = rows.reduce(
      (sum, row) => sum + (Number(row.quantityDzn) || 0),
      0
    );
    const totalQuantityPcs = rows.reduce(
      (sum, row) => sum + (Number(row.quantityPcs) || 0),
      0
    );
    const totalAmount = rows.reduce(
      (sum, row) => sum + (Number(row.totalAmount) || 0),
      0
    );

    tableData.push([
      { content: "Total", colSpan: 3, styles: { fontStyle: "bold" } },
      totalNetWeight.toFixed(2),
      totalGrossWeight.toFixed(2),
      totalQuantityDzn.toFixed(2),
      totalQuantityPcs.toString(),
      "",
      `$${totalAmount.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [
        [
          "Style No/Po Number",
          "Description",
          "Colour",
          "Net Weight",
          "Gross Weight",
          "Qty (Dzn)",
          "Qty (Pcs)",
          "Unit Price (US$)",
          "Total (US$)",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [71, 85, 105], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
    });
  } else if (order.productType === "CARTON" && cartonItem?.cartonItemData) {
    const rows = cartonItem.cartonItemData;
    const tableData = rows.map((row: any) => [
      cartonItem.orderNo || "-",
      row.cartonMeasurement || "-",
      row.cartonPly || "-",
      row.cartonQty ?? "-",
      row.netWeight ?? "-",
      row.grossWeight ?? "-",
      row.unit || "-",
      `$${row.unitPrice ?? "0.00"}`,
      `$${row.totalAmount ?? "0.00"}`,
    ]);

    const totalCartonQty = rows.reduce(
      (sum, row) => sum + (Number(row.cartonQty) || 0),
      0
    );
    const totalNetWeight = rows.reduce(
      (sum, row) => sum + (Number(row.netWeight) || 0),
      0
    );
    const totalGrossWeight = rows.reduce(
      (sum, row) => sum + (Number(row.grossWeight) || 0),
      0
    );
    const totalAmount = rows.reduce(
      (sum, row) => sum + (Number(row.totalAmount) || 0),
      0
    );

    tableData.push([
      { content: "Total", colSpan: 3, styles: { fontStyle: "bold" } },
      totalCartonQty.toString(),
      totalNetWeight.toFixed(2),
      totalGrossWeight.toFixed(2),
      "",
      "",
      `$${totalAmount.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [
        [
          "Order No",
          "Measurement",
          "Ply",
          "Qty",
          "Net Weight",
          "Gross Weight",
          "Unit",
          "Unit Price (US$)",
          "Total (US$)",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [71, 85, 105], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
    });
  }

  // Get Y position after table
  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Remarks
  if (order.remarks) {
    yPosition += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Remarks: ", 15, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(order.remarks, 35, yPosition, { maxWidth: pageWidth - 50 });
    yPosition += 10;
  }

  // Signature Section
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  } else {
    yPosition = 260;
  }

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Bayer Acceptance", 40, yPosition);
  doc.text("Authorised Signature", pageWidth - 60, yPosition);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    `For ${order.companyProfile?.name || "Moon Textile"}`,
    pageWidth - 60,
    yPosition + 5
  );

  // Draw signature lines
  doc.line(25, yPosition - 5, 80, yPosition - 5);
  doc.line(pageWidth - 80, yPosition - 5, pageWidth - 25, yPosition - 5);

  // Save the PDF
  doc.save(`Order_Invoice_${order.orderNumber}.pdf`);
};
