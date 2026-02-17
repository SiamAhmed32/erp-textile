import React from "react";
import LCDetails from "../_components/LCDetails";

export default function Page({ params }: { params: { id: string } }) {
  return <LCDetails id={params.id} />;
}
