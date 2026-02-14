"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, Flex, PrimaryHeading, PrimaryText } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { apiRequest, extractArray, extractItem, getApiBaseUrl } from "@/lib/api";
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

const OrderCreate = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const duplicateId = searchParams.get("duplicateId");

    const [draft, setDraft] = React.useState<OrderFormData>(emptyOrder);
    const [activeStep, setActiveStep] = React.useState(0);
    const [buyers, setBuyers] = React.useState<Buyer[]>([]);
    const [companies, setCompanies] = React.useState<CompanyProfile[]>([]);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState("");
    const [errors, setErrors] = React.useState<FormErrors>({});

    React.useEffect(() => {
        const fetchOptions = async () => {
            try {
                const buyersPayload = await apiRequest("/buyers?page=1&limit=100");
                const companiesPayload = await apiRequest("/company-profiles?page=1&limit=100");
                setBuyers(extractArray<Buyer>(buyersPayload));
                setCompanies(extractArray<CompanyProfile>(companiesPayload));
            } catch (err: any) {
                setError(err.message || "Failed to load options");
            }
        };
        fetchOptions();
    }, []);

    React.useEffect(() => {
        const loadDuplicate = async () => {
            if (!duplicateId) return;
            try {
                const payload = await apiRequest(`/orders/${duplicateId}`);
                const item = extractItem<OrderApiItem>(payload);
                if (!item) return;
                const normalized = normalizeOrder(item);
                const form = toOrderFormData(normalized);
                form.orderNumber = "";
                form.status = "DRAFT";
                setDraft(form);
            } catch (err) {
                // ignore
            }
        };
        loadDuplicate();
    }, [duplicateId]);

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
            const response = await fetch(`${getApiBaseUrl()}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(toOrderPayload(draft)),
            });
            const text = await response.text();
            if (!response.ok) {
                throw new Error(text || "Failed to create order");
            }
            const payload = text ? JSON.parse(text) : {};
            const item = extractItem<OrderApiItem>(payload);
            const normalized = item ? normalizeOrder(item) : null;
            if (normalized?.id) {
                router.push(`/order-management/orders/${normalized.id}`);
            } else {
                router.push(`/order-management/orders`);
            }
        } catch (err: any) {
            setError(err.message || "Failed to create order");
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
