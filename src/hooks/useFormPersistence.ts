"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/services/types";

interface UseFormPersistenceOptions<T> {
  key: string;
  defaultValue: T;
  debounceMs?: number;
  onRestore?: (data: T) => void;
  enabled?: boolean;
}

export function useFormPersistence<T>({
  key,
  defaultValue,
  debounceMs = 1000,
  onRestore,
  enabled = true,
}: UseFormPersistenceOptions<T>) {
  const [draft, setDraft] = useState<T>(defaultValue);
  const [hasStoredDraft, setHasStoredDraft] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id || "anonymous";
  const storageKey = `erp_draft_${userId}_${key}`;

  const isFirstLoad = useRef(true);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load draft on mount
  useEffect(() => {
    if (!enabled) return;

    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check if data is not just empty/default
        if (JSON.stringify(parsed) !== JSON.stringify(defaultValue)) {
          setHasStoredDraft(true);
        }
      } catch (e) {
        console.error("Failed to parse stored draft", e);
      }
    }
    
    // Use a timeout to ensure this runs after the initial render cycle 
    // to avoid immediate triggers of the save effect
    const timer = setTimeout(() => {
      isFirstLoad.current = false;
    }, 100);
    
    return () => clearTimeout(timer);
  }, [storageKey, enabled, defaultValue]);

  // Save draft when it changes (debounced)
  useEffect(() => {
    // Only save if we've moved past first load AND the user has either:
    // 1. Interacted with the form
    // 2. We've confirmed there's NO stored draft (so it's safe to start fresh)
    if (isFirstLoad.current || !enabled || (!hasInteracted && hasStoredDraft)) return;

    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(() => {
      // Don't save if it's identical to default (clean form)
      if (JSON.stringify(draft) === JSON.stringify(defaultValue)) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, JSON.stringify(draft));
      }
    }, debounceMs);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [draft, storageKey, debounceMs, enabled, defaultValue, hasInteracted, hasStoredDraft]);

  const restoreDraft = useCallback(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setDraft(data);
        setHasStoredDraft(false);
        setHasInteracted(true);
        if (onRestore) onRestore(data);
      } catch (e) {
        console.error("Failed to restore draft", e);
      }
    }
  }, [storageKey, onRestore]);

  const discardDraft = useCallback(() => {
    localStorage.removeItem(storageKey);
    setHasStoredDraft(false);
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return {
    draft,
    setDraft,
    hasStoredDraft,
    restoreDraft,
    discardDraft,
    clearDraft,
    setHasInteracted,
  };
}
