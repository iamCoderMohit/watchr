"use client";

import { useEffect, useRef, useState } from "react";

interface ProgressBarProps {
  player:  YT.Player | null;
  isHost:  boolean;
  onSeek?: (t: number) => void;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function ProgressBar({ player, isHost, onSeek }: ProgressBarProps) {
  const [current,  setCurrent]  = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [preview,  setPreview]  = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Poll player every second for current time
  useEffect(() => {
    if (!player) return;
    const id = setInterval(() => {
      if (dragging) return;
      try {
        setCurrent(player.getCurrentTime()  ?? 0);
        setDuration(player.getDuration()    ?? 0);
      } catch {}
    }, 1000);
    return () => clearInterval(id);
  }, [player, dragging]);

  function getPct(e: React.MouseEvent | React.TouchEvent) {
    const bar = barRef.current;
    if (!bar) return 0;
    const rect = bar.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isHost) return;
    setPreview(getPct(e) * duration);
    if (dragging) setCurrent(getPct(e) * duration);
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (!isHost) return;
    setDragging(true);
    setCurrent(getPct(e) * duration);
  }

  function handleMouseUp(e: React.MouseEvent) {
    if (!isHost || !dragging) return;
    const t = getPct(e) * duration;
    setCurrent(t);
    setDragging(false);
    onSeek?.(t);
  }

  const pct      = duration > 0 ? (current / duration) * 100 : 0;
  const previewPct = preview !== null && duration > 0
    ? (preview / duration) * 100
    : null;

  return (
    <div className="flex items-center gap-3 w-full px-1">
      {/* Current time */}
      <span className="text-[11px] font-mono text-[var(--ink-faint)] tabular-nums w-8 shrink-0">
        {fmt(current)}
      </span>

      {/* Bar */}
      <div
        ref={barRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setPreview(null)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="relative flex-1 h-1 rounded-full bg-[var(--border)] group"
        style={{ cursor: isHost ? "pointer" : "default" }}
      >
        {/* Preview ghost (host hover) */}
        {isHost && previewPct !== null && (
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[var(--ink-faint)] opacity-30"
            style={{ width: `${previewPct}%` }}
          />
        )}

        {/* Filled */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[var(--ink)] transition-all duration-200"
          style={{ width: `${pct}%` }}
        />

        {/* Thumb — host only */}
        {isHost && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                       w-3 h-3 rounded-full bg-[var(--ink)]
                       opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{ left: `${pct}%` }}
          />
        )}
      </div>

      {/* Duration */}
      <span className="text-[11px] font-mono text-[var(--ink-faint)] tabular-nums w-8 shrink-0 text-right">
        {fmt(duration)}
      </span>
    </div>
  );
}