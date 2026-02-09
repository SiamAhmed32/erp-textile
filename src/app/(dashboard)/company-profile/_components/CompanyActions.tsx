import React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    id: string;
    onDelete: () => void;
};

const CompanyActions = ({ id, onDelete }: Props) => {
    return (
        <div className="flex justify-end gap-2">
            <Button
                size="icon"
                variant="ghost"
                asChild
                onClick={(event) => event.stopPropagation()}
            >
                <Link href={`/company-profile/${id}`}>
                    <Eye className="h-4 w-4" />
                </Link>
            </Button>
            <Button
                size="icon"
                variant="ghost"
                asChild
                onClick={(event) => event.stopPropagation()}
            >
                <Link href={`/company-profile/${id}/edit`}>
                    <Pencil className="h-4 w-4" />
                </Link>
            </Button>
            <Button
                size="icon"
                variant="ghost"
                onClick={(event) => {
                    event.stopPropagation();
                    onDelete();
                }}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default CompanyActions;
