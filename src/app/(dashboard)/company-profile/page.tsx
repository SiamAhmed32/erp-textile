import React from "react";
import { Container, PrimaryHeading } from "@/components/reusables";
import CompanyProfilePage from "./_components/CompanyProfilePage";

export default function Page() {
    return (
        <Container className="pb-10 pt-6">
            <div className="space-y-2">
                <PrimaryHeading>Company Profiles</PrimaryHeading>
            </div>
            <div className="mt-4" />
            <CompanyProfilePage />
        </Container>
    );
}
