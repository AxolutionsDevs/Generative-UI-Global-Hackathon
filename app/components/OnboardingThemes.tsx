"use client";

import { useState } from "react";
import { StyleProposal } from "@/lib/types";
import { LayoutPreview } from "./LayoutPreview";

interface OnboardingThemesProps {
  proposals: StyleProposal[];
  isGenerating: boolean;
  onBack: () => void;
  onGenerate: (theme: StyleProposal) => void;
}

export function OnboardingThemes({
  proposals,
  isGenerating,
  onBack,
  onGenerate,
}: OnboardingThemesProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedProposal = proposals.find((p) => p.id === selected) ?? null;

  return (
    <>
      <style>{`
        @keyframes tCardIn {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .t-card {
          animation: tCardIn 0.38s cubic-bezier(0.34,1.2,0.64,1) forwards;
          opacity: 0;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .t-card:hover { transform: translateY(-3px); }
        .forge-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(99,102,241,0.42);
        }
        .forge-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
      `}</style>

      <div
        className="relative flex items-center justify-center min-h-screen overflow-hidden p-6"
        style={{
          background:
            "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 35%, #ede9fe 65%, #fce7f3 100%)",
        }}
      >
        {/* Orbs */}
        <div
          style={{
            position: "absolute",
            top: "6%",
            left: "3%",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(129,140,248,0.5) 0%, rgba(192,132,252,0.28) 55%, transparent 100%)",
            filter: "blur(55px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            right: "4%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.45) 0%, rgba(129,140,248,0.25) 55%, transparent 100%)",
            filter: "blur(65px)",
            pointerEvents: "none",
          }}
        />

        {/* Card */}
        <div
          className="relative w-full z-10"
          style={{
            maxWidth: "560px",
            background: "rgba(255,255,255,0.38)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1px solid rgba(255,255,255,0.65)",
            borderRadius: "28px",
            boxShadow:
              "0 8px 40px rgba(99,102,241,0.16), 0 2px 8px rgba(99,102,241,0.07), inset 0 1px 0 rgba(255,255,255,0.85)",
            padding: "36px 36px 40px",
          }}
        >
          {/* Step dots */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px" }}>
            <div
              style={{
                width: "28px",
                height: "6px",
                borderRadius: "99px",
                background: "rgba(99,102,241,0.18)",
              }}
            />
            <div
              style={{
                width: "28px",
                height: "6px",
                borderRadius: "99px",
                background: "rgba(99,102,241,0.18)",
              }}
            />
            <div
              style={{
                width: "28px",
                height: "6px",
                borderRadius: "99px",
                background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
              }}
            />
          </div>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "26px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🎨</div>
            <h2
              style={{
                fontSize: "1.4rem",
                fontWeight: 900,
                color: "#312e81",
                letterSpacing: "-0.02em",
                marginBottom: "6px",
              }}
            >
              Your personalized interfaces
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
              Each was designed for your specific event. Pick the one that feels like <em>you</em>.
            </p>
          </div>

          {/* Theme cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {proposals.map((p, i) => {
              const isSelected = selected === p.id;
              return (
                <div
                  key={p.id}
                  className="t-card"
                  onClick={() => setSelected(p.id)}
                  style={{
                    animationDelay: `${i * 0.12}s`,
                    borderRadius: "18px",
                    overflow: "hidden",
                    border: isSelected ? `2px solid ${p.primaryColor}` : "2px solid rgba(255,255,255,0.55)",
                    boxShadow: isSelected
                      ? `0 6px 24px ${p.primaryColor}30`
                      : "0 2px 10px rgba(99,102,241,0.05)",
                    background: isSelected ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.42)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "stretch" }}>
                    {/* Gradient color strip */}
                    <div
                      style={{
                        width: "8px",
                        flexShrink: 0,
                        background: `linear-gradient(180deg, ${p.primaryColor}, ${p.accentColor})`,
                      }}
                    />

                    {/* Content */}
                    <div style={{ flex: 1, padding: "16px 18px" }}>
                      {/* UI preview thumbnail */}
                      <LayoutPreview proposal={p} isSelected={isSelected} />

                      {/* Top row: emoji + name + checkmark */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "5px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                          <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{p.emoji}</span>
                          <div>
                            <div
                              style={{
                                fontWeight: 900,
                                fontSize: "0.98rem",
                                color: "#1e1b4b",
                                lineHeight: 1.2,
                              }}
                            >
                              {p.characterClass}
                            </div>
                            <div
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                color: "#94a3b8",
                                marginTop: "1px",
                              }}
                            >
                              {p.narrativeVoice}
                            </div>
                          </div>
                        </div>

                        {/* Selected checkmark */}
                        {isSelected && (
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              flexShrink: 0,
                              background: `linear-gradient(135deg, ${p.primaryColor}, ${p.accentColor})`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              color: "#fff",
                              fontWeight: 900,
                              boxShadow: `0 2px 8px ${p.primaryColor}44`,
                            }}
                          >
                            ✓
                          </div>
                        )}
                      </div>

                      {/* Tagline */}
                      <p
                        style={{
                          fontSize: "0.75rem",
                          fontStyle: "italic",
                          fontWeight: 700,
                          color: p.primaryColor,
                          marginBottom: "6px",
                        }}
                      >
                        &ldquo;{p.tagline}&rdquo;
                      </p>

                      {/* Description */}
                      <p
                        style={{
                          fontSize: "0.79rem",
                          color: "#6b7280",
                          lineHeight: "1.5",
                          marginBottom: "10px",
                        }}
                      >
                        {p.description}
                      </p>

                      {/* Color palette preview */}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div
                          style={{
                            height: "6px",
                            flex: 1,
                            borderRadius: "99px",
                            background: `linear-gradient(90deg, ${p.primaryColor}, ${p.accentColor})`,
                          }}
                        />
                        <div
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "6px",
                            background: p.bgPrimary,
                            border: "1.5px solid rgba(255,255,255,0.6)",
                            flexShrink: 0,
                          }}
                          title="Background color"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px", marginTop: "28px" }}>
            <button
              onClick={onBack}
              style={{
                padding: "13px 18px",
                background: "rgba(255,255,255,0.5)",
                color: "#6b7280",
                border: "1px solid rgba(209,213,219,0.7)",
                borderRadius: "100px",
                fontSize: "0.88rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ← Back
            </button>
            <button
              disabled={!selectedProposal || isGenerating}
              onClick={() => selectedProposal && onGenerate(selectedProposal)}
              className="forge-btn"
              style={{
                flex: 1,
                padding: "13px 24px",
                background:
                  !selectedProposal || isGenerating
                    ? "linear-gradient(135deg, #c7d2fe, #ddd6fe)"
                    : selectedProposal
                      ? `linear-gradient(135deg, ${selectedProposal.primaryColor}, ${selectedProposal.accentColor})`
                      : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: !selectedProposal || isGenerating ? "#6366f1" : "#fff",
                border: "none",
                borderRadius: "100px",
                fontSize: "0.95rem",
                fontWeight: 900,
                cursor: !selectedProposal || isGenerating ? "not-allowed" : "pointer",
                opacity: !selectedProposal ? 0.6 : 1,
              }}
            >
              {isGenerating ? "✨ Creating your event..." : "Create My Event →"}
            </button>
          </div>

          {!selectedProposal && (
            <p
              style={{
                textAlign: "center",
                marginTop: "10px",
                fontSize: "0.73rem",
                color: "#a5b4fc",
                fontWeight: 600,
              }}
            >
              Choose the interface that feels like you ✨
            </p>
          )}
        </div>
      </div>
    </>
  );
}
