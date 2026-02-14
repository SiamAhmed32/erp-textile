import React from "react";
import OrderDetails from "../_components/OrderDetails";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;
    return <OrderDetails id={id} />;
}
