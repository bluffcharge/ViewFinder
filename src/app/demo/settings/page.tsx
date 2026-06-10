"use client";

import { useState } from "react";

const INTERVALS = ["30 s", "2 min", "10 min"];

export default function DemoSettings() {
  const [name, setName] = useState("Delta Pier");
  const [stationId, setStationId] = useState("ATM-04");
  const [interval, setInterval_] = useState("30 s");
  const [alerts, setAlerts] = useState({
    pm25: true,
    offline: true,
    digest: false,
  });

  return (
    <div className="max-w-[620px] space-y-5">
      <header>
        <p className="atmos-label">Station configuration</p>
        <h1 className="atmos-display mt-1 text-[26px] leading-none">
          Settings
        </h1>
      </header>

      <section className="atmos-card p-5">
        <h2 className="atmos-label mb-3.5">Identity</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_150px]">
          <label className="block">
            <span className="atmos-label">Station name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="atmos-well-soft mt-1.5 h-9 w-full border-0 bg-transparent px-3 text-[12px]"
            />
          </label>
          <label className="block">
            <span className="atmos-label">ID</span>
            <input
              type="text"
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
              onBlur={() => setStationId((v) => v.toUpperCase())}
              className="atmos-well-soft mt-1.5 h-9 w-full border-0 bg-transparent px-3 text-[12px] uppercase tabular-nums"
            />
          </label>
        </div>
      </section>

      <section className="atmos-card p-5">
        <h2 className="atmos-label mb-1.5">Sampling cadence</h2>
        <p className="text-[11.5px] text-[color:var(--atmos-neutral)]">
          How often the station reports. Shorter intervals drain the backup
          cell faster during grid outages.
        </p>
        <div
          role="radiogroup"
          aria-label="Sampling cadence"
          className="atmos-well-soft mt-3 inline-flex gap-1 rounded-full p-1"
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
                  "rounded-full px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors duration-150",
                  active
                    ? "bg-[#2A2A2A] text-[color:var(--atmos-mint)]"
                    : "text-[color:var(--atmos-neutral)] hover:text-[color:var(--atmos-ink)]",
                ].join(" ")}
              >
                {v}
              </button>
            );
          })}
        </div>
      </section>

      <section className="atmos-card p-5">
        <h2 className="atmos-label mb-1.5">Alerts — write immediately</h2>
        <ul className="divide-y divide-white/50">
          <Toggle
            label="PM2.5 watch threshold"
            hint="Fires when any station holds above 20 µg/m³ for 10 minutes."
            checked={alerts.pm25}
            onChange={(v) => setAlerts((a) => ({ ...a, pm25: v }))}
          />
          <Toggle
            label="Offline stations"
            hint="Fires after three missed sync windows."
            checked={alerts.offline}
            onChange={(v) => setAlerts((a) => ({ ...a, offline: v }))}
          />
          <Toggle
            label="Daily digest"
            hint="One summary at 08:00 — array health and overnight peaks."
            checked={alerts.digest}
            onChange={(v) => setAlerts((a) => ({ ...a, digest: v }))}
          />
        </ul>
      </section>

      <section className="atmos-card border-[color:var(--atmos-accent)]/40 p-5">
        <h2 className="atmos-label mb-1.5 text-[color:var(--atmos-accent)]">
          Danger zone
        </h2>
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-[11.5px] leading-relaxed text-[color:var(--atmos-neutral)]">
            Decommissioning retires{" "}
            <span className="font-medium text-[color:var(--atmos-ink)]">
              {name || "this station"}
            </span>{" "}
            from the array. Historical readings are kept.
          </p>
          <button
            type="button"
            className="atmos-well-soft shrink-0 rounded-[12px] px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[color:var(--atmos-accent)] hover:text-[color:var(--atmos-alarm)]"
          >
            Decommission {stationId || "station"}
          </button>
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
    <li className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="text-[12px] font-medium">{label}</p>
        <p className="mt-0.5 text-[11px] text-[color:var(--atmos-neutral)]">
          {hint}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className="atmos-well-soft relative h-6 w-11 shrink-0 rounded-full"
      >
        <span
          className={[
            "absolute top-0.5 h-5 w-5 rounded-full shadow-[2px_2px_4px_rgba(160,155,140,0.6),-2px_-2px_4px_rgba(255,255,255,0.9)] transition-[left,background-color] duration-150",
            checked
              ? "left-[22px] bg-[color:var(--atmos-accent)]"
              : "left-0.5 bg-[color:var(--atmos-surface)]",
          ].join(" ")}
        />
      </button>
    </li>
  );
}
