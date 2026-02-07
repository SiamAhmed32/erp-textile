
"use client";
import CustomTable from "@/components/reusables/CustomTable";
import React, { useState } from "react";

type Order = {
    id: string;
    customer: string;
    product: string;
    quantity: number;
    status: string;
    date: string;
};

const OrdersTable = () => {
    const [currentPage, setCurrentPage] = useState(1);

    // Sample data
    const orders: Order[] = [
        {
            id: "ORD-001",
            customer: "John Doe",
            product: "Cotton Fabric",
            quantity: 500,
            status: "Pending",
            date: "2024-02-07",
        },
        {
            id: "ORD-002",
            customer: "Jane Smith",
            product: "Polyester Labels",
            quantity: 1000,
            status: "Processing",
            date: "2024-02-06",
        },
        {
            id: "ORD-003",
            customer: "Bob Johnson",
            product: "Carton Boxes",
            quantity: 200,
            status: "Delivered",
            date: "2024-02-05",
        },
    ];

    const columns = [
        {
            header: "Order ID",
            accessor: "id" as keyof Order,
        },
        {
            header: "Customer",
            accessor: "customer" as keyof Order,
        },
        {
            header: "Product",
            accessor: "product" as keyof Order,
        },
        {
            header: "Quantity",
            accessor: "quantity" as keyof Order,
        },
        {
            header: "Status",
            accessor: ((row: Order) => (
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : row.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                >
                    {row.status}
                </span>
            )) as any,
        },
        {
            header: "Date",
            accessor: "date" as keyof Order,
        },
    ];

    return (
        <div className="w-full">
            <CustomTable
                title="Orders"
                description="Manage and track all your orders"
                data={orders}
                columns={columns}
                pagination={{
                    currentPage,
                    totalPages: 2, // Example total pages
                    onPageChange: (page) => setCurrentPage(page),
                }}
            />
        </div>
    );
};

export default OrdersTable;
