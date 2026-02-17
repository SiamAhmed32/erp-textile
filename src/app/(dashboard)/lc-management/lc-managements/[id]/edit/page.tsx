import React from "react";
import LCEdit from "../../_components/LCEdit";

export default function Page({ params }: { params: { id: string } }) {
  return <LCEdit id={params.id} />;
}
