"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Code2, Download, ExternalLink } from "lucide-react";

/**
 * Dropdown listing the source files behind the active screen — one
 * "view" link plus a raw download per file. Renders nothing when the
 * screen has no source links.
 *
 * GitHub blob URLs are handled specially: the view link keeps the
 * syntax-highlighted blob page, and the download fetches the matching
 * raw.githubusercontent.com URL. Any other URL is fetched as-is.
 */
export function SourceLinksMenu({
  links,
  repoUrl,
}: {
  links?: string[];
  repoUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cross-origin `<a download>` is ignored by browsers — clicking it
  // just opens the file in a new tab instead of saving. Fetch the raw
  // bytes ourselves and trigger the save via a Blob URL, which is
  // same-origin and respects the download attribute.
  const downloadRaw = useCallback(async (url: string) => {
    const raw = toRawUrl(url);
    try {
      const res = await fetch(raw);
      if (!res.ok) throw new Error(`fetch ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName(url);
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      // CORS or auth got in the way — open the raw URL instead.
      window.open(raw, "_blank", "noreferrer");
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!links || links.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex h-8 items-center gap-1.5 rounded-[12px] border border-border bg-card px-2.5 text-[12px] font-medium text-ink-body hover:bg-subtle"
        title="View source files for this screen"
      >
        <Code2 size={12} strokeWidth={1.75} />
        Source
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-20 w-[360px] overflow-hidden rounded-[14px] border border-border bg-card shadow-lg"
        >
          <div className="border-b border-border-subtle px-4 py-3">
            <p className="t-mono-label">Source files</p>
            <p className="mt-0.5 text-[11.5px] leading-snug text-ink-caption">
              Open or download the files behind this screen.
            </p>
          </div>
          <ul role="list" className="space-y-1.5 px-4 py-3">
            {links.map((url) => (
              <li
                key={url}
                className="flex items-center justify-between gap-2 rounded-md bg-subtle/60 px-2 py-1.5"
              >
                <code
                  className="truncate font-mono text-[11px] text-ink-body"
                  title={url}
                >
                  {fileName(url)}
                </code>
                <span className="flex shrink-0 items-center gap-1">
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    title="Open"
                    className="inline-flex h-6 w-6 items-center justify-center rounded text-ink-caption hover:bg-card hover:text-ink-body"
                  >
                    <ExternalLink size={11} strokeWidth={1.85} />
                  </a>
                  <button
                    type="button"
                    onClick={() => downloadRaw(url)}
                    title="Download"
                    className="inline-flex h-6 w-6 items-center justify-center rounded text-ink-caption hover:bg-card hover:text-ink-body"
                  >
                    <Download size={11} strokeWidth={1.85} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
          {repoUrl && (
            <div className="border-t border-border-subtle bg-subtle/40 px-4 py-2.5 text-[10.5px] uppercase tracking-[0.12em] text-ink-caption">
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium hover:text-ink-body"
              >
                {repoLabel(repoUrl)} ↗
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** github.com/owner/repo/blob/branch/path → raw.githubusercontent.com/owner/repo/branch/path */
function toRawUrl(url: string): string {
  const m = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(url);
  if (m) return `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}`;
  return url;
}

function fileName(url: string): string {
  try {
    const path = new URL(url).pathname;
    return path.split("/").filter(Boolean).pop() ?? url;
  } catch {
    return url;
  }
}

function repoLabel(url: string): string {
  const m = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)/.exec(url);
  if (m) return `${m[1]} / ${m[2]}`;
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
