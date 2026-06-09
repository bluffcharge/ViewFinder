/**
 * Minimal markdown renderer for the requirements rail — enough for the
 * spec-section subset (### subheads, bullet + numbered lists, bold,
 * inline code, links) without pulling in a markdown dependency. Raw
 * HTML in the source is rendered as text, never injected.
 */

import { Fragment, type ReactNode } from "react";

export function SpecMarkdown({ markdown }: { markdown: string }) {
  const blocks = toBlocks(markdown);
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        if (block.kind === "h") {
          return (
            <p key={i} className="t-mono-label pt-1.5">
              {renderInline(block.text)}
            </p>
          );
        }
        if (block.kind === "ul" || block.kind === "ol") {
          return (
            <ul key={i} className="space-y-2">
              {block.items.map((item, j) => (
                <li
                  key={j}
                  className="relative pl-3.5 text-[12.5px] leading-relaxed text-ink-body before:absolute before:left-0 before:top-[7px] before:h-1.5 before:w-1.5 before:rounded-pill before:bg-accent"
                >
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-[12.5px] leading-relaxed text-ink-body">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

type Block =
  | { kind: "h"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] };

function toBlocks(markdown: string): Block[] {
  const blocks: Block[] = [];
  let list: { kind: "ul" | "ol"; items: string[] } | null = null;
  let para: string[] = [];

  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };
  const flushPara = () => {
    if (para.length) blocks.push({ kind: "p", text: para.join(" ") });
    para = [];
  };

  for (const raw of markdown.split("\n")) {
    const line = raw.trim();
    if (!line) {
      flushList();
      flushPara();
      continue;
    }
    const h = /^#{3,6}\s+(.+)$/.exec(line);
    if (h) {
      flushList();
      flushPara();
      blocks.push({ kind: "h", text: h[1] });
      continue;
    }
    const ul = /^[-*]\s+(.+)$/.exec(line);
    if (ul) {
      flushPara();
      if (!list || list.kind !== "ul") {
        flushList();
        list = { kind: "ul", items: [] };
      }
      list.items.push(ul[1]);
      continue;
    }
    const ol = /^\d+[.)]\s+(.+)$/.exec(line);
    if (ol) {
      flushPara();
      if (!list || list.kind !== "ol") {
        flushList();
        list = { kind: "ol", items: [] };
      }
      list.items.push(ol[1]);
      continue;
    }
    flushList();
    para.push(line);
  }
  flushList();
  flushPara();
  return blocks;
}

/** Inline pass: **bold**, `code`, [text](url). */
function renderInline(text: string): ReactNode {
  const parts: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2]) {
      parts.push(
        <strong key={key++} className="font-semibold text-ink-title">
          {m[2]}
        </strong>
      );
    } else if (m[4]) {
      parts.push(
        <code key={key++} className="rounded-sm bg-subtle px-1 py-px font-mono text-[11px]">
          {m[4]}
        </code>
      );
    } else if (m[6] && m[7]) {
      parts.push(
        <a
          key={key++}
          href={m[7]}
          target="_blank"
          rel="noreferrer"
          className="text-ink-link underline underline-offset-2"
        >
          {m[6]}
        </a>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <Fragment>{parts}</Fragment>;
}
