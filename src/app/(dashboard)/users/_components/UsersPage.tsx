"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/services/types";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/store/services/authApi";
import { usePutMutation } from "@/store/services/commonApi";
import UsersTable from "./UsersTable";
import UserCreateModal from "./UserCreateModal";
import UserEditModal from "./UserEditModal";
import { PageHeader, CustomModal } from "@/components/reusables";
import { Plus, ChevronDown, ArrowUpDown, Trash2 } from "lucide-react";
import { User } from "./types";
import { notify } from "@/lib/notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "username",
    dir: "asc",
  });
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);

  const { data, isLoading } = useGetUsersQuery({
    page,
    limit: 10,
    search: search || undefined,
    sort: sort.field ? `${sort.field}:${sort.dir}` : undefined,
    filters: {
      ...(roleFilter !== "all" ? { role: roleFilter } : {}),
      ...(showDeleted ? { isDeleted: true } : {}),
    },
  });
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [putItem] = usePutMutation();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isAuthorized =
    currentUser?.role === "admin" || currentUser?.role === "super_admin";

  const handleSearchSubmit = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "super_admin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
  ];

  const sortOptions = [
    {
      value: "username_asc",
      label: "Username A → Z",
      field: "username",
      dir: "asc",
    },
    {
      value: "username_desc",
      label: "Username Z → A",
      field: "username",
      dir: "desc",
    },
    { value: "role_asc", label: "Role A → Z", field: "role", dir: "asc" },
  ];

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      await deleteUser({
        id: deletingUser.id,
        body: { isDeleted: true },
      }).unwrap();
      notify.success("User deleted successfully (soft delete)");
      setDeletingUser(null);
    } catch (error: any) {
      notify.error(
        error?.data?.message || "Could not delete the user. Please try again.",
      );
    }
  };

  const handleRestore = async (user: User) => {
    try {
      await deleteUser({
        id: user.id,
        body: { isDeleted: false },
      }).unwrap();
      notify.success("User restored successfully");
    } catch (error: any) {
      notify.error(
        error?.data?.message || "Could not restore the user. Please try again.",
      );
    }
  };

  const handleToggleDeleted = () => {
    setShowDeleted((prev) => !prev);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        breadcrumbItems={[
          //{ label: "Dashboard", href: "/" },
          { label: "Users" },
        ]}
        actions={
          isAuthorized && (
            <Button
              className="bg-black text-white hover:bg-black/90 shadow-sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New User
            </Button>
          )
        }
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Search Group */}
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <div className="relative flex-1">
            <Input
              placeholder="Search by username, email, name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              className="h-11 bg-white border-slate-200 rounded-lg shadow-sm"
            />
          </div>
          <Button
            onClick={handleSearchSubmit}
            className="h-11 px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg"
          >
            Search
          </Button>
          <Button
            variant={showDeleted ? "destructive" : "outline"}
            className={cn(
              "h-11 px-4 gap-2 rounded-lg font-medium",
              !showDeleted && "bg-white border-slate-200 text-slate-500",
            )}
            onClick={handleToggleDeleted}
            title={showDeleted ? "Show Active Users" : "Show Deleted Users"}
          >
            <Trash2 className="h-4 w-4" />
            {showDeleted ? "Exit Trash" : "Trash"}
          </Button>
        </div>

        {/* Right: Filters Group */}
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {/* Role Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-11 px-4 gap-2 bg-white border-slate-200 rounded-lg font-medium",
                  roleFilter !== "all" &&
                    "bg-blue-50 border-blue-200 text-blue-700",
                )}
              >
                <span>
                  {roleOptions.find((r) => r.value === roleFilter)?.label}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl shadow-xl border-slate-200/60 p-1"
            >
              {roleOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => {
                    setRoleFilter(opt.value);
                    setPage(1);
                  }}
                  className={cn(
                    "rounded-lg my-0.5",
                    roleFilter === opt.value ? "bg-blue-50 text-blue-700" : "",
                  )}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-11 px-4 gap-2 bg-white border-slate-200 rounded-lg font-medium",
                  (sort.field !== "username" || sort.dir !== "asc") &&
                    "bg-purple-50 border-purple-200 text-purple-700",
                )}
              >
                <ArrowUpDown className="h-4 w-4 opacity-50" />
                <span>
                  {sort.field === "username" && sort.dir === "asc"
                    ? "Sort By"
                    : sortOptions.find(
                        (opt) =>
                          opt.field === sort.field && opt.dir === sort.dir,
                      )?.label}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl shadow-xl border-slate-200/60 p-1"
            >
              {sortOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() =>
                    setSort({
                      field: opt.field,
                      dir: opt.dir as "asc" | "desc",
                    })
                  }
                  className={cn(
                    "rounded-lg my-0.5",
                    sort.field === opt.field && sort.dir === sort.dir
                      ? "bg-purple-50 text-purple-700"
                      : "",
                  )}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <UsersTable
        data={(data as any)?.data || []}
        loading={isLoading}
        page={page}
        totalPages={(data as any)?.meta?.pagination?.totalPages || 1}
        onPageChange={setPage}
        onEdit={setEditingUser}
        onDelete={setDeletingUser}
        showDeleted={showDeleted}
        onRestore={handleRestore}
      />

      <UserCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <UserEditModal
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        user={editingUser}
      />

      <CustomModal
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        title="Confirm Delete"
        maxWidth="400px"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete user{" "}
            <span className="font-semibold text-foreground">
              {deletingUser?.firstName} {deletingUser?.lastName}
            </span>
            ? This is a soft delete operation.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeletingUser(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default UsersPage;
