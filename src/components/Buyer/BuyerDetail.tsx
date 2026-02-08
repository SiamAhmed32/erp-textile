import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Buyer } from "./types"

type Props = {
  buyer: Buyer
  onEdit: (buyer: Buyer) => void
}

export function BuyerDetail({ buyer, onEdit }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{buyer.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{buyer.email}</p>
        </div>
        <Button variant="outline" onClick={() => onEdit(buyer)}>
          Edit Buyer
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Merchandiser</p>
            <p className="text-sm">{buyer.merchandiser}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Phone</p>
            <p className="text-sm">{buyer.phone}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Location</p>
            <p className="text-sm">{buyer.location}</p>
          </div>
        </div>
        <Separator />
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">Address</p>
          <p className="text-sm">{buyer.address}</p>
        </div>
      </CardContent>
    </Card>
  )
}
