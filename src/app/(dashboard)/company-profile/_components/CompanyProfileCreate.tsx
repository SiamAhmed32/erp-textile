"use client";

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
import { usePostMutation } from "@/store/services/commonApi";
import { CompanyProfileApiItem, CompanyProfileFormData } from "./types";
import CompanyProfileForm from "./CompanyProfileForm";
import { normalizeProfile, toApiFormData } from "./helpers";
import { companyProfileSchema, toFieldErrors } from "./validation";
import { notify } from "@/lib/notifications";
import { useFormPersistence } from "@/hooks/useFormPersistence";

const emptyForm: CompanyProfileFormData = {
  id: "",
  name: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  logoUrl: "",
  logoFile: null,
  city: "",
  country: "",
  companyType: "PARENT",
  postalCode: "",
  taxId: "",
  registrationNumber: "",
  tradeLicenseNumber: "",
  tradeLicenseExpiryDate: "",
  status: "active",
  bankName: "",
  bankAccountNumber: "",
  branchName: "",
  swiftCode: "",
  routingNumber: "",
};

const CompanyProfileCreate = () => {
  const router = useRouter();
  const {
    draft,
    setDraft,
    hasStoredDraft,
    restoreDraft,
    discardDraft,
    clearDraft,
    setHasInteracted,
  } = useFormPersistence<CompanyProfileFormData>({
    key: "company_create",
    defaultValue: emptyForm,
    onRestore: (data) => {
      // If there's a stored logoUrl (Base64), we might need to handle it
      // But for now, we'll just restore the text data.
      notify.success("Draft restored successfully");
    },
  });

  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof CompanyProfileFormData, string>>
  >({});
  const [postItem] = usePostMutation();

  const isDirty = React.useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(emptyForm);
  }, [draft]);

  // Progress Calculation
  const progressData = React.useMemo(() => {
    const fieldsToTrack = Object.keys(emptyForm).filter(
      (key) => !["id", "logoUrl", "logoFile"].includes(key),
    );

    const filled = fieldsToTrack.filter((key) => {
      const val = draft[key as keyof CompanyProfileFormData];
      if (key === "companyType" && val === "PARENT") return false;
      if (key === "status" && val === "active") return false;

      return val !== "" && val !== null && val !== undefined;
    }).length;

    const interactiveTotal = fieldsToTrack.length - 2;

    return {
      percentage: Math.min(100, Math.round((filled / interactiveTotal) * 100)),
      count: filled,
      total: interactiveTotal,
    };
  }, [draft]);

  const handleChange = (
    field: keyof CompanyProfileFormData,
    value: string | File | null,
  ) => {
    if (field === "logoFile" && value instanceof File) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(value.type)) {
        setErrors((prev) => ({
          ...prev,
          logoUrl: "Only PNG, JPG, JPEG, or WEBP images are allowed.",
        }));
        return;
      }

      // Convert small images to Base64 for draft persistence
      if (value.size < 1024 * 1024) {
        // Under 1MB
        const reader = new FileReader();
        reader.onloadend = () => {
          setDraft((prev) => ({
            ...prev,
            logoFile: value,
            logoUrl: reader.result as string,
          }));
        };
        reader.readAsDataURL(value);
      } else {
        setDraft((prev) => ({ ...prev, logoFile: value, logoUrl: "" }));
      }
    } else {
      setDraft((prev) => ({ ...prev, [field]: value as any }));
    }
    setHasInteracted(true);
    setErrors((prev) => ({ ...prev, [field]: undefined, logoUrl: undefined }));
  };

  const handleSave = async () => {
    const schemaResult = companyProfileSchema.safeParse(draft);
    const nextErrors: Partial<Record<keyof CompanyProfileFormData, string>> =
      schemaResult.success
        ? {}
        : (toFieldErrors(schemaResult.error.issues) as Partial<
            Record<keyof CompanyProfileFormData, string>
          >);

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const payload = (await postItem({
        path: "company-profiles",
        body: toApiFormData(draft),
        formData: true,
        invalidate: ["company-profiles"],
      }).unwrap()) as any;

      clearDraft();

      const item = (payload?.data || payload) as CompanyProfileApiItem;
      const normalized = item ? normalizeProfile(item) : null;
      if (normalized?.id) {
        notify.success("Company profile created successfully");
        router.push(`/company-profile/${normalized.id}`);
      } else {
        notify.success("Company profile created successfully");
        router.push(`/company-profile`);
      }
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.data?.error?.message ||
        "Could not create the company profile. Please try again.";
      notify.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="pb-10 pt-6">
      <NavigationGuard isDirty={isDirty} />

      <RecoveryModal
        isOpen={hasStoredDraft}
        onRestore={restoreDraft}
        onDiscard={discardDraft}
      />

      <FormHeader
        title="Create New Company"
        backHref="/company-profile"
        breadcrumbItems={[
          { label: "Company Profiles", href: "/company-profile" },
          { label: "Add New" },
        ]}
        progress={progressData}
      />

      <CompanyProfileForm
        data={draft}
        onChange={handleChange}
        isEditing
        errors={errors}
      />

      <FormFooter
        cancelHref="/company-profile"
        onSave={handleSave}
        saving={saving}
        saveLabel="Create New Company Profile"
        trustText="Draft data is stored securely. All inputs are encrypted."
      />
    </Container>
  );
};

export default CompanyProfileCreate;
