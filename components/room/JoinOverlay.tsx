"use client";

interface JoinOverlayProps {
  onActivate: () => void;
}

export default function JoinOverlay({ onActivate }: JoinOverlayProps) {
  return (
    <div
      onClick={onActivate}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3
                 bg-black/60 backdrop-blur-sm cursor-pointer
                 transition-opacity duration-300"
    >
      <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20
                      flex items-center justify-center text-2xl select-none">
        🎬
      </div>
      <p className="text-white text-sm font-medium tracking-tight">
        Click to join the watch party
      </p>
      <p className="text-white/50 text-xs">
        Video will sync with the host
      </p>
    </div>
  );
}