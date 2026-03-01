"use client";

import React from "react";
import { CustomModal } from "@/components/reusables";
import BankForm from "./BankForm";
import { BankFormValues } from "./types";
import { usePostMutation } from "@/store/services/commonApi";
import { notify } from "@/lib/notifications";

interface BankCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BankCreateModal({
  open,
  onOpenChange,
}: BankCreateModalProps) {
  const [postItem, { isLoading }] = usePostMutation();

  const handleSubmit = async (values: BankFormValues) => {
    try {
      await postItem({
        path: "accounting/banks",
        body: values,
        invalidate: ["accounting/banks"],
      }).unwrap();
      notify.success("Bank created successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to create bank:", error);
      notify.error(
        error?.data?.message ||
          "Could not create the bank account. Please try again.",
      );
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Bank"
      maxWidth="600px"
    >
      <BankForm
        onSubmit={handleSubmit}
        onCancel={() => onOpenChange(false)}
        isSubmitting={isLoading}
      />
    </CustomModal>
  );
}
