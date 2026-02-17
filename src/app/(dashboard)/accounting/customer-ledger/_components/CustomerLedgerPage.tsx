'use client'
import { useState } from "react";
import CustomerCreateModal from "./CustomerCreateModal";
import RecordPaymentModal from "./RecordPaymentModal";
import { mockCustomerLedgerData, mockCustomerStats, CustomerLedgerItem } from "./types";
import { Flex, Box, PrimaryHeading, PrimarySubHeading } from "@/components/reusables";
import { Eye } from "lucide-react";
import StatsCards from "./StatsCards";
import CustomerLedgerTable from "./CustomerLedgerTable";
import CustomerDetails from "./CustomerDetails";

const CustomerLedgerPage = () => {
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerLedgerItem | null>(null);
    const [search, setSearch] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);

    const onSearchChange = (search: string) => {
        setSearch(search);
    };

    const onSearchSubmit = () => {
        console.log("Search submitted", search);
    };

    const filteredData = mockCustomerLedgerData.filter(customer =>
        customer.customerName.toLowerCase().includes(search.toLowerCase()) ||
        customer.customerId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Flex className="flex-col gap-6 p-2 h-full overflow-hidden">
            <Box>
                <PrimaryHeading>Customer Ledger</PrimaryHeading>
                <PrimarySubHeading>Track customer balances and payment history</PrimarySubHeading>
            </Box>

            <StatsCards stats={mockCustomerStats} />

            <Flex className="gap-6 flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
                <Box className="flex-1 min-h-0">
                    <CustomerLedgerTable
                        data={filteredData}
                        onRowClick={setSelectedCustomer}
                        onSearchChange={onSearchChange}
                        onSearchSubmit={onSearchSubmit}
                        onAddCustomer={() => setIsCreateModalOpen(true)}
                        search={search}
                    />
                </Box>

                <Box className="w-full lg:w-[400px] shrink-0 h-full flex flex-col min-h-0">
                    {selectedCustomer ? (
                        <CustomerDetails
                            customer={selectedCustomer}
                            onClose={() => setSelectedCustomer(null)}
                            onRecordPayment={() => setIsRecordPaymentModalOpen(true)}
                        />
                    ) : (
                        <Box className="h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center text-muted-foreground bg-slate-50/50">
                            <Box className="bg-slate-100 rounded-full p-4 mb-4">
                                <Eye className="h-8 w-8 opacity-20" />
                            </Box>
                            <p className="font-semibold text-secondary">No Customer Selected</p>
                            <p className="text-sm">Select a customer from the list to view their full ledger and transaction history</p>
                        </Box>
                    )}
                </Box>
            </Flex>

            <CustomerCreateModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            <RecordPaymentModal
                open={isRecordPaymentModalOpen}
                onOpenChange={setIsRecordPaymentModalOpen}
                customer={selectedCustomer}
            />
        </Flex>
    );
};

export default CustomerLedgerPage;
