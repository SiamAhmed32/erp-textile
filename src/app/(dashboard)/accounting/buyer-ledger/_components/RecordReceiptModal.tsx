"use client";

import React, { useState } from "react";
import { CustomModal } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { usePostMutation, useGetAllQuery } from "@/store/services/commonApi";
import toast from "react-hot-toast";
import {
    Banknote,
    CalendarDays,
    CreditCard,
    Hash,
    Landmark,
    MessageSquare,
    Loader2,
} from "lucide-react";
import { format } from "date-fns";

// ── Types ──────────────────────────────────────────────────────────────────────
interface RecordReceiptModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    buyerId: string;
    buyerName: string;
}

type PaymentMethod = "CASH" | "BANK" | "CHEQUE";

// ── Component ──────────────────────────────────────────────────────────────────
export default function RecordReceiptModal({
    open,
    onOpenChange,
    buyerId,
    buyerName,
}: RecordReceiptModalProps) {
    const [postItem, { isLoading }] = usePostMutation();

    // Form State
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("BANK");
    const [bankAccountId, setBankAccountId] = useState("");
    const [referenceId, setReferenceId] = useState("");
    const [remarks, setRemarks] = useState("");

    // Fetch banks for dropdown
    const { data: banksPayload } = useGetAllQuery({
        path: "accounting/banks",
        limit: 100,
        sort: null,
    });
    const banks = (banksPayload?.data || []) as any[];

    const resetForm = () => {
        setAmount("");
        setDate(format(new Date(), "yyyy-MM-dd"));
        setPaymentMethod("BANK");
        setBankAccountId("");
        setReferenceId("");
        setRemarks("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || Number(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        try {
            const body: any = {
                buyerId,
                amount: Number(amount),
                date,
                paymentMethod,
            };

            if (referenceId.trim()) body.referenceId = referenceId.trim();
            if (remarks.trim()) body.remarks = remarks.trim();
            if (paymentMethod !== "CASH" && bankAccountId) {
                body.bankAccountId = bankAccountId;
            }

            await postItem({
                path: "accounting/receipts/buyer",
                body,
                invalidate: [
                    "accounting/receipts",
                    `accounting/ledger/buyer/${buyerId}`,
                    `accounting/ledger/buyer`,
                    "accounting/banks",
                ],
            }).unwrap();

            toast.success("Receipt recorded successfully");
            resetForm();
            onOpenChange(false);
        } catch (error: any) {
            console.error("Receipt Error:", error);
            toast.error(error?.data?.message || "Failed to record receipt");
        }
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={(v) => {
                if (!v) resetForm();
                onOpenChange(v);
            }}
            title="Record Receipt"
            maxWidth="560px"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Receipt Context */}
                <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Receiving Payment From
                    </p>
                    <p className="text-base font-bold text-zinc-900">{buyerName}</p>
                </div>

                {/* Amount + Date Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Banknote className="w-3.5 h-3.5" /> Amount (৳)
                        </Label>
                        <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="font-mono text-lg font-bold h-12 border-zinc-200 focus:border-zinc-400"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5" /> Date
                        </Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="h-12 border-zinc-200 focus:border-zinc-400"
                            required
                        />
                    </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" /> Payment Method
                    </Label>
                    <Select
                        value={paymentMethod}
                        onValueChange={(v) => {
                            setPaymentMethod(v as PaymentMethod);
                            if (v === "CASH") setBankAccountId("");
                        }}
                    >
                        <SelectTrigger className="h-12 border-zinc-200">
                            <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CASH">Cash</SelectItem>
                            <SelectItem value="BANK">Bank Transfer</SelectItem>
                            <SelectItem value="CHEQUE">Cheque</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Bank Account (Conditional) */}
                {paymentMethod !== "CASH" && (
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Landmark className="w-3.5 h-3.5" /> Bank Account
                        </Label>
                        <Select value={bankAccountId} onValueChange={setBankAccountId}>
                            <SelectTrigger className="h-12 border-zinc-200">
                                <SelectValue placeholder="Select bank account (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {banks.map((bank: any) => (
                                    <SelectItem key={bank.id} value={bank.id}>
                                        {bank.bankName} — {bank.accountNumber}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Reference ID */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5" /> Reference / Transaction ID
                    </Label>
                    <Input
                        placeholder="e.g. CHQ-12345, TXN-98765"
                        value={referenceId}
                        onChange={(e) => setReferenceId(e.target.value)}
                        className="h-11 border-zinc-200 focus:border-zinc-400"
                    />
                </div>

                {/* Remarks */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> Remarks
                    </Label>
                    <Input
                        placeholder="Optional note about this receipt"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="h-11 border-zinc-200 focus:border-zinc-400"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            resetForm();
                            onOpenChange(false);
                        }}
                        className="px-6 border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading || !amount}
                        className="px-6 bg-zinc-900 text-white font-bold hover:bg-black active:scale-95 transition-all"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Record Receipt
                    </Button>
                </div>
            </form>
        </CustomModal>
    );
}
