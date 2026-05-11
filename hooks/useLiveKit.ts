"use client";

import { useEffect, useRef, useState } from "react";
import {
  Room,
  RoomEvent,
  RoomOptions,
  RemoteParticipant,
  LocalParticipant,
  Track,
  type LocalVideoTrack,
  type RemoteVideoTrack,
} from "livekit-client";

export interface LiveKitParticipant {
  id:         string;
  name:       string;
  initials:   string;
  isLocal:    boolean;
  isHost:     boolean;
  isMuted:    boolean;
  videoTrack: LocalVideoTrack | RemoteVideoTrack | null;
}

interface UseLiveKitOptions {
  roomId:   string;
  userId:   string;
  userName: string;
  isHost:   boolean;
}

function toInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function mapParticipant(
  p: RemoteParticipant | LocalParticipant,
  isLocal: boolean,
  hostId: string
): LiveKitParticipant {
  const audioPub = p.getTrackPublication(Track.Source.Microphone);
  const videoPub = p.getTrackPublication(Track.Source.Camera);

  return {
    id:         p.identity,
    name:       p.name ?? p.identity,
    initials:   toInitials(p.name ?? p.identity),
    isLocal,
    isHost:     p.identity === hostId,
    isMuted:    audioPub?.isMuted ?? true,
    videoTrack: (videoPub?.track as LocalVideoTrack | RemoteVideoTrack) ?? null,
  };
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function publishWithRetry(room: Room, attempts = 3): Promise<void> {
  for (let i = 0; i < attempts; i++) {
    try {
      await wait(300 * (i + 1)); // 300ms, 600ms, 900ms
      await room.localParticipant.enableCameraAndMicrophone();
      return;
    } catch (err) {
      console.warn(`[LiveKit] publish attempt ${i + 1} failed:`, err);
      if (i === attempts - 1) throw err;
    }
  }
}

export function useLiveKit({ roomId, userId, userName }: UseLiveKitOptions) {
  const roomRef                         = useRef<Room | null>(null);
  const [participants, setParticipants] = useState<LiveKitParticipant[]>([]);
  const [connected,    setConnected]    = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  function syncParticipants(room: Room) {
    const local  = mapParticipant(room.localParticipant, true, userId);
    const remote = [...room.remoteParticipants.values()].map((p) =>
      mapParticipant(p, false, userId)
    );
    const all = [local, ...remote].sort((a, b) =>
      a.isHost === b.isHost ? 0 : a.isHost ? -1 : 1
    );
    setParticipants([...all]);
  }

  useEffect(() => {
    if (!roomId || !userId) return;

    let cancelled = false;

    const roomOptions: RoomOptions = {
      adaptiveStream: true,
      dynacast:       true,
    };

    const room      = new Room(roomOptions);
    roomRef.current = room;

    const sync = () => { if (!cancelled) syncParticipants(room); };

    room
      .on(RoomEvent.Connected, async () => {
        if (cancelled) return;
        setConnected(true);
        sync();

        try {
          await publishWithRetry(room);
        } catch (err) {
          console.error("[LiveKit] cam/mic failed after retries:", err);
        }

        // Sync again after publish settles
        sync();
        setTimeout(sync, 500);
        setTimeout(sync, 1500);
      })
      .on(RoomEvent.Disconnected,            () => setConnected(false))
      .on(RoomEvent.ParticipantConnected,    sync)
      .on(RoomEvent.ParticipantDisconnected, sync)
      .on(RoomEvent.TrackPublished,          sync)
      .on(RoomEvent.TrackUnpublished,        sync)
      .on(RoomEvent.TrackMuted,              sync)
      .on(RoomEvent.TrackUnmuted,            sync)
      .on(RoomEvent.LocalTrackPublished,     sync)
      .on(RoomEvent.LocalTrackUnpublished,   sync);

    async function connect() {
      try {
        const res = await fetch(
          `/api/livekit/token?roomId=${roomId}&userId=${userId}&userName=${encodeURIComponent(userName)}`
        );
        if (!res.ok) throw new Error("Failed to get LiveKit token.");
        const { token } = await res.json();
        await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    }

    connect();

    return () => {
      cancelled = true;
      room.disconnect();
    };
  }, [roomId, userId]);

  function toggleMic() {
    const lp = roomRef.current?.localParticipant;
    if (!lp) return;
    lp.setMicrophoneEnabled(!lp.isMicrophoneEnabled);
    setTimeout(() => syncParticipants(roomRef.current!), 200);
  }

  function toggleCam() {
    const lp = roomRef.current?.localParticipant;
    if (!lp) return;
    lp.setCameraEnabled(!lp.isCameraEnabled);
    setTimeout(() => syncParticipants(roomRef.current!), 200);
  }

  return { participants, connected, error, toggleMic, toggleCam };
}