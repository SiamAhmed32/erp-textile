"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, Flex } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { useGetAllQuery, usePostMutation } from "@/store/services/commonApi";
import { LCFormData, lcSchema, toFieldErrors } from "./validation";
import LCForm from "./LCForm";
import { Invoice } from "@/app/(dashboard)/invoice-management/invoices/_components/types";

const emptyLC: LCFormData = {
  bblcNumber: "",
  dateOfOpening: "",
  notifyParty: "",
  lcIssueBankName: "",
  lcIssueBankBranch: "",
  destination: "",
  issueDate: "",
  expiryDate: "",
  amount: 0,
  invoiceId: "",
};

const LCCreate = () => {
  const router = useRouter();
  const [draft, setDraft] = React.useState<LCFormData>(emptyLC);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof LCFormData, string>>
  >({});
  const [postItem] = usePostMutation();

  const { data: invoicesPayload, error: invoicesError } = useGetAllQuery({
    path: "invoices",
    page: 1,
    limit: 100,
    filters: {
      // Logic: Only show invoices that are approved and don't have an LC yet
      // This depends on the backend filter support, but we'll fetch all and filter if needed
    },
  });

  // Filter out invoices that already have LC (if not already filtered by backend)
  const invoices = ((invoicesPayload as any)?.data || []) as Invoice[];

  React.useEffect(() => {
    const error = invoicesError as any;
    if (error) {
      console.error(
        "Load Invoices Error:",
        error?.data?.message || "Failed to load invoices",
      );
    }
  }, [invoicesError]);

  const handleChange = (field: keyof LCFormData, value: any) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    // Auto-populate amount if invoice is selected
    if (field === "invoiceId") {
      const selectedInvoice = invoices.find((inv) => inv.id === value);
      if (selectedInvoice) {
        // Logic to calculate total amount from order items if not directly on invoice
        const order = selectedInvoice.order;
        if (order) {
          const orderItem = Array.isArray(order.orderItems)
            ? order.orderItems[0]
            : order.orderItems;
          const amount =
            orderItem?.fabricItem?.totalAmount ||
            orderItem?.labelItem?.totalAmount ||
            orderItem?.cartonItem?.totalAmount ||
            0;
          setDraft((prev) => ({ ...prev, amount: Number(amount) }));
        }
      }
    }
  };

  const handleSave = async () => {
    const schemaResult = lcSchema.safeParse(draft);
    if (!schemaResult.success) {
      const nextErrors = toFieldErrors(schemaResult.error.issues) as any;
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    try {
      // Format dates to ISO strings for Prisma
      const payload = {
        ...draft,
        dateOfOpening: new Date(draft.dateOfOpening).toISOString(),
        issueDate: new Date(draft.issueDate).toISOString(),
        expiryDate: new Date(draft.expiryDate).toISOString(),
      };

      const result = await postItem({
        path: "lc-managements",
        body: payload,
        invalidate: ["lc-managements", "orders", "invoices"], // Invalidate related tags
      }).unwrap();

      const id = (result as any)?.data?.id || (result as any)?.id;
      router.push(
        id
          ? `/lc-management/lc-managements/${id}`
          : "/lc-management/lc-managements",
      );
    } catch (err: any) {
      console.error(
        "Create LC Error:",
        err?.data?.message || "Failed to create LC",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="pb-10 pt-6">
      <Flex className="flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/lc-management/lc-managements">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create BBLC</h1>
            <p className="text-sm text-muted-foreground">
              Setup a new Back-to-Back Letter of Credit
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild disabled={saving}>
            <Link href="/lc-management/lc-managements">Cancel</Link>
          </Button>
          <Button
            className="bg-black text-white hover:bg-black/90 shadow-lg"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Creating..." : "Save BBLC"}
          </Button>
        </div>
      </Flex>

      <div className="mt-8">
        <LCForm
          data={draft}
          invoices={invoices}
          onChange={handleChange}
          errors={errors}
        />
      </div>
    </Container>
  );
};

export default LCCreate;
