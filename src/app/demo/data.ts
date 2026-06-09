export type DemoTask = {
  id: string;
  title: string;
  assignee: string;
  status: "Backlog" | "In progress" | "In review";
  priority: "High" | "Medium" | "Low";
  updated: string;
};

export const DEMO_TASKS: DemoTask[] = [
  { id: "ORB-214", title: "Empty state for the reports tab",        assignee: "Maya",   status: "In progress", priority: "High",   updated: "12m ago" },
  { id: "ORB-213", title: "Keyboard nav for the command palette",   assignee: "Jonas",  status: "In review",   priority: "High",   updated: "38m ago" },
  { id: "ORB-211", title: "Bulk archive from the list view",        assignee: "Priya",  status: "In progress", priority: "Medium", updated: "1h ago" },
  { id: "ORB-209", title: "Onboarding checklist copy pass",         assignee: "Sam",    status: "Backlog",     priority: "Low",    updated: "3h ago" },
  { id: "ORB-205", title: "Export board as CSV",                    assignee: "Maya",   status: "In review",   priority: "Medium", updated: "5h ago" },
  { id: "ORB-202", title: "Dark theme for embedded widgets",        assignee: "Jonas",  status: "Backlog",     priority: "Medium", updated: "1d ago" },
  { id: "ORB-198", title: "Slow query on the activity feed",        assignee: "Priya",  status: "In progress", priority: "High",   updated: "1d ago" },
  { id: "ORB-195", title: "Mobile filters sheet",                   assignee: "Sam",    status: "Backlog",     priority: "Low",    updated: "2d ago" },
];

export const DEMO_ACTIVITY = [
  { who: "Maya",  what: "moved ORB-213 to In review",        when: "38m ago" },
  { who: "Jonas", what: "commented on ORB-214",              when: "52m ago" },
  { who: "Priya", what: "opened ORB-198",                    when: "1d ago" },
  { who: "Sam",   what: "shipped ORB-190 — saved filters",   when: "1d ago" },
  { who: "Maya",  what: "shipped ORB-188 — new task dialog", when: "2d ago" },
  { who: "Jonas", what: "moved ORB-205 to In review",        when: "2d ago" },
];
