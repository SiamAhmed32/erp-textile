'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import SupplierCreateModal from "./SupplierCreateModal";
import MakePaymentModal from "./MakePaymentModal";
import { mockSupplierLedgerData, mockSupplierStats, SupplierLedgerItem } from "./types";
import { Flex, Box, PrimaryHeading, PrimarySubHeading } from "@/components/reusables";
import { Eye } from "lucide-react";
import StatsCards from "./StatsCards";
import SupplierLedgerTable from "./SupplierLedgerTable";
import SupplierDetails from "./SupplierDetails";

const SupplierLedgerPage = () => {
    const router = useRouter();
    const [selectedSupplier, setSelectedSupplier] = useState<SupplierLedgerItem | null>(null);
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
        <Flex className="flex-col gap-6 p-2 h-full overflow-hidden">
            <Box>
                <PrimaryHeading>Supplier Ledger</PrimaryHeading>
                <PrimarySubHeading>Manage supplier accounts and payment obligations</PrimarySubHeading>
            </Box>

            <Box className="flex-1 min-h-0">
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
            </Box>

            <SupplierCreateModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            <MakePaymentModal
                open={isMakePaymentModalOpen}
                onOpenChange={setIsMakePaymentModalOpen}
                supplier={null}
            />
        </Flex>
    );
};

export default SupplierLedgerPage;
