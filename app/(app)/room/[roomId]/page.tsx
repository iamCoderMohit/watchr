"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import VideoPlayer      from "@/components/room/VideoPlayer";
import CamGrid          from "@/components/room/CamGrid";
import Controls         from "@/components/room/Controls";
import RoomShell        from "@/components/room/RoomShell";
import UpgradePrompt    from "@/components/room/UpgradePrompt";
import { useVideoSync } from "@/hooks/useVideoSync";
import { useRoom }      from "@/hooks/useRoom";
import { useLiveKit }   from "@/hooks/useLiveKit";
import { useReactions } from "@/hooks/useReactions";

export default function RoomPage() {
  const { roomId }  = useParams<{ roomId: string }>();
  const { userId }  = useAuth();
  const { user }    = useUser();

  const playerRef                       = useRef<YT.Player | null>(null);
  const [ready, setReady]               = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);

  const { room, loading, error }               = useRoom(roomId);
  const isHost                                 = !!room && room.hostId === userId;
  const { emitPlay, emitPause, emitSeek }      = useVideoSync({ roomId, isHost, player: ready ? playerRef.current : null });
  const { participants, toggleMic, toggleCam,
          blocked }                            = useLiveKit({ roomId, userId: userId ?? "", userName: user?.fullName ?? user?.username ?? "Guest", isHost });
  const { reactions, sendReaction }            = useReactions(roomId);

  function handleInvite() {
    navigator.clipboard.writeText(window.location.href);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  }

  // Room is full — show upgrade prompt instead of the room
  if (blocked) {
    return <UpgradePrompt limit={blocked.limit} canUpgrade={blocked.canUpgrade} />;
  }

  return (
    <RoomShell loading={loading} error={error}>
      <main className="mt-20 min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>

        <div className="flex flex-col flex-1 gap-4 p-4 md:p-6 max-w-5xl mx-auto w-full">

          {room && (
            <VideoPlayer
              videoId={room.videoId}
              isHost={isHost}
              onSeek={emitSeek}
              onReady={(p) => { playerRef.current = p; setReady(true); }}
            />
          )}

          <CamGrid participants={participants} onInvite={handleInvite} />

          <Controls
            isHost={isHost}
            onPlay={emitPlay}
            onPause={emitPause}
            onSeek={emitSeek}
            onMicToggle={toggleMic}
            onCamToggle={toggleCam}
            onInvite={handleInvite}
            inviteCopied={inviteCopied}
            reactions={reactions}
            onReact={sendReaction}
          />
        </div>

      </main>
    </RoomShell>
  );
}