"use client";

import { LayoutProps } from "./LayoutSelector";
import { useTheme } from "../ThemeContext";

export function HaciendaLayout({ eventState, onResetEvent }: LayoutProps) {
  const theme = useTheme();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: `linear-gradient(135deg, ${theme.bgPrimary}, ${theme.bgSecondary})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2rem",
        fontWeight: "bold",
        color: theme.primaryColor,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🏛️</div>
        <div>{eventState.eventName} — Hacienda Style</div>
        <button
          onClick={onResetEvent}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: theme.primaryColor,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
