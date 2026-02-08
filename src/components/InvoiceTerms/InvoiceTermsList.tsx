import React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { InvoiceTerms } from "./types"

type Props = {
  terms: InvoiceTerms[]
  search: string
  onSearchChange: (value: string) => void
  onCreate: () => void
  onEdit: (terms: InvoiceTerms) => void
  onDelete: (terms: InvoiceTerms) => void
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export function InvoiceTermsList({
  terms,
  search,
  onSearchChange,
  onCreate,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPrev,
  onNext,
}: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Invoice Terms</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage reusable terms templates for invoices and export documents.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search terms"
            className="sm:w-[220px]"
          />
          <Button onClick={onCreate}>Add Terms</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>SWIFT</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {terms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  No invoice terms found.
                </TableCell>
              </TableRow>
            ) : (
              terms.map((term) => (
                <TableRow key={term.id}>
                  <TableCell className="font-medium">
                    <Link href={`/invoice-terms/${term.id}`} className="hover:underline">
                      {term.name}
                    </Link>
                  </TableCell>
                  <TableCell>{term.payment}</TableCell>
                  <TableCell>{term.delivery}</TableCell>
                  <TableCell>{term.origin}</TableCell>
                  <TableCell>{term.swiftCode}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(term)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(term)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onPrev} disabled={page === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={onNext} disabled={page === totalPages}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
