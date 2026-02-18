"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Container,
    PrimaryHeading,
    PrimarySubHeading,
    Box,
} from "@/components/reusables";
import { Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/reusables/PrimaryButton";
import CustomTable from "@/components/reusables/CustomTable";

// Mock Data
const mockIOUs = [
    { id: 'IOU-2024-001', employee: 'Rahim Ahmed', position: 'Manager', amount: 5000, reason: 'Travel Advance', date: '2024-02-15', status: 'Pending' },
    { id: 'IOU-2024-002', employee: 'Karim Ullah', position: 'Driver', amount: 1200, reason: 'Fuel', date: '2024-02-14', status: 'Approved' },
    { id: 'IOU-2024-003', employee: 'Salma Begum', position: 'HR', amount: 2500, reason: 'Office Supplies', date: '2024-02-10', status: 'Settled' },
];

export default function CashBookPage() {
    const router = useRouter();

    const columns = useMemo(() => [
        {
            header: "IOU ID",
            accessor: (row: any) => <span className="font-mono text-xs">{row.id}</span>
        },
        {
            header: "Employee",
            accessor: (row: any) => (
                <div>
                    <div className="font-medium text-sm">{row.employee}</div>
                    <div className="text-xs text-muted-foreground">{row.position}</div>
                </div>
            )
        },
        {
            header: "Reason",
            accessor: (row: any) => row.reason
        },
        {
            header: "Amount",
            accessor: (row: any) => <span className="font-mono font-bold">৳ {row.amount.toLocaleString()}</span>
        },
        {
            header: "Date",
            accessor: (row: any) => row.date
        },
        {
            header: "Status",
            accessor: (row: any) => (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${row.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    row.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                    }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: "Actions",
            accessor: (row: any) => (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/accounting/cash-book/${row.id}`);
                    }}
                >
                    <Eye className="size-4 text-slate-500" />
                </Button>
            ),
            className: "text-right"
        }
    ], [router]);

    return (
        <Container className="space-y-6">
            <Box className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <PrimaryHeading>MOI (Cash Book)</PrimaryHeading>
                    <PrimarySubHeading>Track employee IOUs and petty cash expenses</PrimarySubHeading>
                </div>
                <PrimaryButton handleClick={() => { }}>
                    Create IOU
                </PrimaryButton>
            </Box>

            <Box className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <CustomTable
                    data={mockIOUs}
                    columns={columns}
                    isLoading={false}
                    pagination={{
                        currentPage: 1,
                        totalPages: 1,
                        onPageChange: () => { }
                    }}
                    onRowClick={(row) => router.push(`/accounting/cash-book/${row.id}`)}
                />
            </Box>
        </Container>
    );
}
