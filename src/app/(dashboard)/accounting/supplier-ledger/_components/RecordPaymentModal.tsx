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
import { notify } from "@/lib/notifications";
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
interface RecordPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplierId: string;
  supplierName: string;
}

type PaymentMethod = "CASH" | "BANK" | "CHEQUE";

// ── Component ──────────────────────────────────────────────────────────────────
export default function RecordPaymentModal({
  open,
  onOpenChange,
  supplierId,
  supplierName,
}: RecordPaymentModalProps) {
  const [postItem, { isLoading }] = usePostMutation();

  // Form State
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("BANK");
  const [bankAccountId, setBankAccountId] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [remarks, setRemarks] = useState("");

  // Account Overrides
  const [assetAccountId, setAssetAccountId] = useState("");
  const [payableAccountId, setPayableAccountId] = useState("");

  // Fetch banks for dropdown
  const { data: banksPayload } = useGetAllQuery({
    path: "accounting/banks",
    limit: 100,
    sort: null,
  });
  const banks = (banksPayload?.data || []) as any[];

  // Fetch account heads for overrides
  const { data: accountsPayload } = useGetAllQuery({
    path: "accounting/accountHeads",
    limit: 1000,
  });
  const allAccounts = (accountsPayload?.data || []) as any[];

  const cashBankAccounts = allAccounts.filter(
    (acc) =>
      acc.type === "ASSET" &&
      (acc.name.toLowerCase().includes("cash") ||
        acc.name.toLowerCase().includes("bank")),
  );
  const payableAccounts = allAccounts.filter(
    (acc) =>
      acc.type === "LIABILITY" && acc.name.toLowerCase().includes("payable"),
  );

  // Default selections
  React.useEffect(() => {
    if (!assetAccountId && cashBankAccounts.length > 0) {
      const defaultAcc =
        cashBankAccounts.find((a) =>
          paymentMethod === "CASH"
            ? a.name.toLowerCase().includes("cash")
            : a.name.toLowerCase().includes("bank"),
        ) || cashBankAccounts[0];
      setAssetAccountId(defaultAcc.id);
    }
    if (!payableAccountId && payableAccounts.length > 0) {
      const defaultAcc =
        payableAccounts.find((a) => a.name.toLowerCase().includes("payable")) ||
        payableAccounts[0];
      setPayableAccountId(defaultAcc.id);
    }
  }, [
    cashBankAccounts,
    payableAccounts,
    paymentMethod,
    assetAccountId,
    payableAccountId,
  ]);

  const resetForm = () => {
    setAmount("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setPaymentMethod("BANK");
    setBankAccountId("");
    setReferenceId("");
    setRemarks("");
    setAssetAccountId("");
    setPayableAccountId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      notify.error("Please enter a valid amount");
      return;
    }

    try {
      const body: any = {
        supplierId,
        amount: Number(amount),
        date,
        paymentMethod,
        assetAccountId,
        payableAccountId,
      };

      if (referenceId.trim()) body.referenceId = referenceId.trim();
      if (remarks.trim()) body.remarks = remarks.trim();
      if (paymentMethod !== "CASH" && bankAccountId) {
        body.bankAccountId = bankAccountId;
      }

      await postItem({
        path: "accounting/payments/supplier",
        body,
        invalidate: [
          "accounting/payments",
          `accounting/ledger/supplier/${supplierId}`,
          `accounting/ledger/supplier`,
          "accounting/banks",
        ],
      }).unwrap();
      notify.success("Payment recorded successfully");
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Payment Error:", error);
      notify.error(
        error?.data?.message ||
          "Could not record the payment. Please try again.",
      );
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
      title="Record Payment"
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Payment Context */}
        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
            Making Payment To
          </p>
          <p className="text-base font-bold text-zinc-900">{supplierName}</p>
        </div>

        {/* Account Head Double Entry - Visualized as requested */}
        <div className="grid grid-cols-2 gap-4 bg-zinc-50/50 p-4 rounded-xl border border-zinc-100">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
              Debit Account (DR)
            </Label>
            <Select
              value={assetAccountId}
              onValueChange={setAssetAccountId}
              disabled
            >
              <SelectTrigger className="h-10 bg-white border-zinc-200 opacity-80 cursor-not-allowed">
                <SelectValue placeholder="Cash/Bank" />
              </SelectTrigger>
              <SelectContent>
                {cashBankAccounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[9px] text-zinc-400 italic font-medium">
              * Default: CASH/BANK (Locked)
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              Credit Account (CR)
            </Label>
            <Select
              value={payableAccountId}
              onValueChange={setPayableAccountId}
            >
              <SelectTrigger className="h-10 bg-white border-zinc-200">
                <SelectValue placeholder="Payable" />
              </SelectTrigger>
              <SelectContent>
                {payableAccounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[9px] text-emerald-600 italic font-medium">
              * Suggest: Accounts Payable (Editable)
            </p>
          </div>
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
              if (v === "CASH") {
                setBankAccountId("");
                const cashAcc = cashBankAccounts.find((a) =>
                  a.name.toLowerCase().includes("cash"),
                );
                if (cashAcc) setAssetAccountId(cashAcc.id);
              } else {
                const bankAcc = cashBankAccounts.find((a) =>
                  a.name.toLowerCase().includes("bank"),
                );
                if (bankAcc) setAssetAccountId(bankAcc.id);
              }
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
            placeholder="Optional note about this payment"
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
            Record Payment
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
