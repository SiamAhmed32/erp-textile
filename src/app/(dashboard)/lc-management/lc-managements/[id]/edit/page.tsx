import React from "react";
import LCEdit from "../../_components/LCEdit";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LCEdit id={id} />;
}
