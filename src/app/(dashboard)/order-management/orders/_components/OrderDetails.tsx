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
import { exportOrderToPdf } from "./orderPdf";

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
    exportOrderToPdf(order);
  }, [order]);

  React.useEffect(() => {
    if (!shouldExport || !order || exportTriggered.current) return;
    exportTriggered.current = true;
    handleExportPdf();
  }, [order, shouldExport, handleExportPdf]);

  return (
    <Container className="pb-10 pt-6">
      <Flex className="flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
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
        <div className="flex flex-wrap gap-2">
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
        <PrimaryText className="mt-2 text-sm text-muted-foreground">
          Loading order...
        </PrimaryText>
      )}

      <div className="mt-4" />

      {order && <OrderReadOnly order={order} />}
    </Container>
  );
};

export default OrderDetails;
