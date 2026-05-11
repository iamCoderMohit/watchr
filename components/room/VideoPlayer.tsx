"use client";

import { useEffect, useRef } from "react";
import YT from "youtube";

interface VideoPlayerProps {
  videoId: string;
  isHost: boolean;
  onReady?: (player: YT.Player) => void;
}

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function VideoPlayer({ videoId, isHost, onReady }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef    = useRef<YT.Player | null>(null);

  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          controls: isHost ? 1 : 0, // only host sees native controls
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (e) => onReady?.(e.target),
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      // Load the API script once
      if (!document.getElementById("yt-api")) {
        const tag = document.createElement("script");
        tag.id  = "yt-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      playerRef.current?.destroy();
    };
  }, [videoId]);

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}