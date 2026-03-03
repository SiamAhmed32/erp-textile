import React from "react";
import { CustomModal, InputField } from "@/components/reusables";
import { InvoiceTermsErrors, InvoiceTermsFormData } from "./types";

export type InvoiceTermsFormMode = "create" | "edit";

type Props = {
  open: boolean;
  mode: InvoiceTermsFormMode;
  data: InvoiceTermsFormData;
  errors: InvoiceTermsErrors;
  onClose: () => void;
  onChange: (field: keyof InvoiceTermsFormData, value: string) => void;
  onSubmit: () => void;
};

export function InvoiceTermsForm({
  open,
  mode,
  data,
  errors,
  onClose,
  onChange,
  onSubmit,
}: Props) {
  const isCreate = mode === "create";
  const title = isCreate ? "Create Invoice Terms" : "Edit Invoice Terms";
  const description = isCreate
    ? "Define a reusable template for payment, delivery, and banking details."
    : "Update this template to keep invoice terms consistent across buyers.";

  return (
    <CustomModal
      open={open}
      onOpenChange={(value) => !value && onClose()}
      title={title}
      maxWidth="700px"
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-500 mb-4">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Template Name"
            name="name"
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Standard LC 90 Days"
            error={errors.name}
          />
          <InputField
            label="Payment Terms"
            name="payment"
            value={data.payment}
            onChange={(e) => onChange("payment", e.target.value)}
            placeholder="TT 30 Days"
            error={errors.payment}
          />
          <InputField
            label="Delivery Terms"
            name="delivery"
            value={data.delivery}
            onChange={(e) => onChange("delivery", e.target.value)}
            placeholder="FOB Chittagong"
            error={errors.delivery}
          />
          <InputField
            label="Advising Bank"
            name="advisingBank"
            value={data.advisingBank}
            onChange={(e) => onChange("advisingBank", e.target.value)}
            placeholder="HSBC Bangladesh"
            error={errors.advisingBank}
          />
          <InputField
            label="Negotiation"
            name="negotiation"
            value={data.negotiation}
            onChange={(e) => onChange("negotiation", e.target.value)}
            placeholder="By sight"
            error={errors.negotiation}
          />
          <InputField
            label="Origin"
            name="origin"
            value={data.origin}
            onChange={(e) => onChange("origin", e.target.value)}
            placeholder="Bangladesh"
            error={errors.origin}
          />
          <InputField
            label="SWIFT Code"
            name="swiftCode"
            value={data.swiftCode}
            onChange={(e) => onChange("swiftCode", e.target.value)}
            placeholder="HSBCBDDH"
            error={errors.swiftCode}
          />
          <InputField
            label="BIN"
            name="binNo"
            value={data.binNo}
            onChange={(e) => onChange("binNo", e.target.value)}
            placeholder="123456789"
            error={errors.binNo}
          />
          <InputField
            label="H.S. Code"
            name="hsCode"
            value={data.hsCode}
            onChange={(e) => onChange("hsCode", e.target.value)}
            placeholder="610910"
            error={errors.hsCode}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Remarks
          </label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={data.remarks}
            onChange={(e) => onChange("remarks", e.target.value)}
            placeholder="Handle with care"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-9 px-4 py-2 bg-black text-white hover:bg-black/90"
            onClick={onSubmit}
          >
            {isCreate ? "Create" : "Save Changes"}
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
