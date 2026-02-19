"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LCManagement } from "./types";
import {
  Building2,
  Calendar,
  MapPin,
  Wallet,
  Truck,
  Scale,
  Hash,
  Globe,
  Banknote,
  CreditCard,
  User as UserIcon,
  CalendarDays,
  FileText,
  Shield,
} from "lucide-react";

type Props = {
  lc: LCManagement;
};

const LCReadOnly = ({ lc }: Props) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const order = lc.invoice?.order;
  const buyer = order?.buyer;
  const company = order?.companyProfile;

  const Field = ({
    label,
    value,
    className = "",
  }: {
    label: string;
    value?: string | number | null;
    className?: string;
  }) => (
    <div className={`space-y-1.5 ${className}`}>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-800">{value || "—"}</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* ═══════════ HEADER STRIP ═══════════ */}
      <div className="flex flex-wrap items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <CreditCard className="size-6" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
              BBLC Number
            </p>
            <h2 className="text-xl font-black tracking-tight">
              {lc.bblcNumber}
            </h2>
          </div>
        </div>

        <Separator
          orientation="vertical"
          className="h-10 bg-white/10 hidden sm:block"
        />

        <div className="flex gap-6 flex-wrap">
          <div>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
              Amount
            </p>
            <p className="text-lg font-black text-emerald-400">
              US${" "}
              {Number(lc.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
              Opening Date
            </p>
            <p className="text-sm font-bold">{formatDate(lc.dateOfOpening)}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
              Validity
            </p>
            <p className="text-sm font-bold">
              {formatDate(lc.issueDate)} → {formatDate(lc.expiryDate)}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
              Buyer
            </p>
            <p className="text-sm font-bold">{buyer?.name || "—"}</p>
          </div>
        </div>
      </div>

      {/* ═══════════ MAIN CONTENT GRID ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── LC Overview Card ─── */}
        <Card className="border-none shadow-lg shadow-slate-200/40 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-6 pt-6 pb-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Building2 size={18} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">
              LC Overview
            </h3>
          </div>
          <CardContent className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <Field label="Bank Name" value={lc.lcIssueBankName} />
              <Field label="Bank Branch" value={lc.lcIssueBankBranch} />
              <Field label="Notify Party" value={lc.notifyParty} />
              <Field label="Destination" value={lc.destination} />
              <Field label="Export LC No" value={lc.exportLcNo} />
              <Field
                label="Export LC Date"
                value={formatDate(lc.exportLcDate)}
              />
              <Field label="BIN No" value={lc.binNo} />
              <Field label="HS Code" value={lc.hsCodeNo} />
              <Field label="Issue Date" value={formatDate(lc.issueDate)} />
              <Field label="Expiry Date" value={formatDate(lc.expiryDate)} />
            </div>
          </CardContent>
        </Card>

        {/* ─── Logistics & Challan Card ─── */}
        <Card className="border-none shadow-lg shadow-slate-200/40 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-6 pt-6 pb-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Truck size={18} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">
              Logistics & Delivery Challan
            </h3>
          </div>
          <CardContent className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <Field label="Challan No" value={lc.challanNo} />
              <Field label="Carrier" value={lc.carrier} />
              <Field label="Transport Mode" value={lc.transportMode} />
              <Field label="Sales Term" value={lc.salesTerm} />
              <Field label="Vehicle No" value={lc.vehicleNo} />
              <Field label="Driver Name" value={lc.driverName} />
              <Field label="Contact No" value={lc.contactNo} />
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Weight
                </p>
                <div className="flex gap-3 text-sm font-semibold text-slate-800">
                  <Badge variant="secondary" className="bg-slate-100 font-bold">
                    Net:{" "}
                    {(order?.orderItems as any)?.[0]?.fabricItem
                      ?.totalNetWeight || 0}{" "}
                    Kg
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-100 font-bold">
                    Gross:{" "}
                    {(order?.orderItems as any)?.[0]?.fabricItem
                      ?.totalGrossWeight || 0}{" "}
                    Kg
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Bill of Exchange Card ─── */}
        <Card className="border-none shadow-lg shadow-slate-200/40 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-6 pt-6 pb-3">
            <div className="p-2 rounded-lg bg-violet-50 text-violet-600">
              <Banknote size={18} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">
              Bill of Exchange
            </h3>
          </div>
          <CardContent className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Client Side */}
              <div className="space-y-4">
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-bold text-[10px] tracking-wider">
                  DRAWER (CLIENT)
                </Badge>
                <Field
                  label="Location"
                  value={lc.billOfExchangeLocationClient}
                />
                <Field
                  label="Date"
                  value={formatDate(lc.billOfExchangeDateClient)}
                />
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Remarks
                  </p>
                  <p className="text-sm text-slate-600 italic leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100">
                    {lc.billOfExchangeRemarkClient || "—"}
                  </p>
                </div>
              </div>

              {/* Bank Side */}
              <div className="space-y-4">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-[10px] tracking-wider">
                  DRAWEE (BANK)
                </Badge>
                <Field label="Location" value={lc.billOfExchangeLocationBank} />
                <Field
                  label="Date"
                  value={formatDate(lc.billOfExchangeDateBank)}
                />
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Remarks
                  </p>
                  <p className="text-sm text-slate-600 italic leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100">
                    {lc.billOfExchangeRemarkBank || "—"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Remarks / Certification Card ─── */}
        <Card className="border-none shadow-lg shadow-slate-200/40 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-6 pt-6 pb-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Shield size={18} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">
              Remarks & Certification
            </h3>
          </div>
          <CardContent className="px-6 pb-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap italic">
              {lc.remarks || "No certification text provided."}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══════════ RECORD INFO ═══════════ */}
      <div className="flex flex-wrap items-center gap-6 px-6 py-4 rounded-xl border border-slate-100 bg-slate-50/50 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <UserIcon size={14} />
          <span className="font-semibold text-slate-600">
            {lc.user ? `${lc.user.firstName} ${lc.user.lastName}` : "System"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays size={14} />
          <span>Created {formatDate(lc.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays size={14} />
          <span>Updated {formatDate(lc.updatedAt)}</span>
        </div>
        {company && (
          <div className="flex items-center gap-2">
            <Globe size={14} />
            <span className="font-semibold text-slate-600">{company.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LCReadOnly;
