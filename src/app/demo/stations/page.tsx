import { NODES, type CoreNode, type NodeStatus } from "@/app/demo/data";

const COLUMNS: NodeStatus[] = ["Stable", "Tuning", "Offline"];

export default function DemoNodes() {
  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="aexis-label">Lattice health — all rings</p>
          <h1 className="aexis-display text-[30px] leading-[36px]">Nodes</h1>
        </div>
        <p className="aexis-label">8 deployed · columns stack on phones</p>
      </header>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const nodes = NODES.filter((n) => n.status === col);
          return (
            <section key={col} className="aexis-well p-2">
              <header className="mb-2 flex items-center justify-between px-1 py-1">
                <h2 className="aexis-label flex items-center gap-2">
                  <StatusPip status={col} />
                  {col}
                </h2>
                <span className="aexis-display text-[15px] tabular-nums">
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
    <li className="aexis-shell">
      <div className="aexis-card p-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="aexis-display text-[15px] font-semibold tracking-[-0.025em]">
            {node.name}
          </p>
          <span className="aexis-label">{node.id}</span>
        </div>
        <p className="aexis-label mt-0.5">{node.region}</p>

        <div className="mt-3 flex items-center justify-between tabular-nums">
          <span
            className={
              offline
                ? "uppercase text-[color:var(--ax-text-dim)]"
                : "uppercase text-[color:var(--ax-text)]"
            }
          >
            {offline ? "No signal" : `Flux ${node.flux} MW`}
          </span>
          <span className="aexis-label">sync {node.lastSync}</span>
        </div>

        {/* Uptime track */}
        <div className="mt-2">
          <div className="aexis-well h-1.5 overflow-hidden rounded-full border-0 bg-white/[0.06]">
            <div
              className={[
                "h-full rounded-full",
                offline
                  ? "bg-white/25"
                  : node.status === "Tuning"
                  ? "bg-[color:var(--ax-secondary)]"
                  : "bg-[color:var(--ax-tertiary)]",
              ].join(" ")}
              style={{ width: `${node.uptime}%` }}
            />
          </div>
          <p className="aexis-label mt-1.5">Uptime {node.uptime.toFixed(1)}%</p>
        </div>
      </div>
    </li>
  );
}

function StatusPip({ status }: { status: NodeStatus }) {
  const cls =
    status === "Stable"
      ? "aexis-pulse bg-[color:var(--ax-tertiary)]"
      : status === "Tuning"
      ? "bg-[color:var(--ax-secondary)]"
      : "bg-white/30";
  return (
    <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${cls}`} />
  );
}
