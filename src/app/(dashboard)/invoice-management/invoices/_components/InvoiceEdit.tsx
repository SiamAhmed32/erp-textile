"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Container,
  PrimaryText,
  FormHeader,
  FormFooter,
  FormSkeleton,
} from "@/components/reusables";
import { Button } from "@/components/ui/button";
import {
  useGetAllQuery,
  useGetByIdQuery,
  usePatchMutation,
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

type Props = {
  id: string;
};

type FormErrors = Partial<Record<keyof InvoiceFormData, string>>;

const emptyInvoice: InvoiceFormData = {
  piNumber: "",
  date: "",
  orderId: "",
  invoiceTermsId: "",
  status: "DRAFT",
};

const InvoiceEdit = ({ id }: Props) => {
  const router = useRouter();
  const [draft, setDraft] = React.useState<InvoiceFormData>(emptyInvoice);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [patchItem] = usePatchMutation();
  const { data: ordersPayload, error: ordersError } = useGetAllQuery({
    path: "orders",
    page: 1,
    limit: 100,
  });
  const { data: termsPayload, error: termsError } = useGetAllQuery({
    path: "invoice-terms",
    page: 1,
    limit: 100,
  });
  const {
    data: invoicePayload,
    isFetching: loading,
    error: invoiceError,
  } = useGetByIdQuery({
    path: "invoices",
    id,
  });
  const orders = ((ordersPayload as any)?.data || []) as OrderSummary[];
  const terms = ((termsPayload as any)?.data || []) as InvoiceTerms[];

  React.useEffect(() => {
    const item = (invoicePayload as any)?.data as InvoiceApiItem | undefined;
    if (!item) return;
    const normalized = normalizeInvoice(item);
    setDraft(toInvoiceFormData(normalized));
  }, [invoicePayload]);

  React.useEffect(() => {
    const parsed = (ordersError || termsError || invoiceError) as any;
    if (!parsed) return;
    const message =
      parsed?.data?.error?.message ||
      parsed?.data?.message ||
      parsed?.error ||
      "Failed to load invoice";
    setError(message);
  }, [ordersError, termsError, invoiceError]);

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
    setError("");
    try {
      await patchItem({
        path: `invoices/${id}`,
        body: toInvoicePayload(draft, true),
        invalidate: ["invoices"],
      }).unwrap();
      router.push(`/invoice-management/invoices/${id}`);
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        "Could not save the invoice. Please try again.";
      setError(message);
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
        title="Edit Invoice"
        backHref={`/invoice-management/invoices/${id}`}
        breadcrumbItems={[
          { label: "Dashboard", href: "/" },
          { label: "Invoices", href: "/invoice-management/invoices" },
          { label: "Edit" },
        ]}
        progress={progressData}
      />

      <div className="mt-8">
        {error && (
          <PrimaryText className="mb-6 text-sm text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20 font-bold">
            {error}
          </PrimaryText>
        )}

        {loading ? (
          <FormSkeleton sections={2} />
        ) : (
          <InvoiceForm
            data={draft}
            orders={orders}
            terms={terms}
            onChange={handleChange}
            errors={errors}
            disableOrder
          />
        )}

        <FormFooter
          cancelHref={`/invoice-management/invoices/${id}`}
          onSave={handleSave}
          saving={saving}
          saveLabel="Save Changes"
          trustText="All invoice data is encrypted and stored according to industry standards."
        />
      </div>
    </Container>
  );
};

export default InvoiceEdit;
