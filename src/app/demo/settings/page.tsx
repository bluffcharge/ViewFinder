"use client";

import { useState } from "react";

const INTERVALS = ["30 s", "2 min", "10 min"];

export default function DemoConfig() {
  const [name, setName] = useState("Torus Gamma");
  const [nodeId, setNodeId] = useState("AX-04");
  const [interval, setInterval_] = useState("30 s");
  const [alerts, setAlerts] = useState({
    density: true,
    offline: true,
    digest: false,
  });

  return (
    <div className="max-w-[620px] space-y-3">
      <header>
        <p className="fe-label">Node configuration</p>
        <h1 className="fe-display text-[30px] leading-[36px]">Config</h1>
      </header>

      <section className="fe-shell">
        <div className="fe-card p-3">
          <h2 className="fe-label mb-3">Identity</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_150px]">
            <label className="block">
              <span className="fe-label">Node name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="fe-well mt-1.5 h-9 w-full bg-transparent px-3 text-[11px] uppercase tracking-[0.08em]"
              />
            </label>
            <label className="block">
              <span className="fe-label">ID</span>
              <input
                type="text"
                value={nodeId}
                onChange={(e) => setNodeId(e.target.value)}
                onBlur={() => setNodeId((v) => v.toUpperCase())}
                className="fe-well mt-1.5 h-9 w-full bg-transparent px-3 text-[11px] uppercase tracking-[0.08em] tabular-nums"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="fe-shell">
        <div className="fe-card p-3">
          <h2 className="fe-label mb-1.5 text-[color:var(--fe-text)]">
            Sampling cadence
          </h2>
          <p className="fe-label">
            How often the node reports. Shorter intervals draw harder on the
            capacitor bank during grid peaks.
          </p>
          <div
            role="radiogroup"
            aria-label="Sampling cadence"
            className="fe-well mt-3 inline-flex gap-1 rounded-full p-1"
          >
            {INTERVALS.map((v) => {
              const active = v === interval;
              return (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setInterval_(v)}
                  className={[
                    "rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.08em] transition-colors duration-150",
                    active
                      ? "fe-glow bg-[color:var(--fe-primary)] text-[#EFEFF5]"
                      : "text-[color:var(--fe-text-dim)] hover:text-[color:var(--fe-text)]",
                  ].join(" ")}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="fe-shell">
        <div className="fe-card p-3">
          <h2 className="fe-label mb-1.5 text-[color:var(--fe-text)]">
            Alerts — write immediately
          </h2>
          <ul className="divide-y divide-[color:var(--fe-line)]">
            <Toggle
              label="Density watch threshold"
              hint="Fires when any node holds above 2.0 ×10²⁰ m⁻³ for 10 minutes."
              checked={alerts.density}
              onChange={(v) => setAlerts((a) => ({ ...a, density: v }))}
            />
            <Toggle
              label="Offline nodes"
              hint="Fires after three missed sync windows."
              checked={alerts.offline}
              onChange={(v) => setAlerts((a) => ({ ...a, offline: v }))}
            />
            <Toggle
              label="Daily digest"
              hint="One summary at 08:00 — lattice health and overnight peaks."
              checked={alerts.digest}
              onChange={(v) => setAlerts((a) => ({ ...a, digest: v }))}
            />
          </ul>
        </div>
      </section>

      <section className="fe-shell">
        <div className="fe-card border border-[color:var(--fe-primary)]/30 p-3">
          <h2 className="fe-label mb-1.5 text-[color:var(--fe-primary)]">
            Danger zone
          </h2>
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="fe-label leading-relaxed">
              Decommissioning retires{" "}
              <span className="text-[color:var(--fe-text)]">
                {name || "this node"}
              </span>{" "}
              from the lattice. Historical telemetry is kept.
            </p>
            <button
              type="button"
              className="fe-well shrink-0 px-3.5 py-2 text-[11px] uppercase tracking-[0.08em] text-[color:var(--fe-primary)] transition-shadow duration-150 hover:shadow-[0_0_12px_rgba(148,163,184,0.4)] hover:text-[color:var(--fe-secondary)]"
            >
              Decommission {nodeId || "node"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="uppercase text-[color:var(--fe-text)]">{label}</p>
        <p className="fe-label mt-0.5">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className="fe-well relative h-6 w-11 shrink-0 rounded-full"
      >
        <span
          className={[
            "absolute top-[3px] h-4 w-4 rounded-full transition-[left,background-color,box-shadow] duration-150",
            checked
              ? "fe-glow left-[24px] bg-[color:var(--fe-primary)]"
              : "left-[3px] bg-[rgba(15,23,42,0.25)]",
          ].join(" ")}
        />
      </button>
    </li>
  );
}
