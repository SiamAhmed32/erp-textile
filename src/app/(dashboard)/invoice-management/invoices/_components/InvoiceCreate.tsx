"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, Flex, PrimaryText } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { useGetAllQuery, usePostMutation } from "@/store/services/commonApi";
import { InvoiceFormData, InvoiceTerms, OrderSummary } from "./types";
import { invoiceSchema, toFieldErrors } from "./validation";
import { toInvoicePayload } from "./helpers";
import InvoiceForm from "./InvoiceForm";

type FormErrors = Partial<Record<keyof InvoiceFormData, string>>;

const emptyInvoice: InvoiceFormData = {
  piNumber: "",
  date: "",
  orderId: "",
  invoiceTermsId: "",
  status: "DRAFT",
};

const InvoiceCreate = () => {
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

  });
  const orders = ((ordersPayload as any)?.data || []) as OrderSummary[];
  const terms = ((termsPayload as any)?.data || []) as InvoiceTerms[];

  React.useEffect(() => {
    const parsed = (ordersError || termsError) as any;
    if (!parsed) return;
    const message =
      parsed?.data?.error?.message ||
      parsed?.data?.message ||
      parsed?.error ||
      "Failed to load options";
    console.error("Load Invoice Options Error:", message);
  }, [ordersError, termsError]);

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
        err?.error ||
        err?.message ||
        "Failed to create invoice";
      console.error("Create Invoice Error:", message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="pb-10 pt-6">
      <Flex className="flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Button variant="outline" asChild>
            <Link href="/invoice-management/invoices">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Invoices
            </Link>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/invoice-management/invoices">Cancel</Link>
          </Button>
          <Button
            className="bg-black text-white hover:bg-black/90"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Invoice"}
          </Button>
        </div>
      </Flex>

      <div className="mt-4" />

      <InvoiceForm
        data={draft}
        orders={orders}
        terms={terms}
        onChange={handleChange}
        errors={errors}
      />
    </Container>
  );
};

export default InvoiceCreate;
