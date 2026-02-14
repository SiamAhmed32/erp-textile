"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, extractArray, extractMeta } from "@/lib/api";
import OrdersTable from "./OrdersTable";
import { Order, OrderApiItem } from "./types";
import { normalizeOrder } from "./helpers";

const OrderPage = () => {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    useEffect(() => {
        const handle = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(handle);
    }, [search]);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("limit", "10");
            if (debouncedSearch) params.set("search", debouncedSearch);
            if (statusFilter !== "all") params.set("status", statusFilter);
            if (typeFilter !== "all") params.set("productType", typeFilter);
            if (dateFrom) params.set("dateFrom", dateFrom);
            if (dateTo) params.set("dateTo", dateTo);

            const payload = await apiRequest(`/orders?${params.toString()}`);
            const list = extractArray<OrderApiItem>(payload).map(normalizeOrder);
            const meta = extractMeta(payload);
            setOrders(list);
            setTotalPages(meta?.totalPage || meta?.totalPages || 1);
        } catch (err: any) {
            setError(err.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, statusFilter, typeFilter, dateFrom, dateTo]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleRowClick = useCallback(
        (row: Order) => {
            router.push(`/order-management/orders/${row.id}`);
        },
        [router]
    );

    const handleView = useCallback(
        (row: Order) => {
            router.push(`/order-management/orders/${row.id}`);
        },
        [router]
    );

    const handleEdit = useCallback(
        (row: Order) => {
            router.push(`/order-management/orders/${row.id}/edit`);
        },
        [router]
    );

    const handleDuplicate = useCallback(
        (row: Order) => {
            router.push(`/order-management/orders/add-new-order?duplicateId=${row.id}`);
        },
        [router]
    );

    const handleExport = useCallback(
        (row: Order) => {
            router.push(`/order-management/orders/${row.id}?export=pdf`);
        },
        [router]
    );

    const handleDelete = useCallback(async (row: Order) => {
        try {
            await apiRequest(`/orders/${row.id}`, { method: "PATCH", body: { isDeleted: true } });
            fetchOrders();
        } catch (err: any) {
            setError(err.message || "Failed to delete order");
        }
    }, [fetchOrders]);

    const handleSearchSubmit = useCallback(() => {
        setDebouncedSearch(search);
        setPage(1);
    }, [search]);

    return (
        <OrdersTable
            data={orders}
            loading={loading}
            error={error}
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
