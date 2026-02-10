"use client"

import React from "react"
import { Container, PrimaryHeading, PrimaryText, SectionGap } from "@/components/reusables"
import { Buyer, BuyerFormData } from "./types"
import { BuyerList } from "./BuyerList"
import { BuyerForm } from "./BuyerForm"
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog"
import { apiRequest, extractArray, extractMeta } from "@/lib/api"

const emptyBuyer: BuyerFormData = {
  name: "",
  email: "",
  merchandiser: "",
  phone: "",
  address: "",
  location: "",
}

const validate = (data: BuyerFormData) => {
  const errors: Partial<Record<keyof BuyerFormData, string>> = {}
  if (!data.name.trim()) errors.name = "Name is required"
  if (!data.email.trim()) errors.email = "Email is required"
  if (!data.merchandiser.trim()) errors.merchandiser = "Merchandiser is required"
  if (!data.phone.trim()) errors.phone = "Phone is required"
  if (!data.address.trim()) errors.address = "Address is required"
  if (!data.location.trim()) errors.location = "Location is required"
  return errors
}

export function BuyerManagementPage() {
  const [buyers, setBuyers] = React.useState<Buyer[]>([])
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [formOpen, setFormOpen] = React.useState(false)
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create")
  const [formData, setFormData] = React.useState<BuyerFormData>(emptyBuyer)
  const [formErrors, setFormErrors] = React.useState<Partial<Record<keyof BuyerFormData, string>>>({})
  const [deleteTarget, setDeleteTarget] = React.useState<Buyer | null>(null)

  const fetchBuyers = React.useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const payload = await apiRequest(`/buyers?page=${page}&limit=10&search=${search}`)
      const list = extractArray<Buyer>(payload)
      const meta = extractMeta(payload)
      setBuyers(list)
      setTotalPages(meta?.totalPage || meta?.totalPages || 1)
    } catch (err: any) {
      setError(err.message || "Failed to load buyers")
    } finally {
      setLoading(false)
    }
  }, [page, search])

  React.useEffect(() => {
    fetchBuyers()
  }, [fetchBuyers])

  const handleCreate = () => {
    setFormMode("create")
    setFormData(emptyBuyer)
    setFormErrors({})
    setFormOpen(true)
  }

  const handleEdit = (buyer: Buyer) => {
    setFormMode("edit")
    setFormData({ ...buyer })
    setFormErrors({})
    setFormOpen(true)
  }

  const handleDelete = (buyer: Buyer) => {
    setDeleteTarget(buyer)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiRequest(`/buyers/${deleteTarget.id}`, {
        method: "PUT",
        body: { isDeleted: true },
      })
      fetchBuyers()
    } catch (err: any) {
      setError(err.message || "Failed to delete buyer")
    } finally {
      setDeleteTarget(null)
    }
  }

  const handleFormChange = (field: keyof BuyerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFormSubmit = async () => {
    const errors = validate(formData)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        merchandiser: formData.merchandiser,
        phone: formData.phone,
        address: formData.address,
        location: formData.location,
      }
      if (formMode === "create") {
        await apiRequest("/buyers", { method: "POST", body: payload })
      } else if (formMode === "edit" && formData.id) {
        await apiRequest(`/buyers/${formData.id}`, { method: "PATCH", body: payload })
      }
      setFormOpen(false)
      fetchBuyers()
    } catch (err: any) {
      setError(err.message || "Failed to save buyer")
    }
  }

  return (
    <Container className="py-8">
      <div className="space-y-2">
        <PrimaryHeading>Buyer Management</PrimaryHeading>
        <PrimaryText className="text-muted-foreground">
          Manage buyer profiles, contact details, and merchandiser assignments.
        </PrimaryText>
      </div>

      <SectionGap />

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <BuyerList
        buyers={buyers}
        search={search}
        onSearchChange={setSearch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {loading && <p className="mt-4 text-sm text-muted-foreground">Loading buyers...</p>}

      <BuyerForm
        open={formOpen}
        mode={formMode}
        data={formData}
        onClose={() => setFormOpen(false)}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Buyer?"
        description="This will soft delete the buyer and remove it from active lists."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </Container>
  )
}
