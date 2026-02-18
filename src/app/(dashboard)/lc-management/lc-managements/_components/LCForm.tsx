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

const LCForm = ({ data, invoices, onChange, errors, isEdit }: Props) => {
  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BBLC Number */}
            <div className="space-y-2">
              <Label htmlFor="bblcNumber">BBLC Number</Label>
              <Input
                id="bblcNumber"
                placeholder="e.g. BBLC-2026-001"
                value={data.bblcNumber}
                onChange={(e) => onChange("bblcNumber", e.target.value)}
                className={errors.bblcNumber ? "border-destructive" : ""}
              />
              {errors.bblcNumber && (
                <p className="text-xs text-destructive">{errors.bblcNumber}</p>
              )}
            </div>

            {/* Invoice Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="invoiceId">Source Invoice</Label>
              <Select
                value={data.invoiceId}
                onValueChange={(val) => onChange("invoiceId", val)}
                disabled={isEdit}
              >
                <SelectTrigger
                  className={errors.invoiceId ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select an Invoice" />
                </SelectTrigger>
                <SelectContent>
                  {invoices.map((inv) => (
                    <SelectItem key={inv.id} value={inv.id}>
                      {inv.piNumber} - {inv.order?.orderNumber} (
                      {inv.user?.displayName || "System"})
                    </SelectItem>
                  ))}
                  {invoices.length === 0 && (
                    <SelectItem value="none" disabled>
                      No eligible invoices found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.invoiceId && (
                <p className="text-xs text-destructive">{errors.invoiceId}</p>
              )}
              {isEdit && (
                <p className="text-xs text-muted-foreground italic">
                  Invoice cannot be changed after creation.
                </p>
              )}
            </div>

            {/* Date of Opening */}
            <div className="space-y-2">
              <Label htmlFor="dateOfOpening">Date of Opening</Label>
              <Input
                id="dateOfOpening"
                type="date"
                value={
                  data.dateOfOpening ? data.dateOfOpening.split("T")[0] : ""
                }
                onChange={(e) => onChange("dateOfOpening", e.target.value)}
                className={errors.dateOfOpening ? "border-destructive" : ""}
              />
              {errors.dateOfOpening && (
                <p className="text-xs text-destructive">
                  {errors.dateOfOpening}
                </p>
              )}
            </div>

            {/* Issue Date */}
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={data.issueDate ? data.issueDate.split("T")[0] : ""}
                onChange={(e) => onChange("issueDate", e.target.value)}
                className={errors.issueDate ? "border-destructive" : ""}
              />
              {errors.issueDate && (
                <p className="text-xs text-destructive">{errors.issueDate}</p>
              )}
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={data.expiryDate ? data.expiryDate.split("T")[0] : ""}
                onChange={(e) => onChange("expiryDate", e.target.value)}
                className={errors.expiryDate ? "border-destructive" : ""}
              />
              {errors.expiryDate && (
                <p className="text-xs text-destructive">{errors.expiryDate}</p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">LC Amount (US$)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={data.amount}
                onChange={(e) => onChange("amount", e.target.value)}
                className={errors.amount ? "border-destructive" : ""}
              />
              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="lcIssueBankName">LC Issuing Bank</Label>
              <Input
                id="lcIssueBankName"
                placeholder="e.g. Standard Chartered Bank"
                value={data.lcIssueBankName}
                onChange={(e) => onChange("lcIssueBankName", e.target.value)}
                className={errors.lcIssueBankName ? "border-destructive" : ""}
              />
              {errors.lcIssueBankName && (
                <p className="text-xs text-destructive">
                  {errors.lcIssueBankName}
                </p>
              )}
            </div>

            {/* Bank Branch */}
            <div className="space-y-2">
              <Label htmlFor="lcIssueBankBranch">Bank Branch</Label>
              <Input
                id="lcIssueBankBranch"
                placeholder="e.g. Dhaka Main Branch"
                value={data.lcIssueBankBranch}
                onChange={(e) => onChange("lcIssueBankBranch", e.target.value)}
                className={errors.lcIssueBankBranch ? "border-destructive" : ""}
              />
              {errors.lcIssueBankBranch && (
                <p className="text-xs text-destructive">
                  {errors.lcIssueBankBranch}
                </p>
              )}
            </div>

            {/* Notify Party */}
            <div className="space-y-2">
              <Label htmlFor="notifyParty">Notify Party</Label>
              <Input
                id="notifyParty"
                placeholder="e.g. ABC Garments Ltd."
                value={data.notifyParty || ""}
                onChange={(e) => onChange("notifyParty", e.target.value)}
                className={errors.notifyParty ? "border-destructive" : ""}
              />
              {errors.notifyParty && (
                <p className="text-xs text-destructive">{errors.notifyParty}</p>
              )}
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <Label htmlFor="destination">Destination Port</Label>
              <Input
                id="destination"
                placeholder="e.g. Chittagong Port"
                value={data.destination || ""}
                onChange={(e) => onChange("destination", e.target.value)}
                className={errors.destination ? "border-destructive" : ""}
              />
              {errors.destination && (
                <p className="text-xs text-destructive">{errors.destination}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LCForm;
