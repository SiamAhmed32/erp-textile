"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAllQuery, usePatchMutation } from "@/store/services/commonApi";
import LCsTable from "./LCsTable";
import { LCManagement } from "./types";
import { PrimaryHeading, CustomModal } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notifications";

const LCPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expiryDateFrom, setExpiryDateFrom] = useState("");
  const [expiryDateTo, setExpiryDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [deletingLC, setDeletingLC] = useState<LCManagement | null>(null);
  const [patchItem] = usePatchMutation();

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
      ...(expiryDateFrom ? { expiryStartDate: expiryDateFrom } : {}),
      ...(expiryDateTo ? { expiryEndDate: expiryDateTo } : {}),
      ...(minAmount ? { minAmount } : {}),
      ...(maxAmount ? { maxAmount } : {}),
      ...(showDeleted ? { isDeleted: true } : {}),
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
      "Could not load the LC documents. Please refresh the page.";
    notify.error(message);
    console.error("Load LC Error:", parsed);
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

  const handleDelete = useCallback((row: LCManagement) => {
    setDeletingLC(row);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deletingLC) return;
    try {
      await patchItem({
        path: `lc-managements/${deletingLC.id}`,
        body: { isDeleted: true },
        invalidate: ["lc-managements"],
      }).unwrap();
      refetch();
      notify.success("LC management record deleted successfully.");
    } catch (err: any) {
      notify.error(
        "Could not delete the LC management record. Please try again.",
      );
      console.error("Delete LC Error:", err);
    } finally {
      setDeletingLC(null);
    }
  }, [patchItem, refetch, deletingLC]);

  const handleRestore = useCallback(
    async (row: LCManagement) => {
      try {
        await patchItem({
          path: `lc-managements/${row.id}`,
          body: { isDeleted: false },
          invalidate: ["lc-managements"],
        }).unwrap();
        refetch();
        notify.success("LC management record restored successfully.");
      } catch (err: any) {
        notify.error(
          "Could not restore the LC management record. Please try again.",
        );
        console.error("Restore LC Error:", err);
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
        expiryDateFrom={expiryDateFrom}
        expiryDateTo={expiryDateTo}
        minAmount={minAmount}
        maxAmount={maxAmount}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onExpiryDateFromChange={setExpiryDateFrom}
        onExpiryDateToChange={setExpiryDateTo}
        onMinAmountChange={setMinAmount}
        onMaxAmountChange={setMaxAmount}
        onPageChange={setPage}
        onRowClick={handleRowClick}
        onView={handleView}
        onEdit={handleEdit}
        onExport={handleExport}
        onDelete={handleDelete}
        showDeleted={showDeleted}
        onToggleDeleted={handleToggleDeleted}
        onRestore={handleRestore}
      />

      <CustomModal
        open={!!deletingLC}
        onOpenChange={(open) => !open && setDeletingLC(null)}
        title="Confirm Delete"
        maxWidth="400px"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete LC{" "}
            <span className="font-semibold text-foreground">
              {deletingLC?.bblcNumber}
            </span>
            ? This is a soft delete operation.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeletingLC(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default LCPage;
