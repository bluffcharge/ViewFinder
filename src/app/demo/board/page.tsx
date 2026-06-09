import { DEMO_TASKS, type DemoTask } from "@/app/demo/data";

const COLUMNS: DemoTask["status"][] = ["Backlog", "In progress", "In review"];

export default function DemoBoard() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[20px] font-semibold tracking-tight text-ink-title">
          Board
        </h1>
        <p className="mt-1 text-[13px] text-ink-caption">
          Tasks move left to right. Columns stack on phones.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const tasks = DEMO_TASKS.filter((t) => t.status === col);
          return (
            <section
              key={col}
              className="rounded-xl border border-border bg-[color:var(--surface-subtle)] p-3"
            >
              <header className="mb-2.5 flex items-center justify-between px-1">
                <h2 className="t-mono-label">{col}</h2>
                <span className="text-[11px] font-semibold tabular-nums text-ink-disabled">
                  {tasks.length}
                </span>
              </header>
              <ul className="space-y-2.5">
                {tasks.map((t) => (
                  <li
                    key={t.id}
                    className="rounded-lg border border-border bg-card px-3 py-2.5 shadow-xs"
                  >
                    <p className="text-[12.5px] font-medium leading-snug text-ink-title">
                      {t.title}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="inline-flex h-5 items-center gap-1.5 rounded-pill bg-subtle px-2 text-[10.5px] font-semibold text-ink-body">
                        {t.assignee}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className={[
                            "h-1.5 w-1.5 rounded-pill",
                            t.priority === "High"
                              ? "bg-error"
                              : t.priority === "Medium"
                              ? "bg-warn"
                              : "bg-zinc-400",
                          ].join(" ")}
                        />
                        <span className="text-[10.5px] font-medium text-ink-caption">
                          {t.priority}
                        </span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
