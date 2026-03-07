import React from "react";
import { cn } from "@/lib/utils";

const PrimaryHeading = ({ className, children }: any) => {
  return (
    <h1
      className={cn(
        // "text-2xl font-bold tracking-tight text-foreground",
        "text-2xl font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      {children}
    </h1>
  );
};

export default PrimaryHeading;
