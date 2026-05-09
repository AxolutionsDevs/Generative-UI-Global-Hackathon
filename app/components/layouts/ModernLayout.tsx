"use client";

import { LayoutProps } from "./LayoutSelector";
import { FunctionalDashboard } from "./FunctionalDashboard";

export function ModernLayout({
  eventState,
  onTaskProgress,
  onToggleItem,
  onResetEvent,
}: LayoutProps) {
  return (
    <FunctionalDashboard
      variant="modern"
      eventState={eventState}
      onTaskProgress={onTaskProgress}
      onToggleItem={onToggleItem}
      onResetEvent={onResetEvent}
    />
  );
}
