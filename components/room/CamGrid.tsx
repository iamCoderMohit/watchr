import CamTile from "./CamTile";
import type { LiveKitParticipant } from "@/hooks/useLiveKit";

interface CamGridProps {
  participants: LiveKitParticipant[];
  onInvite?:   () => void;
}

export default function CamGrid({ participants, onInvite }: CamGridProps) {
  return (
    <div className="flex flex-row gap-3 flex-wrap">
      {participants.map((p) => (
        <div key={p.id} className="w-28 sm:w-32 md:w-36 shrink-0">
          <CamTile {...p} />
        </div>
      ))}

      {/* Invite slot */}
      {participants.length < 4 && (
        <div className="w-28 sm:w-32 md:w-36 shrink-0 flex flex-col items-center gap-2">
          <div
            onClick={onInvite}
            className="squircle w-full aspect-square flex items-center justify-center
                       border border-dashed border-[var(--border)]
                       text-[var(--ink-faint)] cursor-pointer
                       hover:border-[var(--ink-muted)] hover:text-[var(--ink-muted)]
                       transition-colors duration-200"
          >
            <span className="text-2xl select-none">+</span>
          </div>
          <p className="text-xs text-[var(--ink-faint)] tracking-tight">invite</p>
        </div>
      )}
    </div>
  );
}