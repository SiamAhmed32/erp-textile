"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Container,
  Flex,
  PrimaryHeading,
  PrimaryText,
} from "@/components/reusables";
import { Button } from "@/components/ui/button";
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
      const message = err?.message || "Failed to create company profile";
      notify.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="pb-10 pt-6">
      <Flex className="flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Button variant="outline" asChild>
            <Link href="/company-profile">Back to Company Profiles</Link>
          </Button>
          <PrimaryHeading className="!text-black">Add Company</PrimaryHeading>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/company-profile">Cancel</Link>
          </Button>
          <Button
            className="bg-black text-white hover:bg-black/90"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Company"}
          </Button>
        </div>
      </Flex>

      <div className="mt-4" />

      <CompanyProfileForm
        data={draft}
        onChange={handleChange}
        isEditing
        errors={errors}
      />
    </Container>
  );
};

export default CompanyProfileCreate;
