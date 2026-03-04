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
  advanceAccountId: "",
  expenseAccountId: "",
  companyProfileId: "",
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
    path: "accounting/accountHeads",
    limit: 1000,
  });

  // Fetch companies
  const { data: companiesResponse } = useGetAllQuery({
    path: "company-profiles",
    limit: 100,
  });

  const users = React.useMemo(() => (usersResponse as any)?.data || [], [usersResponse]);
  const accounts = React.useMemo(() => (accountsResponse as any)?.data || [], [accountsResponse]);
  const companies = React.useMemo(() => (companiesResponse as any)?.data || [], [companiesResponse]);

  // Filtering accounts for selection
  const cashAccounts = React.useMemo(() => {
    return accounts
      .filter(
        (a: any) =>
          a.type === "ASSET" &&
          (a.name.toLowerCase().includes("cash") ||
            a.name.toLowerCase().includes("bank")),
      )
      .map((a: any) => ({ name: a.name, _id: a.id }))
      .sort((a: any, b: any) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        const priority = ["main cash", "cash in hand", "petty cash", "cash"];
        for (const p of priority) {
          if (nameA.includes(p) && !nameB.includes(p)) return -1;
          if (!nameA.includes(p) && nameB.includes(p)) return 1;
        }
        return 0;
      });
  }, [accounts]);

  const expenseAccounts = React.useMemo(() => {
    return accounts
      .filter((a: any) => a.type === "EXPENSE")
      .map((a: any) => ({ name: a.name, _id: a.id }));
  }, [accounts]);

  const advanceAccounts = React.useMemo(() => {
    return accounts
      .filter(
        (a: any) =>
          a.type === "ASSET" &&
          (a.name.toLowerCase().includes("advance") ||
            a.name.toLowerCase().includes("staff") ||
            a.name.toLowerCase().includes("employee")),
      )
      .map((a: any) => ({ name: a.name, _id: a.id }));
  }, [accounts]);

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

  // Auto-select first cash account
  useEffect(() => {
    if (cashAccounts.length > 0 && !formData.cashAccountId) {
      setFormData((prev) => ({ ...prev, cashAccountId: cashAccounts[0]._id }));
    }
  }, [cashAccounts, formData.cashAccountId]);

  // Auto-select first company
  useEffect(() => {
    if (companies.length > 0 && !formData.companyProfileId) {
      setFormData((prev) => ({ ...prev, companyProfileId: companies[0].id }));
    }
  }, [companies, formData.companyProfileId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.employeeId || !formData.amount || !formData.purpose || !formData.companyProfileId) {
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
      // Clean up empty optional fields
      const submissionData: any = { ...formData };
      if (!submissionData.expenseAccountId) delete submissionData.expenseAccountId;
      if (!submissionData.cashAccountId) delete submissionData.cashAccountId;
      if (!submissionData.advanceAccountId) delete submissionData.advanceAccountId;
      if (!submissionData.remarks) delete submissionData.remarks;

      await postEntry({
        path: "moi-cash-books",
        body: {
          ...submissionData,
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

  const userOptions = React.useMemo(() => {
    return users.map((u: any) => ({
      name: `${u.firstName} ${u.lastName} (${u.designation || "Staff"})`,
      _id: u.id,
    }));
  }, [users]);

  const companyOptions = React.useMemo(() => {
    return companies.map((c: any) => ({
      name: c.name,
      _id: c.id,
    }));
  }, [companies]);

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
          <SelectBox
            label="Company"
            options={companyOptions}
            value={formData.companyProfileId}
            name="companyProfileId"
            onChange={handleInputChange}
            placeholder="Select company"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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

          {(formData.type === "ISSUE" || formData.type === "SETTLE") && (
            <SelectBox
              label="Advance Account"
              options={advanceAccounts}
              value={formData.advanceAccountId}
              name="advanceAccountId"
              onChange={handleInputChange}
              placeholder="Select advance account"
              required
            />
          )}
        </div>

        {(formData.type === "EXPENSE" || formData.type === "SETTLE" || formData.type === "ISSUE") && (
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
