"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAllQuery, usePatchMutation } from "@/store/services/commonApi";
import OrdersTable from "./OrdersTable";
import { Order, OrderApiItem } from "./types";
import { normalizeOrder } from "./helpers";
import { PrimaryHeading, CustomModal } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notifications";

const OrderPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showDeleted, setShowDeleted] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deliveryDateFrom, setDeliveryDateFrom] = useState("");
  const [deliveryDateTo, setDeliveryDateTo] = useState("");
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "createdAt",
    dir: "desc",
  });
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [patchItem] = usePatchMutation();

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handle);
  }, [search]);

  const {
    data: ordersPayload,
    isFetching: loading,
    error: ordersError,
    refetch,
  } = useGetAllQuery({
    path: "orders",
    page,
    limit: 10,
    search: debouncedSearch || "",
    sortBy: sort.field,
    sortOrder: sort.dir,
    filters: {
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      ...(typeFilter !== "all" ? { productType: typeFilter } : {}),
      ...(dateFrom ? { startDate: dateFrom } : {}),
      ...(dateTo ? { endDate: dateTo } : {}),
      ...(deliveryDateFrom ? { deliveryDateFrom } : {}),
      ...(deliveryDateTo ? { deliveryDateTo } : {}),
      ...(showDeleted ? { isDeleted: true } : {}),
    },
  });

  const orders = useMemo(
    () =>
      ((ordersPayload as any)?.data || []).map((item: OrderApiItem) =>
        normalizeOrder(item),
      ),
    [ordersPayload],
  );
  const totalPages = (ordersPayload as any)?.meta?.pagination?.totalPages || 1;

  useEffect(() => {
    const parsed = ordersError as any;
    if (!parsed) return;
    const message =
      parsed?.data?.error?.message ||
      parsed?.data?.message ||
      "Could not load the order list. Please try again.";
    notify.error(message);
    console.error("Load Orders Error:", parsed);
  }, [ordersError]);

  const handleRowClick = useCallback(
    (row: Order) => {
      router.push(`/order-management/orders/${row.id}`);
    },
    [router],
  );

  const handleView = useCallback(
    (row: Order) => {
      router.push(`/order-management/orders/${row.id}`);
    },
    [router],
  );

  const handleEdit = useCallback(
    (row: Order) => {
      router.push(`/order-management/orders/${row.id}/edit`);
    },
    [router],
  );

  const handleDuplicate = useCallback(
    (row: Order) => {
      router.push(
        `/order-management/orders/add-new-order?duplicateId=${row.id}`,
      );
    },
    [router],
  );

  const handleExport = useCallback(
    (row: Order) => {
      router.push(`/order-management/orders/${row.id}?export=pdf`);
    },
    [router],
  );

  const handleDelete = useCallback((row: Order) => {
    setDeletingOrder(row);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deletingOrder) return;
    try {
      await patchItem({
        path: `orders/${deletingOrder.id}`,
        body: { isDeleted: true },
        invalidate: ["orders"],
      }).unwrap();
      refetch();
      notify.success("Order deleted successfully.");
    } catch (err: any) {
      notify.error("Could not delete the order. Please try again.");
      console.error("Delete Order Error:", err);
    } finally {
      setDeletingOrder(null);
    }
  }, [patchItem, refetch, deletingOrder]);

  const handleRestore = useCallback(
    async (row: Order) => {
      try {
        await patchItem({
          path: `orders/${row.id}`,
          body: { isDeleted: false },
          invalidate: ["orders"],
        }).unwrap();
        refetch();
        notify.success("Order restored successfully.");
      } catch (err: any) {
        notify.error("Could not restore the order. Please try again.");
        console.error("Restore Order Error:", err);
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
    <>
      <OrdersTable
        data={orders}
        loading={loading}
        error={
          (ordersError as any)?.data?.message ||
          (ordersError as any)?.error ||
          ""
        }
        page={page}
        totalPages={totalPages}
        search={search}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        deliveryDateFrom={deliveryDateFrom}
        deliveryDateTo={deliveryDateTo}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        onStatusFilterChange={setStatusFilter}
        onTypeFilterChange={setTypeFilter}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onDeliveryDateFromChange={setDeliveryDateFrom}
        onDeliveryDateToChange={setDeliveryDateTo}
        sort={sort}
        onSortChange={setSort}
        onPageChange={setPage}
        onRowClick={handleRowClick}
        onView={handleView}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onExport={handleExport}
        onDelete={handleDelete}
        onRestore={handleRestore}
        showDeleted={showDeleted}
        onToggleDeleted={handleToggleDeleted}
      />

      <CustomModal
        open={!!deletingOrder}
        onOpenChange={(open) => !open && setDeletingOrder(null)}
        title="Confirm Delete"
        maxWidth="400px"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete order{" "}
            <span className="font-semibold text-foreground">
              {deletingOrder?.orderNumber}
            </span>
            ? This is a soft delete operation.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeletingOrder(null)}>
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

export default OrderPage;
