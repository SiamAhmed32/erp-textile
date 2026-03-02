"use client";

import React from "react";
import { Container, PageHeader } from "@/components/reusables";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Supplier, SupplierFormData } from "./types";
import { SupplierList } from "./SupplierList";
import { SupplierForm, SupplierFormMode } from "./SupplierForm";
import { SupplierViewModal } from "./SupplierViewModal";
import { CustomModal } from "@/components/reusables";
import {
  useGetAllQuery,
  usePatchMutation,
  usePostMutation,
  usePutMutation,
} from "@/store/services/commonApi";
import { notify } from "@/lib/notifications";

const emptySupplier: SupplierFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  location: "",
  supplierCode: "",
  openingLiability: 0,
};

const validate = (data: SupplierFormData) => {
  const errors: Partial<Record<keyof SupplierFormData, string>> = {};
  if (!data.name?.trim()) errors.name = "Supplier name is required";
  if (!data.email?.trim()) errors.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(data.email))
    errors.email = "Invalid email format";
  if (!data.phone?.trim()) errors.phone = "Phone number is required";
  if (!data.address?.trim()) errors.address = "Address is required";
  if (!data.location?.trim()) errors.location = "Location is required";
  return errors;
};

export function SupplierManagementPage() {
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
  const [formMode, setFormMode] = React.useState<SupplierFormMode>("create");
  const [formData, setFormData] =
    React.useState<SupplierFormData>(emptySupplier);
  const [formErrors, setFormErrors] = React.useState<
    Partial<Record<keyof SupplierFormData, string>>
  >({});
  const [deleteTarget, setDeleteTarget] = React.useState<Supplier | null>(null);
  const [viewTarget, setViewTarget] = React.useState<Supplier | null>(null);
  const [showDeleted, setShowDeleted] = React.useState(false);

  const [postItem] = usePostMutation();
  const [patchItem] = usePatchMutation();
  const [putItem] = usePutMutation();

  const {
    data: suppliersPayload,
    isFetching: loading,
    error: suppliersError,
    refetch,
  } = useGetAllQuery({
    path: "suppliers",
    page,
    limit: 10,
    search: search || undefined,
    sortBy: sort.field,
    sortOrder: sort.dir,
    filters: {
      ...(showDeleted ? { isDeleted: true } : {}),
    },
  });

  const suppliers = ((suppliersPayload as any)?.data || []) as Supplier[];
  const totalPages =
    (suppliersPayload as any)?.meta?.pagination?.totalPages || 1;

  React.useEffect(() => {
    const parsed = suppliersError as any;
    if (!parsed) return;
    const message =
      parsed?.data?.error?.message ||
      parsed?.data?.message ||
      "Could not load suppliers. Please refresh the page.";
    notify.error(message);
  }, [suppliersError]);

  const handleCreate = () => {
    setFormMode("create");
    setFormData(emptySupplier);
    setFormErrors({});
    setFormOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setFormMode("edit");
    setFormData({ ...supplier });
    setFormErrors({});
    setFormOpen(true);
  };

  const handleDelete = (supplier: Supplier) => {
    setDeleteTarget(supplier);
  };

  const handleView = (supplier: Supplier) => {
    setViewTarget(supplier);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await patchItem({
        path: `suppliers/${deleteTarget.id}`,
        body: { isDeleted: true },
        invalidate: ["suppliers"],
      }).unwrap();
      notify.success("Supplier deleted successfully");
      refetch();
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        "Could not delete the supplier. Please try again.";
      notify.error(message);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleRestore = async (supplier: Supplier) => {
    try {
      await patchItem({
        path: `suppliers/${supplier.id}`,
        body: { isDeleted: false },
        invalidate: ["suppliers"],
      }).unwrap();
      notify.success("Supplier restored successfully");
      refetch();
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        "Could not restore the supplier. Please try again.";
      notify.error(message);
    }
  };

  const handleToggleDeleted = () => {
    setShowDeleted((prev) => !prev);
    setPage(1);
  };

  const handleFormChange = (
    field: keyof SupplierFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFormSubmit = async () => {
    const errors = validate(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      notify.error("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        location: formData.location,
        supplierCode: formData.supplierCode || undefined,
        openingLiability: formData.openingLiability
          ? Number(formData.openingLiability)
          : undefined,
      };

      if (formMode === "create") {
        await postItem({
          path: "suppliers",
          body: payload,
          invalidate: ["suppliers"],
        }).unwrap();
        notify.success("Supplier created successfully");
      } else if (formMode === "edit" && formData.id) {
        await patchItem({
          path: `suppliers/${formData.id}`,
          body: payload,
          invalidate: ["suppliers"],
        }).unwrap();
        notify.success("Supplier updated successfully");
      }
      setFormOpen(false);
      refetch();
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        "Could not save the supplier. Please try again.";
      notify.error(message);
    }
  };

  return (
    <Container className="py-8">
      <PageHeader
        title="Supplier Management"
        breadcrumbItems={[{ label: "Suppliers" }]}
        actions={
          <Button
            className="bg-black text-white hover:bg-black/90 shadow-sm"
            onClick={handleCreate}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Supplier
          </Button>
        }
      />

      <SupplierList
        suppliers={suppliers}
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
        <p className="mt-4 text-sm text-muted-foreground">
          Loading suppliers...
        </p>
      )}

      <SupplierForm
        open={formOpen}
        mode={formMode}
        data={formData}
        errors={formErrors}
        onClose={() => setFormOpen(false)}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />

      <SupplierViewModal
        open={Boolean(viewTarget)}
        supplier={viewTarget}
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
            Are you sure you want to delete supplier{" "}
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
