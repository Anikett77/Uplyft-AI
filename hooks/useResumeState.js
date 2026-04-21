"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "resume_state";

const defaultState = {
  step: "upload",   // upload | parsed | results
  parsed: null,
  ats: null,
  fileName: null,
};

export function useResumeState() {
  const [state, setStateRaw] = useState(defaultState);
  const [hydrated, setHydrated] = useState(false);

  // ── Load from localStorage on mount ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setStateRaw(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  // ── Persist every change ──
  const setState = (updater) => {
    setStateRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // ── Clear on logout — call this from your logout handler ──
  const clearResumeState = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStateRaw(defaultState);
  };

  return { ...state, setState, clearResumeState, hydrated };
}