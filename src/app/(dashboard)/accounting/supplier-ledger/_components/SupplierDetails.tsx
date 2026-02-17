import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, X, Receipt, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupplierLedgerItem } from "./types";
import { Box, Flex } from "@/components/reusables";
import PrimaryButton from '@/components/reusables/PrimaryButton';

interface SupplierDetailsProps {
    supplier: SupplierLedgerItem;
    onClose: () => void;
    onMakePayment: () => void;
}

const SupplierDetails = ({ supplier, onClose, onMakePayment }: SupplierDetailsProps) => {
    return (
        <Card className="h-full shadow-xs relative overflow-hidden flex flex-col">
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10"
                onClick={onClose}
            >
                <X className="h-4 w-4" />
            </Button>

            <CardContent className="p-5 flex-1 flex flex-col gap-6 overflow-auto">
                {/* Header Section */}
                <Flex className="flex-col items-center text-center gap-2 pt-4">
                    <Flex className="h-16 w-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-2xl font-bold border border-green-100">
                        {supplier.supplierName.charAt(0)}
                    </Flex>
                    <Box>
                        <h3 className="text-xl font-bold text-secondary">{supplier.supplierName}</h3>
                        <p className="text-sm text-muted-foreground uppercase">{supplier.supplierId}</p>
                    </Box>
                </Flex>

                {/* Address Section */}
                <Flex className="items-start gap-2 text-sm text-muted-foreground bg-slate-50 p-3 rounded-md">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <p>{supplier.address}</p>
                </Flex>

                {/* Balance Summary Card */}
                <Box className="bg-red-50/50 border border-red-100 rounded-lg p-4 space-y-3">
                    <Flex className="justify-between items-center text-secondary">
                        <span className="text-sm font-medium">Amount Due</span>
                        <span className="text-xl font-bold text-red-600">
                            {supplier.balance < 0 ? `-$${Math.abs(supplier.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `$${supplier.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </span>
                    </Flex>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-red-100">
                        <Box>
                            <p className="text-xs text-muted-foreground font-semibold">Total Debit</p>
                            <p className="font-bold text-red-500">${supplier.totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </Box>
                        <Box className="text-right">
                            <p className="text-xs text-muted-foreground font-semibold">Total Credit</p>
                            <p className="font-bold text-green-600">${supplier.totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </Box>
                    </div>
                </Box>

                {/* Recent Transactions List */}
                <Flex className="flex-1 flex-col gap-3 min-h-0">
                    <h4 className="text-sm font-bold flex items-center gap-2 text-secondary uppercase tracking-tight">
                        Recent Transactions
                    </h4>
                    <Box className="flex-1 overflow-auto space-y-2 pr-1">
                        {supplier.transactions.map((t) => (
                            <Flex key={t.id} className="justify-between items-center p-3 rounded-md border border-slate-100 hover:bg-slate-50 transition-colors">
                                <Box className="space-y-1">
                                    <p className="text-sm font-medium leading-none text-secondary">{t.type}</p>
                                    <p className="text-xs text-muted-foreground">{t.date}</p>
                                </Box>
                                <p className={`text-sm font-bold ${t.amount >= 0 ? 'text-green-600' : 'text-secondary'}`}>
                                    {t.amount >= 0 ? `+${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `-$${Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                </p>
                            </Flex>
                        ))}
                    </Box>
                </Flex>

                {/* Action Buttons */}
                <div className="grid grid-cols-5 gap-2 pt-2">
                    <Box className="col-span-4">
                        <PrimaryButton handleClick={onMakePayment}>
                            + Make Payment
                        </PrimaryButton>
                    </Box>
                    <Button variant="outline" size="icon" className="shrink-0 h-10 w-full">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default SupplierDetails;
