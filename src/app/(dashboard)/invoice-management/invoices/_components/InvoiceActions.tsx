import React from "react";
import { Eye, SquarePen, Copy, FileDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onExport: () => void;
  onDelete: () => void;
};

const InvoiceActions = ({
  onView,
  onEdit,
  onDuplicate,
  onExport,
  onDelete,
}: Props) => {
  const actions = [
    { icon: Eye, label: "View", onClick: onView },
    { icon: SquarePen, label: "Edit", onClick: onEdit },
    { icon: Copy, label: "Duplicate", onClick: onDuplicate },
    { icon: FileDown, label: "Export PDF", onClick: onExport },
    { icon: Trash2, label: "Delete", onClick: onDelete, isDestructive: true },
  ];

  return (
    <div className="flex items-center justify-end gap-1">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Button
            key={index}
            size="icon"
            variant="ghost"
            title={action.label}
            className={`h-7 w-7 transition-colors ${
              action.isDestructive
                ? "text-slate-500 hover:text-red-600 hover:bg-red-50"
                : "text-slate-500 hover:text-secondary hover:bg-secondary/10"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
            }}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
};

export default InvoiceActions;
