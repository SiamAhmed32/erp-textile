"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, Flex, PrimaryText } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { apiRequest, extractArray, getApiBaseUrl } from "@/lib/api";
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
    const [orders, setOrders] = React.useState<OrderSummary[]>([]);
    const [terms, setTerms] = React.useState<InvoiceTerms[]>([]);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState("");
    const [errors, setErrors] = React.useState<FormErrors>({});

    React.useEffect(() => {
        const fetchOptions = async () => {
            try {
                const ordersPayload = await apiRequest("/orders?page=1&limit=100");
                const termsPayload = await apiRequest("/invoice-terms?page=1&limit=100");
                setOrders(extractArray<OrderSummary>(ordersPayload));
                setTerms(extractArray<InvoiceTerms>(termsPayload));
            } catch (err: any) {
                setError(err.message || "Failed to load options");
            }
        };
        fetchOptions();
    }, []);

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
            const response = await fetch(`${getApiBaseUrl()}/invoices`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(toInvoicePayload(draft)),
            });
            const text = await response.text();
            if (!response.ok) {
                throw new Error(text || "Failed to create invoice");
            }
            const payload = text ? JSON.parse(text) : {};
            const id = payload?.data?.id || payload?.id;
            if (id) {
                router.push(`/invoice-management/invoices/${id}`);
            } else {
                router.push(`/invoice-management/invoices`);
            }
        } catch (err: any) {
            setError(err.message || "Failed to create invoice");
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
                    <Button className="bg-black text-white hover:bg-black/90" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Invoice"}
                    </Button>
                </div>
            </Flex>

            {error && <PrimaryText className="mt-4 text-sm text-destructive">{error}</PrimaryText>}

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
