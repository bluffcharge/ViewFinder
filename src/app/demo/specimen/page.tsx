import { DitherBlob } from "@/app/demo/DitherBlob";

const RING_LABELS = [
  { label: "Sampler", pos: "left-1/2 top-2 -translate-x-1/2" },
  { label: "Gradient", pos: "right-[8%] top-[22%]" },
  { label: "Threshold", pos: "right-[8%] bottom-[22%]" },
  { label: "Resolve", pos: "left-1/2 bottom-10 -translate-x-1/2" },
  { label: "Drift", pos: "left-[8%] bottom-[22%]" },
  { label: "Seed", pos: "left-[8%] top-[22%]" },
];

const STATS = [
  { label: "Points", value: "25,000", unit: "pts" },
  { label: "Grain", value: "2", unit: "px cell" },
  { label: "Reseed", value: "5", unit: "Hz" },
  { label: "Interference", value: "σ 4.2", unit: "pointer" },
];

export default function DemoSequence() {
  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="fe-label">Density sampling — live render</p>
          <h1 className="fe-display text-[30px] leading-[36px]">
            Sequence 01
          </h1>
        </div>
        <p className="fe-label">Seq 01 · 25,000 pts · resolved</p>
      </header>

      {/* Full-height chamber with the sampling ring. */}
      <section className="fe-shell">
        <div className="fe-card relative h-[52vh] min-h-[340px] overflow-hidden">
          <DitherBlob className="absolute inset-0" />
          {/* Sampling ring — a dashed ellipse with stage labels. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[7%] rounded-[50%] border border-dashed border-[rgba(15,23,42,0.25)]"
          />
          {RING_LABELS.map((s) => (
            <span
              key={s.label}
              className={`fe-label pointer-events-none absolute z-[1] ${s.pos}`}
            >
              {s.label}
            </span>
          ))}
          <p className="fe-label pointer-events-none absolute bottom-3 left-1/2 z-[1] -translate-x-1/2">
            Apply cursor interference — the form resolves from atmospheric
            drift
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="fe-well px-3 py-3">
            <p className="fe-label">{s.label}</p>
            <p className="mt-1.5 flex items-baseline gap-1.5">
              <span className="fe-display text-[24px] leading-none">
                {s.value}
              </span>
              <span className="fe-label">{s.unit}</span>
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
