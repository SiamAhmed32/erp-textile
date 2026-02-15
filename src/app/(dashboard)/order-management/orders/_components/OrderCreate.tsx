"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, Flex, PrimaryHeading, PrimaryText } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { useGetAllQuery, useGetByIdQuery, usePostMutation } from "@/store/services/commonApi";
import { Order, OrderApiItem, OrderFormData, Buyer, CompanyProfile } from "./types";
import { normalizeOrder, toOrderFormData, toOrderPayload } from "./helpers";
import OrderForm from "./OrderForm";
import { orderSchema, toFieldErrors } from "./validation";

type FormErrors = Partial<Record<keyof OrderFormData, string>>;

const emptyOrder: OrderFormData = {
    orderNumber: "",
    orderDate: "",
    remarks: "",
    productType: "FABRIC",
    buyerId: "",
    companyProfileId: "",
    status: "DRAFT",
    deliveryDate: "",
    orderItems: {},
};

const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split(".");
    const last = keys.pop();
    let current = obj;
    keys.forEach((key) => {
        if (!current[key]) current[key] = {};
        current = current[key];
    });
    if (last) current[last] = value;
};

type Props = {
    duplicateId?: string;
};

const OrderCreate = ({ duplicateId }: Props) => {
    const router = useRouter();

    const [draft, setDraft] = React.useState<OrderFormData>(emptyOrder);
    const [activeStep, setActiveStep] = React.useState(0);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState("");
    const [errors, setErrors] = React.useState<FormErrors>({});
    const [postItem] = usePostMutation();

    const { data: buyersPayload, error: buyersError } = useGetAllQuery({
        path: "buyers",
        page: 1,
        limit: 100,
    });
    const { data: companiesPayload, error: companiesError } = useGetAllQuery({
        path: "company-profiles",
        page: 1,
        limit: 100,
    });
    const { data: duplicatePayload, error: duplicateError } = useGetByIdQuery(
        {
            path: "orders",
            id: duplicateId || "",
        },
        { skip: !duplicateId }
    );

    const buyers = ((buyersPayload as any)?.data || []) as Buyer[];
    const companies = ((companiesPayload as any)?.data || []) as CompanyProfile[];

    React.useEffect(() => {
        if (!duplicateId) return;
        const item = (duplicatePayload as any)?.data as OrderApiItem | undefined;
        if (!item) return;
        const normalized = normalizeOrder(item);
        const form = toOrderFormData(normalized);
        form.orderNumber = "";
        form.status = "DRAFT";
        setDraft(form);
    }, [duplicatePayload, duplicateId]);

    React.useEffect(() => {
        const parsed = (buyersError || companiesError || duplicateError) as any;
        if (!parsed) return;
        const message =
            parsed?.data?.error?.message ||
            parsed?.data?.message ||
            parsed?.error ||
            "Failed to load options";
        setError(message);
    }, [buyersError, companiesError, duplicateError]);

    const handleChange = (field: keyof OrderFormData, value: any) => {
        setDraft((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleNestedChange = (path: string, value: any) => {
        setDraft((prev) => {
            const next = { ...prev, orderItems: { ...prev.orderItems } };
            setNestedValue(next, path, value);
            return next;
        });
    };

    const handleSave = async () => {
        const schemaResult = orderSchema.safeParse(draft);
        const nextErrors: FormErrors = schemaResult.success
            ? {}
            : (toFieldErrors(schemaResult.error.issues) as FormErrors);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setSaving(true);
        setError("");
        try {
            const payload = (await postItem({
                path: "orders",
                body: toOrderPayload(draft),
                invalidate: ["orders"],
            }).unwrap()) as any;
            const item = (payload?.data || payload) as OrderApiItem;
            const normalized = item ? normalizeOrder(item) : null;
            if (normalized?.id) {
                router.push(`/order-management/orders/${normalized.id}`);
            } else {
                router.push(`/order-management/orders`);
            }
        } catch (err: any) {
            const message =
                err?.data?.error?.message ||
                err?.data?.message ||
                err?.error ||
                err?.message ||
                "Failed to create order";
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
                        <Link href="/order-management/orders">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Orders
                        </Link>
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/order-management/orders">Cancel</Link>
                    </Button>
                    <Button className="bg-black text-white hover:bg-black/90" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Order"}
                    </Button>
                </div>
            </Flex>

            {error && <PrimaryText className="text-sm text-destructive">{error}</PrimaryText>}

            <OrderForm
                data={draft}
                buyers={buyers}
                companies={companies}
                activeStep={activeStep}
                onStepChange={setActiveStep}
                onChange={handleChange}
                onNestedChange={handleNestedChange}
                errors={errors}
            />
        </Container>
    );
};

export default OrderCreate;
