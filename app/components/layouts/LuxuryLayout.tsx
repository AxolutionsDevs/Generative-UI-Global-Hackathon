"use client";

import { LayoutProps } from "./LayoutSelector";
import { useTheme } from "../ThemeContext";

export function LuxuryLayout({ eventState, onResetEvent }: LayoutProps) {
  const theme = useTheme();
  return (
    <div style={{ width: "100vw", height: "100vh", background: theme.bgPrimary, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", color: theme.primaryColor }}>
        <div style={{ fontSize: "4rem", marginBottom: "20px" }}>✨</div>
        <div>{eventState.eventName} — Luxury</div>
        <button onClick={onResetEvent} style={{ marginTop: "20px", padding: "10px 20px", background: theme.primaryColor, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>← Back</button>
      </div>
    </div>
  );
}
