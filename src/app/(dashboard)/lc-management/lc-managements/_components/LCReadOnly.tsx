"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LCManagement } from "./types";
import {
  Building2,
  Receipt,
  Truck,
  FileText,
  FileCheck,
  Banknote,
  Download,
  MapPin,
  Calendar,
  Hash,
  Scale,
  Signature,
  Shield,
  Info,
  CreditCard,
  User as UserIcon,
  CalendarDays,
  Globe,
  Printer,
  Settings2,
} from "lucide-react";
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
    return `${d.getDate().toString().padStart(2, "0")}-${months[d.getMonth()]}-${d.getFullYear().toString().slice(-2)}`;
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
    <div className={`space-y-1.5 ${className}`}>
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none">
        {label}
      </p>
      {children ? (
        children
      ) : (
        <p className="text-sm font-semibold text-slate-700 break-words line-clamp-3 leading-snug">
          {value || "—"}
        </p>
      )}
    </div>
  );

  const SectionHeader = ({
    title,
  }: {
    icon?: any;
    title: string;
    colorClass?: string;
  }) => (
    <div className="mb-6 pb-2 border-b border-slate-100">
      <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-slate-700">
        {title}
      </h3>
    </div>
  );

  const ItemsTable = ({ showPrices = true }) => (
    <div className="mt-6 rounded-xl border border-slate-100 overflow-hidden bg-white">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-4 py-3 font-bold uppercase text-slate-500 tracking-wider">
              Style No
            </th>
            <th className="px-4 py-3 font-bold uppercase text-slate-500 tracking-wider">
              Description
            </th>
            <th className="px-4 py-3 font-bold uppercase text-slate-500 tracking-wider text-center">
              Width
            </th>
            <th className="px-4 py-3 font-bold uppercase text-slate-500 tracking-wider text-center">
              Color
            </th>
            <th className="px-4 py-3 font-bold uppercase text-slate-500 tracking-wider text-center">
              Quantity (Yds)
            </th>
            {showPrices && (
              <>
                <th className="px-4 py-3 font-bold uppercase text-slate-500 tracking-wider text-right">
                  Unit Price
                </th>
                <th className="px-4 py-3 font-bold uppercase text-slate-500 tracking-wider text-right">
                  Amount ($)
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
              <td className="px-4 py-3 font-bold text-slate-800">
                {item.style}
              </td>
              <td className="px-4 py-3 text-slate-600 line-clamp-1">
                {item.description}
              </td>
              <td className="px-4 py-3 text-center text-slate-600 italic">
                {item.width}
              </td>
              <td className="px-4 py-3 text-center text-slate-600">
                {item.color}
              </td>
              <td className="px-4 py-3 text-center font-bold text-slate-800">
                {item.qty}
              </td>
              {showPrices && (
                <>
                  <td className="px-4 py-3 text-right text-slate-600">
                    ${Number(item.unitPrice).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-800">
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
        <tfoot className="bg-slate-50/80 border-t border-slate-200">
          <tr>
            <td
              colSpan={4}
              className="px-4 py-3 text-right font-bold uppercase text-slate-500"
            >
              Total
            </td>
            <td className="px-4 py-3 text-center font-bold text-slate-800">
              {items.reduce((s, i) => s + Number(i.qty), 0)}
            </td>
            {showPrices && (
              <>
                <td className="px-4 py-3 text-right font-bold text-emerald-600">
                  US $
                </td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 text-sm">
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

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* ═══════════ HEADER STRIP (SIMPLIFIED) ═══════════ */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-white text-slate-700 border border-slate-200">
        <div className="flex flex-wrap items-center gap-8 relative z-10">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                BBLC Identifier
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                {lc.bblcNumber}
              </h2>
            </div>
          </div>

          <Separator
            orientation="vertical"
            className="h-12 bg-slate-100 hidden lg:block"
          />

          <div className="flex gap-10 flex-wrap">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                Settlement Amount
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                US${" "}
                {Number(lc.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                Current Status
              </p>
              <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 font-bold text-[10px] tracking-widest hover:bg-blue-100 transition-colors cursor-default uppercase">
                ACTIVE LC
              </Badge>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                Buyer Entity
              </p>
              <p className="text-sm font-bold text-slate-700">
                {buyer?.name || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ DOCUMENT TABS ═══════════ */}
      <Tabs defaultValue="commercial-invoice" className="w-full">
        <div className="bg-white p-1.5 rounded-2xl border border-slate-100 flex justify-center mb-8 sticky top-2 z-50">
          <TabsList className="bg-transparent gap-1 sm:gap-4 h-auto p-0 flex-wrap justify-center">
            <TabsTrigger
              value="commercial-invoice"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none px-5 py-3 rounded-xl gap-2 transition-all font-bold text-[10px] uppercase tracking-widest border border-transparent data-[state=active]:border-blue-100"
            >
              <Receipt size={16} />{" "}
              <span className="hidden sm:inline">Commercial Invoice</span>
            </TabsTrigger>
            <TabsTrigger
              value="delivery-challan"
              className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:shadow-none px-5 py-3 rounded-xl gap-2 transition-all font-bold text-[10px] uppercase tracking-widest border border-transparent data-[state=active]:border-amber-100"
            >
              <Truck size={16} />{" "}
              <span className="hidden sm:inline">Delivery Challan</span>
            </TabsTrigger>
            <TabsTrigger
              value="beneficiary-certificate"
              className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none px-5 py-3 rounded-xl gap-2 transition-all font-bold text-[10px] uppercase tracking-widest border border-transparent data-[state=active]:border-emerald-100"
            >
              <FileText size={16} />{" "}
              <span className="hidden sm:inline">Beneficiary Cert.</span>
            </TabsTrigger>
            <TabsTrigger
              value="certificate-of-origin"
              className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:shadow-none px-5 py-3 rounded-xl gap-2 transition-all font-bold text-[10px] uppercase tracking-widest border border-transparent data-[state=active]:border-orange-100"
            >
              <FileCheck size={16} />{" "}
              <span className="hidden sm:inline">Cert. of Origin</span>
            </TabsTrigger>
            <TabsTrigger
              value="bill-of-exchange"
              className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700 data-[state=active]:shadow-none px-5 py-3 rounded-xl gap-2 transition-all font-bold text-[10px] uppercase tracking-widest border border-transparent data-[state=active]:border-violet-100"
            >
              <Banknote size={16} />{" "}
              <span className="hidden sm:inline">Bill of Exchange</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ─── TAB: Commercial Invoice ─── */}
        <TabsContent
          value="commercial-invoice"
          className="space-y-6 focus-visible:outline-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8 border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-8">
                <SectionHeader
                  icon={Receipt}
                  title="Invoice Summary"
                  colorClass="bg-blue-50 text-blue-600"
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
                <Separator className="my-8 opacity-50" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <Field label="Export LC No" value={lc.exportLcNo} />
                  <Field label="BIN Number" value={lc.binNo} />
                  <Field label="HS Code" value={lc.hsCodeNo} />
                  <Field label="Destination" value={lc.destination} />
                </div>
                <ItemsTable />
                <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Total Amount in Words
                  </p>
                  <p className="text-sm font-bold text-slate-800 italic uppercase">
                    US Dollar: {numberToWords(Number(lc.amount))} Only.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-6">
              <Card className="border-slate-200 rounded-3xl bg-white overflow-hidden">
                <CardContent className="p-6">
                  <SectionHeader
                    icon={Building2}
                    title="Entities & Logistics"
                    colorClass="bg-indigo-50 text-indigo-600"
                  />
                  <div className="space-y-6">
                    <Field label="Buyer Identity">
                      <p className="text-sm font-bold text-slate-800 leading-tight">
                        {buyer?.name}
                      </p>
                      <p className="text-[11px] font-bold text-slate-500 mt-1.5 leading-relaxed">
                        {buyer?.address}, {buyer?.location}
                      </p>
                    </Field>

                    <Separator className="opacity-50" />

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Carrier" value={lc.carrier} />
                      <Field label="Sales Term" value={lc.salesTerm} />
                    </div>

                    <Separator className="opacity-50" />

                    <Field
                      label="Notify Party"
                      value={lc.notifyParty || "Same as Buyer"}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={() => onExport("commercial-invoice")}
                className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-xs gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Download Commercial Invoice
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ─── TAB: Delivery Challan ─── */}
        <TabsContent
          value="delivery-challan"
          className="space-y-6 focus-visible:outline-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8 border-slate-200 rounded-3xl bg-white overflow-hidden">
              <CardContent className="p-8">
                <SectionHeader
                  icon={Truck}
                  title="Challan Manifest"
                  colorClass="bg-amber-50 text-amber-600"
                />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 bg-amber-50/30 p-6 rounded-2xl border border-amber-100/50 mb-8">
                  <Field label="Challan Number" value={lc.challanNo} />
                  <Field
                    label="Transport Date"
                    value={formatDate(lc.dateOfOpening)}
                  />
                  <Field label="Transport Mode" value={lc.transportMode} />
                  <Field label="Carrier" value={lc.carrier} />
                </div>
                <ItemsTable showPrices={false} />
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <Field label="Vehicle No" value={lc.vehicleNo} />
                  <Field label="Driver Name" value={lc.driverName} />
                  <Field label="Contact No" value={lc.contactNo} />
                  <Field label="Sales Term" value={lc.salesTerm} />
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-6">
              <Card className="border-slate-200 rounded-3xl bg-white overflow-hidden">
                <CardContent className="p-6">
                  <SectionHeader
                    icon={Building2}
                    title="Seller & Dispatch"
                    colorClass="bg-slate-50 text-slate-600"
                  />
                  <div className="space-y-6">
                    <Field label="Seller Identity">
                      <p className="text-sm font-bold text-slate-800 leading-tight">
                        {company?.name}
                      </p>
                      <p className="text-[11px] font-bold text-slate-500 mt-1.5 leading-relaxed">
                        {company?.address}
                      </p>
                    </Field>
                    <Separator className="opacity-50" />
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Shipment Weight Profile
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-bold text-emerald-600 uppercase mb-1">
                            Net Weight
                          </p>
                          <p className="text-xl font-bold text-slate-800">
                            {(lc.invoice?.order?.orderItems as any)?.[0]
                              ?.fabricItem?.totalNetWeight || "0.00"}{" "}
                            <span className="text-[10px] text-slate-400">
                              KG
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-amber-600 uppercase mb-1">
                            Gross Weight
                          </p>
                          <p className="text-xl font-bold text-slate-800">
                            {(lc.invoice?.order?.orderItems as any)?.[0]
                              ?.fabricItem?.totalGrossWeight || "0.00"}{" "}
                            <span className="text-[10px] text-slate-400">
                              KG
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={() => onExport("delivery-challan")}
                className="w-full h-14 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest text-xs gap-3 transition-all"
              >
                Download Delivery Challan
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ─── TAB: Beneficiary Certificate ─── */}
        <TabsContent
          value="beneficiary-certificate"
          className="space-y-6 focus-visible:outline-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8 border-slate-200 rounded-3xl bg-white overflow-hidden">
              <CardContent className="p-8">
                <SectionHeader
                  icon={FileText}
                  title="Certification Details"
                  colorClass="bg-emerald-50 text-emerald-600"
                />
                <div className="p-8 bg-emerald-50/20 rounded-2xl border border-emerald-100/50 mb-8 italic text-slate-700 leading-relaxed text-sm">
                  <p className="font-bold text-emerald-800 mb-2 not-italic">
                    Official Declaration:
                  </p>
                  "
                  {lc.remarks ||
                    "We certify that the mentioned products are of Bangladeshi Origin and been delivered in accordance with terms."}
                  "
                </div>
                <ItemsTable />
              </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-6">
              <Card className="border-slate-200 rounded-3xl bg-white overflow-hidden">
                <CardContent className="p-6">
                  <SectionHeader
                    icon={Signature}
                    title="Signatory Entity"
                    colorClass="bg-slate-50 text-slate-600"
                  />
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-bold text-slate-800 mb-1">
                        For {company?.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                        Authorized Signature Line
                      </p>
                      <div className="h-14 w-full border-b-2 border-dashed border-slate-200" />
                    </div>
                    <Separator className="opacity-50" />
                    <Field label="Buyer Name" value={buyer?.name} />
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={() => handleOpenCertDialog("beneficiary")}
                className="w-full h-14 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold uppercase tracking-widest text-xs gap-3 transition-all"
              >
                Download Beneficiary Cert.
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ─── TAB: Certificate of Origin ─── */}
        <TabsContent
          value="certificate-of-origin"
          className="space-y-6 focus-visible:outline-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8 border-slate-200 rounded-3xl bg-white overflow-hidden">
              <CardContent className="p-8">
                <SectionHeader
                  icon={FileCheck}
                  title="Origin Verification"
                  colorClass="bg-orange-50 text-orange-600"
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                  <Field label="Origin Country" value="Bangladesh" />
                  <Field label="Cert. Type" value="LC Document" />
                  <Field label="Issue Date" value={formatDate(lc.issueDate)} />
                  <Field
                    label="Expiry Date"
                    value={formatDate(lc.expiryDate)}
                  />
                </div>
                <ItemsTable />
              </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-6">
              <Card className="border-slate-200 rounded-3xl bg-white overflow-hidden">
                <CardContent className="p-6">
                  <SectionHeader
                    icon={Shield}
                    title="Certification"
                    colorClass="bg-slate-50 text-slate-600"
                  />
                  <p className="text-[11px] text-slate-500 italic mb-6">
                    This document certifies that the listed goods are
                    manufactured and originated in the country mentioned above.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-slate-200 text-slate-600 font-bold text-xs uppercase cursor-default tracking-widest shadow-none"
                  >
                    Standard Verification
                  </Button>
                </CardContent>
              </Card>

              <Button
                onClick={() => handleOpenCertDialog("origin")}
                className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-widest text-xs gap-3 transition-all"
              >
                Download Cert. of Origin
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ─── TAB: Bill of Exchange ─── */}
        <TabsContent
          value="bill-of-exchange"
          className="space-y-6 focus-visible:outline-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-12 border-slate-200 rounded-3xl bg-white overflow-hidden">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-10">
                  <SectionHeader
                    icon={Banknote}
                    title="Exchange Draft"
                    colorClass="bg-violet-50 text-violet-600"
                  />
                  <div className="flex gap-4">
                    <Badge className="bg-slate-100 text-slate-600 border-none font-bold px-4 py-1.5 uppercase tracking-widest">
                      COPY 01
                    </Badge>
                    <Badge className="bg-slate-100 text-slate-600 border-none font-bold px-4 py-1.5 uppercase tracking-widest">
                      COPY 02
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 font-bold text-[10px] tracking-wider mb-2 uppercase">
                      Drawer Details (Client)
                    </Badge>
                    <div className="grid grid-cols-2 gap-6">
                      <Field
                        label="Dispatch Location"
                        value={lc.billOfExchangeLocationClient}
                      />
                      <Field
                        label="Processing Date"
                        value={formatDate(lc.billOfExchangeDateClient)}
                      />
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Internal Remark
                      </p>
                      <p className="text-xs text-slate-600 italic leading-relaxed">
                        {lc.billOfExchangeRemarkClient ||
                          "No specific drawer remarks provided."}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-bold text-[10px] tracking-wider mb-2 uppercase">
                      Drawee Details (Bank)
                    </Badge>
                    <div className="grid grid-cols-2 gap-6">
                      <Field
                        label="Bank Location"
                        value={lc.billOfExchangeLocationBank}
                      />
                      <Field
                        label="Value Date"
                        value={formatDate(lc.billOfExchangeDateBank)}
                      />
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Bank Instruction
                      </p>
                      <p className="text-xs text-slate-600 italic leading-relaxed">
                        {lc.billOfExchangeRemarkBank ||
                          "No specific bank instructions provided."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 bg-slate-50 rounded-3xl p-8 border border-slate-200 relative overflow-hidden">
                  <Banknote
                    size={150}
                    className="absolute -bottom-10 -right-10 text-slate-200 opacity-20 pointer-events-none"
                  />
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                        Draft Amount
                      </p>
                      <p className="text-4xl font-bold tracking-tight uppercase text-slate-800">
                        US${" "}
                        {Number(lc.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs font-bold text-slate-500 mt-2 italic capitalize">
                        {numberToWords(Number(lc.amount))} Only.
                      </p>
                    </div>
                    <Button
                      onClick={() => onExport("bill-of-exchange")}
                      className="h-16 px-10 rounded-2xl bg-violet-600 text-white hover:bg-violet-700 font-bold uppercase tracking-widest text-xs gap-3"
                    >
                      Generate Exchange PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ═══════════ RECORD AUDIT ═══════════ */}
      <div className="flex flex-wrap items-center gap-6 px-8 py-5 rounded-3xl border border-slate-100 bg-white/50 text-[10px] font-bold text-slate-400 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100">
          <span className="font-bold text-slate-600 uppercase tracking-wider">
            Operator:{" "}
            {lc.user ? `${lc.user.firstName} ${lc.user.lastName}` : "SYSTEM"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wider">
            Created: {formatDate(lc.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wider">
            Revision: {formatDate(lc.updatedAt)}
          </span>
        </div>
        {company && (
          <div className="ml-auto flex items-center gap-2">
            <span className="font-bold text-slate-800 uppercase tracking-widest">
              {company.name}
            </span>
          </div>
        )}
      </div>

      {/* Prepare Certificate Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-slate-700">
              Prepare Certificate
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-6 font-sans">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                Document Type
              </Label>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm font-bold text-slate-700">
                  {certType === "beneficiary"
                    ? "Beneficiary Certificate"
                    : "Certificate of Origin"}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 font-bold">
                  BBLC: {lc.bblcNumber}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="certDate"
                className="text-[10px] font-bold uppercase text-slate-400 tracking-widest"
              >
                Certificate Issue Date
              </Label>
              <Input
                id="certDate"
                type="date"
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
                className="h-12 rounded-xl border-slate-200 focus:ring-blue-500/20"
              />
              <p className="text-[10px] text-slate-400 font-bold italic">
                * This date will appear at the header of the printed
                certificate.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 overflow-hidden">
                <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest leading-none">
                  Buyer Name
                </Label>
                <p className="text-xs font-bold text-blue-700 truncate">
                  {buyer?.name || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest leading-none">
                  PI Number
                </Label>
                <p className="text-xs font-bold text-slate-700 truncate">
                  {lc.invoice?.piNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl font-bold text-slate-500"
            >
              Cancel
            </Button>
            <Button
              className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-8 font-bold uppercase tracking-widest text-[10px]"
              onClick={handleCertGenerate}
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
