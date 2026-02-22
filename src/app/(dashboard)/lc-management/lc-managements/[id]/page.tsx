import React from "react";
import LCDetails from "../_components/LCDetails";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LCDetails id={id} />;
}
