export type StationStatus = "Online" | "Calibrating" | "Offline";

export type Station = {
  id: string;
  name: string;
  region: string;
  status: StationStatus;
  aqi: number;
  uptime: number; // percent
  lastSync: string;
};

export const STATIONS: Station[] = [
  { id: "ATM-01", name: "Harbor Mast",    region: "Coastal · Sector 7",  status: "Online",      aqi: 38, uptime: 99.2, lastSync: "12s ago" },
  { id: "ATM-02", name: "Ridge Relay",    region: "Highland · Sector 2", status: "Online",      aqi: 31, uptime: 98.7, lastSync: "31s ago" },
  { id: "ATM-03", name: "Quarry Edge",    region: "Inland · Sector 4",   status: "Calibrating", aqi: 47, uptime: 96.4, lastSync: "4m ago" },
  { id: "ATM-04", name: "Delta Pier",     region: "Coastal · Sector 7",  status: "Online",      aqi: 42, uptime: 99.8, lastSync: "8s ago" },
  { id: "ATM-05", name: "Mill District",  region: "Urban · Sector 1",    status: "Online",      aqi: 58, uptime: 97.1, lastSync: "22s ago" },
  { id: "ATM-06", name: "Old Granary",    region: "Inland · Sector 4",   status: "Calibrating", aqi: 44, uptime: 91.3, lastSync: "11m ago" },
  { id: "ATM-07", name: "North Spur",     region: "Highland · Sector 2", status: "Offline",     aqi: 0,  uptime: 62.8, lastSync: "3h ago" },
  { id: "ATM-08", name: "Ferry Landing",  region: "Coastal · Sector 7",  status: "Offline",     aqi: 0,  uptime: 71.5, lastSync: "1d ago" },
];

export type Reading = {
  time: string;
  station: string;
  pm25: number;   // µg/m³
  co2: number;    // ppm
  tempC: number;
  rh: number;     // percent
  flagged?: boolean;
};

export const READINGS: Reading[] = [
  { time: "14:32:08", station: "ATM-04", pm25: 12.4, co2: 421, tempC: 19.2, rh: 64 },
  { time: "14:32:01", station: "ATM-01", pm25: 11.8, co2: 418, tempC: 18.9, rh: 66 },
  { time: "14:31:54", station: "ATM-05", pm25: 23.6, co2: 446, tempC: 21.4, rh: 58, flagged: true },
  { time: "14:31:47", station: "ATM-02", pm25: 8.2,  co2: 409, tempC: 16.1, rh: 71 },
  { time: "14:31:39", station: "ATM-03", pm25: 15.1, co2: 428, tempC: 20.3, rh: 61 },
  { time: "14:31:30", station: "ATM-04", pm25: 12.6, co2: 422, tempC: 19.2, rh: 64 },
  { time: "14:31:22", station: "ATM-01", pm25: 11.9, co2: 419, tempC: 18.9, rh: 65 },
  { time: "14:31:15", station: "ATM-05", pm25: 24.1, co2: 449, tempC: 21.5, rh: 57, flagged: true },
  { time: "14:31:08", station: "ATM-06", pm25: 14.7, co2: 426, tempC: 20.1, rh: 62 },
];

export const EVENTS = [
  { when: "14:18", what: "ATM-05 crossed the PM2.5 watch threshold (> 20 µg/m³)", kind: "alert" as const },
  { when: "13:51", what: "ATM-03 entered scheduled calibration — back in ~40 min", kind: "info" as const },
  { when: "12:46", what: "ATM-06 humidity sensor recalibrated, drift corrected", kind: "info" as const },
  { when: "11:20", what: "ATM-07 missed three sync windows — marked offline", kind: "alert" as const },
  { when: "09:02", what: "Daily array sweep completed: 7 of 8 stations reporting", kind: "info" as const },
  { when: "08:00", what: "Sector 7 forecast ingested — onshore wind after 15:00", kind: "info" as const },
];
