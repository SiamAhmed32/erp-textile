"use client";

import { PageLoader } from "@/components/reusables";

/**
 * Root Loading Component
 * This is the primary entry point for Next.js loading states.
 * We use the unified Moon Textile PageLoader to ensure branding consistency
 * across both framework-level and application-level loading states.
 */
export default function RootLoading() {
  return <PageLoader />;
}
