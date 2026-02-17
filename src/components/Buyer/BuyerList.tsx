import React, { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, SquarePen, Trash2 } from "lucide-react";
import CustomTable from "@/components/reusables/CustomTable";
import { Buyer } from "./types";

type Props = {
  buyers: Buyer[];
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
  onEdit: (buyer: Buyer) => void;
  onDelete: (buyer: Buyer) => void;
  onView: (buyer: Buyer) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function BuyerList({
  buyers,
  search,
  onSearchChange,
  onCreate,
  onEdit,
  onDelete,
  onView,
  page,
  totalPages,
  onPageChange,
}: Props) {
  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessor: (row: Buyer) => (
          <Link
            href={`/buyers/${row.id}`}
            className="font-medium hover:underline"
          >
            {row.name}
          </Link>
        ),
      },
      {
        header: "Email",
        accessor: "email" as keyof Buyer,
      },
      {
        header: "Merchandiser",
        accessor: "merchandiser" as keyof Buyer,
      },
      {
        header: "Phone",
        accessor: "phone" as keyof Buyer,
      },
      {
        header: "Location",
        accessor: "location" as keyof Buyer,
      },
      {
        header: "Actions",
        className: "text-left w-40 pr-4",
        accessor: (row: Buyer) => (
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
              title="Edit Buyer"
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search buyer"
            className="w-full"
          />
          <Button variant="outline" className="shrink-0">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
        <Button
          onClick={onCreate}
          className="bg-black text-white hover:bg-black/90"
        >
          Add Buyer
        </Button>
      </div>

      <CustomTable
        data={buyers}
        columns={columns}
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange,
        }}
        scrollAreaHeight="h-[calc(100vh-350px)]"
      />
    </div>
  );
}
