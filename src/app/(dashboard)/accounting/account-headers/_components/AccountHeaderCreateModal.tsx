"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomModal, SelectBox } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePostMutation } from "@/store/services/commonApi";
import { AccountHeaderFormData, AccountHeaderFormSchema } from "./types";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const AccountHeaderCreateModal = ({ open, onOpenChange }: Props) => {
    const [postItem] = usePostMutation();

    const accountTypeOptions = [
        { name: "ASSET", _id: "ASSET" },
        { name: "LIABILITY", _id: "LIABILITY" },
        { name: "REVENUE", _id: "REVENUE" },
        { name: "EXPENSE", _id: "EXPENSE" },
        { name: "EQUITY", _id: "EQUITY" },
    ];

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<AccountHeaderFormData>({
        resolver: zodResolver(AccountHeaderFormSchema),
        defaultValues: {
            name: "",
            code: "",
            type: "ASSET",
            description: "",
            openingBalance: 0,
        },
    });

    const onSubmit = async (data: AccountHeaderFormData) => {
        try {
            await postItem({
                path: "accounting/accountHeads",
                body: { companyProfileId: "3d0afbda-6b2b-4013-895c-7680da86376e", ...data },
                invalidate: ["accounting/accountHeads"],
            }).unwrap();
            toast.success("Account header created successfully");
            reset();
            onOpenChange(false);
        } catch (error: any) {
            console.error("Failed to create account header:", error);
            toast.error(error?.data?.message || "Failed to create account header");
        }
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={(val) => {
                if (!val) reset();
                onOpenChange(val);
            }}
            title="Create Account Header"
            maxWidth="600px"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Account Name <span className="text-red-500">*</span></Label>
                        <Input
                            {...register("name")}
                            placeholder="e.g. Cash Account"
                            className={cn("mt-1.5", errors.name && "border-red-500")}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <Label>Account Code <span className="text-red-500">*</span></Label>
                        <Input
                            {...register("code")}
                            placeholder="e.g. CASH-001"
                            className={cn("mt-1.5", errors.code && "border-red-500")}
                        />
                        {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <SelectBox
                                    label="Account Type"
                                    required
                                    name={field.name}
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={accountTypeOptions}
                                    error={errors.type?.message}
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Label>Opening Balance</Label>
                        <Input
                            type="number"
                            step="0.01"
                            {...register("openingBalance", { valueAsNumber: true })}
                            placeholder="0.00"
                            className={cn("mt-1.5", errors.openingBalance && "border-red-500")}
                        />
                        {errors.openingBalance && <p className="text-xs text-red-500 mt-1">{errors.openingBalance.message}</p>}
                    </div>
                </div>

                <div>
                    <Label>Description</Label>
                    <textarea
                        {...register("description")}
                        rows={3}
                        placeholder="Account description..."
                        className={cn(
                            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5",
                            errors.description && "border-red-500"
                        )}
                    />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-slate-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-black text-white hover:bg-black/90 shadow-sm px-8"
                    >
                        {isSubmitting ? "Creating..." : "Create Account"}
                    </Button>
                </div>
            </form>
        </CustomModal>
    );
};

export default AccountHeaderCreateModal;
