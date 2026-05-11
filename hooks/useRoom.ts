"use client";

import { useEffect, useState } from "react";

export interface Room {
  id:        string;
  videoId:   string;
  hostId:    string;
  name:      string;
  createdAt: number;
}

interface UseRoomResult {
  room:    Room | null;
  loading: boolean;
  error:   string | null;
}

export function useRoom(roomId: string): UseRoomResult {
  const [room,    setRoom]    = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    let cancelled = false;

    async function fetchRoom() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/rooms/${roomId}`);
        if (!res.ok) throw new Error(res.status === 404 ? "Room not found." : "Failed to load room.");
        const data: Room = await res.json();
        if (!cancelled) setRoom(data);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRoom();
    return () => { cancelled = true; };
  }, [roomId]);

  return { room, loading, error };
}