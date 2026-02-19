"use client";

import {
  Container,
  Flex
} from "@/components/reusables";
import { Button } from "@/components/ui/button";
import {
  useGetAllQuery,
  useGetByIdQuery,
  usePostMutation,
} from "@/store/services/commonApi";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { normalizeOrder, toOrderFormData, toOrderPayload } from "./helpers";
import OrderForm from "./OrderForm";
import {
  Buyer,
  CompanyProfile,
  OrderApiItem,
  OrderFormData
} from "./types";
import { OrderValidation, toFieldErrors } from "./validation";

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
  const [errors, setErrors] = React.useState<Record<string, string>>({});
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
    { skip: !duplicateId },
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
    console.error("Load Options Error:", message);
  }, [buyersError, companiesError, duplicateError]);

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
      toast.error("Please fill in the required fills");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    const isUpdate = !!draft.id;
    const schema = isUpdate ? OrderValidation.update : OrderValidation.create;
    const schemaResult = schema.safeParse(draft);

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

      console.log("Validation errors:", nextErrors);
      toast.error("Please fill in the required fills");
      return;
    }
    setErrors({});

    setSaving(true);
    try {
      const payload = (await postItem({
        path: "orders",
        body: toOrderPayload(schemaResult.data as any),
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
      console.error("Create Order Error:", message);
      toast.error(message);
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
          <Button
            className="bg-black text-white hover:bg-black/90"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Order"}
          </Button>
        </div>
      </Flex>

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
        disableStatus={true}
      />
    </Container>
  );
};

export default OrderCreate;
