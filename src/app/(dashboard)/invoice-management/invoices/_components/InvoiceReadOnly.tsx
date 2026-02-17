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
import { FileText, User, Package, List, ScrollText } from "lucide-react";

type Props = {
    invoice: Invoice;
};

const InvoiceReadOnly = ({ invoice }: Props) => {
    const order = invoice.order;
    const orderItems = order?.orderItems;
    const item = Array.isArray(orderItems) ? orderItems[0] : (orderItems || null);
    const fabricItem = (item as any)?.fabricItem;
    const labelItem = (item as any)?.labelItem;
    const cartonItem = (item as any)?.cartonItem;
    const terms = invoice.invoiceTerms;

    const renderFabricTable = () => {
        const rows = fabricItem?.fabricItemData || [];
        if (!rows.length) return null;
        const totalAmount = rows.reduce((sum: number, row: any) => sum + (parseFloat(row.totalAmount) || 0), 0);
        return (
            <div className="rounded-md border border-slate-200 overflow-hidden">
                <Table className="border-collapse">
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                            <TableHead className="text-center border-r border-slate-200 font-bold text-slate-700 h-10">Style No</TableHead>
                            <TableHead className="text-center border-r border-slate-200 font-bold text-slate-700 h-10">Description</TableHead>
                            <TableHead className="text-center border-r border-slate-200 font-bold text-slate-700 h-10">Width</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Color</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Net Weight</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Gross Weight</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Qty (Yds)</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Unit Price</TableHead>
                            <TableHead className="font-bold text-slate-700 h-10">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row: any, index: number) => (
                            <TableRow key={index} className="border-b border-slate-200 last:border-0 hover:bg-slate-50/50">
                                {index === 0 && (
                                    <>
                                        <TableCell rowSpan={rows.length} className="text-center align-middle font-medium border-r border-slate-200 py-3">{fabricItem.styleNo || "-"}</TableCell>
                                        <TableCell rowSpan={rows.length} className="text-center align-middle border-r border-slate-200 py-3">{fabricItem.discription || "-"}</TableCell>
                                        <TableCell rowSpan={rows.length} className="text-center align-middle border-r border-slate-200 py-3">{fabricItem.width || "-"}</TableCell>
                                    </>
                                )}
                                <TableCell className="border-r border-slate-200 py-2">{row.color || "-"}</TableCell>
                                <TableCell className="border-r border-slate-200 py-2">{row.netWeight ?? "-"}</TableCell>
                                <TableCell className="border-r border-slate-200 py-2">{row.grossWeight ?? "-"}</TableCell>
                                <TableCell className="border-r border-slate-200 py-2">{row.quantityYds ?? "-"}</TableCell>
                                <TableCell className="border-r border-slate-200 py-2">{row.unitPrice ?? "-"}</TableCell>
                                <TableCell className="py-2">{row.totalAmount ?? "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                        <TableRow className="hover:bg-slate-50">
                            <TableCell colSpan={8} className="text-right font-bold py-3 pr-4">Total Amount:</TableCell>
                            <TableCell className="font-bold py-3">{totalAmount.toFixed(2)}</TableCell>
                        </TableRow>
                    </tfoot>
                </Table>
            </div>
        );
    };

    const renderLabelTable = () => {
        const rows = labelItem?.labelItemData || [];
        if (!rows.length) return null;
        const totalAmount = rows.reduce((sum: number, row: any) => sum + (parseFloat(row.totalAmount) || 0), 0);
        return (
            <div className="rounded-md border border-slate-200 overflow-hidden">
                <Table className="border-collapse">
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                            <TableHead className="text-center border-r border-slate-200 font-bold text-slate-700 h-10">Style No</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Color</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Net Weight</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Gross Weight</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Qty (Dzn)</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Qty (Pcs)</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Unit Price</TableHead>
                            <TableHead className="font-bold text-slate-700 h-10">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row: any, index: number) => (
                            <TableRow key={index} className="border-b border-slate-200 last:border-0 hover:bg-slate-50/50">
                                {index === 0 && (
                                    <TableCell rowSpan={rows.length} className="text-center align-middle font-medium border-r border-slate-200 py-3">{labelItem.styleNo || "-"}</TableCell>
                                )}
                                <TableCell className="border-r border-slate-200 py-2">{row.color || "-"}</TableCell>
                                <TableCell className="border-r border-slate-200 py-2">{row.netWeight ?? "-"}</TableCell>
                                <TableCell className="border-r border-slate-200 py-2">{row.grossWeight ?? "-"}</TableCell>
                                <TableCell className="border-r border-slate-200 py-2">{row.quantityDzn ?? "-"}</TableCell>
                                <TableCell className="border-r border-slate-200 py-2">{row.quantityPcs ?? "-"}</TableCell>
                                <TableCell className="border-r border-slate-200 py-2">{row.unitPrice ?? "-"}</TableCell>
                                <TableCell className="py-2">{row.totalAmount ?? "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                        <TableRow className="hover:bg-slate-50">
                            <TableCell colSpan={7} className="text-right font-bold py-3 pr-4">Total Amount:</TableCell>
                            <TableCell className="font-bold py-3">{totalAmount.toFixed(2)}</TableCell>
                        </TableRow>
                    </tfoot>
                </Table>
            </div>
        );
    };

    const renderCartonTable = () => {
        const rows = cartonItem?.cartonItemData || [];
        if (!rows.length) return null;
        const totalAmount = rows.reduce((sum: number, row: any) => sum + (parseFloat(row.totalAmount) || 0), 0);
        return (
            <div className="rounded-md border border-slate-200 overflow-hidden">
                <Table className="border-collapse">
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                            <TableHead className="text-center border-r border-slate-200 font-bold text-slate-700 h-10">Order No</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Measurement</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Ply</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Qty</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Net Weight</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Gross Weight</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Unit</TableHead>
                            <TableHead className="border-r border-slate-200 font-bold text-slate-700 h-10">Unit Price</TableHead>
                            <TableHead className="font-bold text-slate-700 h-10">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row: any, index: number) => (
                            <TableRow key={index} className="border-b border-slate-200 last:border-0 hover:bg-slate-50/50">
                                {index === 0 && (
                                    <TableCell rowSpan={rows.length} className="text-center align-middle font-medium border-r border-slate-200 py-3">{cartonItem.orderNo || "-"}</TableCell>
                                )}
                                <TableCell className="border-r border-slate-200 py-2">{row.cartonMeasurement || "-"}</TableCell>
                                <TableCell className="border-r border-slate-200 py-2">{row.cartonPly || "-"}</TableCell>
                                <TableCell className="border-r border-slate-200 py-2">{row.cartonQty ?? "-"}</TableCell>
                                <TableCell className="border-r border-slate-200 py-2">{row.netWeight ?? "-"}</TableCell>
                                <TableCell className="border-r border-slate-200 py-2">{row.grossWeight ?? "-"}</TableCell>
                                <TableCell className="border-r border-slate-200 py-2">{row.unit || "-"}</TableCell>
                                <TableCell className="border-r border-slate-200 py-2">{row.unitPrice ?? "-"}</TableCell>
                                <TableCell className="py-2">{row.totalAmount ?? "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                        <TableRow className="hover:bg-slate-50">
                            <TableCell colSpan={8} className="text-right font-bold py-3 pr-4">Total Amount:</TableCell>
                            <TableCell className="font-bold py-3">{totalAmount.toFixed(2)}</TableCell>
                        </TableRow>
                    </tfoot>
                </Table>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Invoice Summary
                    </CardTitle>
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
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Buyer Information
                    </CardTitle>
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
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Order Overview
                    </CardTitle>
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
                    <CardTitle className="flex items-center gap-2">
                        <List className="h-5 w-5" />
                        Items
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {order?.productType === "FABRIC" && renderFabricTable()}
                    {order?.productType === "LABEL_TAG" && renderLabelTable()}
                    {order?.productType === "CARTON" && renderCartonTable()}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ScrollText className="h-5 w-5" />
                        Terms & Conditions
                    </CardTitle>
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
