"use client";

import { useState } from "react";

export default function DemoSettings() {
  const [name, setName] = useState("Orbit");
  const [key, setKey] = useState("ORB");
  const [notify, setNotify] = useState({
    mentions: true,
    statusChanges: true,
    digests: false,
  });

  return (
    <div className="max-w-[560px] space-y-6">
      <header>
        <h1 className="text-[20px] font-semibold tracking-tight text-ink-title">
          Settings
        </h1>
        <p className="mt-1 text-[13px] text-ink-caption">
          Project configuration. Toggles save immediately.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h2 className="t-mono-label mb-3">Project</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px]">
          <label className="block">
            <span className="text-[12px] font-medium text-ink-body">
              Display name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 h-9 w-full rounded-[12px] border border-border bg-canvas px-3 text-[13px] text-ink-body"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-medium text-ink-body">Key</span>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onBlur={() => setKey((k) => k.toUpperCase())}
              className="mt-1.5 h-9 w-full rounded-[12px] border border-border bg-canvas px-3 font-mono text-[13px] uppercase text-ink-body"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h2 className="t-mono-label mb-1.5">Notifications</h2>
        <ul className="divide-y divide-border-subtle">
          <Toggle
            label="Mentions"
            hint="Someone @-mentions you in a comment."
            checked={notify.mentions}
            onChange={(v) => setNotify((n) => ({ ...n, mentions: v }))}
          />
          <Toggle
            label="Status changes"
            hint="A task you're assigned to moves columns."
            checked={notify.statusChanges}
            onChange={(v) => setNotify((n) => ({ ...n, statusChanges: v }))}
          />
          <Toggle
            label="Weekly digest"
            hint="A summary every Monday morning."
            checked={notify.digests}
            onChange={(v) => setNotify((n) => ({ ...n, digests: v }))}
          />
        </ul>
      </section>

      <section className="rounded-xl border border-error/30 bg-card p-4 shadow-sm">
        <h2 className="t-mono-label mb-1.5 text-error">Danger zone</h2>
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-[12.5px] leading-relaxed text-ink-body">
            Archiving hides <span className="font-semibold">{name || "this project"}</span>{" "}
            from every member. Tasks are kept and restorable.
          </p>
          <button
            type="button"
            className="inline-flex h-8 shrink-0 items-center rounded-[12px] border border-error/40 px-3 text-[12px] font-semibold text-error hover:bg-error/5"
          >
            Archive {name || "project"}
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
    <li className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-[13px] font-medium text-ink-title">{label}</p>
        <p className="mt-0.5 text-[11.5px] text-ink-caption">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={[
          "relative h-6 w-10 shrink-0 rounded-pill transition-colors duration-fast ease-snap",
          checked ? "bg-accent" : "bg-zinc-300 dark:bg-zinc-600",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-5 w-5 rounded-pill bg-white shadow-sm transition-[left] duration-fast ease-snap",
            checked ? "left-[18px]" : "left-0.5",
          ].join(" ")}
        />
      </button>
    </li>
  );
}
