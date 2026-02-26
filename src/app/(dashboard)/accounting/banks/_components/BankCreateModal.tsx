"use client";

import React from "react";
import { CustomModal } from "@/components/reusables";
import BankForm from "./BankForm";
import { BankFormValues } from "./types";
import { usePostMutation } from "@/store/services/commonApi";
import toast from "react-hot-toast";

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
            toast.success("Bank created successfully");
            onOpenChange(false);
        } catch (error: any) {
            console.error("Failed to create bank:", error);
            toast.error(error?.data?.message || "Failed to create bank");
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
