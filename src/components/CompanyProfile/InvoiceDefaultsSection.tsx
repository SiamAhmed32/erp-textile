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
  currencyOptions: Option[]
  isEditing: boolean
}

export function InvoiceDefaultsSection({ data, onFieldChange, currencyOptions, isEditing }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Defaults</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <SelectBox
              label="Currency"
              name="currency"
              value={data.currency}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                onFieldChange("currency", e.target.value)
              }
              options={currencyOptions}
              placeholder="Select currency"
              required
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
            <Input
              id="invoicePrefix"
              value={data.invoicePrefix}
              onChange={(e) => onFieldChange("invoicePrefix", e.target.value)}
              placeholder="PI"
              readOnly={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceStartNumber">Start Number</Label>
            <Input
              id="invoiceStartNumber"
              value={data.invoiceStartNumber}
              onChange={(e) => onFieldChange("invoiceStartNumber", e.target.value)}
              placeholder="001"
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultTerms">Default Terms</Label>
          <FormTextarea
            value={data.defaultTerms}
            onChange={(e) => onFieldChange("defaultTerms", e.target.value)}
            placeholder="Add standard payment, delivery, and negotiation terms"
            rows={5}
            readOnly={!isEditing}
          />
        </div>
      </CardContent>
    </Card>
  )
}
