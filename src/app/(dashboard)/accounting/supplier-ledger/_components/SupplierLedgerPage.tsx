"use client";

import StatsCard from "@/components/dashboard/StatsCard";
import { Container } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowUpCircle, Building, Pencil, Trash2 } from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";
import { useGetAllQuery, useDeleteOneMutation } from "@/store/services/commonApi";
import { Supplier, SupplierApiResponse } from "./types";
import SupplierFormModal from "./SupplierFormModal";
import SupplierEditModal from "./SupplierEditModal";
import { toast } from "react-toastify";

const fmt = (n: number) => "৳ " + Math.abs(n).toLocaleString("en-IN");

export default function SupplierLedgerPage() {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const handle = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(handle);
    }, [search]);

    const { data: apiResponse, isLoading } = useGetAllQuery({
        path: "/suppliers",
        page,
        search: debouncedSearch,
    }) as { data: SupplierApiResponse, isLoading: boolean };

    const [deleteOne] = useDeleteOneMutation();

    const suppliers = apiResponse?.data || [];
    const lastPage = apiResponse?.lastPage || 1;

    const handleDelete = React.useCallback(async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this supplier?")) return;
        try {
            await deleteOne({ path: `/suppliers/${id}` }).unwrap();
            toast.success("Supplier deleted successfully");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete supplier");
        }
    }, [deleteOne]);

    const columns = useMemo(() => [
        {
            header: "Supplier",
            accessor: (row: Supplier) => (
                <div>
                    <div className="font-semibold text-foreground">{row.name}</div>
                    <div className="text-[10px] text-muted-foreground">{row.email}</div>
                </div>
            )
        },
        {
            header: "Phone",
            accessor: (row: Supplier) => row.phone,
        },
        {
            header: "Location",
            accessor: (row: Supplier) => row.location,
        },
        {
            header: "Address",
            accessor: (row: Supplier) => (
                <div className="max-w-[200px] truncate">{row.address}</div>
            ),
        },
        {
            header: "Status",
            accessor: (row: Supplier) => (
                <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-600"
                )}>
                    ACTIVE
                </span>
            )
        },
        {
            header: "Actions",
            accessor: (row: Supplier) => (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => {
                            setSelectedSupplier(row);
                            setIsEditModalOpen(true);
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(row.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ], []);

    const renderExpandedRow = (row: Supplier) => {
        return (
            <div className="bg-slate-50/50 p-6 border-t border-slate-100 italic text-slate-400 text-center">
                Detailed ledger integration coming soon...
            </div>
        );
    };

    return (
        <Container className="pb-10">
            <div className="space-y-4">
                {/* Stats Cards - 4 column grid matching InvoicesTable */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatsCard title="Total Suppliers" value={apiResponse?.total || 0} icon={Building} color="blue" />
                    <StatsCard title="Total Due Raised" value="৳ 0.00" icon={Building} color="orange" />
                    <StatsCard title="Paid Amount" value="৳ 0.00" icon={ArrowUpCircle} color="green" />
                    <StatsCard title="Outstanding Amount" value="৳ 0.00" icon={AlertCircle} color="red" />
                </div>

                {/* Toolbar - matching InvoicesTable layout */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
                        <Input
                            placeholder="Search supplier name, code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant="outline" onClick={() => { }}>
                            Search
                        </Button>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
                        <div className="w-full sm:max-w-[160px]">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="settled">Settled</SelectItem>
                                    <SelectItem value="overdue">Overdue</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-full gap-2 sm:max-w-[260px]">
                            <Input type="date" />
                            <Input type="date" />
                        </div>
                        <Button
                            className="bg-black text-white hover:bg-black/90"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Add Supplier
                        </Button>
                    </div>
                </div>

                {/* Supplier Table */}
                <CustomTable
                    data={suppliers}
                    columns={columns}
                    isLoading={isLoading}
                    onRowClick={(row) => setExpanded(expanded === row.id ? null : row.id)}
                    rowClassName="cursor-pointer"
                    scrollAreaHeight="h-[calc(100vh-320px)]"
                    pagination={{
                        currentPage: page,
                        totalPages: lastPage,
                        onPageChange: setPage,
                    }}
                />
                {suppliers.map(s => expanded === s.id && <div key={`exp-${s.id}`}>{renderExpandedRow(s)}</div>)}
            </div>

            <SupplierFormModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <SupplierEditModal
                open={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedSupplier(null);
                }}
                supplier={selectedSupplier}
            />
        </Container>
    );
}
