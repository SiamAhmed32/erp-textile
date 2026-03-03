"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bank, BankFormSchema, BankFormValues } from "./types";
import { cn } from "@/lib/utils";
import { Loader2, Building2 } from "lucide-react";
import { useGetAllQuery } from "@/store/services/commonApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    setValue,
    watch,
    formState: { errors },
  } = useForm<BankFormValues>({
    resolver: zodResolver(BankFormSchema),
    defaultValues: {
      bankName: initialData?.bankName || "",
      accountNumber: initialData?.accountNumber || "",
      branchName: initialData?.branchName || "",
      swiftCode: initialData?.swiftCode || "",
      routingNumber: initialData?.routingNumber || "",
      companyProfileId: initialData?.companyProfileId || "",
    },
  });

  const { data: companiesPayload } = useGetAllQuery({
    path: "company-profiles",
    limit: 100,
  });

  const companies = React.useMemo(
    () => ((companiesPayload as any)?.data || []) as any[],
    [companiesPayload],
  );
  const selectedCompanyId = watch("companyProfileId");

  // Auto-select first company profile if none selected
  React.useEffect(() => {
    if (companies.length > 0 && !selectedCompanyId && !initialData) {
      setValue("companyProfileId", companies[0].id);
    }
  }, [companies, selectedCompanyId, setValue, initialData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-5">
        {/* ── Bank Identity ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-1">
              Bank Name <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("bankName")}
              placeholder="e.g. City Bank Limited"
              className={cn(
                "h-11 border-slate-200 bg-slate-50/50 font-semibold focus-visible:ring-slate-400 transition-all",
                errors.bankName && "border-red-500 focus-visible:ring-red-500",
              )}
            />
            {errors.bankName && (
              <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-tight">
                {errors.bankName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-1">
              Account Number <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("accountNumber")}
              placeholder="e.g. 100-245-8890"
              className={cn(
                "h-11 border-slate-200 bg-slate-50/50 font-bold tracking-tight focus-visible:ring-slate-400 transition-all",
                errors.accountNumber &&
                  "border-red-500 focus-visible:ring-red-500",
              )}
            />
            {errors.accountNumber && (
              <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-tight">
                {errors.accountNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* ── Branch Info ───────────────────────────────────────── */}
        <div className="space-y-2">
          <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-1">
            Branch Name
          </Label>
          <Input
            {...register("branchName")}
            placeholder="e.g. Gulshan Branch"
            className={cn(
              "h-11 border-slate-200 bg-slate-50/50 font-medium focus-visible:ring-slate-400 transition-all",
              errors.branchName && "border-red-500",
            )}
          />
        </div>

        {/* ── SWIFT & Routing ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-1">
              SWIFT Code
            </Label>
            <Input
              {...register("swiftCode")}
              placeholder="e.g. CIBLBDDH"
              className={cn(
                "h-11 border-slate-200 bg-slate-50/50 font-bold focus-visible:ring-slate-400 transition-all",
                errors.swiftCode && "border-red-500",
              )}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-1">
              Routing Number
            </Label>
            <Input
              {...register("routingNumber")}
              placeholder="e.g. 010260136"
              className={cn(
                "h-11 border-slate-200 bg-slate-50/50 font-bold focus-visible:ring-slate-400 transition-all",
                errors.routingNumber && "border-red-500",
              )}
            />
          </div>
        </div>

        {/* ── Business Context ───────────────────────────────────── */}
        <div className="space-y-2">
          <Label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 pl-1">
            <Building2 className="w-3 h-3 text-slate-400" />
            Associated Business Profile <span className="text-red-500">*</span>
          </Label>
          <Select
            value={selectedCompanyId}
            onValueChange={(val) =>
              setValue("companyProfileId", val, { shouldValidate: true })
            }
          >
            <SelectTrigger
              className={cn(
                "h-11 border-slate-200 bg-slate-50/50 font-semibold focus:ring-slate-400 transition-all",
                errors.companyProfileId && "border-red-500 focus:ring-red-500",
              )}
            >
              <SelectValue placeholder="Select business profile" />
            </SelectTrigger>
            <SelectContent className="bg-white rounded-xl shadow-xl border-slate-200">
              {companies.map((company) => (
                <SelectItem
                  key={company.id}
                  value={company.id}
                  className="font-medium text-xs py-2.5"
                >
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.companyProfileId && (
            <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-tight">
              {errors.companyProfileId.message}
            </p>
          )}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-11 px-8 text-slate-500 font-bold text-xs uppercase tracking-widest bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all rounded-lg"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 px-10 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-black/90 transition-all active:scale-95 rounded-lg shadow-lg shadow-black/10"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Syncing...</span>
            </div>
          ) : (
            <span>{initialData ? "Apply Changes" : "Register Account"}</span>
          )}
        </Button>
      </div>
    </form>
  );
}
