"use client";

import React, { useMemo } from "react";
import CustomTable from "@/components/reusables/CustomTable";
import { User } from "./types";
import {
  SquarePen,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  User as UserIcon,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/store/services/types";

type Props = {
  data: User[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  showDeleted?: boolean;
  onRestore?: (user: User) => void;
};

const UsersTable = ({
  data,
  loading,
  page,
  totalPages,
  onPageChange,
  onEdit = () => { },
  onDelete = () => { },
  showDeleted = false,
  onRestore = () => { },
}: Props) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isAuthorized =
    currentUser?.role === "admin" || currentUser?.role === "super_admin";

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
        header: "Designation",
        accessor: (row: User) => (
          <div className="text-muted-foreground">
            {row.designation || "N/A"}
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
        header: "Role",
        accessor: (row: User) => {
          const role = row.role?.toLowerCase();
          let badgeClass = "";
          let Icon = null;

          switch (role) {
            case "admin":
              badgeClass =
                "bg-blue-100/80 text-blue-700 border-blue-200 hover:bg-blue-100/80";
              Icon = ShieldCheck;
              break;
            case "super_admin":
              badgeClass =
                "bg-indigo-100/80 text-indigo-700 border-indigo-200 hover:bg-indigo-100/80";
              Icon = ShieldAlert;
              break;
            case "user":
              badgeClass =
                "bg-slate-100/80 text-slate-700 border-slate-200 hover:bg-slate-100/80";
              Icon = UserIcon;
              break;
            default:
              badgeClass =
                "bg-gray-100/80 text-gray-700 border-gray-200 hover:bg-gray-100/80";
              Icon = UserIcon;
          }

          return (
            <Badge
              variant="outline"
              className={`capitalize px-2.5 py-0.5 font-medium flex items-center gap-1.5 ${badgeClass}`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {row.role}
            </Badge>
          );
        },
      },
      {
        header: "Actions",
        className: "text-left w-24 pr-4",
        accessor: (row: User) => (
          <div className="flex justify-end gap-1">
            {/* Logic: 
                - Only Admin or Super Admin can edit/delete
                - Can't delete/edit self
                - Admin can't delete/edit super_admin
                - Admin can't delete/edit another Admin (previous logic)
            */}
            {row.id !== currentUser?.id &&
              isAuthorized &&
              (currentUser?.role === "super_admin" ||
                row.role !== "super_admin") &&
              (currentUser?.role === "super_admin" || row.role !== "admin") && (
                <>
                  {!showDeleted && (
                    <>
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
                    </>
                  )}
                  {showDeleted && (
                    <Button
                      size="icon"
                      variant="ghost"
                      title="Restore"
                      className="h-7 w-7 text-slate-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                      onClick={() => onRestore(row)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
          </div>
        ),
      },
    ],
    [onEdit, onDelete, onRestore, currentUser?.id, currentUser?.role, isAuthorized, showDeleted],
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
