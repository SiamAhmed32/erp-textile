export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F9FAFB]">
      {/* Subtle architectural grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(to right, #64748b 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative flex flex-col items-center gap-12">
        {/* Minimalist Professional Loader */}
        <div className="relative group">
          {/* Animated Glow */}
          <div className="absolute inset-0 bg-slate-200 rounded-full blur-2xl animate-pulse opacity-50" />

          <div className="relative size-16 flex items-center justify-center">
            {/* Main Outer Ring */}
            <div className="absolute inset-0 rounded-full border-[1.5px] border-slate-200" />

            {/* Rotating Active Segment */}
            <div className="absolute inset-0 rounded-full border-[1.5px] border-transparent border-t-slate-800 animate-spin" />

            {/* Center Visual */}
            <div className="size-2 bg-slate-900 rounded-full" />
          </div>
        </div>

        {/* Branding & Status */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Elevate <span className="font-light text-slate-400">ERP</span>
            </h2>
            <div className="h-px w-8 bg-slate-200 group-hover:w-12 transition-all duration-700" />
          </div>

          <div className="flex flex-col items-center gap-3">
            {/* Sleek Line Loader */}
            <div className="w-48 h-[2px] bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-800 w-1/3 animate-loading-bar shadow-[0_0_8px_rgba(0,0,0,0.1)]" />
            </div>

            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">
              Processing <span className="animate-pulse">...</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Minimal Detail */}
      <div className="absolute bottom-10 flex items-center gap-4">
        <div className="h-px w-4 bg-slate-200" />
        <span className="text-[10px] font-medium text-slate-300 tracking-widest uppercase">
          Slate Professional
        </span>
        <div className="h-px w-4 bg-slate-200" />
      </div>
    </div>
  );
}
