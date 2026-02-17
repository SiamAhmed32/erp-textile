import React, { useMemo } from "react";
import { Search, Eye, SquarePen, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomTable from "@/components/reusables/CustomTable";
import { InvoiceTerms } from "./types";

type Props = {
  terms: InvoiceTerms[];
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
  onEdit: (terms: InvoiceTerms) => void;
  onDelete: (terms: InvoiceTerms) => void;
  onView: (terms: InvoiceTerms) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
};

export function InvoiceTermsList({
  terms,
  search,
  onSearchChange,
  onCreate,
  onEdit,
  onDelete,
  onView,
  page,
  totalPages,
  onPageChange,
  loading = false,
}: Props) {
  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessor: (row: InvoiceTerms) => (
          <span className="font-semibold text-foreground">{row.name}</span>
        ),
      },
      {
        header: "Payment",
        accessor: "payment" as keyof InvoiceTerms,
      },
      {
        header: "Delivery",
        accessor: "delivery" as keyof InvoiceTerms,
      },
      {
        header: "Origin",
        accessor: "origin" as keyof InvoiceTerms,
      },
      {
        header: "SWIFT",
        accessor: "swiftCode" as keyof InvoiceTerms,
      },
      {
        header: "Actions",
        className: "text-left w-40 pr-4",
        accessor: (row: InvoiceTerms) => (
          <div className="flex justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              title="View Detail"
              className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onView(row);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              title="Edit Terms"
              className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
            >
              <SquarePen className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              title="Delete"
              className="h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onView, onEdit, onDelete],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <Input
            placeholder="Search by name, payment, or delivery terms"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Button variant="outline" className="shrink-0">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
          <Button
            className="bg-black text-white hover:bg-black/90"
            onClick={onCreate}
          >
            Add Terms
          </Button>
        </div>
      </div>

      <CustomTable
        data={terms}
        columns={columns}
        isLoading={loading}
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange,
        }}
        scrollAreaHeight="h-[calc(100vh-320px)]"
      />
    </div>
  );
}
