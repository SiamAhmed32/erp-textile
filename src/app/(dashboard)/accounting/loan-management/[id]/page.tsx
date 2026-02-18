"use client";

import {
    Box,
    Container,
    PrimaryHeading,
    PrimarySubHeading
} from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function LoanDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const id = params.id;

    // Mock Detail Data
    const data = {
        id: id,
        lender: 'Bank Asia',
        type: 'Term Loan',
        principal: 5000000,
        balance: 4200000,
        interestRate: '9%',
        startDate: '2023-01-01',
        endDate: '2028-01-01'
    };

    const repayments = [
        { date: '2024-01-01', amount: 100000, principal: 80000, interest: 20000 },
        { date: '2024-02-01', amount: 100000, principal: 81000, interest: 19000 },
    ];

    const columns = useMemo(() => [
        { header: "Date", accessor: (row: any) => row.date },
        { header: "Total Paid", accessor: (row: any) => `৳ ${row.amount.toLocaleString()}` },
        { header: "Principal", accessor: (row: any) => `৳ ${row.principal.toLocaleString()}` },
        { header: "Interest", accessor: (row: any) => `৳ ${row.interest.toLocaleString()}` },
    ], []);

    return (
        <Container className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/accounting/loan-management">
                        <ArrowLeft className="size-4 mr-2" />
                        Back to List
                    </Link>
                </Button>
            </div>

            <Box className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <PrimaryHeading>Loan Details: {id}</PrimaryHeading>
                    <PrimarySubHeading>View loan summary and repayment history</PrimarySubHeading>
                </div>
                <Button variant="outline">
                    <Printer className="size-4 mr-2" />
                    Print Statement
                </Button>
            </Box>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Loan Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="text-sm font-medium text-slate-500">Lender</div>
                            <div className="text-lg font-bold">{data.lender}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-500">Principal Amount</div>
                            <div className="text-lg font-mono font-bold text-slate-900">৳ {data.principal.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-500">Current Balance</div>
                            <div className="text-xl font-mono font-bold text-red-600">৳ {data.balance.toLocaleString()}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <div className="text-sm font-medium text-slate-500">Interest Rate</div>
                                <div>{data.interestRate}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-slate-500">Type</div>
                                <div>{data.type}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Repayment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CustomTable
                            data={repayments}
                            columns={columns}
                            isLoading={false}
                            pagination={{ currentPage: 1, totalPages: 1, onPageChange: () => { } }}
                        />
                    </CardContent>
                </Card>
            </div>
        </Container>
    );
}
