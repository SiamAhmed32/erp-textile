"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    CustomModal,
    InputField,
    SelectBox,
} from "@/components/reusables";
import { CustomerLedgerItem } from "./types";

interface RecordPaymentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customer: CustomerLedgerItem | null;
}

const RecordPaymentModal = ({ open, onOpenChange, customer }: RecordPaymentModalProps) => {
    const [formData, setFormData] = useState({
        amount: "",
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: "Cash",
        reference: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Simulated API call
            console.log("Recording payment for", customer?.customerName, formData);
            toast.success("Payment recorded successfully");
            onOpenChange(false);
            resetForm();
        } catch (error: any) {
            toast.error("Failed to record payment");
        }
    };

    const resetForm = () => {
        setFormData({
            amount: "",
            paymentDate: new Date().toISOString().split('T')[0],
            paymentMethod: "Cash",
            reference: "",
        });
    };

    const paymentMethods = [
        { name: "Cash", _id: "Cash" },
        { name: "Bank Transfer", _id: "Bank Transfer" },
        { name: "Check", _id: "Check" },
        { name: "Mobile Banking", _id: "Mobile Banking" },
    ];

    if (!customer) return null;

    return (
        <CustomModal
            open={open}
            onOpenChange={(val) => {
                onOpenChange(val);
                if (!val) resetForm();
            }}
            title="Record Payment"
            width="90vw"
            maxWidth="600px"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Customer</p>
                        <p className="font-bold text-secondary">{customer.customerName}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase font-semibold">Current Balance</p>
                        <p className="font-bold text-secondary">${customer.balance.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Payment Amount ($)"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                    />
                    <InputField
                        label="Payment Date"
                        name="paymentDate"
                        type="date"
                        value={formData.paymentDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <SelectBox
                    label="Payment Method"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    options={paymentMethods}
                    required
                />

                <InputField
                    label="Reference / Note"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    placeholder="e.g. L/C Number, Check Number, or Note"
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
                        Record Payment
                    </Button>
                </div>
            </form>
        </CustomModal>
    );
};

export default RecordPaymentModal;
