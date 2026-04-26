"use client";
import { createContext, useContext } from "react";

export const UserContext = createContext(null);

export const useUser = () => {
  try {
    return useContext(UserContext);
  } catch {
    return null;
  }
};