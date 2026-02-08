"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { Container, PrimaryHeading, PrimaryText, SectionGap } from "@/components/reusables"
import { InvoiceTerms, InvoiceTermsErrors, InvoiceTermsFormData } from "./types"
import { InvoiceTermsDetail } from "./InvoiceTermsDetail"
import { InvoiceTermsForm } from "./InvoiceTermsForm"
import { apiRequest, extractItem } from "@/lib/api"

const emptyTerms: InvoiceTermsFormData = {
  name: "",
  payment: "",
  delivery: "",
  advisingBank: "",
  negotiation: "",
  origin: "",
  swiftCode: "",
  binNo: "",
  hsCode: "",
  remarks: "",
}

const validate = (data: InvoiceTermsFormData): InvoiceTermsErrors => {
  const errors: InvoiceTermsErrors = {}
  if (!data.name.trim()) errors.name = "Name is required"
  if (data.name.trim().length < 2) errors.name = "Name must be at least 2 characters"
  if (!data.payment.trim()) errors.payment = "Payment terms are required"
  if (data.payment.trim().length < 2) errors.payment = "Payment must be at least 2 characters"
  if (!data.delivery.trim()) errors.delivery = "Delivery terms are required"
  if (data.delivery.trim().length < 2) errors.delivery = "Delivery must be at least 2 characters"
  if (!data.advisingBank.trim()) errors.advisingBank = "Advising bank is required"
  if (data.advisingBank.trim().length < 2) errors.advisingBank = "Advising bank must be at least 2 characters"
  if (!data.negotiation.trim()) errors.negotiation = "Negotiation terms are required"
  if (data.negotiation.trim().length < 2) errors.negotiation = "Negotiation must be at least 2 characters"
  if (!data.origin.trim()) errors.origin = "Origin is required"
  if (data.origin.trim().length < 2) errors.origin = "Origin must be at least 2 characters"
  if (!data.swiftCode.trim()) errors.swiftCode = "SWIFT code is required"
  if (data.swiftCode.trim().length < 4) errors.swiftCode = "SWIFT code must be at least 4 characters"
  if (!data.binNo.trim()) errors.binNo = "BIN is required"
  if (data.binNo.trim().length < 3) errors.binNo = "BIN must be at least 3 characters"
  if (!data.hsCode.trim()) errors.hsCode = "H.S. code is required"
  if (data.hsCode.trim().length < 3) errors.hsCode = "H.S. code must be at least 3 characters"
  return errors
}

export function InvoiceTermsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const [terms, setTerms] = React.useState<InvoiceTerms | null>(null)
  const [formOpen, setFormOpen] = React.useState(false)
  const [formData, setFormData] = React.useState<InvoiceTermsFormData>(emptyTerms)
  const [formErrors, setFormErrors] = React.useState<InvoiceTermsErrors>({})
  const [error, setError] = React.useState("")

  const fetchTerms = React.useCallback(async () => {
    setError("")
    try {
      const payload = await apiRequest(`/invoice-terms/${id}`)
      const item = extractItem<InvoiceTerms>(payload)
      setTerms(item)
    } catch (err: any) {
      setError(err.message || "Failed to load terms")
    }
  }, [id])

  React.useEffect(() => {
    fetchTerms()
  }, [fetchTerms])

  if (!terms) {
    return (
      <Container className="py-8">
        <PrimaryHeading>Invoice Terms Not Found</PrimaryHeading>
        <PrimaryText className="text-muted-foreground mt-2">
          {error || "The terms you are looking for do not exist."}
        </PrimaryText>
        <SectionGap />
        <button
          className="text-sm text-primary underline"
          onClick={() => router.push("/invoice-terms")}
        >
          Back to Invoice Terms
        </button>
      </Container>
    )
  }

  const handleEdit = () => {
    setFormData({ ...terms })
    setFormErrors({})
    setFormOpen(true)
  }

  const handleFormChange = (field: keyof InvoiceTermsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFormSubmit = async () => {
    const errors = validate(formData)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    try {
      const payload = {
        name: formData.name,
        payment: formData.payment,
        delivery: formData.delivery,
        advisingBank: formData.advisingBank,
        negotiation: formData.negotiation,
        origin: formData.origin,
        swiftCode: formData.swiftCode,
        binNo: formData.binNo,
        hsCode: formData.hsCode,
        remarks: formData.remarks,
      }
      await apiRequest(`/invoice-terms/${terms.id}`, { method: "PATCH", body: payload })
      setFormOpen(false)
      fetchTerms()
    } catch (err: any) {
      setError(err.message || "Failed to update terms")
    }
  }

  return (
    <Container className="py-8">
      <div className="space-y-2">
        <PrimaryHeading>Terms Detail</PrimaryHeading>
        <PrimaryText className="text-muted-foreground">
          Review and update invoice terms for commercial documentation.
        </PrimaryText>
      </div>

      <SectionGap />

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <InvoiceTermsDetail terms={terms} onEdit={handleEdit} />

      <InvoiceTermsForm
        open={formOpen}
        mode="edit"
        data={formData}
        errors={formErrors}
        onClose={() => setFormOpen(false)}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />
    </Container>
  )
}
