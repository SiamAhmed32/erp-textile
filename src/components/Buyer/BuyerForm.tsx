import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BuyerFormData } from "./types"

export type BuyerFormMode = "create" | "edit"

type Props = {
  open: boolean
  mode: BuyerFormMode
  data: BuyerFormData
  onClose: () => void
  onChange: (field: keyof BuyerFormData, value: string) => void
  onSubmit: () => void
}

export function BuyerForm({ open, mode, data, onClose, onChange, onSubmit }: Props) {
  const isCreate = mode === "create"
  const title = isCreate ? "Add New Buyer" : "Edit Buyer Profile"
  const description = isCreate
    ? "Create a buyer profile to track orders, communication, and compliance."
    : "Update buyer information to keep records accurate and consistent."

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Buyer Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Buyer name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="buyer@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="merchandiser">Merchandiser</Label>
            <Input
              id="merchandiser"
              value={data.merchandiser}
              onChange={(e) => onChange("merchandiser", e.target.value)}
              placeholder="Merchandiser name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="+880..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="Dhaka"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={data.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Full address"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSubmit}>{isCreate ? "Create Buyer" : "Save Changes"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
