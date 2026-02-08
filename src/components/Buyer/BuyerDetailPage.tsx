"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { Container, PrimaryHeading, PrimaryText, SectionGap } from "@/components/reusables"
import { Buyer, BuyerFormData } from "./types"
import { BuyerDetail } from "./BuyerDetail"
import { BuyerForm } from "./BuyerForm"
import { apiRequest, extractItem } from "@/lib/api"

const emptyBuyer: BuyerFormData = {
  name: "",
  email: "",
  merchandiser: "",
  phone: "",
  address: "",
  location: "",
}

export function BuyerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const [buyer, setBuyer] = React.useState<Buyer | null>(null)
  const [formOpen, setFormOpen] = React.useState(false)
  const [formData, setFormData] = React.useState<BuyerFormData>(emptyBuyer)
  const [error, setError] = React.useState("")

  const fetchBuyer = React.useCallback(async () => {
    setError("")
    try {
      const payload = await apiRequest(`/buyers/${id}`)
      const item = extractItem<Buyer>(payload)
      setBuyer(item)
    } catch (err: any) {
      setError(err.message || "Failed to load buyer")
    }
  }, [id])

  React.useEffect(() => {
    fetchBuyer()
  }, [fetchBuyer])

  if (!buyer) {
    return (
      <Container className="py-8">
        <PrimaryHeading>Buyer Not Found</PrimaryHeading>
        <PrimaryText className="text-muted-foreground mt-2">
          {error || "The buyer you are looking for does not exist."}
        </PrimaryText>
        <SectionGap />
        <button
          className="text-sm text-primary underline"
          onClick={() => router.push("/buyers")}
        >
          Back to Buyers
        </button>
      </Container>
    )
  }

  const handleEdit = () => {
    setFormData({ ...buyer })
    setFormOpen(true)
  }

  const handleFormChange = (field: keyof BuyerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFormSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        merchandiser: formData.merchandiser,
        phone: formData.phone,
        address: formData.address,
        location: formData.location,
      }
      await apiRequest(`/buyers/${buyer.id}`, { method: "PATCH", body: payload })
      setFormOpen(false)
      fetchBuyer()
    } catch (err: any) {
      setError(err.message || "Failed to update buyer")
    }
  }

  return (
    <Container className="py-8">
      <div className="space-y-2">
        <PrimaryHeading>Buyer Details</PrimaryHeading>
        <PrimaryText className="text-muted-foreground">
          Review and update buyer information.
        </PrimaryText>
      </div>

      <SectionGap />

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      <BuyerDetail buyer={buyer} onEdit={handleEdit} />

      <BuyerForm
        open={formOpen}
        mode="edit"
        data={formData}
        onClose={() => setFormOpen(false)}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />
    </Container>
  )
}
