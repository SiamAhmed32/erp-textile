"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, Download, Pencil } from "lucide-react"
import { Container, Flex, PrimaryHeading, PrimaryText } from "@/components/reusables"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiRequest, extractItem } from "@/lib/api"
import { CompanyProfile, CompanyProfileApiItem } from "./types"
import { CompanyProfileReadOnly } from "./CompanyProfileReadOnly"
import { normalizeProfile } from "./helpers"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

type Props = {
  id: string
}

export function CompanyProfileDetailPage({ id }: Props) {
  const [profile, setProfile] = React.useState<CompanyProfile | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const fetchProfile = React.useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const payload = await apiRequest(`/company-profiles/${id}`)
      const item = extractItem<CompanyProfileApiItem>(payload)
      if (!item) {
        setError("Company profile not found")
        return
      }
      const normalized = normalizeProfile(item)
      setProfile(normalized)
    } catch (err: any) {
      setError(err.message || "Failed to load company profile")
    } finally {
      setLoading(false)
    }
  }, [id])

  React.useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleExportPdf = () => {
    if (!profile) return
    const doc = new jsPDF()
    const title = profile.name || "Company Profile"
    doc.setFontSize(16)
    doc.text(title, 14, 18)
    doc.setFontSize(10)
    doc.text("Company Profile Details", 14, 24)

    const makeRows = (rows: Array<[string, string]>) =>
      rows.map(([label, value]) => [label, value || "-"])

    let startY = 30
    autoTable(doc, {
      startY,
      head: [["Company Information", ""]],
      body: makeRows([
        ["Company Name", profile.name],
        ["Company Type", profile.companyType],
        ["Status", profile.status],
        ["Address", profile.address],
        ["City", profile.city],
        ["Postal Code", profile.postalCode],
        ["Country", profile.country],
        ["Website", profile.website],
      ]),
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 41, 55] },
    })

    startY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : 30
    autoTable(doc, {
      startY,
      head: [["Contact Details", ""]],
      body: makeRows([
        ["Email", profile.email],
        ["Phone", profile.phone],
      ]),
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 41, 55] },
    })

    startY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : startY
    autoTable(doc, {
      startY,
      head: [["Banking Details", ""]],
      body: makeRows([
        ["Bank Name", profile.bankName],
        ["Branch Name", profile.branchName],
        ["Account Number", profile.bankAccountNumber],
        ["SWIFT Code", profile.swiftCode],
        ["Routing Number", profile.routingNumber],
      ]),
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 41, 55] },
    })

    startY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : startY
    autoTable(doc, {
      startY,
      head: [["Tax & Legal", ""]],
      body: makeRows([
        ["Tax ID", profile.taxId],
        ["Registration Number", profile.registrationNumber],
        ["Trade License Number", profile.tradeLicenseNumber],
        ["Trade License Expiry", profile.tradeLicenseExpiryDate],
      ]),
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 41, 55] },
    })

    const filename = `${title.replace(/\s+/g, "-").toLowerCase()}-profile.pdf`
    doc.save(filename)
  }

  return (
    <Container className="pb-10 pt-6">
      <Flex className="flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Link href="/company-profile" className="inline-flex items-center text-sm text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Company Profiles
          </Link>
          <PrimaryHeading>{profile?.name || "Company Details"}</PrimaryHeading>
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={!profile}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportPdf}>Export PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" asChild disabled={!profile}>
            <Link href={`/company-profile/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </Flex>

      <div className="mt-4" />

      {error && <PrimaryText className="text-sm text-destructive">{error}</PrimaryText>}
      {loading && (
        <PrimaryText className="text-sm text-muted-foreground">Loading company details...</PrimaryText>
      )}

      {profile && <CompanyProfileReadOnly profile={profile} />}
    </Container>
  )
}
