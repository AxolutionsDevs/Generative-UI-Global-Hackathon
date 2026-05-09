"use client";

import { StyleProposal } from "@/lib/types";

interface LayoutPreviewProps {
  proposal: StyleProposal;
  isSelected: boolean;
}

export function LayoutPreview({ proposal, isSelected }: LayoutPreviewProps) {
  const seed = hashString(
    `${proposal.id}-${proposal.characterClass}-${proposal.primaryColor}-${proposal.accentColor}`
  );
  const layout = buildLayout(seed);

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
          <GeneratedPreview proposal={proposal} layout={layout} />
        </div>
        {isSelected && <div className="lp-selected-ring" />}
        {isSelected && <div className="lp-tint" />}
      </div>
    </>
  );
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function buildLayout(seed: number) {
  let current = seed || 1;
  const rand = () => {
    current = (current * 9301 + 49297) % 233280;
    return current / 233280;
  };

  const sectionCount = 3 + Math.floor(rand() * 3);
  const sections = Array.from({ length: sectionCount }, () => {
    const roll = rand();
    const type = roll < 0.34 ? "split" : roll < 0.68 ? "grid" : "stack";
    return {
      type,
      emphasis: rand() > 0.65,
      accent: rand() > 0.5,
      blocks: 2 + Math.floor(rand() * 3),
    };
  });

  return {
    headerStyle: rand() > 0.5 ? "gradient" : "solid",
    sections,
  };
}

function GeneratedPreview({
  proposal,
  layout,
}: {
  proposal: StyleProposal;
  layout: { headerStyle: "gradient" | "solid"; sections: Array<{ type: string; emphasis: boolean; accent: boolean; blocks: number }> };
}) {
  const headerBg =
    layout.headerStyle === "gradient"
      ? `linear-gradient(90deg, ${proposal.primaryColor}, ${proposal.accentColor})`
      : proposal.primaryColor;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: proposal.bgPrimary,
        color: "#111827",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: headerBg,
          color: "#fff",
          padding: "8px 10px",
          fontSize: "9px",
          fontWeight: 800,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ opacity: 0.95 }}>{proposal.emoji} {proposal.characterClass}</span>
        <span style={{ opacity: 0.85 }}>Overview</span>
      </div>

      <div style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {layout.sections.map((section, index) => (
          <div
            key={`${section.type}-${index}`}
            style={{
              flex: section.emphasis ? 1.6 : 1,
              background: proposal.bgSecondary,
              borderRadius: "6px",
              border: section.accent ? `1px solid ${proposal.primaryColor}55` : "1px solid rgba(15,23,42,0.08)",
              padding: "6px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {section.type === "split" && (
              <div style={{ display: "flex", gap: "6px", height: "100%" }}>
                <div
                  style={{
                    width: "32%",
                    background: "rgba(255,255,255,0.5)",
                    borderRadius: "4px",
                    padding: "4px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {Array.from({ length: section.blocks }).map((_, idx) => (
                    <div
                      key={`pill-${idx}`}
                      style={{
                        height: "6px",
                        borderRadius: "999px",
                        background: `${proposal.primaryColor}${idx % 2 === 0 ? "55" : "33"}`,
                      }}
                    />
                  ))}
                </div>
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4px" }}>
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={`card-${idx}`}
                      style={{
                        background: "rgba(255,255,255,0.72)",
                        borderRadius: "4px",
                        border: `1px solid ${proposal.accentColor}33`,
                        padding: "4px",
                      }}
                    >
                      <div style={{ height: "3px", background: `${proposal.accentColor}66`, borderRadius: "2px", marginBottom: "3px" }} />
                      <div style={{ height: "2px", background: `${proposal.primaryColor}33`, borderRadius: "2px" }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.type === "grid" && (
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px" }}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={`tile-${idx}`}
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: "4px",
                      border: `1px solid ${proposal.primaryColor}22`,
                      padding: "4px",
                    }}
                  >
                    <div style={{ height: "3px", background: `${proposal.primaryColor}55`, borderRadius: "2px", marginBottom: "3px" }} />
                    <div style={{ height: "2px", background: `${proposal.accentColor}33`, borderRadius: "2px" }} />
                  </div>
                ))}
              </div>
            )}

            {section.type === "stack" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {Array.from({ length: section.blocks + 1 }).map((_, idx) => (
                  <div
                    key={`line-${idx}`}
                    style={{
                      height: "6px",
                      borderRadius: "999px",
                      background: idx % 2 === 0 ? `${proposal.primaryColor}44` : `${proposal.accentColor}33`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
