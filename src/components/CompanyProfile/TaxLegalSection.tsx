import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CompanyProfileData } from "./CompanyProfilePage"

type Props = {
  data: CompanyProfileData
  onFieldChange: (field: keyof CompanyProfileData, value: string) => void
  isEditing: boolean
}

export function TaxLegalSection({ data, onFieldChange, isEditing }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax & Legal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bin">BIN / VAT</Label>
            <Input
              id="bin"
              value={data.bin}
              onChange={(e) => onFieldChange("bin", e.target.value)}
              placeholder="BIN or VAT number"
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vatTin">TIN</Label>
            <Input
              id="vatTin"
              value={data.vatTin}
              onChange={(e) => onFieldChange("vatTin", e.target.value)}
              placeholder="TIN (optional)"
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tradeLicense">Trade License No</Label>
          <Input
            id="tradeLicense"
            value={data.tradeLicense}
            onChange={(e) => onFieldChange("tradeLicense", e.target.value)}
            placeholder="Trade license number"
            readOnly={!isEditing}
          />
        </div>
      </CardContent>
    </Card>
  )
}
