"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Download, Pencil } from "lucide-react";
import { Container, PageHeader, PrimaryText } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetByIdQuery } from "@/store/services/commonApi";
import { CompanyProfile, CompanyProfileApiItem } from "./types";
import { isValidId, normalizeProfile } from "./helpers";
import CompanyProfileReadOnly from "./CompanyProfileReadOnly";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type Props = {
  id: string;
};

const CompanyProfileDetails = ({ id }: Props) => {
  const [profile, setProfile] = React.useState<CompanyProfile | null>(null);
  const isInvalidId = !isValidId(id);
  const {
    data: profilePayload,
    isFetching: loading,
    error: apiError,
  } = useGetByIdQuery(
    {
      path: "company-profiles",
      id,
    },
    { skip: isInvalidId },
  );

  React.useEffect(() => {
    if (isInvalidId) {
      console.error("Invalid company ID.");
      return;
    }
    const item = (profilePayload as any)?.data as
      | CompanyProfileApiItem
      | undefined;
    if (!item) return;
    setProfile(normalizeProfile(item));
  }, [profilePayload, isInvalidId]);

  React.useEffect(() => {
    const parsed = apiError as any;
    if (!parsed) return;
    const message =
      parsed?.data?.error?.message ||
      parsed?.data?.message ||
      parsed?.error ||
      "Failed to load company profile";
    console.error("Load Company Profile Error:", message);
  }, [apiError]);

  const handleExportPdf = () => {
    if (!profile) return;
    const doc = new jsPDF();
    const title = profile.name || "Company Profile";
    doc.setFontSize(16);
    doc.text(title, 14, 18);
    doc.setFontSize(10);
    doc.text("Company Profile Details", 14, 24);

    const makeRows = (rows: Array<[string, string]>) =>
      rows.map(([label, value]) => [label, value || "-"]);

    let startY = 30;
    autoTable(doc, {
      startY,
      head: [["Company Information", ""]],
      body: makeRows([
        ["Company Name", profile.name],
        ["Company Type", profile.companyType],
        ["Status", profile.status],
        ["Address", profile.address],
        ["City", profile.city],
        ["Postal Code", profile.postalCode],
        ["Country", profile.country],
        ["Website", profile.website],
      ]),
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 41, 55] },
    });

    startY = (doc as any).lastAutoTable?.finalY
      ? (doc as any).lastAutoTable.finalY + 8
      : 30;
    autoTable(doc, {
      startY,
      head: [["Contact Details", ""]],
      body: makeRows([
        ["Email", profile.email],
        ["Phone", profile.phone],
      ]),
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 41, 55] },
    });

    startY = (doc as any).lastAutoTable?.finalY
      ? (doc as any).lastAutoTable.finalY + 8
      : startY;
    autoTable(doc, {
      startY,
      head: [["Banking Details", ""]],
      body: makeRows([
        ["Bank Name", profile.bankName],
        ["Branch Name", profile.branchName],
        ["Account Number", profile.bankAccountNumber],
        ["SWIFT Code", profile.swiftCode],
        ["Routing Number", profile.routingNumber],
      ]),
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 41, 55] },
    });

    startY = (doc as any).lastAutoTable?.finalY
      ? (doc as any).lastAutoTable.finalY + 8
      : startY;
    autoTable(doc, {
      startY,
      head: [["Tax & Legal", ""]],
      body: makeRows([
        ["Tax ID", profile.taxId],
        ["Registration Number", profile.registrationNumber],
        ["Trade License Number", profile.tradeLicenseNumber],
        ["Trade License Expiry", profile.tradeLicenseExpiryDate],
      ]),
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 41, 55] },
    });

    const filename = `${title.replace(/\s+/g, "-").toLowerCase()}-profile.pdf`;
    doc.save(filename);
  };

  return (
    <Container className="pb-10 pt-6">
      <PageHeader
        title={profile?.name || "Company Details"}
        backHref="/company-profile"
        breadcrumbItems={[
          //{ label: "Dashboard", href: "/" },
          { label: "Company Profiles", href: "/company-profile" },
          { label: profile?.name || "Details" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={!profile}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportPdf}>
                  Export PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="bg-black text-white hover:bg-black/90 shadow-sm"
              asChild
              disabled={!profile}
            >
              <Link href={`/company-profile/${id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mt-4" />

      {loading && (
        <PrimaryText className="text-sm text-muted-foreground">
          Loading company details...
        </PrimaryText>
      )}

      {profile && <CompanyProfileReadOnly profile={profile} />}
    </Container>
  );
};

export default CompanyProfileDetails;
