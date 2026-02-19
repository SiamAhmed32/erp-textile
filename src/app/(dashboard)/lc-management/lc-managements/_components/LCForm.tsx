"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LCFormData } from "./validation";
import { Invoice } from "@/app/(dashboard)/invoice-management/invoices/_components/types";
import {
  Building2,
  FileText,
  Truck,
  Globe,
  Banknote,
  Info,
  CalendarDays,
  User,
  MapPin,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";

type Props = {
  data: LCFormData;
  invoices: Invoice[];
  onChange: (field: keyof LCFormData, value: any) => void;
  errors: Partial<Record<keyof LCFormData, string>>;
  isEdit?: boolean;
  onSave?: () => void;
  saving?: boolean;
};

const TAB_ORDER = ["general", "export", "boe", "delivery", "remarks"] as const;
type TabKey = (typeof TAB_ORDER)[number];

const InputGroup = ({
  id,
  label,
  placeholder,
  type = "text",
  value,
  error,
  onChange,
  icon: Icon,
  required = true,
}: any) => (
  <div className="space-y-1.5">
    <Label
      htmlFor={id}
      className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2"
    >
      {Icon && <Icon className="size-3.5 text-primary/60" />}
      {label} {required && <span className="text-destructive">*</span>}
    </Label>
    <div className="relative group">
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(id, e.target.value)}
        className={`h-11 transition-all duration-200 border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 ${
          error
            ? "border-destructive ring-destructive/20"
            : "hover:border-primary/40"
        }`}
      />
    </div>
    {error && (
      <p className="text-[10px] font-bold text-destructive animate-in fade-in slide-in-from-top-1">
        {error}
      </p>
    )}
  </div>
);

const SectionHeader = ({ title, description, icon: Icon }: any) => (
  <div className="mb-6 flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
    <div className="p-2.5 rounded-lg bg-white shadow-sm ring-1 ring-primary/10">
      <Icon className="size-5 text-primary" />
    </div>
    <div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  </div>
);

const LCForm = ({
  data,
  invoices,
  onChange,
  errors,
  isEdit,
  onSave,
  saving,
}: Props) => {
  const [activeTab, setActiveTab] = useState<TabKey>("general");

  const currentIndex = TAB_ORDER.indexOf(activeTab);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === TAB_ORDER.length - 1;

  const goNext = () => {
    if (!isLast) setActiveTab(TAB_ORDER[currentIndex + 1]);
  };

  const goBack = () => {
    if (!isFirst) setActiveTab(TAB_ORDER[currentIndex - 1]);
  };

  const TabNav = () => (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
      <Button
        type="button"
        variant="outline"
        onClick={goBack}
        disabled={isFirst}
        className="gap-2"
      >
        <ChevronLeft className="size-4" />
        Back
      </Button>

      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
        Step {currentIndex + 1} of {TAB_ORDER.length}
      </p>

      {isLast ? (
        <Button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="gap-2 bg-black text-white hover:bg-black/90 shadow-lg px-6"
        >
          <Save className="size-4" />
          {saving ? "Saving..." : isEdit ? "Update BBLC" : "Save BBLC"}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={goNext}
          className="gap-2 bg-primary text-white hover:bg-primary/90"
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Tabs
        value={activeTab}
        onValueChange={(v: string) => setActiveTab(v as TabKey)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5 h-16 p-1 bg-slate-100/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-x-auto whitespace-nowrap">
          <TabsTrigger
            value="general"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md gap-2"
          >
            <Info className="size-4" />
            <span className="hidden sm:inline">General & PI</span>
          </TabsTrigger>
          <TabsTrigger
            value="export"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md gap-2"
          >
            <Globe className="size-4" />
            <span className="hidden sm:inline">Export Details</span>
          </TabsTrigger>
          <TabsTrigger
            value="boe"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md gap-2"
          >
            <Banknote className="size-4" />
            <span className="hidden sm:inline">Bill of Exchange</span>
          </TabsTrigger>
          <TabsTrigger
            value="delivery"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md gap-2"
          >
            <Truck className="size-4" />
            <span className="hidden sm:inline">Challan Info</span>
          </TabsTrigger>
          <TabsTrigger
            value="remarks"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md gap-2"
          >
            <ClipboardList className="size-4" />
            <span className="hidden sm:inline">Certificates</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. General Info Tab */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl">
            <CardContent className="pt-8 space-y-8">
              <SectionHeader
                icon={Building2}
                title="Source PI & Banking Information"
                description="Connect this LC to a Proforma Invoice and define the issuing bank details."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <FileText className="size-3.5 text-primary/60" />
                    Source Invoice (PI){" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={data.invoiceId}
                    onValueChange={(val) => onChange("invoiceId", val)}
                    disabled={isEdit}
                  >
                    <SelectTrigger
                      className={`h-11 transition-all border-slate-200 bg-white group hover:border-primary/40 ${errors.invoiceId ? "border-destructive" : ""}`}
                    >
                      <SelectValue placeholder="Select Proforma Invoice" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-2xl">
                      {invoices.map((inv) => (
                        <SelectItem
                          key={inv.id}
                          value={inv.id}
                          className="rounded-md my-1 focus:bg-primary/5"
                        >
                          {inv.order?.orderNumber || inv.piNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.invoiceId && (
                    <p className="text-[10px] font-bold text-destructive animate-in slide-in-from-top-1">
                      {errors.invoiceId}
                    </p>
                  )}
                </div>

                <InputGroup
                  id="bblcNumber"
                  label="BBLC Number"
                  placeholder="e.g. 988240400814"
                  value={data.bblcNumber}
                  error={errors.bblcNumber}
                  onChange={onChange}
                  icon={ClipboardList}
                />

                <InputGroup
                  id="dateOfOpening"
                  label="Date of Opening"
                  type="date"
                  value={
                    data.dateOfOpening ? data.dateOfOpening.split("T")[0] : ""
                  }
                  error={errors.dateOfOpening}
                  onChange={onChange}
                  icon={CalendarDays}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <InputGroup
                  id="lcIssueBankName"
                  label="LC Issuing Bank"
                  placeholder="Full name of the bank"
                  value={data.lcIssueBankName}
                  error={errors.lcIssueBankName}
                  onChange={onChange}
                  icon={Building2}
                />
                <InputGroup
                  id="lcIssueBankBranch"
                  label="Bank Branch"
                  placeholder="e.g. PAGATI SARANI BRANCH"
                  value={data.lcIssueBankBranch}
                  error={errors.lcIssueBankBranch}
                  onChange={onChange}
                  icon={MapPin}
                />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <InputGroup
                  id="notifyParty"
                  label="Notify Party"
                  placeholder="Enter details of the notify party"
                  value={data.notifyParty}
                  error={errors.notifyParty}
                  onChange={onChange}
                  icon={User}
                />
              </div>

              <TabNav />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Export & Logistics Tab */}
        <TabsContent value="export" className="mt-6 space-y-6 text-slate-500">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <CardContent className="pt-8 space-y-8">
              <SectionHeader
                icon={Globe}
                title="Export & Contractual Details"
                description="Define export contract numbers, values, HS codes, and essential validity dates."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InputGroup
                  id="exportLcNo"
                  label="Export LC No"
                  placeholder="SSL-004-PIAZZA"
                  value={data.exportLcNo}
                  error={errors.exportLcNo}
                  onChange={onChange}
                />
                <InputGroup
                  id="exportLcDate"
                  label="Export LC Date"
                  type="date"
                  value={
                    data.exportLcDate ? data.exportLcDate.split("T")[0] : ""
                  }
                  error={errors.exportLcDate}
                  onChange={onChange}
                />
                <InputGroup
                  id="issueDate"
                  label="LC Issue Date"
                  type="date"
                  value={data.issueDate ? data.issueDate.split("T")[0] : ""}
                  error={errors.issueDate}
                  onChange={onChange}
                />
                <InputGroup
                  id="expiryDate"
                  label="LC Expiry Date"
                  type="date"
                  value={data.expiryDate ? data.expiryDate.split("T")[0] : ""}
                  error={errors.expiryDate}
                  onChange={onChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                <InputGroup
                  id="binNo"
                  label="BIN Number"
                  placeholder="001056745-0103"
                  value={data.binNo}
                  error={errors.binNo}
                  onChange={onChange}
                />
                <InputGroup
                  id="hsCodeNo"
                  label="HS Code"
                  placeholder="52093100"
                  value={data.hsCodeNo}
                  error={errors.hsCodeNo}
                  onChange={onChange}
                />
                <InputGroup
                  id="amount"
                  label="Total LC Amount ($)"
                  type="number"
                  value={data.amount}
                  error={errors.amount}
                  onChange={onChange}
                  icon={Banknote}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputGroup
                  id="carrier"
                  label="Carrier"
                  placeholder="e.g. By Truck"
                  value={data.carrier}
                  error={errors.carrier}
                  onChange={onChange}
                />
                <InputGroup
                  id="salesTerm"
                  label="Sales Terms"
                  placeholder="e.g. CFR / FOB"
                  value={data.salesTerm}
                  error={errors.salesTerm}
                  onChange={onChange}
                />
                <InputGroup
                  id="destination"
                  label="Destination Port/Factory"
                  placeholder="e.g. Customers Factory"
                  value={data.destination}
                  error={errors.destination}
                  onChange={onChange}
                  icon={MapPin}
                />
              </div>

              <TabNav />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Bill of Exchange Tab */}
        <TabsContent value="boe" className="mt-6 space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <CardContent className="pt-8 space-y-8">
              <SectionHeader
                icon={Banknote}
                title="Bill of Exchange (DRAFT) Configuration"
                description="Set the locations, dates, and mandatory remarks for both Client and Bank drafts."
              />

              <div className="space-y-8">
                {/* Client Section */}
                <div className="p-6 rounded-2xl bg-amber-50/30 border border-amber-100/50 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="size-4 text-amber-600" />
                    <h4 className="font-bold text-amber-900 uppercase tracking-widest text-[10px]">
                      Client (Drawer) Details
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup
                      id="billOfExchangeLocationClient"
                      label="Client Location"
                      placeholder="e.g. Dhaka, Bangladesh"
                      required={false}
                      value={data.billOfExchangeLocationClient}
                      onChange={onChange}
                    />
                    <InputGroup
                      id="billOfExchangeDateClient"
                      label="Draft Date (Client)"
                      type="date"
                      required={false}
                      value={
                        data.billOfExchangeDateClient
                          ? data.billOfExchangeDateClient.split("T")[0]
                          : ""
                      }
                      onChange={onChange}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Client Remark / Special Clause
                    </Label>
                    <textarea
                      className="w-full min-h-[80px] rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 hover:border-primary/40 transition-all outline-none"
                      value={data.billOfExchangeRemarkClient || ""}
                      placeholder="Enter specific clauses for the client draft..."
                      onChange={(e) =>
                        onChange("billOfExchangeRemarkClient", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Bank Section */}
                <div className="p-6 rounded-2xl bg-blue-50/30 border border-blue-100/50 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="size-4 text-blue-600" />
                    <h4 className="font-bold text-blue-900 uppercase tracking-widest text-[10px]">
                      Bank (Drawee) Details
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup
                      id="billOfExchangeLocationBank"
                      label="Bank Location"
                      placeholder="e.g. Branch City"
                      required={false}
                      value={data.billOfExchangeLocationBank}
                      onChange={onChange}
                    />
                    <InputGroup
                      id="billOfExchangeDateBank"
                      label="Draft Date (Bank)"
                      type="date"
                      required={false}
                      value={
                        data.billOfExchangeDateBank
                          ? data.billOfExchangeDateBank.split("T")[0]
                          : ""
                      }
                      onChange={onChange}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Bank Remark / Acceptance Clause
                    </Label>
                    <textarea
                      className="w-full min-h-[80px] rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 hover:border-primary/40 transition-all outline-none"
                      value={data.billOfExchangeRemarkBank || ""}
                      placeholder="Enter bank acceptance or negotiation clauses..."
                      onChange={(e) =>
                        onChange("billOfExchangeRemarkBank", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <TabNav />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Delivery Challan Tab */}
        <TabsContent value="delivery" className="mt-6 space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <CardContent className="pt-8 space-y-8">
              <SectionHeader
                icon={Truck}
                title="Delivery Challan & Dispatch Logistics"
                description="Manage the vehicle, driver, and challan details for the physical shipment."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputGroup
                  id="challanNo"
                  label="Challan Number"
                  placeholder="MT-02/24SP/DC"
                  value={data.challanNo}
                  error={errors.challanNo}
                  onChange={onChange}
                />
                <InputGroup
                  id="transportMode"
                  label="Mode of Transport"
                  placeholder="e.g. By Road"
                  value={data.transportMode}
                  error={errors.transportMode}
                  onChange={onChange}
                />
                <InputGroup
                  id="vehicleNo"
                  label="Vehicle / Truck No"
                  placeholder="e.g. DHAKA-METRO-KA-11-2222"
                  value={data.vehicleNo}
                  error={errors.vehicleNo}
                  onChange={onChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-2xl bg-slate-50 border border-slate-100 mt-4">
                <InputGroup
                  id="driverName"
                  label="Driver Name"
                  placeholder="Name of primary contact"
                  value={data.driverName}
                  error={errors.driverName}
                  onChange={onChange}
                  icon={User}
                />
                <InputGroup
                  id="contactNo"
                  label="Driver/Logistics Phone"
                  placeholder="Active contact number"
                  value={data.contactNo}
                  error={errors.contactNo}
                  onChange={onChange}
                />
              </div>

              <TabNav />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Certificates Tab */}
        <TabsContent value="remarks" className="mt-6 space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <CardContent className="pt-8 space-y-8">
              <SectionHeader
                icon={ClipboardList}
                title="General Remarks & Certifications"
                description="Consolidated text area for additional terms, beneficiary statements, or origin declarations."
              />

              <div className="space-y-4">
                <Label
                  htmlFor="remarks"
                  className="text-sm font-bold uppercase tracking-widest text-slate-400"
                >
                  Master Remark Field
                </Label>
                <textarea
                  id="remarks"
                  className={`w-full min-h-[250px] p-6 rounded-3xl border border-slate-200 bg-slate-50/50 text-sm ring-offset-background placeholder:text-muted-foreground focus:bg-white focus:ring-2 focus:ring-primary/20 hover:border-primary/40 transition-all outline-none leading-relaxed ${
                    errors.remarks
                      ? "border-destructive ring-destructive/20"
                      : ""
                  }`}
                  placeholder="Enter the full certification text or terms that should appear on generated documents..."
                  value={data.remarks}
                  onChange={(e) => onChange("remarks", e.target.value)}
                />
                {errors.remarks && (
                  <p className="text-xs font-bold text-destructive">
                    {errors.remarks}
                  </p>
                )}

                <div className="flex gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <Info className="size-5 text-amber-600 mt-1" />
                  <p className="text-xs text-amber-800 leading-relaxed uppercase font-medium tracking-tight">
                    Note: The text entered above will be used to populate the
                    certification sections in both the Beneficiary Statement and
                    Certificate of Origin documents.
                  </p>
                </div>
              </div>

              <TabNav />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LCForm;
