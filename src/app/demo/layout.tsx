"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./dither.css";

/**
 * Chrome for the built-in demo screens — a fictional form-engine console
 * (Stochastic Dither). These pages exist so the canvas has something to
 * frame before you point it at your own prototype. The .fe theme is
 * scoped here and never touches the ViewFinder chrome.
 *
 * Width: full bleed per the kit — the container is a padded full-width
 * grid at every breakpoint, so the desktop (1920) and wide (2560)
 * canvas viewports use the horizontal real estate.
 */
const CONTAINER = "w-full px-5 sm:px-8 min-[1920px]:px-12";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const links = [
    { href: "/demo/console", label: "Core" },
    { href: "/demo/specimen", label: "Specimen" },
    { href: "/demo/stations", label: "Nodes" },
    { href: "/demo/telemetry", label: "Telemetry" },
    { href: "/demo/alerts", label: "Alerts" },
    { href: "/demo/grid", label: "Grid" },
    { href: "/demo/access", label: "Access" },
    { href: "/demo/settings", label: "Config" },
  ];
  return (
    <div className="fe min-h-[100dvh] text-[14px] leading-[22.75px] tracking-[-0.025em]">
      <nav className="sticky top-0 z-10 border-b border-[color:var(--fe-line)] bg-[#EFEFF5]/85 backdrop-blur-[12px]">
        <div className={`${CONTAINER} flex h-12 items-center gap-6`}>
          <span className="flex shrink-0 items-baseline gap-2 whitespace-nowrap">
            <span className="fe-display text-[15px] tracking-[-0.025em]">
              Form Engine
            </span>
            <span className="fe-label hidden xl:inline">Stochastic dither</span>
          </span>
          <div className="flex items-center gap-1 overflow-x-auto">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "fe-label rounded-[2px] px-3 py-1.5 transition-colors duration-150",
                    active
                      ? "fe-well text-[color:var(--fe-primary)]"
                      : "hover:text-[color:var(--fe-text)]",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
          <span className="fe-label ml-auto hidden shrink-0 whitespace-nowrap min-[1400px]:inline">
            Demo screens — replace with your own prototype
          </span>
        </div>
      </nav>
      <div className={`${CONTAINER} py-8`}>{children}</div>
    </div>
  );
}
