import { CREW } from "@/app/demo/data";

const ROLE_STYLE: Record<string, string> = {
  Director: "border-[color:var(--ax-primary)]/60 text-[color:var(--ax-primary)]",
  Operator: "border-[color:var(--ax-secondary)]/50 text-[color:var(--ax-secondary)]",
  Maintenance: "border-[color:var(--ax-tertiary)]/40 text-[color:var(--ax-tertiary)]",
  Observer: "border-[color:var(--ax-line)] text-[color:var(--ax-text-dim)]",
};

export default function DemoAccess() {
  const active = CREW.filter((c) => c.active).length;

  return (
    <div className="max-w-[920px] space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="aexis-label">Crew roster — facility clearances</p>
          <h1 className="aexis-display text-[30px] leading-[36px]">Access</h1>
        </div>
        <p className="aexis-label">
          {active} of {CREW.length} badges active · clearances review quarterly
        </p>
      </header>

      <section className="aexis-shell">
        <div className="aexis-card overflow-hidden">
          <table className="hidden w-full text-left sm:table">
            <thead>
              <tr className="border-b border-[color:var(--ax-line)]">
                {["Name", "Handle", "Role", "Clearance", "Shift", "Badge"].map(
                  (h) => (
                    <th key={h} className="aexis-label px-3 py-2.5 font-normal">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {CREW.map((c) => (
                <tr
                  key={c.handle}
                  className="border-b border-[color:var(--ax-line)] last:border-0"
                >
                  <td className="px-3 py-2.5 text-[color:var(--ax-text)]">{c.name}</td>
                  <td className="px-3 py-2.5 text-[color:var(--ax-text-dim)]">@{c.handle}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${ROLE_STYLE[c.role]}`}
                    >
                      {c.role}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">{c.clearance}</td>
                  <td className="px-3 py-2.5">{c.shift}</td>
                  <td className="px-3 py-2.5">
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={[
                          "h-1.5 w-1.5 rounded-full",
                          c.active
                            ? "aexis-pulse bg-[color:var(--ax-tertiary)]"
                            : "bg-white/25",
                        ].join(" ")}
                      />
                      {c.active ? "Active" : "Suspended"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="divide-y divide-[color:var(--ax-line)] sm:hidden">
            {CREW.map((c) => (
              <li key={`m-${c.handle}`} className="space-y-1.5 px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[color:var(--ax-text)]">{c.name}</span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${ROLE_STYLE[c.role]}`}
                  >
                    {c.role}
                  </span>
                </div>
                <p className="aexis-label">
                  @{c.handle} · {c.clearance} · {c.shift} shift ·{" "}
                  {c.active ? "active" : "suspended"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="aexis-label">
        Clearance changes require Director sign-off and take effect at the
        next shift boundary.
      </p>
    </div>
  );
}
