import React from "react";
import InvoiceDetails from "../_components/InvoiceDetails";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;
    return <InvoiceDetails id={id} />;
}
