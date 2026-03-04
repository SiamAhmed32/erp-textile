"use client";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useGetAllQuery, usePostMutation } from "@/store/services/commonApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { notify } from "@/lib/notifications";
import {
  AccountHeader,
  AccountHeaderFormData,
  AccountHeaderFormSchema,
} from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AccountHeaderCreateModal = ({ open, onOpenChange }: Props) => {
  const [postItem] = usePostMutation();

  // Fetch all account heads for parents
  const { data: accountsData, isLoading: isLoadingAccounts } = useGetAllQuery({
    path: "accounting/accountHeads",
    limit: 1000,
  });

  const allAccounts = (accountsData?.data || []) as AccountHeader[];
  const { data: companiesPayload } = useGetAllQuery({
    path: "company-profiles",
    limit: 100,
  });
  const companies = useMemo(
    () => (companiesPayload?.data || []) as any[],
    [companiesPayload],
  );

  const accountTypeOptions = [
    {
      name: "ASSET",
      _id: "ASSET",
      color: "text-sky-600 bg-sky-50 border-sky-100",
    },
    {
      name: "LIABILITY",
      _id: "LIABILITY",
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      name: "EQUITY",
      _id: "EQUITY",
      color: "text-violet-600 bg-violet-50 border-violet-100",
    },
    {
      name: "INCOME",
      _id: "INCOME",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      name: "EXPENSE",
      _id: "EXPENSE",
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AccountHeaderFormData>({
    resolver: zodResolver(AccountHeaderFormSchema),
    defaultValues: {
      name: "",
      type: "ASSET",
      description: "",
      parentId: null,
      isControlAccount: false,
      companyProfileId: "",
    },
  });

  // Auto-select first company if available
  useEffect(() => {
    if (companies.length > 0 && !watch("companyProfileId")) {
      reset((prev) => ({ ...prev, companyProfileId: companies[0].id }));
    }
  }, [companies, reset, watch]);

  const selectedType = watch("type");

  // Filter potential parents: same type
  const parentOptions = allAccounts.filter((acc) => acc.type === selectedType);

  const onSubmit = async (data: AccountHeaderFormData) => {
    try {
      await postItem({
        path: "accounting/accountHeads",
        body: data,
        invalidate: ["accounting/accountHeads"],
      }).unwrap();
      notify.success("Account head registered successfully");
      reset();
      onOpenChange(false);
    } catch (error: any) {
      notify.error(
        error?.data?.message ||
        "Could not create the account head. Please try again.",
      );
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={(val) => {
        if (!val) reset();
        onOpenChange(val);
      }}
      title="Register Ledger Head"
      maxWidth="640px"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Group & Mode Section ────────────────────────────────── */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                Associated Company <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="companyProfileId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 bg-white border-zinc-200 font-semibold text-zinc-800">
                      <SelectValue placeholder="Select Business Profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.companyProfileId && (
                <p className="text-[10px] text-destructive font-bold uppercase">
                  {errors.companyProfileId.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                Group
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 bg-white border-zinc-200 font-semibold text-zinc-800">
                      <SelectValue placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypeOptions.map((opt) => (
                        <SelectItem key={opt._id} value={opt._id}>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              opt.color,
                            )}
                          >
                            {opt.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-zinc-200 shadow-sm">
            <div className="space-y-0.5">
              <Label className="text-zinc-800 font-bold text-sm">
                Control Account
              </Label>
              <p className="text-[10px] text-zinc-400 font-medium">
                Enable nesting of sub-headers within this category
              </p>
            </div>
            <Controller
              name="isControlAccount"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        {/* ── Hierarchy ───────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <Label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            Parent Classification
          </Label>
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(val) =>
                  field.onChange(val === "none" ? null : val)
                }
                value={field.value || "none"}
              >
                <SelectTrigger className="h-11 border-zinc-200 bg-white">
                  <SelectValue placeholder="Select Parent Category (Optional)" />
                </SelectTrigger>
                <SelectContent className="max-h-[250px]">
                  <SelectItem
                    value="none"
                    className="italic text-zinc-400 text-xs"
                  >
                    Top Level (No Parent)
                  </SelectItem>
                  {parentOptions.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-700">
                          {acc.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Account Name <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register("name")}
              placeholder="e.g. Petty Cash"
              className={cn(
                "h-11 border-zinc-200 focus:ring-zinc-900 font-semibold",
                errors.name && "border-red-500",
              )}
            />
            {errors.name && (
              <p className="text-[10px] text-destructive font-bold uppercase">
                {errors.name.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            Operational Notes
          </Label>
          <textarea
            {...register("description")}
            rows={2}
            className="flex min-h-[80px] w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
            placeholder="Define the purpose of this ledger head..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-11 px-6 text-zinc-500 font-bold hover:bg-zinc-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 px-10 bg-zinc-900 text-white font-bold hover:bg-black transition-all active:scale-95"
          >
            {isSubmitting ? "Registering..." : "Register Head"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};

export default AccountHeaderCreateModal;
