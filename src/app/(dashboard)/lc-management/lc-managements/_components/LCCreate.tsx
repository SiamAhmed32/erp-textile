"use client";
import { notify } from "@/lib/notifications";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Container,
  FormHeader,
  FormFooter,
  RecoveryModal,
  NavigationGuard,
} from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { useGetAllQuery, usePostMutation } from "@/store/services/commonApi";
import { LCFormData, lcSchema, toFieldErrors } from "./validation";
import LCForm from "./LCForm";
import { Invoice } from "@/app/(dashboard)/invoice-management/invoices/_components/types";
import { useFormPersistence } from "@/hooks/useFormPersistence";

const emptyLC: LCFormData = {
  bblcNumber: "",
  dateOfOpening: "",
  notifyParty: "",
  lcIssueBankName: "",
  lcIssueBankBranch: "",
  destination: "",
  exportLcNo: "",
  exportLcDate: "",
  binNo: "",
  hsCodeNo: "",
  remarks: "",
  carrier: "",
  salesTerm: "",
  issueDate: "",
  expiryDate: "",
  amount: 0,
  challanNo: "",
  transportMode: "",
  vehicleNo: "",
  driverName: "",
  contactNo: "",
  invoiceId: "",
  billOfExchangeRemarkClient: "",
  billOfExchangeDateClient: "",
  billOfExchangeLocationClient: "",
  billOfExchangeRemarkBank: "",
  billOfExchangeDateBank: "",
  billOfExchangeLocationBank: "",
};

const LCCreate = () => {
  const router = useRouter();
  const {
    draft,
    setDraft,
    hasStoredDraft,
    restoreDraft,
    discardDraft,
    clearDraft,
    setHasInteracted,
  } = useFormPersistence<LCFormData>({
    key: "lc_create",
    defaultValue: emptyLC,
  });

  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof LCFormData, string>>
  >({});
  const [postItem] = usePostMutation();

  const isDirty = React.useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(emptyLC);
  }, [draft]);

  const { data: invoicesPayload, error: invoicesError } = useGetAllQuery({
    path: "invoices",
    page: 1,
    limit: 100,
  });

  const invoices = ((invoicesPayload as any)?.data || []) as Invoice[];

  React.useEffect(() => {
    const error = invoicesError as any;
    if (error) {
      const msg = error?.data?.message || "Failed to load invoices";
      console.error("Load Invoices Error:", msg);
      notify.error(msg);
    }
  }, [invoicesError]);

  const handleChange = (field: keyof LCFormData, value: any) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setHasInteracted(true);
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    // Auto-populate data if invoice is selected
    if (field === "invoiceId") {
      const selectedInvoice = invoices.find((inv) => inv.id === value);
      if (selectedInvoice) {
        const order = selectedInvoice.order;
        let amount = 0;
        if (order) {
          const orderItems = Array.isArray(order.orderItems)
            ? order.orderItems
            : [order.orderItems];

          amount = orderItems.reduce((acc, item: any) => {
            const itemAmount =
              item?.fabricItem?.totalAmount ||
              item?.labelItem?.totalAmount ||
              item?.cartonItem?.totalAmount ||
              0;
            return acc + Number(itemAmount);
          }, 0);

          // Update remarks with PI info
          const piDate = new Date(selectedInvoice.date)
            .toLocaleDateString("en-GB")
            .replace(/\//g, "-");
          const remarkText = `We certify that the invoice is true and correct and the goods are of Bangladeshi Origin.\nThe goods herein are confirmed with our Proforma Invoice No: ${selectedInvoice.piNumber} Date-${piDate}`;

          setDraft((prev) => ({
            ...prev,
            amount: Number(amount),
            remarks: remarkText,
          }));
        }
      }
    }
  };

  const handleSave = async () => {
    const schemaResult = lcSchema.safeParse(draft);
    if (!schemaResult.success) {
      const nextErrors = toFieldErrors(schemaResult.error.issues) as any;
      setErrors(nextErrors);
      // Log for debugging
      console.log("Validation Errors:", nextErrors);
      notify.error("Please fill in the required fields");
      return;
    }

    setSaving(true);
    try {
      // Format dates to ISO strings for Prisma
      const payload = {
        ...draft,
        dateOfOpening: new Date(draft.dateOfOpening).toISOString(),
        issueDate: new Date(draft.issueDate).toISOString(),
        expiryDate: new Date(draft.expiryDate).toISOString(),
        exportLcDate: new Date(draft.exportLcDate).toISOString(),
        billOfExchangeDateClient: draft.billOfExchangeDateClient
          ? new Date(draft.billOfExchangeDateClient).toISOString()
          : undefined,
        billOfExchangeDateBank: draft.billOfExchangeDateBank
          ? new Date(draft.billOfExchangeDateBank).toISOString()
          : undefined,
        billOfExchangeRemarkClient: draft.billOfExchangeRemarkClient || "",
        billOfExchangeRemarkBank: draft.billOfExchangeRemarkBank || "",
      };

      const result = await postItem({
        path: "lc-managements",
        body: payload,
        invalidate: ["lc-managements", "orders", "invoices"],
      }).unwrap();

      clearDraft();

      notify.success("BBLC Created Successfully");
      const id = (result as any)?.data?.id || (result as any)?.id;
      router.push(
        id
          ? `/lc-management/lc-managements/${id}`
          : "/lc-management/lc-managements",
      );
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Failed to create LC";
      console.error("Create LC Error:", msg);
      notify.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Basic Progress Calculation for LC
  const progressData = React.useMemo(() => {
    const fieldsToTrack = [
      "bblcNumber",
      "dateOfOpening",
      "notifyParty",
      "lcIssueBankName",
      "invoiceId",
    ];
    const total = fieldsToTrack.length;
    const filled = fieldsToTrack.filter(
      (key) => !!draft[key as keyof LCFormData],
    ).length;
    return {
      percentage: Math.round((filled / total) * 100),
      count: filled,
      total,
    };
  }, [draft]);

  return (
    <Container className="pb-10 pt-6">
      <NavigationGuard isDirty={isDirty} />

      <RecoveryModal
        isOpen={hasStoredDraft}
        onRestore={restoreDraft}
        onDiscard={discardDraft}
      />

      <FormHeader
        title="Create BBLC"
        backHref="/lc-management/lc-managements"
        breadcrumbItems={[
          { label: "LC Management", href: "/lc-management/lc-managements" },
          { label: "BBLC List", href: "/lc-management/lc-managements" },
          { label: "Create" },
        ]}
        progress={progressData}
      />

      <div className="mt-8">
        <LCForm
          data={draft}
          invoices={invoices}
          onChange={handleChange}
          errors={errors}
          onSave={handleSave}
          saving={saving}
        />
      </div>

      <FormFooter
        cancelHref="/lc-management/lc-managements"
        onSave={handleSave}
        saving={saving}
        saveLabel="Create BBLC"
        trustText="Financial records are encrypted and stored according to bank protocols."
      />
    </Container>
  );
};

export default LCCreate;
