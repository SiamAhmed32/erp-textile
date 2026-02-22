"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/reusables/PrimaryButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/services/types";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/store/services/authApi";
import UsersTable from "./UsersTable";
import UserCreateModal from "./UserCreateModal";
import UserEditModal from "./UserEditModal";
import { PageHeader, CustomModal } from "@/components/reusables";
import { Plus } from "lucide-react";
import { User } from "./types";
import { notify } from "@/lib/notifications";

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const { data, isLoading } = useGetUsersQuery({ search });
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isAuthorized =
    currentUser?.role === "admin" || currentUser?.role === "super_admin";

  const handleSearchSubmit = () => {
    setSearch(searchInput);
    setPage(1);
  };

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
      notify.error(error?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        breadcrumbItems={[
          { label: "Dashboard", href: "/" },
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
        <div className="flex w-full gap-2 lg:max-w-md">
          <Input
            placeholder="Search by username, email, name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
          />
          <Button variant="outline" onClick={handleSearchSubmit}>
            Search
          </Button>
        </div>
      </div>

      <UsersTable
        data={data?.data || data || []}
        loading={isLoading}
        page={page}
        totalPages={data?.lastPage || 1}
        onPageChange={setPage}
        onEdit={setEditingUser}
        onDelete={setDeletingUser}
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
            <Button
              variant="outline"
              onClick={() => setDeletingUser(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default UsersPage;
