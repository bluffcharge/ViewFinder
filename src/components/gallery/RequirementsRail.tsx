"use client";

import { ChevronsLeft, FileText } from "lucide-react";
import { SpecMarkdown } from "@/components/gallery/SpecMarkdown";
import type { SpecSection } from "@/lib/spec";

type Props = {
  /** The matched spec section for the active screen, if any. */
  section: SpecSection | null;
  /** Intro markdown (above the first ##) — fallback when no section matches. */
  intro: string;
  /** Whether the board has any spec markdown at all. */
  hasSpec: boolean;
  routeTitle: string;
  subtitle?: string;
  collapsed: boolean;
  onToggle: () => void;
};

export function RequirementsRail({
  section,
  intro,
  hasSpec,
  routeTitle,
  subtitle,
  collapsed,
  onToggle,
}: Props) {
  if (collapsed) {
    return (
      <aside className="flex w-9 shrink-0 flex-col items-center border-r border-border-subtle bg-[color:var(--surface-stage)] py-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Open requirements rail"
          title="Show spec context"
          className="grid h-9 w-9 place-items-center rounded-md text-ink-caption hover:bg-subtle hover:text-ink-body"
        >
          <FileText size={14} strokeWidth={1.75} />
        </button>
      </aside>
    );
  }
  return (
    <aside className="flex w-[260px] shrink-0 flex-col overflow-hidden border-r border-border-subtle bg-[color:var(--surface-stage)]">
      <header className="flex items-center justify-between gap-2 border-b border-border-subtle px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText size={13} strokeWidth={1.75} className="text-ink-caption" />
          <p className="t-mono-label">From the spec</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Collapse requirements rail"
          title="Hide"
          className="grid h-7 w-7 place-items-center rounded-md text-ink-caption hover:bg-subtle hover:text-ink-body"
        >
          <ChevronsLeft size={14} strokeWidth={1.75} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-5">
          <section>
            <p className="t-mono-label mb-1.5">Screen</p>
            <p className="text-[13px] font-semibold leading-snug text-ink-title">
              {routeTitle}
            </p>
            {subtitle && (
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-subtitle">
                {subtitle}
              </p>
            )}
          </section>

          <Divider />

          {section ? (
            <SpecMarkdown markdown={section.body} />
          ) : hasSpec && intro ? (
            <>
              <SpecMarkdown markdown={intro} />
              <p className="t-caption">
                No section matches this screen yet — add a{" "}
                <code className="rounded-sm bg-subtle px-1 py-px font-mono text-[10.5px]">
                  ## {routeTitle}
                </code>{" "}
                heading to the spec to pin notes here.
              </p>
            </>
          ) : hasSpec ? (
            <p className="t-caption">
              No section matches this screen. Sections map by heading — add{" "}
              <code className="rounded-sm bg-subtle px-1 py-px font-mono text-[10.5px]">
                ## {routeTitle}
              </code>{" "}
              to the spec markdown.
            </p>
          ) : (
            <p className="t-caption">
              No spec attached. Open <span className="font-semibold">Edit board</span> and
              paste or upload a markdown file — each <code className="rounded-sm bg-subtle px-1 py-px font-mono text-[10.5px]">##</code> section
              shows up here next to its screen.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

function Divider() {
  return <div className="border-t border-border-subtle" aria-hidden="true" />;
}
