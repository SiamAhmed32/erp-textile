"use client"

import React from "react"
import { Box, Container, Grid, PrimaryText, SectionGap } from "@/components/reusables"
import { CompanyProfileHeader } from "./CompanyProfileHeader"
import { CompanyInfoSection } from "./CompanyInfoSection"
import { BankingSection } from "./BankingSection"
import { TaxLegalSection } from "./TaxLegalSection"
import { InvoiceDefaultsSection } from "./InvoiceDefaultsSection"
import { ExportDefaultsSection } from "./ExportDefaultsSection"

export type CompanyProfileData = {
  companyName: string
  address: string
  country: string
  email: string
  phone: string
  website: string
  logoUrl: string
  bankName: string
  bankBranch: string
  accountName: string
  accountNumber: string
  swiftCode: string
  iban: string
  bin: string
  vatTin: string
  tradeLicense: string
  currency: string
  invoicePrefix: string
  invoiceStartNumber: string
  defaultTerms: string
  originCountry: string
  hsCode: string
  incoterms: string
}

const countryOptions = [
  { _id: "Bangladesh", name: "Bangladesh" },
  { _id: "USA", name: "United States" },
  { _id: "UK", name: "United Kingdom" },
  { _id: "UAE", name: "United Arab Emirates" },
]

const currencyOptions = [
  { _id: "USD", name: "USD" },
  { _id: "EUR", name: "EUR" },
  { _id: "BDT", name: "BDT" },
  { _id: "GBP", name: "GBP" },
]

const incotermOptions = [
  { _id: "FOB", name: "FOB" },
  { _id: "CIF", name: "CIF" },
  { _id: "EXW", name: "EXW" },
  { _id: "DAP", name: "DAP" },
]

const initialData: CompanyProfileData = {
  companyName: "Fashion Republic (BD)",
  address: "House #16, Road No 01, Sector #11, Uttara, Dhaka-1230, Bangladesh",
  country: "Bangladesh",
  email: "fashionrepublic@gmail.com",
  phone: "",
  website: "",
  logoUrl: "",
  bankName: "National Bank Limited",
  bankBranch: "Pagla/Sarai Branch, Dhaka-1230, Bangladesh",
  accountName: "Fashion Republic (BD)",
  accountNumber: "",
  swiftCode: "NBLBDDH098",
  iban: "",
  bin: "00-1999721012",
  vatTin: "",
  tradeLicense: "",
  currency: "USD",
  invoicePrefix: "PI",
  invoiceStartNumber: "001",
  defaultTerms:
    "Payment: 90 days sight by irrevocable LC.\nDelivery: 15 days from the date of receipt of BB LC.\nNegotiation: 15 days from the date of delivery.\nOrigin: Bangladesh.",
  originCountry: "Bangladesh",
  hsCode: "62171000",
  incoterms: "FOB",
}

export function CompanyProfilePage() {
  const [savedData, setSavedData] = React.useState<CompanyProfileData>(initialData)
  const [draftData, setDraftData] = React.useState<CompanyProfileData>(initialData)
  const [isEditing, setIsEditing] = React.useState(false)

  const handleFieldChange = (field: keyof CompanyProfileData, value: string) => {
    if (!isEditing) return
    setDraftData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEdit = () => {
    setDraftData(savedData)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setDraftData(savedData)
    setIsEditing(false)
  }

  const handleSave = () => {
    setSavedData(draftData)
    setIsEditing(false)
  }

  const activeData = isEditing ? draftData : savedData

  return (
    <Container className="py-8">
      <CompanyProfileHeader
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <SectionGap />

      <Grid className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Box className="flex flex-col gap-6">
          <CompanyInfoSection
            data={activeData}
            onFieldChange={handleFieldChange}
            countryOptions={countryOptions}
            isEditing={isEditing}
          />
          <BankingSection data={activeData} onFieldChange={handleFieldChange} isEditing={isEditing} />
          <TaxLegalSection data={activeData} onFieldChange={handleFieldChange} isEditing={isEditing} />
        </Box>

        <Box className="flex flex-col gap-6">
          <InvoiceDefaultsSection
            data={activeData}
            onFieldChange={handleFieldChange}
            currencyOptions={currencyOptions}
            isEditing={isEditing}
          />
          <ExportDefaultsSection
            data={activeData}
            onFieldChange={handleFieldChange}
            countryOptions={countryOptions}
            incotermOptions={incotermOptions}
            isEditing={isEditing}
          />
        </Box>
      </Grid>
    </Container>
  )
}
