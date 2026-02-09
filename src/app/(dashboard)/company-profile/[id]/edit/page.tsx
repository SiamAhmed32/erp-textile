import React from "react";
import CompanyProfileEdit from "../../_components/CompanyProfileEdit";

type Props = {
    params: { id: string };
};

export default function Page({ params }: Props) {
    return <CompanyProfileEdit id={params.id} />;
}
