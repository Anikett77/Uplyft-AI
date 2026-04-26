"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";

const defaultState = {
  username:  null,
  data:      null,
  fetchedAt: null,
};

export function useGithubState() {
  const user = useUser();
  const KEY  = user?._id ? `github_portfolio_${user._id}` : null;

  const [state, setRaw]         = useState(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!KEY) { setHydrated(true); return; }
    try {
      const s = localStorage.getItem(KEY);
      if (s) setRaw(JSON.parse(s));
    } catch {}
    setHydrated(true);
  }, [KEY]);

  const save = (next) => {
    if (!KEY) return;
    setRaw(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };

  const clear = () => {
    if (KEY) localStorage.removeItem(KEY);
    setRaw(defaultState);
  };

  return { ...state, save, clear, hydrated };
}