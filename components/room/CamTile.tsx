"use client";

import { useEffect, useRef } from "react";
import type { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";

interface CamTileProps {
  initials:    string;
  name:        string;
  isMuted?:    boolean;
  isHost?:     boolean;
  isLocal?:    boolean;
  videoTrack?: LocalVideoTrack | RemoteVideoTrack | null;
}

export default function CamTile({
  initials,
  name,
  isMuted    = false,
  isHost     = false,
  isLocal    = false,
  videoTrack = null,
}: CamTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (!videoTrack) {
      el.srcObject = null;
      return;
    }

    // LiveKit's attach() handles all the stream wiring correctly
    videoTrack.attach(el);
    return () => { videoTrack.detach(el); };
  }, [videoTrack]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="squircle relative w-full aspect-square overflow-hidden
                   bg-[var(--cam-bg)] transition-colors duration-300"
      >
        {/* Sheen */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,rgba(150,150,145,0.15)_0%,transparent_70%)]" />

        {/* Host ring */}
        {isHost && (
          <div className="absolute inset-0 squircle ring-2 ring-[var(--ink)] ring-offset-2
                          ring-offset-[var(--cam-bg)] pointer-events-none" />
        )}

        {/* Video always mounted — track.attach() wires it when ready */}
        <video
          ref={videoRef}
          muted={isLocal}
          playsInline
          autoPlay
          className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300"
          style={{ opacity: videoTrack ? 1 : 0 }}
        />

        {/* Initials fallback */}
        <span
          className="absolute inset-0 flex items-center justify-center
                     text-xl font-semibold tracking-tight text-[var(--ink-faint)]
                     select-none z-10 transition-opacity duration-300"
          style={{ opacity: videoTrack ? 0 : 1 }}
        >
          {initials}
        </span>

        {/* Mic dot */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
          <div
            className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
            style={{ background: isMuted ? "var(--ink-faint)" : "#4ade80" }}
          />
        </div>
      </div>

      <p className="text-xs text-[var(--ink-muted)] tracking-tight truncate w-full text-center">
        {name} {isLocal && <span className="text-[var(--ink-faint)]">(you)</span>}
      </p>
    </div>
  );
}