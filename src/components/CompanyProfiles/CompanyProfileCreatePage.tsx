"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Container, Flex, PrimaryHeading, PrimaryText } from "@/components/reusables"
import { Button } from "@/components/ui/button"
import { apiRequest, extractItem } from "@/lib/api"
import { CompanyProfileApiItem, CompanyProfileFormData } from "./types"
import { CompanyProfileForm } from "./CompanyProfileForm"
import { normalizeProfile, toApiPayload } from "./helpers"

const emptyForm: CompanyProfileFormData = {
  id: "",
  name: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  logoUrl: "",
  city: "",
  country: "",
  companyType: "PARENT",
  postalCode: "",
  taxId: "",
  registrationNumber: "",
  tradeLicenseNumber: "",
  tradeLicenseExpiryDate: "",
  status: "active",
  bankName: "",
  bankAccountNumber: "",
  branchName: "",
  swiftCode: "",
  routingNumber: "",
}

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export function CompanyProfileCreatePage() {
  const router = useRouter()
  const [draft, setDraft] = React.useState<CompanyProfileFormData>(emptyForm)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")
  const [errors, setErrors] = React.useState<Partial<Record<keyof CompanyProfileFormData, string>>>(
    {}
  )

  const handleChange = (field: keyof CompanyProfileFormData, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSave = async () => {
    const nextErrors: Partial<Record<keyof CompanyProfileFormData, string>> = {}
    if (!draft.name.trim() || draft.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters."
    }
    if (!draft.email.trim() || !isValidEmail(draft.email)) {
      nextErrors.email = "Enter a valid email address."
    }
    if (!draft.website.trim() || !isValidUrl(draft.website)) {
      nextErrors.website = "Enter a valid website URL (https://...)."
    }
    if (!draft.companyType) {
      nextErrors.companyType = "Select a company type."
    }
    if (!draft.status) {
      nextErrors.status = "Select a status."
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    setError("")
    try {
      const payload = await apiRequest(`/company-profiles`, {
        method: "POST",
        body: toApiPayload(draft),
      })
      const item = extractItem<CompanyProfileApiItem>(payload)
      const normalized = item ? normalizeProfile(item) : null
      if (normalized?.id) {
        router.push(`/company-profile/${normalized.id}`)
      } else {
        router.push(`/company-profile`)
      }
    } catch (err: any) {
      setError(err.message || "Failed to create company profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="pb-10 pt-6">
      <Flex className="flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Link href="/company-profile" className="inline-flex items-center text-sm text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Company Profiles
          </Link>
          <PrimaryHeading>Add Company</PrimaryHeading>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/company-profile">Cancel</Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Company"}
          </Button>
        </div>
      </Flex>

      <div className="mt-4" />

      {error && <PrimaryText className="text-sm text-destructive">{error}</PrimaryText>}

      <CompanyProfileForm data={draft} onChange={handleChange} isEditing errors={errors} />
    </Container>
  )
}
