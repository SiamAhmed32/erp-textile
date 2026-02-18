"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Pencil,
  ChevronDown,
  FileCheck,
  FileText,
  Eye,
  LayoutDashboard,
} from "lucide-react";
import { Container, Flex } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetByIdQuery } from "@/store/services/commonApi";
import { LCManagement } from "./types";
import LCReadOnly from "./LCReadOnly";
import LCDocumentView from "./LCDocumentView";
import { exportLCToPdf, exportExporterCertificate } from "./lcPdf";

type Props = {
  id: string;
  shouldExport?: boolean;
};

const LCDetails = ({ id, shouldExport = false }: Props) => {
  const router = useRouter();
  const exportTriggered = React.useRef(false);
  const [viewMode, setViewMode] = React.useState<"dashboard" | "document">(
    "dashboard",
  );

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
    exportLCToPdf(lc);
  }, [lc]);

  React.useEffect(() => {
    if (!shouldExport || !lc || exportTriggered.current) return;
    exportTriggered.current = true;
    handleExportPdf();
  }, [lc, shouldExport, handleExportPdf]);

  return (
    <Container className="pb-10 pt-6">
      <Flex className="flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-6 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/lc-management/lc-managements">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block" />
          <h1 className="text-xl font-bold tracking-tight">
            {lc ? `LC: ${lc.bblcNumber}` : "LC Details"}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="bg-slate-200/50 p-1 rounded-lg flex mr-2 border border-slate-200">
            <Button
              variant={viewMode === "dashboard" ? "secondary" : "ghost"}
              size="sm"
              className={`h-8 px-3 transition-all ${viewMode === "dashboard" ? "bg-black text-white shadow-md hover:bg-black/90" : "text-slate-600 hover:bg-slate-300/50"}`}
              onClick={() => setViewMode("dashboard")}
            >
              <LayoutDashboard className="mr-2 h-3.5 w-3.5" />
              Dashboard
            </Button>
            <Button
              variant={viewMode === "document" ? "secondary" : "ghost"}
              size="sm"
              className={`h-8 px-3 transition-all ${viewMode === "document" ? "bg-black text-white shadow-md hover:bg-black/90" : "text-slate-600 hover:bg-slate-300/50"}`}
              onClick={() => setViewMode("document")}
            >
              <Eye className="mr-2 h-3.5 w-3.5" />
              Document
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPdf}
            disabled={!lc}
          >
            <Download className="mr-2 h-4 w-4" />
            BBLC PDF
          </Button>

          {lc && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Certificates
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Export Certificates</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => exportExporterCertificate(lc, "beneficiary")}
                >
                  <FileText className="mr-2 h-4 w-4 text-blue-500" />
                  Beneficiary Certificate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => exportExporterCertificate(lc, "origin")}
                >
                  <FileCheck className="mr-2 h-4 w-4 text-orange-500" />
                  Certificate of Origin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="outline" size="sm" asChild disabled={!lc}>
            <Link href={`/lc-management/lc-managements/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </Flex>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-slate-500">
            Retrieving LC Record...
          </p>
        </div>
      )}

      {lc && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {viewMode === "dashboard" ? (
            <LCReadOnly lc={lc} />
          ) : (
            <LCDocumentView lc={lc} />
          )}
        </div>
      )}
    </Container>
  );
};

export default LCDetails;
