'use client'
import { Box, Container, PrimaryHeading, PrimarySubHeading } from "@/components/reusables";
import { Info, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomerCreateModal from "./CustomerCreateModal";
import CustomerLedgerTable from "./CustomerLedgerTable";
import RecordPaymentModal from "./RecordPaymentModal";
import { mockCustomerLedgerData } from "./types";

const CustomerLedgerPage = () => {
    const router = useRouter();
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
        <Container className="space-y-6 !p-0">
            <Box>
                <PrimaryHeading>Customer Ledger</PrimaryHeading>
                <PrimarySubHeading>View and manage all customer accounts and their balances</PrimarySubHeading>
            </Box>

            {/* Table */}
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

            <CustomerCreateModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            <RecordPaymentModal
                open={isRecordPaymentModalOpen}
                onOpenChange={setIsRecordPaymentModalOpen}
                customer={null}
            />
        </Container>
    );
};

export default CustomerLedgerPage;
