"use client";

import { useEffect, useState } from "react";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { EventState, StyleProposal, OnboardingQuestion } from "@/lib/types";
import { useEventState } from "@/lib/useEventState";
import {
  buildEventFromContext,
  generateEventQuestions,
  generateStyleProposals,
  evaluateTaskProgress,
} from "@/lib/gemini";
import { OnboardingQuestions } from "./OnboardingQuestions";
import { OnboardingThemes } from "./OnboardingThemes";
import { ProgressNotification } from "./ProgressNotification";
import { ThemeContext } from "./ThemeContext";
import { LayoutSelector } from "./layouts/LayoutSelector";

export function EventView() {
  const { eventState, isLoaded, progressEvent, initEvent, completeTask, clearProgressEvent, toggleTaskItem, resetEvent } =
    useEventState();

  const [detailsInput, setDetailsInput] = useState("");
  const [eventType, setEventType] = useState<string>("wedding");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

  const [onboardingStep, setOnboardingStep] = useState<"details" | "questions" | "themes">("details");
  const [questions, setQuestions] = useState<OnboardingQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [themeProposals, setThemeProposals] = useState<StyleProposal[]>([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState(false);
  const [themeError, setThemeError] = useState("");
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});

  const [progressTaskId, setProgressTaskId] = useState<string | null>(null);
  const [progressText, setProgressText] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  const theme = eventState?.uiTheme || {
    characterClass: "Event Coordinator",
    tagline: "Create unforgettable moments",
    narrativeVoice: "an organized planner who cares deeply",
    primaryColor: "#6366f1",
    accentColor: "#8b5cf6",
    bgPrimary: "#f8f6f3",
    bgSecondary: "#f5f3f0",
    styleTemplate: "modern" as const,
    layoutMode: "grid" as const,
    dominantCategory: "venue" as const,
  };

  // CopilotKit setup
  useCopilotReadable({
    description: "The current event state including tasks, guests, and budget",
    value: eventState
      ? JSON.stringify(eventState)
      : "No event created yet. User is in onboarding.",
  });

  useCopilotAction({
    name: "completeTask",
    description: "Mark a task as completed",
    parameters: [{ name: "taskId", description: "The task ID", type: "string" }],
    handler: ({ taskId }) => {
      completeTask(taskId);
    },
  });

  useCopilotAction({
    name: "reportTaskProgress",
    description: "Report progress on a task",
    parameters: [
      { name: "taskId", description: "Task ID", type: "string" },
      { name: "report", description: "What you've done", type: "string" },
    ],
    handler: async ({ taskId, report }) => {
      if (!eventState) return;
      const task = eventState.tasks.find((t) => t.id === taskId);
      if (!task) return;

      setIsEvaluating(true);
      try {
        const result = await evaluateTaskProgress(
          report,
          task,
          eventState.uiTheme.narrativeVoice,
          apiKey
        );
        // Progress model: handle as task completion progress
        return result.message;
      } catch {
        return "Unable to evaluate progress. Please try again.";
      } finally {
        setIsEvaluating(false);
      }
    },
  });

  const handleDetailsContinue = async () => {
    if (!detailsInput.trim()) return;

    setIsLoadingQuestions(true);
    setGenerateError("");
    try {
      const detailedContext = `Event Type: ${eventType}\n${detailsInput}`;
      const generatedQuestions = await generateEventQuestions(detailedContext, apiKey);
      setQuestions(generatedQuestions);
      setOnboardingStep("questions");
    } catch (err) {
      setGenerateError(`Failed to generate questions: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleQuestionsComplete = async (answers: Record<string, string>) => {
    setQuestionAnswers(answers);
    setIsLoadingThemes(true);
    setThemeError("");
    try {
      const detailedContext = `Event Type: ${eventType}\n${detailsInput}\n\nUser Answers:\n${Object.entries(answers)
        .map(([id, ans]) => `- ${id}: ${ans}`)
        .join("\n")}`;
      const proposals = await generateStyleProposals(detailedContext, apiKey);
      setThemeProposals(proposals);
      setOnboardingStep("themes");
    } catch (err) {
      setThemeError(`Failed to generate themes: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsLoadingThemes(false);
    }
  };

  const handleGenerateEvent = async (answers: Record<string, string>, theme: StyleProposal) => {
    setIsGenerating(true);
    setGenerateError("");
    try {
      const enrichedContext = `Event Type: ${eventType}\n${detailsInput}\n\nPersonality & Preferences:\n${Object.entries(answers)
        .map(([id, ans]) => `- ${id}: ${ans}`)
        .join("\n")}\n\nTheme Preference:\nlayoutTemplate="${theme.styleTemplate}", primaryColor="${theme.primaryColor}", accentColor="${theme.accentColor}"`;
      const generated = await buildEventFromContext(enrichedContext, apiKey);
      generated.uiTheme = {
        ...theme,
        layoutMode: theme.layoutMode || "grid",
        dominantCategory: theme.dominantCategory || "venue",
      };
      initEvent(generated);
    } catch (err) {
      setGenerateError(
        `Failed to generate event: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetEvent = () => {
    resetEvent();
    setOnboardingStep("details");
    setDetailsInput("");
    setEventType("wedding");
    setQuestions([]);
    setThemeProposals([]);
    setQuestionAnswers({});
  };

  if (!isLoaded) return <div>Loading...</div>;

  if (!eventState) {
    return (
      <ThemeContext.Provider value={theme}>
        {onboardingStep === "details" && (
          <div
            style={{
              background: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 35%, #ede9fe 65%, #fce7f3 100%)",
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
            }}
          >
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

            <div
              style={{
                maxWidth: "520px",
                background: "rgba(255,255,255,0.38)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                border: "1px solid rgba(255,255,255,0.65)",
                borderRadius: "28px",
                boxShadow:
                  "0 8px 40px rgba(99,102,241,0.16), 0 2px 8px rgba(99,102,241,0.07), inset 0 1px 0 rgba(255,255,255,0.85)",
                padding: "36px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
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
                    background: "rgba(99,102,241,0.18)",
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

              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🎉</div>
                <h1
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "#312e81",
                    marginBottom: "6px",
                  }}
                >
                  Let&apos;s Plan Your Event
                </h1>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                  Tell us about your celebration and we&apos;ll create a personalized
                  planning dashboard.
                </p>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#4338ca", display: "block", marginBottom: "6px" }}>
                  Event Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid rgba(99,102,241,0.3)",
                    background: "rgba(255,255,255,0.6)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#312e81",
                  }}
                >
                  <option>wedding</option>
                  <option>corporate</option>
                  <option>birthday</option>
                  <option>graduation</option>
                  <option>anniversary</option>
                  <option>other</option>
                </select>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#4338ca", display: "block", marginBottom: "6px" }}>
                  Event Details
                </label>
                <textarea
                  value={detailsInput}
                  onChange={(e) => setDetailsInput(e.target.value)}
                  placeholder="Date, guest count, venue ideas, theme preferences, budget..."
                  style={{
                    width: "100%",
                    minHeight: "100px",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid rgba(99,102,241,0.3)",
                    background: "rgba(255,255,255,0.6)",
                    fontSize: "0.9rem",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
              </div>

              {generateError && (
                <div
                  style={{
                    marginBottom: "12px",
                    padding: "10px 14px",
                    background: "rgba(254,202,202,0.55)",
                    border: "1px solid rgba(252,165,165,0.65)",
                    borderRadius: "8px",
                    color: "#dc2626",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  ⚠ {generateError}
                </div>
              )}

              <button
                onClick={handleDetailsContinue}
                disabled={!detailsInput.trim() || isLoadingQuestions}
                style={{
                  width: "100%",
                  padding: "13px 24px",
                  background:
                    !detailsInput.trim() || isLoadingQuestions
                      ? "linear-gradient(135deg, #c7d2fe, #ddd6fe)"
                      : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: !detailsInput.trim() || isLoadingQuestions ? "#6366f1" : "#fff",
                  border: "none",
                  borderRadius: "100px",
                  fontSize: "0.95rem",
                  fontWeight: 900,
                  cursor: !detailsInput.trim() || isLoadingQuestions ? "not-allowed" : "pointer",
                  opacity: !detailsInput.trim() ? 0.6 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                {isLoadingQuestions ? "✨ Generating questions..." : "Continue →"}
              </button>
            </div>
          </div>
        )}

        {onboardingStep === "questions" && (
          <OnboardingQuestions
            questions={questions}
            isLoading={isLoadingThemes}
            error={themeError}
            onBack={() => setOnboardingStep("details")}
            onSubmit={handleQuestionsComplete}
          />
        )}

        {onboardingStep === "themes" && (
          <OnboardingThemes
            proposals={themeProposals}
            isGenerating={isGenerating}
            onBack={() => setOnboardingStep("questions")}
            onGenerate={(theme) => handleGenerateEvent(questionAnswers, theme)}
          />
        )}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={theme}>
      <div
        style={{
          "--primary": theme.primaryColor,
          "--accent": theme.accentColor,
          "--bg-primary": theme.bgPrimary,
          "--bg-secondary": theme.bgSecondary,
        } as React.CSSProperties}
      >
        {progressEvent && (
          <ProgressNotification
            amount={progressEvent.amount}
            reason={progressEvent.reason}
            onDone={clearProgressEvent}
          />
        )}

        <CopilotSidebar
          instructions="You are an experienced event planner. Help the user organize their celebration with warmth and expertise."
          defaultOpen={true}
        />

        <LayoutSelector
          eventState={eventState}
          onTaskProgress={setProgressTaskId}
          onToggleItem={toggleTaskItem}
          onResetEvent={handleResetEvent}
        />
      </div>
    </ThemeContext.Provider>
  );
}
