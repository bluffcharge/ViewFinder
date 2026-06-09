/**
 * Spec markdown → per-screen sections.
 *
 * The convention: top-level `## headings` carve the document into
 * sections, and a section belongs to a screen when its heading matches
 * the screen's title or path (case-insensitive). Anything above the
 * first `##` is the intro, shown for screens with no matching section.
 */

import type { Board, Screen } from "@/lib/board";
import { screenHref } from "@/lib/board";

export type SpecSection = {
  heading: string;
  body: string;
};

export type ParsedSpec = {
  intro: string;
  sections: SpecSection[];
};

export function parseSpec(markdown: string): ParsedSpec {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const sections: SpecSection[] = [];
  let introLines: string[] = [];
  let current: { heading: string; lines: string[] } | null = null;

  for (const line of lines) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      if (current) sections.push({ heading: current.heading, body: current.lines.join("\n").trim() });
      current = { heading: m[1], lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else {
      // Drop a leading `# Title` from the intro — the rail has its own header.
      if (/^#\s+/.test(line)) continue;
      introLines.push(line);
    }
  }
  if (current) sections.push({ heading: current.heading, body: current.lines.join("\n").trim() });

  return { intro: introLines.join("\n").trim(), sections };
}

function norm(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * Finds the section for a screen. Headings match against the screen
 * title, the raw path, and the resolved URL's pathname (so `## /leads`
 * matches a screen whose path is `https://x.vercel.app/leads`).
 */
export function sectionForScreen(
  spec: ParsedSpec,
  board: Board,
  screen: Screen
): SpecSection | null {
  const candidates = new Set<string>([norm(screen.title), norm(screen.path)]);
  try {
    const url = new URL(screenHref(board, screen), "http://local");
    candidates.add(norm(url.pathname));
    candidates.add(norm(url.pathname + url.search));
  } catch {}
  return (
    spec.sections.find((s) => candidates.has(norm(s.heading))) ?? null
  );
}
