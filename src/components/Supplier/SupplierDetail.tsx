import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Supplier } from "./types"

type Props = {
    supplier: Supplier
    onEdit: (supplier: Supplier) => void
}

export function SupplierDetail({ supplier, onEdit }: Props) {
    return (
        <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle>{supplier.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{supplier.email}</p>
                </div>
                <Button variant="outline" onClick={() => onEdit(supplier)}>
                    Edit Supplier
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <p className="text-xs font-medium uppercase text-muted-foreground">Supplier Code</p>
                        <p className="text-sm">{supplier.supplierCode || "—"}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase text-muted-foreground">Phone</p>
                        <p className="text-sm">{supplier.phone}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase text-muted-foreground">Location</p>
                        <p className="text-sm">{supplier.location}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase text-muted-foreground">Opening Liability</p>
                        <p className="text-sm font-mono">{supplier.openingLiability ? `৳ ${supplier.openingLiability.toLocaleString()}` : "৳ 0"}</p>
                    </div>
                </div>
                <Separator />
                <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">Address</p>
                    <p className="text-sm">{supplier.address}</p>
                </div>
            </CardContent>
        </Card>
    )
}
