"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Download } from "lucide-react";
import { Container, Flex, DetailsSkeleton } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { useGetByIdQuery } from "@/store/services/commonApi";
import { Order } from "./types";
import { exportOrderToPdf } from "./orderPdf";
import OrderReadOnly from "./OrderReadOnly";

type Props = {
  id: string;
  shouldExport?: boolean;
};

const OrderDetails = ({ id, shouldExport = false }: Props) => {
  const exportTriggered = React.useRef(false);

  const {
    data: orderPayload,
    isFetching: loading,
    error: orderError,
  } = useGetByIdQuery({
    path: "orders",
    id,
  });

  const order = (orderPayload as any)?.data as Order | undefined;

  React.useEffect(() => {
    const error = orderError as any;
    if (error) {
      console.error(
        "Load Order Error:",
        error?.data?.message || "Failed to load order",
      );
    }
  }, [orderError]);

  React.useEffect(() => {
    if (!shouldExport || !order || exportTriggered.current) return;
    exportTriggered.current = true;
    exportOrderToPdf(order);
  }, [order, shouldExport]);

  return (
    <Container className="pb-10 pt-6">
      {loading ? (
        <DetailsSkeleton />
      ) : (
        <>
          <Flex className="flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-6 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/order-management/orders">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block" />
              <h1 className="text-xl font-bold tracking-tight">
                {order ? `Order: ${order.orderNumber}` : "Order Details"}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 text-foreground">
              {order && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-slate-200 hover:bg-slate-50"
                  onClick={() => exportOrderToPdf(order)}
                >
                  <Download className="h-4 w-4 text-emerald-600" />
                  Export PDF
                </Button>
              )}

              <Button variant="outline" size="sm" asChild disabled={!order}>
                <Link href={`/order-management/orders/${id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4 text-primary" />
                  Edit Order
                </Link>
              </Button>
            </div>
          </Flex>

          {order && <OrderReadOnly order={order} />}
        </>
      )}
    </Container>
  );
};

export default OrderDetails;
