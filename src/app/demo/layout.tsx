"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Orbit } from "lucide-react";

/**
 * Chrome for the built-in demo screens — a tiny fictional project
 * tracker. These pages exist so the canvas has something to frame
 * before you point it at your own prototype.
 */
export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const links = [
    { href: "/demo/dashboard", label: "Dashboard" },
    { href: "/demo/board", label: "Board" },
    { href: "/demo/settings", label: "Settings" },
  ];
  return (
    <div className="min-h-[100dvh] bg-canvas">
      <nav className="sticky top-0 z-10 border-b border-border-subtle bg-canvas/90 backdrop-blur-[8px]">
        <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center gap-6 px-5">
          <span className="flex items-center gap-2 text-[14px] font-semibold text-ink-title">
            <Orbit size={16} strokeWidth={2} className="text-accent" />
            Orbit
          </span>
          <div className="flex items-center gap-1">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "rounded-pill px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                    active
                      ? "bg-subtle text-ink-title"
                      : "text-ink-caption hover:bg-subtle hover:text-ink-body",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
          <span className="ml-auto hidden text-[11px] text-ink-disabled sm:inline">
            Demo screens — replace with your own prototype
          </span>
        </div>
      </nav>
      <div className="mx-auto w-full max-w-[1280px] px-5 py-6">{children}</div>
    </div>
  );
}
