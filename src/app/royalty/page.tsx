import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Frame, MessageSquareText } from "lucide-react";

export const metadata: Metadata = {
  title: "ViewFinder — commercial use & royalties",
  description:
    "ViewFinder is free for personal use. Commercial use carries a small royalty on the honor system — here's how to settle up.",
};

const ISSUE_URL =
  "https://github.com/StrategicUX/ViewFinder/issues/new?template=royalty.md&title=Royalty%3A+%5Byour+team%5D";

/**
 * The honor-system landing: linked from the repo's Sponsor button, the
 * README, and the LICENSE. One page that says what commercial use costs
 * and gives two one-click ways to start the handshake.
 */
export default function RoyaltyPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[color:var(--surface-stage)] px-5 py-10">
      <div className="w-full max-w-[520px]">
        <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <Frame size={20} strokeWidth={1.75} className="text-ink-title" />
        </div>
        <h1 className="text-center text-[22px] font-semibold tracking-tight text-ink-title">
          Using ViewFinder commercially?
        </h1>
        <p
          className="mx-auto mt-2 max-w-[440px] text-center text-[13.5px] leading-relaxed text-ink-body"
          style={{ textWrap: "balance" }}
        >
          ViewFinder is free for personal projects, education, and
          evaluation. If it becomes part of how your team delivers paid work
          — client reviews, design handoff, product process — it carries a
          royalty on the honor system.
        </p>

        <div className="mt-7 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-[13px] font-semibold text-ink-title">
            The deal, in full
          </p>
          <ul className="mt-2.5 space-y-1.5 text-[13px] leading-relaxed text-ink-body">
            <li>
              Suggested royalty: <strong>USD $49 per team, per year</strong>.
              If that number is wrong for your situation, pay what&apos;s
              fair — the point is the gesture, not the invoice.
            </li>
            <li>No license keys, no telemetry, nobody checking.</li>
            <li>
              A note about what you&apos;re using it for is worth as much as
              the money.
            </li>
          </ul>
        </div>

        <div className="mt-5 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
          <a
            href={ISSUE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-pill bg-[color:var(--btn-ink-bg)] px-5 text-[13.5px] font-semibold text-[color:var(--btn-ink-fg)] hover:bg-[color:var(--btn-ink-bg-hover)]"
          >
            <MessageSquareText size={14} strokeWidth={2} />
            Open a royalty issue
          </a>
          <a
            href="https://github.com/StrategicUX/ViewFinder"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-pill border border-border bg-card px-5 text-[13.5px] font-medium text-ink-body hover:bg-subtle"
          >
            <ExternalLink size={14} strokeWidth={2} />
            View the repo
          </a>
        </div>

        <p className="mt-6 text-center text-[11.5px] leading-relaxed text-ink-caption">
          The issue is the handshake — Rob replies with payment details.
          Prefer privacy? Reach Rob Simon on LinkedIn instead. Full terms
          in the{" "}
          <a
            href="https://github.com/StrategicUX/ViewFinder/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            LICENSE
          </a>
          .
        </p>

        <p className="mt-8 text-center">
          <Link
            href="/"
            className="text-[12px] font-medium text-ink-caption underline-offset-2 hover:underline"
          >
            ← Back to ViewFinder
          </Link>
        </p>
      </div>
    </div>
  );
}
