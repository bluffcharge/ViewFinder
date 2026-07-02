"use client";

import { useState } from "react";
import { ALERTS } from "@/app/demo/data";

const SEVERITY_STYLE = {
  alarm: "border-[color:var(--ax-primary)] text-[color:var(--ax-primary)]",
  watch: "border-[color:var(--ax-secondary)]/60 text-[color:var(--ax-secondary)]",
  info: "border-[color:var(--ax-line)] text-[color:var(--ax-text-dim)]",
} as const;

export default function DemoAlerts() {
  const [acked, setAcked] = useState<Record<string, boolean>>({});
  const open = ALERTS.filter((a) => !acked[a.id]).length;

  return (
    <div className="max-w-[860px] space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="aexis-label">Operations queue — today</p>
          <h1 className="aexis-display text-[30px] leading-[36px]">Alerts</h1>
        </div>
        <p className="aexis-label">
          {open} open · acknowledgements write immediately
        </p>
      </header>

      <section className="aexis-shell">
        <div className="aexis-card overflow-hidden">
          <ul className="divide-y divide-[color:var(--ax-line)]">
            {ALERTS.map((a) => {
              const done = !!acked[a.id];
              return (
                <li
                  key={a.id}
                  className={[
                    "flex flex-col gap-2 px-3 py-3 transition-opacity duration-300 sm:flex-row sm:items-center sm:gap-4",
                    done ? "opacity-40" : "",
                  ].join(" ")}
                >
                  <span
                    className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${SEVERITY_STYLE[a.severity]}`}
                  >
                    {a.severity}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="uppercase text-[color:var(--ax-text)]">
                      {a.title}
                      <span className="aexis-label"> · {a.node}</span>
                    </p>
                    <p className="aexis-label mt-0.5">{a.detail}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="aexis-label tabular-nums">{a.when}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setAcked((s) => ({ ...s, [a.id]: !s[a.id] }))
                      }
                      className={[
                        "rounded-full border px-3 py-1.5 text-[10.4px] uppercase tracking-[0.1em] transition-colors duration-150",
                        done
                          ? "border-[color:var(--ax-line)] text-[color:var(--ax-text-dim)]"
                          : "border-[color:var(--ax-primary)]/60 text-[color:var(--ax-primary)] hover:shadow-[0_0_8px_rgba(245,158,11,0.6)]",
                      ].join(" ")}
                    >
                      {done ? "Reopen" : "Acknowledge"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <p className="aexis-label">
        Alarm severities page the on-shift operator; watch items roll into
        the 08:00 digest.
      </p>
    </div>
  );
}
