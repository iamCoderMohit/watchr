"use client";

import { useEffect, useRef, useState } from "react";
import ProgressBar  from "./ProgressBar";
import JoinOverlay  from "./JoinOverlay";
import YT from "youtube";

interface VideoPlayerProps {
  videoId:  string;
  isHost:   boolean;
  onReady?: (player: YT.Player) => void;
  onSeek?:  (t: number) => void;
}

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function VideoPlayer({ videoId, isHost, onReady, onSeek }: VideoPlayerProps) {
  const containerRef              = useRef<HTMLDivElement>(null);
  const playerRef                 = useRef<YT.Player | null>(null);
  const [ready,     setReady]     = useState(false);
  const [activated, setActivated] = useState(isHost); // hosts don't need the overlay

  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          controls:       0,
          modestbranding: 1,
          rel:            0,
          iv_load_policy: 3,
          disablekb:      1,
        },
        events: {
          onReady: (e) => {
            setReady(true);
            onReady?.(e.target);
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      if (!document.getElementById("yt-api")) {
        const tag = document.createElement("script");
        tag.id  = "yt-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => { playerRef.current?.destroy(); };
  }, [videoId]);

  function handleActivate() {
    // Mute + play + immediately pause — this gesture unlocks autoplay for future calls
    try {
      playerRef.current?.mute();
      playerRef.current?.playVideo();
      setTimeout(() => {
        playerRef.current?.pauseVideo();
        playerRef.current?.unMute();
      }, 300);
    } catch {}
    setActivated(true);
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
        <div ref={containerRef} className="w-full h-full" />

        {/* Overlay for non-hosts until they click */}
        {!activated && ready && (
          <JoinOverlay onActivate={handleActivate} />
        )}
      </div>

      {ready && (
        <ProgressBar
          player={playerRef.current}
          isHost={isHost}
          onSeek={onSeek}
        />
      )}
    </div>
  );
}