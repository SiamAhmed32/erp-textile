"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CustomModal, InputField } from "@/components/reusables";
import { Label } from "@/components/ui/label";
import { usePatchMutation } from "@/store/services/commonApi";
import { toast } from "react-toastify";
import { Supplier, SupplierFormData } from "./types";

interface SupplierEditModalProps {
    open: boolean;
    onClose: () => void;
    supplier: Supplier | null;
}

export default function SupplierEditModal({ open, onClose, supplier }: SupplierEditModalProps) {
    const [formData, setFormData] = useState<SupplierFormData>({
        name: "",
        email: "",
        phone: "",
        location: "",
        address: "",
    });
    const [updateSupplier, { isLoading }] = usePatchMutation();

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name,
                email: supplier.email || "",
                phone: supplier.phone,
                location: supplier.location || "",
                address: supplier.address || "",
            });
        }
    }, [supplier]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplier) return;

        try {
            await updateSupplier({
                path: `/suppliers/${supplier.id}`,
                body: formData
            }).unwrap();
            toast.success("Supplier updated successfully");
            onClose();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update supplier");
        }
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={(val) => {
                if (!val) {
                    onClose();
                }
            }}
            title="Edit Supplier"
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
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="px-8 bg-secondary hover:bg-secondary/90 text-white">
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </CustomModal>
    );
}
