"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GalleryHeader } from "@/components/gallery/GalleryHeader";
import { Stage } from "@/components/gallery/Stage";
import { Filmstrip } from "@/components/gallery/Filmstrip";
import { RequirementsRail } from "@/components/gallery/RequirementsRail";
import { SetupPanel } from "@/components/setup/SetupPanel";
import { Welcome } from "@/components/setup/Welcome";
import {
  clearBoard,
  DEMO_BOARD,
  fetchRepoBoard,
  loadStoredBoard,
  saveBoard,
  screenHref,
  type Board,
} from "@/lib/board";
import { parseSpec, sectionForScreen } from "@/lib/spec";
import { VIEWPORTS, VIEWPORT_ORDER, type Viewport } from "@/lib/viewports";

const VIEWPORT_STORAGE_KEY = "viewfinder-viewport";
const LEFT_RAIL_KEY = "viewfinder-left-rail";

export default function Home() {
  // null = no board yet (welcome); undefined = still hydrating.
  const [board, setBoard] = useState<Board | null | undefined>(undefined);
  const [setupOpen, setSetupOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewport, setViewportState] = useState<Viewport>("desktop");
  const [resetTick, setResetTick] = useState(0);
  const [leftCollapsed, setLeftCollapsedState] = useState(false);
  // Expanded mode collapses the rail + hides the filmstrip so the iframe
  // canvas fills the gallery viewport.
  const [expanded, setExpanded] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Hydrate: localStorage board wins; a committed public/board.json is the
  // fallback for forks that ship a default board. UI prefs restore too —
  // the active screen intentionally does NOT persist, so every refresh
  // starts the walkthrough from screen 1.
  useEffect(() => {
    const storedViewport = localStorage.getItem(VIEWPORT_STORAGE_KEY) as Viewport | null;
    if (storedViewport && VIEWPORTS[storedViewport]) setViewportState(storedViewport);
    setLeftCollapsedState(localStorage.getItem(LEFT_RAIL_KEY) === "1");

    const stored = loadStoredBoard();
    if (stored) {
      setBoard(stored);
      return;
    }
    // ?demo=1 deep-links straight into the demo board (without saving it),
    // so a hosted instance can be shared mid-walkthrough.
    if (new URLSearchParams(window.location.search).has("demo")) {
      setBoard(DEMO_BOARD);
      return;
    }
    let cancelled = false;
    fetchRepoBoard().then((repoBoard) => {
      if (!cancelled) setBoard(repoBoard);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setViewport = useCallback((v: Viewport) => {
    setViewportState(v);
    try { localStorage.setItem(VIEWPORT_STORAGE_KEY, v); } catch {}
  }, []);
  const toggleLeft = useCallback(() => {
    setLeftCollapsedState((prev) => {
      const next = !prev;
      try { localStorage.setItem(LEFT_RAIL_KEY, next ? "1" : "0"); } catch {}
      return next;
    });
  }, []);

  const adoptBoard = useCallback((b: Board) => {
    saveBoard(b);
    setBoard(b);
    setActiveId(b.screens[0]?.id ?? null);
    setSetupOpen(false);
    setResetTick((n) => n + 1);
  }, []);

  const handleClear = useCallback(() => {
    clearBoard();
    setBoard(null);
    setActiveId(null);
    setSetupOpen(false);
  }, []);

  const screens = board?.screens ?? [];
  const active =
    screens.find((s) => s.id === activeId) ?? screens[0] ?? null;
  const activeIndex = active ? screens.indexOf(active) : -1;

  // Single entry point for every screen selection. Bumps reset on every
  // call so the iframe re-mounts fresh (even on same-card re-click).
  const selectScreen = useCallback((id: string) => {
    setActiveId(id);
    setResetTick((n) => n + 1);
  }, []);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) selectScreen(screens[activeIndex - 1].id);
  }, [activeIndex, screens, selectScreen]);
  const goNext = useCallback(() => {
    if (activeIndex >= 0 && activeIndex < screens.length - 1) {
      selectScreen(screens[activeIndex + 1].id);
    }
  }, [activeIndex, screens, selectScreen]);

  // Scroll the active card into view in the filmstrip.
  useEffect(() => {
    if (!active) return;
    cardRefs.current[active.id]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [active]);

  // Keyboard: ← → step screens; ⇧← ⇧→ step viewports; Esc exits expanded.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (setupOpen) return;
      if (e.key === "Escape" && expanded) {
        e.preventDefault();
        setExpanded(false);
        return;
      }
      if (e.shiftKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault();
        const i = VIEWPORT_ORDER.indexOf(viewport);
        const next =
          e.key === "ArrowLeft"
            ? VIEWPORT_ORDER[Math.max(0, i - 1)]
            : VIEWPORT_ORDER[Math.min(VIEWPORT_ORDER.length - 1, i + 1)];
        setViewport(next);
        return;
      }
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, viewport, setViewport, expanded, setupOpen]);

  const activeHref = board && active ? screenHref(board, active) : "";
  const iframeSrc = useMemo(() => {
    if (!activeHref) return "";
    const sep = activeHref.includes("?") ? "&" : "?";
    return `${activeHref}${sep}embed=1&t=${resetTick}`;
  }, [activeHref, resetTick]);

  const spec = useMemo(
    () => (board?.specMarkdown ? parseSpec(board.specMarkdown) : null),
    [board?.specMarkdown]
  );
  const section =
    spec && board && active ? sectionForScreen(spec, board, active) : null;

  if (board === undefined) return null;

  if (board === null || !active) {
    return setupOpen ? (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[color:var(--surface-stage)] px-4 py-6">
        <div className="h-[min(720px,92dvh)] w-full">
          <SetupPanel
            board={null}
            onSave={adoptBoard}
            onCancel={() => setSetupOpen(false)}
          />
        </div>
      </div>
    ) : (
      <Welcome
        onStartSetup={() => setSetupOpen(true)}
        onLoadDemo={() => adoptBoard(DEMO_BOARD)}
      />
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[color:var(--surface-stage)] text-ink">
      <GalleryHeader
        title={active.title}
        href={activeHref}
        viewport={viewport}
        onViewportChange={setViewport}
        onReset={() => setResetTick((n) => n + 1)}
        onEditBoard={() => setSetupOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {!expanded && (
          <RequirementsRail
            section={section}
            intro={spec?.intro ?? ""}
            hasSpec={!!spec}
            routeTitle={active.title}
            subtitle={active.subtitle}
            collapsed={leftCollapsed}
            onToggle={toggleLeft}
          />
        )}
        <Stage
          iframeSrc={iframeSrc}
          spec={VIEWPORTS[viewport]}
          expanded={expanded}
          onToggleExpanded={() => setExpanded((e) => !e)}
          sourceLinks={active.sourceLinks}
          repoUrl={board.repoUrl}
        />
      </div>

      {!expanded && (
        <Filmstrip
          board={board}
          active={active}
          activeIndex={activeIndex}
          onSelect={selectScreen}
          onPrev={goPrev}
          onNext={goNext}
          stripRef={stripRef}
          cardRefs={cardRefs}
        />
      )}

      {setupOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-overlay px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="Edit board"
        >
          <div className="h-[min(720px,92dvh)] w-full">
            <SetupPanel
              board={board}
              onSave={adoptBoard}
              onCancel={() => setSetupOpen(false)}
              onClear={handleClear}
            />
          </div>
        </div>
      )}
    </div>
  );
}
