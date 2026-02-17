'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomerCreateModal from "./CustomerCreateModal";
import RecordPaymentModal from "./RecordPaymentModal";
import { mockCustomerLedgerData, mockCustomerStats, CustomerLedgerItem } from "./types";
import { Flex, Box, PrimaryHeading, PrimarySubHeading } from "@/components/reusables";
import { Eye } from "lucide-react";
import StatsCards from "./StatsCards";
import CustomerLedgerTable from "./CustomerLedgerTable";
import CustomerDetails from "./CustomerDetails";

const CustomerLedgerPage = () => {
    const router = useRouter();
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

            <Box className="flex-1 min-h-0">
                <CustomerLedgerTable
                    data={filteredData}
                    onRowClick={(customer) => {
                        router.push(`/accounting/customer-ledger/${customer.id}`);
                    }}
                    onSearchChange={onSearchChange}
                    onSearchSubmit={onSearchSubmit}
                    onAddCustomer={() => setIsCreateModalOpen(true)}
                    search={search}
                />
            </Box>

            <CustomerCreateModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            <RecordPaymentModal
                open={isRecordPaymentModalOpen}
                onOpenChange={setIsRecordPaymentModalOpen}
                customer={null} // This might need adjustment if still used from here
            />
        </Flex>
    );
};

export default CustomerLedgerPage;
