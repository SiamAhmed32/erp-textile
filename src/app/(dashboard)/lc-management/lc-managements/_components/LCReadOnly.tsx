"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LCManagement } from "./types";
import {
  Building2,
  Calendar,
  FileText,
  MapPin,
  User as UserIcon,
  Wallet,
  Truck,
  Hash,
  Globe,
  Ship,
  Scale,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  lc: LCManagement;
};

const LCReadOnly = ({ lc }: Props) => {
  const router = useRouter();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const InfoBlock = ({
    icon: Icon,
    label,
    value,
    colorClass = "bg-slate-50 text-slate-500",
  }: any) => (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-100 transition-colors shadow-sm">
      <div className={`p-2.5 rounded-lg ${colorClass}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-900 mt-0.5">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );

  const StatusItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | null | undefined;
  }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-900">{value || "N/A"}</span>
    </div>
  );

  // Aggregate items from linked invoice
  const orderItems = lc.invoice?.order?.orderItems || [];
  const normalizedItems: any[] = [];

  if (Array.isArray(orderItems)) {
    orderItems.forEach((item: any) => {
      if (item.fabricItem) {
        normalizedItems.push({
          style: item.fabricItem.styleNo,
          desc: item.fabricItem.discription,
          qty: item.fabricItem.totalQuantityYds,
          unit: "Yds",
          price: item.fabricItem.totalUnitPrice,
          total: item.fabricItem.totalAmount,
        });
      } else if (item.labelItem) {
        normalizedItems.push({
          style: item.labelItem.styleNo,
          desc: "Label Items",
          qty:
            item.labelItem.totalAmount > 0
              ? item.labelItem.totalAmount /
                item.labelItem.labelItemData[0]?.unitPrice
              : 0,
          unit: "Pcs",
          price: item.labelItem.labelItemData?.[0]?.unitPrice,
          total: item.labelItem.totalAmount,
        });
      }
    });
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Header Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoBlock
          icon={CreditCard}
          label="BBLC Number"
          value={lc.bblcNumber}
          colorClass="bg-blue-50 text-blue-600"
        />
        <InfoBlock
          icon={Wallet}
          label="Total Amount"
          value={`US$ ${Number(lc.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          colorClass="bg-green-50 text-green-600"
        />
        <InfoBlock
          icon={Calendar}
          label="Date of Opening"
          value={formatDate(lc.dateOfOpening)}
          colorClass="bg-purple-50 text-purple-600"
        />
        <InfoBlock
          icon={MapPin}
          label="Destination"
          value={lc.destination}
          colorClass="bg-orange-50 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Export & Banking Card */}
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-blue-600 rounded-full" />
                <CardTitle className="text-lg font-bold">
                  Export & Banking Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">
                    Export Details
                  </h4>
                  <StatusItem label="Export L/C No" value={lc.exportLcNo} />
                  <StatusItem
                    label="Export L/C Date"
                    value={formatDate(lc.exportLcDate)}
                  />
                  <StatusItem label="BIN Number" value={lc.binNo} />
                  <StatusItem label="H.S Code" value={lc.hsCodeNo} />
                </div>
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">
                    Issuing Bank
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-start gap-3">
                      <Building2 className="text-blue-600 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {lc.lcIssueBankName}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {lc.lcIssueBankBranch}
                        </p>
                      </div>
                    </div>
                  </div>
                  <StatusItem label="Notify Party" value={lc.notifyParty} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logistics Card */}
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-orange-500 rounded-full" />
                <CardTitle className="text-lg font-bold">
                  Logistics & Delivery
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Truck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Transport
                    </span>
                  </div>
                  <p className="text-sm font-bold">{lc.carrier}</p>
                  <p className="text-xs text-slate-500">{lc.transportMode}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Globe size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Sales Term
                    </span>
                  </div>
                  <p className="text-sm font-bold">{lc.salesTerm}</p>
                  <p className="text-xs text-slate-500">Freight Terms</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Hash size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Vehicle/Challan
                    </span>
                  </div>
                  <p className="text-sm font-bold">{lc.vehicleNo || "N/A"}</p>
                  <p className="text-xs text-slate-500">
                    Challan: {lc.challanNo || "Pending"}
                  </p>
                </div>
              </div>

              <Separator className="my-6 bg-slate-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-lg border border-dashed border-slate-200">
                  <div className="h-10 w-10 flex items-center justify-center bg-white rounded-full text-slate-400 shadow-sm font-bold text-xs uppercase">
                    Dr
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Driver Info
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {lc.driverName || "Not assigned"}
                    </p>
                    <p className="text-xs text-slate-500">{lc.contactNo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-lg border border-dashed border-slate-200">
                  <div className="h-10 w-10 flex items-center justify-center bg-white rounded-full text-slate-400 shadow-sm">
                    <Scale size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Weights
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      NW:{" "}
                      {(lc.invoice?.order?.orderItems?.[0] as any)?.fabricItem
                        ?.totalNetWeight || 0}{" "}
                      KG
                    </p>
                    <p className="text-xs text-slate-500">
                      GW:{" "}
                      {(lc.invoice?.order?.orderItems?.[0] as any)?.fabricItem
                        ?.totalGrossWeight || 0}{" "}
                      KG
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Table Card */}
          <Card className="border-none shadow-md bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-green-600 rounded-full" />
                <CardTitle className="text-lg font-bold">
                  Itemized Details (from PI)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="hover:bg-slate-50 border-0">
                    <TableHead className="font-bold text-slate-600">
                      Style/Item
                    </TableHead>
                    <TableHead className="font-bold text-slate-600">
                      Description
                    </TableHead>
                    <TableHead className="text-center font-bold text-slate-600">
                      Quantity
                    </TableHead>
                    <TableHead className="text-right font-bold text-slate-600">
                      Unit Price
                    </TableHead>
                    <TableHead className="text-right font-bold text-slate-600">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {normalizedItems.map((item, i) => (
                    <TableRow
                      key={i}
                      className="hover:bg-slate-50/50 border-slate-50"
                    >
                      <TableCell className="font-bold text-slate-900">
                        {item.style}
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs italic">
                        {item.desc}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700"
                        >
                          {item.qty} {item.unit}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-600">
                        $ {item.price}
                      </TableCell>
                      <TableCell className="text-right font-black text-slate-900">
                        ${" "}
                        {Number(item.total).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right 1/3: Linked Source & Ownership */}
        <div className="space-y-6">
          {/* Source PI Card - Standard Style */}
          <Card className="border-none shadow-md bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShoppingBag className="text-blue-600" size={16} />
                Linked Source (PI)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    PI Number
                  </p>
                  <p className="text-sm font-black text-slate-900">
                    {lc.invoice?.piNumber || "N/A"}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] bg-blue-50 text-blue-600 border-blue-100"
                >
                  {lc.invoice?.order?.productType}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400 block font-medium">
                    Order Ref
                  </span>
                  <span className="font-bold text-slate-700">
                    {lc.invoice?.order?.orderNumber || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">
                    Dated
                  </span>
                  <span className="font-bold text-slate-700">
                    {lc.invoice?.date
                      ? new Date(lc.invoice.date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-8 text-xs font-bold border-slate-200 hover:bg-slate-50 hover:text-blue-600"
                onClick={() =>
                  router.push(`/invoice-management/invoices/${lc.invoiceId}`)
                }
              >
                View Full Invoice
              </Button>
            </CardContent>
          </Card>

          {/* Record Timeline / Owner Card */}
          <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
            <CardContent className="pt-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                    <UserIcon size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Entry Managed By
                    </p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">
                      {lc.user
                        ? `${lc.user.firstName} ${lc.user.lastName}`
                        : "System Admin"}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {lc.user?.email}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 space-y-3">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-bold uppercase">
                      Created On
                    </span>
                    <span className="text-slate-600 font-bold">
                      {formatDate(lc.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-bold uppercase">
                      Last Updated
                    </span>
                    <span className="text-slate-600 font-bold">
                      {formatDate(lc.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Remarks Card */}
          {lc.remarks && (
            <Card className="border-none shadow-md bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Hash className="text-blue-500" size={14} />
                  Internal Remarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600 leading-relaxed italic whitespace-pre-wrap py-2 border-l-2 border-blue-100 pl-3">
                  {lc.remarks}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LCReadOnly;
