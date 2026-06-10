"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./atmos.css";

const display = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--atmos-font-display",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--atmos-font-mono",
});

/**
 * Chrome for the built-in demo screens — a fictional atmospheric data
 * console. These pages exist so the canvas has something to frame
 * before you point it at your own prototype. The .atmos theme is scoped
 * here and never touches the ViewFinder chrome.
 *
 * Width: full-bleed-ish per the kit. The container opens up with the
 * viewport so the desktop (1920) and wide (2560) canvas breakpoints
 * actually use the horizontal real estate instead of a fixed column.
 */
const CONTAINER =
  "mx-auto w-full px-5 sm:px-6 max-w-[1200px] 2xl:max-w-[82%] min-[2240px]:max-w-[90%]";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const links = [
    { href: "/demo/console", label: "Console" },
    { href: "/demo/stations", label: "Stations" },
    { href: "/demo/settings", label: "Settings" },
  ];
  return (
    <div
      className={`atmos ${display.variable} ${mono.variable} min-h-[100dvh] text-[12px] leading-relaxed`}
    >
      <nav className="sticky top-0 z-10 border-b border-white/60 bg-[color:var(--atmos-bg)]/90 backdrop-blur-[8px]">
        <div className={`${CONTAINER} flex h-14 items-center gap-6`}>
          <span className="flex items-baseline gap-2">
            <span className="atmos-display text-[17px] font-normal tracking-tight">
              ATMOS
            </span>
            <span className="atmos-label hidden sm:inline">Data console</span>
          </span>
          <div className="flex items-center gap-2">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "rounded-[10px] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors duration-150",
                    active
                      ? "atmos-well text-[color:var(--atmos-accent)]"
                      : "text-[color:var(--atmos-neutral)] hover:text-[color:var(--atmos-ink)]",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
          <span className="atmos-label ml-auto hidden lg:inline">
            Demo screens — replace with your own prototype
          </span>
        </div>
      </nav>
      <div className={`${CONTAINER} py-6`}>{children}</div>
    </div>
  );
}
