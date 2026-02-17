'use client'

import { Box, Container, Flex, PrimaryHeading } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parse } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ArrowLeft, Calendar, Download, MapPin, Receipt } from "lucide-react";
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { mockCustomerLedgerData } from "../_components/types";

const CustomerDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const customer = useMemo(() =>
        mockCustomerLedgerData.find(c => c.id === id),
        [id]);

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const filteredTransactions = useMemo(() => {
        if (!customer) return [];
        if (!startDate && !endDate) return customer.transactions;

        return customer.transactions.filter(t => {
            const tDate = parse(t.date, "dd MMM yyyy", new Date());
            const start = startDate ? new Date(startDate) : new Date(0);
            const end = endDate ? new Date(endDate) : new Date(8640000000000000);

            // Set end to end of day
            if (endDate) end.setHours(23, 59, 59, 999);

            return tDate >= start && tDate <= end;
        });
    }, [customer, startDate, endDate]);

    const handleExportPdf = () => {
        if (!customer) return;
        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("CUSTOMER LEDGER", 105, 15, { align: "center" });

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`Customer: ${customer.customerName}`, 14, 25);
        doc.text(`ID: ${customer.customerId}`, 14, 30);
        doc.text(`Address: ${customer.address}`, 14, 35);
        doc.text(`Statement Period: ${startDate || 'All'} to ${endDate || 'Present'}`, 14, 40);

        // Balances
        doc.setFont("helvetica", "bold");
        doc.text(`Current Balance: $${customer.balance.toLocaleString()}`, 150, 25);
        doc.setFont("helvetica", "normal");
        doc.text(`Total Debit: $${customer.totalDebit.toLocaleString()}`, 150, 30);
        doc.text(`Total Credit: $${customer.totalCredit.toLocaleString()}`, 150, 35);

        // Table
        const tableHead = [["Date", "Description", "Type", "Amount"]];
        const tableBody = filteredTransactions.map(t => [
            t.date,
            t.description,
            t.type,
            {
                content: (t.amount > 0 ? `+${t.amount.toLocaleString()}` : t.amount.toLocaleString()),
                styles: { textColor: (t.isCredit ? [22, 163, 74] : [0, 0, 0]) as [number, number, number] }
            }
        ]);

        autoTable(doc, {
            startY: 50,
            head: tableHead,
            body: tableBody,
            theme: "grid",
            headStyles: { fillColor: [51, 65, 85] },
        });

        doc.save(`${customer.customerName}_Ledger.pdf`);
    };

    if (!customer) {
        return (
            <Container className="py-10">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Customer not found</h2>
                    <Button variant="link" onClick={() => router.back()}>Go Back</Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="pb-10 pt-6">
            <Flex className="flex-col gap-6">
                {/* Header Actions */}
                <Flex className="items-center justify-between">
                    <Flex className="items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Box>
                            <PrimaryHeading>{customer.customerName}</PrimaryHeading>
                            <p className="text-sm text-muted-foreground uppercase">{customer.customerId}</p>
                        </Box>
                    </Flex>
                    <Button variant="outline" onClick={handleExportPdf}>
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                    </Button>
                </Flex>

                <Flex className="gap-6 flex-col lg:flex-row">
                    {/* Summary Cards */}
                    <Card className="flex-1 shadow-sm border-none bg-slate-50/50">
                        <CardContent className="p-6">
                            <Flex className="items-center gap-4 mb-4">
                                <Box className="bg-white p-2 rounded-lg shadow-xs">
                                    <MapPin className="h-5 w-5 text-secondary" />
                                </Box>
                                <Box>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Address</p>
                                    <p className="text-sm font-medium">{customer.address}</p>
                                </Box>
                            </Flex>
                            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-200">
                                <Box>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Balance</p>
                                    <p className="text-2xl font-bold text-secondary">${customer.balance.toLocaleString()}</p>
                                </Box>
                                <Box>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Debit</p>
                                    <p className="text-2xl font-bold text-red-500">${customer.totalDebit.toLocaleString()}</p>
                                </Box>
                                <Box>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Credit</p>
                                    <p className="text-2xl font-bold text-green-600">${customer.totalCredit.toLocaleString()}</p>
                                </Box>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Date Filters */}
                    <Card className="w-full lg:w-[350px] shadow-sm border-none">
                        <CardContent className="p-6 space-y-4">
                            <Flex className="items-center gap-2 mb-2">
                                <Calendar className="h-4 w-4 text-secondary" />
                                <h4 className="text-sm font-bold uppercase tracking-tight">Filter by Date</h4>
                            </Flex>
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="startDate">From</Label>
                                    <Input
                                        type="date"
                                        id="startDate"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="endDate">To</Label>
                                    <Input
                                        type="date"
                                        id="endDate"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                                {(startDate || endDate) && (
                                    <Button
                                        variant="ghost"
                                        className="w-full text-xs"
                                        onClick={() => { setStartDate(""); setEndDate(""); }}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </Flex>

                {/* Transactions Table/List */}
                <Card className="shadow-sm border-none overflow-hidden">
                    <CardContent className="p-0">
                        <Box className="p-5 border-b bg-slate-50/30">
                            <h4 className="text-sm font-bold flex items-center gap-2 text-secondary uppercase tracking-tight">
                                <Receipt className="h-4 w-4" /> Transaction History
                            </h4>
                        </Box>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-muted-foreground text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold">Date</th>
                                        <th className="px-6 py-3 text-left font-semibold">Description</th>
                                        <th className="px-6 py-3 text-left font-semibold">Type</th>
                                        <th className="px-6 py-3 text-right font-semibold">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredTransactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{t.date}</td>
                                            <td className="px-6 py-4 font-medium text-secondary">{t.description}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                                                    {t.type}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 text-right font-bold ${t.isCredit ? 'text-green-600' : 'text-secondary'}`}>
                                                {t.amount > 0 ? `+${t.amount.toLocaleString()}` : t.amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredTransactions.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                                                No transactions found for the selected period.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </Flex>
        </Container>
    );
};

export default CustomerDetailPage;
