"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  PrimaryHeading,
  PrimaryText,
  SectionGap,
} from "@/components/reusables";
import { Supplier, SupplierFormData } from "./types";
import { SupplierDetail } from "./SupplierDetail";
import { SupplierForm } from "./SupplierForm";
import { useGetByIdQuery, usePatchMutation } from "@/store/services/commonApi";
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

export function SupplierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [supplier, setSupplier] = React.useState<Supplier | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [formData, setFormData] =
    React.useState<SupplierFormData>(emptySupplier);
  const [patchItem] = usePatchMutation();
  const {
    data: supplierPayload,
    error: supplierError,
    refetch,
    isFetching,
  } = useGetByIdQuery({ path: "suppliers", id: id || "" }, { skip: !id });

  React.useEffect(() => {
    const item = (supplierPayload as any)?.data as Supplier | undefined;
    if (!item) return;
    setSupplier(item);
  }, [supplierPayload]);

  React.useEffect(() => {
    const parsed = supplierError as any;
    if (!parsed) return;
    const message =
      parsed?.data?.error?.message ||
      parsed?.data?.message ||
      "Could not load the supplier details. Please try again.";
    notify.error(message);
  }, [supplierError]);

  if (isFetching) {
    return (
      <Container className="py-8">
        <p className="text-sm text-zinc-500">Loading supplier details...</p>
      </Container>
    );
  }

  if (!supplier) {
    return (
      <Container className="py-8">
        <PrimaryHeading>Supplier Not Found</PrimaryHeading>
        <PrimaryText className="text-muted-foreground mt-2">
          The supplier you are looking for does not exist.
        </PrimaryText>
        <SectionGap />
        <button
          className="text-sm text-primary underline"
          onClick={() => router.push("/suppliers")}
        >
          Back to Suppliers
        </button>
      </Container>
    );
  }

  const handleEdit = () => {
    setFormData({ ...supplier });
    setFormOpen(true);
  };

  const handleFormChange = (
    field: keyof SupplierFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async () => {
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
      await patchItem({
        path: `suppliers/${supplier.id}`,
        body: payload,
        invalidate: ["suppliers"],
      }).unwrap();
      notify.success("Supplier updated successfully");
      setFormOpen(false);
      refetch();
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        "Could not update the supplier. Please try again.";
      notify.error(message);
    }
  };

  return (
    <Container className="py-8">
      <div className="space-y-2">
        <PrimaryHeading>Supplier Details</PrimaryHeading>
        <PrimaryText className="text-muted-foreground">
          Review and update supplier information.
        </PrimaryText>
      </div>

      <SectionGap />

      <SupplierDetail supplier={supplier} onEdit={handleEdit} />

      <SupplierForm
        open={formOpen}
        mode="edit"
        data={formData}
        onClose={() => setFormOpen(false)}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />
    </Container>
  );
}
