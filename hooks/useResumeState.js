"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext"; // ← add this import

// ← REMOVE this line:
// const STORAGE_KEY = "resume_state";

const defaultState = {
  step: "upload",
  parsed: null,
  ats: null,
  fileName: null,
};

export function useResumeState() {
  const user = useUser();                                              // ← add
  const KEY  = user?._id ? `resume_state_${user._id}` : null;        // ← add

  const [state, setStateRaw] = useState(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!KEY) { setHydrated(true); return; }                         // ← add guard
    try {
      const stored = localStorage.getItem(KEY);                      // ← KEY not STORAGE_KEY
      if (stored) setStateRaw(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, [KEY]);                                                          // ← KEY in deps

  const setState = (updater) => {
    if (!KEY) return;                                                 // ← add guard
    setStateRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const clearResumeState = () => {
    if (KEY) localStorage.removeItem(KEY);                           // ← KEY not STORAGE_KEY
    setStateRaw(defaultState);
  };

  return { ...state, setState, clearResumeState, hydrated };
}