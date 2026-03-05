"use client";

import React, { useState, useEffect } from "react";
import { CustomModal, InputField } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllQuery, usePostMutation } from "@/store/services/commonApi";
import { notify } from "@/lib/notifications";
import { cn } from "@/lib/utils";

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
  const shouldFetchModalData = open;
  const shouldFetchUsers = open && !defaultEmployeeId;

  // Fetch users for employee (staff) selection
  const { data: usersResponse } = useGetAllQuery(
    {
      path: "users",
      limit: 100,
    },
    { skip: !shouldFetchUsers },
  );

  // Fetch accounts for cash/expense selection
  const { data: accountsResponse } = useGetAllQuery(
    {
      path: "accounting/accountHeads",
      limit: 1000,
    },
    { skip: !shouldFetchModalData },
  );

  // Fetch companies
  const { data: companiesResponse } = useGetAllQuery(
    {
      path: "company-profiles",
      limit: 100,
    },
    { skip: !shouldFetchModalData },
  );

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
    const namedAdvanceAccounts = accounts
      .filter((a: any) => a.name?.toLowerCase().includes("advance"))
      .map((a: any) => ({ name: a.name, _id: a.id }));

    if (namedAdvanceAccounts.length > 0) return namedAdvanceAccounts;

    return accounts
      .filter(
        (a: any) =>
          a.type === "ASSET" &&
          !a.name?.toLowerCase().includes("cash") &&
          !a.name?.toLowerCase().includes("bank"),
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof typeof initialFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const transactionMeta = React.useMemo(() => {
    if (formData.type === "SETTLE") {
      return {
        cashLabel: "Debit - Return To (Cash/Bank)",
        counterLabel: "Credit - Advance Account",
        cashSide: "DEBIT",
        counterSide: "CREDIT",
        counterKind: "ADVANCE",
      } as const;
    }

    if (formData.type === "EXPENSE") {
      return {
        cashLabel: "Credit - Paid From (Cash/Bank)",
        counterLabel: "Debit - Expense Category",
        cashSide: "CREDIT",
        counterSide: "DEBIT",
        counterKind: "EXPENSE",
      } as const;
    }

    return {
      cashLabel: "Credit - Paid From (Cash/Bank)",
      counterLabel: "Debit - Advance Account",
      cashSide: "CREDIT",
      counterSide: "DEBIT",
      counterKind: "ADVANCE",
    } as const;
  }, [formData.type]);

  const isCounterExpense = transactionMeta.counterKind === "EXPENSE";
  const counterAccountValue = isCounterExpense
    ? formData.expenseAccountId
    : formData.advanceAccountId;
  const counterAccountOptions = isCounterExpense
    ? expenseAccounts
    : advanceAccounts;

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
    if (formData.type === "ISSUE" && !formData.advanceAccountId) {
      return notify.error("Please select an Advance account");
    }
    if (
      formData.type === "EXPENSE" &&
      (!formData.cashAccountId || !formData.expenseAccountId)
    ) {
      return notify.error("Please select both Cash and Expense accounts");
    }
    if (
      formData.type === "SETTLE" &&
      (!formData.cashAccountId || !formData.advanceAccountId)
    ) {
      return notify.error("Please select both Cash and Advance accounts for settlement");
    }

    setSaving(true);
    try {
      // Clean up empty optional fields
      const submissionData: any = { ...formData };
      if (!submissionData.expenseAccountId) delete submissionData.expenseAccountId;
      if (!submissionData.advanceAccountId) delete submissionData.advanceAccountId;
      if (submissionData.remarks) {
        submissionData.remarks = String(submissionData.remarks)
          .replace(/\s*\[MOI_MAP:[^\]]*\]\s*/g, " ")
          .trim();
      }
      if (!submissionData.remarks) delete submissionData.remarks;

      if (submissionData.type === "EXPENSE") {
        delete submissionData.advanceAccountId;
      } else {
        delete submissionData.expenseAccountId;
      }

      const counterAccountId = isCounterExpense
        ? submissionData.expenseAccountId
        : submissionData.advanceAccountId;

      const lines = [
        {
          accountHeadId: submissionData.cashAccountId,
          type: transactionMeta.cashSide,
          role: "cash",
        },
        {
          accountHeadId: counterAccountId,
          type: transactionMeta.counterSide,
          role: "counter",
          kind: transactionMeta.counterKind,
        },
      ];

      await postEntry({
        path: "moi-cash-books",
        body: {
          ...submissionData,
          amount: parseFloat(formData.amount),
          status: "APPROVED",
          lines,
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
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium text-slate-700">
              Transaction Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                handleSelectChange("type", value as "ISSUE" | "SETTLE" | "EXPENSE")
              }
            >
              <SelectTrigger className="h-11 border-slate-200 bg-white font-medium">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl border-slate-200">
                {typeOptions.map((opt) => (
                  <SelectItem key={opt._id} value={opt._id} className="text-sm">
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium text-slate-700">
              Company <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.companyProfileId}
              onValueChange={(value) =>
                handleSelectChange("companyProfileId", value)
              }
            >
              <SelectTrigger className="h-11 border-slate-200 bg-white font-medium">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl border-slate-200">
                {companyOptions.map((opt) => (
                  <SelectItem key={opt._id} value={opt._id} className="text-sm">
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium text-slate-700">
              Staff / User <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.employeeId}
              onValueChange={(value) => handleSelectChange("employeeId", value)}
            >
              <SelectTrigger className="h-11 border-slate-200 bg-white font-medium">
                <SelectValue placeholder="Search staff member..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl border-slate-200 max-h-72">
                {userOptions.map((opt) => (
                  <SelectItem key={opt._id} value={opt._id} className="text-sm">
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-slate-700">
                  {transactionMeta.cashLabel} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.cashAccountId}
                  onValueChange={(value) =>
                    handleSelectChange("cashAccountId", value)
                  }
                >
                  <SelectTrigger className="h-11 border-slate-200 bg-white font-medium">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-xl border-slate-200 max-h-72">
                    {cashAccounts.map((opt: any) => (
                      <SelectItem
                        key={opt._id}
                        value={opt._id}
                        className="text-sm"
                      >
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

          {(formData.type === "EXPENSE" || formData.type === "SETTLE" || formData.type === "ISSUE") && (
            <div className="space-y-1.5">
              <Label className="text-[13px] font-medium text-slate-700">
                {transactionMeta.counterLabel} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={counterAccountValue}
                onValueChange={(value) =>
                  handleSelectChange(
                    isCounterExpense ? "expenseAccountId" : "advanceAccountId",
                    value,
                  )
                }
              >
                <SelectTrigger
                  className={cn("h-11 border-slate-200 bg-white font-medium")}
                >
                  <SelectValue
                    placeholder={
                      isCounterExpense
                        ? "Select expense"
                        : "Select advance account"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl border-slate-200 max-h-72">
                  {counterAccountOptions.map((opt: any) => (
                    <SelectItem key={opt._id} value={opt._id} className="text-sm">
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
