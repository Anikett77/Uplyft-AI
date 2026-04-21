"use client";
import { useState, useEffect } from "react";

const KEY = "github_portfolio";

const defaultState = {
  username:  null,
  data:      null,   // full API response
  fetchedAt: null,
};

export function useGithubState() {
  const [state, setRaw]  = useState(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setRaw(JSON.parse(s));
    } catch {}
    setHydrated(true);
  }, []);

  const save = (next) => {
    setRaw(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };

  const clear = () => {
    localStorage.removeItem(KEY);
    setRaw(defaultState);
  };

  return { ...state, save, clear, hydrated };
}