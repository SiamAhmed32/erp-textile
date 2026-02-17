import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "./types";
import { formatDate } from "./helpers";

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

  // Calculate totals
  const calculateTotals = () => {
    if (order.productType === "FABRIC" && fabricItem?.fabricItemData) {
      const rows = fabricItem.fabricItemData;
      return {
        totalNetWeight: rows.reduce(
          (sum, row) => sum + (Number(row.netWeight) || 0),
          0,
        ),
        totalGrossWeight: rows.reduce(
          (sum, row) => sum + (Number(row.grossWeight) || 0),
          0,
        ),
        totalQuantity: rows.reduce(
          (sum, row) => sum + (Number(row.quantityYds) || 0),
          0,
        ),
        totalAmount: rows.reduce(
          (sum, row) => sum + (Number(row.totalAmount) || 0),
          0,
        ),
      };
    } else if (order.productType === "LABEL_TAG" && labelItem?.labelItemData) {
      const rows = labelItem.labelItemData;
      return {
        totalNetWeight: rows.reduce(
          (sum, row) => sum + (Number(row.netWeight) || 0),
          0,
        ),
        totalGrossWeight: rows.reduce(
          (sum, row) => sum + (Number(row.grossWeight) || 0),
          0,
        ),
        totalQuantityDzn: rows.reduce(
          (sum, row) => sum + (Number(row.quantityDzn) || 0),
          0,
        ),
        totalQuantityPcs: rows.reduce(
          (sum, row) => sum + (Number(row.quantityPcs) || 0),
          0,
        ),
        totalAmount: rows.reduce(
          (sum, row) => sum + (Number(row.totalAmount) || 0),
          0,
        ),
      };
    } else if (order.productType === "CARTON" && cartonItem?.cartonItemData) {
      const rows = cartonItem.cartonItemData;
      return {
        totalCartonQty: rows.reduce(
          (sum, row) => sum + (Number(row.cartonQty) || 0),
          0,
        ),
        totalNetWeight: rows.reduce(
          (sum, row) => sum + (Number(row.netWeight) || 0),
          0,
        ),
        totalGrossWeight: rows.reduce(
          (sum, row) => sum + (Number(row.grossWeight) || 0),
          0,
        ),
        totalAmount: rows.reduce(
          (sum, row) => sum + (Number(row.totalAmount) || 0),
          0,
        ),
      };
    }
    return {};
  };

  const totals = calculateTotals();

  const renderFabricTable = () => {
    const rows = fabricItem?.fabricItemData || [];
    if (!rows.length) return null;
    return (
      <Table className="border">
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="text-center border font-semibold text-foreground">
              Style No/Po Number
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Description
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Width
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Colour
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Net Weight
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Gross Weight
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Qty (Yds)
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Unit Price (US$)
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Total (US$)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: any, index: number) => (
            <TableRow key={index}>
              {index === 0 && (
                <>
                  <TableCell
                    rowSpan={rows.length}
                    className="text-center align-middle font-medium border"
                  >
                    {fabricItem.styleNo || "-"}
                  </TableCell>
                  <TableCell
                    rowSpan={rows.length}
                    className="text-center align-middle border"
                  >
                    {fabricItem.discription || "-"}
                  </TableCell>
                  <TableCell
                    rowSpan={rows.length}
                    className="text-center align-middle border"
                  >
                    {fabricItem.width || "-"}
                  </TableCell>
                </>
              )}
              <TableCell className="text-center border">
                {row.color || "-"}
              </TableCell>
              <TableCell className="text-center border">
                {row.netWeight ?? "-"}
              </TableCell>
              <TableCell className="text-center border">
                {row.grossWeight ?? "-"}
              </TableCell>
              <TableCell className="text-center border">
                {row.quantityYds ?? "-"}
              </TableCell>
              <TableCell className="text-center border">
                ${row.unitPrice ?? "0.00"}
              </TableCell>
              <TableCell className="text-center border">
                ${row.totalAmount ?? "0.00"}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-slate-50 font-semibold">
            <TableCell colSpan={4} className="text-right border">
              Total
            </TableCell>
            <TableCell className="text-center border">
              {totals.totalNetWeight?.toFixed(2) || "0.00"}
            </TableCell>
            <TableCell className="text-center border">
              {totals.totalGrossWeight?.toFixed(2) || "0.00"}
            </TableCell>
            <TableCell className="text-center border">
              {totals.totalQuantity?.toFixed(2) || "0.00"}
            </TableCell>
            <TableCell className="text-center border"></TableCell>
            <TableCell className="text-center border">
              ${totals.totalAmount?.toFixed(2) || "0.00"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  const renderLabelTable = () => {
    const rows = labelItem?.labelItemData || [];
    if (!rows.length) return null;
    return (
      <Table className="border">
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="text-center border font-semibold text-foreground">
              Style No/Po Number
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Description
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Colour
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Net Weight
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Gross Weight
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Qty (Dzn)
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Qty (Pcs)
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Unit Price (US$)
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Total (US$)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: any, index: number) => (
            <TableRow key={index}>
              {index === 0 && (
                <TableCell
                  rowSpan={rows.length}
                  className="text-center align-middle font-medium border"
                >
                  {labelItem.styleNo || "-"}
                </TableCell>
              )}
              <TableCell className="text-center border">
                {row.desscription || "-"}
              </TableCell>
              <TableCell className="text-center border">
                {row.color || "-"}
              </TableCell>
              <TableCell className="text-center border">
                {row.netWeight ?? "-"}
              </TableCell>
              <TableCell className="text-center border">
                {row.grossWeight ?? "-"}
              </TableCell>
              <TableCell className="text-center border">
                {row.quantityDzn ?? "-"}
              </TableCell>
              <TableCell className="text-center border">
                {row.quantityPcs ?? "-"}
              </TableCell>
              <TableCell className="text-center border">
                ${row.unitPrice ?? "0.00"}
              </TableCell>
              <TableCell className="text-center border">
                ${row.totalAmount ?? "0.00"}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-slate-50 font-semibold">
            <TableCell colSpan={3} className="text-right border">
              Total
            </TableCell>
            <TableCell className="text-center border">
              {totals.totalNetWeight?.toFixed(2) || "0.00"}
            </TableCell>
            <TableCell className="text-center border">
              {totals.totalGrossWeight?.toFixed(2) || "0.00"}
            </TableCell>
            <TableCell className="text-center border">
              {totals.totalQuantityDzn?.toFixed(2) || "0.00"}
            </TableCell>
            <TableCell className="text-center border">
              {totals.totalQuantityPcs || "0"}
            </TableCell>
            <TableCell className="text-center border"></TableCell>
            <TableCell className="text-center border">
              ${totals.totalAmount?.toFixed(2) || "0.00"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  const renderCartonTable = () => {
    const rows = cartonItem?.cartonItemData || [];
    if (!rows.length) return null;
    return (
      <Table className="border">
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="text-center border font-semibold text-foreground">
              Order No
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Measurement
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Ply
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Qty
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Net Weight
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Gross Weight
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Unit
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Unit Price (US$)
            </TableHead>
            <TableHead className="text-center border font-semibold text-foreground">
              Total (US$)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: any, index: number) => (
            <TableRow key={index}>
              {index === 0 && (
                <TableCell
                  rowSpan={rows.length}
                  className="text-center align-middle font-medium border"
                >
                  {cartonItem.orderNo || "-"}
                </TableCell>
              )}
              <TableCell className="text-center border">
                {row.cartonMeasurement || "-"}
              </TableCell>
              <TableCell className="text-center border">
                {row.cartonPly || "-"}
              </TableCell>
              <TableCell className="text-center border">
                {row.cartonQty ?? "-"}
              </TableCell>
              <TableCell className="text-center border">
                {row.netWeight ?? "-"}
              </TableCell>
              <TableCell className="text-center border">
                {row.grossWeight ?? "-"}
              </TableCell>
              <TableCell className="text-center border">
                {row.unit || "-"}
              </TableCell>
              <TableCell className="text-center border">
                ${row.unitPrice ?? "0.00"}
              </TableCell>
              <TableCell className="text-center border">
                ${row.totalAmount ?? "0.00"}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-slate-50 font-semibold">
            <TableCell colSpan={3} className="text-right border">
              Total
            </TableCell>
            <TableCell className="text-center border">
              {totals.totalCartonQty || "0"}
            </TableCell>
            <TableCell className="text-center border">
              {totals.totalNetWeight?.toFixed(2) || "0.00"}
            </TableCell>
            <TableCell className="text-center border">
              {totals.totalGrossWeight?.toFixed(2) || "0.00"}
            </TableCell>
            <TableCell className="text-center border"></TableCell>
            <TableCell className="text-center border"></TableCell>
            <TableCell className="text-center border">
              ${totals.totalAmount?.toFixed(2) || "0.00"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="max-w-[210mm] mx-auto bg-white p-8 shadow-lg print:shadow-none">
      {/* Header */}
      <div className="text-center mb-6 border-b-2 border-slate-900 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">
          {order.companyProfile?.name || "Moon Textile"}
        </h1>
        {order.companyProfile?.address && (
          <p className="text-sm text-slate-600 mt-1">
            {order.companyProfile.address}
          </p>
        )}
        {order.companyProfile?.phone && (
          <p className="text-sm text-slate-600">{order.companyProfile.phone}</p>
        )}
      </div>

      {/* Document Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-900 inline-block pb-1">
          Order Invoice
        </h2>
      </div>

      {/* Buyer and Order Information */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        {/* Left: Buyer Information */}
        <div>
          <div className="space-y-1">
            <p className="font-semibold text-slate-900">
              {order.buyer?.name || "[Buyer Name]"}
            </p>
            {order.buyer?.email && (
              <p className="text-sm text-slate-700">{order.buyer.email}</p>
            )}
            {order.buyer?.phone && (
              <p className="text-sm text-slate-700">{order.buyer.phone}</p>
            )}
            {order.buyer?.address && (
              <p className="text-sm text-slate-700">{order.buyer.address}</p>
            )}
            {order.buyer?.location && (
              <p className="text-sm text-slate-700">{order.buyer.location}</p>
            )}
          </div>
        </div>

        {/* Right: Order Details */}
        <div className="text-right space-y-1">
          <p className="text-sm">
            <span className="font-semibold">Date:</span>{" "}
            {formatDate(order.orderDate)}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Order No:</span> {order.orderNumber}{" "}
            ({order.status})
          </p>
          {order.deliveryDate && (
            <p className="text-sm">
              <span className="font-semibold">Delivery:</span>{" "}
              {formatDate(order.deliveryDate)}
            </p>
          )}
        </div>
      </div>

      {/* Product Table */}
      <div className="mb-6">
        {order.productType === "FABRIC" && renderFabricTable()}
        {order.productType === "LABEL_TAG" && renderLabelTable()}
        {order.productType === "CARTON" && renderCartonTable()}
      </div>

      {/* Total Amount in Words */}
      <div className="mb-6">
        <p className="text-sm font-semibold">
          Total Amount (in Words): US Dollar{" "}
          {totals.totalAmount ? `${totals.totalAmount.toFixed(2)}` : "Zero"}
        </p>
      </div>

      {/* Remarks */}
      {order.remarks && (
        <div className="mb-6">
          <p className="text-sm">
            <span className="font-semibold">Remarks:</span> {order.remarks}
          </p>
        </div>
      )}

      {/* Signature Section */}
      <div className="grid grid-cols-2 gap-8 mt-16 pt-8 border-t border-slate-300">
        <div className="text-center">
          <div className="border-t border-slate-900 pt-2 inline-block min-w-[200px]">
            <p className="text-sm font-semibold">Bayer Acceptance</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-slate-900 pt-2 inline-block min-w-[200px]">
            <p className="text-sm font-semibold">Authorised Signature</p>
            <p className="text-sm">
              For {order.companyProfile?.name || "Moon Textile"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReadOnly;
