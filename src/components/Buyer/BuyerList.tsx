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
import { Buyer } from "./types"

type Props = {
  buyers: Buyer[]
  search: string
  onSearchChange: (value: string) => void
  onCreate: () => void
  onEdit: (buyer: Buyer) => void
  onDelete: (buyer: Buyer) => void
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export function BuyerList({
  buyers,
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
        <CardTitle>Buyers</CardTitle>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search buyer"
            className="sm:w-[240px]"
          />
          <Button onClick={onCreate}>Add Buyer</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Merchandiser</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buyers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  No buyers found.
                </TableCell>
              </TableRow>
            ) : (
              buyers.map((buyer) => (
                <TableRow key={buyer.id}>
                  <TableCell className="font-medium">
                    <Link href={`/buyers/${buyer.id}`} className="hover:underline">
                      {buyer.name}
                    </Link>
                  </TableCell>
                  <TableCell>{buyer.email}</TableCell>
                  <TableCell>{buyer.merchandiser}</TableCell>
                  <TableCell>{buyer.phone}</TableCell>
                  <TableCell>{buyer.location}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(buyer)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(buyer)}>
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
