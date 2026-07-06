"use client";

import { useState } from "react";
import { READINGS, type Reading } from "@/app/demo/data";

/**
 * Extended archive: the live READINGS repeated back through four sweep
 * windows with deterministic minute offsets — enough rows to scroll,
 * no randomness so captures stay stable.
 */
const ARCHIVE: Reading[] = Array.from({ length: 4 }, (_, w) =>
  READINGS.map((r) => {
    const [h, m, s] = r.time.split(":").map(Number);
    const t = h * 3600 + m * 60 + s - w * 240;
    const pad = (n: number) => String(n).padStart(2, "0");
    return {
      ...r,
      time: `${pad(Math.floor(t / 3600))}:${pad(Math.floor((t % 3600) / 60))}:${pad(t % 60)}`,
    };
  })
).flat();

const NODES = ["All", ...Array.from(new Set(ARCHIVE.map((r) => r.node)))];

export default function DemoTelemetry() {
  const [node, setNode] = useState("All");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const rows = ARCHIVE.filter(
    (r) => (node === "All" || r.node === node) && (!flaggedOnly || r.flagged)
  );

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="fe-label">Sweep archive — last four windows</p>
          <h1 className="fe-display text-[30px] leading-[36px]">
            Telemetry
          </h1>
        </div>
        <p className="fe-label">
          {rows.length} of {ARCHIVE.length} readings
        </p>
      </header>

      {/* Filter rail */}
      <div className="flex flex-wrap items-center gap-2">
        <div
          role="radiogroup"
          aria-label="Filter by node"
          className="fe-well inline-flex max-w-full gap-1 overflow-x-auto rounded-full p-1"
        >
          {NODES.map((n) => {
            const active = n === node;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setNode(n)}
                className={[
                  "shrink-0 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] transition-colors duration-150",
                  active
                    ? "bg-[color:var(--fe-primary)] text-[#EFEFF5]"
                    : "text-[color:var(--fe-text-dim)] hover:text-[color:var(--fe-text)]",
                ].join(" ")}
              >
                {n}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={flaggedOnly}
          onClick={() => setFlaggedOnly((v) => !v)}
          className={[
            "rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] transition-colors duration-150",
            flaggedOnly
              ? "border-[color:var(--fe-primary)] text-[color:var(--fe-primary)]"
              : "border-[color:var(--fe-line)] text-[color:var(--fe-text-dim)] hover:text-[color:var(--fe-text)]",
          ].join(" ")}
        >
          Watch only
        </button>
      </div>

      <section className="fe-shell">
        <div className="fe-card overflow-hidden">
          <table className="hidden w-full text-left sm:table">
            <thead>
              <tr className="border-b border-[color:var(--fe-line)]">
                {["Time", "Node", "Density", "Temp", "Field", "Conf.", "Flag"].map(
                  (h) => (
                    <th key={h} className="fe-label px-3 py-2.5 font-normal">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={`${r.time}-${i}`}
                  className="border-b border-[color:var(--fe-line)] last:border-0"
                >
                  <td className="px-3 py-2.5 tabular-nums text-[color:var(--fe-text-dim)]">{r.time}</td>
                  <td className="px-3 py-2.5 text-[color:var(--fe-text)]">{r.node}</td>
                  <td className="px-3 py-2.5 tabular-nums">{r.density.toFixed(2)}</td>
                  <td className="px-3 py-2.5 tabular-nums">{r.tempKeV.toFixed(1)} keV</td>
                  <td className="px-3 py-2.5 tabular-nums">{r.fieldT.toFixed(1)} T</td>
                  <td className="px-3 py-2.5 tabular-nums">{r.confMs} ms</td>
                  <td className="px-3 py-2.5">
                    {r.flagged && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--fe-primary)]/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-[color:var(--fe-primary)]">
                        Watch
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="divide-y divide-[color:var(--fe-line)] sm:hidden">
            {rows.map((r, i) => (
              <li key={`${r.time}-m-${i}`} className="space-y-1 px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[color:var(--fe-text)]">{r.node}</span>
                  <span className="fe-label">{r.time}</span>
                </div>
                <p className="tabular-nums text-[color:var(--fe-text-dim)]">
                  n {r.density.toFixed(2)} · {r.tempKeV.toFixed(1)} keV ·{" "}
                  {r.fieldT.toFixed(1)} T · {r.confMs} ms
                </p>
              </li>
            ))}
          </ul>

          {rows.length === 0 && (
            <p className="fe-label px-3 py-6 text-center">
              No readings match this filter.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
