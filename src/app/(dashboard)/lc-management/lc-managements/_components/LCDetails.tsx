"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Pencil } from "lucide-react";
import { Container, Flex } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { useGetByIdQuery } from "@/store/services/commonApi";
import { LCManagement } from "./types";
import LCReadOnly from "./LCReadOnly";
// import { exportLCToPdf } from "./lcPdf"; // To be created

type Props = {
  id: string;
  shouldExport?: boolean;
};

const LCDetails = ({ id, shouldExport = false }: Props) => {
  const router = useRouter();
  const exportTriggered = React.useRef(false);

  const {
    data: lcPayload,
    isFetching: loading,
    error: lcError,
  } = useGetByIdQuery({
    path: "lc-managements",
    id,
  });

  const lc = (lcPayload as any)?.data as LCManagement | undefined;

  React.useEffect(() => {
    const error = lcError as any;
    if (error) {
      console.error(
        "Load LC Error:",
        error?.data?.message || "Failed to load LC management",
      );
    }
  }, [lcError]);

  const handleExportPdf = React.useCallback(() => {
    if (!lc) return;
    // exportLCToPdf(lc); // Placeholder for now
    alert("PDF Export coming soon!");
  }, [lc]);

  React.useEffect(() => {
    if (!shouldExport || !lc || exportTriggered.current) return;
    exportTriggered.current = true;
    handleExportPdf();
  }, [lc, shouldExport, handleExportPdf]);

  return (
    <Container className="pb-10 pt-6">
      <Flex className="flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2 mb-4 lg:mb-8">
          <Button variant="outline" asChild>
            <Link href="/lc-management/lc-managements">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to LC Management
            </Link>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4 lg:mb-8">
          <Button variant="outline" onClick={handleExportPdf} disabled={!lc}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" asChild disabled={!lc}>
            <Link href={`/lc-management/lc-managements/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit LC
            </Link>
          </Button>
        </div>
      </Flex>

      {loading && (
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading LC management details...
        </p>
      )}

      {lc && <LCReadOnly lc={lc} />}
    </Container>
  );
};

export default LCDetails;
