"use client";

import React from "react";
import {
  Container,
  PrimaryHeading,
  PrimaryText,
  SectionGap,
} from "@/components/reusables";
import {
  InvoiceTerms,
  InvoiceTermsErrors,
  InvoiceTermsFormData,
} from "./types";
import { InvoiceTermsList } from "./InvoiceTermsList";
import { InvoiceTermsForm } from "./InvoiceTermsForm";
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
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [formData, setFormData] =
    React.useState<InvoiceTermsFormData>(emptyTerms);
  const [formErrors, setFormErrors] = React.useState<InvoiceTermsErrors>({});
  const [deleteTarget, setDeleteTarget] = React.useState<InvoiceTerms | null>(
    null,
  );
  const [postItem] = usePostMutation();
  const [patchItem] = usePatchMutation();
  const [putItem] = usePutMutation();
  const {
    data: termsPayload,
    isFetching: loading,
    error: termsError,
    refetch,
  } = useGetAllQuery({
    path: "invoice-terms",
    page,
    limit: 10,
    search,
    sort: null,
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

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await putItem({
        path: `invoice-terms/${deleteTarget.id}`,
        body: { isDeleted: true },
        invalidate: ["invoice-terms"],
      }).unwrap();
      refetch();
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Failed to delete terms";
      console.error("Delete Invoice Terms Error:", message);
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
        err?.error ||
        err?.message ||
        "Failed to save terms";
      console.error("Save Invoice Terms Error:", message);
    }
  };

  return (
    <Container className="py-8">
      <div className="space-y-2">
        <PrimaryHeading>Invoice Terms</PrimaryHeading>
        <PrimaryText className="text-muted-foreground">
          Create and manage reusable invoice terms for consistent commercial
          documents.
        </PrimaryText>
      </div>

      <SectionGap />

      <InvoiceTermsList
        terms={terms}
        search={search}
        onSearchChange={setSearch}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
