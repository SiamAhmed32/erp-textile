"use client";

import React, { useState, useEffect } from "react";
import { CustomModal, InputField, SelectBox } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { useGetAllQuery, usePostMutation } from "@/store/services/commonApi";
import { notify } from "@/lib/notifications";

interface TransactionEntryModalProps {
  open: boolean;
  onClose: () => void;
  defaultEmployeeId?: string;
}

const initialFormData = {
  voucherNo: "",
  amount: "",
  purpose: "",
  employeeId: "",
  type: "ISSUE" as "ISSUE" | "SETTLE" | "EXPENSE",
  remarks: "",
  cashAccountId: "",
  expenseAccountId: "",
};

export default function TransactionEntryModal({
  open,
  onClose,
  defaultEmployeeId,
}: TransactionEntryModalProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [postEntry] = usePostMutation();

  // Fetch users for employee (staff) selection
  const { data: usersResponse } = useGetAllQuery({
    path: "users",
    limit: 100,
  });

  // Fetch accounts for cash/expense selection
  const { data: accountsResponse } = useGetAllQuery({
    path: "account-heads",
    limit: 1000,
  });

  const users = (usersResponse as any)?.data || [];
  const accounts = (accountsResponse as any)?.data || [];

  useEffect(() => {
    if (open) {
      setFormData({
        ...initialFormData,
        employeeId: defaultEmployeeId || "",
      });
    }
  }, [open, defaultEmployeeId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.employeeId || !formData.amount || !formData.purpose) {
      return notify.error("Please fill in required fields");
    }

    // Dynamic validation based on type
    if (formData.type === "ISSUE" && !formData.cashAccountId) {
      return notify.error(
        "Please select a Cash/Bank account to issue funds from",
      );
    }
    if (
      formData.type === "EXPENSE" &&
      (!formData.cashAccountId || !formData.expenseAccountId)
    ) {
      return notify.error("Please select both Cash and Expense accounts");
    }
    if (
      formData.type === "SETTLE" &&
      !formData.expenseAccountId &&
      !formData.cashAccountId
    ) {
      return notify.error(
        "Please select an Expense or Cash account for settlement",
      );
    }

    setSaving(true);
    try {
      await postEntry({
        path: "moi-cash-books",
        body: {
          ...formData,
          amount: parseFloat(formData.amount),
          status: "APPROVED",
        },
        invalidate: ["moi-cash-books", "moi-cash-books/summaries"],
      }).unwrap();

      notify.success(`Transaction recorded successfully`);
      onClose();
      setFormData(initialFormData);
    } catch (err: any) {
      notify.error(err?.data?.message || "Failed to record transaction");
      console.error("CashBook Transaction Error:", err);
    } finally {
      setSaving(false);
    }
  };

  const typeOptions = [
    {
      name: "Cash Issued (Advance)",
      _id: "ISSUE",
    },
    {
      name: "Cash Returned (Settlement)",
      _id: "SETTLE",
    },
    {
      name: "Direct Expense",
      _id: "EXPENSE",
    },
  ];

  const userOptions = users.map((u: any) => ({
    name: `${u.firstName} ${u.lastName} (${u.designation || "Staff"})`,
    _id: u.id,
  }));

  // Filtering accounts for selection
  // In a real system we'd filter by account type, but here we'll use name or common sense
  const cashAccounts = accounts
    .filter(
      (a: any) =>
        a.type === "ASSET" &&
        (a.name.toLowerCase().includes("cash") ||
          a.name.toLowerCase().includes("bank")),
    )
    .map((a: any) => ({ name: a.name, _id: a.id }));

  const expenseAccounts = accounts
    .filter((a: any) => a.type === "EXPENSE")
    .map((a: any) => ({ name: a.name, _id: a.id }));

  return (
    <CustomModal
      open={open}
      onOpenChange={(val) => !val && onClose()}
      title="Record Cash Transaction"
      maxWidth="550px"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <SelectBox
            label="Transaction Type"
            options={typeOptions}
            value={formData.type}
            name="type"
            onChange={handleInputChange}
            placeholder="Select type"
            required
          />
          <InputField
            label="Voucher / Ref No"
            name="voucherNo"
            placeholder="e.g. PC-001"
            value={formData.voucherNo}
            onChange={handleInputChange}
            required
          />
        </div>

        {!defaultEmployeeId && (
          <SelectBox
            label="Staff / User"
            options={userOptions}
            value={formData.employeeId}
            name="employeeId"
            onChange={handleInputChange}
            placeholder="Search staff member..."
            required
          />
        )}

        <InputField
          label="Amount (TK)"
          name="amount"
          type="number"
          placeholder="0.00"
          value={formData.amount}
          onChange={handleInputChange}
          required
        />

        {/* Dynamic Account Fields */}
        <div className="grid grid-cols-2 gap-4">
          {(formData.type === "ISSUE" ||
            formData.type === "EXPENSE" ||
            formData.type === "SETTLE") && (
            <SelectBox
              label={
                formData.type === "SETTLE"
                  ? "Return to (Cash/Bank)"
                  : "Paid From (Cash/Bank)"
              }
              options={cashAccounts}
              value={formData.cashAccountId}
              name="cashAccountId"
              onChange={handleInputChange}
              placeholder="Select account"
              required={
                formData.type === "ISSUE" || formData.type === "EXPENSE"
              }
            />
          )}

          {(formData.type === "EXPENSE" || formData.type === "SETTLE") && (
            <SelectBox
              label="Expense Category"
              options={expenseAccounts}
              value={formData.expenseAccountId}
              name="expenseAccountId"
              onChange={handleInputChange}
              placeholder="Select expense"
              required={formData.type === "EXPENSE"}
            />
          )}
        </div>

        <InputField
          label="Purpose"
          name="purpose"
          placeholder="e.g. Fuel and transport"
          value={formData.purpose}
          onChange={handleInputChange}
          required
        />

        <div className="space-y-1.5 mb-4">
          <label className="text-[13px] font-medium text-slate-700">
            Remarks
          </label>
          <textarea
            className="w-full min-h-[80px] p-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all font-normal"
            placeholder="Additional notes..."
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-8 h-10"
          >
            {saving ? "Processing..." : "Commit Transaction"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
