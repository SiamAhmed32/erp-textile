"use client";

import React from "react";
import { Container, PageHeader, SectionGap } from "@/components/reusables";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InvoiceTerms,
  InvoiceTermsErrors,
  InvoiceTermsFormData,
} from "./types";
import { InvoiceTermsList } from "./InvoiceTermsList";
import { InvoiceTermsForm } from "./InvoiceTermsForm";
import { InvoiceTermsViewModal } from "./InvoiceTermsViewModal";
import { DeleteConfirmDialog } from "../shared/DeleteConfirmDialog";
import {
  useGetAllQuery,
  usePatchMutation,
  usePostMutation,
  usePutMutation,
} from "@/store/services/commonApi";

const emptyTerms: InvoiceTermsFormData = {
  name: "",
  payment: "",
  delivery: "",
  advisingBank: "",
  negotiation: "",
  origin: "",
  swiftCode: "",
  binNo: "",
  hsCode: "",
  remarks: "",
};

const validate = (data: InvoiceTermsFormData): InvoiceTermsErrors => {
  const errors: InvoiceTermsErrors = {};
  if (!data.name.trim()) errors.name = "Name is required";
  if (data.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters";
  if (!data.payment.trim()) errors.payment = "Payment terms are required";
  if (data.payment.trim().length < 2)
    errors.payment = "Payment must be at least 2 characters";
  if (!data.delivery.trim()) errors.delivery = "Delivery terms are required";
  if (data.delivery.trim().length < 2)
    errors.delivery = "Delivery must be at least 2 characters";
  if (!data.advisingBank.trim())
    errors.advisingBank = "Advising bank is required";
  if (data.advisingBank.trim().length < 2)
    errors.advisingBank = "Advising bank must be at least 2 characters";
  if (!data.negotiation.trim())
    errors.negotiation = "Negotiation terms are required";
  if (data.negotiation.trim().length < 2)
    errors.negotiation = "Negotiation must be at least 2 characters";
  if (!data.origin.trim()) errors.origin = "Origin is required";
  if (data.origin.trim().length < 2)
    errors.origin = "Origin must be at least 2 characters";
  if (!data.swiftCode.trim()) errors.swiftCode = "SWIFT code is required";
  if (data.swiftCode.trim().length < 4)
    errors.swiftCode = "SWIFT code must be at least 4 characters";
  if (!data.binNo.trim()) errors.binNo = "BIN is required";
  if (data.binNo.trim().length < 3)
    errors.binNo = "BIN must be at least 3 characters";
  if (!data.hsCode.trim()) errors.hsCode = "H.S. code is required";
  if (data.hsCode.trim().length < 3)
    errors.hsCode = "H.S. code must be at least 3 characters";
  return errors;
};

export function InvoiceTermsManagementPage() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState<{
    field: string;
    dir: "asc" | "desc";
  }>({
    field: "name",
    dir: "asc",
  });
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [formData, setFormData] =
    React.useState<InvoiceTermsFormData>(emptyTerms);
  const [formErrors, setFormErrors] = React.useState<InvoiceTermsErrors>({});
  const [deleteTarget, setDeleteTarget] = React.useState<InvoiceTerms | null>(
    null,
  );
  const [viewTarget, setViewTarget] = React.useState<InvoiceTerms | null>(null);
  const [postItem] = usePostMutation();
  const [patchItem] = usePatchMutation();
  const [putItem] = usePutMutation();
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const {
    data: termsPayload,
    isFetching: loading,
    error: termsError,
    refetch,
  } = useGetAllQuery({
    path: "invoice-terms",
    page,
    limit: 10,
    search: debouncedSearch,
    sortBy: sort.field,
    sortOrder: sort.dir,
  });
  const terms = ((termsPayload as any)?.data || []) as InvoiceTerms[];
  const totalPages = (termsPayload as any)?.meta?.pagination?.totalPages || 1;

  React.useEffect(() => {
    const parsed = termsError as any;
    if (!parsed) return;
    const message =
      parsed?.data?.error?.message ||
      parsed?.data?.message ||
      parsed?.error ||
      "Failed to load terms";
    console.error("Invoice Terms Error:", message);
  }, [termsError]);

  const handleCreate = () => {
    setFormMode("create");
    setFormData(emptyTerms);
    setFormErrors({});
    setFormOpen(true);
  };

  const handleEdit = (item: InvoiceTerms) => {
    setFormMode("edit");
    setFormData({ ...item });
    setFormErrors({});
    setFormOpen(true);
  };

  const handleDelete = (item: InvoiceTerms) => {
    setDeleteTarget(item);
  };

  const handleView = (item: InvoiceTerms) => {
    setViewTarget(item);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await patchItem({
        path: `invoice-terms/${deleteTarget.id}`,
        body: { isDeleted: true },
        invalidate: ["invoice-terms"],
      }).unwrap();
      refetch();
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        "Could not delete the invoice terms. Please try again.";
      console.error("Delete Invoice Terms Error:", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleFormChange = (
    field: keyof InvoiceTermsFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async () => {
    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const payload = {
        name: formData.name,
        payment: formData.payment,
        delivery: formData.delivery,
        advisingBank: formData.advisingBank,
        negotiation: formData.negotiation,
        origin: formData.origin,
        swiftCode: formData.swiftCode,
        binNo: formData.binNo,
        hsCode: formData.hsCode,
        remarks: formData.remarks,
      };
      if (formMode === "create") {
        await postItem({
          path: "invoice-terms",
          body: payload,
          invalidate: ["invoice-terms"],
        }).unwrap();
      } else if (formMode === "edit" && formData.id) {
        await patchItem({
          path: `invoice-terms/${formData.id}`,
          body: payload,
          invalidate: ["invoice-terms"],
        }).unwrap();
      }
      setFormOpen(false);
      refetch();
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        "Could not save the invoice terms. Please try again.";
      console.error("Save Invoice Terms Error:", err);
    }
  };

  return (
    <Container className="py-8">
      <PageHeader
        title="Invoice Terms"
        breadcrumbItems={[
          //{ label: "Dashboard", href: "/" },
          { label: "Invoice Terms" },
        ]}
        actions={
          <Button
            className="bg-black text-white hover:bg-black/90 shadow-sm"
            onClick={handleCreate}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Terms
          </Button>
        }
      />

      <InvoiceTermsList
        terms={terms}
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
      />

      <InvoiceTermsForm
        open={formOpen}
        mode={formMode}
        data={formData}
        errors={formErrors}
        onClose={() => setFormOpen(false)}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />

      <InvoiceTermsViewModal
        open={Boolean(viewTarget)}
        terms={viewTarget}
        onClose={() => setViewTarget(null)}
        onEdit={handleEdit}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Invoice Terms?"
        description="This will remove the template from active use. You can recreate it later if needed."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </Container>
  );
}
