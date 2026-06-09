import {
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Tv,
  type LucideIcon,
} from "lucide-react";

export type Viewport = "phone" | "tablet" | "laptop" | "desktop" | "wide";

export type ViewportSpec = {
  width: number;
  height: number;
  label: string;
  shortLabel: string;
  Icon: LucideIcon;
  /** Device-style corner radius applied to the frame at native scale. */
  radius: number;
};

export const VIEWPORTS: Record<Viewport, ViewportSpec> = {
  phone:   { width: 390,  height: 844,  label: "Phone",   shortLabel: "iPhone 14",        Icon: Smartphone, radius: 44 },
  tablet:  { width: 820,  height: 1180, label: "Tablet",  shortLabel: "iPad Air",         Icon: Tablet,     radius: 28 },
  laptop:  { width: 1440, height: 900,  label: "Laptop",  shortLabel: "MacBook Pro 14\"", Icon: Laptop,     radius: 10 },
  desktop: { width: 1920, height: 1080, label: "Desktop", shortLabel: "1920 × 1080",      Icon: Monitor,    radius: 10 },
  wide:    { width: 2560, height: 1440, label: "Wide",    shortLabel: "27\" QHD",         Icon: Tv,         radius: 10 },
};

export const VIEWPORT_ORDER: Viewport[] = ["phone", "tablet", "laptop", "desktop", "wide"];
