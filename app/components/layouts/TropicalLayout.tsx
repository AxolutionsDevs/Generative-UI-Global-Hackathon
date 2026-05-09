"use client";

import { LayoutProps } from "./LayoutSelector";
import { FunctionalDashboard } from "./FunctionalDashboard";

export function TropicalLayout({ eventState, onTaskProgress, onToggleItem, onResetEvent }: LayoutProps) {
  return (
    <FunctionalDashboard
      variant="tropical"
      eventState={eventState}
      onTaskProgress={onTaskProgress}
      onToggleItem={onToggleItem}
      onResetEvent={onResetEvent}
    />
  );
}
