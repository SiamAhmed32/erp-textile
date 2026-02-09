"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, Flex, PrimaryHeading, PrimaryText } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { apiRequest, extractItem } from "@/lib/api";
import { CompanyProfile, CompanyProfileApiItem, CompanyProfileFormData } from "./types";
import CompanyProfileForm from "./CompanyProfileForm";
import { isValidEmail, isValidId, isValidUrl, normalizeProfile, toApiPayload, toFormData } from "./helpers";

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
    const [loading, setLoading] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState("");
    const [errors, setErrors] = React.useState<Partial<Record<keyof CompanyProfileFormData, string>>>(
        {}
    );

    const fetchProfile = React.useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            if (!isValidId(id)) {
                setError("Invalid company ID.");
                return;
            }
            const payload = await apiRequest(`/company-profiles/${id}`);
            const item = extractItem<CompanyProfileApiItem>(payload);
            if (!item) {
                setError("Company profile not found");
                return;
            }
            const normalized = normalizeProfile(item);
            setProfile(normalized);
            setDraft(toFormData(normalized));
            setErrors({});
        } catch (err: any) {
            setError(err.message || "Failed to load company profile");
        } finally {
            setLoading(false);
        }
    }, [id]);

    React.useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = (field: keyof CompanyProfileFormData, value: string) => {
        setDraft((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleSave = async () => {
        const nextErrors: Partial<Record<keyof CompanyProfileFormData, string>> = {};
        if (!draft.name.trim() || draft.name.trim().length < 2) {
            nextErrors.name = "Name must be at least 2 characters.";
        }
        if (!draft.email.trim() || !isValidEmail(draft.email)) {
            nextErrors.email = "Enter a valid email address.";
        }
        if (!draft.website.trim() || !isValidUrl(draft.website)) {
            nextErrors.website = "Enter a valid website URL (https://...).";
        }
        if (!draft.companyType) {
            nextErrors.companyType = "Select a company type.";
        }
        if (!draft.status) {
            nextErrors.status = "Select a status.";
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;
        if (!isValidId(draft.id)) {
            setError("Invalid company ID.");
            return;
        }

        setSaving(true);
        setError("");
        try {
            await apiRequest(`/company-profiles/${draft.id}`, {
                method: "PATCH",
                body: toApiPayload(draft),
            });
            router.push(`/company-profile/${draft.id}`);
        } catch (err: any) {
            setError(err.message || "Failed to save company profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Container className="pb-10 pt-6">
            <Flex className="flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                    <Link href={`/company-profile/${id}`} className="inline-flex items-center text-sm text-muted-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Company Details
                    </Link>
                    <PrimaryHeading>{profile?.name ? `Edit ${profile.name}` : "Edit Company"}</PrimaryHeading>
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

            {error && <PrimaryText className="text-sm text-destructive">{error}</PrimaryText>}
            {loading && (
                <PrimaryText className="text-sm text-muted-foreground">
                    Loading company details...
                </PrimaryText>
            )}

            <CompanyProfileForm data={draft} onChange={handleChange} isEditing errors={errors} />
        </Container>
    );
};

export default CompanyProfileEdit;
