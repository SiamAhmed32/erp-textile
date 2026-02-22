"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetAllQuery,
  useDeleteOneMutation,
} from "@/store/services/commonApi";
import LCsTable from "./LCsTable";
import { LCManagement } from "./types";
import { PrimaryHeading } from "@/components/reusables";

const LCPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deleteItem] = useDeleteOneMutation();

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handle);
  }, [search]);

  const {
    data: lcsPayload,
    isFetching: loading,
    error: lcsError,
    refetch,
  } = useGetAllQuery({
    path: "lc-managements",
    page,
    limit: 10,
    search: debouncedSearch || "",
    filters: {
      ...(dateFrom ? { startDate: dateFrom } : {}),
      ...(dateTo ? { endDate: dateTo } : {}),
    },
  });

  const lcs = (lcsPayload as any)?.data || [];
  const totalPages = (lcsPayload as any)?.meta?.pagination?.totalPages || 1;

  useEffect(() => {
    const parsed = lcsError as any;
    if (!parsed) return;
    const message =
      parsed?.data?.error?.message ||
      parsed?.data?.message ||
      parsed?.error ||
      "Failed to load LC managements";
    console.error("Load LC Error:", message);
  }, [lcsError]);

  const handleRowClick = useCallback(
    (row: LCManagement) => {
      router.push(`/lc-management/lc-managements/${row.id}`);
    },
    [router],
  );

  const handleView = useCallback(
    (row: LCManagement) => {
      router.push(`/lc-management/lc-managements/${row.id}`);
    },
    [router],
  );

  const handleEdit = useCallback(
    (row: LCManagement) => {
      router.push(`/lc-management/lc-managements/${row.id}/edit`);
    },
    [router],
  );

  const handleExport = useCallback(
    (row: LCManagement) => {
      router.push(`/lc-management/lc-managements/${row.id}?export=pdf`);
    },
    [router],
  );

  const handleDelete = useCallback(
    async (row: LCManagement) => {
      if (
        !window.confirm("Are you sure you want to delete this LC Management?")
      )
        return;
      try {
        await deleteItem({
          path: `lc-managements/${row.id}`,
          invalidate: ["lc-managements"],
        }).unwrap();
        refetch();
      } catch (err: any) {
        console.error(
          "Delete LC Error:",
          err.message || "Failed to delete LC management",
        );
      }
    },
    [deleteItem, refetch],
  );

  const handleSearchSubmit = useCallback(() => {
    setDebouncedSearch(search);
    setPage(1);
  }, [search]);

  return (
    <div className="space-y-4">
      <LCsTable
        data={lcs}
        loading={loading}
        error={
          (lcsError as any)?.data?.message || (lcsError as any)?.error || ""
        }
        page={page}
        totalPages={totalPages}
        search={search}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onPageChange={setPage}
        onRowClick={handleRowClick}
        onView={handleView}
        onEdit={handleEdit}
        onExport={handleExport}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default LCPage;
