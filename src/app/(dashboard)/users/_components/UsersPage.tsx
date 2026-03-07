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
import {
  Plus,
  ChevronDown,
  ArrowUpDown,
  Trash2,
  Search as SearchIcon,
} from "lucide-react";
import { User } from "./types";
import { notify } from "@/lib/notifications";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useDebounce } from "use-debounce";

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "createdAt",
    dir: "desc",
  });
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [searchValue] = useDebounce(search, 500);
  const { data, isLoading } = useGetUsersQuery({
    page,
    limit: 10,
    search: searchValue || undefined,
    sortBy: sort.field,
    sortOrder: sort.dir,
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
      value: "createdAt_desc",
      label: "Newest First",
      field: "createdAt",
      dir: "desc",
    },
    {
      value: "createdAt_asc",
      label: "Oldest First",
      field: "createdAt",
      dir: "asc",
    },
    {
      value: "updatedAt_desc",
      label: "Recently Updated",
      field: "updatedAt",
      dir: "desc",
    },
  ];

  const currentSortValue =
    sortOptions.find((opt) => opt.field === sort.field && opt.dir === sort.dir)
      ?.value || "createdAt_desc";

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
        <div className="flex w-full items-center gap-2 lg:max-w-md lg:flex-1">
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
            className="h-11 px-3 sm:px-6 bg-black text-white hover:bg-black/90 font-bold rounded-lg shrink-0"
          >
            <SearchIcon className="h-4 w-4 sm:hidden" />
            <span className="hidden sm:inline">Search</span>
          </Button>
          <Button
            variant={showDeleted ? "destructive" : "outline"}
            className={cn(
              "h-11 px-3 sm:px-4 gap-2 rounded-lg font-medium shrink-0",
              !showDeleted && "bg-white border-slate-200 text-slate-500",
            )}
            onClick={handleToggleDeleted}
            title={showDeleted ? "Show Active Users" : "Show Deleted Users"}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">
              {showDeleted ? "Exit Trash" : "Trash"}
            </span>
          </Button>
        </div>

        {/* Right: Filters Group */}
        <div className="flex items-center gap-2 w-full lg:w-auto lg:justify-end">
          {/* Role Filter */}
          <div className="flex-1 sm:w-[160px] sm:flex-none">
            <Select
              value={roleFilter}
              onValueChange={(val) => {
                setRoleFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-11 bg-white border-slate-200 rounded-lg shadow-sm">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent
                align="end"
                className="rounded-xl shadow-xl border-slate-200"
              >
                {roleOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Group */}
          <div className="flex flex-1 items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 sm:px-3 h-11 shadow-sm sm:flex-none">
            <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap border-r pr-2 mr-1 hidden sm:inline">
              Sort By
            </span>
            <Select
              value={currentSortValue}
              onValueChange={(val) => {
                const opt = sortOptions.find((o) => o.value === val);
                if (opt)
                  setSort({ field: opt.field, dir: opt.dir as "asc" | "desc" });
              }}
            >
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-[10px] sm:text-xs font-bold uppercase tracking-wider w-full sm:w-[140px]">
                <SelectValue placeholder="Newest First" />
              </SelectTrigger>
              <SelectContent
                align="end"
                className="rounded-xl shadow-xl border-slate-200"
              >
                {sortOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-xs font-semibold py-2.5"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
