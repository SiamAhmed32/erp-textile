"use client";

import React, { useMemo } from "react";
import CustomTable from "@/components/reusables/CustomTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PrimaryText } from "@/components/reusables";
import { Order } from "./types";
import { formatDate, statusBadgeClass } from "./helpers";
import OrderActions from "./OrderActions";

type Props = {
    data: Order[];
    loading: boolean;
    error: string;
    page: number;
    totalPages: number;
    search: string;
    statusFilter: string;
    typeFilter: string;
    dateFrom: string;
    dateTo: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: () => void;
    onStatusFilterChange: (value: string) => void;
    onTypeFilterChange: (value: string) => void;
    onDateFromChange: (value: string) => void;
    onDateToChange: (value: string) => void;
    onPageChange: (page: number) => void;
    onAddOrder: () => void;
    onRowClick: (row: Order) => void;
    onView: (row: Order) => void;
    onEdit: (row: Order) => void;
    onDuplicate: (row: Order) => void;
    onExport: (row: Order) => void;
    onDelete: (row: Order) => void;
};

const OrdersTable = ({
    data,
    loading,
    error,
    page,
    totalPages,
    search,
    statusFilter,
    typeFilter,
    dateFrom,
    dateTo,
    onSearchChange,
    onSearchSubmit,
    onStatusFilterChange,
    onTypeFilterChange,
    onDateFromChange,
    onDateToChange,
    onPageChange,
    onAddOrder,
    onRowClick,
    onView,
    onEdit,
    onDuplicate,
    onExport,
    onDelete,
}: Props) => {
    const columns = useMemo(
        () => [
            {
                header: "Order",
                accessor: (row: Order) => (
                    <div>
                        <div className="font-semibold text-foreground">{row.orderNumber}</div>
                        <div className="text-xs text-muted-foreground">
                            {row.buyer?.name || row.buyerId}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {row.companyProfile?.name || row.companyProfileId}
                        </div>
                    </div>
                ),
            },
            {
                header: "Type",
                accessor: (row: Order) => row.productType,
            },
            {
                header: "Status",
                accessor: (row: Order) => (
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(
                            row.status
                        )}`}
                    >
                        {row.status}
                    </span>
                ),
            },
            {
                header: "Order Date",
                accessor: (row: Order) => formatDate(row.orderDate),
            },
            {
                header: "Delivery",
                accessor: (row: Order) => formatDate(row.deliveryDate),
            },
            {
                header: "Actions",
                accessor: (row: Order) => (
                    <OrderActions
                        onView={() => onView(row)}
                        onEdit={() => onEdit(row)}
                        onDuplicate={() => onDuplicate(row)}
                        onExport={() => onExport(row)}
                        onDelete={() => onDelete(row)}
                    />
                ),
                className: "text-right",
            },
        ],
        [onDelete, onDuplicate, onEdit, onExport, onView]
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
                    <Input
                        placeholder="Search order number, buyer, company"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    <Button variant="outline" onClick={onSearchSubmit}>
                        Search
                    </Button>
                </div>
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
                    <div className="w-full sm:max-w-[180px]">
                        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                {[
                                    "DRAFT",
                                    "PENDING",
                                    "PROCESSING",
                                    "APPROVED",
                                    "DELIVERED",
                                    "CANCELLED",
                                ].map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full sm:max-w-[180px]">
                        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Product Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {[
                                    "FABRIC",
                                    "LABEL_TAG",
                                    "CARTON",
                                ].map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* pushing */}
                    </div>
                    <div className="flex w-full gap-2 sm:max-w-[280px]">
                        <Input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} />
                        <Input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} />
                    </div>
                    <Button className="bg-black text-white hover:bg-black/90" onClick={onAddOrder}>
                        Create Order
                    </Button>
                </div>
            </div>

            {error && <PrimaryText className="text-sm text-destructive">{error}</PrimaryText>}
            {loading && (
                <PrimaryText className="text-sm text-muted-foreground">Loading orders...</PrimaryText>
            )}

            <CustomTable
                data={data}
                columns={columns}
                pagination={{
                    currentPage: page,
                    totalPages,
                    onPageChange,
                }}
                onRowClick={onRowClick}
                rowClassName="cursor-pointer"
                scrollAreaHeight="h-[calc(100vh-300px)]"
            />
        </div>
    );
};

export default React.memo(OrdersTable);
