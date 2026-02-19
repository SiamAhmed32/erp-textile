"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Container,
    PrimaryHeading,
    PrimarySubHeading,
    Box
} from "@/components/reusables";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/reusables/PrimaryButton";
import CustomTable from "@/components/reusables/CustomTable";

// Mock Data
const mockLoans = [
    { id: 'LN-2024-001', lender: 'Bank Asia', type: 'Term Loan', principal: 5000000, balance: 4200000, nextPayment: '2024-03-01' },
    { id: 'LN-2024-002', lender: 'Director Investment', type: 'Internal', principal: 2000000, balance: 2000000, nextPayment: 'On Demand' },
];

export default function LoanManagementPage() {
    const router = useRouter();

    const columns = useMemo(() => [
        {
            header: "Loan ID",
            accessor: (row: any) => <span className="font-mono text-xs">{row.id}</span>
        },
        {
            header: "Lender",
            accessor: (row: any) => (
                <div>
                    <div className="font-medium text-sm">{row.lender}</div>
                    <div className="text-xs text-muted-foreground">{row.type}</div>
                </div>
            )
        },
        {
            header: "Principal",
            accessor: (row: any) => <span className="font-mono">৳ {row.principal.toLocaleString()}</span>
        },
        {
            header: "Outstanding Balance",
            accessor: (row: any) => <span className="font-mono font-bold text-red-600">৳ {row.balance.toLocaleString()}</span>
        },
        {
            header: "Next Payment",
            accessor: (row: any) => row.nextPayment
        },
        {
            header: "Actions",
            accessor: (row: any) => (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/accounting/loan-management/${row.id}`);
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
                    <PrimaryHeading>Loan Management</PrimaryHeading>
                    <PrimarySubHeading>Track company loans and repayment schedules</PrimarySubHeading>
                </div>
                <PrimaryButton handleClick={() => { }}>
                    Add New Loan
                </PrimaryButton>
            </Box>

            <Box className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <CustomTable
                    data={mockLoans}
                    columns={columns}
                    isLoading={false}
                    pagination={{
                        currentPage: 1,
                        totalPages: 1,
                        onPageChange: () => { }
                    }}
                    onRowClick={(row) => router.push(`/accounting/loan-management/${row.id}`)}
                />
            </Box>
        </Container>
    );
}
