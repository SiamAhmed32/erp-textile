"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import {
    Container,
    Flex,
    PrimaryHeading,
} from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const transactionTypes = [
    { value: 'custdue', label: 'Customer Due' },
    { value: 'receipt', label: 'Receipt' },
    { value: 'suppdue', label: 'Supplier Due' },
    { value: 'payment', label: 'Payment' },
    { value: 'journal', label: 'Journal' },
    { value: 'contra', label: 'Contra' },
];

const DailyBookkeepingPage = () => {
    const router = useRouter();
    const [transactionType, setTransactionType] = useState('custdue');
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        // Simulate save
        setTimeout(() => {
            setSaving(false);
            router.push('/accounting/overview');
        }, 1000);
    };

    return (
        <Container className="pb-10 pt-6">
            {/* Header Actions */}
            <Flex className="flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
                <div className="space-y-2">
                    <Link
                        href="/accounting/overview"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <PrimaryHeading className="!text-black">New Journal Entry</PrimaryHeading>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/accounting/overview">Cancel</Link>
                    </Button>
                    <Button
                        className="bg-black text-white hover:bg-black/90"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Posting..." : "Post Entry"}
                    </Button>
                </div>
            </Flex>

            <div className="space-y-6 max-w-4xl mx-auto lg:mx-0">
                {/* Transaction Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Transaction Type <span className="text-destructive">*</span></Label>
                            <Select
                                value={transactionType}
                                onValueChange={setTransactionType}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {transactionTypes.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input type="date" id="date" defaultValue="2026-02-18" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ref">Ref No.</Label>
                                <Input id="ref" value="JE-2026-042" readOnly className="bg-muted/50 font-mono text-muted-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Party & Amount Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Party & Amount</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {(transactionType === 'custdue' || transactionType === 'receipt') && (
                                <div className="space-y-2">
                                    <Label htmlFor="customer">Customer <span className="text-destructive">*</span></Label>
                                    <Select>
                                        <SelectTrigger id="customer">
                                            <SelectValue placeholder="Select Customer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Rahim Corporation</SelectItem>
                                            <SelectItem value="2">Nadia Enterprises</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {(transactionType === 'suppdue' || transactionType === 'payment') && (
                                <div className="space-y-2">
                                    <Label htmlFor="supplier">Supplier <span className="text-destructive">*</span></Label>
                                    <Select>
                                        <SelectTrigger id="supplier">
                                            <SelectValue placeholder="Select Supplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Libas Textiles</SelectItem>
                                            <SelectItem value="2">Fashion House</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (৳) <span className="text-destructive">*</span></Label>
                                <Input id="amount" placeholder="0.00" className="font-mono" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Narration & Preview Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Narration & Ledger Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="narration">Narration</Label>
                            <Input id="narration" placeholder="Enter a description for this transaction..." />
                        </div>

                        <div className="rounded-lg border bg-muted/30 overflow-hidden">
                            <div className="px-4 py-2 border-b bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                System Generated Lines
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-muted/20">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase">Account Head</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground text-xs uppercase">Debit</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground text-xs uppercase">Credit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-4 py-3 font-medium">Accounts Receivable</td>
                                        <td className="px-4 py-3 text-right font-mono text-emerald-600">75,000</td>
                                        <td className="px-4 py-3 text-right text-muted-foreground">—</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium">Sales Revenue</td>
                                        <td className="px-4 py-3 text-right text-muted-foreground">—</td>
                                        <td className="px-4 py-3 text-right font-mono text-emerald-600">75,000</td>
                                    </tr>
                                </tbody>
                                <tfoot className="bg-muted/50 font-medium">
                                    <tr>
                                        <td className="px-4 py-2 text-right text-xs uppercase text-muted-foreground">Totals</td>
                                        <td className="px-4 py-2 text-right font-mono">75,000</td>
                                        <td className="px-4 py-2 text-right font-mono">75,000</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="flex justify-end">
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                <Check className="size-4" />
                                <span className="text-xs font-bold uppercase">Balanced</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Container>
    );
};

export default DailyBookkeepingPage;

