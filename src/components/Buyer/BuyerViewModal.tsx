"use client";

import React from "react";
import { Buyer } from "./types";
import { BuyerDetail } from "./BuyerDetail";
import CustomModal from "@/components/reusables/CustomModal";

type Props = {
  open: boolean;
  buyer: Buyer | null;
  onClose: () => void;
  onEdit: (buyer: Buyer) => void;
};

export function BuyerViewModal({ open, buyer, onClose, onEdit }: Props) {
  if (!buyer) return null;

  return (
    <CustomModal
      open={open}
      onOpenChange={(val) => !val && onClose()}
      title="Buyer Details"
      maxWidth="600px"
    >
      <BuyerDetail
        buyer={buyer}
        onEdit={(b) => {
          onClose();
          onEdit(b);
        }}
      />
    </CustomModal>
  );
}
