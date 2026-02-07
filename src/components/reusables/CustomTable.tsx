import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    className?: string;
}

interface CustomTableProps<T> {
    data: T[];
    columns: Column<T>[];
    className?: string;
    title?: string;
    description?: string;
}

function CustomTable<T extends Record<string, any>>({
    data,
    columns,
    className,
    title,
    description,
}: CustomTableProps<T>) {
    return (
        <div className={className}>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <Table>
                <TableHeader>
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
    );
}

export default CustomTable;
