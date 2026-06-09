"use client";

import { Frame, Play, Plus } from "lucide-react";

/** First-run screen: try the demo board, or set up your own. */
export function Welcome({
  onStartSetup,
  onLoadDemo,
}: {
  onStartSetup: () => void;
  onLoadDemo: () => void;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[color:var(--surface-stage)] px-5 py-10">
      <div className="w-full max-w-[480px] text-center">
        <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <Frame size={20} strokeWidth={1.75} className="text-ink-title" />
        </div>
        <h1 className="text-[22px] font-semibold tracking-tight text-ink-title">
          ViewFinder
        </h1>
        <p
          className="mx-auto mt-2 max-w-[400px] text-[13.5px] leading-relaxed text-ink-body"
          style={{ textWrap: "balance" }}
        >
          A review canvas for deployed prototypes. Frame any URL across five
          breakpoints, walk the screens on a filmstrip, and keep the spec
          beside the work.
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={onStartSetup}
            className="inline-flex h-10 items-center gap-2 rounded-pill bg-[color:var(--btn-ink-bg)] px-5 text-[13.5px] font-semibold text-[color:var(--btn-ink-fg)] hover:bg-[color:var(--btn-ink-bg-hover)]"
          >
            <Plus size={14} strokeWidth={2} />
            Set up your board
          </button>
          <button
            type="button"
            onClick={onLoadDemo}
            className="inline-flex h-10 items-center gap-2 rounded-pill border border-border bg-card px-5 text-[13.5px] font-medium text-ink-body hover:bg-subtle"
          >
            <Play size={14} strokeWidth={2} />
            Try the demo board
          </button>
        </div>

        <p className="mt-6 text-[11.5px] leading-relaxed text-ink-caption">
          Your board is saved in this browser&apos;s localStorage — nothing is
          uploaded anywhere.
        </p>
      </div>
    </div>
  );
}
