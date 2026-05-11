"use client";

import { useEffect, useRef } from "react";
import ably from "@/lib/ably";
import type { RealtimeChannel } from "ably";

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
  const channelRef   = useRef<RealtimeChannel | null>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!roomId) return;

    const channel = ably.channels.get(`room:${roomId}`);
    channelRef.current = channel;

    // Subscribers (non-host viewers) respond to host events
    channel.subscribe((msg) => {
      console.log("[sync received]", msg.data);
      const event = msg.data as SyncEvent;
      if (!player) return;
      if (isSyncingRef.current) return; // ignore own echoes

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

    return () => { channel.unsubscribe(); };
  }, [roomId, player]);

  const publish = (event: SyncEvent) => {
    if (!isHost || !channelRef.current) return;
    isSyncingRef.current = true;
    channelRef.current.publish("sync", event);
    setTimeout(() => { isSyncingRef.current = false; }, 300);
  };

  const emitPlay = () => {
    if (!player) return;
    const currentTime = player.getCurrentTime() ?? 0;
    player.playVideo();                          // play host's own player
    publish({ type: "play", currentTime });      // broadcast to everyone else
  };

  const emitPause = () => {
    if (!player) return;
    const currentTime = player.getCurrentTime() ?? 0;
    player.pauseVideo();                         // pause host's own player
    publish({ type: "pause", currentTime });     // broadcast to everyone else
  };

  const emitSeek = (t: number) => {
    if (!player) return;
    player.seekTo(t, true);                      // seek host's own player
    publish({ type: "seek", currentTime: t });   // broadcast to everyone else
  };

  return { emitPlay, emitPause, emitSeek };
}