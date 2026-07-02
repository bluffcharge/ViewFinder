export type NodeStatus = "Stable" | "Tuning" | "Offline";

export type CoreNode = {
  id: string;
  name: string;
  region: string;
  status: NodeStatus;
  flux: number; // megawatt output
  uptime: number; // percent
  lastSync: string;
};

export const NODES: CoreNode[] = [
  { id: "AX-01", name: "Torus Alpha",    region: "Ring A · Bay 7",  status: "Stable",  flux: 38, uptime: 99.2, lastSync: "12s ago" },
  { id: "AX-02", name: "Torus Beta",     region: "Ring A · Bay 2",  status: "Stable",  flux: 31, uptime: 98.7, lastSync: "31s ago" },
  { id: "AX-03", name: "Injector North", region: "Ring B · Bay 4",  status: "Tuning",  flux: 47, uptime: 96.4, lastSync: "4m ago" },
  { id: "AX-04", name: "Torus Gamma",    region: "Ring A · Bay 7",  status: "Stable",  flux: 42, uptime: 99.8, lastSync: "8s ago" },
  { id: "AX-05", name: "Divertor Hub",   region: "Core · Bay 1",    status: "Stable",  flux: 58, uptime: 97.1, lastSync: "22s ago" },
  { id: "AX-06", name: "Injector South", region: "Ring B · Bay 4",  status: "Tuning",  flux: 44, uptime: 91.3, lastSync: "11m ago" },
  { id: "AX-07", name: "Relay Spur",     region: "Ring A · Bay 2",  status: "Offline", flux: 0,  uptime: 62.8, lastSync: "3h ago" },
  { id: "AX-08", name: "Capacitor Row",  region: "Ring B · Bay 6",  status: "Offline", flux: 0,  uptime: 71.5, lastSync: "1d ago" },
];

export type Reading = {
  time: string;
  node: string;
  density: number; // 10²⁰ m⁻³
  tempKeV: number; // keV
  fieldT: number;  // tesla
  confMs: number;  // confinement, ms
  flagged?: boolean;
};

export const READINGS: Reading[] = [
  { time: "14:32:08", node: "AX-04", density: 1.24, tempKeV: 12.1, fieldT: 5.2, confMs: 640 },
  { time: "14:32:01", node: "AX-01", density: 1.18, tempKeV: 11.8, fieldT: 5.1, confMs: 655 },
  { time: "14:31:54", node: "AX-05", density: 2.36, tempKeV: 14.6, fieldT: 5.8, confMs: 581, flagged: true },
  { time: "14:31:47", node: "AX-02", density: 0.82, tempKeV: 10.9, fieldT: 4.9, confMs: 712 },
  { time: "14:31:39", node: "AX-03", density: 1.51, tempKeV: 12.8, fieldT: 5.3, confMs: 610 },
  { time: "14:31:30", node: "AX-04", density: 1.26, tempKeV: 12.2, fieldT: 5.2, confMs: 641 },
  { time: "14:31:22", node: "AX-01", density: 1.19, tempKeV: 11.9, fieldT: 5.1, confMs: 653 },
  { time: "14:31:15", node: "AX-05", density: 2.41, tempKeV: 14.9, fieldT: 5.9, confMs: 574, flagged: true },
  { time: "14:31:08", node: "AX-06", density: 1.47, tempKeV: 12.6, fieldT: 5.3, confMs: 618 },
];

export const EVENTS = [
  { when: "14:18", what: "AX-05 crossed the density watch threshold (> 2.0 ×10²⁰ m⁻³)", kind: "alert" as const },
  { when: "13:51", what: "AX-03 entered scheduled field tuning — back in ~40 min", kind: "info" as const },
  { when: "12:46", what: "AX-06 magnetics recalibrated, drift corrected", kind: "info" as const },
  { when: "11:20", what: "AX-07 missed three sync windows — marked offline", kind: "alert" as const },
  { when: "09:02", what: "Daily lattice sweep completed: 7 of 8 nodes reporting", kind: "info" as const },
  { when: "08:00", what: "Grid demand curve ingested — peak draw expected after 15:00", kind: "info" as const },
];
