"use client";

import React from "react";
import { useGetAllQuery, usePostMutation } from "@/store/services/commonApi";
import { InvoiceFormData, InvoiceTerms, OrderSummary } from "./types";
import { invoiceSchema, toFieldErrors } from "./validation";
import { toInvoicePayload } from "./helpers";
import InvoiceForm from "./InvoiceForm";
import { CustomModal } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

type FormErrors = Partial<Record<keyof InvoiceFormData, string>>;

const emptyInvoice: InvoiceFormData = {
    piNumber: "",
    date: "",
    orderId: "",
    invoiceTermsId: "",
    status: "DRAFT",
};

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const InvoiceCreateModal = ({ open, onOpenChange, onSuccess }: Props) => {
    const [draft, setDraft] = React.useState<InvoiceFormData>(emptyInvoice);
    const [saving, setSaving] = React.useState(false);
    const [errors, setErrors] = React.useState<FormErrors>({});
    const [postItem] = usePostMutation();

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

    const orders = ((ordersPayload as any)?.data || []) as OrderSummary[];
    const terms = ((termsPayload as any)?.data || []) as InvoiceTerms[];

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
            await postItem({
                path: "invoices",
                body: toInvoicePayload(draft),
                invalidate: ["invoices"],
            }).unwrap();

            toast.success("Invoice created successfully");
            setDraft(emptyInvoice);
            if (onSuccess) onSuccess();
            onOpenChange(false);
        } catch (err: any) {
            const message =
                err?.data?.error?.message ||
                err?.data?.message ||
                err?.error ||
                err?.message ||
                "Failed to create invoice";
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={onOpenChange}
            title="Create Invoice"
            maxWidth="900px"
            width="90vw"
        >
            <InvoiceForm
                data={draft}
                orders={orders}
                terms={terms}
                onChange={handleChange}
                errors={errors}
            />

            <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>
                <Button
                    className="bg-black text-white hover:bg-black/90"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Invoice"}
                </Button>
            </div>
        </CustomModal>
    );
};

export default InvoiceCreateModal;
