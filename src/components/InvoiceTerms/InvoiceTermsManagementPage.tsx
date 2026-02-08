"use client"

import React from "react"
import { Container, PrimaryHeading, PrimaryText, SectionGap } from "@/components/reusables"
import { InvoiceTerms, InvoiceTermsErrors, InvoiceTermsFormData } from "./types"
import { InvoiceTermsList } from "./InvoiceTermsList"
import { InvoiceTermsForm } from "./InvoiceTermsForm"
import { DeleteConfirmDialog } from "../shared/DeleteConfirmDialog"
import { apiRequest, extractArray, extractMeta } from "@/lib/api"

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

export function InvoiceTermsManagementPage() {
  const [terms, setTerms] = React.useState<InvoiceTerms[]>([])
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [formOpen, setFormOpen] = React.useState(false)
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create")
  const [formData, setFormData] = React.useState<InvoiceTermsFormData>(emptyTerms)
  const [formErrors, setFormErrors] = React.useState<InvoiceTermsErrors>({})
  const [deleteTarget, setDeleteTarget] = React.useState<InvoiceTerms | null>(null)

  const fetchTerms = React.useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const payload = await apiRequest(`/invoice-terms?page=${page}&limit=10&search=${search}`)
      const list = extractArray<InvoiceTerms>(payload)
      const meta = extractMeta(payload)
      setTerms(list)
      setTotalPages(meta?.totalPage || meta?.totalPages || 1)
    } catch (err: any) {
      setError(err.message || "Failed to load terms")
    } finally {
      setLoading(false)
    }
  }, [page, search])

  React.useEffect(() => {
    fetchTerms()
  }, [fetchTerms])

  const handleCreate = () => {
    setFormMode("create")
    setFormData(emptyTerms)
    setFormErrors({})
    setFormOpen(true)
  }

  const handleEdit = (item: InvoiceTerms) => {
    setFormMode("edit")
    setFormData({ ...item })
    setFormErrors({})
    setFormOpen(true)
  }

  const handleDelete = (item: InvoiceTerms) => {
    setDeleteTarget(item)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiRequest(`/invoice-terms/${deleteTarget.id}`, {
        method: "PUT",
        body: { isDeleted: true },
      })
      fetchTerms()
    } catch (err: any) {
      setError(err.message || "Failed to delete terms")
    } finally {
      setDeleteTarget(null)
    }
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
      if (formMode === "create") {
        await apiRequest("/invoice-terms", { method: "POST", body: payload })
      } else if (formMode === "edit" && formData.id) {
        await apiRequest(`/invoice-terms/${formData.id}`, { method: "PATCH", body: payload })
      }
      setFormOpen(false)
      fetchTerms()
    } catch (err: any) {
      setError(err.message || "Failed to save terms")
    }
  }

  return (
    <Container className="py-8">
      <div className="space-y-2">
        <PrimaryHeading>Invoice Terms</PrimaryHeading>
        <PrimaryText className="text-muted-foreground">
          Create and manage reusable invoice terms for consistent commercial documents.
        </PrimaryText>
      </div>

      <SectionGap />

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <InvoiceTermsList
        terms={terms}
        search={search}
        onSearchChange={setSearch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
        onNext={() => setPage((prev) => Math.min(totalPages, prev + 1))}
      />

      {loading && <p className="mt-4 text-sm text-muted-foreground">Loading terms...</p>}

      <InvoiceTermsForm
        open={formOpen}
        mode={formMode}
        data={formData}
        errors={formErrors}
        onClose={() => setFormOpen(false)}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Invoice Terms?"
        description="This will remove the template from active use. You can recreate it later if needed."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </Container>
  )
}
