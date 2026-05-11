const TILES = [
  { initials: "AK", shape: "squircle",     anim: "animate-float",      top: "8%",  left: "52%", size: 140 },
  { initials: "PR", shape: "squircle-alt", anim: "animate-float-mid",  top: "18%", left: "34%", size: 118 },
  { initials: "RV", shape: "squircle-3",   anim: "animate-float-r",    top: "20%", left: "70%", size: 126 },
  { initials: "MS", shape: "squircle-4",   anim: "animate-float-fast", top: "42%", left: "26%", size: 108 },
  { initials: "TN", shape: "squircle",     anim: "animate-float-slow", top: "44%", left: "64%", size: 132 },
  { initials: "ZA", shape: "squircle-alt", anim: "animate-float",      top: "64%", left: "44%", size: 106 },
  { initials: "LK", shape: "squircle-3",   anim: "animate-float-mid",  top: "62%", left: "72%", size: 114 },
];

const MIC_ON = [0, 3, 5]; // indices that show green mic dot

export default function HeroCams() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {TILES.map((t, i) => (
        <div
          key={i}
          className={t.anim}
          style={{
            position: "absolute",
            top: t.top,
            left: t.left,
            width: t.size,
            height: t.size,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className={`${t.shape} w-full h-full relative overflow-hidden
                        bg-[var(--cam-bg)] transition-colors duration-300`}
          >
            {/* Subtle radial sheen */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,rgba(150,150,145,0.18)_0%,transparent_70%)]" />

            {/* Initials */}
            <span
              className="absolute inset-0 flex items-center justify-center
                         font-semibold tracking-tight select-none z-10
                         text-[var(--ink-faint)]"
              style={{ fontSize: t.size * 0.21 }}
            >
              {t.initials}
            </span>

            {/* Mic dot */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: MIC_ON.includes(i) ? "#4ade80" : "var(--ink-faint)" }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}