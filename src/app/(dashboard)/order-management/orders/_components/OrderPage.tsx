"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAllQuery, usePatchMutation } from "@/store/services/commonApi";
import OrdersTable from "./OrdersTable";
import { Order, OrderApiItem } from "./types";
import { normalizeOrder } from "./helpers";

const OrderPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
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
    filters: {
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      ...(typeFilter !== "all" ? { productType: typeFilter } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
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
      parsed?.error ||
      "Failed to load orders";
    console.error("Load Orders Error:", message);
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

  const handleDelete = useCallback(
    async (row: Order) => {
      try {
        await patchItem({
          path: `orders/${row.id}`,
          body: { isDeleted: true },
          invalidate: ["orders"],
        }).unwrap();
        refetch();
      } catch (err: any) {
        console.error(
          "Delete Order Error:",
          err.message || "Failed to delete order",
        );
      }
    },
    [patchItem, refetch],
  );

  const handleSearchSubmit = useCallback(() => {
    setDebouncedSearch(search);
    setPage(1);
  }, [search]);

  return (
    <OrdersTable
      data={orders}
      loading={loading}
      page={page}
      totalPages={totalPages}
      search={search}
      statusFilter={statusFilter}
      typeFilter={typeFilter}
      dateFrom={dateFrom}
      dateTo={dateTo}
      onSearchChange={setSearch}
      onSearchSubmit={handleSearchSubmit}
      onStatusFilterChange={setStatusFilter}
      onTypeFilterChange={setTypeFilter}
      onDateFromChange={setDateFrom}
      onDateToChange={setDateTo}
      onPageChange={setPage}
      onAddOrder={() => router.push("/order-management/orders/add-new-order")}
      onRowClick={handleRowClick}
      onView={handleView}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onExport={handleExport}
      onDelete={handleDelete}
    />
  );
};

export default OrderPage;
