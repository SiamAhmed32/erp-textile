import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { InvoiceTerms } from "./types"

type Props = {
  terms: InvoiceTerms
  onEdit: (terms: InvoiceTerms) => void
}

export function InvoiceTermsDetail({ terms, onEdit }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{terms.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{terms.payment}</p>
        </div>
        <Button variant="outline" onClick={() => onEdit(terms)}>
          Edit Terms
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Delivery</p>
            <p className="text-sm">{terms.delivery}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Negotiation</p>
            <p className="text-sm">{terms.negotiation}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Advising Bank</p>
            <p className="text-sm">{terms.advisingBank}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Origin</p>
            <p className="text-sm">{terms.origin}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">SWIFT</p>
            <p className="text-sm">{terms.swiftCode}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">BIN</p>
            <p className="text-sm">{terms.binNo}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">H.S. Code</p>
            <p className="text-sm">{terms.hsCode}</p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">Remarks</p>
          <p className="text-sm">{terms.remarks || "—"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
