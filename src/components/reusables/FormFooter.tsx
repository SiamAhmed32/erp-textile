import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type FormFooterProps = {
  cancelHref: string;
  onSave: () => void;
  saving: boolean;
  saveLabel?: string;
  savingLabel?: string;
  trustText?: string;
};

const FormFooter = ({
  cancelHref,
  onSave,
  saving,
  saveLabel = "Save Changes",
  savingLabel = "Saving...",
  trustText = "All data is stored securely. All inputs are encrypted.",
}: FormFooterProps) => {
  return (
    <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
        <ShieldCheck className="h-3.5 w-3.5 text-green-600/60" />
        <span>{trustText}</span>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 w-full sm:w-auto">
        <Button
          variant="outline"
          className="w-full sm:w-auto min-w-[120px]"
          asChild
        >
          <Link href={cancelHref}>Cancel</Link>
        </Button>
        <Button
          className="w-full sm:w-auto bg-black text-white hover:bg-black/90 min-w-[160px] shadow-sm font-semibold"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? savingLabel : saveLabel}
        </Button>
      </div>
    </div>
  );
};

export default FormFooter;
