import { STATIONS, type Station, type StationStatus } from "@/app/demo/data";

const COLUMNS: StationStatus[] = ["Online", "Calibrating", "Offline"];

export default function DemoStations() {
  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="atmos-label">Array health — all sectors</p>
          <h1 className="atmos-display mt-1 text-[26px] leading-none">
            Stations
          </h1>
        </div>
        <p className="atmos-label">8 deployed · columns stack on phones</p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const stations = STATIONS.filter((s) => s.status === col);
          return (
            <section key={col} className="atmos-well p-3.5">
              <header className="mb-3 flex items-center justify-between px-1">
                <h2 className="atmos-label flex items-center gap-2">
                  <StatusPip status={col} />
                  {col}
                </h2>
                <span className="atmos-display text-[15px] tabular-nums">
                  {stations.length}
                </span>
              </header>
              <ul className="space-y-3">
                {stations.map((s) => (
                  <StationCard key={s.id} station={s} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function StationCard({ station }: { station: Station }) {
  const offline = station.status === "Offline";
  return (
    <li className="atmos-card rounded-[16px] p-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="atmos-display text-[15px] font-normal">{station.name}</p>
        <span className="atmos-label">{station.id}</span>
      </div>
      <p className="atmos-label mt-1 normal-case tracking-[0.06em]">
        {station.region}
      </p>

      <div className="mt-3 flex items-center justify-between text-[11.5px] tabular-nums">
        <span className={offline ? "text-[color:var(--atmos-alarm)]" : ""}>
          {offline ? "No signal" : `AQI ${station.aqi}`}
        </span>
        <span className="text-[color:var(--atmos-neutral)]">
          sync {station.lastSync}
        </span>
      </div>

      {/* Uptime track */}
      <div className="mt-2.5">
        <div className="atmos-well-soft h-2.5 overflow-hidden rounded-full">
          <div
            className={[
              "h-full rounded-full",
              offline
                ? "bg-[color:var(--atmos-alarm)]/70"
                : station.status === "Calibrating"
                ? "bg-[color:var(--atmos-neutral)]/70"
                : "bg-[color:var(--atmos-signal)]",
            ].join(" ")}
            style={{ width: `${station.uptime}%` }}
          />
        </div>
        <p className="atmos-label mt-1.5">Uptime {station.uptime.toFixed(1)}%</p>
      </div>
    </li>
  );
}

function StatusPip({ status }: { status: StationStatus }) {
  const cls =
    status === "Online"
      ? "bg-[color:var(--atmos-signal)]"
      : status === "Calibrating"
      ? "bg-[color:var(--atmos-neutral)]"
      : "bg-[color:var(--atmos-alarm)]";
  return (
    <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${cls}`} />
  );
}
