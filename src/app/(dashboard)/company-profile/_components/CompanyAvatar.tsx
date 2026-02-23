import React from "react";
import { getInitials } from "./helpers";
import Image from "next/image";

type Props = {
  name: string;
  logoUrl?: string | null;
};

const CompanyAvatar = ({ name, logoUrl }: Props) => {
  if (logoUrl) {
    return (
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border bg-white shadow-sm transition-transform hover:scale-105">
        <Image src={logoUrl} alt={name} fill className="object-contain p-0.5" />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
      {getInitials(name)}
    </div>
  );
};

export default CompanyAvatar;
