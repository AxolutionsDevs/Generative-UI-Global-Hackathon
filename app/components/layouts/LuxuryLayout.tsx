"use client";

import { LayoutProps } from "./LayoutSelector";
import { FunctionalDashboard } from "./FunctionalDashboard";

export function LuxuryLayout({ eventState, onTaskProgress, onToggleItem, onResetEvent }: LayoutProps) {
  return (
    <FunctionalDashboard
      variant="luxury"
      eventState={eventState}
      onTaskProgress={onTaskProgress}
      onToggleItem={onToggleItem}
      onResetEvent={onResetEvent}
    />
  );
}
