"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, extractArray, extractMeta } from "@/lib/api";
import InvoicesTable from "./InvoicesTable";
import { Invoice, InvoiceApiItem } from "./types";
import { countByType, normalizeInvoice } from "./helpers";

const InvoicePage = () => {
    const router = useRouter();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
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

    const fetchInvoices = useCallback(async () => {
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

            const payload = await apiRequest(`/invoices?${params.toString()}`);
            const list = extractArray<InvoiceApiItem>(payload).map(normalizeInvoice);
            const meta = extractMeta(payload);
            setInvoices(list);
            setTotalPages(meta?.totalPage || meta?.totalPages || 1);
        } catch (err: any) {
            setError(err.message || "Failed to load invoices");
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, statusFilter, typeFilter, dateFrom, dateTo]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const handleRowClick = useCallback(
        (row: Invoice) => {
            router.push(`/invoice-management/invoices/${row.id}`);
        },
        [router]
    );

    const handleView = useCallback(
        (row: Invoice) => {
            router.push(`/invoice-management/invoices/${row.id}`);
        },
        [router]
    );

    const handleEdit = useCallback(
        (row: Invoice) => {
            router.push(`/invoice-management/invoices/${row.id}/edit`);
        },
        [router]
    );

    const handleExport = useCallback(
        (row: Invoice) => {
            router.push(`/invoice-management/invoices/${row.id}?export=pdf`);
        },
        [router]
    );

    const handleDelete = useCallback(
        async (row: Invoice) => {
            try {
                await apiRequest(`/invoices/${row.id}`, { method: "DELETE" });
                fetchInvoices();
            } catch (err: any) {
                setError(err.message || "Failed to delete invoice");
            }
        },
        [fetchInvoices]
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
            error={error}
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
            onAddInvoice={() => router.push("/invoice-management/invoices/add-new-invoice")}
            onRowClick={handleRowClick}
            onView={handleView}
            onEdit={handleEdit}
            onExport={handleExport}
            onDelete={handleDelete}
        />
    );
};

export default InvoicePage;
