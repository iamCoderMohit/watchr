const FEATURES = [
  {
    emoji: "🎬",
    title: "Synced playback",
    desc: "Host hits play — everyone's video starts at the exact same moment. No drift, no lag.",
  },
  {
    emoji: "🎙",
    title: "Voice & video",
    desc: "Talk and react in real time. Webcam tiles sit right below the video so nobody misses a face.",
  },
  {
    emoji: "😄",
    title: "Emoji reactions",
    desc: "Emojis fly across the screen as the moment happens. No typing needed.",
  },
  {
    emoji: "🔗",
    title: "One link to share",
    desc: "Create a room, copy the link, send it. Friends join instantly — no account required.",
  },
];

export default function Features() {
  return (
    <section className="px-6 md:px-10 py-24 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-col gap-3 mb-14">
        <p className="text-xs uppercase tracking-widest text-[var(--ink-faint)]">
          What you get
        </p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--ink)] leading-tight">
          Everything you need
          <br />
          <span className="text-[var(--ink-muted)]">to watch together.</span>
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px
                      border border-[var(--border)] rounded-2xl overflow-hidden">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-[var(--bg)] p-7 flex flex-col gap-4
                       hover:bg-[var(--bg-muted)] transition-colors duration-200 group"
          >
            <span className="text-2xl select-none group-hover:scale-110
                             transition-transform duration-200 w-fit">
              {f.emoji}
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