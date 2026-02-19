"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useDeleteOneMutation,
  useGetAllQuery,
} from "@/store/services/commonApi";
import InvoicesTable from "./InvoicesTable";
import { InvoiceFormModal } from "./InvoiceFormModal";
import { Invoice, InvoiceApiItem } from "./types";
import { countByType, normalizeInvoice } from "./helpers";

const InvoicePage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editInvoiceId, setEditInvoiceId] = useState<string | null>(null);
  const [duplicateInvoiceId, setDuplicateInvoiceId] = useState<string | null>(
    null,
  );
  const [deleteOne] = useDeleteOneMutation();

  //  console.log("edit invoice:", editInvoiceId);

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
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
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

  const handleEdit = useCallback((row: Invoice) => {
    setEditInvoiceId(row.id);
  }, []);

  const handleDuplicate = useCallback((row: Invoice) => {
    setDuplicateInvoiceId(row.id);
  }, []);

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

  const handleCreateSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEditSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleDuplicateSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <InvoicesTable
        data={invoices}
        loading={loading}
        page={page}
        totalPages={totalPages}
        search={search}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        startDate={startDate}
        endDate={endDate}
        counts={counts}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        onStatusFilterChange={setStatusFilter}
        onTypeFilterChange={setTypeFilter}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onPageChange={setPage}
        onAddInvoice={() => setIsCreateModalOpen(true)}
        onRowClick={handleRowClick}
        onView={handleView}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onExport={handleExport}
        onDelete={handleDelete}
      />
      <InvoiceFormModal
        open={isCreateModalOpen}
        mode="create"
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
      <InvoiceFormModal
        open={!!editInvoiceId}
        mode="edit"
        invoiceId={editInvoiceId || undefined}
        onClose={() => setEditInvoiceId(null)}
        onSuccess={handleEditSuccess}
      />
      <InvoiceFormModal
        open={!!duplicateInvoiceId}
        mode="create"
        duplicateId={duplicateInvoiceId || undefined}
        onClose={() => setDuplicateInvoiceId(null)}
        onSuccess={handleDuplicateSuccess}
      />
    </>
  );
};

export default InvoicePage;
