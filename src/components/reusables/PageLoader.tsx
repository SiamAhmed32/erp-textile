"use client";

import React from "react";
import Image from "next/image";
import logo from "@/assets/logo.png";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="relative flex flex-col items-center">
        {/* Minimal Pulsing Logo */}
        <div className="relative h-20 w-20 animate-pulse">
          <Image
            src={logo}
            alt="Moon Textile Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* Loading text with animated dots */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <h3 className="text-xl font-bold tracking-tight text-secondary">
            Moon Textile
          </h3>
          <p className="flex items-center text-sm font-medium text-muted-foreground uppercase tracking-[0.2em]">
            Loading
            <span className="flex ml-1">
              <span className="animate-[bounce_1s_infinite_0ms]">.</span>
              <span className="animate-[bounce_1s_infinite_200ms]">.</span>
              <span className="animate-[bounce_1s_infinite_400ms]">.</span>
            </span>
          </p>
        </div>

        {/* Sleek bottom progress indicator */}
        <div className="mt-6 h-0.5 w-48 overflow-hidden bg-slate-100">
          <div
            className="h-full bg-primary animate-loading-bar"
            style={{ width: "40%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
