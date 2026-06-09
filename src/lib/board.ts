/**
 * Board model + persistence.
 *
 * A board is everything ViewFinder needs to review one prototype: the
 * deployed URL, the list of screens, and (optionally) the spec markdown
 * that annotates them. Boards live in localStorage — nothing is sent
 * anywhere. A repo can also ship a default board by committing
 * `public/board.json`; localStorage wins when both exist.
 */

export type Screen = {
  /** Stable key for React lists + the active-screen pointer. */
  id: string;
  /** Absolute URL, or a path joined onto the board's baseUrl. */
  path: string;
  title: string;
  subtitle?: string;
  /** Free-form section label — screens sharing a group share a pip color. */
  group?: string;
  /** URLs of source files for this screen (GitHub links work best). */
  sourceLinks?: string[];
};

export type Board = {
  name: string;
  /** The deployed prototype origin, e.g. https://my-prototype.vercel.app */
  baseUrl: string;
  screens: Screen[];
  /** Raw markdown; sections map to screens by `## Title` or `## /path`. */
  specMarkdown?: string;
  /** Optional repo link shown in the Source menu footer. */
  repoUrl?: string;
};

const BOARD_KEY = "viewfinder-board-v1";

export function newScreenId(): string {
  return `s-${Math.random().toString(36).slice(2, 9)}`;
}

/** Joins a screen path onto the board's base URL. Absolute paths pass through. */
export function screenHref(board: Board, screen: Screen): string {
  const p = screen.path.trim();
  if (/^https?:\/\//i.test(p)) return p;
  const base = board.baseUrl.trim().replace(/\/+$/, "");
  if (!base) return p;
  return p.startsWith("/") ? `${base}${p}` : `${base}/${p}`;
}

export function loadStoredBoard(): Board | null {
  try {
    const raw = localStorage.getItem(BOARD_KEY);
    if (!raw) return null;
    return parseBoard(raw);
  } catch {
    return null;
  }
}

export function saveBoard(board: Board) {
  try {
    localStorage.setItem(BOARD_KEY, JSON.stringify(board, null, 2));
  } catch {}
}

export function clearBoard() {
  try {
    localStorage.removeItem(BOARD_KEY);
  } catch {}
}

/** Fetches a board the repo owner committed at public/board.json, if any. */
export async function fetchRepoBoard(): Promise<Board | null> {
  try {
    const res = await fetch("/board.json", { cache: "no-store" });
    if (!res.ok) return null;
    return parseBoard(await res.text());
  } catch {
    return null;
  }
}

/**
 * Parses + validates board JSON (from localStorage, an imported file, or
 * public/board.json). Throws with a readable message on bad input so the
 * import UI can show the user what to fix.
 */
export function parseBoard(text: string): Board {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("That file isn't valid JSON.");
  }
  if (typeof data !== "object" || data === null) {
    throw new Error("Expected a JSON object with name, baseUrl, and screens.");
  }
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.screens) || obj.screens.length === 0) {
    throw new Error("The board needs a screens array with at least one screen.");
  }
  const screens: Screen[] = obj.screens.map((s, i) => {
    const sc = (s ?? {}) as Record<string, unknown>;
    if (typeof sc.path !== "string" || !sc.path.trim()) {
      throw new Error(`Screen ${i + 1} is missing a path.`);
    }
    if (typeof sc.title !== "string" || !sc.title.trim()) {
      throw new Error(`Screen ${i + 1} is missing a title.`);
    }
    return {
      id: typeof sc.id === "string" && sc.id ? sc.id : newScreenId(),
      path: sc.path.trim(),
      title: sc.title.trim(),
      subtitle: typeof sc.subtitle === "string" ? sc.subtitle : undefined,
      group: typeof sc.group === "string" && sc.group.trim() ? sc.group.trim() : undefined,
      sourceLinks: Array.isArray(sc.sourceLinks)
        ? sc.sourceLinks.filter((u): u is string => typeof u === "string" && !!u.trim())
        : undefined,
    };
  });
  return {
    name: typeof obj.name === "string" && obj.name.trim() ? obj.name.trim() : "Untitled board",
    baseUrl: typeof obj.baseUrl === "string" ? obj.baseUrl.trim() : "",
    screens,
    specMarkdown: typeof obj.specMarkdown === "string" ? obj.specMarkdown : undefined,
    repoUrl: typeof obj.repoUrl === "string" && obj.repoUrl.trim() ? obj.repoUrl.trim() : undefined,
  };
}

export function boardToJson(board: Board): string {
  return JSON.stringify(board, null, 2);
}

/* ------------------------------------------------------------------ */
/* Group pips — screens sharing a group share a color, assigned by      */
/* order of first appearance. Literal class names so Tailwind sees them.*/
/* ------------------------------------------------------------------ */

const PIP_CLASSES = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-cyan-500",
];

export function groupPipClass(board: Board, group: string | undefined): string {
  if (!group) return "bg-zinc-400";
  const groups: string[] = [];
  for (const s of board.screens) {
    if (s.group && !groups.includes(s.group)) groups.push(s.group);
  }
  const i = groups.indexOf(group);
  return PIP_CLASSES[(i >= 0 ? i : 0) % PIP_CLASSES.length];
}

/* ------------------------------------------------------------------ */
/* Demo board — frames the three Orbit demo screens that ship with the */
/* app, so the canvas works before you've wired up your own prototype. */
/* ------------------------------------------------------------------ */

export const DEMO_SPEC = `# Orbit — review notes

Demo spec for the Orbit screens. Sections below map to screens by their
\`## heading\` — use the screen's title or its path. Everything here came
from a plain markdown file; export from Notion (\`⋯ → Export → Markdown\`)
or paste your own.

## Dashboard

The at-a-glance view for a project lead checking in between meetings.

### Key requirements

- Four KPI tiles: open tasks, in review, shipped this week, and blocked — blocked reads in the warn color when nonzero.
- Recent activity lists the last 6 events, newest first, with relative timestamps.
- The tasks table sorts by the **Updated** column by default and collapses below tablet width.

## Board

Where the team actually works — tasks move left to right.

### Key requirements

- Three fixed columns: Backlog, In progress, In review.
- Cards carry a title, an assignee chip, and a priority pip; nothing else.
- Columns stack vertically on phones — horizontal scrolling is not acceptable on touch.

## Settings

Project-level configuration; intentionally boring.

### Key requirements

- Display name and project key are editable; the key is uppercased on blur.
- Notification toggles write immediately — no save button for toggles.
- The danger zone is visually separated and the archive action names the project.
`;

export const DEMO_BOARD: Board = {
  name: "Orbit — demo board",
  baseUrl: "",
  screens: [
    {
      id: "demo-dashboard",
      path: "/demo/dashboard",
      title: "Dashboard",
      subtitle: "KPIs · activity · task table",
      group: "Overview",
    },
    {
      id: "demo-board",
      path: "/demo/board",
      title: "Board",
      subtitle: "Backlog · in progress · in review",
      group: "Work",
    },
    {
      id: "demo-settings",
      path: "/demo/settings",
      title: "Settings",
      subtitle: "Project · notifications · danger zone",
      group: "Admin",
    },
  ],
  specMarkdown: DEMO_SPEC,
};
