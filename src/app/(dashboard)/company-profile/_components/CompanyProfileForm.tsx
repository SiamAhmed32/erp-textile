import React from "react";
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

  const handleFileTrigger = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logoFile">Logo</Label>
            <div className="flex flex-col gap-3 rounded-md border border-input bg-muted/30 p-3">
              <div className="flex items-center gap-3">
                {data.logoFile ? (
                  <span className="text-sm text-foreground">
                    Selected: {data.logoFile.name}
                  </span>
                ) : data.logoUrl ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={data.logoUrl}
                      alt="Current logo"
                      className="h-12 w-12 rounded-md border object-cover"
                    />
                    <span className="text-sm text-foreground">
                      Current logo
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No logo uploaded
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFileTrigger}
                  disabled={!isEditing}
                >
                  Choose Image
                </Button>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG, JPEG, or WEBP
                </span>
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
