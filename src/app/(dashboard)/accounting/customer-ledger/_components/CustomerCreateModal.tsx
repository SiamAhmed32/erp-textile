"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    CustomModal,
    InputField,
} from "@/components/reusables";

interface CustomerCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CustomerCreateModal = ({ open, onOpenChange }: CustomerCreateModalProps) => {
    const [formData, setFormData] = useState({
        customerName: "",
        customerId: "",
        address: "",
        phone: "",
        email: "",
        initialBalance: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Simulated API call
            console.log("Creating customer:", formData);
            toast.success("Customer created successfully");
            onOpenChange(false);
            resetForm();
        } catch (error: any) {
            toast.error("Failed to create customer");
        }
    };

    const resetForm = () => {
        setFormData({
            customerName: "",
            customerId: "",
            address: "",
            phone: "",
            email: "",
            initialBalance: "",
        });
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={(val) => {
                onOpenChange(val);
                if (!val) resetForm();
            }}
            title="Create New Customer"
            width="90vw"
            maxWidth="700px"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Customer Name"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="e.g. TROUSER WORLD (PVT) LTD"
                        required
                    />
                    <InputField
                        label="Customer ID"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleChange}
                        placeholder="e.g. CUST-001"
                        required
                    />
                    <InputField
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+880 1234-567890"
                    />
                    <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="customer@example.com"
                    />
                    <InputField
                        label="Initial Balance ($)"
                        name="initialBalance"
                        type="number"
                        value={formData.initialBalance}
                        onChange={handleChange}
                        placeholder="0.00"
                    />
                </div>

                <InputField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full business address"
                    required
                />

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="px-8 bg-secondary hover:bg-secondary/90 text-white">
                        Create Customer
                    </Button>
                </div>
            </form>
        </CustomModal>
    );
};

export default CustomerCreateModal;
