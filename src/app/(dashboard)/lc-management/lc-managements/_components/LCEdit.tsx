"use client";
import { notify } from "@/lib/notifications";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Container,
  FormHeader,
  RecoveryModal,
  NavigationGuard,
} from "@/components/reusables";
import { Button } from "@/components/ui/button";
import {
  useGetByIdQuery,
  usePatchMutation,
  useGetAllQuery,
} from "@/store/services/commonApi";
import { LCFormData, lcSchema, toFieldErrors } from "./validation";
import LCForm from "./LCForm";
import { LCManagement } from "./types";
import { Invoice } from "@/app/(dashboard)/invoice-management/invoices/_components/types";
import { useFormPersistence } from "@/hooks/useFormPersistence";

type Props = {
  id: string;
};

const LCEdit = ({ id }: Props) => {
  const router = useRouter();
  const [baseFormData, setBaseFormData] = React.useState<LCFormData | null>(
    null,
  );
  const {
    draft,
    setDraft,
    hasStoredDraft,
    restoreDraft,
    discardDraft,
    clearDraft,
    setHasInteracted,
  } = useFormPersistence<LCFormData | null>({
    key: `lc_edit_${id}`,
    defaultValue: null,
  });

  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof LCFormData, string>>
  >({});

  const [patchItem] = usePatchMutation();

  const isDirty = React.useMemo(() => {
    if (!draft || !baseFormData) return false;
    return JSON.stringify(draft) !== JSON.stringify(baseFormData);
  }, [draft, baseFormData]);

  const { data: lcPayload, isFetching: loadingLC } = useGetByIdQuery({
    path: "lc-managements",
    id,
  });

  const { data: invoicesPayload } = useGetAllQuery({
    path: "invoices",
    page: 1,
    limit: 100,
  });

  const lc = (lcPayload as any)?.data as LCManagement | undefined;
  const invoices = ((invoicesPayload as any)?.data || []) as Invoice[];

  React.useEffect(() => {
    if (lc) {
      const formData = {
        bblcNumber: lc.bblcNumber,
        dateOfOpening: lc.dateOfOpening,
        notifyParty: lc.notifyParty || "",
        lcIssueBankName: lc.lcIssueBankName,
        lcIssueBankBranch: lc.lcIssueBankBranch,
        destination: lc.destination || "",
        exportLcNo: lc.exportLcNo || "",
        exportLcDate: lc.exportLcDate || "",
        binNo: lc.binNo || "",
        hsCodeNo: lc.hsCodeNo || "",
        remarks: lc.remarks || "",
        carrier: lc.carrier || "",
        salesTerm: lc.salesTerm || "",
        issueDate: lc.issueDate,
        expiryDate: lc.expiryDate,
        amount: Number(lc.amount),
        challanNo: lc.challanNo || "",
        transportMode: lc.transportMode || "",
        vehicleNo: lc.vehicleNo || "",
        driverName: lc.driverName || "",
        contactNo: lc.contactNo || "",
        invoiceId: lc.invoiceId,
        billOfExchangeRemarkClient: lc.billOfExchangeRemarkClient || "",
        billOfExchangeDateClient: lc.billOfExchangeDateClient || "",
        billOfExchangeLocationClient: lc.billOfExchangeLocationClient || "",
        billOfExchangeRemarkBank: lc.billOfExchangeRemarkBank || "",
        billOfExchangeDateBank: lc.billOfExchangeDateBank || "",
        billOfExchangeLocationBank: lc.billOfExchangeLocationBank || "",
      };
      setBaseFormData(formData);

      if (draft === null) {
        setDraft(formData);
      }
    }
  }, [lc, draft, setDraft]);

  const handleChange = (field: keyof LCFormData, value: any) => {
    if (draft) {
      setDraft((prev: any) => ({ ...prev, [field]: value }));
      setHasInteracted(true);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!draft) return;

    const schemaResult = lcSchema.safeParse(draft);
    if (!schemaResult.success) {
      const nextErrors = toFieldErrors(schemaResult.error.issues) as any;
      setErrors(nextErrors);
      notify.error(
        "Some required fields are missing. Please review the highlighted fields.",
      );
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
        exportLcDate: draft.exportLcDate
          ? new Date(draft.exportLcDate).toISOString()
          : undefined,
        billOfExchangeDateClient: draft.billOfExchangeDateClient
          ? new Date(draft.billOfExchangeDateClient).toISOString()
          : undefined,
        billOfExchangeDateBank: draft.billOfExchangeDateBank
          ? new Date(draft.billOfExchangeDateBank).toISOString()
          : undefined,
        billOfExchangeRemarkClient: draft.billOfExchangeRemarkClient || "",
        billOfExchangeRemarkBank: draft.billOfExchangeRemarkBank || "",
      };

      await patchItem({
        path: `lc-managements/${id}`,
        body: payload,
        invalidate: ["lc-managements"],
      }).unwrap();

      clearDraft();

      notify.success("BBLC Updated Successfully");
      router.push(`/lc-management/lc-managements/${id}`);
    } catch (err: any) {
      const msg =
        err?.data?.message || "Could not update the BBLC. Please try again.";
      console.error("Update LC Error:", err);
      notify.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Dynamic Progress Calculation for LC
  const progressData = React.useMemo(() => {
    if (!draft) return { percentage: 0, count: 0, total: 0 };
    const fieldsToTrack: (keyof LCFormData)[] = [
      "bblcNumber",
      "dateOfOpening",
      "notifyParty",
      "lcIssueBankName",
      "lcIssueBankBranch",
      "destination",
      "exportLcNo",
      "exportLcDate",
      "binNo",
      "hsCodeNo",
      "remarks",
      "carrier",
      "salesTerm",
      "issueDate",
      "expiryDate",
      "amount",
      "challanNo",
      "transportMode",
      "vehicleNo",
      "driverName",
      "contactNo",
      "invoiceId",
    ];

    const total = fieldsToTrack.length;
    const filled = fieldsToTrack.filter((key) => {
      const val = draft[key];
      if (typeof val === "string") return val.trim().length > 0;
      if (typeof val === "number") return val > 0;
      return !!val;
    }).length;

    return {
      percentage: Math.round((filled / total) * 100),
      count: filled,
      total,
    };
  }, [draft]);

  if (loadingLC || !draft) {
    return (
      <Container className="pt-10">
        <p className="animate-pulse text-muted-foreground">
          Loading LC details for editing...
        </p>
      </Container>
    );
  }

  return (
    <Container className="pb-10 pt-6">
      <NavigationGuard isDirty={isDirty} />

      <RecoveryModal
        isOpen={hasStoredDraft}
        onRestore={restoreDraft}
        onDiscard={discardDraft}
        title="Unsaved Changes Found"
        description="We found an unsaved draft of your edits for this LC. Would you like to restore them?"
      />

      <FormHeader
        title={`Edit BBLC: ${lc?.bblcNumber || ""}`}
        backHref={`/lc-management/lc-managements/${id}`}
        breadcrumbItems={[
          { label: "LC Management", href: "/lc-management/lc-managements" },
          { label: "BBLC List", href: "/lc-management/lc-managements" },
          {
            label: lc?.bblcNumber || "LC",
            href: `/lc-management/lc-managements/${id}`,
          },
          { label: "Edit" },
        ]}
        progress={progressData}
      />

      <div className="mt-8">
        <LCForm
          data={draft}
          invoices={invoices}
          onChange={handleChange}
          errors={errors}
          isEdit={true}
          onSave={handleSave}
          saving={saving}
          cancelHref={`/lc-management/lc-managements/${id}`}
        />
      </div>
    </Container>
  );
};

export default LCEdit;
