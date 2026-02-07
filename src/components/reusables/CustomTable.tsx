import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    className?: string;
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

interface CustomTableProps<T> {
    data: T[];
    columns: Column<T>[];
    className?: string;
    title?: string;
    description?: string;
    pagination?: PaginationProps;
    scrollAreaHeight?: string;
}

function CustomTable<T extends Record<string, any>>({
    data,
    columns,
    className,
    title,
    description,
    pagination,
    scrollAreaHeight = "h-[calc(100vh-250px)]",
}: CustomTableProps<T>) {
    const renderPaginationItems = () => {
        if (!pagination) return null;
        const { currentPage, totalPages, onPageChange } = pagination;
        const items = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(
                <PaginationItem key="1">
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange(1);
                        }}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>,
            );
            if (startPage > 2) {
                items.push(
                    <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                    </PaginationItem>,
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        isActive={currentPage === i}
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange(i);
                        }}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(
                    <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                    </PaginationItem>,
                );
            }
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange(totalPages);
                        }}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>,
            );
        }

        return items;
    };

    return (
        <div className={className}>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <div className={`overflow-auto border rounded-md ${scrollAreaHeight}`}>
                <Table>
                    <TableHeader className="sticky top-0 bg-secondary z-10">
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableHead key={index} className={column.className}>
                                    {column.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {columns.map((column, colIndex) => (
                                        <TableCell key={colIndex} className={column.className}>
                                            {typeof column.accessor === "function"
                                                ? column.accessor(row)
                                                : row[column.accessor]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            {pagination && (
                <div className="mt-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (pagination.currentPage > 1) {
                                            pagination.onPageChange(pagination.currentPage - 1);
                                        }
                                    }}
                                    className={
                                        pagination.currentPage <= 1
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                />
                            </PaginationItem>
                            {renderPaginationItems()}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (pagination.currentPage < pagination.totalPages) {
                                            pagination.onPageChange(pagination.currentPage + 1);
                                        }
                                    }}
                                    className={
                                        pagination.currentPage >= pagination.totalPages
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}

export default CustomTable;
