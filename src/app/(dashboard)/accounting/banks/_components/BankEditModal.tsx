"use client";

import React from "react";
import { CustomModal } from "@/components/reusables";
import BankForm from "./BankForm";
import { Bank, BankFormValues } from "./types";
import { usePatchMutation } from "@/store/services/commonApi";
import { notify } from "@/lib/notifications";

interface BankEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bank: Bank | null;
}

export default function BankEditModal({
  open,
  onOpenChange,
  bank,
}: BankEditModalProps) {
  const [patchItem, { isLoading }] = usePatchMutation();

  const handleSubmit = async (values: BankFormValues) => {
    if (!bank) return;
    try {
      await patchItem({
        path: `accounting/banks/${bank.id}`,
        body: values,
        invalidate: ["accounting/banks"],
      }).unwrap();
      notify.success("Bank updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to update bank:", error);
      notify.error(
        error?.data?.message ||
          "Could not update the bank account. Please try again.",
      );
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Bank Account"
      maxWidth="600px"
    >
      <BankForm
        initialData={bank}
        onSubmit={handleSubmit}
        onCancel={() => onOpenChange(false)}
        isSubmitting={isLoading}
      />
    </CustomModal>
  );
}
