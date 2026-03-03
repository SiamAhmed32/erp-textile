import React from "react";
import { Eye, SquarePen, Copy, FileDown, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onExport: () => void;
  onDelete: () => void;
  onRestore?: () => void;
  isDeletedView?: boolean;
};

const OrderActions = ({
  onView,
  onEdit,
  onDuplicate,
  onExport,
  onDelete,
  onRestore,
  isDeletedView = false,
}: Props) => {
  const actions = [
    { icon: Eye, label: "View", onClick: onView, show: true },
    {
      icon: SquarePen,
      label: "Edit",
      onClick: onEdit,
      show: !isDeletedView,
    },
    {
      icon: Copy,
      label: "Duplicate",
      onClick: onDuplicate,
      show: !isDeletedView,
    },
    { icon: FileDown, label: "Export PDF", onClick: onExport, show: true },
    {
      icon: Trash2,
      label: "Delete",
      onClick: onDelete,
      isDestructive: true,
      show: !isDeletedView,
    },
    {
      icon: RotateCcw,
      label: "Restore",
      onClick: onRestore || (() => { }),
      show: isDeletedView,
      isSuccess: true,
    },
  ];

  return (
    <div className="flex items-center gap-1">
      {actions
        .filter((a) => a.show)
        .map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              size="icon"
              variant="ghost"
              title={action.label}
              className={`h-7 w-7 transition-colors ${"isDestructive" in action && action.isDestructive
                  ? "text-slate-500 hover:text-red-600 hover:bg-red-50"
                  : "isSuccess" in action && action.isSuccess
                    ? "text-slate-500 hover:text-green-600 hover:bg-green-50"
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

export default OrderActions;
