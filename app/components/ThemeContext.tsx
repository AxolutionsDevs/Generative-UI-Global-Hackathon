"use client";

import { createContext, useContext } from "react";
import { DEFAULT_STYLE, EventStyle } from "@/lib/types";

export const ThemeContext = createContext<EventStyle>(DEFAULT_STYLE);

export function useTheme() {
  return useContext(ThemeContext);
}
