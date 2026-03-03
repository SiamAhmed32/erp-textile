"use client";

import React from "react";
import { CustomModal } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { AccountHeader } from "./types";
import { useDeleteOneMutation } from "@/store/services/commonApi";
import { notify } from "@/lib/notifications";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  header: AccountHeader | null;
  onSuccess: () => void;
};

const AccountHeaderDeleteModal = ({
  open,
  onOpenChange,
  header,
  onSuccess,
}: Props) => {
  const [deleteOne, { isLoading: isDeleting }] = useDeleteOneMutation();

  const handleDelete = async () => {
    if (!header) return;
    try {
      await deleteOne({
        path: `accounting/accountHeads/${header.id}`,
        invalidate: ["accounting/accountHeads"],
      }).unwrap();
      notify.success("Account header deleted successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to delete account header:", error);
      notify.error(
        error?.data?.message ||
          "Could not delete the account head. Please try again.",
      );
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title="Confirm Delete"
      maxWidth="400px"
    >
      <div className="space-y-4 pt-4">
        <p className="text-sm text-slate-500 leading-relaxed">
          Are you sure you want to delete account header{" "}
          <span className="font-bold text-slate-900">
            {header?.name} ({header?.code})
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="border-slate-200"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 shadow-sm"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default AccountHeaderDeleteModal;
