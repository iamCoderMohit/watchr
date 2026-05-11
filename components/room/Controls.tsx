"use client";

import { useState } from "react";

interface ControlsProps {
  isHost?:       boolean;
  onPlay?:       () => void;
  onPause?:      () => void;
  onSeek?:       (t: number) => void;
  onMicToggle?:  () => void;
  onCamToggle?:  () => void;
  onInvite?:     () => void;
  inviteCopied?: boolean;
}

export default function Controls({
  isHost       = false,
  onPlay,
  onPause,
  onMicToggle,
  onCamToggle,
  onInvite,
  inviteCopied = false,
}: ControlsProps) {
  const [mic,     setMic]     = useState(true);
  const [cam,     setCam]     = useState(true);
  const [playing, setPlaying] = useState(false);

  const handlePlayPause = () => {
    if (playing) onPause?.();
    else         onPlay?.();
    setPlaying(!playing);
  };

  const handleMic = () => { setMic(!mic); onMicToggle?.(); };
  const handleCam = () => { setCam(!cam); onCamToggle?.(); };

  const personalBtns = [
    { label: "Mic",    icon: mic ? "🎙" : "🔇", active: !mic, onClick: handleMic },
    { label: "Cam",    icon: cam ? "📷" : "🚫", active: !cam, onClick: handleCam },
    { label: "React",  icon: "😄",               active: false },
    {
      label: inviteCopied ? "Copied!" : "Invite",
      icon:  inviteCopied ? "✅"      : "🔗",
      active: false,
      onClick: onInvite,
    },
  ];

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">

      {/* Host play/pause */}
      {isHost && (
        <>
          <div className="flex items-center gap-1 bg-[var(--bg-muted)] rounded-full px-3 py-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--ink-faint)] pr-2">
              host
            </span>
            <button
              onClick={handlePlayPause}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm
                         text-[var(--ink)] hover:bg-[var(--border)] transition-colors cursor-pointer"
            >
              {playing ? "⏸" : "▶️"}
            </button>
          </div>
          <div className="w-px h-8 bg-[var(--border)]" />
        </>
      )}

      {/* Personal controls */}
      <div className="flex items-center gap-1 bg-[var(--bg-muted)] rounded-full px-3 py-2">
        {personalBtns.map((btn) => (
          <div key={btn.label} className="flex flex-col items-center gap-1">
            <button
              onClick={btn.onClick}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-base
                          transition-colors cursor-pointer
                          ${btn.active
                            ? "bg-red-500/10 text-red-500"
                            : "text-[var(--ink)] hover:bg-[var(--border)]"
                          }`}
            >
              {btn.icon}
            </button>
            <span className="text-[10px] text-[var(--ink-faint)] tracking-tight">
              {btn.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}