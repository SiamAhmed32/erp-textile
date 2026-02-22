import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyProfile } from "./types";
import { getInitials } from "./helpers";
import { cn } from "@/lib/utils";

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="space-y-1">
    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {label}
    </p>
    <p className="text-sm font-semibold text-foreground">{value || "-"}</p>
  </div>
);

type Props = {
  profile: CompanyProfile;
};

const CompanyProfileReadOnly = ({ profile }: Props) => {
  return (
    <div className="space-y-6">
      {/* Premium Logo Header Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border bg-muted/5 shadow-sm transition-all hover:bg-muted/10">
        <div className="shrink-0">
          {profile.logoUrl ? (
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl border-4 border-white shadow-lg overflow-hidden bg-white ring-1 ring-border/50">
              <Image
                src={profile.logoUrl}
                alt={profile.name}
                fill
                className="object-contain p-2"
                priority
              />
            </div>
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center bg-background text-muted-foreground font-bold text-3xl uppercase tracking-widest shadow-inner">
              {getInitials(profile.name)}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center sm:items-start space-y-3 grow min-w-0">
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight line-clamp-1">
              {profile.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-primary/10 text-primary uppercase border border-primary/20">
                {profile.companyType}
              </span>
              <span
                className={cn(
                  "inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border",
                  profile.status === "active"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-600 border-slate-200",
                )}
              >
                {profile.status}
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground text-center sm:text-left max-w-2xl font-medium opacity-80 leading-relaxed">
            {profile.address || "No official address listed for this company."}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 pt-1 border-t border-border/10 w-full">
            {profile.city && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground/70 tracking-tight">
                  CITY
                </span>
                <span className="font-medium text-foreground/90">
                  {profile.city}
                </span>
              </div>
            )}
            {profile.country && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground/70 tracking-tight">
                  COUNTRY
                </span>
                <span className="font-medium text-foreground/90">
                  {profile.country}
                </span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground/70 tracking-tight">
                  WEBSITE
                </span>
                <Link
                  href={
                    profile.website.startsWith("http")
                      ? profile.website
                      : `https://${profile.website}`
                  }
                  target="_blank"
                  className="text-secondary font-medium hover:underline flex items-center gap-1"
                >
                  {profile.website.replace(/^https?:\/\//, "")}
                </Link>
              </div>
            )}
            {profile.updatedAt && (
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-muted-foreground/60 ml-auto">
                Last sync: {new Date(profile.updatedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-4">
          <Field label="Postal Code" value={profile.postalCode} />
          <Field label="Country" value={profile.country} />
          <Field label="Website" value={profile.website} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" value={profile.email} />
            <Field label="Phone" value={profile.phone} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax & Legal</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Tax ID" value={profile.taxId} />
            <Field
              label="Registration Number"
              value={profile.registrationNumber}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Banking Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <Field label="Bank Name" value={profile.bankName} />
          <Field label="Branch Name" value={profile.branchName} />
          <Field label="Account Number" value={profile.bankAccountNumber} />
          <Field label="SWIFT Code" value={profile.swiftCode} />
          <Field label="Routing Number" value={profile.routingNumber} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trade Compliance</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <Field
            label="Trade License Number"
            value={profile.tradeLicenseNumber}
          />
          <Field
            label="Trade License Expiry"
            value={profile.tradeLicenseExpiryDate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyProfileReadOnly;
