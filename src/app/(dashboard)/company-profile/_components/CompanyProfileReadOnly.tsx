import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyProfile } from "./types";

const Field = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value || "-"}</p>
    </div>
);

type Props = {
    profile: CompanyProfile;
};

const CompanyProfileReadOnly = ({ profile }: Props) => {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    <Field label="Company Name" value={profile.name} />
                    <Field label="Company Type" value={profile.companyType} />
                    <Field label="Status" value={profile.status} />
                    <Field label="Address" value={profile.address} />
                    <Field label="City" value={profile.city} />
                    <Field label="Postal Code" value={profile.postalCode} />
                    <Field label="Country" value={profile.country} />
                    <Field label="Website" value={profile.website} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <Field label="Email" value={profile.email} />
                    <Field label="Phone" value={profile.phone} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Banking Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <Field label="Bank Name" value={profile.bankName} />
                    <Field label="Branch Name" value={profile.branchName} />
                    <Field label="Account Number" value={profile.bankAccountNumber} />
                    <Field label="SWIFT Code" value={profile.swiftCode} />
                    <Field label="Routing Number" value={profile.routingNumber} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tax & Legal</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <Field label="Tax ID" value={profile.taxId} />
                    <Field label="Registration Number" value={profile.registrationNumber} />
                    <Field label="Trade License Number" value={profile.tradeLicenseNumber} />
                    <Field label="Trade License Expiry" value={profile.tradeLicenseExpiryDate} />
                </CardContent>
            </Card>
        </div>
    );
};

export default CompanyProfileReadOnly;
