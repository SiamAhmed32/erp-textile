import React from "react"
import { Flex, PrimaryHeading } from "@/components/reusables"
import { Button } from "@/components/ui/button"

type Props = {
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}

export function CompanyProfileHeader({ isEditing, onEdit, onSave, onCancel }: Props) {
  return (
    <Flex className="flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <PrimaryHeading>Company Profile</PrimaryHeading>
        <p className="text-sm text-muted-foreground">
          Keep this information accurate to ensure clean invoice and export documents.
        </p>
      </div>
      <Flex className="gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" className="min-w-[120px]" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="min-w-[120px]" onClick={onSave}>
              Save Changes
            </Button>
          </>
        ) : (
          <Button className="min-w-[120px]" onClick={onEdit}>
            Edit
          </Button>
        )}
      </Flex>
    </Flex>
  )
}
