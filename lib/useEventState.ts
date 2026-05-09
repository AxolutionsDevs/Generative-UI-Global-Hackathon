"use client";

import { useCallback, useEffect, useState } from "react";
import { calcProgress, EventState, EventCategory, Guest, Vendor } from "./types";

const SAVE_KEY = "eventflow_save";

function loadSave(): EventState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as EventState) : null;
  } catch {
    return null;
  }
}

function persistSave(state: EventState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function useEventState() {
  const [eventState, setEventState] = useState<EventState | null>(null);
  const [progressEvent, setProgressEvent] = useState<{ amount: number; reason: string } | null>(
    null
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount; ?reset clears the save
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("reset")) {
      localStorage.removeItem(SAVE_KEY);
      window.history.replaceState({}, "", window.location.pathname);
    }
    const saved = loadSave();
    setEventState(saved);
    setIsLoaded(true);
  }, []);

  // Auto-save on every state change
  useEffect(() => {
    if (eventState) persistSave(eventState);
  }, [eventState]);

  const initEvent = useCallback((newState: EventState) => {
    setEventState(newState);
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setEventState((prev) => {
      if (!prev) return prev;

      let tasks = prev.tasks.map((t) =>
        t.id === taskId ? { ...t, status: "completed" as const } : t
      );

      // Unlock dependent tasks
      tasks = tasks.map((t) => {
        if (
          t.status === "locked" &&
          t.dependencies.every((dep) => tasks.find((dt) => dt.id === dep && dt.status === "completed"))
        ) {
          return { ...t, status: "active" as const };
        }
        return t;
      });

      const newProgress = calcProgress(tasks);

      return { ...prev, tasks, totalProgress: newProgress };
    });
    setProgressEvent({ amount: 10, reason: "Task completed" });
  }, []);

  const clearProgressEvent = useCallback(() => setProgressEvent(null), []);

  const toggleTaskItem = useCallback((taskId: string, itemId: string) => {
    setEventState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                items: t.items.map((i) =>
                  i.id === itemId ? { ...i, completed: !i.completed } : i
                ),
              }
            : t
        ),
      };
    });
  }, []);

  const updateGuests = useCallback((guests: Guest[]) => {
    setEventState((prev) => {
      if (!prev) return prev;
      return { ...prev, guests };
    });
  }, []);

  const addVendor = useCallback((vendor: Vendor) => {
    setEventState((prev) => {
      if (!prev) return prev;
      const existingIndex = prev.vendors.findIndex((v) => v.id === vendor.id);
      if (existingIndex >= 0) {
        const newVendors = [...prev.vendors];
        newVendors[existingIndex] = vendor;
        return { ...prev, vendors: newVendors };
      }
      return { ...prev, vendors: [...prev.vendors, vendor] };
    });
  }, []);

  const unlockCategory = useCallback((categoryId: EventCategory) => {
    setEventState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories.map((c) =>
          c.id === categoryId && c.status === "locked" ? { ...c, status: "active" as const } : c
        ),
      };
    });
  }, []);

  const resetEvent = useCallback(() => {
    if (typeof window !== "undefined") localStorage.removeItem(SAVE_KEY);
    setEventState(null);
  }, []);

  return {
    eventState,
    isLoaded,
    progressEvent,
    initEvent,
    completeTask,
    clearProgressEvent,
    toggleTaskItem,
    updateGuests,
    addVendor,
    unlockCategory,
    resetEvent,
  };
}
