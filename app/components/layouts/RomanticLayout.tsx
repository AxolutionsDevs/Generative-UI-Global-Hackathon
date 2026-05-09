"use client";

import { LayoutProps } from "./LayoutSelector";
import { FunctionalDashboard } from "./FunctionalDashboard";

export function RomanticLayout({ eventState, onTaskProgress, onToggleItem, onResetEvent }: LayoutProps) {
  return (
    <FunctionalDashboard
      variant="romantic"
      eventState={eventState}
      onTaskProgress={onTaskProgress}
      onToggleItem={onToggleItem}
      onResetEvent={onResetEvent}
    />
  );
}
