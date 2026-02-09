import React from "react";
import CompanyProfileDetails from "../_components/CompanyProfileDetails";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;
    return <CompanyProfileDetails id={id} />;
}
