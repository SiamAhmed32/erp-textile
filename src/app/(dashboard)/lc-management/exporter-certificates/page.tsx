"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAllQuery } from "@/store/services/commonApi";
import { Container, PrimaryHeading } from "@/components/reusables";
import CertificatesTable from "./_components/CertificatesTable";
import { LCManagement } from "../lc-managements/_components/types";

const ExporterCertificatesPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  React.useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handle);
  }, [search]);

  const {
    data: lcsPayload,
    isFetching: loading,
    error: lcsError,
  } = useGetAllQuery({
    path: "lc-managements",
    page,
    limit: 10,
    search: debouncedSearch || "",
  });

  const lcs = (lcsPayload as any)?.data || [];
  const totalPages = (lcsPayload as any)?.meta?.pagination?.totalPages || 1;

  return (
    <Container className="pb-10 pt-6">
      <div className="space-y-6">
        <PrimaryHeading>Exporter's Certificates</PrimaryHeading>
        <p className="text-sm text-slate-500 -mt-4">
          Select a BBLC to generate Beneficiary Certificates or Certificates of
          Origin.
        </p>

        <CertificatesTable
          data={lcs}
          loading={loading}
          page={page}
          totalPages={totalPages}
          search={search}
          onSearchChange={setSearch}
          onPageChange={setPage}
        />
      </div>
    </Container>
  );
};

export default ExporterCertificatesPage;
