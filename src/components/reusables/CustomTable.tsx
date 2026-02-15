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
import { Skeleton } from "@/components/ui/skeleton";
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
    onRowClick?: (row: T) => void;
    pagination?: PaginationProps;
    scrollAreaHeight?: string;
    isLoading?: boolean;
    skeletonRows?: number;
}

function CustomTable<T extends Record<string, any>>({
    data,
    columns,
    className,
    title,
    description,
    onRowClick,
    pagination,
    scrollAreaHeight = "h-[calc(100vh-250px)]",
    isLoading = false,
    skeletonRows = 5,
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
            {(title || description) && (
                <div className="mb-6">
                    {title && <h1 className="text-2xl font-bold">{title}</h1>}
                    {description && <p className="text-muted-foreground">{description}</p>}
                </div>
            )}
            <div className={`overflow-auto border rounded-md ${scrollAreaHeight}`}>
                <Table overflowWrapper={false} className="border-separate border-spacing-0">
                    <TableHeader className="sticky top-0 z-10">
                        <TableRow className="hover:bg-transparent border-none">
                            {columns.map((column, index) => (
                                <TableHead
                                    key={index}
                                    className={`sticky top-0 z-20 bg-secondary text-white font-semibold h-12 border-b-2 border-secondary ${column.className || ""}`}
                                >
                                    {column.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                                <TableRow key={`skeleton-${rowIndex}`} className="border-none odd:bg-white even:bg-secondary/10">
                                    {columns.map((column, colIndex) => (
                                        <TableCell key={colIndex} className={column.className}>
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-[60vh] text-center bg-white"
                                >
                                    <div className="flex flex-col items-center justify-center space-y-3 opacity-60">
                                        <div className="p-4 bg-muted rounded-full">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="48"
                                                height="48"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-package-open"
                                            >
                                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                                <path d="m2 17 10 5 10-5" />
                                                <path d="m2 12 10 5 10-5" />
                                            </svg>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xl font-semibold tracking-tight">
                                                No Data Found
                                            </p>
                                            <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
                                                We couldn't find what you're looking for. Try
                                                refining your search or filters.
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, rowIndex) => (
                                <TableRow
                                    key={rowIndex}
                                    onClick={() => onRowClick?.(row)}
                                    className="border-none bg-white even:bg-secondary/5 hover:bg-secondary/10  transition-colors cursor-pointer"
                                >
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
