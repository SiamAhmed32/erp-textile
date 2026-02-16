import React from "react";
import OrderCreate from "../_components/OrderCreate";

type Props = {
    searchParams?: Promise<{ duplicateId?: string }>;
};

export default async function Page({ searchParams }: Props) {
    const params = (await searchParams) || {};
    return <OrderCreate duplicateId={params.duplicateId} />;
}
