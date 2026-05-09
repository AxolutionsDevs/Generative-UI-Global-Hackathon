"use client";

import { useEffect, useState } from "react";

interface ProgressNotificationProps {
  amount: number;
  reason: string;
  onDone: () => void;
}

export function ProgressNotification({ amount, reason, onDone }: ProgressNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-3 scale-95"
      }`}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.65)",
          borderRadius: "18px",
          padding: "14px 20px",
          boxShadow: "0 8px 32px rgba(99,102,241,0.22), 0 2px 8px rgba(99,102,241,0.1)",
          maxWidth: "290px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          fontFamily: "'Nunito', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
          }}
        >
          ✨
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "1.15rem", color: "#312e81", lineHeight: 1.2 }}>
            +{amount}%
          </div>
          <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "3px", fontStyle: "italic" }}>
            {reason}
          </div>
        </div>
      </div>
    </div>
  );
}
