"use client";

import { LayoutProps } from "./LayoutSelector";
import { FunctionalDashboard } from "./FunctionalDashboard";

export function HaciendaLayout({ eventState, onTaskProgress, onToggleItem, onResetEvent }: LayoutProps) {
  return (
    <FunctionalDashboard
      variant="hacienda"
      eventState={eventState}
      onTaskProgress={onTaskProgress}
      onToggleItem={onToggleItem}
      onResetEvent={onResetEvent}
    />
  );
}
