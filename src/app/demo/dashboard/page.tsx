import { DEMO_ACTIVITY, DEMO_TASKS } from "@/app/demo/data";

export default function DemoDashboard() {
  const open = DEMO_TASKS.filter((t) => t.status !== "In review").length;
  const inReview = DEMO_TASKS.filter((t) => t.status === "In review").length;

  const kpis = [
    { label: "Open tasks", value: String(open) },
    { label: "In review", value: String(inReview) },
    { label: "Shipped this week", value: "2" },
    { label: "Blocked", value: "0" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[20px] font-semibold tracking-tight text-ink-title">
          Dashboard
        </h1>
        <p className="mt-1 text-[13px] text-ink-caption">
          Where the project stands right now.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-border bg-card px-4 py-3.5 shadow-sm"
          >
            <p className="t-mono-label">{k.label}</p>
            <p
              className={[
                "mt-1.5 text-[26px] font-semibold tabular-nums leading-none",
                k.label === "Blocked" && k.value !== "0"
                  ? "text-warn"
                  : "text-ink-title",
              ].join(" ")}
            >
              {k.value}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <header className="border-b border-border-subtle px-4 py-3">
            <h2 className="text-[13px] font-semibold text-ink-title">Tasks</h2>
          </header>

          {/* Table from tablet up; stacked cards below. */}
          <table className="hidden w-full text-left sm:table">
            <thead>
              <tr className="border-b border-border-subtle">
                {["ID", "Title", "Assignee", "Status", "Updated"].map((h) => (
                  <th key={h} className="t-mono-label px-4 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_TASKS.map((t) => (
                <tr key={t.id} className="border-b border-border-subtle last:border-0">
                  <td className="px-4 py-2.5 font-mono text-[11.5px] text-ink-caption">{t.id}</td>
                  <td className="px-4 py-2.5 text-[13px] font-medium text-ink-title">{t.title}</td>
                  <td className="px-4 py-2.5 text-[12.5px] text-ink-body">{t.assignee}</td>
                  <td className="px-4 py-2.5">
                    <StatusChip status={t.status} />
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-ink-caption">{t.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="divide-y divide-border-subtle sm:hidden">
            {DEMO_TASKS.map((t) => (
              <li key={t.id} className="space-y-1 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-ink-caption">{t.id}</span>
                  <StatusChip status={t.status} />
                </div>
                <p className="text-[13px] font-medium text-ink-title">{t.title}</p>
                <p className="text-[11.5px] text-ink-caption">
                  {t.assignee} · {t.updated}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="h-fit rounded-xl border border-border bg-card shadow-sm">
          <header className="border-b border-border-subtle px-4 py-3">
            <h2 className="text-[13px] font-semibold text-ink-title">
              Recent activity
            </h2>
          </header>
          <ul className="divide-y divide-border-subtle">
            {DEMO_ACTIVITY.map((a, i) => (
              <li key={i} className="px-4 py-3">
                <p className="text-[12.5px] leading-snug text-ink-body">
                  <span className="font-semibold text-ink-title">{a.who}</span>{" "}
                  {a.what}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-disabled">{a.when}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const tone =
    status === "In review"
      ? "bg-accent-soft text-ink-link"
      : status === "In progress"
      ? "bg-subtle text-ink-body"
      : "bg-subtle text-ink-caption";
  return (
    <span
      className={`inline-flex h-6 items-center rounded-pill px-2 text-[11px] font-semibold ${tone}`}
    >
      {status}
    </span>
  );
}
