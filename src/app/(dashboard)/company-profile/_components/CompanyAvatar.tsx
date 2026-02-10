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
            <Image
                src={logoUrl}
                alt={name}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full border object-cover"
            />
        );
    }

    return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted text-xs font-semibold text-muted-foreground">
            {getInitials(name)}
        </div>
    );
};

export default CompanyAvatar;
