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

export function BankingSection({ data, onFieldChange, isEditing }: Props) {
  return (
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
              onChange={(e) => onFieldChange("bankName", e.target.value)}
              placeholder="Bank name"
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankBranch">Branch</Label>
            <Input
              id="bankBranch"
              value={data.bankBranch}
              onChange={(e) => onFieldChange("bankBranch", e.target.value)}
              placeholder="Branch name"
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              value={data.accountName}
              onChange={(e) => onFieldChange("accountName", e.target.value)}
              placeholder="Account name"
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={data.accountNumber}
              onChange={(e) => onFieldChange("accountNumber", e.target.value)}
              placeholder="Account number"
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="swiftCode">SWIFT Code</Label>
            <Input
              id="swiftCode"
              value={data.swiftCode}
              onChange={(e) => onFieldChange("swiftCode", e.target.value)}
              placeholder="SWIFT"
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              value={data.iban}
              onChange={(e) => onFieldChange("iban", e.target.value)}
              placeholder="IBAN (optional)"
              readOnly={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
