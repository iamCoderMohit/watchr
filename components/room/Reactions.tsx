"use client";

import { useState } from "react";
import type { FloatingReaction } from "@/hooks/useReactions";
import { EMOJIS } from "@/hooks/useReactions";

interface ReactionsProps {
  reactions:    FloatingReaction[];
  onSend:       (emoji: string) => void;
}

export default function Reactions({ reactions, onSend }: ReactionsProps) {
  const [open, setOpen] = useState(false);

  function handlePick(emoji: string) {
    onSend(emoji);
    setOpen(false);
  }

  return (
    <>
      {/* Floating emojis — rendered over the video */}
      <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
        {reactions.map((r) => (
          <span
            key={r.id}
            className="absolute bottom-32 text-3xl select-none animate-float"
            style={{ left: `${r.x}%` }}
          >
            {r.emoji}
          </span>
        ))}
      </div>

      {/* Picker popup + trigger — rendered inline in Controls */}
      <div className="relative flex flex-col items-center gap-1">
        {open && (
          <div
            className="absolute bottom-full mb-2 flex gap-1 px-2 py-1.5
                       bg-[var(--bg-muted)] border border-[var(--border)]
                       rounded-full shadow-lg"
          >
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => handlePick(e)}
                className="w-8 h-8 flex items-center justify-center text-lg
                           rounded-full hover:bg-[var(--border)] transition-colors cursor-pointer"
              >
                {e}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-base
                     text-[var(--ink)] hover:bg-[var(--border)] transition-colors cursor-pointer"
        >
          😄
        </button>
        <span className="text-[10px] text-[var(--ink-faint)] tracking-tight">React</span>
      </div>
    </>
  );
}