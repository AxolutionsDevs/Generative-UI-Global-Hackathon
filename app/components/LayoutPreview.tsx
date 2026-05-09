"use client";

import { StyleProposal } from "@/lib/types";

interface LayoutPreviewProps {
  proposal: StyleProposal;
  isSelected: boolean;
}

export function LayoutPreview({ proposal, isSelected }: LayoutPreviewProps) {
  const skeletonMap: Record<string, React.ReactNode> = {
    hacienda: <HaciendaSkeleton colors={proposal} />,
    modern: <ModernSkeleton colors={proposal} />,
    tropical: <TropicalSkeleton colors={proposal} />,
    luxury: <LuxurySkeleton colors={proposal} />,
    romantic: <RomanticSkeleton colors={proposal} />,
    industrial: <IndustrialSkeleton colors={proposal} />,
  };

  return (
    <>
      <style>{`
        .lp-preview-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          background: #f5f5f5;
          margin-bottom: 12px;
          border: 1px solid #e5e7eb;
        }
        .lp-preview {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          filter: blur(0.3px);
        }
        .lp-selected-ring {
          position: absolute;
          inset: 0;
          border: 2px solid var(--ring-color);
          border-radius: 8px;
          pointer-events: none;
          z-index: 10;
        }
        .lp-tint {
          position: absolute;
          inset: 0;
          background: var(--tint-color);
          opacity: 0.06;
          pointer-events: none;
          z-index: 9;
        }
      `}</style>

      <div className="lp-preview-wrap">
        <div
          className="lp-preview"
          style={
            {
              "--ring-color": proposal.primaryColor,
              "--tint-color": proposal.primaryColor,
            } as React.CSSProperties
          }
        >
          {skeletonMap[proposal.styleTemplate]}
        </div>
        {isSelected && <div className="lp-selected-ring" />}
        {isSelected && <div className="lp-tint" />}
      </div>
    </>
  );
}

function HaciendaSkeleton({ colors }: { colors: StyleProposal }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: colors.bgPrimary,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: `linear-gradient(90deg, ${colors.primaryColor}33, ${colors.accentColor}22)`,
          padding: "10px",
          borderBottom: `2px solid ${colors.primaryColor}44`,
          textAlign: "center",
          fontSize: "11px",
          fontWeight: "bold",
          color: colors.primaryColor,
        }}
      >
        ✨ Hacienda Style
      </div>
      <div style={{ display: "flex", flex: 1, gap: "6px", padding: "10px" }}>
        <div style={{ width: "35%", background: colors.bgSecondary, padding: "8px", borderRadius: "4px", borderLeft: `3px solid ${colors.primaryColor}`, fontSize: "7px" }}>
          {["Venue", "Catering", "Decor"].map((cat) => (
            <div key={cat} style={{ padding: "3px", marginBottom: "3px", background: colors.primaryColor + "15", borderRadius: "3px", color: colors.primaryColor, fontWeight: "600" }}>
              {cat}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ background: colors.bgSecondary, borderRadius: "4px", padding: "6px", borderTop: `3px solid ${colors.accentColor}` }}>
              <div style={{ height: "3px", background: colors.primaryColor + "33", borderRadius: "2px", marginBottom: "3px" }} />
              <div style={{ height: "2px", background: colors.primaryColor + "22", borderRadius: "1px" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModernSkeleton({ colors }: { colors: StyleProposal }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: colors.bgPrimary,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "8px 10px",
          borderBottom: `1px solid ${colors.primaryColor}22`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "10px",
          fontWeight: "bold",
        }}
      >
        <div style={{ color: colors.primaryColor }}>Dashboard</div>
        <div style={{ color: "#666" }}>45%</div>
      </div>
      <div style={{ display: "flex", flex: 1, gap: "6px", padding: "8px" }}>
        <div style={{ width: "30%", background: "#f9f9f9", padding: "6px", borderRadius: "4px", fontSize: "7px" }}>
          {["Venue", "Catering", "Entertain"].map((cat, i) => (
            <div key={cat} style={{ padding: "3px", marginBottom: "3px", background: i === 0 ? colors.primaryColor + "22" : "transparent", color: i === 0 ? colors.primaryColor : "#666", fontWeight: "600", borderRadius: "2px" }}>
              {cat}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: "3px", padding: "4px" }}>
              <div style={{ height: "3px", background: colors.primaryColor + "33", borderRadius: "2px", marginBottom: "2px" }} />
              <div style={{ height: "2px", background: colors.primaryColor + "22", borderRadius: "1px" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TropicalSkeleton({ colors }: { colors: StyleProposal }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: colors.bgPrimary,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.accentColor})`,
          padding: "10px",
          textAlign: "center",
          color: "#fff",
          fontSize: "10px",
          fontWeight: "bold",
        }}
      >
        🌴 Tropical Vibes 🎉
      </div>
      <div style={{ flex: 1, padding: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ background: colors.bgSecondary, borderRadius: "6px", padding: "8px", borderLeft: `4px solid ${colors.accentColor}` }}>
            <div style={{ fontSize: "16px", marginBottom: "4px" }}>
              {i === 1 ? "🏖️" : i === 2 ? "🍽️" : i === 3 ? "🎵" : "🎨"}
            </div>
            <div style={{ height: "3px", background: colors.primaryColor + "44", borderRadius: "2px", marginBottom: "3px" }} />
            <div style={{ height: "2px", background: colors.primaryColor + "22", borderRadius: "1px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LuxurySkeleton({ colors }: { colors: StyleProposal }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: colors.bgPrimary,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "linear-gradient(90deg, #1a1a1a, #2a2a2a)",
          padding: "10px",
          borderBottom: `3px solid ${colors.primaryColor}`,
          textAlign: "center",
          fontSize: "9px",
          fontWeight: "bold",
          color: colors.primaryColor,
          letterSpacing: "1px",
        }}
      >
        ◆ LUXURY ◆
      </div>
      <div style={{ flex: 1, padding: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ background: colors.bgSecondary, borderRadius: "2px", padding: "8px", border: `1px solid ${colors.primaryColor}44` }}>
            <div style={{ fontSize: "7px", fontWeight: "bold", color: colors.primaryColor, textTransform: "uppercase", marginBottom: "4px", letterSpacing: "0.5px" }}>
              Category
            </div>
            <div style={{ height: "3px", background: colors.primaryColor + "55", borderRadius: "2px", marginBottom: "3px" }} />
            <div style={{ height: "2px", background: colors.primaryColor + "33", borderRadius: "1px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RomanticSkeleton({ colors }: { colors: StyleProposal }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: colors.bgPrimary,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: `radial-gradient(circle at 50% 0%, ${colors.primaryColor}33, transparent)`,
          padding: "10px",
          textAlign: "center",
          color: colors.primaryColor,
          fontSize: "10px",
          fontWeight: "bold",
        }}
      >
        💕 Romantic 💕
      </div>
      <div style={{ flex: 1, padding: "10px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ background: colors.bgSecondary, borderRadius: "6px", padding: "6px", textAlign: "center", boxShadow: `0 2px 8px ${colors.primaryColor}22` }}>
            <div style={{ height: "3px", background: `linear-gradient(90deg, ${colors.primaryColor}66, ${colors.accentColor}66)`, borderRadius: "2px", marginBottom: "3px" }} />
            <div style={{ height: "2px", background: colors.primaryColor + "33", borderRadius: "1px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function IndustrialSkeleton({ colors }: { colors: StyleProposal }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: colors.bgPrimary,
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${colors.primaryColor}33`,
      }}
    >
      <div
        style={{
          background: colors.bgSecondary,
          padding: "8px",
          borderBottom: `2px solid ${colors.primaryColor}`,
          display: "flex",
          gap: "6px",
          fontSize: "8px",
          fontWeight: "bold",
          color: colors.primaryColor,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        <div>◼ Tasks</div>
        <div>◼ Guests</div>
      </div>
      <div style={{ flex: 1, padding: "8px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ background: colors.bgSecondary, border: `1px solid ${colors.primaryColor}44`, padding: "6px", borderRadius: "2px" }}>
            <div style={{ height: "3px", background: colors.primaryColor + "44", marginBottom: "3px", borderRadius: "1px" }} />
            <div style={{ height: "2px", background: colors.primaryColor + "22", borderRadius: "1px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
