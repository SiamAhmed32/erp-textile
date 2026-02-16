import React from "react";
import InvoiceEdit from "../../_components/InvoiceEdit";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;
    return <InvoiceEdit id={id} />;
}
