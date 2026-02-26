"use client";

import React from "react";
import { Supplier } from "./types";
import { SupplierDetail } from "./SupplierDetail";
import CustomModal from "@/components/reusables/CustomModal";

type Props = {
    open: boolean;
    supplier: Supplier | null;
    onClose: () => void;
    onEdit: (supplier: Supplier) => void;
};

export function SupplierViewModal({ open, supplier, onClose, onEdit }: Props) {
    if (!supplier) return null;

    return (
        <CustomModal
            open={open}
            onOpenChange={(val) => !val && onClose()}
            title="Supplier Details"
            maxWidth="600px"
        >
            <SupplierDetail
                supplier={supplier}
                onEdit={(s) => {
                    onClose();
                    onEdit(s);
                }}
            />
        </CustomModal>
    );
}
