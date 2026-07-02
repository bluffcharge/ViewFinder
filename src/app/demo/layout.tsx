"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./aexis.css";

/**
 * Chrome for the built-in demo screens — a fictional plasma-core control
 * interface (AEXIS). These pages exist so the canvas has something to
 * frame before you point it at your own prototype. The .aexis theme is
 * scoped here and never touches the ViewFinder chrome.
 *
 * Width: full bleed per the kit — the container is a padded full-width
 * flex column at every breakpoint, so the desktop (1920) and wide (2560)
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
    <div className="aexis min-h-[100dvh] text-[10.4px] leading-[15.6px] tracking-[0.1em]">
      <nav className="sticky top-0 z-10 border-b border-[color:var(--ax-line)] bg-[#030303]/85 backdrop-blur-[12px]">
        <div className={`${CONTAINER} flex h-12 items-center gap-6`}>
          <span className="flex items-baseline gap-2">
            <span className="aexis-display text-[15px] tracking-[-0.025em]">
              AEXIS
            </span>
            <span className="aexis-label hidden sm:inline">Plasma core</span>
          </span>
          <div className="flex items-center gap-1 overflow-x-auto">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "aexis-label rounded-[1px] px-3 py-1.5 transition-colors duration-150",
                    active
                      ? "aexis-well text-[color:var(--ax-primary)]"
                      : "hover:text-[color:var(--ax-text)]",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
          <span className="aexis-label ml-auto hidden lg:inline">
            Demo screens — replace with your own prototype
          </span>
        </div>
      </nav>
      <div className={`${CONTAINER} py-8`}>{children}</div>
    </div>
  );
}
