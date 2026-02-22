"use client";
import { notify } from "@/lib/notifications";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container, FormHeader, FormFooter } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import {
  useGetByIdQuery,
  useGetAllQuery,
  usePatchMutation,
  usePutMutation,
} from "@/store/services/commonApi";
import { OrderValidation, toFieldErrors } from "./validation";
import { OrderFormData, Order, Buyer, CompanyProfile } from "./types";
import { toOrderFormData, toOrderUpdatePayload } from "./helpers";
import OrderForm from "./OrderForm";

type Props = {
  id: string;
};

const OrderEdit = ({ id }: Props) => {
  const router = useRouter();
  const [draft, setDraft] = useState<OrderFormData | null>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "details">("basic");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalStatus, setOriginalStatus] =
    useState<OrderFormData["status"]>("DRAFT");

  const [patchItem] = usePatchMutation();
  const [putItem] = usePutMutation();

  const { data: orderPayload, isFetching: loadingOrder } = useGetByIdQuery({
    path: "orders",
    id,
  });

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

  const order = (orderPayload as any)?.data as Order | undefined;

  useEffect(() => {
    if (order && !draft) {
      const formData = toOrderFormData(order);
      setDraft(formData);
      setOriginalStatus(formData.status);
    }
  }, [order, draft]);

  const handleChange = useCallback(
    (field: keyof OrderFormData, value: any) => {
      if (!draft) return;
      setDraft((prev: any) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [draft],
  );

  const handleNestedChange = useCallback(
    (path: string, value: any) => {
      if (!draft) return;
      setDraft((prev) => {
        if (!prev) return prev;
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
    },
    [draft],
  );

  const handleSave = async () => {
    if (!draft) return;

    const payload = toOrderUpdatePayload(draft);
    const result = OrderValidation.update.safeParse(payload);

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

      notify.error("Please fix the validation errors");
      return;
    }
    setErrors({});

    setSaving(true);
    try {
      await patchItem({
        path: `orders/${id}`,
        body: payload,
        invalidate: ["orders"],
      }).unwrap();

      // Separate status update if changed
      if (draft.status !== originalStatus) {
        await putItem({
          path: `orders/${id}/status`,
          body: { status: draft.status },
          invalidate: ["orders"],
        }).unwrap();
      }

      notify.success("Order Updated Successfully");
      router.push(`/order-management/orders/${id}`);
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to update order";
      console.error("Update Order Error:", msg);
      notify.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Basic Progress Calculation for Order
  const progressData = React.useMemo(() => {
    if (!draft) return { percentage: 0, count: 0, total: 0 };
    const fieldsToTrack = [
      "orderNumber",
      "orderDate",
      "buyerId",
      "companyProfileId",
      "productType",
    ];
    const total = fieldsToTrack.length;
    const filled = fieldsToTrack.filter(
      (key) => !!draft[key as keyof OrderFormData],
    ).length;
    return {
      percentage: Math.round((filled / total) * 100),
      count: filled,
      total,
    };
  }, [draft]);

  if (loadingOrder || !draft) {
    return (
      <Container className="pt-10">
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 animate-pulse">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Loading Order...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pb-10 pt-6">
      <FormHeader
        title={`Edit Order: ${order?.orderNumber || ""}`}
        backHref={`/order-management/orders/${id}`}
        breadcrumbItems={[
          { label: "Order Management", href: "/order-management/orders" },
          { label: "Orders", href: "/order-management/orders" },
          {
            label: order?.orderNumber || "Order",
            href: `/order-management/orders/${id}`,
          },
          { label: "Edit" },
        ]}
        progress={progressData}
      />

      <div className="mt-8">
        <OrderForm
          data={draft}
          buyers={buyers}
          companies={companies}
          onChange={handleChange}
          onNestedChange={handleNestedChange}
          errors={errors}
          isEdit={true}
          disableProductType={true}
          onSave={handleSave}
          saving={saving}
          activeTab={activeTab}
          onTabChange={setActiveTab as any}
        />
      </div>

      <FormFooter
        cancelHref={`/order-management/orders/${id}`}
        onSave={handleSave}
        saving={saving}
        saveLabel="Update Order"
        trustText="Changes are synced to production planning."
      />
    </Container>
  );
};

export default OrderEdit;
