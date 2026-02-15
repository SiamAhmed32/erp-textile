import React from "react";
import OrderDetails from "../_components/OrderDetails";

type Props = {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ export?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
    const { id } = await params;
    const query = (await searchParams) || {};
    return <OrderDetails id={id} shouldExport={query.export === "pdf"} />;
}
