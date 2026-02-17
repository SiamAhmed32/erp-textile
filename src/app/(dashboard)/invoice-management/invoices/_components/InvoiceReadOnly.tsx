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
import { Invoice } from "./types";
import { formatDate, statusBadgeClass } from "./helpers";

type Props = {
    invoice: Invoice;
};

const InvoiceReadOnly = ({ invoice }: Props) => {
    const order = invoice.order;
    const item = order?.orderItems?.[0] || null;
    const fabricItem = item?.fabricItem;
    const labelItem = item?.labelItem;
    const cartonItem = item?.cartonItem;
    const terms = invoice.invoiceTerms;

    const renderFabricTable = () => {
        const rows = fabricItem?.fabricItemData || [];
        if (!rows.length) return null;
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Style No</TableHead>
                        <TableHead className="text-center">Description</TableHead>
                        <TableHead className="text-center">Width</TableHead>
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
                            {index === 0 && (
                                <>
                                    <TableCell rowSpan={rows.length} className="text-center align-middle font-medium border-r">{fabricItem.styleNo || "-"}</TableCell>
                                    <TableCell rowSpan={rows.length} className="text-center align-middle border-r">{fabricItem.discription || "-"}</TableCell>
                                    <TableCell rowSpan={rows.length} className="text-center align-middle border-r">{fabricItem.width || "-"}</TableCell>
                                </>
                            )}
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
                        <TableHead className="text-center">Style No</TableHead>
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
                            {index === 0 && (
                                <TableCell rowSpan={rows.length} className="text-center align-middle font-medium border-r">{labelItem.styleNo || "-"}</TableCell>
                            )}
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
                        <TableHead className="text-center">Order No</TableHead>
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
                            {index === 0 && (
                                <TableCell rowSpan={rows.length} className="text-center align-middle font-medium border-r">{cartonItem.orderNo || "-"}</TableCell>
                            )}
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
                    <CardTitle>Invoice Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <p className="text-xs text-muted-foreground">PI Number</p>
                        <p className="font-medium">{invoice.piNumber}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(invoice.status)}`}>
                            {invoice.status}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-medium">{formatDate(invoice.date)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Order Number</p>
                        <p className="font-medium">{order?.orderNumber || invoice.orderId}</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Buyer Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <p className="text-xs text-muted-foreground">Buyer Name</p>
                        <p className="font-medium">{order?.buyer?.name || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{order?.buyer?.email || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{order?.buyer?.phone || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Merchandiser</p>
                        <p className="font-medium">{order?.buyer?.merchandiser || "-"}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-xs text-muted-foreground">Address & Location</p>
                        <p className="font-medium">
                            {order?.buyer?.address || "-"}
                            {order?.buyer?.location ? `, ${order.buyer.location}` : ""}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Order Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <p className="text-xs text-muted-foreground">Product Type</p>
                        <p className="font-medium">{order?.productType || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Order Date</p>
                        <p className="font-medium">{formatDate(order?.orderDate)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Delivery Date</p>
                        <p className="font-medium">{formatDate(order?.deliveryDate)}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {order?.productType === "FABRIC" && renderFabricTable()}
                    {order?.productType === "LABEL_TAG" && renderLabelTable()}
                    {order?.productType === "CARTON" && renderCartonTable()}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <p className="text-xs text-muted-foreground">Payment Terms</p>
                        <p className="font-medium">{terms?.payment || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Delivery Terms</p>
                        <p className="font-medium">{terms?.delivery || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Advising Bank</p>
                        <p className="font-medium">{terms?.advisingBank || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Negotiation</p>
                        <p className="font-medium">{terms?.negotiation || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Origin</p>
                        <p className="font-medium">{terms?.origin || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">SWIFT Code</p>
                        <p className="font-medium">{terms?.swiftCode || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">BIN No</p>
                        <p className="font-medium">{terms?.binNo || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">HS Code</p>
                        <p className="font-medium">{terms?.hsCode || "-"}</p>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                        <p className="text-xs text-muted-foreground">Remarks</p>
                        <p className="font-medium">{terms?.remarks || "-"}</p>
                    </div>
                </CardContent>
                <Separator />
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-xs text-muted-foreground">Terms Name</p>
                        <p className="font-medium">{terms?.name || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Created By</p>
                        <p className="font-medium">{invoice.user?.displayName || invoice.user?.email || "-"}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InvoiceReadOnly;
