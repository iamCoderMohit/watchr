const FEATURES = [
  {
    title: "Synced playback",
    desc: "Host plays, pauses, or seeks — everyone follows instantly. No drift.",
    tag: "Free",
  },
  {
    title: "Voice & video",
    desc: "Floating webcam grid so you can see reactions as they happen.",
    tag: "Free",
  },
  {
    title: "Emoji reactions",
    desc: "React with emojis that fly across the screen in the moment.",
    tag: "Free",
  },
  {
    title: "Persistent rooms",
    desc: "Save your room link. Your crew can rejoin anytime, no setup.",
    tag: "Pro",
  },
];

const tagStyles: Record<string, string> = {
  Free: "bg-[var(--bg-muted)] text-[var(--ink-muted)]",
  Pro:  "bg-[var(--cta-bg)]  text-[var(--cta-fg)]",
};

export default function FeatureGrid() {
  return (
    <section className="px-6 md:px-10 py-24 max-w-5xl mx-auto">

      {/* Header */}
      <p className="text-xs uppercase tracking-widest text-[var(--ink-faint)] mb-10">
        What you get
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px
                      border border-[var(--border)] rounded-2xl overflow-hidden">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-[var(--bg)] p-7 flex flex-col gap-4
                       hover:bg-[var(--bg-muted)] transition-colors duration-200"
          >
            <span
              className={`self-start text-[11px] font-semibold tracking-wide
                          uppercase rounded-full px-3 py-1 ${tagStyles[f.tag]}`}
            >
              {f.tag}
            </span>
            <h3 className="text-[var(--ink)] font-semibold text-base tracking-tight leading-snug">
              {f.title}
            </h3>
            <p className="text-[var(--ink-muted)] text-sm leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}