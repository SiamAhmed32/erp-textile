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
import { useGetByIdQuery, usePatchMutation } from "@/store/services/commonApi";
import {
  CompanyProfile,
  CompanyProfileApiItem,
  CompanyProfileFormData,
} from "./types";
import CompanyProfileForm from "./CompanyProfileForm";
import {
  isValidId,
  normalizeProfile,
  toApiFormData,
  toFormData,
} from "./helpers";
import { companyProfileSchema, toFieldErrors } from "./validation";
import { notify } from "@/lib/notifications";

type Props = {
  id: string;
};

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
  companyType: "",
  postalCode: "",
  taxId: "",
  registrationNumber: "",
  tradeLicenseNumber: "",
  tradeLicenseExpiryDate: "",
  status: "",
  bankName: "",
  bankAccountNumber: "",
  branchName: "",
  swiftCode: "",
  routingNumber: "",
};

const CompanyProfileEdit = ({ id }: Props) => {
  const router = useRouter();
  const [profile, setProfile] = React.useState<CompanyProfile | null>(null);
  const [draft, setDraft] = React.useState<CompanyProfileFormData>(emptyForm);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof CompanyProfileFormData, string>>
  >({});
  const [patchItem] = usePatchMutation();

  const isInvalidId = !isValidId(id);
  const {
    data: profilePayload,
    isFetching: loading,
    error: apiError,
  } = useGetByIdQuery({ path: "company-profiles", id }, { skip: isInvalidId });

  React.useEffect(() => {
    if (isInvalidId) {
      notify.error("Invalid company ID.");
      return;
    }
    const item = (profilePayload as any)?.data as
      | CompanyProfileApiItem
      | undefined;
    if (!item) return;
    const normalized = normalizeProfile(item);
    setProfile(normalized);
    setDraft(toFormData(normalized));
    setErrors({});
  }, [profilePayload, isInvalidId]);

  React.useEffect(() => {
    const parsed = apiError as any;
    if (!parsed) return;
    const message = parsed?.error || "Failed to load company profile";
    notify.error(message);
  }, [apiError]);

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
    if (!isValidId(draft.id)) {
      notify.error("Invalid company ID.");
      return;
    }

    setSaving(true);
    try {
      await patchItem({
        path: `company-profiles/${draft.id}`,
        body: toApiFormData(draft),
        invalidate: ["company-profiles"],
      }).unwrap();
      notify.success("Company profile updated successfully");
      router.push(`/company-profile/${draft.id}`);
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Failed to save company profile";
      notify.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="pb-10 pt-6">
      <Flex className="flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/company-profile/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <PrimaryHeading>
            {profile?.name ? `Edit ${profile.name}` : "Edit Company"}
          </PrimaryHeading>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/company-profile/${id}`}>Cancel</Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Flex>

      <div className="mt-4" />
      {loading && (
        <PrimaryText className="text-sm text-muted-foreground">
          Loading company details...
        </PrimaryText>
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

export default CompanyProfileEdit;
