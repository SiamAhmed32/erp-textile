import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type FormFooterProps = {
  cancelHref: string;
  onSave?: () => void;
  saving?: boolean;
  saveLabel?: string;
  savingLabel?: string;
  trustText?: string;
};

const FormFooter = ({
  cancelHref,
  onSave,
  saving = false,
  saveLabel = "Save Changes",
  savingLabel = "Saving...",
  trustText = "All data is stored securely. All inputs are encrypted.",
}: FormFooterProps) => {
  return (
    <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-zinc-100">
      <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-400">
        <ShieldCheck className="h-4 w-4 text-emerald-500/70" />
        <span className="max-w-[280px] leading-relaxed italic">
          {trustText}
        </span>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 w-full sm:w-auto">
        <Button
          variant="outline"
          className="w-full sm:w-auto h-11 px-8 rounded-lg font-semibold border-zinc-200 text-zinc-600 hover:bg-zinc-50"
          asChild
        >
          <Link href={cancelHref}>Cancel</Link>
        </Button>

        {onSave && (
          <Button
            onClick={onSave}
            disabled={saving}
            className="w-full sm:w-auto h-11 px-8 rounded-lg font-bold bg-black text-white hover:bg-black/90 shadow-lg shadow-zinc-200 transition-all active:scale-[0.98]"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{savingLabel}</span>
              </div>
            ) : (
              <span>{saveLabel}</span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormFooter;
