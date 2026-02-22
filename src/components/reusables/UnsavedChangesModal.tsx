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
import { AlertCircle } from "lucide-react";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onLeave: () => void;
  onStay: () => void;
}

const UnsavedChangesModal = ({
  isOpen,
  onLeave,
  onStay,
}: UnsavedChangesModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onStay()}>
      <DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] mx-auto rounded-xl">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Unsaved Changes
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            You have unsaved changes on this page. If you leave now, your
            progress will be lost. Are you sure you want to leave?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onStay}
            className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-600"
          >
            Stay and Save
          </Button>
          <Button variant="destructive" onClick={onLeave} className="flex-1">
            Leave Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnsavedChangesModal;
