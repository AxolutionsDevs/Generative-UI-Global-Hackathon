import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  DEFAULT_STYLE,
  DEFAULT_CATEGORIES,
  EventState,
  EventTask,
  OnboardingQuestion,
  StyleProposal,
} from "./types";

const MODEL = "gemini-3.1-flash-lite";

// ─── INTAKE ──────────────────────────────────────────────────────────────────

const INTAKE_SYSTEM_PROMPT = `You are EventFlow, an AI that converts event details into a personalized planning dashboard.

Return ONE valid JSON object. NO markdown, NO code fences, NO explanation. Raw JSON only.

Schema:
{
  "eventName": string,
  "hostName": string,
  "eventType": string,
  "eventDate": string,
  "estimatedGuests": number,
  "totalBudget": number,
  "tasks": [
    {
      "id": string,
      "title": string,
      "description": string,
      "category": "venue"|"catering"|"entertainment"|"decor"|"guests"|"budget",
      "estimatedCost": number,
      "status": "locked"|"active",
      "items": [{ "id": string, "title": string, "completed": false }],
      "dependencies": string[],
      "dueDate": string
    }
  ],
  "categories": [
    { "id": "venue"|"catering"|"entertainment"|"decor"|"guests"|"budget", "name": string, "icon": string, "status": "locked"|"active"|"complete", "tasks": string[] }
  ],
  "totalProgress": 0,
  "guests": [],
  "vendors": [],
  "createdAt": string,
  "uiTheme": {
    "characterClass": string,
    "tagline": string,
    "narrativeVoice": string,
    "primaryColor": string,
    "accentColor": string,
    "bgPrimary": string,
    "bgSecondary": string,
    "styleTemplate": "hacienda"|"modern"|"tropical"|"luxury"|"romantic"|"industrial",
    "layoutMode": "grid"|"kanban",
    "dominantCategory": "venue"|"catering"|"entertainment"|"decor"|"guests"|"budget"
  }
}

TASK RULES:
- Create 15–20 tasks distributed across all 6 categories
- Only categories with tasks get status "active"; rest are "locked"
- estimatedCost: realistic budget allocation for each task (sum should be ~80% of totalBudget)
- Each task: 2–4 concrete items as actionable milestones (e.g., "Call 3 venue options")
- Task IDs: "t1", "t2", ... Item IDs: "t1_i1", "t1_i2", ...
- Include ALL 6 categories in the output; locked ones: status "locked", empty tasks array
- dueDate: ISO date for the task (earlier tasks first, all before eventDate)
- createdAt: ISO timestamp (now)

UI THEME — PSYCHOLOGICAL ANALYSIS:
Do NOT use static template-to-color mappings. Instead, read the emotional subtext of the event:

LAYOUT SELECTION — infer from the event's psychological posture:
- "hacienda"     → intimate, warm, celebration rooted in heritage or tradition
- "modern"       → clean, efficient, corporate or contemporary professional event
- "tropical"     → vibrant, playful, vacation mindset, celebration mood
- "luxury"       → elegant, refined, high-stakes, sophisticated gathering
- "romantic"     → intimate, emotional, deeply personal milestone (wedding, anniversary)
- "industrial"   → raw, authentic, creative or unconventional celebration

layoutMode: "kanban" when tasks are sequential (vendor selection → catering → decor); "grid" when parallel or independent.
dominantCategory: the single category with the most tasks.

COLOR GENERATION — use color theory, NOT a palette preset:
- Read the emotional tone: formal/elegant → cool, desaturated palette; playful/warm → saturated, analogous; artistic/bold → triadic or split-complementary
- Analogous palette (adjacent hues, ~30° apart) → harmony, cohesion
- Complementary palette (opposite hues, ~180° apart) → energy, dynamic contrast
- Triadic palette (three hues, 120° apart) → creative expression, richness
- bgPrimary: very dark (#070708 to #141418 range), almost black but with a chromatic hint
- bgSecondary: 8–12% lighter than bgPrimary, same hue family
- primaryColor: the most emotionally resonant hue — vivid but purposeful for this event
- accentColor: creates productive tension with primaryColor via color theory
- GENERATE unique HEX codes. Never repeat colors across different events.

IDENTITY FIELDS:
- characterClass: invent a title that fuses the event's nature + the host's aspirational identity for it. Must feel earned, not generic. No Planner/Coordinator/Master/Maestro/Oracle/AI clichés.
- tagline: a single sentence (max 8 words) that captures the event's soul
- narrativeVoice: define both a ROLE and a PERSONALITY QUIRK. Format: "[role] who [quirk]". Examples: "a seasoned event planner who takes every detail personally and quotes Shakespeare", "a wedding coordinator who secretly writes poetry about love stories", "a party curator who believes chaos is the ultimate ingredient". Make it specific and surprising.`;

// ─── PROGRESS EVALUATION ─────────────────────────────────────────────────────

const PROGRESS_SYSTEM_PROMPT = `You are EventFlow, the voice of a planning assistant. The user reported progress on a task.

Return ONE valid JSON object. No markdown, no fences. Raw JSON only.

Schema:
{
  "progressPoints": number,
  "message": string,
  "taskCompleted": boolean
}

Rules:
- progressPoints: 0 to task's full estimatedCost (in terms of % completion). Be generous for genuine effort. 0 only for no real effort.
- message: 1–2 sentences in the assistant's narrativeVoice style. Encouraging, in-character, evocative.
- taskCompleted: true only if user clearly finished the entire task.`;

// ─── ONBOARDING QUESTIONS ────────────────────────────────────────────────────

const QUESTIONS_SYSTEM_PROMPT = `You are EventFlow. Based on the user's event details, generate exactly 5 personalized onboarding questions to customize their planning experience.

Return ONE valid JSON array. No markdown, no fences. Raw JSON only.

Schema:
[
  {
    "id": "q1",
    "question": "Short friendly question (max 12 words)?",
    "emoji": "🎉",
    "type": "choice",
    "options": ["Option A", "Option B", "Option C"],
    "scaleMin": 1,
    "scaleMax": 10,
    "scaleLabels": ["Low", "High"],
    "contextKey": "budget"
  }
]

Rules:
- Exactly 5 questions
- SPECIFIC to the event type, size, and stated goals — not generic
- Mix: at least 2 choice questions (3-4 options each); the rest can be scale, text, number, or date
- Cover: event formality, venue preference, style aesthetic, budget flexibility, DIY vs full-service
- Tone: conversational, encouraging, exciting
- Options must be meaningful and mutually exclusive
- If the prompt includes Missing Context Focus, prioritize those items and ensure at least 3 questions target them
- Use contextKey to tag each question with ONE of: date, location, guest_count, budget, formality, venue, aesthetic, service_level, schedule, other`;

// ─── STYLE PROPOSALS ─────────────────────────────────────────────────────────

const STYLE_SYSTEM_PROMPT = `You are EventFlow, a creative AI that invents personalized event planning dashboards. Based on the event details and the user's answers, invent 3 completely UNIQUE visual/organizational style concepts. Each must feel handcrafted for THIS specific event.

Return ONE valid JSON array. No markdown, no fences. Raw JSON only.

Schema:
[
  {
    "id": "s1",
    "styleTemplate": "romantic",
    "characterClass": "The Dreamer of Timeless Moments",
    "tagline": "Every detail whispers love.",
    "narrativeVoice": "a wedding coordinator who believes every celebration deserves poetry and speaks only in metaphors of connection",
    "primaryColor": "#db2777",
    "accentColor": "#f97316",
    "bgPrimary": "#0c0a08",
    "bgSecondary": "#1a1410",
    "layoutMode": "grid",
    "description": "Built for an intimate gathering where emotion is the primary ingredient. Soft, romantic, deeply personal.",
    "emoji": "💕"
  }
]

styleTemplate is the structural skeleton ONLY — pick by information architecture:
- "hacienda"     → warm, hierarchical, tradition-rooted flow
- "modern"       → clean, data-dense, linear workflow
- "tropical"     → vivid, playful, grid-based, expressive
- "luxury"       → elegant, refined, Art Deco sensibility
- "romantic"     → intimate, flowing, emotionally centered
- "industrial"   → raw, authentic, grid-with-character

3 AXES OF DESIGN — position each of the 3 proposals at a DIFFERENT point across all three axes:

AXIS 1 — INTIMACY (Intimate ←→ Grand):
  Intimate: small gatherings, close-knit, quiet sophistication
  Grand: large-scale, elaborate, expansive

AXIS 2 — ERA (Classic ←→ Contemporary ←→ Bohemian):
  Classic: timeless, traditional, heritage
  Contemporary: modern, clean, current
  Bohemian: organic, unconventional, artisanal

AXIS 3 — PALETTE (Warm/Earthy ←→ Cool/Crisp ←→ Vivid/Tropical):
  Warm/Earthy: gold, rust, terracotta, nature tones
  Cool/Crisp: slate, silver, navy, minimalist
  Vivid/Tropical: coral, lime, bold saturates

IDENTITY FIELDS:
- characterClass: title fusing the event's nature + aspirational identity
- tagline: 4–8 words distilling the event's essence
- narrativeVoice: "[role] who [quirk]" — make it specific enough to write 10 sentences in
- description: 1–2 sentences referencing the ACTUAL event details provided`;

// ─── EXPORTED FUNCTIONS ───────────────────────────────────────────────────────

export async function buildEventFromContext(
  context: string,
  apiKey: string,
): Promise<EventState> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: INTAKE_SYSTEM_PROMPT,
  });

  const result = await model.generateContent(
    `Convert these event details into a personalized planning dashboard:\n\n${context}`,
  );
  const text = result.response.text().trim();
  const clean = text
    .replace(/^```(?:json)?\n?/, "")
    .replace(/\n?```$/, "")
    .trim();

  const parsed = JSON.parse(clean) as EventState;

  const presentIds = new Set(parsed.categories.map((c) => c.id));
  for (const category of DEFAULT_CATEGORIES) {
    if (!presentIds.has(category.id)) parsed.categories.push({ ...category });
  }

  parsed.uiTheme = { ...DEFAULT_STYLE, ...(parsed.uiTheme ?? {}) };
  parsed.totalProgress = 0;
  parsed.createdAt = new Date().toISOString();

  return parsed;
}

export async function generateEventQuestions(
  eventDetails: string,
  apiKey: string,
  contextFocus: string[] = [],
): Promise<OnboardingQuestion[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: QUESTIONS_SYSTEM_PROMPT,
  });
  const result = await model.generateContent(
    `Generate 5 personalized onboarding questions for this event:\n\n${eventDetails}\n\nMissing Context Focus: ${
      contextFocus.length ? contextFocus.join(", ") : "none"
    }`,
  );
  const text = result.response.text().trim();
  const clean = text
    .replace(/^```(?:json)?\n?/, "")
    .replace(/\n?```$/, "")
    .trim();
  return JSON.parse(clean) as OnboardingQuestion[];
}

export async function generateStyleProposals(
  enrichedContext: string,
  apiKey: string,
): Promise<StyleProposal[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: STYLE_SYSTEM_PROMPT,
  });
  const result = await model.generateContent(
    `Generate 3 style proposals for:\n\n${enrichedContext}`,
  );
  const text = result.response.text().trim();
  const clean = text
    .replace(/^```(?:json)?\n?/, "")
    .replace(/\n?```$/, "")
    .trim();
  return JSON.parse(clean) as StyleProposal[];
}

export async function evaluateTaskProgress(
  progressReport: string,
  task: EventTask,
  narrativeVoice: string,
  apiKey: string,
): Promise<{ progressPoints: number; message: string; taskCompleted: boolean }> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction:
      PROGRESS_SYSTEM_PROMPT +
      `\n\nSpeak as: ${narrativeVoice}. Let the personality quirk color every word.`,
  });

  const context = `Task: "${task.title}" (max ${task.estimatedCost} budget points)
Category: ${task.category}
Description: ${task.description}
Progress report: "${progressReport}"`;

  const result = await model.generateContent(context);
  const text = result.response.text().trim();
  const clean = text
    .replace(/^```(?:json)?\n?/, "")
    .replace(/\n?```$/, "")
    .trim();
  return JSON.parse(clean);
}
