"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import VideoPlayer      from "@/components/room/VideoPlayer";
import CamGrid          from "@/components/room/CamGrid";
import Controls         from "@/components/room/Controls";
import RoomShell        from "@/components/room/RoomShell";
import { useVideoSync } from "@/hooks/useVideoSync";
import { useRoom }      from "@/hooks/useRoom";
import { useLiveKit }   from "@/hooks/useLiveKit";

export default function RoomPage() {
  const { roomId }          = useParams<{ roomId: string }>();
  const { userId }          = useAuth();
  const { user }            = useUser();

  const playerRef                       = useRef<YT.Player | null>(null);
  const [ready, setReady]               = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);

  const { room, loading, error } = useRoom(roomId);

  const isHost = !!room && room.hostId === userId;

  const { emitPlay, emitPause, emitSeek } = useVideoSync({
    roomId,
    isHost,
    player: ready ? playerRef.current : null,
  });

  const { participants, toggleMic, toggleCam } = useLiveKit({
    roomId,
    userId:   userId  ?? "",
    userName: user?.fullName ?? user?.username ?? "Guest",
    isHost,
  });

  function handleInvite() {
    navigator.clipboard.writeText(window.location.href);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  }

  return (
    <RoomShell loading={loading} error={error}>
      <main className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4
                           border-b border-[var(--border)]">
          <span className="text-sm font-semibold tracking-tight text-[var(--ink)]">
            watchr
          </span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-[var(--ink-muted)]">
              {participants.length} watching
            </span>
          </div>
          <span className="text-xs text-[var(--ink-faint)] font-mono tracking-tight">
            {room?.name ?? roomId}
          </span>
        </header>

        {/* Body */}
        <div className="flex flex-col lg:flex-row flex-1 gap-4 p-4 md:p-6">

          {/* Video + controls */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {room && (
              <VideoPlayer
                videoId={room.videoId}
                isHost={isHost}
                onReady={(p) => {
                  playerRef.current = p;
                  setReady(true);
                }}
              />
            )}
            <Controls
              isHost={isHost}
              onPlay={emitPlay}
              onPause={emitPause}
              onSeek={emitSeek}
              onMicToggle={toggleMic}
              onCamToggle={toggleCam}
              onInvite={handleInvite}
              inviteCopied={inviteCopied}
            />
          </div>

          {/* Cam grid */}
          <div className="w-full lg:w-52 xl:w-60 shrink-0">
            <CamGrid
              participants={participants}
              onInvite={handleInvite}
            />
          </div>
        </div>

      </main>
    </RoomShell>
  );
}