"use client";
import { notify } from "@/lib/notifications";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Container,
  FormHeader,
  RecoveryModal,
  NavigationGuard,
  FormSkeleton,
} from "@/components/reusables";
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
import { useFormPersistence } from "@/hooks/useFormPersistence";

type Props = {
  id: string;
};

const OrderEdit = ({ id }: Props) => {
  const router = useRouter();
  const [baseFormData, setBaseFormData] = useState<OrderFormData | null>(null);
  const {
    draft,
    setDraft,
    hasStoredDraft,
    restoreDraft,
    discardDraft,
    clearDraft,
    setHasInteracted,
  } = useFormPersistence<OrderFormData | null>({
    key: `order_edit_${id}`,
    defaultValue: null,
  });

  const [activeTab, setActiveTab] = useState<"basic" | "details">("basic");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalStatus, setOriginalStatus] =
    useState<OrderFormData["status"]>("DRAFT");

  const [patchItem] = usePatchMutation();
  const [putItem] = usePutMutation();

  const isDirty = React.useMemo(() => {
    if (!draft || !baseFormData) return false;
    return JSON.stringify(draft) !== JSON.stringify(baseFormData);
  }, [draft, baseFormData]);

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
    if (order) {
      const formData = toOrderFormData(order);
      setBaseFormData(formData);
      setOriginalStatus(formData.status);

      // Only set initial draft if currently null
      if (draft === null) {
        setDraft(formData);
      }
    }
  }, [order, draft, setDraft]);

  const handleChange = useCallback(
    (field: keyof OrderFormData, value: any) => {
      if (!draft) return;
      setDraft((prev: any) => ({ ...prev, [field]: value }));
      setHasInteracted(true);
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [draft, setDraft, setHasInteracted],
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
      setHasInteracted(true);
      setErrors((prev) => {
        const next = { ...prev };
        delete next[path];
        return next;
      });
    },
    [draft, setDraft, setHasInteracted],
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

      notify.error(
        "Some required fields are missing. Please review the highlighted fields.",
      );
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

      clearDraft();

      notify.success("Order Updated Successfully");
      router.push(`/order-management/orders/${id}`);
    } catch (err: any) {
      const msg =
        err?.data?.message || "Could not update the order. Please try again.";
      console.error("Update Order Error:", err);
      notify.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Dynamic Progress Calculation for Order
  const progressData = React.useMemo(() => {
    if (!draft) return { percentage: 0, count: 0, total: 0 };
    const fieldsToTrack: (keyof OrderFormData)[] = [
      "orderNumber",
      "orderDate",
      "buyerId",
      "companyProfileId",
      "productType",
      "deliveryDate",
      "status",
    ];

    const total = fieldsToTrack.length;
    const filled = fieldsToTrack.filter((key) => {
      const val = draft[key];
      if (typeof val === "string") return val.trim().length > 0;
      if (typeof val === "number") return true;
      return !!val;
    }).length;

    return {
      percentage: Math.round((filled / total) * 100),
      count: filled,
      total,
    };
  }, [draft]);

  if (loadingOrder || !draft) {
    return (
      <Container className="pt-10">
        <FormSkeleton sections={2} />
      </Container>
    );
  }

  return (
    <Container className="pb-10 pt-6">
      <NavigationGuard isDirty={isDirty} />

      <RecoveryModal
        isOpen={hasStoredDraft}
        onRestore={restoreDraft}
        onDiscard={discardDraft}
        title="Unsaved Changes Found"
        description="We found an unsaved draft of your edits for this order. Would you like to restore them?"
      />

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
          cancelHref={`/order-management/orders/${id}`}
        />
      </div>
    </Container>
  );
};

export default OrderEdit;
