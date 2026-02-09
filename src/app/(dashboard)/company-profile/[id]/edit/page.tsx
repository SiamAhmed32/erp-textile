import React from "react";
import CompanyProfileEdit from "../../_components/CompanyProfileEdit";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;
    return <CompanyProfileEdit id={id} />;
}
