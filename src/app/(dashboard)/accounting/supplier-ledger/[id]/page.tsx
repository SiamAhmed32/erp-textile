'use client'

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Flex, Box, PrimaryHeading } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Receipt, MapPin, Calendar, User, List } from "lucide-react";
import { mockSupplierLedgerData, SupplierLedgerItem } from "../_components/types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { parse } from "date-fns";

const SupplierDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const supplier = useMemo(() =>
        mockSupplierLedgerData.find(s => s.id === id),
        [id]);

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const filteredTransactions = useMemo(() => {
        if (!supplier) return [];
        if (!startDate && !endDate) return supplier.transactions;

        return supplier.transactions.filter(t => {
            const tDate = parse(t.date, "dd MMM yyyy", new Date());
            const start = startDate ? new Date(startDate) : new Date(0);
            const end = endDate ? new Date(endDate) : new Date(8640000000000000);

            if (endDate) {
                end.setHours(23, 59, 59, 999);
            }

            return tDate >= start && tDate <= end;
        });
    }, [supplier, startDate, endDate]);

    const handleExportPdf = () => {
        if (!supplier) return;
        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("SUPPLIER LEDGER", 105, 15, { align: "center" });

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`Supplier: ${supplier.supplierName}`, 14, 25);
        doc.text(`ID: ${supplier.supplierId}`, 14, 30);
        doc.text(`Address: ${supplier.address}`, 14, 35);
        doc.text(`Statement Period: ${startDate || 'All'} to ${endDate || 'Present'}`, 14, 40);

        // Balances
        doc.setFont("helvetica", "bold");
        doc.text(`Amount Due: $${Math.abs(supplier.balance).toLocaleString()}`, 150, 25);

        // Table
        const tableHead = [["Date", "Description", "Type", "Amount"]];
        const tableBody = filteredTransactions.map(t => [
            t.date,
            t.description,
            t.type,
            {
                content: (t.amount >= 0 ? `+${t.amount.toLocaleString()}` : `-$${Math.abs(t.amount).toLocaleString()}`),
                styles: { textColor: (t.amount >= 0 ? [22, 163, 74] : [0, 0, 0]) as [number, number, number] }
            }
        ]);

        autoTable(doc, {
            startY: 50,
            head: tableHead,
            body: tableBody,
            theme: "grid",
            headStyles: { fillColor: [51, 65, 85] },
        });

        doc.save(`${supplier.supplierName}_Ledger.pdf`);
    };

    if (!supplier) {
        return (
            <Container className="py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Supplier not found</h2>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </Container>
        );
    }

    return (
        <Container className="pb-10 pt-4 px-4 bg-slate-50/30 min-h-screen">
            <Flex className="flex-col gap-6 max-w-6xl mx-auto">
                {/* Top Navigation & Actions */}
                <Flex className="items-center justify-between pb-4 border-b">
                    <Flex className="items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 text-xs font-semibold uppercase tracking-wider bg-white"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Ledger
                        </Button>
                        <Box>
                            <PrimaryHeading className="text-xl md:text-2xl">{supplier.supplierName}</PrimaryHeading>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{supplier.supplierId}</p>
                        </Box>
                    </Flex>
                    <Button
                        size="sm"
                        className="h-9 px-4 text-xs font-bold uppercase tracking-wider bg-secondary hover:bg-secondary/90 text-white shadow-sm"
                        onClick={handleExportPdf}
                    >
                        <Download className="mr-2 h-4 w-4" /> Export PDF
                    </Button>
                </Flex>

                {/* Filters Row */}
                <Card className="shadow-xs border-slate-200">
                    <CardContent className="p-4">
                        <Flex className="flex-col md:flex-row items-end gap-4">
                            <Box className="w-full md:w-auto space-y-1.5">
                                <Label htmlFor="startDate" className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3" /> Date From
                                </Label>
                                <Input
                                    type="date"
                                    id="startDate"
                                    className="h-9 text-xs focus-visible:ring-secondary/20"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </Box>
                            <Box className="w-full md:w-auto space-y-1.5">
                                <Label htmlFor="endDate" className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3" /> Date To
                                </Label>
                                <Input
                                    type="date"
                                    id="endDate"
                                    className="h-9 text-xs focus-visible:ring-secondary/20"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Box>
                            {(startDate || endDate) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 px-3 text-[10px] uppercase font-bold text-slate-400 hover:text-slate-600"
                                    onClick={() => { setStartDate(""); setEndDate(""); }}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </Flex>
                    </CardContent>
                </Card>

                {/* Information Sections */}
                <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Supplier Profile Card */}
                    <Card className="shadow-xs border-slate-200">
                        <Box className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                            <User className="h-4 w-4 text-secondary" />
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-secondary">General Information</h4>
                        </Box>
                        <CardContent className="p-5">
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <Box>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Supplier Name</p>
                                    <p className="text-sm font-semibold text-slate-700">{supplier.supplierName}</p>
                                </Box>
                                <Box>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Supplier ID</p>
                                    <p className="text-sm font-semibold text-slate-700">{supplier.supplierId}</p>
                                </Box>
                                <Box className="col-span-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> Address
                                    </p>
                                    <p className="text-sm font-medium text-slate-600 leading-relaxed">{supplier.address}</p>
                                </Box>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Balance Summary Card */}
                    <Card className="shadow-xs border-slate-200">
                        <Box className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                            <Receipt className="h-4 w-4 text-secondary" />
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-secondary">Account Summary</h4>
                        </Box>
                        <CardContent className="p-5 flex flex-col justify-center h-full min-h-[140px]">
                            <Box>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Amount Due</p>
                                <p className="text-4xl font-extrabold text-red-500 tracking-tight">
                                    ${Math.abs(supplier.balance).toLocaleString()}
                                </p>
                                <p className="text-[10px] font-medium text-slate-500 mt-2 italic">
                                    Total payable balance as of today
                                </p>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                {/* Transaction History Section */}
                <Card className="shadow-xs border-slate-200 overflow-hidden">
                    <Box className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <Flex className="items-center gap-2">
                            <List className="h-4 w-4 text-secondary" />
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-secondary">Transaction History</h4>
                        </Flex>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 uppercase">
                            {filteredTransactions.length} Entries
                        </span>
                    </Box>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3.5 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredTransactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500 uppercase">{t.date}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-700 group-hover:text-secondary transition-colors">{t.description}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter bg-slate-100 text-slate-600">
                                                    {t.type}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 text-right text-sm font-bold ${t.amount >= 0 ? 'text-green-600' : 'text-slate-800'}`}>
                                                {t.amount >= 0 ? `+${t.amount.toLocaleString()}` : `-$${Math.abs(t.amount).toLocaleString()}`}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredTransactions.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-16 text-center">
                                                <Box className="flex flex-col items-center gap-2 opacity-30">
                                                    <List className="h-8 w-8 text-slate-400" />
                                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">No transactions found</p>
                                                </Box>
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

export default SupplierDetailPage;
