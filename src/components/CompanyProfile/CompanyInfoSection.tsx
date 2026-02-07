import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectBox } from "@/components/reusables"
import FormTextarea from "@/components/reusables/FormTextarea"
import { CompanyProfileData } from "./CompanyProfilePage"

type Option = { _id: string; name: string }

type Props = {
  data: CompanyProfileData
  onFieldChange: (field: keyof CompanyProfileData, value: string) => void
  countryOptions: Option[]
  isEditing: boolean
}

export function CompanyInfoSection({ data, onFieldChange, countryOptions, isEditing }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={data.companyName}
              onChange={(e) => onFieldChange("companyName", e.target.value)}
              placeholder="Company name"
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              value={data.logoUrl}
              onChange={(e) => onFieldChange("logoUrl", e.target.value)}
              placeholder="https://..."
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <FormTextarea
            value={data.address}
            onChange={(e) => onFieldChange("address", e.target.value)}
            placeholder="Street, city, postal code"
            rows={4}
            readOnly={!isEditing}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <SelectBox
              label="Country"
              name="country"
              value={data.country}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                onFieldChange("country", e.target.value)
              }
              options={countryOptions}
              placeholder="Select country"
              required
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              placeholder="name@company.com"
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              placeholder="+880..."
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={data.website}
              onChange={(e) => onFieldChange("website", e.target.value)}
              placeholder="www.company.com"
              readOnly={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
