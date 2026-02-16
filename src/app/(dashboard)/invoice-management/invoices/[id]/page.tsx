import React from "react";
import InvoiceDetails from "../_components/InvoiceDetails";

type Props = {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ export?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
    const { id } = await params;
    const query = (await searchParams) || {};
    return <InvoiceDetails id={id} shouldExport={query.export === "pdf"} />;
}
