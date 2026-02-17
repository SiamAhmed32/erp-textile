import React from 'react';
import CustomerLedgerPage from "./_components/CustomerLedgerPage";
import { Container } from "@/components/reusables";

export default function Page() {
    return (
        <Container className="pb-10">
            <CustomerLedgerPage />
        </Container>
    );
}
