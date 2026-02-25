"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bank, BankFormSchema, BankFormValues } from "./types";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface BankFormProps {
    initialData?: Bank | null;
    onSubmit: (data: BankFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

export default function BankForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
}: BankFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BankFormValues>({
        resolver: zodResolver(BankFormSchema),
        defaultValues: {
            bankName: initialData?.bankName || "",
            accountNumber: initialData?.accountNumber || "",
            branchName: initialData?.branchName || "",
            swiftCode: initialData?.swiftCode || "",
            routingNumber: initialData?.routingNumber || "",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
                {/* ── Bank Identity ─────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                            Bank Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            {...register("bankName")}
                            placeholder="e.g. City Bank Limited"
                            className={cn(
                                "h-11 border-zinc-200 font-semibold",
                                errors.bankName && "border-red-500 focus-visible:ring-red-500"
                            )}
                        />
                        {errors.bankName && <p className="text-[10px] text-red-500 font-bold">{errors.bankName.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                            Account Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            {...register("accountNumber")}
                            placeholder="e.g. 100-245-8890"
                            className={cn(
                                "h-11 border-zinc-200 font-mono font-bold",
                                errors.accountNumber && "border-red-500 focus-visible:ring-red-500"
                            )}
                        />
                        {errors.accountNumber && <p className="text-[10px] text-red-500 font-bold">{errors.accountNumber.message}</p>}
                    </div>
                </div>

                {/* ── Branch Info ───────────────────────────────────────── */}
                <div className="space-y-1.5">
                    <Label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Branch Name</Label>
                    <Input
                        {...register("branchName")}
                        placeholder="e.g. Gulshan Branch"
                        className={cn("h-11 border-zinc-200", errors.branchName && "border-red-500")}
                    />
                </div>

                {/* ── SWIFT & Routing ───────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">SWIFT Code</Label>
                        <Input
                            {...register("swiftCode")}
                            placeholder="e.g. CIBLBDDH"
                            className={cn("h-11 border-zinc-200 font-mono", errors.swiftCode && "border-red-500")}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Routing Number</Label>
                        <Input
                            {...register("routingNumber")}
                            placeholder="e.g. 010260136"
                            className={cn("h-11 border-zinc-200 font-mono", errors.routingNumber && "border-red-500")}
                        />
                    </div>
                </div>
            </div>

            {/* ── Footer ───────────────────────────────────────────── */}
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="h-11 px-6 text-zinc-500 font-bold hover:bg-zinc-50"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 px-10 bg-zinc-900 text-white font-bold hover:bg-black transition-all active:scale-95"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Saving...</span>
                        </div>
                    ) : (
                        <span>{initialData ? "Update Bank" : "Register Bank"}</span>
                    )}
                </Button>
            </div>
        </form>
    );
}
