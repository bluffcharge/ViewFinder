import { DitherBlob } from "@/app/demo/DitherBlob";
import { EVENTS, READINGS } from "@/app/demo/data";

const KPIS = [
  { label: "Density", value: "1.24", unit: "×10²⁰ m⁻³" },
  { label: "Ion temp", value: "12.1", unit: "keV" },
  { label: "Field", value: "5.2", unit: "T" },
  { label: "Confinement", value: "640", unit: "ms" },
  { label: "Net output", value: "312", unit: "MW" },
  { label: "Q factor", value: "1.8", unit: "ratio" },
];

export default function DemoConsole() {
  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="fe-label">Ring A — containment lattice</p>
          <h1 className="fe-display text-[30px] leading-[36px]">Core</h1>
        </div>
        <p className="fe-label">Updated 14:32:08 · 7 / 8 nodes reporting</p>
      </header>

      {/* Hero — output gauge beside the live plasma field. */}
      <section className="grid grid-cols-1 gap-2 md:grid-cols-[260px_1fr]">
        <div className="fe-shell">
          <div className="fe-card flex h-full flex-col items-center px-3 py-8 text-center">
            <p className="fe-label">Core output</p>
            <p className="fe-display mt-3 text-[64px] leading-[64px]">312</p>
            <span className="fe-glow mt-4 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--fe-primary)]/60 px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-[color:var(--fe-primary)]">
              <span
                aria-hidden="true"
                className="fe-pulse h-1.5 w-1.5 rounded-full bg-[color:var(--fe-primary)]"
              />
              Nominal
            </span>
            <p className="fe-label mt-4">Megawatts net · Q 1.8 sustained</p>
          </div>
        </div>

        <div className="fe-shell">
          <div className="fe-card relative min-h-[260px] overflow-hidden md:min-h-0 md:h-full">
            <DitherBlob className="absolute inset-0" />
            <div className="pointer-events-none absolute inset-0 z-[1] flex flex-col justify-between p-3">
              <p className="fe-label">
                Seq 01 — apply cursor interference
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {["Grid · dot matrix", "Interference · pointer", "Pulse · slow breathe", "Render · stochastic dither"].map(
                  (s, i) => (
                    <span
                      key={s}
                      className={`fe-label ${i === 3 ? "hidden sm:inline" : ""}`}
                    >
                      {s}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Readout wells */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {KPIS.map((k) => (
          <div key={k.label} className="fe-well px-3 py-3">
            <p className="fe-label">{k.label}</p>
            <p className="mt-1.5 flex items-baseline gap-1.5">
              <span className="fe-display text-[24px] leading-none">
                {k.value}
              </span>
              <span className="fe-label">{k.unit}</span>
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-2 xl:grid-cols-[1fr_340px] min-[2240px]:grid-cols-[1fr_420px]">
        {/* Telemetry */}
        <section className="fe-shell">
          <div className="fe-card overflow-hidden">
            <header className="border-b border-[color:var(--fe-line)] px-3 py-3">
              <h2 className="fe-label">Telemetry — newest first</h2>
            </header>

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
                {READINGS.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b border-[color:var(--fe-line)] last:border-0"
                  >
                    <td className="px-3 py-2.5 tabular-nums text-[color:var(--fe-text-dim)]">{r.time}</td>
                    <td className="px-3 py-2.5 text-[color:var(--fe-text)]">{r.node}</td>
                    <td className="px-3 py-2.5 tabular-nums">{r.density.toFixed(2)}</td>
                    <td className="px-3 py-2.5 tabular-nums">{r.tempKeV.toFixed(1)} keV</td>
                    <td className="px-3 py-2.5 tabular-nums">{r.fieldT.toFixed(1)} T</td>
                    <td className="px-3 py-2.5 tabular-nums">{r.confMs} ms</td>
                    <td className="px-3 py-2.5">{r.flagged && <FlagChip />}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="divide-y divide-[color:var(--fe-line)] sm:hidden">
              {READINGS.map((r, i) => (
                <li key={i} className="space-y-1 px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[color:var(--fe-text)]">{r.node}</span>
                    {r.flagged ? (
                      <FlagChip />
                    ) : (
                      <span className="fe-label">{r.time}</span>
                    )}
                  </div>
                  <p className="tabular-nums text-[color:var(--fe-text-dim)]">
                    n {r.density.toFixed(2)} · {r.tempKeV.toFixed(1)} keV ·{" "}
                    {r.fieldT.toFixed(1)} T · {r.confMs} ms
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Event log */}
        <section className="fe-shell h-fit">
          <div className="fe-card overflow-hidden">
            <header className="border-b border-[color:var(--fe-line)] px-3 py-3">
              <h2 className="fe-label">Event log</h2>
            </header>
            <ul className="divide-y divide-[color:var(--fe-line)]">
              {EVENTS.map((e, i) => (
                <li key={i} className="flex gap-3 px-3 py-3">
                  <span
                    aria-hidden="true"
                    className={[
                      "mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full",
                      e.kind === "alert"
                        ? "bg-[color:var(--fe-primary)]"
                        : "bg-[color:var(--fe-text-dim)]",
                    ].join(" ")}
                  />
                  <div>
                    <p className="leading-snug text-[color:var(--fe-text)]">
                      {e.what}
                    </p>
                    <p className="fe-label mt-0.5">
                      {e.when}
                      {e.kind === "alert" && " · alert"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function FlagChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--fe-primary)]/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-[color:var(--fe-primary)]">
      <span
        aria-hidden="true"
        className="h-1 w-1 rounded-full bg-[color:var(--fe-primary)]"
      />
      Watch
    </span>
  );
}
