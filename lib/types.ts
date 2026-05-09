export type EventCategory = "venue" | "catering" | "entertainment" | "decor" | "guests" | "budget";
export type TaskStatus = "locked" | "active" | "completed";
export type StyleTemplate = "hacienda" | "modern" | "tropical" | "luxury" | "romantic" | "industrial";

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface EventTask {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  estimatedCost: number;
  status: TaskStatus;
  items: TaskItem[];
  dependencies: string[];
  dueDate?: string;
  vendorName?: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  rsvpStatus: "pending" | "confirmed" | "declined";
  plusOne: boolean;
  dietaryRestrictions: string;
  tableNumber?: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: EventCategory;
  estimatedCost: number;
  confirmed: boolean;
  contactInfo: string;
  notes: string;
}

export interface EventCategoryNode {
  id: EventCategory;
  name: string;
  icon: string;
  status: "locked" | "active" | "complete";
  tasks: string[];
}

export interface EventStyle {
  characterClass: string;
  tagline: string;
  narrativeVoice: string;
  primaryColor: string;
  accentColor: string;
  bgPrimary: string;
  bgSecondary: string;
  styleTemplate: StyleTemplate;
  layoutMode: "grid" | "kanban";
  dominantCategory: EventCategory;
}

export interface EventState {
  eventName: string;
  hostName: string;
  eventType: string;
  eventDate: string;
  estimatedGuests: number;
  totalBudget: number;
  tasks: EventTask[];
  categories: EventCategoryNode[];
  totalProgress: number;
  guests: Guest[];
  vendors: Vendor[];
  createdAt: string;
  uiTheme: EventStyle;
}

export interface OnboardingQuestion {
  id: string;
  question: string;
  emoji: string;
  type: "choice" | "scale";
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: [string, string];
}

export interface StyleProposal {
  id: string;
  styleTemplate: StyleTemplate;
  characterClass: string;
  tagline: string;
  narrativeVoice: string;
  primaryColor: string;
  accentColor: string;
  bgPrimary: string;
  bgSecondary: string;
  layoutMode: "grid" | "kanban";
  dominantCategory: EventCategory;
  description: string;
  emoji: string;
}

export const CATEGORY_META: Record<EventCategory, { name: string; icon: string; color: string }> = {
  venue: { name: "Venue", icon: "🏛️", color: "#f59e0b" },
  catering: { name: "Catering", icon: "🍽️", color: "#ec4899" },
  entertainment: { name: "Entertainment", icon: "🎵", color: "#8b5cf6" },
  decor: { name: "Decor", icon: "🎨", color: "#14b8a6" },
  guests: { name: "Guests", icon: "👥", color: "#3b82f6" },
  budget: { name: "Budget", icon: "💰", color: "#10b981" },
};

export const DEFAULT_STYLE: EventStyle = {
  characterClass: "The Visionary Host",
  tagline: "Create unforgettable moments",
  narrativeVoice: "a seasoned event planner who believes details matter and loves celebrating milestones",
  primaryColor: "#6366f1",
  accentColor: "#8b5cf6",
  bgPrimary: "#f8f6f3",
  bgSecondary: "#f5f3f0",
  styleTemplate: "modern",
  layoutMode: "grid",
  dominantCategory: "venue",
};

export const DEFAULT_CATEGORIES: EventCategoryNode[] = [
  { id: "venue", name: "Venue", icon: "🏛️", status: "locked", tasks: [] },
  { id: "catering", name: "Catering", icon: "🍽️", status: "locked", tasks: [] },
  { id: "entertainment", name: "Entertainment", icon: "🎵", status: "locked", tasks: [] },
  { id: "decor", name: "Decor", icon: "🎨", status: "locked", tasks: [] },
  { id: "guests", name: "Guests", icon: "👥", status: "locked", tasks: [] },
  { id: "budget", name: "Budget", icon: "💰", status: "locked", tasks: [] },
];

export function calcProgress(tasks: EventTask[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === "completed").length;
  return Math.round((completed / tasks.length) * 100);
}
