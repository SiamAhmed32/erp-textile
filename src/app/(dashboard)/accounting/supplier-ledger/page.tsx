import React from 'react';
import SupplierLedgerPage from "./_components/SupplierLedgerPage";
import { Container } from "@/components/reusables";

export default function Page() {
    return (
        <Container className="pb-10 h-full overflow-hidden">
            <SupplierLedgerPage />
        </Container>
    );
}
