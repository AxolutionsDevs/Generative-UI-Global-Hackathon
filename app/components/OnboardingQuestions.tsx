"use client";

import { useEffect, useState } from "react";
import { OnboardingQuestion } from "@/lib/types";

interface OnboardingQuestionsProps {
  questions: OnboardingQuestion[];
  isLoading: boolean;
  error?: string;
  eventType: string;
  promptSummary: string;
  contextFocus: string[];
  onBack: () => void;
  onSubmit: (answers: Record<string, string>) => void;
}

export function OnboardingQuestions({
  questions,
  isLoading,
  error,
  eventType,
  promptSummary,
  contextFocus,
  onBack,
  onSubmit,
}: OnboardingQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const focusKeys = new Set(contextFocus);

  const focusLabels: Record<string, string> = {
    date: "Date",
    location: "Location",
    guest_count: "Guest count",
    budget: "Budget",
    formality: "Formality",
    venue: "Venue",
    aesthetic: "Style",
    service_level: "Service level",
    schedule: "Schedule",
    other: "Other",
  };

  useEffect(() => {
    const init: Record<string, string> = {};
    questions.forEach((q) => {
      if (q.type === "scale") {
        const mid = Math.round(((q.scaleMin ?? 1) + (q.scaleMax ?? 10)) / 2);
        init[q.id] = String(mid);
      }
    });
    setAnswers(init);
  }, [questions]);

  const orderedQuestions = [...questions].sort((a, b) => {
    const aFocus = a.contextKey && focusKeys.has(a.contextKey) ? 1 : 0;
    const bFocus = b.contextKey && focusKeys.has(b.contextKey) ? 1 : 0;
    return bFocus - aFocus;
  });

  const isAnswered = (q: OnboardingQuestion) => {
    const value = answers[q.id];
    if (q.type === "scale") return value !== undefined && value !== "";
    if (q.type === "choice") return value !== undefined && value !== "";
    return value !== undefined && value.trim().length > 0;
  };

  const allAnswered = questions.length > 0 && questions.every(isAnswered);

  const getSliderBg = (q: OnboardingQuestion, val: number) => {
    const pct =
      ((val - (q.scaleMin ?? 1)) / ((q.scaleMax ?? 10) - (q.scaleMin ?? 1))) * 100;
    return `linear-gradient(90deg, #6366f1 ${pct}%, rgba(199,210,254,0.45) ${pct}%)`;
  };

  return (
    <>
      <style>{`
        @keyframes qSlideIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .q-item { animation: qSlideIn 0.3s ease forwards; opacity: 0; }
        .opt-pill { transition: all 0.16s ease; cursor: pointer; }
        .opt-pill:hover { transform: translateY(-1px); }
        .chaos-slider {
          -webkit-appearance: none; appearance: none;
          height: 6px; border-radius: 99px; outline: none; cursor: pointer; width: 100%;
        }
        .chaos-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 22px; height: 22px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          cursor: pointer; box-shadow: 0 2px 8px rgba(99,102,241,0.4);
          border: 2.5px solid white;
        }
        .next-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,102,241,0.42); }
        .next-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .q-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        @media (min-width: 900px) {
          .q-grid { grid-template-columns: 1fr 1.1fr; align-items: start; }
        }
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
            maxWidth: "520px",
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
                background: "rgba(99,102,241,0.2)",
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
            <div
              style={{
                width: "28px",
                height: "6px",
                borderRadius: "99px",
                background: "rgba(99,102,241,0.12)",
              }}
            />
          </div>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🎯</div>
            <h2
              style={{
                fontSize: "1.45rem",
                fontWeight: 900,
                color: "#312e81",
                letterSpacing: "-0.02em",
                marginBottom: "6px",
              }}
            >
              Tailor your {eventType} experience
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
              We adapt this form to your prompt and fill in the gaps.
            </p>
          </div>

          <div className="q-grid">
            {/* Prompt + context */}
            <div
              style={{
                borderRadius: "18px",
                padding: "16px",
                background: "rgba(255,255,255,0.62)",
                border: "1px solid rgba(226,232,240,0.9)",
                boxShadow: "0 8px 26px rgba(30,64,175,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#6366f1",
                  marginBottom: "8px",
                }}
              >
                Your prompt
              </div>
              <div
                style={{
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  color: "#1e1b4b",
                  lineHeight: 1.5,
                  marginBottom: "12px",
                }}
              >
                {promptSummary || "(No prompt provided)"}
              </div>

              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#6366f1",
                  marginBottom: "8px",
                }}
              >
                Context we still need
              </div>
              {contextFocus.length === 0 ?
                (
                  <div style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>
                    Looks good. We will just refine the details.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {contextFocus.map((key) => (
                      <div
                        key={key}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "999px",
                          background: "rgba(99,102,241,0.12)",
                          border: "1px solid rgba(99,102,241,0.25)",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#4338ca",
                        }}
                      >
                        {focusLabels[key] ?? key}
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Questions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              {orderedQuestions.map((q, i) => {
                const isFocus = q.contextKey ? focusKeys.has(q.contextKey) : false;
                return (
                  <div
                    key={q.id}
                    className="q-item"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      borderRadius: "16px",
                      padding: "14px",
                      border: isFocus
                        ? "1.5px solid rgba(99,102,241,0.45)"
                        : "1px solid rgba(226,232,240,0.9)",
                      background: isFocus
                        ? "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(255,255,255,0.7))"
                        : "rgba(255,255,255,0.55)",
                    }}
                  >
                    <div style={{ marginBottom: "10px" }}>
                      <span
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 800,
                          color: "#4338ca",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                        }}
                      >
                        {q.emoji} {q.question}
                      </span>
                      {isFocus && (
                        <span
                          style={{
                            marginLeft: "8px",
                            fontSize: "0.64rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "#6366f1",
                          }}
                        >
                          Focus
                        </span>
                      )}
                    </div>

                    {/* Choice pills */}
                    {q.type === "choice" && q.options && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {q.options.map((opt) => {
                          const selected = answers[q.id] === opt;
                          return (
                            <button
                              key={opt}
                              className="opt-pill"
                              onClick={() =>
                                setAnswers((prev) => ({ ...prev, [q.id]: opt }))
                              }
                              style={{
                                padding: "8px 16px",
                                borderRadius: "100px",
                                fontSize: "0.82rem",
                                fontWeight: 700,
                                border: selected
                                  ? "1.5px solid rgba(99,102,241,0.55)"
                                  : "1.5px solid rgba(199,210,254,0.7)",
                                background: selected
                                  ? "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.1))"
                                  : "rgba(255,255,255,0.55)",
                                color: selected ? "#4338ca" : "#6b7280",
                                boxShadow: selected ? "0 2px 12px rgba(99,102,241,0.2)" : "none",
                              }}
                            >
                              {selected ? "✓ " : ""}
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Scale slider */}
                    {q.type === "scale" && (
                      <div>
                        <input
                          type="range"
                          min={q.scaleMin ?? 1}
                          max={q.scaleMax ?? 10}
                          value={Number(
                            answers[q.id] ??
                              Math.round(
                                ((q.scaleMin ?? 1) + (q.scaleMax ?? 10)) / 2
                              )
                          )}
                          onChange={(e) =>
                            setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                          }
                          className="chaos-slider"
                          style={{
                            background: getSliderBg(
                              q,
                              Number(
                                answers[q.id] ??
                                  Math.round(
                                    ((q.scaleMin ?? 1) + (q.scaleMax ?? 10)) / 2
                                  )
                              )
                            ),
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "5px",
                          }}
                        >
                          <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600 }}>
                            {q.scaleLabels?.[0] ?? q.scaleMin}
                          </span>
                          <span
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: 900,
                              color: "#4338ca",
                            }}
                          >
                            {answers[q.id] ??
                              Math.round(
                                ((q.scaleMin ?? 1) + (q.scaleMax ?? 10)) / 2
                              )}
                          </span>
                          <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600 }}>
                            {q.scaleLabels?.[1] ?? q.scaleMax}
                          </span>
                        </div>
                      </div>
                    )}

                    {q.type === "text" && (
                      <textarea
                        value={answers[q.id] ?? ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        rows={2}
                        placeholder="Type your answer..."
                        style={{
                          width: "100%",
                          minHeight: "72px",
                          padding: "10px",
                          borderRadius: "10px",
                          border: "1px solid rgba(99,102,241,0.3)",
                          background: "rgba(255,255,255,0.7)",
                          fontSize: "0.9rem",
                          fontFamily: "inherit",
                          resize: "vertical",
                        }}
                      />
                    )}

                    {q.type === "number" && (
                      <input
                        type="number"
                        value={answers[q.id] ?? ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        placeholder="Enter a number"
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "10px",
                          border: "1px solid rgba(99,102,241,0.3)",
                          background: "rgba(255,255,255,0.7)",
                          fontSize: "0.9rem",
                          fontFamily: "inherit",
                        }}
                      />
                    )}

                    {q.type === "date" && (
                      <input
                        type="date"
                        value={answers[q.id] ?? ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "10px",
                          border: "1px solid rgba(99,102,241,0.3)",
                          background: "rgba(255,255,255,0.7)",
                          fontSize: "0.9rem",
                          fontFamily: "inherit",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px", marginTop: "32px" }}>
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
              disabled={!allAnswered || isLoading}
              onClick={() => onSubmit(answers)}
              className="next-btn"
              style={{
                flex: 1,
                padding: "13px 24px",
                background:
                  !allAnswered || isLoading
                    ? "linear-gradient(135deg, #c7d2fe, #ddd6fe)"
                    : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a78bfa 100%)",
                color: !allAnswered || isLoading ? "#6366f1" : "#fff",
                border: "none",
                borderRadius: "100px",
                fontSize: "0.95rem",
                fontWeight: 900,
                cursor: !allAnswered || isLoading ? "not-allowed" : "pointer",
                opacity: !allAnswered ? 0.6 : 1,
              }}
            >
              {isLoading ? "✨ Building your options..." : "See Style Options →"}
            </button>
          </div>

          {error && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px 14px",
                background: "rgba(254,202,202,0.55)",
                border: "1px solid rgba(252,165,165,0.65)",
                borderRadius: "12px",
                color: "#dc2626",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              ⚠ {error} — check your connection and try again.
            </div>
          )}

          {!allAnswered && !error && (
            <p
              style={{
                textAlign: "center",
                marginTop: "10px",
                fontSize: "0.73rem",
                color: "#a5b4fc",
                fontWeight: 600,
              }}
            >
              Answer each question to continue ✨
            </p>
          )}
        </div>
      </div>
    </>
  );
}
