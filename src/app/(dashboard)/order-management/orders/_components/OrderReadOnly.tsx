import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "./types";
import { formatDate, statusBadgeClass } from "./helpers";

type Props = {
  order: Order;
};

const OrderReadOnly = ({ order }: Props) => {
  const orderItems = Array.isArray(order.orderItems)
    ? order.orderItems
    : order.orderItems
      ? [order.orderItems]
      : [];
  const item = orderItems[0] || null;
  const fabricItem = item?.fabricItem;
  const labelItem = item?.labelItem;
  const cartonItem = item?.cartonItem;

  const renderFabricTable = () => {
    const rows = fabricItem?.fabricItemData || [];
    if (!rows.length) return null;
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Color</TableHead>
            <TableHead>Net Weight</TableHead>
            <TableHead>Gross Weight</TableHead>
            <TableHead>Qty (Yds)</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: any, index: number) => (
            <TableRow key={index}>
              <TableCell>{row.color || "-"}</TableCell>
              <TableCell>{row.netWeight ?? "-"}</TableCell>
              <TableCell>{row.grossWeight ?? "-"}</TableCell>
              <TableCell>{row.quantityYds ?? "-"}</TableCell>
              <TableCell>{row.unitPrice ?? "-"}</TableCell>
              <TableCell>{row.totalAmount ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderLabelTable = () => {
    const rows = labelItem?.labelItemData || [];
    if (!rows.length) return null;
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Net Weight</TableHead>
            <TableHead>Gross Weight</TableHead>
            <TableHead>Qty (Dzn)</TableHead>
            <TableHead>Qty (Pcs)</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: any, index: number) => (
            <TableRow key={index}>
              <TableCell>{row.desscription || "-"}</TableCell>
              <TableCell>{row.color || "-"}</TableCell>
              <TableCell>{row.netWeight ?? "-"}</TableCell>
              <TableCell>{row.grossWeight ?? "-"}</TableCell>
              <TableCell>{row.quantityDzn ?? "-"}</TableCell>
              <TableCell>{row.quantityPcs ?? "-"}</TableCell>
              <TableCell>{row.unitPrice ?? "-"}</TableCell>
              <TableCell>{row.totalAmount ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderCartonTable = () => {
    const rows = cartonItem?.cartonItemData || [];
    if (!rows.length) return null;
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Measurement</TableHead>
            <TableHead>Ply</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Net Weight</TableHead>
            <TableHead>Gross Weight</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: any, index: number) => (
            <TableRow key={index}>
              <TableCell>{row.cartonMeasurement || "-"}</TableCell>
              <TableCell>{row.cartonPly || "-"}</TableCell>
              <TableCell>{row.cartonQty ?? "-"}</TableCell>
              <TableCell>{row.netWeight ?? "-"}</TableCell>
              <TableCell>{row.grossWeight ?? "-"}</TableCell>
              <TableCell>{row.unit || "-"}</TableCell>
              <TableCell>{row.unitPrice ?? "-"}</TableCell>
              <TableCell>{row.totalAmount ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Order Number</p>
            <p className="font-medium">{order.orderNumber || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(order.status)}`}
            >
              {order.status}
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Product Type</p>
            <p className="font-medium">{order.productType}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Order Date</p>
            <p className="font-medium">{formatDate(order.orderDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Delivery Date</p>
            <p className="font-medium">{formatDate(order.deliveryDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Created At</p>
            <p className="font-medium">{formatDate(order.createdAt)}</p>
          </div>
        </CardContent>
        {order.remarks && (
          <>
            <Separator />
            <CardContent>
              <p className="text-xs text-muted-foreground">Remarks</p>
              <p className="text-sm">{order.remarks}</p>
            </CardContent>
          </>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buyer & Company</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Buyer</p>
            <p className="font-medium">{order.buyer?.name || order.buyerId}</p>
            {order.buyer?.email && (
              <p className="text-xs text-muted-foreground">
                {order.buyer.email}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Company</p>
            <p className="font-medium">
              {order.companyProfile?.name || order.companyProfileId}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Created By</p>
            <p className="font-medium">
              {order.user?.displayName || order.user?.email || "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.productType === "FABRIC" && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Style No</p>
                  <p className="font-medium">{fabricItem?.styleNo || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="font-medium">
                    {fabricItem?.discription || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Width</p>
                  <p className="font-medium">{fabricItem?.width || "-"}</p>
                </div>
              </div>
              {renderFabricTable()}
            </>
          )}

          {order.productType === "LABEL_TAG" && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Style No</p>
                  <p className="font-medium">{labelItem?.styleNo || "-"}</p>
                </div>
              </div>
              {renderLabelTable()}
            </>
          )}

          {order.productType === "CARTON" && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Order No</p>
                  <p className="font-medium">{cartonItem?.orderNo || "-"}</p>
                </div>
              </div>
              {renderCartonTable()}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderReadOnly;
