"use client";

import {
  ExternalLink,
  Moon,
  RotateCcw,
  Settings2,
  Sun,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { VIEWPORTS, VIEWPORT_ORDER, type Viewport } from "@/lib/viewports";

export function GalleryHeader({
  title,
  href,
  viewport,
  onViewportChange,
  onReset,
  onEditBoard,
}: {
  title: string;
  href: string;
  viewport: Viewport;
  onViewportChange: (v: Viewport) => void;
  onReset: () => void;
  onEditBoard: () => void;
}) {
  const { theme, toggle } = useTheme();
  const ThemeIcon = theme === "dark" ? Sun : Moon;
  const themeNextLabel =
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  return (
    <header className="border-b border-border-subtle">
      {/* sm+: 3-column grid — active screen | viewport switcher | actions.
          Below sm: flex-wrap two rows — (screen + actions) over a
          full-width centered switcher. order-* applies only to the flex
          layout; sm:order-none restores document order for the grid. */}
      <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:px-4">
        <div className="order-1 flex min-w-0 flex-1 items-baseline gap-2 sm:order-none">
          <span className="t-mono-label">Now</span>
          <span className="truncate text-[14px] font-semibold text-ink-title">
            {title}
          </span>
          <code className="hidden truncate rounded-sm bg-subtle px-1.5 py-0.5 text-[11.5px] text-ink-body xl:inline">
            {href}
          </code>
        </div>

        <div className="order-3 flex w-full justify-center sm:order-none sm:w-auto sm:justify-self-center">
          <ViewportSwitcher value={viewport} onChange={onViewportChange} />
        </div>

        <div className="order-2 flex items-center justify-end gap-1.5 sm:order-none">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-8 items-center gap-1.5 rounded-[12px] border border-border bg-card px-2.5 text-[12px] font-medium text-ink-body hover:bg-subtle"
            title="Reload this screen"
            aria-label="Reload this screen"
          >
            <RotateCcw size={12} strokeWidth={1.75} />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-[12px] border border-border bg-card px-2.5 text-[12px] font-medium text-ink-body hover:bg-subtle"
            title="Open in a new tab"
            aria-label="Open in a new tab"
          >
            <ExternalLink size={12} strokeWidth={1.75} />
            <span className="hidden sm:inline">Open</span>
          </a>
          <button
            type="button"
            onClick={onEditBoard}
            className="inline-flex h-8 items-center gap-1.5 rounded-[12px] border border-border bg-card px-2.5 text-[12px] font-medium text-ink-body hover:bg-subtle"
            title="Edit board — URL, screens, spec"
            aria-label="Edit board"
          >
            <Settings2 size={12} strokeWidth={1.75} />
            <span className="hidden sm:inline">Board</span>
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={themeNextLabel}
            title={themeNextLabel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[12px] border border-border text-ink-body hover:bg-subtle"
          >
            <ThemeIcon size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
}

function ViewportSwitcher({
  value,
  onChange,
}: {
  value: Viewport;
  onChange: (v: Viewport) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Preview viewport"
      className="inline-flex items-center gap-0.5 rounded-pill border border-border bg-card p-1 shadow-sm"
    >
      {VIEWPORT_ORDER.map((v) => {
        const { Icon, label, width, height, shortLabel } = VIEWPORTS[v];
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v)}
            title={`${label} · ${shortLabel} · ${width} × ${height}`}
            className={[
              "inline-flex h-7 items-center gap-1.5 rounded-pill px-2.5 transition-colors duration-fast ease-snap",
              active
                ? "bg-[color:var(--btn-ink-bg)] text-[color:var(--btn-ink-fg)]"
                : "text-ink-caption hover:bg-subtle hover:text-ink-body",
            ].join(" ")}
          >
            <Icon size={13} strokeWidth={1.75} />
            <span className="hidden text-[11px] font-medium tracking-wide xl:inline">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
