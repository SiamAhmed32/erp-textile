"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Printer } from "lucide-react";
import {
    Container,
    PrimaryHeading,
    Box,
    PrimarySubHeading
} from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function CashBookDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const id = params.id;

    // Mock Detail Data
    const data = {
        id: id,
        employee: 'Rahim Ahmed',
        position: 'Manager',
        amount: 5000,
        reason: 'Travel Advance',
        date: '2024-02-15',
        status: 'Pending',
        details: 'Advance required for factory visit in Chittagong. Estimated duration 2 days.',
        approvedBy: 'N/A'
    };

    return (
        <Container className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/accounting/cash-book">
                        <ArrowLeft className="size-4 mr-2" />
                        Back to List
                    </Link>
                </Button>
            </div>

            <Box className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <PrimaryHeading>IOU Details: {id}</PrimaryHeading>
                    <PrimarySubHeading>View transaction details</PrimarySubHeading>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Printer className="size-4 mr-2" />
                        Print
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Check className="size-4 mr-2" />
                        Approve
                    </Button>
                </div>
            </Box>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Employee Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="text-sm font-medium text-slate-500">Name</div>
                            <div className="text-lg font-bold">{data.employee}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-500">Position</div>
                            <div className="text-base">{data.position}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="text-sm font-medium text-slate-500">Amount</div>
                            <div className="text-2xl font-mono font-bold text-amber-600">৳ {data.amount.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-500">Reason</div>
                            <div className="text-base">{data.reason}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-500">Date</div>
                            <div className="text-base font-mono">{data.date}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-500">Status</div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                {data.status}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Container>
    );
}
