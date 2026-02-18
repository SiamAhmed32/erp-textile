"use client";

import React, { useMemo } from "react";
import CustomTable from "@/components/reusables/CustomTable";
import { User } from "./types";
import { SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  data: User[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

const UsersTable = ({
  data,
  loading,
  page,
  totalPages,
  onPageChange,
  onEdit = () => {},
  onDelete = () => {},
}: Props) => {
  const columns = useMemo(
    () => [
      {
        header: "Avatar",
        accessor: (row: User) => (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
            {row.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.avatarUrl}
                alt={row.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-semibold">
                {row.firstName?.[0]}
                {row.lastName?.[0]}
              </span>
            )}
          </div>
        ),
      },
      {
        header: "Full Name",
        accessor: (row: User) => (
          <div className="font-medium text-foreground">
            {row.firstName} {row.lastName}
          </div>
        ),
      },
      {
        header: "Username",
        accessor: (row: User) => (
          <div className="text-muted-foreground">{row.username}</div>
        ),
      },
      {
        header: "Email",
        accessor: (row: User) => (
          <div className="text-muted-foreground">{row.email}</div>
        ),
      },
      {
        header: "Actions",
        className: "text-left w-24 pr-4",
        accessor: (row: User) => (
          <div className="flex justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              title="Edit User"
              className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
              onClick={() => onEdit(row)}
            >
              <SquarePen className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              title="Delete"
              className="h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              onClick={() => onDelete(row)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete],
  );

  return (
    <CustomTable
      data={data}
      columns={columns}
      isLoading={loading}
      skeletonRows={5}
      pagination={{
        currentPage: page,
        totalPages,
        onPageChange,
      }}
      scrollAreaHeight="h-[calc(100vh-280px)]"
    />
  );
};

export default UsersTable;
