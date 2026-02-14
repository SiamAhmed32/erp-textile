"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, Flex, PrimaryHeading, PrimaryText } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { apiRequest, extractArray, extractItem, getApiBaseUrl } from "@/lib/api";
import { Order, OrderApiItem, OrderFormData, Buyer, CompanyProfile } from "./types";
import { normalizeOrder, toOrderFormData, toOrderUpdatePayload } from "./helpers";
import OrderForm from "./OrderForm";
import { orderSchema, toFieldErrors } from "./validation";

type Props = {
    id: string;
};

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

const OrderEdit = ({ id }: Props) => {
    const router = useRouter();
    const [draft, setDraft] = React.useState<OrderFormData>(emptyOrder);
    const [activeStep, setActiveStep] = React.useState(0);
    const [buyers, setBuyers] = React.useState<Buyer[]>([]);
    const [companies, setCompanies] = React.useState<CompanyProfile[]>([]);
    const [saving, setSaving] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [errors, setErrors] = React.useState<FormErrors>({});
    const [originalStatus, setOriginalStatus] = React.useState<OrderFormData["status"]>("DRAFT");

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
        const fetchOrder = async () => {
            setLoading(true);
            setError("");
            try {
                const payload = await apiRequest(`/orders/${id}`);
                const item = extractItem<OrderApiItem>(payload);
                if (!item) return;
                const normalized = normalizeOrder(item);
                const form = toOrderFormData(normalized);
                setDraft(form);
                setOriginalStatus(form.status);
            } catch (err: any) {
                setError(err.message || "Failed to load order");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

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
            const response = await fetch(`${getApiBaseUrl()}/orders/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(toOrderUpdatePayload(draft)),
            });
            const text = await response.text();
            if (!response.ok) {
                throw new Error(text || "Failed to save order");
            }

            if (draft.status !== originalStatus) {
                const statusResponse = await fetch(`${getApiBaseUrl()}/orders/${id}/status`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: draft.status }),
                });
                const statusText = await statusResponse.text();
                if (!statusResponse.ok) {
                    throw new Error(statusText || "Failed to update status");
                }
            }

            router.push(`/order-management/orders/${id}`);
        } catch (err: any) {
            setError(err.message || "Failed to save order");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Container className="pb-10 pt-6">
            <Flex className="flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <Button variant="outline" asChild>
                        <Link href={`/order-management/orders/${id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Order Details
                        </Link>
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/order-management/orders/${id}`}>Cancel</Link>
                    </Button>
                    <Button className="bg-black text-white hover:bg-black/90" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </Flex>

            {error && <PrimaryText className="text-sm text-destructive">{error}</PrimaryText>}
            {loading && <PrimaryText className="text-sm text-muted-foreground">Loading order...</PrimaryText>}

            <OrderForm
                data={draft}
                buyers={buyers}
                companies={companies}
                activeStep={activeStep}
                onStepChange={setActiveStep}
                onChange={handleChange}
                onNestedChange={handleNestedChange}
                errors={errors}
                disableProductType
            />
        </Container>
    );
};

export default OrderEdit;
