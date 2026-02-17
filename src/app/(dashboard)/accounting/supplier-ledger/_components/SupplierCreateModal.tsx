'use client'
import React, { useState } from 'react';
import CustomModal from "@/components/reusables/CustomModal";
import { Box, Flex, InputField } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SupplierCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const SupplierCreateModal = ({ open, onOpenChange }: SupplierCreateModalProps) => {
    const [formData, setFormData] = useState({
        supplierName: "",
        supplierId: "",
        address: "",
        openingBalance: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Creating supplier:", formData);
        toast.success("Supplier created successfully");
        onOpenChange(false);
        setFormData({
            supplierName: "",
            supplierId: "",
            address: "",
            openingBalance: "",
        });
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={onOpenChange}
            title="Add New Supplier"
            width="90vw"
            maxWidth="600px"
        >
            <form onSubmit={handleSubmit} className="space-y-2">
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <InputField
                        label="Supplier Name"
                        name="supplierName"
                        value={formData.supplierName}
                        onChange={handleChange}
                        placeholder="Enter supplier name"
                        required
                    />
                    <InputField
                        label="Supplier ID"
                        name="supplierId"
                        value={formData.supplierId}
                        onChange={handleChange}
                        placeholder="SUP-XXX"
                        required
                    />
                </Box>
                <InputField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter supplier address"
                    required
                />
                <InputField
                    label="Opening Balance"
                    name="openingBalance"
                    type="number"
                    value={formData.openingBalance}
                    onChange={handleChange}
                    placeholder="0.00"
                />
                <Flex className="justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-secondary text-white hover:bg-secondary/90">
                        Create Supplier
                    </Button>
                </Flex>
            </form>
        </CustomModal>
    );
};

export default SupplierCreateModal;
