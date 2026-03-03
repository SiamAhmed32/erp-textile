"use client";

import React from "react";
import Image from "next/image";
import logo from "@/assets/logo.png";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-xl">
      {/* Subtle Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col items-center">
        {/* Premium Pulsing Logo container */}
        <div className="relative h-24 w-24 mb-6">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          <Image
            src={logo}
            alt="Moon Textile Logo"
            fill
            className="object-contain relative z-10"
            priority
          />
        </div>

        {/* Loading text with animated dots */}
        <div className="mt-4 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              Moon <span className="text-primary">Textile</span>
            </h3>
            <div className="h-0.5 w-6 bg-primary/20 rounded-full" />
          </div>

          <div className="flex flex-col items-center gap-4">
            {/* The "Perfect" blue progress indicator */}
            <div className="h-[3px] w-56 overflow-hidden bg-slate-100 rounded-full border border-slate-50 shadow-inner">
              <div
                className="h-full bg-primary animate-loading-bar rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                style={{ width: "35%" }}
              />
            </div>

            <p className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] translate-x-1">
              Loading
              <span className="flex ml-1 items-center">
                <span className="animate-[bounce_1.2s_infinite_0ms] opacity-60">
                  .
                </span>
                <span className="animate-[bounce_1.2s_infinite_200ms] opacity-80">
                  .
                </span>
                <span className="animate-[bounce_1.2s_infinite_400ms]">.</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Sophisticated Footer Label */}
      <div className="absolute bottom-12 flex items-center gap-4 opacity-30 select-none">
        <div className="h-px w-8 bg-slate-200" />
        <span className="text-[9px] font-bold text-slate-400 tracking-[0.5em] uppercase">
          Slate Professional
        </span>
        <div className="h-px w-8 bg-slate-200" />
      </div>
    </div>
  );
};

export default PageLoader;
