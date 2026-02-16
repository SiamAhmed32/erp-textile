import React from "react";
import OrderEdit from "../../_components/OrderEdit";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;
    return <OrderEdit id={id} />;
}
