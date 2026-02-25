"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Bank, BankFormSchema, BankFormValues } from "./types";
import { cn } from "@/lib/utils";
import { useGetAllQuery } from "@/store/services/commonApi";
import { ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";

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
        control,
        formState: { errors },
    } = useForm<BankFormValues>({
        resolver: zodResolver(BankFormSchema),
        defaultValues: {
            bankName: initialData?.bankName || "",
            accountNumber: initialData?.accountNumber || "",
            branchName: initialData?.branchName || "",
            swiftCode: initialData?.swiftCode || "",
            routingNumber: initialData?.routingNumber || "",
            accountHeadId: initialData?.accountHeadId || null,
        },
    });

    // Fetch Asset account heads for linking
    const { data: accountHeadsData, isLoading: isLoadingHeads } = useGetAllQuery({
        path: "accounting/accountHeads",
        limit: 1000,
        filters: { type: "ASSET" },
    });

    const accountHeads = (accountHeadsData?.data || []) as any[];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>Bank Name <span className="text-red-500">*</span></Label>
                        <Input
                            {...register("bankName")}
                            placeholder="e.g. City Bank Limited"
                            className={cn(errors.bankName && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {errors.bankName && <p className="text-xs text-red-500">{errors.bankName.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label>Account Number <span className="text-red-500">*</span></Label>
                        <Input
                            {...register("accountNumber")}
                            placeholder="e.g. 100-245-8890"
                            className={cn("font-mono", errors.accountNumber && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {errors.accountNumber && <p className="text-xs text-red-500">{errors.accountNumber.message}</p>}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label>Branch Name</Label>
                    <Input
                        {...register("branchName")}
                        placeholder="e.g. Gulshan Branch"
                        className={cn(errors.branchName && "border-red-500 focus-visible:ring-red-500")}
                    />
                    {errors.branchName && <p className="text-xs text-red-500">{errors.branchName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>SWIFT Code</Label>
                        <Input
                            {...register("swiftCode")}
                            placeholder="e.g. CIBLBDDH"
                            className={cn("font-mono", errors.swiftCode && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {errors.swiftCode && <p className="text-xs text-red-500">{errors.swiftCode.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label>Routing Number</Label>
                        <Input
                            {...register("routingNumber")}
                            placeholder="e.g. 010260136"
                            className={cn("font-mono", errors.routingNumber && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {errors.routingNumber && <p className="text-xs text-red-500">{errors.routingNumber.message}</p>}
                    </div>
                </div>

                <div className="pt-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Label className="text-slate-900">Link to Chart of Accounts</Label>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium uppercase tracking-tight">Optional but recommended</span>
                    </div>

                    <div className="space-y-1.5">
                        <Controller
                            name="accountHeadId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={(val) => field.onChange(val === "none" ? null : val)}
                                    value={field.value || "none"}
                                >
                                    <SelectTrigger className={cn("h-11", errors.accountHeadId && "border-red-500")}>
                                        <div className="flex items-center gap-2">
                                            {isLoadingHeads ? <Loader2 className="h-4 w-4 animate-spin opacity-50" /> : null}
                                            <SelectValue placeholder="Select Asset Account" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        <SelectItem value="none" className="text-slate-500 italic">No link (Not recommended)</SelectItem>
                                        {accountHeads.map((head) => (
                                            <SelectItem key={head.id} value={head.id}>
                                                {head.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <p className="text-[11px] text-slate-500 leading-normal bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                            Linking enables automatic ledger entries when recording payments/receipts against this bank.
                        </p>
                        {errors.accountHeadId && <p className="text-xs text-red-500">{errors.accountHeadId.message}</p>}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="h-11 px-6 border-slate-200 font-medium"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 px-10 bg-black text-white hover:bg-black/90 shadow-sm font-semibold"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Saving...</span>
                        </div>
                    ) : (
                        <span>{initialData ? "Update Bank" : "Create Bank"}</span>
                    )}
                </Button>
            </div>
        </form>
    );
}
