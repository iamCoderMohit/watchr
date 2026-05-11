import HeroCams from "@/components/landing/HeroCams";
import Features from "@/components/landing/Features";
import FeatureGrid from "@/components/landing/FeatureGrid";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-end overflow-hidden pb-16">
        <HeroCams />

        {/* Headline — bottom left, fourmula style */}
        <div className="relative z-10 px-6 md:px-10 max-w-2xl">

          <p className="animate-fade-up-d1 text-[11px] uppercase tracking-widest
                        text-[var(--ink-muted)] mb-4">
            Watch together
          </p>

          <h1 className="animate-fade-up-d2 font-bold leading-[1.04] tracking-[-0.04em]
                         text-[clamp(42px,6vw,78px)] text-[var(--ink)]">
            Watch YouTube
            <br />
            <span className="text-[var(--ink-muted)]">
              with your friends, live.
            </span>
          </h1>

          <div className="animate-fade-up-d3 mt-8 flex flex-wrap items-center gap-4">
            <Button size="lg">Create a room →</Button>
            <span className="text-sm text-[var(--ink-muted)]">
              Free · No account needed to join
            </span>
          </div>
        </div>

        {/* Scroll hint */}
        <p className="absolute bottom-7 right-8 text-[10px] uppercase tracking-widest
                      text-[var(--ink-faint)]">
          Scroll down
        </p>
      </section>

      {/* ── Features ── */}
      <Features />

      {/* ── Pricing ── */}
      <FeatureGrid />

      {/* ── Footer ── */}
      <footer className="px-6 md:px-10 py-10 border-t border-[var(--border)]
                         flex items-center justify-between text-xs text-[var(--ink-faint)]">
        <span>watchr</span>
        <span>©2026</span>
      </footer>
    </main>
  );
}