import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { InvoiceTermsErrors, InvoiceTermsFormData } from "./types"

export type InvoiceTermsFormMode = "create" | "edit"

type Props = {
  open: boolean
  mode: InvoiceTermsFormMode
  data: InvoiceTermsFormData
  errors: InvoiceTermsErrors
  onClose: () => void
  onChange: (field: keyof InvoiceTermsFormData, value: string) => void
  onSubmit: () => void
}

export function InvoiceTermsForm({ open, mode, data, errors, onClose, onChange, onSubmit }: Props) {
  const isCreate = mode === "create"
  const title = isCreate ? "Create Invoice Terms" : "Edit Invoice Terms"
  const description = isCreate
    ? "Define a reusable template for payment, delivery, and banking details."
    : "Update this template to keep invoice terms consistent across buyers."

  const fieldClass = (key: keyof InvoiceTermsFormData) =>
    errors[key] ? "border-destructive focus-visible:ring-destructive/40" : ""

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Standard LC 90 Days"
              className={fieldClass("name")}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment">Payment Terms</Label>
            <Input
              id="payment"
              value={data.payment}
              onChange={(e) => onChange("payment", e.target.value)}
              placeholder="TT 30 Days"
              className={fieldClass("payment")}
            />
            {errors.payment && <p className="text-xs text-destructive">{errors.payment}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="delivery">Delivery Terms</Label>
            <Input
              id="delivery"
              value={data.delivery}
              onChange={(e) => onChange("delivery", e.target.value)}
              placeholder="FOB Chittagong"
              className={fieldClass("delivery")}
            />
            {errors.delivery && <p className="text-xs text-destructive">{errors.delivery}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="advisingBank">Advising Bank</Label>
            <Input
              id="advisingBank"
              value={data.advisingBank}
              onChange={(e) => onChange("advisingBank", e.target.value)}
              placeholder="HSBC Bangladesh"
              className={fieldClass("advisingBank")}
            />
            {errors.advisingBank && <p className="text-xs text-destructive">{errors.advisingBank}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="negotiation">Negotiation</Label>
            <Input
              id="negotiation"
              value={data.negotiation}
              onChange={(e) => onChange("negotiation", e.target.value)}
              placeholder="By sight"
              className={fieldClass("negotiation")}
            />
            {errors.negotiation && <p className="text-xs text-destructive">{errors.negotiation}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              value={data.origin}
              onChange={(e) => onChange("origin", e.target.value)}
              placeholder="Bangladesh"
              className={fieldClass("origin")}
            />
            {errors.origin && <p className="text-xs text-destructive">{errors.origin}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="swiftCode">SWIFT Code</Label>
            <Input
              id="swiftCode"
              value={data.swiftCode}
              onChange={(e) => onChange("swiftCode", e.target.value)}
              placeholder="HSBCBDDH"
              className={fieldClass("swiftCode")}
            />
            {errors.swiftCode && <p className="text-xs text-destructive">{errors.swiftCode}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="binNo">BIN</Label>
            <Input
              id="binNo"
              value={data.binNo}
              onChange={(e) => onChange("binNo", e.target.value)}
              placeholder="123456789"
              className={fieldClass("binNo")}
            />
            {errors.binNo && <p className="text-xs text-destructive">{errors.binNo}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="hsCode">H.S. Code</Label>
            <Input
              id="hsCode"
              value={data.hsCode}
              onChange={(e) => onChange("hsCode", e.target.value)}
              placeholder="610910"
              className={fieldClass("hsCode")}
            />
            {errors.hsCode && <p className="text-xs text-destructive">{errors.hsCode}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            value={data.remarks}
            onChange={(e) => onChange("remarks", e.target.value)}
            placeholder="Handle with care"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>{isCreate ? "Create" : "Save Changes"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
