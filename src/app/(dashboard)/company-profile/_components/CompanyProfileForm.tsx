import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompanyProfileFormData } from "./types";
import { companyTypeOptions, statusOptions } from "./constants";

type Props = {
  data: CompanyProfileFormData;
  onChange: (
    field: keyof CompanyProfileFormData,
    value: string | File | null,
  ) => void;
  isEditing: boolean;
  errors?: Partial<Record<keyof CompanyProfileFormData, string>>;
};

const CompanyProfileForm = ({
  data,
  onChange,
  isEditing,
  errors = {},
}: Props) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!data.logoFile || !(data.logoFile instanceof Blob)) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(data.logoFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [data.logoFile]);

  const handleFileTrigger = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  const displayUrl = preview || data.logoUrl;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label htmlFor="logoFile" className="text-sm font-medium">
              Company Logo
            </Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-5 rounded-lg border border-input bg-muted/20 transition-all">
              {/* Image Preview Area */}
              <div className="shrink-0">
                {displayUrl ? (
                  <div className="relative group w-24 h-24">
                    <Image
                      src={displayUrl}
                      alt="Logo preview"
                      fill
                      className="rounded-lg border-4 border-white shadow-sm object-cover bg-white"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24 w-24 rounded-lg border-2 border-dashed border-input/50 text-muted-foreground bg-muted/30">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              {/* Action Area */}
              <div className="flex flex-col gap-3 min-w-0 grow">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground truncate">
                    {displayUrl
                      ? preview
                        ? "New Logo Selected"
                        : "Current Company Logo"
                      : "No logo uploaded yet"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {data.logoFile
                      ? `File: ${data.logoFile.name}`
                      : "Accepted formats: PNG, JPG, JPEG, or WEBP"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleFileTrigger}
                    disabled={!isEditing}
                    className="cursor-pointer h-9 px-4"
                  >
                    Choose Image
                  </Button>
                  {isEditing && (data.logoFile || data.logoUrl) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-9 px-4 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      onClick={() => onChange("logoFile", null)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              id="logoFile"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={(e) =>
                onChange("logoFile", e.target.files?.[0] ?? null)
              }
              disabled={!isEditing}
            />
            {errors.logoUrl && (
              <p className="text-xs text-destructive">{errors.logoUrl}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Company name"
              readOnly={!isEditing}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={data.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Street, city, postal code"
              rows={3}
              readOnly={!isEditing}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={data.city}
                onChange={(e) => onChange("city", e.target.value)}
                placeholder="City"
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={data.postalCode}
                onChange={(e) => onChange("postalCode", e.target.value)}
                placeholder="Postal code"
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={data.country}
                onChange={(e) => onChange("country", e.target.value)}
                placeholder="Country"
                readOnly={!isEditing}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyType">
                Company Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.companyType}
                onValueChange={(value) => onChange("companyType", value)}
                disabled={!isEditing}
              >
                <SelectTrigger id="companyType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {companyTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.companyType && (
                <p className="text-xs text-destructive">{errors.companyType}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.status}
                onValueChange={(value) => onChange("status", value)}
                disabled={!isEditing}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-xs text-destructive">{errors.status}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={data.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="name@company.com"
                readOnly={!isEditing}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                placeholder="+880..."
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={data.website}
              onChange={(e) => onChange("website", e.target.value)}
              placeholder="https://"
              readOnly={!isEditing}
            />
            {errors.website && (
              <p className="text-xs text-destructive">{errors.website}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={data.bankName}
                onChange={(e) => onChange("bankName", e.target.value)}
                placeholder="Bank name"
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input
                id="branchName"
                value={data.branchName}
                onChange={(e) => onChange("branchName", e.target.value)}
                placeholder="Branch name"
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bankAccountNumber">Account Number</Label>
              <Input
                id="bankAccountNumber"
                value={data.bankAccountNumber}
                onChange={(e) => onChange("bankAccountNumber", e.target.value)}
                placeholder="Account number"
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="swiftCode">SWIFT Code</Label>
              <Input
                id="swiftCode"
                value={data.swiftCode}
                onChange={(e) => onChange("swiftCode", e.target.value)}
                placeholder="SWIFT"
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="routingNumber">Routing Number</Label>
            <Input
              id="routingNumber"
              value={data.routingNumber}
              onChange={(e) => onChange("routingNumber", e.target.value)}
              placeholder="Routing number"
              readOnly={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax & Legal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={data.taxId}
                onChange={(e) => onChange("taxId", e.target.value)}
                placeholder="Tax identification number"
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                value={data.registrationNumber}
                onChange={(e) => onChange("registrationNumber", e.target.value)}
                placeholder="Registration number"
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tradeLicenseNumber">Trade License Number</Label>
              <Input
                id="tradeLicenseNumber"
                value={data.tradeLicenseNumber}
                onChange={(e) => onChange("tradeLicenseNumber", e.target.value)}
                placeholder="Trade license number"
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tradeLicenseExpiryDate">
                Trade License Expiry
              </Label>
              <Input
                id="tradeLicenseExpiryDate"
                type="date"
                value={data.tradeLicenseExpiryDate}
                onChange={(e) =>
                  onChange("tradeLicenseExpiryDate", e.target.value)
                }
                readOnly={!isEditing}
              />
              {errors.tradeLicenseExpiryDate && (
                <p className="text-xs text-destructive">
                  {errors.tradeLicenseExpiryDate}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyProfileForm;
