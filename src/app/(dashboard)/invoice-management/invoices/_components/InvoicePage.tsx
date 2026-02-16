"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useDeleteOneMutation,
  useGetAllQuery,
} from "@/store/services/commonApi";
import InvoicesTable from "./InvoicesTable";
import { Invoice, InvoiceApiItem } from "./types";
import { countByType, normalizeInvoice } from "./helpers";

const InvoicePage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deleteOne] = useDeleteOneMutation();

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handle);
  }, [search]);

  const {
    data: invoicesPayload,
    isFetching: loading,
    error: invoicesError,
    refetch,
  } = useGetAllQuery({
    path: "invoices",
    page,
    limit: 10,
    search: debouncedSearch || "",
    filters: {
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      ...(typeFilter !== "all" ? { productType: typeFilter } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    },
  });
  const invoices = useMemo(
    () =>
      ((invoicesPayload as any)?.data || []).map((item: InvoiceApiItem) =>
        normalizeInvoice(item),
      ),
    [invoicesPayload],
  );
  const totalPages =
    (invoicesPayload as any)?.meta?.pagination?.totalPages || 1;

  useEffect(() => {
    const parsed = invoicesError as any;
    if (!parsed) return;
    const message =
      parsed?.data?.error?.message ||
      parsed?.data?.message ||
      parsed?.error ||
      "Failed to load invoices";
    console.error("Load Invoices Error:", message);
  }, [invoicesError]);

  const handleRowClick = useCallback(
    (row: Invoice) => {
      router.push(`/invoice-management/invoices/${row.id}`);
    },
    [router],
  );

  const handleView = useCallback(
    (row: Invoice) => {
      router.push(`/invoice-management/invoices/${row.id}`);
    },
    [router],
  );

  const handleEdit = useCallback(
    (row: Invoice) => {
      router.push(`/invoice-management/invoices/${row.id}/edit`);
    },
    [router],
  );

  const handleExport = useCallback(
    (row: Invoice) => {
      router.push(`/invoice-management/invoices/${row.id}?export=pdf`);
    },
    [router],
  );

  const handleDelete = useCallback(
    async (row: Invoice) => {
      try {
        await deleteOne({
          path: `invoices/${row.id}`,
          invalidate: ["invoices"],
        }).unwrap();
        refetch();
      } catch (err: any) {
        console.error(
          "Delete Invoice Error:",
          err.message || "Failed to delete invoice",
        );
      }
    },
    [deleteOne, refetch],
  );

  const handleSearchSubmit = useCallback(() => {
    setDebouncedSearch(search);
    setPage(1);
  }, [search]);

  const counts = useMemo(() => countByType(invoices), [invoices]);

  return (
    <InvoicesTable
      data={invoices}
      loading={loading}
      page={page}
      totalPages={totalPages}
      search={search}
      statusFilter={statusFilter}
      typeFilter={typeFilter}
      dateFrom={dateFrom}
      dateTo={dateTo}
      counts={counts}
      onSearchChange={setSearch}
      onSearchSubmit={handleSearchSubmit}
      onStatusFilterChange={setStatusFilter}
      onTypeFilterChange={setTypeFilter}
      onDateFromChange={setDateFrom}
      onDateToChange={setDateTo}
      onPageChange={setPage}
      onAddInvoice={() =>
        router.push("/invoice-management/invoices/add-new-invoice")
      }
      onRowClick={handleRowClick}
      onView={handleView}
      onEdit={handleEdit}
      onExport={handleExport}
      onDelete={handleDelete}
    />
  );
};

export default InvoicePage;
