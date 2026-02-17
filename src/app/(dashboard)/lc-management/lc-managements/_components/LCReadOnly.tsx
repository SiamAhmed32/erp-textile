"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LCManagement } from "./types";
import {
  Building2,
  Calendar,
  FileText,
  MapPin,
  User as UserIcon,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  lc: LCManagement;
};

const LCReadOnly = ({ lc }: Props) => {
  const router = useRouter();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const InfoRow = ({ icon: Icon, label, value, className = "" }: any) => (
    <div
      className={`flex items-start gap-3 py-3 border-b border-slate-100 last:border-0 ${className}`}
    >
      <div className="mt-0.5 p-1.5 bg-slate-50 rounded-md text-slate-500">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-900 mt-0.5 leading-relaxed">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left Column: Primary LC Info */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-none shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  BBLC - {lc.bblcNumber}
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1 italic">
                  Back-to-Back Letter of Credit Details
                </p>
              </div>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 px-3 py-1"
              >
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 border-r border-slate-100 space-y-1">
                <InfoRow
                  icon={Calendar}
                  label="Date of Opening"
                  value={formatDate(lc.dateOfOpening)}
                />
                <InfoRow
                  icon={Calendar}
                  label="Issue Date"
                  value={formatDate(lc.issueDate)}
                />
                <InfoRow
                  icon={Calendar}
                  label="Expiry Date"
                  value={formatDate(lc.expiryDate)}
                />
              </div>
              <div className="p-6 space-y-1">
                <InfoRow
                  icon={Wallet}
                  label="LC Amount"
                  value={`US$ ${Number(lc.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                />
                <InfoRow
                  icon={UserIcon}
                  label="Notify Party"
                  value={lc.notifyParty}
                />
                <InfoRow
                  icon={MapPin}
                  label="Destination Port"
                  value={lc.destination}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Banking Information */}
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Building2 className="text-slate-400" size={20} />
              Issuing Bank Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Bank Name
                </p>
                <p className="text-base font-bold text-slate-900">
                  {lc.lcIssueBankName}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Branch Details
                </p>
                <p className="text-base font-bold text-slate-900">
                  {lc.lcIssueBankBranch}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Linked Documents Summary */}
      <div className="space-y-6">
        <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="text-slate-400" size={20} />
              Source Invoice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="pb-4 border-b border-white/10">
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                PI Number
              </p>
              <p className="text-xl font-bold mt-1">
                {lc.invoice?.piNumber || "N/A"}
              </p>
            </div>
            {lc.invoice?.order && (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Order No:</span>
                  <span className="font-semibold">
                    {lc.invoice.order.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Buyer:</span>
                  <span className="font-semibold">
                    {lc.invoice.order.buyer?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Product Type:</span>
                  <span className="font-semibold text-xs bg-white/10 px-2 py-0.5 rounded-full">
                    {lc.invoice.order.productType}
                  </span>
                </div>
              </>
            )}
            <div className="pt-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                variant="secondary"
                onClick={() =>
                  router.push(`/invoice-management/invoices/${lc.invoiceId}`)
                }
              >
                View Full Invoice
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <UserIcon size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">
                  Created By
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {lc.user
                    ? `${lc.user.firstName} ${lc.user.lastName}`
                    : "System User"}
                </p>
                <p className="text-xs text-slate-500">{lc.user?.email || ""}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LCReadOnly;
