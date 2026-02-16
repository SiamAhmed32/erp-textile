"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, Flex, PrimaryText } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { useGetAllQuery, useGetByIdQuery, usePatchMutation } from "@/store/services/commonApi";
import { InvoiceFormData, InvoiceTerms, OrderSummary, InvoiceApiItem } from "./types";
import { invoiceSchema, toFieldErrors } from "./validation";
import { normalizeInvoice, toInvoiceFormData, toInvoicePayload } from "./helpers";
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
    const { data: invoicePayload, isFetching: loading, error: invoiceError } = useGetByIdQuery({
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
                body: toInvoicePayload(draft),
                invalidate: ["invoices"],
            }).unwrap();
            router.push(`/invoice-management/invoices/${id}`);
        } catch (err: any) {
            const message =
                err?.data?.error?.message ||
                err?.data?.message ||
                err?.error ||
                err?.message ||
                "Failed to save invoice";
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Container className="pb-10 pt-6">
            <Flex className="flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <Button variant="outline" asChild>
                        <Link href={`/invoice-management/invoices/${id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Invoice Details
                        </Link>
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/invoice-management/invoices/${id}`}>Cancel</Link>
                    </Button>
                    <Button className="bg-black text-white hover:bg-black/90" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </Flex>

            {error && <PrimaryText className="mt-4 text-sm text-destructive">{error}</PrimaryText>}
            {loading && <PrimaryText className="mt-2 text-sm text-muted-foreground">Loading invoice...</PrimaryText>}

            <div className="mt-4" />

            <InvoiceForm
                data={draft}
                orders={orders}
                terms={terms}
                onChange={handleChange}
                errors={errors}
                disableOrder
            />
        </Container>
    );
};

export default InvoiceEdit;
