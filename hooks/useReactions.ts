"use client";

import { useEffect, useRef, useState } from "react";
import ably from "@/lib/ably";
import { RealtimeChannel } from "ably";

export interface FloatingReaction {
  id:    string;
  emoji: string;
  x:     number; // % from left
}

export const EMOJIS = ["😂", "🔥", "😮", "👏", "💀", "❤️"];

export function useReactions(roomId: string) {
  const channelRef                          = useRef<RealtimeChannel | null>(null);
  const [reactions, setReactions]           = useState<FloatingReaction[]>([]);

  useEffect(() => {
    if (!roomId) return;
    const channel = ably.channels.get(`reactions:${roomId}`);
    channelRef.current = channel;

    channel.subscribe((msg) => {
      const emoji = msg.data as string;
      const reaction: FloatingReaction = {
        id:    `${Date.now()}-${Math.random()}`,
        emoji,
        x:     10 + Math.random() * 80, // spread across 10–90% width
      };
      setReactions((prev) => [...prev, reaction]);
      // Remove after animation completes
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== reaction.id));
      }, 2800);
    });

    return () => { channel.unsubscribe(); };
  }, [roomId]);

  function sendReaction(emoji: string) {
    channelRef.current?.publish("reaction", emoji);
  }

  return { reactions, sendReaction };
}