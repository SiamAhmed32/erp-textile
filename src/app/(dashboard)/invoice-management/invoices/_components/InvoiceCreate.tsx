"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container, FormHeader, FormFooter } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import {
  useGetAllQuery,
  usePostMutation,
  useGetByIdQuery,
} from "@/store/services/commonApi";
import {
  InvoiceFormData,
  InvoiceTerms,
  OrderSummary,
  InvoiceApiItem,
} from "./types";
import { invoiceSchema, toFieldErrors } from "./validation";
import {
  normalizeInvoice,
  toInvoiceFormData,
  toInvoicePayload,
} from "./helpers";
import InvoiceForm from "./InvoiceForm";

type FormErrors = Partial<Record<keyof InvoiceFormData, string>>;
// note:
const emptyInvoice: InvoiceFormData = {
  piNumber: "",
  date: "",
  orderId: "",
  invoiceTermsId: "",
  status: "DRAFT",
};

type Props = {
  duplicateId?: string;
};

const InvoiceCreate = ({ duplicateId }: Props) => {
  const router = useRouter();
  const [draft, setDraft] = React.useState<InvoiceFormData>(emptyInvoice);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [postItem] = usePostMutation();
  const { data: ordersPayload, error: ordersError } = useGetAllQuery({
    path: "orders",
    page: 1,
    limit: 100,
  });
  const { data: termsPayload, error: termsError } = useGetAllQuery({
    path: "invoice-terms",
    page: 1,
    limit: 100,
    search: "",
    sort: null,
  });
  const { data: duplicatePayload, error: duplicateError } = useGetByIdQuery(
    {
      path: "invoices",
      id: duplicateId || "",
    },
    { skip: !duplicateId },
  );
  const orders = ((ordersPayload as any)?.data || []) as OrderSummary[];
  const terms = ((termsPayload as any)?.data || []) as InvoiceTerms[];

  React.useEffect(() => {
    const parsed = (ordersError || termsError || duplicateError) as any;
    if (!parsed) return;
    const message =
      parsed?.data?.error?.message ||
      parsed?.data?.message ||
      parsed?.error ||
      "Failed to load options";
    console.error("Load Invoice Options Error:", message);
  }, [ordersError, termsError, duplicateError]);

  React.useEffect(() => {
    if (!duplicateId) return;
    const item = (duplicatePayload as any)?.data as InvoiceApiItem | undefined;
    if (!item) return;
    const normalized = normalizeInvoice(item);
    const form = toInvoiceFormData(normalized);
    const duplicatePi = Number.parseInt(
      String(form.piNumber || "").replace(/\D/g, ""),
      10,
    );
    form.piNumber = Number.isFinite(duplicatePi) ? String(duplicatePi) : "";
    form.status = "DRAFT";
    setDraft(form);
  }, [duplicatePayload, duplicateId]);

  const handleChange = (field: keyof InvoiceFormData, value: any) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSave = async () => {
    const schemaResult = invoiceSchema.safeParse(draft);
    const nextErrors: FormErrors = schemaResult.success
      ? {}
      : (toFieldErrors(schemaResult.error.issues) as FormErrors);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const payload = (await postItem({
        path: "invoices",
        body: toInvoicePayload(draft),
        invalidate: ["invoices"],
      }).unwrap()) as any;
      const id = payload?.data?.id || payload?.id;
      if (id) {
        router.push(`/invoice-management/invoices/${id}`);
      } else {
        router.push(`/invoice-management/invoices`);
      }
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        "Could not create the invoice. Please try again.";
      console.error("Create Invoice Error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Dynamic Progress Calculation for Invoice
  const progressData = React.useMemo(() => {
    const fieldsToTrack: (keyof InvoiceFormData)[] = [
      "piNumber",
      "date",
      "orderId",
      "invoiceTermsId",
    ];

    const total = fieldsToTrack.length;
    const filled = fieldsToTrack.filter((key) => {
      const val = draft[key];
      if (typeof val === "string") return val.trim().length > 0;
      return !!val;
    }).length;

    return {
      percentage: Math.round((filled / total) * 100),
      count: filled,
      total,
    };
  }, [draft]);

  return (
    <Container className="pb-10 pt-6">
      <FormHeader
        title="Create Invoice (PI)"
        backHref="/invoice-management/invoices"
        breadcrumbItems={[
          { label: "Invoice Management", href: "/invoice-management/invoices" },
          { label: "Invoices", href: "/invoice-management/invoices" },
          { label: "Create" },
        ]}
        progress={progressData}
      />

      <div className="mt-8">
        <InvoiceForm
          data={draft}
          orders={orders}
          terms={terms}
          onChange={handleChange}
          errors={errors}
        />
      </div>

      <FormFooter
        cancelHref="/invoice-management/invoices"
        onSave={handleSave}
        saving={saving}
        saveLabel="Create Invoice"
        trustText="Proforma Invoices are generated as legal trade documents."
      />
    </Container>
  );
};

export default InvoiceCreate;
