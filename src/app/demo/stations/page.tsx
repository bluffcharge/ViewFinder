import { NODES, type CoreNode, type NodeStatus } from "@/app/demo/data";

const COLUMNS: NodeStatus[] = ["Stable", "Tuning", "Offline"];

export default function DemoNodes() {
  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="fe-label">Lattice health — all rings</p>
          <h1 className="fe-display text-[30px] leading-[36px]">Nodes</h1>
        </div>
        <p className="fe-label">8 deployed · columns stack on phones</p>
      </header>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const nodes = NODES.filter((n) => n.status === col);
          return (
            <section key={col} className="fe-well p-2">
              <header className="mb-2 flex items-center justify-between px-1 py-1">
                <h2 className="fe-label flex items-center gap-2">
                  <StatusPip status={col} />
                  {col}
                </h2>
                <span className="fe-display text-[15px] tabular-nums">
                  {nodes.length}
                </span>
              </header>
              <ul className="space-y-2">
                {nodes.map((n) => (
                  <NodeCard key={n.id} node={n} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function NodeCard({ node }: { node: CoreNode }) {
  const offline = node.status === "Offline";
  return (
    <li className="fe-shell">
      <div className="fe-card p-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="fe-display text-[15px] font-semibold tracking-[-0.025em]">
            {node.name}
          </p>
          <span className="fe-label">{node.id}</span>
        </div>
        <p className="fe-label mt-0.5">{node.region}</p>

        <div className="mt-3 flex items-center justify-between tabular-nums">
          <span
            className={
              offline
                ? "uppercase text-[color:var(--fe-text-dim)]"
                : "uppercase text-[color:var(--fe-text)]"
            }
          >
            {offline ? "No signal" : `Flux ${node.flux} MW`}
          </span>
          <span className="fe-label">sync {node.lastSync}</span>
        </div>

        {/* Uptime track */}
        <div className="mt-2">
          <div className="fe-well h-1.5 overflow-hidden rounded-full border-0 bg-[rgba(15,23,42,0.08)]">
            <div
              className={[
                "h-full rounded-full",
                offline
                  ? "bg-[rgba(15,23,42,0.2)]"
                  : node.status === "Tuning"
                  ? "bg-[color:var(--fe-secondary)]"
                  : "bg-[color:var(--fe-tertiary)]",
              ].join(" ")}
              style={{ width: `${node.uptime}%` }}
            />
          </div>
          <p className="fe-label mt-1.5">Uptime {node.uptime.toFixed(1)}%</p>
        </div>
      </div>
    </li>
  );
}

function StatusPip({ status }: { status: NodeStatus }) {
  const cls =
    status === "Stable"
      ? "fe-pulse bg-[color:var(--fe-tertiary)]"
      : status === "Tuning"
      ? "bg-[color:var(--fe-secondary)]"
      : "bg-[rgba(15,23,42,0.2)]";
  return (
    <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${cls}`} />
  );
}
