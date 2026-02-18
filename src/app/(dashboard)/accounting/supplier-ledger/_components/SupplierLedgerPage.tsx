'use client'
import { Box, Container, PrimaryHeading, PrimarySubHeading } from "@/components/reusables";
import { Info, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MakePaymentModal from "./MakePaymentModal";
import SupplierCreateModal from "./SupplierCreateModal";
import SupplierLedgerTable from "./SupplierLedgerTable";
import { mockSupplierLedgerData } from "./types";

const SupplierLedgerPage = () => {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isMakePaymentModalOpen, setIsMakePaymentModalOpen] = useState(false);

    const onSearchChange = (search: string) => {
        setSearch(search);
    };

    const onSearchSubmit = () => {
        console.log("Search submitted", search);
    };

    const filteredData = mockSupplierLedgerData.filter(supplier =>
        supplier.supplierName.toLowerCase().includes(search.toLowerCase()) ||
        supplier.supplierId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container className="space-y-6 !p-0">
            <Box>
                <PrimaryHeading>Supplier Ledger</PrimaryHeading>
                <PrimarySubHeading>Track and manage supplier payables and transactions</PrimarySubHeading>
            </Box>

            {/* Table */}
            <SupplierLedgerTable
                data={filteredData}
                onRowClick={(supplier) => {
                    router.push(`/accounting/supplier-ledger/${supplier.id}`);
                }}
                onSearchChange={onSearchChange}
                onSearchSubmit={onSearchSubmit}
                onAddSupplier={() => setIsCreateModalOpen(true)}
                search={search}
            />

            <SupplierCreateModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            <MakePaymentModal
                open={isMakePaymentModalOpen}
                onOpenChange={setIsMakePaymentModalOpen}
                supplier={null}
            />
        </Container>
    );
};

export default SupplierLedgerPage;
