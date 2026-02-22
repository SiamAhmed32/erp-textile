"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container, FormHeader, FormFooter } from "@/components/reusables";
import { usePostMutation } from "@/store/services/commonApi";
import { CompanyProfileApiItem, CompanyProfileFormData } from "./types";
import CompanyProfileForm from "./CompanyProfileForm";
import { normalizeProfile, toApiFormData } from "./helpers";
import { companyProfileSchema, toFieldErrors } from "./validation";
import { notify } from "@/lib/notifications";

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
  const [draft, setDraft] = React.useState<CompanyProfileFormData>(emptyForm);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof CompanyProfileFormData, string>>
  >({});
  const [postItem] = usePostMutation();

  // Progress Calculation
  const progressData = React.useMemo(() => {
    // We track all fields except meta-data
    const fieldsToTrack = Object.keys(emptyForm).filter(
      (key) => !["id", "logoUrl", "logoFile"].includes(key),
    );

    // We define "effective" filled fields by ignoring the two default ones
    // for the sake of the progress bar starting at 0%
    const filled = fieldsToTrack.filter((key) => {
      const val = draft[key as keyof CompanyProfileFormData];
      // Ignore defaults in the count to satisfy the "start at 0%" requirement
      if (key === "companyType" && val === "PARENT") return false;
      if (key === "status" && val === "active") return false;

      return val !== "" && val !== null && val !== undefined;
    }).length;

    // The total fields the user actually NEEDS to interact with
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
    }
    setDraft((prev) => ({ ...prev, [field]: value as any }));
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

    if (draft.logoFile) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(draft.logoFile.type)) {
        nextErrors.logoUrl = "Only PNG, JPG, JPEG, or WEBP images are allowed.";
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const payload = (await postItem({
        path: "company-profiles",
        body: toApiFormData(draft),
        invalidate: ["company-profiles"],
      }).unwrap()) as any;
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
      const message = err?.message || "Failed to Create New Company profile";
      notify.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="pb-10 pt-6">
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
