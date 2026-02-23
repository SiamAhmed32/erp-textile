import Link from "next/link";
import { MoveLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 font-sans">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(to right, #64748b 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Top border accent */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800" />

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center gap-10">
        {/* 404 Numeral — the hero element */}
        <div className="relative select-none">
          <span
            className="text-[160px] sm:text-[200px] font-black leading-none tracking-tighter text-slate-100"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[160px] sm:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-300 to-slate-200">
            404
          </span>
          {/* Thin ruled line under the number */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-slate-800 rounded-full" />
        </div>

        {/* Copy */}
        <div className="space-y-3 -mt-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-400 max-w-[320px] mx-auto leading-relaxed">
            The resource you requested does not exist or has been moved. Please
            verify the URL or return to a known page.
          </p>
        </div>

        {/* Error code badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
          <span className="text-xs font-mono text-slate-500 tracking-wide">
            ERR_NOT_FOUND · HTTP 404
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button
            asChild
            className="w-full sm:w-auto h-11 px-8 rounded-lg bg-slate-900 text-white hover:bg-slate-700 font-semibold tracking-tight transition-all duration-200 shadow-md shadow-slate-900/10"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="size-4" />
              Go to Dashboard
            </Link>
          </Button>

          <Button
            variant="outline"
            asChild
            className="w-full sm:w-auto h-11 px-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-semibold tracking-tight transition-all duration-200"
          >
            <Link
              href="javascript:history.back()"
              className="flex items-center gap-2"
            >
              <MoveLeft className="size-4" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Quick nav */}
        <div className="w-full border-t border-slate-200 pt-8 flex flex-col items-center gap-5">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Quick Navigation
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Dashboard", href: "/" },
              { label: "Orders", href: "/order-management/orders" },
              { label: "LC Management", href: "/lc-management/lc-managements" },
              { label: "Invoices", href: "/invoice-management/invoices" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 transition-all duration-150 shadow-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
