"use client";

import { useEffect, useRef } from "react";
import ably from "@/lib/ably";
import type { Types } from "ably";

type SyncEvent =
  | { type: "play";  currentTime: number }
  | { type: "pause"; currentTime: number }
  | { type: "seek";  currentTime: number };

interface UseVideoSyncOptions {
  roomId:  string;
  isHost:  boolean;
  player:  YT.Player | null;
}

export function useVideoSync({ roomId, isHost, player }: UseVideoSyncOptions) {
  const channelRef    = useRef<Types.RealtimeChannelPromise | null>(null);
  const isSyncingRef  = useRef(false); // prevents echo loops

  useEffect(() => {
    if (!roomId) return;

    const channel = ably.channels.get(`room:${roomId}`);
    channelRef.current = channel;

    // ── Subscriber (everyone including host) ──
    channel.subscribe((msg) => {
      const event = msg.data as SyncEvent;
      if (!player) return;

      // Ignore events we published ourselves
      if (isSyncingRef.current) return;

      switch (event.type) {
        case "play":
          player.seekTo(event.currentTime, true);
          player.playVideo();
          break;
        case "pause":
          player.seekTo(event.currentTime, true);
          player.pauseVideo();
          break;
        case "seek":
          player.seekTo(event.currentTime, true);
          break;
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [roomId, player]);

  // ── Publisher helpers (host only) ──
  const publish = (event: SyncEvent) => {
    if (!isHost || !channelRef.current) return;
    isSyncingRef.current = true;
    channelRef.current.publish("sync", event);
    setTimeout(() => { isSyncingRef.current = false; }, 300);
  };

  const emitPlay  = () => publish({ type: "play",  currentTime: player?.getCurrentTime() ?? 0 });
  const emitPause = () => publish({ type: "pause", currentTime: player?.getCurrentTime() ?? 0 });
  const emitSeek  = (t: number) => publish({ type: "seek", currentTime: t });

  return { emitPlay, emitPause, emitSeek };
}