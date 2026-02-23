"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Download } from "lucide-react";
import { Container, PageHeader, DetailsSkeleton } from "@/components/reusables";
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
          <PageHeader
            title={order ? `Order: ${order.orderNumber}` : "Order Details"}
            backHref="/order-management/orders"
            breadcrumbItems={[
              //{ label: "Dashboard", href: "/" },
              { label: "Order Management", href: "/order-management/orders" },
              { label: "Orders", href: "/order-management/orders" },
              { label: order?.orderNumber || "Details" },
            ]}
            actions={
              <div className="flex flex-wrap gap -2">
                {order && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-slate-200 hover:bg-slate-50 shadow-sm"
                    onClick={() => exportOrderToPdf(order)}
                  >
                    <Download className="h-4 w-4" />
                    Export PDF
                  </Button>
                )}

                <Button
                  className="bg-black text-white hover:bg-black/90 shadow-sm"
                  size="sm"
                  asChild
                  disabled={!order}
                >
                  <Link href={`/order-management/orders/${id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Order
                  </Link>
                </Button>
              </div>
            }
          />

          {order && <OrderReadOnly order={order} />}
        </>
      )}
    </Container>
  );
};

export default OrderDetails;
