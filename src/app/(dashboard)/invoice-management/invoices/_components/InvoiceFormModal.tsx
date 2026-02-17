"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useGetAllQuery,
  useGetByIdQuery,
  usePostMutation,
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
import { toast } from "react-toastify";

export type InvoiceFormMode = "create" | "edit";

type Props = {
  open: boolean;
  mode: InvoiceFormMode;
  invoiceId?: string;
  onClose: () => void;
  onSuccess?: () => void;
};

type FormErrors = Partial<Record<keyof InvoiceFormData, string>>;

const emptyInvoice: InvoiceFormData = {
  piNumber: "",
  date: "",
  orderId: "",
  invoiceTermsId: "",
  status: "DRAFT",
};

export function InvoiceFormModal({
  open,
  mode,
  invoiceId,
  onClose,
  onSuccess,
}: Props) {
  const isCreate = mode === "create";
  const [draft, setDraft] = React.useState<InvoiceFormData>(emptyInvoice);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [postItem] = usePostMutation();
  const [patchItem] = usePatchMutation();

  const { data: ordersPayload } = useGetAllQuery({
    path: "orders",
    page: 1,
    limit: 100,
  });
  const { data: termsPayload } = useGetAllQuery({
    path: "invoice-terms",
    page: 1,
    limit: 100,
    search: "",
    sort: null,
  });
  const { data: invoicePayload, isFetching: loadingInvoice } = useGetByIdQuery(
    {
      path: "invoices",
      id: invoiceId || "",
    },
    { skip: isCreate || !invoiceId },
  );

  const orders = ((ordersPayload as any)?.data || []) as OrderSummary[];
  const terms = ((termsPayload as any)?.data || []) as InvoiceTerms[];

  // Load invoice data for edit mode
  React.useEffect(() => {
    if (isCreate) {
      setDraft(emptyInvoice);
      setErrors({});
      return;
    }

    const item = (invoicePayload as any)?.data as InvoiceApiItem | undefined;
    if (!item) return;
    const normalized = normalizeInvoice(item);
    setDraft(toInvoiceFormData(normalized));
  }, [invoicePayload, isCreate, open]);

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      setDraft(emptyInvoice);
      setErrors({});
    }
  }, [open]);

  const handleChange = (field: keyof InvoiceFormData, value: any) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const schemaResult = invoiceSchema.safeParse(draft);
    const nextErrors: FormErrors = schemaResult.success
      ? {}
      : (toFieldErrors(schemaResult.error.issues) as FormErrors);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      if (isCreate) {
        await postItem({
          path: "invoices",
          body: toInvoicePayload(draft),
          invalidate: ["invoices"],
        }).unwrap();
        toast.success("Invoice created successfully");
      } else {
        await patchItem({
          path: `invoices/${invoiceId}`,
          body: toInvoicePayload(draft),
          invalidate: ["invoices"],
        }).unwrap();
        toast.success("Invoice updated successfully");
      }

      setDraft(emptyInvoice);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        err?.error ||
        err?.message ||
        `Failed to ${isCreate ? "create" : "update"} invoice`;
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const title = isCreate ? "Create Proforma Invoice" : "Edit Proforma Invoice";
  const description = isCreate
    ? "Create a new proforma invoice for an order with terms and conditions."
    : "Update invoice information to keep records accurate and consistent.";

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {loadingInvoice && !isCreate ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading invoice...
          </div>
        ) : (
          <>
            <InvoiceForm
              data={draft}
              orders={orders}
              terms={terms}
              onChange={handleChange}
              errors={errors}
              disableOrder={!isCreate}
            />

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="bg-black text-white hover:bg-black/90"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : isCreate
                    ? "Create Invoice"
                    : "Save Changes"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
