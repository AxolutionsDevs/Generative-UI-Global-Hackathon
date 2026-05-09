"use client";

import { LayoutProps } from "./LayoutSelector";
import { FunctionalDashboard } from "./FunctionalDashboard";

export function IndustrialLayout({ eventState, onTaskProgress, onToggleItem, onResetEvent }: LayoutProps) {
  return (
    <FunctionalDashboard
      variant="industrial"
      eventState={eventState}
      onTaskProgress={onTaskProgress}
      onToggleItem={onToggleItem}
      onResetEvent={onResetEvent}
    />
  );
}
