import React from "react";
import CompanyProfileDetails from "../_components/CompanyProfileDetails";

type Props = {
    params: { id: string };
};

export default function Page({ params }: Props) {
    return <CompanyProfileDetails id={params.id} />;
}
