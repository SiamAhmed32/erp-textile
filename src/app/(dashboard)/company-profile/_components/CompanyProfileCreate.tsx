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
import { extractItem, getApiBaseUrl } from "@/lib/api";
import { CompanyProfileApiItem, CompanyProfileFormData } from "./types";
import CompanyProfileForm from "./CompanyProfileForm";
import { normalizeProfile, toApiFormData } from "./helpers";
import { companyProfileSchema, toFieldErrors } from "./validation";

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
  const [error, setError] = React.useState("");
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof CompanyProfileFormData, string>>
  >({});

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
    setError("");
    try {
      const response = await fetch(`${getApiBaseUrl()}/company-profiles`, {
        method: "POST",
        body: toApiFormData(draft),
      });
      const text = await response.text();
      if (!response.ok) {
        try {
          const json = JSON.parse(text);
          throw new Error(
            json?.error?.message ||
              json?.message ||
              "Failed to create company profile",
          );
        } catch {
          throw new Error(text || "Failed to create company profile");
        }
      }
      const payload = text ? JSON.parse(text) : {};
      const item = extractItem<CompanyProfileApiItem>(payload);
      const normalized = item ? normalizeProfile(item) : null;
      if (normalized?.id) {
        router.push(`/company-profile/${normalized.id}`);
      } else {
        router.push(`/company-profile`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create company profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="pb-10 pt-6">
      <Flex className="flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Link
            href="/company-profile"
            className="inline-flex items-center text-sm text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Company Profiles
          </Link>
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

      {error && (
        <PrimaryText className="text-sm text-destructive">{error}</PrimaryText>
      )}

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
