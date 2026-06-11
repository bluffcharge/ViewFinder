"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Maximize2, Minimize2 } from "lucide-react";
import { SourceLinksMenu } from "@/components/gallery/SourceLinksMenu";
import type { ViewportSpec } from "@/lib/viewports";

export function Stage({
  iframeSrc,
  spec,
  expanded,
  onToggleExpanded,
  sourceLinks,
  repoUrl,
  onOpenSpec,
}: {
  iframeSrc: string;
  spec: ViewportSpec;
  expanded: boolean;
  onToggleExpanded: () => void;
  sourceLinks?: string[];
  repoUrl?: string;
  /** Opens the mobile spec sheet — the rail is hidden below md. */
  onOpenSpec?: () => void;
}) {
  const ExpandIcon = expanded ? Minimize2 : Maximize2;
  const expandLabel = expanded ? "Exit expanded view" : "Expand canvas (Esc to exit)";
  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {/* Canvas toolbar — Source dropdown (only when the active screen has
          source links) sits to the left of Expand; Expand is right-aligned. */}
      <div className="flex items-center justify-end gap-1.5 border-b border-border-subtle px-3 py-2.5 sm:px-4">
        {onOpenSpec && (
          <button
            type="button"
            onClick={onOpenSpec}
            className="mr-auto inline-flex h-8 items-center gap-1.5 rounded-[12px] border border-border bg-card px-2.5 text-[12px] font-medium text-ink-body hover:bg-subtle md:hidden"
            title="Show spec context"
          >
            <FileText size={12} strokeWidth={1.75} />
            Spec
          </button>
        )}
        <SourceLinksMenu links={sourceLinks} repoUrl={repoUrl} />
        <button
          type="button"
          onClick={onToggleExpanded}
          aria-pressed={expanded}
          className="inline-flex h-8 items-center gap-1.5 rounded-[12px] border border-border bg-card px-2.5 text-[12px] font-medium text-ink-body hover:bg-subtle"
          title={expandLabel}
        >
          <ExpandIcon size={12} strokeWidth={1.75} />
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>
      <div className="mx-auto flex w-full max-w-[1480px] flex-1 flex-col overflow-hidden px-3 pb-2 pt-3 sm:px-5">
        <ViewportFrame src={iframeSrc} spec={spec} />
      </div>
    </main>
  );
}

/**
 * Renders the iframe at its NATIVE viewport size (e.g. 1920×1080), then
 * applies a CSS transform: scale() so the visual fits the available stage
 * area. The iframe document genuinely renders at the target viewport, so
 * responsive breakpoints inside the page fire correctly — clicks and
 * scroll scale with the visual transform.
 *
 * Viewport switches are animated: the frame's width/height/border-radius
 * and the iframe's scale all transition with a single ease curve so the
 * preview morphs from one shape into the next rather than snapping.
 */
function ViewportFrame({ src, spec }: { src: string; spec: ViewportSpec }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [avail, setAvail] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setAvail({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Compute scale to fit, capped at 1 (tiny viewports are never blown up).
  const scale = avail.w && avail.h
    ? Math.min(1, avail.w / spec.width, avail.h / spec.height)
    : 0;
  const scaledW = spec.width * scale;
  const scaledH = spec.height * scale;
  const scaledRadius = spec.radius * scale;

  const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
  const DUR = "320ms";

  return (
    <div
      ref={wrapperRef}
      className="flex w-full flex-1 items-center justify-center overflow-hidden"
    >
      {scale > 0 && (
        <div
          style={{
            width: scaledW,
            height: scaledH,
            borderRadius: scaledRadius,
            transition: `width ${DUR} ${EASE}, height ${DUR} ${EASE}, border-radius ${DUR} ${EASE}`,
            willChange: "width, height",
          }}
          className="overflow-hidden border border-border bg-card shadow-lg"
        >
          <iframe
            key={src}
            src={src}
            title="Preview"
            style={{
              width: spec.width,
              height: spec.height,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              transition: `transform ${DUR} ${EASE}`,
              display: "block",
              willChange: "transform",
            }}
            className="border-0"
          />
        </div>
      )}
    </div>
  );
}
