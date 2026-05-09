"use client";

import { EventState } from "@/lib/types";
import { ModernLayout } from "./ModernLayout";
import { HaciendaLayout } from "./HaciendaLayout";
import { TropicalLayout } from "./TropicalLayout";
import { LuxuryLayout } from "./LuxuryLayout";
import { RomanticLayout } from "./RomanticLayout";
import { IndustrialLayout } from "./IndustrialLayout";

export interface LayoutProps {
  eventState: EventState;
  onTaskProgress: (taskId: string) => void;
  onToggleItem: (taskId: string, itemId: string) => void;
  onResetEvent: () => void;
}

export function LayoutSelector(props: LayoutProps) {
  const template = props.eventState.uiTheme.styleTemplate;

  const layoutMap: Record<string, React.ComponentType<LayoutProps>> = {
    hacienda: HaciendaLayout,
    modern: ModernLayout,
    tropical: TropicalLayout,
    luxury: LuxuryLayout,
    romantic: RomanticLayout,
    industrial: IndustrialLayout,
  };

  const LayoutComponent = layoutMap[template] || ModernLayout;

  return <LayoutComponent {...props} />;
}
