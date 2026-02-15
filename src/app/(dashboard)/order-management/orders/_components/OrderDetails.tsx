"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Pencil, Copy } from "lucide-react";
import {
  Container,
  Flex,
  PrimaryHeading,
  PrimaryText,
} from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { useGetByIdQuery } from "@/store/services/commonApi";
import { Order, OrderApiItem } from "./types";
import { normalizeOrder, statusBadgeClass, formatDate } from "./helpers";
import OrderReadOnly from "./OrderReadOnly";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type Props = {
  id: string;
  shouldExport?: boolean;
};

const OrderDetails = ({ id, shouldExport = false }: Props) => {
  const router = useRouter();

  const [order, setOrder] = React.useState<Order | null>(null);
  const exportTriggered = React.useRef(false);
  const {
    data: orderPayload,
    isFetching: loading,
    error: orderError,
  } = useGetByIdQuery({
    path: "orders",
    id,
  });

  React.useEffect(() => {
    const item = (orderPayload as any)?.data as OrderApiItem | undefined;
    if (!item) return;
    setOrder(normalizeOrder(item));
  }, [orderPayload]);

  React.useEffect(() => {
    const parsed = orderError as any;
    if (!parsed) return;
    const message =
      parsed?.data?.error?.message ||
      parsed?.data?.message ||
      parsed?.error ||
      "Failed to load order";
    console.error("Load Order Error:", message);
  }, [orderError]);

  const handleExportPdf = React.useCallback(() => {
    if (!order) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Order ${order.orderNumber}`, 14, 18);
    doc.setFontSize(10);
    doc.text("Order Details", 14, 24);

    const summaryRows: Array<[string, string]> = [
      ["Order Number", order.orderNumber],
      ["Status", order.status],
      ["Product Type", order.productType],
      ["Order Date", formatDate(order.orderDate)],
      ["Delivery Date", formatDate(order.deliveryDate)],
      ["Buyer", order.buyer?.name || order.buyerId],
      ["Company", order.companyProfile?.name || order.companyProfileId],
    ];

    autoTable(doc, {
      startY: 30,
      head: [["Summary", ""]],
      body: summaryRows,
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 41, 55] },
    });

    let startY = (doc as any).lastAutoTable?.finalY
      ? (doc as any).lastAutoTable.finalY + 8
      : 30;

    const orderItems = Array.isArray(order.orderItems)
      ? order.orderItems
      : order.orderItems
        ? [order.orderItems]
        : [];
    const item = orderItems[0] || null;
    if (!item) {
      const filename = `order-${order.orderNumber || order.id}.pdf`;
      doc.save(filename);
      return;
    }
    if (order.productType === "FABRIC" && item.fabricItem) {
      autoTable(doc, {
        startY,
        head: [["Fabric Details", ""]],
        body: [
          ["Style No", item.fabricItem.styleNo || "-"],
          ["Description", item.fabricItem.discription || "-"],
          ["Width", item.fabricItem.width || "-"],
        ],
        theme: "striped",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [31, 41, 55] },
      });
      startY = (doc as any).lastAutoTable?.finalY
        ? (doc as any).lastAutoTable.finalY + 6
        : startY;
      const rows = item.fabricItem.fabricItemData || [];
      if (rows.length) {
        autoTable(doc, {
          startY,
          head: [
            [
              "Color",
              "Net Weight",
              "Gross Weight",
              "Qty (Yds)",
              "Unit Price",
              "Total",
            ],
          ],
          body: rows.map((row: any) => [
            row.color || "-",
            row.netWeight ?? "-",
            row.grossWeight ?? "-",
            row.quantityYds ?? "-",
            row.unitPrice ?? "-",
            row.totalAmount ?? "-",
          ]),
          theme: "striped",
          styles: { fontSize: 8 },
        });
      }
    }

    if (order.productType === "LABEL_TAG" && item.labelItem) {
      autoTable(doc, {
        startY,
        head: [["Label Details", ""]],
        body: [["Style No", item.labelItem.styleNo || "-"]],
        theme: "striped",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [31, 41, 55] },
      });
      startY = (doc as any).lastAutoTable?.finalY
        ? (doc as any).lastAutoTable.finalY + 6
        : startY;
      const rows = item.labelItem.labelItemData || [];
      if (rows.length) {
        autoTable(doc, {
          startY,
          head: [
            [
              "Desc",
              "Color",
              "Net",
              "Gross",
              "Qty Dzn",
              "Qty Pcs",
              "Unit Price",
              "Total",
            ],
          ],
          body: rows.map((row: any) => [
            row.desscription || "-",
            row.color || "-",
            row.netWeight ?? "-",
            row.grossWeight ?? "-",
            row.quantityDzn ?? "-",
            row.quantityPcs ?? "-",
            row.unitPrice ?? "-",
            row.totalAmount ?? "-",
          ]),
          theme: "striped",
          styles: { fontSize: 8 },
        });
      }
    }

    if (order.productType === "CARTON" && item.cartonItem) {
      autoTable(doc, {
        startY,
        head: [["Carton Details", ""]],
        body: [["Order No", item.cartonItem.orderNo || "-"]],
        theme: "striped",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [31, 41, 55] },
      });
      startY = (doc as any).lastAutoTable?.finalY
        ? (doc as any).lastAutoTable.finalY + 6
        : startY;
      const rows = item.cartonItem.cartonItemData || [];
      if (rows.length) {
        autoTable(doc, {
          startY,
          head: [
            [
              "Measurement",
              "Ply",
              "Qty",
              "Net",
              "Gross",
              "Unit",
              "Unit Price",
              "Total",
            ],
          ],
          body: rows.map((row: any) => [
            row.cartonMeasurement || "-",
            row.cartonPly || "-",
            row.cartonQty ?? "-",
            row.netWeight ?? "-",
            row.grossWeight ?? "-",
            row.unit || "-",
            row.unitPrice ?? "-",
            row.totalAmount ?? "-",
          ]),
          theme: "striped",
          styles: { fontSize: 8 },
        });
      }
    }

    const filename = `order-${order.orderNumber || order.id}.pdf`;
    doc.save(filename);
  }, [order]);

  React.useEffect(() => {
    if (!shouldExport || !order || exportTriggered.current) return;
    exportTriggered.current = true;
    handleExportPdf();
  }, [order, shouldExport, handleExportPdf]);

  return (
    <Container className="pb-10 pt-6">
      <Flex className="flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2 mb-4 lg:mb-8">
          <Button variant="outline" asChild>
            <Link href="/order-management/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          {order && (
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(order.status)}`}
            >
              {order.status}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-4 lg:mb-8">
          <Button variant="outline" onClick={handleExportPdf} disabled={!order}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              order &&
              router.push(
                `/order-management/orders/add-new-order?duplicateId=${order.id}`,
              )
            }
            disabled={!order}
          >
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          <Button variant="outline" asChild disabled={!order}>
            <Link href={`/order-management/orders/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </Flex>

      {loading && (
        <PrimaryText className="text-sm text-muted-foreground">
          Loading order...
        </PrimaryText>
      )}

      {order && <OrderReadOnly order={order} />}
    </Container>
  );
};

export default OrderDetails;
