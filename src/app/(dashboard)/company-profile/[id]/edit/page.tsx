import React from "react"
import { CompanyProfileEditPage } from "@/components/CompanyProfiles/CompanyProfileEditPage"

type Props = {
  params: { id: string }
}

export default function Page({ params }: Props) {
  return <CompanyProfileEditPage id={params.id} />
}
