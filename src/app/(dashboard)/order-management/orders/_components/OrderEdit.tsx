"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Container,
  Flex,
  PrimaryHeading,
  PrimaryText,
} from "@/components/reusables";
import { Button } from "@/components/ui/button";
import {
  useGetAllQuery,
  useGetByIdQuery,
  usePatchMutation,
  usePutMutation,
} from "@/store/services/commonApi";
import {
  Order,
  OrderApiItem,
  OrderFormData,
  Buyer,
  CompanyProfile,
} from "./types";
import {
  normalizeOrder,
  toOrderFormData,
  toOrderUpdatePayload,
} from "./helpers";
import OrderForm from "./OrderForm";
import { OrderValidation, toFieldErrors } from "./validation";

type Props = {
  id: string;
};

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
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [originalStatus, setOriginalStatus] =
    React.useState<OrderFormData["status"]>("DRAFT");
  const [patchItem] = usePatchMutation();
  const [putItem] = usePutMutation();

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
  const {
    data: orderPayload,
    isFetching: loading,
    error: orderError,
  } = useGetByIdQuery({
    path: "orders",
    id,
  });
  const buyers = ((buyersPayload as any)?.data || []) as Buyer[];
  const companies = ((companiesPayload as any)?.data || []) as CompanyProfile[];

  React.useEffect(() => {
    const item = (orderPayload as any)?.data as OrderApiItem | undefined;
    if (!item) return;
    const normalized = normalizeOrder(item);
    const form = toOrderFormData(normalized);
    setDraft(form);
    setOriginalStatus(form.status);
  }, [orderPayload]);

  React.useEffect(() => {
    const parsed = (buyersError || companiesError || orderError) as any;
    if (!parsed) return;
    const message =
      parsed?.data?.error?.message ||
      parsed?.data?.message ||
      parsed?.error ||
      "Failed to load order";
    console.error("Load Order Options Error:", message);
  }, [buyersError, companiesError, orderError]);

  const handleChange = (field: keyof OrderFormData, value: any) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleNestedChange = (path: string, value: any) => {
    setDraft((prev) => {
      const next = { ...prev, orderItems: { ...prev.orderItems } };
      setNestedValue(next, path, value);
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[path];
      return next;
    });
  };

  const handleValidateStep = (stepIndex: number) => {
    // We use .create for step validation to ensure completeness even during edits
    const schemaResult = OrderValidation.create.safeParse(draft);
    if (schemaResult.success) {
      setErrors({});
      return true;
    }

    const allErrors = toFieldErrors(schemaResult.error.issues);
    const stepErrors: Record<string, string> = {};

    if (stepIndex === 0) {
      const fields = [
        "orderNumber",
        "orderDate",
        "buyerId",
        "companyProfileId",
        "productType",
      ];
      fields.forEach((f) => {
        if (allErrors[f]) stepErrors[f] = allErrors[f];
      });
    } else if (stepIndex === 1) {
      Object.keys(allErrors).forEach((key) => {
        if (key.startsWith("orderItems")) stepErrors[key] = allErrors[key];
      });
    } else if (stepIndex === 2) {
      if (allErrors["deliveryDate"])
        stepErrors["deliveryDate"] = allErrors["deliveryDate"];
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    const schemaResult = OrderValidation.update.safeParse(draft);
    if (!schemaResult.success) {
      const nextErrors = toFieldErrors(schemaResult.error.issues);
      setErrors(nextErrors);

      // --- Teleport to Error Logic ---
      const firstErrorKey = Object.keys(nextErrors)[0];
      const basicFields = [
        "orderNumber",
        "orderDate",
        "buyerId",
        "companyProfileId",
        "productType",
      ];

      if (basicFields.some((f) => firstErrorKey.startsWith(f))) {
        setActiveStep(0);
      } else if (firstErrorKey.startsWith("orderItems")) {
        setActiveStep(1);
      } else if (firstErrorKey.startsWith("deliveryDate")) {
        setActiveStep(2);
      }

      return;
    }
    setErrors({});

    setSaving(true);
    try {
      await patchItem({
        path: `orders/${id}`,
        body: toOrderUpdatePayload(draft),
        invalidate: ["orders"],
      }).unwrap();

      if (draft.status !== originalStatus) {
        await putItem({
          path: `orders/${id}/status`,
          body: { status: draft.status },
          invalidate: ["orders"],
        }).unwrap();
      }

      router.push(`/order-management/orders/${id}`);
    } catch (err: any) {
      const message =
        err?.data?.error?.message ||
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Failed to save order";
      console.error("Save Order Error:", message);
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
          <Button
            className="bg-black text-white hover:bg-black/90"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Flex>
      {loading && (
        <PrimaryText className="text-sm text-muted-foreground">
          Loading order...
        </PrimaryText>
      )}

      <OrderForm
        data={draft}
        buyers={buyers}
        companies={companies}
        activeStep={activeStep}
        onStepChange={setActiveStep}
        onChange={handleChange}
        onNestedChange={handleNestedChange}
        onValidateStep={handleValidateStep}
        errors={errors}
        disableProductType
      />
    </Container>
  );
};

export default OrderEdit;
