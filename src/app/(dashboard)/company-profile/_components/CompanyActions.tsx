"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Eye, SquarePen, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  onDelete: () => void;
  showDeleted?: boolean;
  onRestore?: () => void;
};

const CompanyActions = ({ id, onDelete, showDeleted = false, onRestore = () => { } }: Props) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="icon"
        variant="ghost"
        title="View Detail"
        className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/company-profile/${id}`);
        }}
      >
        <Eye className="h-4 w-4" />
      </Button>
      {!showDeleted && (
        <>
          <Button
            size="icon"
            variant="ghost"
            title="Edit Company"
            className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/company-profile/${id}/edit`);
            }}
          >
            <SquarePen className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            title="Delete"
            className="h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
      {showDeleted && (
        <Button
          size="icon"
          variant="ghost"
          title="Restore"
          className="h-7 w-7 text-slate-500 hover:text-green-600 hover:bg-green-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onRestore();
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CompanyActions;
