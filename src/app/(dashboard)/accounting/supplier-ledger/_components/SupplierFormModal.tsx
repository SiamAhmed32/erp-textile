"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomModal, InputField } from "@/components/reusables";
import { Label } from "@/components/ui/label";
import { usePostMutation } from "@/store/services/commonApi";
import { toast } from "react-toastify";

const initialFormData = {
    name: "",
    email: "",
    phone: "",
    location: "",
    address: "",
};

interface SupplierFormModalProps {
    open: boolean;
    onClose: () => void;
}

export default function SupplierFormModal({ open, onClose }: SupplierFormModalProps) {
    const [formData, setFormData] = useState(initialFormData);
    const [createSupplier, { isLoading }] = usePostMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => setFormData(initialFormData);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createSupplier({ path: "/suppliers", body: formData }).unwrap();
            toast.success("Supplier created successfully");
            onClose();
            resetForm();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create supplier");
        }
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={(val) => {
                if (!val) {
                    onClose();
                    resetForm();
                }
            }}
            title="Add New Supplier"
            maxWidth="600px"
        >
            <form onSubmit={handleSubmit} className="space-y-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <InputField
                        label="Supplier Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Karim Traders"
                        required
                    />
                    <InputField
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +880..."
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="vendor@example.com"
                    />
                    <InputField
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Dhaka"
                    />
                </div>
                <div className="mb-4">
                    <Label htmlFor="address">Company Details / Address</Label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                        placeholder="Supplier office address..."
                        className="font-primary input_field w-full px-4 py-2 border focus:outline-none focus:border-transparent focus:ring-2 focus:ring-button transition border-borderBg min-h-[80px]"
                    />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => { onClose(); resetForm(); }}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="px-8 bg-secondary hover:bg-secondary/90 text-white">
                        {isLoading ? "Creating..." : "Create Supplier"}
                    </Button>
                </div>
            </form>
        </CustomModal>
    );
}
