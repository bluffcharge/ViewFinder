import { PlasmaBlob } from "@/app/demo/PlasmaBlob";

const RING_LABELS = [
  { label: "Ignition", pos: "left-1/2 top-2 -translate-x-1/2" },
  { label: "Containment", pos: "right-[8%] top-[22%]" },
  { label: "Flux gate", pos: "right-[8%] bottom-[22%]" },
  { label: "Harmonix", pos: "left-1/2 bottom-10 -translate-x-1/2" },
  { label: "Thermal", pos: "left-[8%] bottom-[22%]" },
  { label: "Telemetry", pos: "left-[8%] top-[22%]" },
];

const STATS = [
  { label: "Resonance", value: "8.4", unit: "GHz" },
  { label: "Viscosity", value: "1.9", unit: "η" },
  { label: "Tension", value: "4.2", unit: "σ" },
  { label: "Core temp", value: "148", unit: "MK" },
];

export default function DemoSpecimen() {
  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="aexis-label">Quantum labs — live render</p>
          <h1 className="aexis-display text-[30px] leading-[36px]">
            Specimen IG-77
          </h1>
        </div>
        <p className="aexis-label">SDF WebGL · drag cursor to perturb plasma</p>
      </header>

      {/* Fullscreen-style specimen chamber with the orbital station ring. */}
      <section className="aexis-shell">
        <div className="aexis-card relative h-[52vh] min-h-[340px] overflow-hidden">
          <PlasmaBlob className="absolute inset-0" />
          {/* Orbital ring — a dotted ellipse with station labels. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[7%] rounded-[50%] border border-dashed border-white/10"
          />
          {RING_LABELS.map((s) => (
            <span
              key={s.label}
              className={`aexis-label pointer-events-none absolute z-[1] ${s.pos}`}
            >
              {s.label}
            </span>
          ))}
          <p className="aexis-label pointer-events-none absolute bottom-3 left-1/2 z-[1] -translate-x-1/2 text-[color:var(--ax-secondary)]">
            Core / Online — drag cursor to perturb plasma
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {STATS.map((s) => (
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
