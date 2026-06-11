"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { groupPipClass, type Board, type Screen } from "@/lib/board";

export function Filmstrip({
  board,
  active,
  activeIndex,
  onSelect,
  onPrev,
  onNext,
  stripRef,
  cardRefs,
}: {
  board: Board;
  active: Screen;
  activeIndex: number;
  onSelect: (id: string) => void;
  onPrev: () => void;
  onNext: () => void;
  stripRef: React.RefObject<HTMLDivElement>;
  cardRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
}) {
  const screens = board.screens;
  return (
    <footer className="safe-pb sticky bottom-0 z-10 border-t border-border-subtle bg-[color:var(--surface-stage)]/95 backdrop-blur-[8px]">
      <div className="mx-auto flex w-full max-w-[1640px] items-stretch gap-2 px-2 py-3 sm:px-4">
        <ArrowButton dir="prev" onClick={onPrev} disabled={activeIndex === 0} />

        <div
          ref={stripRef}
          className="flex flex-1 snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 py-1"
          style={{ scrollbarWidth: "none" }}
          role="tablist"
          aria-label="Prototype screens"
        >
          {screens.map((s, i) => (
            <FilmCard
              key={s.id}
              board={board}
              screen={s}
              index={i + 1}
              isActive={s.id === active.id}
              onClick={() => onSelect(s.id)}
              refCb={(el) => {
                cardRefs.current[s.id] = el;
              }}
            />
          ))}
        </div>

        <ArrowButton
          dir="next"
          onClick={onNext}
          disabled={activeIndex === screens.length - 1}
        />
      </div>
    </footer>
  );
}

function ArrowButton({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous screen" : "Next screen"}
      className="hidden h-20 w-9 shrink-0 items-center justify-center self-center rounded-xl border border-border bg-card text-ink-body shadow-xs transition-colors duration-fast ease-snap hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
    >
      <Icon size={16} strokeWidth={1.75} />
    </button>
  );
}

function FilmCard({
  board,
  screen,
  index,
  isActive,
  onClick,
  refCb,
}: {
  board: Board;
  screen: Screen;
  index: number;
  isActive: boolean;
  onClick: () => void;
  refCb: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={refCb}
      role="tab"
      type="button"
      aria-selected={isActive}
      onClick={onClick}
      className={[
        "group relative flex shrink-0 snap-start flex-col items-start justify-between gap-1 rounded-xl border px-3.5 py-3 text-left",
        "h-20 w-[252px]",
        "transition-[background-color,border-color,box-shadow,transform] duration-fast ease-snap",
        isActive
          ? "film-active bg-card"
          : "border-border bg-card shadow-sm hover:-translate-y-0.5 hover:border-strong hover:shadow-md",
      ].join(" ")}
    >
      <div className="flex w-full items-center gap-2">
        <span
          aria-hidden="true"
          className={[
            "h-2 w-2 shrink-0 rounded-pill",
            groupPipClass(board, screen.group),
          ].join(" ")}
        />
        <span className="t-mono-label flex-1 truncate">
          {screen.group ?? "Screen"}
        </span>
        <span className="text-[10px] font-semibold tabular-nums text-ink-disabled">
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <span className="truncate text-[13px] font-semibold leading-tight text-ink-title">
        {screen.title}
      </span>
      <span className="truncate text-[11.5px] leading-tight text-ink-caption">
        {screen.subtitle ?? screen.path}
      </span>
    </button>
  );
}
