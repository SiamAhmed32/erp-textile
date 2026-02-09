import React from "react"
import { CompanyProfileDetailPage } from "@/components/CompanyProfiles/CompanyProfileDetailPage"

type Props = {
  params: { id: string }
}

export default function Page({ params }: Props) {
  return <CompanyProfileDetailPage id={params.id} />
}
