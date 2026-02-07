import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SelectBox } from "@/components/reusables"
import { Label } from "@/components/ui/label"
import { CompanyProfileData } from "./CompanyProfilePage"

type Option = { _id: string; name: string }

type Props = {
  data: CompanyProfileData
  onFieldChange: (field: keyof CompanyProfileData, value: string) => void
  countryOptions: Option[]
  incotermOptions: Option[]
  isEditing: boolean
}

export function ExportDefaultsSection({
  data,
  onFieldChange,
  countryOptions,
  incotermOptions,
  isEditing,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Defaults</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <SelectBox
              label="Country of Origin"
              name="originCountry"
              value={data.originCountry}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                onFieldChange("originCountry", e.target.value)
              }
              options={countryOptions}
              placeholder="Select country"
              required
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hsCode">HS Code</Label>
            <Input
              id="hsCode"
              value={data.hsCode}
              onChange={(e) => onFieldChange("hsCode", e.target.value)}
              placeholder="HS code"
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div>
          <SelectBox
            label="Incoterms"
            name="incoterms"
            value={data.incoterms}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onFieldChange("incoterms", e.target.value)
            }
            options={incotermOptions}
            placeholder="Select incoterms"
            disabled={!isEditing}
          />
        </div>
      </CardContent>
    </Card>
  )
}
