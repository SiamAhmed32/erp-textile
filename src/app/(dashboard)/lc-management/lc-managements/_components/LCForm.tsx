"use client";

import React from "react";
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
import { LCFormData } from "./validation";
import { Invoice } from "@/app/(dashboard)/invoice-management/invoices/_components/types";

type Props = {
  data: LCFormData;
  invoices: Invoice[];
  onChange: (field: keyof LCFormData, value: any) => void;
  errors: Partial<Record<keyof LCFormData, string>>;
  isEdit?: boolean;
};

const InputGroup = ({
  id,
  label,
  placeholder,
  type = "text",
  value,
  error,
  onChange,
}: any) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-semibold">
      {label} <span className="text-destructive">*</span>
    </Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(e) => onChange(id, e.target.value)}
      className={
        error ? "border-destructive focus-visible:ring-destructive" : ""
      }
    />
    {error && (
      <p className="text-[10px] font-medium text-destructive">{error}</p>
    )}
  </div>
);

const LCForm = ({ data, invoices, onChange, errors, isEdit }: Props) => {
  return (
    <div className="grid gap-8">
      {/* 1. Core Relationship & Main Numbers */}
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="invoiceId" className="text-sm font-semibold">
                Source Invoice (PI) <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.invoiceId}
                onValueChange={(val) => onChange("invoiceId", val)}
                disabled={isEdit}
              >
                <SelectTrigger
                  className={errors.invoiceId ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select PI" />
                </SelectTrigger>
                <SelectContent>
                  {invoices.map((inv) => (
                    <SelectItem key={inv.id} value={inv.id}>
                      {inv.piNumber} - {inv.order?.orderNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.invoiceId && (
                <p className="text-[10px] font-medium text-destructive">
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
            />

            <InputGroup
              id="dateOfOpening"
              label="Date of Opening"
              type="date"
              value={data.dateOfOpening ? data.dateOfOpening.split("T")[0] : ""}
              error={errors.dateOfOpening}
              onChange={onChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Export LC & Bank Details */}
      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InputGroup
              id="exportLcNo"
              label="Export LC No"
              placeholder="e.g. SSL-004-PIAZZA"
              value={data.exportLcNo}
              error={errors.exportLcNo}
              onChange={onChange}
            />
            <InputGroup
              id="exportLcDate"
              label="Export LC Date"
              type="date"
              value={data.exportLcDate ? data.exportLcDate.split("T")[0] : ""}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <InputGroup
              id="lcIssueBankName"
              label="LC Issuing Bank"
              placeholder="e.g. NATIONAL BANK LIMITED"
              value={data.lcIssueBankName}
              error={errors.lcIssueBankName}
              onChange={onChange}
            />
            <InputGroup
              id="lcIssueBankBranch"
              label="Bank Branch"
              placeholder="e.g. PAGATI, SARANI BRANCH"
              value={data.lcIssueBankBranch}
              error={errors.lcIssueBankBranch}
              onChange={onChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Document Info & Logistics */}
      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <InputGroup
              id="binNo"
              label="BIN No"
              placeholder="e.g. 001056745-0103"
              value={data.binNo}
              error={errors.binNo}
              onChange={onChange}
            />
            <InputGroup
              id="hsCodeNo"
              label="HS Code No"
              placeholder="e.g. 52093100"
              value={data.hsCodeNo}
              error={errors.hsCodeNo}
              onChange={onChange}
            />
            <InputGroup
              id="amount"
              label="LC Amount (US$)"
              type="number"
              value={data.amount}
              error={errors.amount}
              onChange={onChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <InputGroup
              id="carrier"
              label="Carrier"
              value={data.carrier}
              error={errors.carrier}
              onChange={onChange}
            />
            <InputGroup
              id="salesTerm"
              label="Sales Term"
              value={data.salesTerm}
              error={errors.salesTerm}
              onChange={onChange}
            />
            <InputGroup
              id="destination"
              label="Destination"
              placeholder="e.g. Customers Factory"
              value={data.destination}
              error={errors.destination}
              onChange={onChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="remarks" className="text-sm font-semibold">
                Remarks / Certification Text{" "}
                <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="remarks"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={data.remarks}
                onChange={(e) => onChange("remarks", e.target.value)}
              />
              {errors.remarks && (
                <p className="text-[10px] font-medium text-destructive">
                  {errors.remarks}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Transport & Driver Info */}
      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardContent className="pt-6">
          <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-slate-500">
            Transport & Delivery Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InputGroup
              id="transportMode"
              label="Transport Mode"
              value={data.transportMode}
              error={errors.transportMode}
              onChange={onChange}
            />
            <InputGroup
              id="challanNo"
              label="Challan No"
              value={data.challanNo}
              error={errors.challanNo}
              onChange={onChange}
            />
            <InputGroup
              id="vehicleNo"
              label="Vehicle No"
              value={data.vehicleNo}
              error={errors.vehicleNo}
              onChange={onChange}
            />
            <InputGroup
              id="contactNo"
              label="Contact No"
              value={data.contactNo}
              error={errors.contactNo}
              onChange={onChange}
            />
            <InputGroup
              id="driverName"
              label="Driver Name"
              value={data.driverName}
              error={errors.driverName}
              onChange={onChange}
            />
            <InputGroup
              id="notifyParty"
              label="Notify Party"
              value={data.notifyParty}
              error={errors.notifyParty}
              onChange={onChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default LCForm;
