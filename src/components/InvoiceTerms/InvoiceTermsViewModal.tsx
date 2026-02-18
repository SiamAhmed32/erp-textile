"use client";

import React from "react";
import { InvoiceTerms } from "./types";
import { InvoiceTermsDetail } from "./InvoiceTermsDetail";
import CustomModal from "@/components/reusables/CustomModal";

type Props = {
  open: boolean;
  terms: InvoiceTerms | null;
  onClose: () => void;
  onEdit: (terms: InvoiceTerms) => void;
};

export function InvoiceTermsViewModal({ open, terms, onClose, onEdit }: Props) {
  if (!terms) return null;

  return (
    <CustomModal
      open={open}
      onOpenChange={(val) => !val && onClose()}
      title="Invoice Terms Details"
      maxWidth="800px"
    >
      <div className="mt-2">
        <InvoiceTermsDetail
          terms={terms}
          onEdit={(t) => {
            onClose();
            onEdit(t);
          }}
        />
      </div>
    </CustomModal>
  );
}
