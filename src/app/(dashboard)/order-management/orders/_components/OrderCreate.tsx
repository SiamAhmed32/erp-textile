"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, Flex } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import {
  useGetAllQuery,
  useGetByIdQuery,
  usePostMutation,
} from "@/store/services/commonApi";
import { OrderValidation, toFieldErrors } from "./validation";
import { OrderFormData, Buyer, CompanyProfile, Order } from "./types";
import { toOrderPayload, toOrderFormData, normalizeOrder } from "./helpers";
import OrderForm from "./OrderForm";
import { toast } from "react-toastify";

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

type Props = {
  duplicateId?: string;
};

const OrderCreate = ({ duplicateId }: Props) => {
  const router = useRouter();
  const [draft, setDraft] = useState<OrderFormData>(emptyOrder);
  const [activeTab, setActiveTab] = useState<"basic" | "details">("basic");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [postItem] = usePostMutation();

  // Fetch buyers and companies
  const { data: buyersPayload } = useGetAllQuery({
    path: "buyers",
    page: 1,
    limit: 100,
  });
  const { data: companiesPayload } = useGetAllQuery({
    path: "company-profiles",
    page: 1,
    limit: 100,
  });

  const buyers = ((buyersPayload as any)?.data || []) as Buyer[];
  const companies = ((companiesPayload as any)?.data || []) as CompanyProfile[];

  // Duplicate order support
  const { data: duplicatePayload } = useGetByIdQuery(
    { path: "orders", id: duplicateId! },
    { skip: !duplicateId },
  );

  useEffect(() => {
    if (duplicateId && duplicatePayload) {
      const order = (duplicatePayload as any)?.data as Order;
      if (order) {
        const normalized = normalizeOrder(order as any);
        const formData = toOrderFormData(normalized);
        formData.orderNumber = ""; // Clear order number for duplicate
        formData.status = "DRAFT";
        setDraft(formData);
      }
    }
  }, [duplicateId, duplicatePayload]);

  const handleChange = useCallback((field: keyof OrderFormData, value: any) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleNestedChange = useCallback((path: string, value: any) => {
    setDraft((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[path];
      return next;
    });
  }, []);

  const handleSave = async () => {
    const payload = toOrderPayload(draft);
    const result = OrderValidation.create.safeParse(payload);

    if (!result.success) {
      const nextErrors = toFieldErrors(result.error.issues);
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
        setActiveTab("basic");
      } else if (
        firstErrorKey.startsWith("orderItems") ||
        firstErrorKey.startsWith("deliveryDate")
      ) {
        setActiveTab("details");
      }

      toast.error("Please fill in the required fields");
      return;
    }
    setErrors({});

    setSaving(true);
    try {
      const res = await postItem({
        path: "orders",
        body: toOrderPayload(result.data as any),
        invalidate: ["orders"],
      }).unwrap();

      toast.success("Order Created Successfully");
      const id = (res as any)?.data?.id || (res as any)?.id;
      router.push(
        id ? `/order-management/orders/${id}` : "/order-management/orders",
      );
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to create order";
      console.error("Create Order Error:", msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="pb-10 pt-6">
      <Flex className="flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/order-management/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create New Order
            </h1>
            <p className="text-sm text-slate-500">
              Configure a new production order
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild disabled={saving}>
            <Link href="/order-management/orders">Cancel</Link>
          </Button>
          <Button
            className="bg-black text-white hover:bg-black/90 shadow-lg"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Creating..." : "Save Order"}
          </Button>
        </div>
      </Flex>

      <div className="mt-8">
        <OrderForm
          data={draft}
          buyers={buyers}
          companies={companies}
          onChange={handleChange}
          onNestedChange={handleNestedChange}
          errors={errors}
          onSave={handleSave}
          saving={saving}
          activeTab={activeTab}
          onTabChange={setActiveTab as any}
          disableStatus
        />
      </div>
    </Container>
  );
};

export default OrderCreate;
