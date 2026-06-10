import { NoiseBand } from "@/app/demo/NoiseBand";
import { EVENTS, READINGS } from "@/app/demo/data";

const KPIS = [
  { label: "PM2.5", value: "12.4", unit: "µg/m³" },
  { label: "CO₂", value: "421", unit: "ppm" },
  { label: "NO₂", value: "18", unit: "ppb" },
  { label: "O₃", value: "31", unit: "ppb" },
  { label: "Humidity", value: "64", unit: "%RH" },
  { label: "Pressure", value: "1013", unit: "hPa" },
];

export default function DemoConsole() {
  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="atmos-label">Sector 7 — coastal array</p>
          <h1 className="atmos-display mt-1 text-[26px] leading-none">
            Console
          </h1>
        </div>
        <p className="atmos-label">Updated 14:32:08 · 7 / 8 stations reporting</p>
      </header>

      {/* Hero — arched AQI gauge beside the live signal band. */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-[260px_1fr]">
        <div className="atmos-card atmos-arch flex flex-col items-center px-6 pb-6 pt-10 text-center">
          <p className="atmos-label">Air quality index</p>
          <p className="atmos-display mt-3 text-[72px] leading-[72px]">42</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#2A2A2A] px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.12em] text-[color:var(--atmos-mint)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[color:var(--atmos-mint)]" />
            Good
          </span>
          <p className="atmos-label mt-4">PM2.5 dominant · 12.4 µg/m³</p>
        </div>

        <div className="atmos-dark relative min-h-[260px] md:min-h-0">
          <NoiseBand className="absolute inset-0 rounded-[24px]" />
          <div className="pointer-events-none relative z-[1] flex h-full flex-col justify-between p-5">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.14em]">
              Live signal — particulate haze · 8 stations
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10.5px] uppercase tracking-[0.12em] text-[color:var(--atmos-mint-dim)]">
              <span>Feed · 2 Hz</span>
              <span>Drift · pointer</span>
              <span>Pulse · 0.3 rad/s</span>
              <span className="hidden sm:inline">Render · WebGL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Readout wells */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {KPIS.map((k) => (
          <div key={k.label} className="atmos-well px-4 py-3.5">
            <p className="atmos-label">{k.label}</p>
            <p className="mt-1.5 flex items-baseline gap-1.5">
              <span className="atmos-display text-[26px] leading-none">
                {k.value}
              </span>
              <span className="atmos-label normal-case tracking-[0.06em]">
                {k.unit}
              </span>
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px] min-[2240px]:grid-cols-[1fr_420px]">
        {/* Observations */}
        <section className="atmos-card overflow-hidden">
          <header className="border-b border-white/70 px-5 py-3.5">
            <h2 className="atmos-label">Observations — newest first</h2>
          </header>

          <table className="hidden w-full text-left sm:table">
            <thead>
              <tr className="border-b border-white/70">
                {["Time", "Station", "PM2.5", "CO₂", "Temp", "RH", "Flag"].map(
                  (h) => (
                    <th key={h} className="atmos-label px-5 py-2.5 font-medium">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {READINGS.map((r, i) => (
                <tr key={i} className="border-b border-white/40 last:border-0">
                  <td className="px-5 py-2.5 text-[11.5px] tabular-nums text-[color:var(--atmos-neutral)]">{r.time}</td>
                  <td className="px-5 py-2.5 text-[11.5px] font-medium">{r.station}</td>
                  <td className="px-5 py-2.5 text-[11.5px] tabular-nums">{r.pm25.toFixed(1)}</td>
                  <td className="px-5 py-2.5 text-[11.5px] tabular-nums">{r.co2}</td>
                  <td className="px-5 py-2.5 text-[11.5px] tabular-nums">{r.tempC.toFixed(1)}°C</td>
                  <td className="px-5 py-2.5 text-[11.5px] tabular-nums">{r.rh}%</td>
                  <td className="px-5 py-2.5">
                    {r.flagged && <FlagChip />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="divide-y divide-white/50 sm:hidden">
            {READINGS.map((r, i) => (
              <li key={i} className="space-y-1 px-5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11.5px] font-medium">{r.station}</span>
                  {r.flagged ? (
                    <FlagChip />
                  ) : (
                    <span className="atmos-label">{r.time}</span>
                  )}
                </div>
                <p className="text-[11px] tabular-nums text-[color:var(--atmos-neutral)]">
                  PM2.5 {r.pm25.toFixed(1)} · CO₂ {r.co2} · {r.tempC.toFixed(1)}°C · {r.rh}%
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Event log */}
        <section className="atmos-card h-fit overflow-hidden">
          <header className="border-b border-white/70 px-5 py-3.5">
            <h2 className="atmos-label">Event log</h2>
          </header>
          <ul className="divide-y divide-white/50">
            {EVENTS.map((e, i) => (
              <li key={i} className="flex gap-3 px-5 py-3">
                <span
                  aria-hidden="true"
                  className={[
                    "mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full",
                    e.kind === "alert"
                      ? "bg-[color:var(--atmos-accent)]"
                      : "bg-[color:var(--atmos-neutral)]",
                  ].join(" ")}
                />
                <div>
                  <p className="text-[11.5px] leading-snug">{e.what}</p>
                  <p className="atmos-label mt-0.5">
                    {e.when}
                    {e.kind === "alert" && " · alert"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function FlagChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--atmos-accent)]/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[color:var(--atmos-accent)]">
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[color:var(--atmos-accent)]" />
      Watch
    </span>
  );
}
