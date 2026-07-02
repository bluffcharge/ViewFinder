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
  "bg-violet-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-indigo-500",
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
/* Demo board — frames the three AEXIS demo screens that ship with the */
/* app, so the canvas works before you've wired up your own prototype. */
/* ------------------------------------------------------------------ */

export const DEMO_SPEC = `# AEXIS — review notes

Demo spec for the AEXIS Plasma Core screens. Sections below map to screens
by their \`## heading\` — use the screen's title or its path. Everything
here came from a plain markdown file; export from Notion
(\`⋯ → Export → Markdown\`) or paste your own.

## Core

The wall-screen view — lattice health and live plasma telemetry at a glance.

### Key requirements

- The output gauge is the hero: net megawatts, a glowing **Nominal** status pill, and the sustained Q factor.
- The field panel renders specimen IG-77 as a raymarched SDF blob — viscous bronze mass, white specular bloom, blue-violet iridescent rim. Dragging the cursor raises a lobe that relaxes back over ~1.5s; slow breathing pulse and tumble underneath. Static fallback when WebGL is unavailable.
- Six readout wells: density, ion temp, field, confinement, net output, Q factor — values in display type, units in mono labels.
- Telemetry streams newest-first; threshold rows carry a **Watch** chip, never color alone.
- Glass surfaces sit inside 1px gradient border shells; radii stay in the 1px / 4px / pill family.
- Content widens with the viewport — desktop and wide use the horizontal real estate instead of a fixed column.

## Nodes

The maintenance view — every containment node by status.

### Key requirements

- Three columns by status: Stable, Tuning, Offline — counts in the column headers.
- Cards carry name, ID, ring position, flux, last sync, and an uptime track (lime for stable, amber for tuning).
- Offline nodes read dimmed **and** say "No signal" in text — never color alone.
- Columns stack vertically on phones — horizontal scrolling is not acceptable on touch.

## Config

Per-node configuration; intentionally calm.

### Key requirements

- Name and ID are editable; the ID is uppercased on blur.
- Sampling cadence is a segmented control — the active segment fills amber and glows.
- Alert toggles write immediately — no save button for toggles.
- The danger zone names the node being decommissioned; telemetry is kept.
`;

export const DEMO_BOARD: Board = {
  name: "AEXIS — demo board",
  baseUrl: "",
  screens: [
    {
      id: "demo-console",
      path: "/demo/console",
      title: "Core",
      subtitle: "Output gauge · plasma field · telemetry",
      group: "Monitor",
    },
    {
      id: "demo-stations",
      path: "/demo/stations",
      title: "Nodes",
      subtitle: "Stable · tuning · offline",
      group: "Lattice",
    },
    {
      id: "demo-settings",
      path: "/demo/settings",
      title: "Config",
      subtitle: "Identity · cadence · alerts",
      group: "Admin",
    },
  ],
  specMarkdown: DEMO_SPEC,
};
