"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History, Trash2 } from "lucide-react";

interface RecoveryModalProps {
  isOpen: boolean;
  onRestore: () => void;
  onDiscard: () => void;
  title?: string;
  description?: string;
}

const RecoveryModal = ({
  isOpen,
  onRestore,
  onDiscard,
  title = "Recovery Draft Found",
  description = "We found an unsaved draft from your last session. Would you like to restore your progress or start fresh?",
}: RecoveryModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDiscard()}>
      <DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] mx-auto rounded-xl">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <History className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onDiscard}
            className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Discard Draft
          </Button>
          <Button
            onClick={onRestore}
            className="flex-1 bg-black text-white hover:bg-black/90"
          >
            <History className="mr-2 h-4 w-4" />
            Restore Progress
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecoveryModal;
