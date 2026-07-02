import { GRID } from "@/app/demo/data";

const MAX_MW = 360;

export default function DemoGrid() {
  const peak = GRID.reduce((a, b) => (b.demand > a.demand ? b : a));
  const headroom = Math.min(
    ...GRID.map((g) => g.output - g.demand)
  );

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="aexis-label">Demand vs core output — 24 h</p>
          <h1 className="aexis-display text-[30px] leading-[36px]">Grid</h1>
        </div>
        <p className="aexis-label">
          Peak {peak.demand} MW at {peak.hour}:00 ·{" "}
          {headroom < 0
            ? `capacitors cover ${-headroom} MW at peak`
            : `min headroom ${headroom} MW`}
        </p>
      </header>

      {/* Hour-by-hour chart: amber demand bars under a lime output trace. */}
      <section className="aexis-shell">
        <div className="aexis-card p-3">
          <div className="mb-3 flex items-center gap-5">
            <span className="aexis-label flex items-center gap-2">
              <span aria-hidden="true" className="h-1.5 w-3 bg-[color:var(--ax-primary)]" />
              Demand
            </span>
            <span className="aexis-label flex items-center gap-2">
              <span aria-hidden="true" className="h-[2px] w-3 bg-[color:var(--ax-tertiary)]" />
              Core output
            </span>
          </div>

          <div className="flex h-[240px] items-end gap-[3px] sm:gap-1">
            {GRID.map((g) => (
              <div
                key={g.hour}
                className="group relative flex h-full flex-1 flex-col justify-end"
                title={`${g.hour}:00 — demand ${g.demand} MW, output ${g.output} MW`}
              >
                {/* Output tick */}
                <div
                  aria-hidden="true"
                  className="absolute left-0 right-0 h-[2px] bg-[rgba(174,253,13,0.8)]"
                  style={{ bottom: `${(g.output / MAX_MW) * 100}%` }}
                />
                <div
                  className="rounded-t-[1px] bg-[rgba(245,158,11,0.7)] transition-colors duration-150 group-hover:bg-[#F59E0B]"
                  style={{ height: `${(g.demand / MAX_MW) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between">
            {["00", "06", "12", "18", "23"].map((h) => (
              <span key={h} className="aexis-label tabular-nums">
                {h}:00
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {[
          { label: "Delivered today", value: "5.9", unit: "GWh" },
          { label: "Capacitor charge", value: "82", unit: "%" },
          { label: "Nodes exporting", value: "6", unit: "of 8" },
          { label: "Curtailment", value: "0", unit: "events" },
        ].map((s) => (
          <div key={s.label} className="aexis-well px-3 py-3">
            <p className="aexis-label">{s.label}</p>
            <p className="mt-1.5 flex items-baseline gap-1.5">
              <span className="aexis-display text-[24px] leading-none">
                {s.value}
              </span>
              <span className="aexis-label">{s.unit}</span>
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
