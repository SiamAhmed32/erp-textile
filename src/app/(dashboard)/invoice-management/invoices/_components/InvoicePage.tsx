"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAllQuery, usePatchMutation } from "@/store/services/commonApi";
import InvoicesTable from "./InvoicesTable";
import { InvoiceFormModal } from "./InvoiceFormModal";
import { Invoice, InvoiceApiItem } from "./types";
import { normalizeInvoice } from "./helpers";

import { PageHeader, CustomModal } from "@/components/reusables";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notifications";

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
  const [showDeleted, setShowDeleted] = useState(false);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "createdAt",
    dir: "desc",
  });
  const [patchItem] = usePatchMutation();

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
    sortBy: sort.field,
    sortOrder: sort.dir,
    filters: {
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      ...(typeFilter !== "all" ? { productType: typeFilter } : {}),
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
      ...(showDeleted ? { isDeleted: true } : {}),
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
      "Could not load the invoice list. Please try again.";
    notify.error(message);
    console.error("Load Invoices Error:", parsed);
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

  const handleDelete = useCallback((row: Invoice) => {
    setDeletingInvoice(row);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deletingInvoice) return;
    try {
      await patchItem({
        path: `invoices/${deletingInvoice.id}`,
        body: { isDeleted: true },
        invalidate: ["invoices"],
      }).unwrap();
      refetch();
      notify.success("Invoice deleted successfully.");
    } catch (err: any) {
      notify.error("Could not delete the invoice. Please try again.");
      console.error("Delete Invoice Error:", err);
    } finally {
      setDeletingInvoice(null);
    }
  }, [patchItem, refetch, deletingInvoice]);

  const handleRestore = useCallback(
    async (row: Invoice) => {
      try {
        await patchItem({
          path: `invoices/${row.id}`,
          body: { isDeleted: false },
          invalidate: ["invoices"],
        }).unwrap();
        refetch();
        notify.success("Invoice restored successfully.");
      } catch (err: any) {
        notify.error("Could not restore the invoice. Please try again.");
        console.error("Restore Invoice Error:", err);
      }
    },
    [patchItem, refetch],
  );

  const handleToggleDeleted = useCallback(() => {
    setShowDeleted((prev) => !prev);
    setPage(1);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    setDebouncedSearch(search);
    setPage(1);
  }, [search]);

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
      <PageHeader
        title="Proforma Invoices (PI)"
        breadcrumbItems={[
          //{ label: "Dashboard", href: "/" },
          { label: "Invoice Management", href: "/invoice-management/invoices" },
          { label: "Invoices" },
        ]}
        actions={
          <Button
            className="bg-black text-white hover:bg-black/90 shadow-sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New PI
          </Button>
        }
      />
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
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        onStatusFilterChange={setStatusFilter}
        onTypeFilterChange={setTypeFilter}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onPageChange={setPage}
        onRowClick={handleRowClick}
        sort={sort}
        onSortChange={setSort}
        onView={handleView}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onExport={handleExport}
        onDelete={handleDelete}
        showDeleted={showDeleted}
        onToggleDeleted={handleToggleDeleted}
        onRestore={handleRestore}
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
      <CustomModal
        open={!!deletingInvoice}
        onOpenChange={(open) => !open && setDeletingInvoice(null)}
        title="Confirm Delete"
        maxWidth="400px"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete invoice{" "}
            <span className="font-semibold text-foreground">
              {deletingInvoice?.piNumber}
            </span>
            ? This is a soft delete operation.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeletingInvoice(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default InvoicePage;
