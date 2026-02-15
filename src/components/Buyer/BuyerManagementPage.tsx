"use client"

import React from "react"
import { Container, PrimaryHeading, PrimaryText, SectionGap } from "@/components/reusables"
import { Buyer, BuyerFormData } from "./types"
import { BuyerList } from "./BuyerList"
import { BuyerForm } from "./BuyerForm"
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog"
import {
  useGetAllQuery,
  usePatchMutation,
  usePostMutation,
  usePutMutation,
} from "@/store/services/commonApi"

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
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [error, setError] = React.useState("")
  const [formOpen, setFormOpen] = React.useState(false)
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create")
  const [formData, setFormData] = React.useState<BuyerFormData>(emptyBuyer)
  const [formErrors, setFormErrors] = React.useState<Partial<Record<keyof BuyerFormData, string>>>({})
  const [deleteTarget, setDeleteTarget] = React.useState<Buyer | null>(null)
  const [postItem] = usePostMutation()
  const [patchItem] = usePatchMutation()
  const [putItem] = usePutMutation()
  const { data: buyersPayload, isFetching: loading, error: buyersError, refetch } = useGetAllQuery({
    path: "buyers",
    page,
    limit: 10,
    search,
  })
  const buyers = ((buyersPayload as any)?.data || []) as Buyer[]
  const totalPages = (buyersPayload as any)?.meta?.pagination?.totalPages || 1

  React.useEffect(() => {
    const parsed = buyersError as any
    if (!parsed) return
    const message =
      parsed?.data?.error?.message || parsed?.data?.message || parsed?.error || "Failed to load buyers"
    setError(message)
  }, [buyersError])

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
      await putItem({
        path: `buyers/${deleteTarget.id}`,
        body: { isDeleted: true },
        invalidate: ["buyers"],
      }).unwrap()
      refetch()
    } catch (err: any) {
      const message = err?.data?.error?.message || err?.data?.message || err?.error || err?.message || "Failed to delete buyer"
      setError(message)
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
        await postItem({ path: "buyers", body: payload, invalidate: ["buyers"] }).unwrap()
      } else if (formMode === "edit" && formData.id) {
        await patchItem({
          path: `buyers/${formData.id}`,
          body: payload,
          invalidate: ["buyers"],
        }).unwrap()
      }
      setFormOpen(false)
      refetch()
    } catch (err: any) {
      const message = err?.data?.error?.message || err?.data?.message || err?.error || err?.message || "Failed to save buyer"
      setError(message)
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
