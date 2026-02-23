"use client";

import { useEffect, useCallback, useState } from "react";
import UnsavedChangesModal from "./UnsavedChangesModal";
import { useRouter } from "next/navigation";

interface NavigationGuardProps {
  isDirty: boolean;
}

const NavigationGuard = ({ isDirty }: NavigationGuardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const router = useRouter();

  // Handle browser hard exit (tab close/refresh)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ""; // Standard way to trigger browser prompt
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Handle internal navigation (Link clicks)
  useEffect(() => {
    if (!isDirty) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor && anchor.href && anchor.host === window.location.host) {
        // It's an internal link
        const url = anchor.getAttribute("href");
        if (url && url !== window.location.pathname) {
          e.preventDefault();
          e.stopPropagation();
          setTargetUrl(url);
          setShowModal(true);
        }
      }
    };

    // Use capture phase to intercept before Next.js/React handles it
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isDirty]);

  const handleLeave = useCallback(() => {
    setShowModal(false);
    if (targetUrl) {
      router.push(targetUrl);
    }
  }, [router, targetUrl]);

  const handleStay = useCallback(() => {
    setShowModal(false);
    setTargetUrl(null);
  }, []);

  return (
    <UnsavedChangesModal
      isOpen={showModal}
      onLeave={handleLeave}
      onStay={handleStay}
    />
  );
};

export default NavigationGuard;
