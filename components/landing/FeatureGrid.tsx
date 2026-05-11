import UpgradeButton from "./UpgradeButton";
import Link from "next/link";

const FREE_FEATURES = [
  "Up to 4 people per room",
  "YouTube sync",
  "Voice & video chat",
  "Emoji reactions",
];

const PRO_FEATURES = [
  "Up to 15 people per room",
  "Persistent room links",
  "Video queue",
  "Everything in Free",
];

export default function FeatureGrid() {
  return (
    <section className="px-6 md:px-10 py-24 max-w-3xl mx-auto">

      <p className="text-xs uppercase tracking-widest text-[var(--ink-faint)] mb-10">
        Pricing
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px
                      border border-[var(--border)] rounded-2xl overflow-hidden">

        {/* Free */}
        <div className="flex flex-col gap-6 p-8 bg-[var(--bg)]
                        hover:bg-[var(--bg-muted)] transition-colors duration-200">
          <span className="self-start text-[11px] font-semibold tracking-widest
                           uppercase rounded-full px-3 py-1
                           bg-[var(--bg-muted)] text-[var(--ink-muted)]">
            Free
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-4xl font-bold tracking-tight text-[var(--ink)]">₹0</span>
            <span className="text-xs text-[var(--ink-faint)]">forever</span>
          </div>
          <ul className="flex flex-col gap-2.5 flex-1">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-[var(--ink-muted)]">
                <span className="mt-0.5 text-[var(--ink-faint)]">✓</span>{f}
              </li>
            ))}
          </ul>
          <Link
            href="/sign-up"
            className="w-full rounded-full py-3 text-sm font-semibold tracking-tight
                       text-center border border-[var(--border)] text-[var(--ink)]
                       hover:bg-[var(--bg-muted)] transition-colors"
          >
            Get started
          </Link>
        </div>

        {/* Pro */}
        <div className="flex flex-col gap-6 p-8 bg-[var(--bg)]
                        border-l border-[var(--border)]
                        hover:bg-[var(--bg-muted)] transition-colors duration-200">
          <span className="self-start text-[11px] font-semibold tracking-widest
                           uppercase rounded-full px-3 py-1
                           bg-[var(--cta-bg)] text-[var(--cta-fg)]">
            Pro
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-4xl font-bold tracking-tight text-[var(--ink)]">₹500</span>
            <span className="text-xs text-[var(--ink-faint)]">per month</span>
          </div>
          <ul className="flex flex-col gap-2.5 flex-1">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-[var(--ink-muted)]">
                <span className="mt-0.5 text-[var(--ink)]">✓</span>{f}
              </li>
            ))}
          </ul>
          <UpgradeButton />
        </div>

      </div>
    </section>
  );
}