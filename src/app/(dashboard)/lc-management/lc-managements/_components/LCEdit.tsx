"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container, Flex } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import {
  useGetByIdQuery,
  usePatchMutation,
  useGetAllQuery,
} from "@/store/services/commonApi";
import { LCFormData, lcSchema, toFieldErrors } from "./validation";
import LCForm from "./LCForm";
import { LCManagement } from "./types";
import { Invoice } from "@/app/(dashboard)/invoice-management/invoices/_components/types";
import { toast } from "react-toastify";

type Props = {
  id: string;
};

const LCEdit = ({ id }: Props) => {
  const router = useRouter();
  const [draft, setDraft] = React.useState<LCFormData | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof LCFormData, string>>
  >({});

  const [patchItem] = usePatchMutation();

  const { data: lcPayload, isFetching: loadingLC } = useGetByIdQuery({
    path: "lc-managements",
    id,
  });

  const { data: invoicesPayload } = useGetAllQuery({
    path: "invoices",
    page: 1,
    limit: 100,
  });

  const lc = (lcPayload as any)?.data as LCManagement | undefined;
  const invoices = ((invoicesPayload as any)?.data || []) as Invoice[];

  React.useEffect(() => {
    if (lc) {
      setDraft({
        bblcNumber: lc.bblcNumber,
        dateOfOpening: lc.dateOfOpening,
        notifyParty: lc.notifyParty || "",
        lcIssueBankName: lc.lcIssueBankName,
        lcIssueBankBranch: lc.lcIssueBankBranch,
        destination: lc.destination || "",
        exportLcNo: lc.exportLcNo || "",
        exportLcDate: lc.exportLcDate || "",
        binNo: lc.binNo || "",
        hsCodeNo: lc.hsCodeNo || "",
        remarks: lc.remarks || "",
        carrier: lc.carrier || "",
        salesTerm: lc.salesTerm || "",
        issueDate: lc.issueDate,
        expiryDate: lc.expiryDate,
        amount: Number(lc.amount),
        challanNo: lc.challanNo || "",
        transportMode: lc.transportMode || "",
        vehicleNo: lc.vehicleNo || "",
        driverName: lc.driverName || "",
        contactNo: lc.contactNo || "",
        invoiceId: lc.invoiceId,
      });
    }
  }, [lc]);

  const handleChange = (field: keyof LCFormData, value: any) => {
    if (draft) {
      setDraft((prev: any) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!draft) return;

    const schemaResult = lcSchema.safeParse(draft);
    if (!schemaResult.success) {
      const nextErrors = toFieldErrors(schemaResult.error.issues) as any;
      setErrors(nextErrors);
      toast.error("Please fill in the required fields");
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
        exportLcDate: draft.exportLcDate
          ? new Date(draft.exportLcDate).toISOString()
          : undefined,
      };

      await patchItem({
        path: `lc-managements/${id}`,
        body: payload,
        invalidate: ["lc-managements"],
      }).unwrap();

      toast.success("BBLC Updated Successfully");
      router.push(`/lc-management/lc-managements/${id}`);
    } catch (err: any) {
      const msg = err?.data?.message || "Failed to update LC";
      console.error("Update LC Error:", msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loadingLC || !draft) {
    return (
      <Container className="pt-10">
        <p className="animate-pulse text-muted-foreground">
          Loading LC details for editing...
        </p>
      </Container>
    );
  }

  return (
    <Container className="pb-10 pt-6">
      <Flex className="flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/lc-management/lc-managements/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit BBLC</h1>
            <p className="text-sm text-muted-foreground">
              Update Letter of Credit information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild disabled={saving}>
            <Link href={`/lc-management/lc-managements/${id}`}>Cancel</Link>
          </Button>
          <Button
            className="bg-black text-white hover:bg-black/90 shadow-lg"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving Changes..." : "Update BBLC"}
          </Button>
        </div>
      </Flex>

      <div className="mt-8">
        <LCForm
          data={draft}
          invoices={invoices}
          onChange={handleChange}
          errors={errors}
          isEdit={true}
        />
      </div>
    </Container>
  );
};

export default LCEdit;
