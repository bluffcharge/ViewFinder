"use client";

import { useCallback, useRef, useState } from "react";
import { Download, FileUp, Upload, X } from "lucide-react";
import {
  boardToJson,
  parseBoard,
  type Board,
  type Screen,
} from "@/lib/board";
import {
  emptyScreenDraft,
  ScreensEditor,
  type ScreenDraft,
} from "@/components/setup/ScreensEditor";

/**
 * The board editor. Shown full-screen on first run (no board yet) and
 * as an overlay when editing an existing board. Everything saves to
 * localStorage via the parent — nothing leaves the browser.
 */
export function SetupPanel({
  board,
  onSave,
  onCancel,
  onClear,
}: {
  board: Board | null;
  onSave: (board: Board) => void;
  /** Hidden on first run, when there's nothing to go back to. */
  onCancel?: () => void;
  /** Offered only when editing an existing board. */
  onClear?: () => void;
}) {
  const [name, setName] = useState(board?.name ?? "");
  const [baseUrl, setBaseUrl] = useState(board?.baseUrl ?? "");
  const [repoUrl, setRepoUrl] = useState(board?.repoUrl ?? "");
  const [spec, setSpec] = useState(board?.specMarkdown ?? "");
  const [screens, setScreens] = useState<ScreenDraft[]>(
    board && board.screens.length > 0
      ? board.screens.map((s) => ({
          id: s.id,
          path: s.path,
          title: s.title,
          subtitle: s.subtitle ?? "",
          group: s.group ?? "",
          sourceLinksText: (s.sourceLinks ?? []).join("\n"),
        }))
      : [emptyScreenDraft()]
  );
  const [error, setError] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const mdInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const buildBoard = useCallback((): Board => {
    const ready = screens.filter((s) => s.path.trim() && s.title.trim());
    if (ready.length === 0) {
      throw new Error(
        "Add at least one screen with both a path and a title — those two fields are what the filmstrip is built from."
      );
    }
    const half = screens.find(
      (s) =>
        (s.path.trim() || s.title.trim()) &&
        !(s.path.trim() && s.title.trim())
    );
    if (half) {
      throw new Error(
        `Screen "${half.title.trim() || half.path.trim()}" has a ${
          half.path.trim() ? "title" : "path"
        } missing — fill it in or remove the screen.`
      );
    }
    const finalScreens: Screen[] = ready.map((s) => ({
      id: s.id,
      path: s.path.trim(),
      title: s.title.trim(),
      subtitle: s.subtitle.trim() || undefined,
      group: s.group.trim() || undefined,
      sourceLinks:
        s.sourceLinksText
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean) || undefined,
    }));
    return {
      name: name.trim() || "Untitled board",
      baseUrl: baseUrl.trim(),
      screens: finalScreens,
      specMarkdown: spec.trim() ? spec : undefined,
      repoUrl: repoUrl.trim() || undefined,
    };
  }, [screens, name, baseUrl, spec, repoUrl]);

  const handleSave = () => {
    try {
      onSave(buildBoard());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleExport = () => {
    try {
      const json = boardToJson(buildBoard());
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "board.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const readFile = (file: File, cb: (text: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => cb(String(reader.result ?? ""));
    reader.readAsText(file);
  };

  const handleImportJson = (file: File) => {
    readFile(file, (text) => {
      try {
        const b = parseBoard(text);
        setName(b.name);
        setBaseUrl(b.baseUrl);
        setRepoUrl(b.repoUrl ?? "");
        setSpec(b.specMarkdown ?? "");
        setScreens(
          b.screens.map((s) => ({
            id: s.id,
            path: s.path,
            title: s.title,
            subtitle: s.subtitle ?? "",
            group: s.group ?? "",
            sourceLinksText: (s.sourceLinks ?? []).join("\n"),
          }))
        );
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border border-border bg-canvas shadow-lg">
      <header className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <div>
          <h1 className="text-[16px] font-semibold text-ink-title">
            {board ? "Edit board" : "Set up your board"}
          </h1>
          <p className="mt-0.5 text-[12.5px] text-ink-caption">
            Point ViewFinder at a deployed prototype. Everything stays in this
            browser — saved to localStorage, sent nowhere.
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close without saving"
            className="grid h-8 w-8 place-items-center rounded-md text-ink-caption hover:bg-subtle hover:text-ink-body"
          >
            <X size={15} strokeWidth={1.75} />
          </button>
        )}
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <label className="block">
            <span className="t-mono-label">Board name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme app — design review"
              className="mt-1.5 h-9 w-full rounded-[12px] border border-border bg-canvas px-3 text-[13px] text-ink-body placeholder:text-ink-disabled"
            />
          </label>
          <label className="block">
            <span className="t-mono-label">Prototype URL</span>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://my-prototype.vercel.app"
              spellCheck={false}
              className="mt-1.5 h-9 w-full rounded-[12px] border border-border bg-canvas px-3 font-mono text-[12px] text-ink-body placeholder:text-ink-disabled"
            />
            <span className="mt-1 block text-[11px] leading-snug text-ink-caption">
              Screen paths are joined onto this. A screen can also use a full
              URL of its own.
            </span>
          </label>
        </section>

        <section>
          <h2 className="t-mono-label mb-2.5">Screens</h2>
          <ScreensEditor screens={screens} onChange={setScreens} />
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="t-mono-label">Spec — markdown</h2>
            <button
              type="button"
              onClick={() => mdInputRef.current?.click()}
              className="inline-flex h-7 items-center gap-1.5 rounded-[10px] border border-border bg-card px-2 text-[11.5px] font-medium text-ink-body hover:bg-subtle"
            >
              <FileUp size={11} strokeWidth={1.85} />
              Upload .md
            </button>
            <input
              ref={mdInputRef}
              type="file"
              accept=".md,.markdown,.txt"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) readFile(f, setSpec);
                e.target.value = "";
              }}
            />
          </div>
          <textarea
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
            placeholder={
              "Paste product requirements as markdown (Notion: ⋯ → Export → Markdown).\n\n## Leads — overview\n- Requirement one…\n\nSections map to screens by `## Screen Title` or `## /path`."
            }
            rows={8}
            spellCheck={false}
            className="w-full resize-y rounded-[12px] border border-border bg-canvas px-3 py-2.5 font-mono text-[11.5px] leading-relaxed text-ink-body placeholder:text-ink-disabled"
          />
        </section>

        <section className="max-w-[360px]">
          <label className="block">
            <span className="t-mono-label">Repo URL — optional</span>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/you/your-prototype"
              spellCheck={false}
              className="mt-1.5 h-9 w-full rounded-[12px] border border-border bg-canvas px-3 font-mono text-[12px] text-ink-body placeholder:text-ink-disabled"
            />
            <span className="mt-1 block text-[11px] leading-snug text-ink-caption">
              Linked from the Source menu footer.
            </span>
          </label>
        </section>

        {error && (
          <p
            role="alert"
            className="rounded-[12px] border border-error/30 bg-error/5 px-3 py-2.5 text-[12.5px] leading-relaxed text-error"
          >
            {error}
          </p>
        )}
      </div>

      <footer className="flex flex-wrap items-center gap-2 border-t border-border-subtle px-5 py-3.5">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-9 items-center rounded-pill bg-[color:var(--btn-ink-bg)] px-4 text-[13px] font-semibold text-[color:var(--btn-ink-fg)] hover:bg-[color:var(--btn-ink-bg-hover)]"
        >
          Save board
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-9 items-center rounded-pill border border-border bg-card px-4 text-[13px] font-medium text-ink-body hover:bg-subtle"
          >
            Cancel
          </button>
        )}

        <span className="flex-1" />

        <button
          type="button"
          onClick={handleExport}
          title="Download this board as board.json — commit it to public/ to ship a default board"
          className="inline-flex h-8 items-center gap-1.5 rounded-[12px] border border-border bg-card px-2.5 text-[12px] font-medium text-ink-body hover:bg-subtle"
        >
          <Download size={12} strokeWidth={1.75} />
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => jsonInputRef.current?.click()}
          className="inline-flex h-8 items-center gap-1.5 rounded-[12px] border border-border bg-card px-2.5 text-[12px] font-medium text-ink-body hover:bg-subtle"
        >
          <Upload size={12} strokeWidth={1.75} />
          Import JSON
        </button>
        <input
          ref={jsonInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImportJson(f);
            e.target.value = "";
          }}
        />

        {onClear &&
          (confirmClear ? (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex h-8 items-center rounded-[12px] border border-error/40 px-2.5 text-[12px] font-semibold text-error hover:bg-error/5"
            >
              Yes — clear this board
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="inline-flex h-8 items-center rounded-[12px] px-2.5 text-[12px] font-medium text-ink-caption hover:text-error"
            >
              Clear board…
            </button>
          ))}
      </footer>
    </div>
  );
}
