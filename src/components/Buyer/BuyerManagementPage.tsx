"use client";

import React from "react";
import {
  Container,
  PageHeader,
  PrimaryText,
  SectionGap,
} from "@/components/reusables";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Buyer, BuyerFormData } from "./types";
import { BuyerList } from "./BuyerList";
import { BuyerForm } from "./BuyerForm";
import { BuyerViewModal } from "./BuyerViewModal";
import { CustomModal } from "@/components/reusables";
import {
  useGetAllQuery,
  usePatchMutation,
  usePostMutation,
  usePutMutation,
} from "@/store/services/commonApi";

const emptyBuyer: BuyerFormData = {
  name: "",
  email: "",
  merchandiser: "",
  phone: "",
  address: "",
  location: "",
};

const validate = (data: BuyerFormData) => {
  const errors: Partial<Record<keyof BuyerFormData, string>> = {};
  if (!data.name.trim()) errors.name = "Name is required";
  if (!data.email.trim()) errors.email = "Email is required";
  if (!data.merchandiser.trim())
    errors.merchandiser = "Merchandiser is required";
  if (!data.phone.trim()) errors.phone = "Phone is required";
  if (!data.address.trim()) errors.address = "Address is required";
  if (!data.location.trim()) errors.location = "Location is required";
  return errors;
};

export function BuyerManagementPage() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState<{
    field: string;
    dir: "asc" | "desc";
  }>({
    field: "createdAt",
    dir: "desc",
  });
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [formData, setFormData] = React.useState<BuyerFormData>(emptyBuyer);
  const [formErrors, setFormErrors] = React.useState<
    Partial<Record<keyof BuyerFormData, string>>
  >({});
  const [deleteTarget, setDeleteTarget] = React.useState<Buyer | null>(null);
  const [viewTarget, setViewTarget] = React.useState<Buyer | null>(null);
  const [showDeleted, setShowDeleted] = React.useState(false);
  const [postItem] = usePostMutation();
  const [patchItem] = usePatchMutation();
  const [putItem] = usePutMutation();
  const {
    data: buyersPayload,
    isFetching: loading,
    error: buyersError,
    refetch,
  } = useGetAllQuery({
    path: "buyers",
    page,
    limit: 10,
    search: search || undefined,
    sortBy: sort.field,
    sortOrder: sort.dir,
    filters: {
      ...(showDeleted ? { isDeleted: true } : {}),
    },
  });
  const buyers = ((buyersPayload as any)?.data || []) as Buyer[];
  const totalPages = (buyersPayload as any)?.meta?.pagination?.totalPages || 1;

  React.useEffect(() => {
    const parsed = buyersError as any;
    if (!parsed) return;
    const message =
      parsed?.data?.error?.message ||
      parsed?.data?.message ||
      parsed?.error ||
      "Failed to load buyers";
    console.error("Load Buyers Error:", message);
  }, [buyersError]);

  const handleCreate = () => {
    setFormMode("create");
    setFormData(emptyBuyer);
    setFormErrors({});
    setFormOpen(true);
  };

  const handleEdit = (buyer: Buyer) => {
    setFormMode("edit");
    setFormData({ ...buyer });
    setFormErrors({});
    setFormOpen(true);
  };

  const handleDelete = (buyer: Buyer) => {
    setDeleteTarget(buyer);
  };

  const handleView = (buyer: Buyer) => {
    setViewTarget(buyer);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await patchItem({
        path: `buyers/${deleteTarget.id}`,
        body: { isDeleted: true },
        invalidate: ["buyers"],
      }).unwrap();
      refetch();
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        "Could not delete the buyer. Please try again.";
      console.error("Delete Buyer Error:", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleRestore = async (buyer: Buyer) => {
    try {
      await patchItem({
        path: `buyers/${buyer.id}`,
        body: { isDeleted: false },
        invalidate: ["buyers"],
      }).unwrap();
      refetch();
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        "Could not restore the buyer. Please try again.";
      console.error("Restore Buyer Error:", err);
    }
  };

  const handleToggleDeleted = () => {
    setShowDeleted((prev) => !prev);
    setPage(1);
  };

  const handleFormChange = (field: keyof BuyerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async () => {
    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        merchandiser: formData.merchandiser,
        phone: formData.phone,
        address: formData.address,
        location: formData.location,
      };
      if (formMode === "create") {
        await postItem({
          path: "buyers",
          body: payload,
          invalidate: ["buyers"],
        }).unwrap();
      } else if (formMode === "edit" && formData.id) {
        await patchItem({
          path: `buyers/${formData.id}`,
          body: payload,
          invalidate: ["buyers"],
        }).unwrap();
      }
      setFormOpen(false);
      refetch();
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        "Could not save the buyer. Please try again.";
      console.error("Save Buyer Error:", err);
    }
  };

  return (
    <Container className="py-8">
      <PageHeader
        title="Buyer Management"
        breadcrumbItems={[
          //{ label: "Dashboard", href: "/" },
          { label: "Buyers" },
        ]}
        actions={
          <Button
            className="bg-black text-white hover:bg-black/90 shadow-sm"
            onClick={handleCreate}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Buyer
          </Button>
        }
      />

      <BuyerList
        buyers={buyers}
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        showDeleted={showDeleted}
        onToggleDeleted={handleToggleDeleted}
        onRestore={handleRestore}
      />

      {loading && (
        <p className="mt-4 text-sm text-muted-foreground">Loading buyers...</p>
      )}

      <BuyerForm
        open={formOpen}
        mode={formMode}
        data={formData}
        onClose={() => setFormOpen(false)}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />

      <BuyerViewModal
        open={Boolean(viewTarget)}
        buyer={viewTarget}
        onClose={() => setViewTarget(null)}
        onEdit={handleEdit}
      />

      <CustomModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Confirm Delete"
        maxWidth="400px"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete buyer{" "}
            <span className="font-semibold text-foreground">
              {deleteTarget?.name}
            </span>
            ? This is a soft delete operation.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </Container>
  );
}
