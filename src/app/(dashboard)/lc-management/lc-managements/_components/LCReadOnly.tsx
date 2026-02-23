"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LCManagement } from "./types";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { numberToWords } from "@/utils/numberToWords";

type Props = {
  lc: LCManagement;
  items: any[];
  onExport: (type: string, date?: string) => void;
};

const LCReadOnly = ({ lc, items, onExport }: Props) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${d.getDate().toString().padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const buyer = lc.invoice?.order?.buyer;
  const company = lc.invoice?.order?.companyProfile;

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [certType, setCertType] = React.useState<"beneficiary" | "origin">(
    "beneficiary",
  );
  const [certDate, setCertDate] = React.useState(
    new Date().toISOString().split("T")[0],
  );

  const handleOpenCertDialog = (type: "beneficiary" | "origin") => {
    setCertType(type);
    setIsDialogOpen(true);
  };

  const handleCertGenerate = () => {
    onExport(
      certType === "beneficiary"
        ? "beneficiary-certificate"
        : "certificate-of-origin",
      certDate,
    );
    setIsDialogOpen(false);
  };

  // ─── Reusable Field ───────────────────────────────────────────────
  const Field = ({
    label,
    value,
    className = "",
    children,
  }: {
    label: string;
    value?: string | number | null;
    className?: string;
    children?: React.ReactNode;
  }) => (
    <div className={`space-y-1 ${className}`}>
      <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">
        {label}
      </p>
      {children ? (
        children
      ) : (
        <p className="text-sm font-semibold text-gray-800 leading-snug">
          {value || "—"}
        </p>
      )}
    </div>
  );

  // ─── Section label ─────────────────────────────────────────────────
  const SectionLabel = ({ title }: { title: string }) => (
    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-5">
      {title}
    </p>
  );

  // ─── Items Table ──────────────────────────────────────────────────
  const ItemsTable = ({ showPrices = true }) => (
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Style No
            </th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Description
            </th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">
              Width
            </th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">
              Color
            </th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">
              Qty (Yds)
            </th>
            {showPrices && (
              <>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">
                  Amount (USD)
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
              <td className="px-4 py-3 font-semibold text-gray-800">
                {item.style}
              </td>
              <td className="px-4 py-3 text-gray-500">{item.description}</td>
              <td className="px-4 py-3 text-center text-gray-500">
                {item.width}
              </td>
              <td className="px-4 py-3 text-center text-gray-500">
                {item.color}
              </td>
              <td className="px-4 py-3 text-center font-semibold text-gray-800">
                {item.qty}
              </td>
              {showPrices && (
                <>
                  <td className="px-4 py-3 text-right text-gray-500">
                    ${Number(item.unitPrice).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
                    $
                    {Number(item.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50 border-t border-gray-200">
          <tr>
            <td
              colSpan={4}
              className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500"
            >
              Total
            </td>
            <td className="px-4 py-3 text-center font-bold text-gray-800">
              {items.reduce((s, i) => s + Number(i.qty), 0)}
            </td>
            {showPrices && (
              <>
                <td className="px-4 py-3" />
                <td className="px-4 py-3 text-right font-bold text-green-700 text-sm">
                  $
                  {Number(lc.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </>
            )}
          </tr>
        </tfoot>
      </table>
    </div>
  );

  // ─── Download Button ───────────────────────────────────────────────
  const DownloadButton = ({
    label,
    onClick,
    color = "bg-gray-900 hover:bg-gray-800",
  }: {
    label: string;
    onClick: () => void;
    color?: string;
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 h-11 rounded-lg text-white text-xs font-semibold uppercase tracking-wider transition-all ${color}`}
    >
      <Download size={14} />
      {label}
    </button>
  );

  return (
    <div className="max-w-[1300px] mx-auto space-y-5 pb-10">
      {/* ── LC Summary Bar ─────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl px-8 py-6">
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1">
              BBLC Number
            </p>
            <p className="text-xl font-bold text-gray-900">{lc.bblcNumber}</p>
          </div>
          <Separator orientation="vertical" className="h-10 hidden sm:block" />
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1">
              Settlement Amount
            </p>
            <p className="text-xl font-bold text-green-700">
              USD{" "}
              {Number(lc.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <Separator orientation="vertical" className="h-10 hidden sm:block" />
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1">
              Buyer
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {buyer?.name || "—"}
            </p>
          </div>
          <Separator orientation="vertical" className="h-10 hidden sm:block" />
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1">
              Expiry Date
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {formatDate(lc.expiryDate)}
            </p>
          </div>
          <div className="ml-auto">
            <Badge className="bg-blue-50 text-blue-600 border border-blue-100 font-semibold text-[11px] uppercase tracking-wider px-3 py-1 hover:bg-blue-50">
              Active
            </Badge>
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────── */}
      <Tabs defaultValue="commercial-invoice" className="w-full">
        <div className="sticky top-2 z-40 bg-white border border-gray-200 rounded-xl p-1 mb-5 shadow-sm">
          <TabsList className="flex gap-1 bg-transparent w-full">
            {[
              { value: "commercial-invoice", label: "Commercial Invoice" },
              { value: "delivery-challan", label: "Delivery Challan" },
              { value: "beneficiary-certificate", label: "Beneficiary Cert." },
              { value: "certificate-of-origin", label: "Cert. of Origin" },
              { value: "bill-of-exchange", label: "Bill of Exchange" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 text-[11px] font-semibold uppercase tracking-wider py-2 rounded-lg text-gray-500
                  data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-none
                  transition-all"
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ── Commercial Invoice ─────────────────────────────────── */}
        <TabsContent
          value="commercial-invoice"
          className="focus-visible:outline-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <Card className="lg:col-span-8 border-gray-200 rounded-2xl">
              <CardContent className="p-7">
                <SectionLabel title="Invoice Details" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-7 mb-7">
                  <Field label="Invoice No (PI)" value={lc.invoice?.piNumber} />
                  <Field
                    label="Invoice Date"
                    value={formatDate(lc.invoice?.date)}
                  />
                  <Field label="BBLC Number" value={lc.bblcNumber} />
                  <Field
                    label="Opening Date"
                    value={formatDate(lc.dateOfOpening)}
                  />
                </div>
                <Separator className="mb-7" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-7 mb-7">
                  <Field label="Export LC No" value={lc.exportLcNo} />
                  <Field label="BIN Number" value={lc.binNo} />
                  <Field label="HS Code" value={lc.hsCodeNo} />
                  <Field label="Destination" value={lc.destination} />
                </div>
                <ItemsTable />
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1.5">
                    Amount in Words
                  </p>
                  <p className="text-sm font-semibold text-gray-700 italic">
                    US Dollar: {numberToWords(Number(lc.amount))} Only.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-5">
              <Card className="border-gray-200 rounded-2xl">
                <CardContent className="p-6">
                  <SectionLabel title="Parties & Logistics" />
                  <div className="space-y-5">
                    <Field label="Buyer">
                      <p className="text-sm font-semibold text-gray-800">
                        {buyer?.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        {buyer?.address}, {buyer?.location}
                      </p>
                    </Field>
                    <Separator />
                    <div className="grid grid-cols-2 gap-5">
                      <Field label="Carrier" value={lc.carrier} />
                      <Field label="Sales Term" value={lc.salesTerm} />
                    </div>
                    <Separator />
                    <Field
                      label="Notify Party"
                      value={lc.notifyParty || "Same as Buyer"}
                    />
                  </div>
                </CardContent>
              </Card>
              <DownloadButton
                label="Download Invoice"
                onClick={() => onExport("commercial-invoice")}
                color="bg-gray-900 hover:bg-gray-700"
              />
            </div>
          </div>
        </TabsContent>

        {/* ── Delivery Challan ───────────────────────────────────── */}
        <TabsContent
          value="delivery-challan"
          className="focus-visible:outline-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <Card className="lg:col-span-8 border-gray-200 rounded-2xl">
              <CardContent className="p-7">
                <SectionLabel title="Challan Details" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-7 mb-7">
                  <Field label="Challan Number" value={lc.challanNo} />
                  <Field
                    label="Transport Date"
                    value={formatDate(lc.dateOfOpening)}
                  />
                  <Field label="Transport Mode" value={lc.transportMode} />
                  <Field label="Carrier" value={lc.carrier} />
                </div>
                <ItemsTable showPrices={false} />
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-7 p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <Field label="Vehicle No" value={lc.vehicleNo} />
                  <Field label="Driver Name" value={lc.driverName} />
                  <Field label="Contact No" value={lc.contactNo} />
                  <Field label="Sales Term" value={lc.salesTerm} />
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-5">
              <Card className="border-gray-200 rounded-2xl">
                <CardContent className="p-6">
                  <SectionLabel title="Seller & Weight" />
                  <div className="space-y-5">
                    <Field label="Seller">
                      <p className="text-sm font-semibold text-gray-800">
                        {company?.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        {company?.address}
                      </p>
                    </Field>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1">
                          Net Weight
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          {(lc.invoice?.order?.orderItems as any)?.[0]
                            ?.fabricItem?.totalNetWeight || "0.00"}{" "}
                          <span className="text-xs font-normal text-gray-400">
                            KG
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1">
                          Gross Weight
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          {(lc.invoice?.order?.orderItems as any)?.[0]
                            ?.fabricItem?.totalGrossWeight || "0.00"}{" "}
                          <span className="text-xs font-normal text-gray-400">
                            KG
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <DownloadButton
                label="Download Challan"
                onClick={() => onExport("delivery-challan")}
                color="bg-gray-900 hover:bg-gray-700"
              />
            </div>
          </div>
        </TabsContent>

        {/* ── Beneficiary Certificate ────────────────────────────── */}
        <TabsContent
          value="beneficiary-certificate"
          className="focus-visible:outline-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <Card className="lg:col-span-8 border-gray-200 rounded-2xl">
              <CardContent className="p-7">
                <SectionLabel title="Certification Details" />
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 mb-7 italic text-gray-600 text-sm leading-relaxed">
                  <p className="not-italic text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">
                    Official Declaration
                  </p>
                  "
                  {lc.remarks ||
                    "We certify that the mentioned products are of Bangladeshi Origin and have been delivered in accordance with the terms."}
                  "
                </div>
                <ItemsTable />
              </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-5">
              <Card className="border-gray-200 rounded-2xl">
                <CardContent className="p-6">
                  <SectionLabel title="Signatory" />
                  <div className="space-y-5">
                    <Field label="Authorized For">
                      <p className="text-sm font-semibold text-gray-800">
                        {company?.name}
                      </p>
                    </Field>
                    <div className="h-12 border-b-2 border-dashed border-gray-200" />
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                      Authorized Signature
                    </p>
                    <Separator />
                    <Field label="Buyer" value={buyer?.name} />
                  </div>
                </CardContent>
              </Card>
              <DownloadButton
                label="Download Cert. of Beneficiary"
                onClick={() => handleOpenCertDialog("beneficiary")}
                color="bg-gray-900 hover:bg-gray-700"
              />
            </div>
          </div>
        </TabsContent>

        {/* ── Certificate of Origin ─────────────────────────────── */}
        <TabsContent
          value="certificate-of-origin"
          className="focus-visible:outline-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <Card className="lg:col-span-8 border-gray-200 rounded-2xl">
              <CardContent className="p-7">
                <SectionLabel title="Origin Details" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-7 mb-7">
                  <Field label="Origin Country" value="Bangladesh" />
                  <Field label="Certificate Type" value="LC Document" />
                  <Field label="Issue Date" value={formatDate(lc.issueDate)} />
                  <Field
                    label="Expiry Date"
                    value={formatDate(lc.expiryDate)}
                  />
                </div>
                <ItemsTable />
              </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-5">
              <Card className="border-gray-200 rounded-2xl">
                <CardContent className="p-6">
                  <SectionLabel title="Verification Note" />
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    This document certifies that the listed goods are
                    manufactured and originated in the country stated above.
                  </p>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-[11px] text-gray-500 font-medium uppercase tracking-wider text-center">
                    Standard Verification
                  </div>
                </CardContent>
              </Card>
              <DownloadButton
                label="Download Cert. of Origin"
                onClick={() => handleOpenCertDialog("origin")}
                color="bg-gray-900 hover:bg-gray-700"
              />
            </div>
          </div>
        </TabsContent>

        {/* ── Bill of Exchange ──────────────────────────────────── */}
        <TabsContent
          value="bill-of-exchange"
          className="focus-visible:outline-none"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Drawer */}
              <Card className="border-gray-200 rounded-2xl">
                <CardContent className="p-7">
                  <div className="flex items-center justify-between mb-5">
                    <SectionLabel title="Drawer Details (Client)" />
                    <Badge className="bg-amber-50 text-amber-700 border-amber-100 text-[10px] font-semibold uppercase tracking-wider">
                      Client
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-7 mb-5">
                    <Field
                      label="Dispatch Location"
                      value={lc.billOfExchangeLocationClient}
                    />
                    <Field
                      label="Processing Date"
                      value={formatDate(lc.billOfExchangeDateClient)}
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1.5">
                      Internal Remark
                    </p>
                    <p className="text-sm text-gray-500 italic leading-relaxed">
                      {lc.billOfExchangeRemarkClient ||
                        "No specific drawer remarks provided."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Drawee */}
              <Card className="border-gray-200 rounded-2xl">
                <CardContent className="p-7">
                  <div className="flex items-center justify-between mb-5">
                    <SectionLabel title="Drawee Details (Bank)" />
                    <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] font-semibold uppercase tracking-wider">
                      Bank
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-7 mb-5">
                    <Field
                      label="Bank Location"
                      value={lc.billOfExchangeLocationBank}
                    />
                    <Field
                      label="Value Date"
                      value={formatDate(lc.billOfExchangeDateBank)}
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1.5">
                      Bank Instruction
                    </p>
                    <p className="text-sm text-gray-500 italic leading-relaxed">
                      {lc.billOfExchangeRemarkBank ||
                        "No specific bank instructions provided."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Draft Amount */}
            <Card className="border-gray-200 rounded-2xl">
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-2">
                      Draft Amount
                    </p>
                    <p className="text-4xl font-bold text-gray-900 tracking-tight">
                      USD{" "}
                      {Number(lc.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-sm text-gray-400 italic mt-1.5">
                      {numberToWords(Number(lc.amount))} Only.
                    </p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <span className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Copy 01
                    </span>
                    <span className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Copy 02
                    </span>
                    <button
                      onClick={() => onExport("bill-of-exchange")}
                      className="flex items-center gap-2 px-5 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      <Download size={13} />
                      Generate PDF
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Audit Footer ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-6 px-6 py-4 bg-white border border-gray-200 rounded-2xl text-[11px] text-gray-400 font-medium">
        <span>
          Operator:{" "}
          <span className="text-gray-600 font-semibold">
            {lc.user ? `${lc.user.firstName} ${lc.user.lastName}` : "System"}
          </span>
        </span>
        <span>
          Created:{" "}
          <span className="text-gray-600">{formatDate(lc.createdAt)}</span>
        </span>
        <span>
          Updated:{" "}
          <span className="text-gray-600">{formatDate(lc.updatedAt)}</span>
        </span>
        {company && (
          <span className="ml-auto font-semibold text-gray-600">
            {company.name}
          </span>
        )}
      </div>

      {/* ── Certificate Date Dialog ────────────────────────────────── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-800 text-base font-bold">
              Prepare Certificate
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1">
                Document Type
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {certType === "beneficiary"
                  ? "Beneficiary Certificate"
                  : "Certificate of Origin"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                BBLC: {lc.bblcNumber}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                Certificate Issue Date
              </Label>
              <Input
                type="date"
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
                className="h-10 rounded-lg border-gray-200"
              />
              <p className="text-[10px] text-gray-400 italic">
                This date will appear on the printed certificate.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1">
                  Buyer
                </p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {buyer?.name || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1">
                  PI Number
                </p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {lc.invoice?.piNumber || "—"}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-lg text-gray-500 border-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCertGenerate}
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold text-xs uppercase tracking-wider"
            >
              Generate & Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LCReadOnly;
