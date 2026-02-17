'use client'
import React, { useState } from 'react';
import CustomModal from "@/components/reusables/CustomModal";
import { Box, Flex, InputField } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { SupplierLedgerItem } from "./types";
import { toast } from 'sonner';

interface MakePaymentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supplier: SupplierLedgerItem | null;
}

const MakePaymentModal = ({ open, onOpenChange, supplier }: MakePaymentModalProps) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: "",
        reference: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Recording payment for", supplier?.supplierName, ":", formData);
        toast.success("Payment recorded successfully");
        onOpenChange(false);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            amount: "",
            reference: "",
        });
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={onOpenChange}
            title="Make Payment"
            width="90vw"
            maxWidth="500px"
        >
            <form onSubmit={handleSubmit} className="space-y-2">
                <Box className="pb-4 border-b mb-4">
                    <p className="text-sm font-medium text-muted-foreground uppercase">Supplier</p>
                    <p className="text-lg font-bold text-secondary">{supplier?.supplierName || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">{supplier?.supplierId}</p>
                </Box>

                <InputField
                    label="Payment Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />

                <InputField
                    label="Payment Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                />

                <InputField
                    label="Reference / Remarks"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    placeholder="e.g., Check #12345"
                />

                <Flex className="justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-secondary text-white hover:bg-secondary/90">
                        Record Payment
                    </Button>
                </Flex>
            </form>
        </CustomModal>
    );
};

export default MakePaymentModal;
