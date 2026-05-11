import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import redis from "@/lib/redis";
import type { Room } from "@/app/api/rooms/route";

async function getUserRooms(userId: string): Promise<Room[]> {
  // Get room IDs from user's list
  const ids = await redis.lrange(`user:${userId}:rooms`, 0, -1) as string[];
  if (!ids.length) return [];

  // Fetch all rooms in parallel, filter out any that have expired
  const results = await Promise.all(
    ids.map((id) => redis.get(`room:${id}`))
  );

  return results
    .filter(Boolean)
    .map((raw) => (typeof raw === "string" ? JSON.parse(raw) : raw) as Room);
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default async function DashboardPage() {
  const user           = await currentUser();
  if (!user) redirect("/sign-in");

  const { userId }     = await auth();
  const rooms          = await getUserRooms(userId!);
  const firstName      = user.firstName ?? "there";

  return (
    <main
      className="min-h-screen px-6 md:px-10 pt-28 pb-16"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <p className="text-xs uppercase tracking-widest text-[var(--ink-faint)] mb-3">
          Dashboard
        </p>
        <div className="flex items-end justify-between gap-4 flex-wrap mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--ink)] leading-tight">
            Hey, {firstName}.
          </h1>
          <Link href="/room/new">
            <Button size="md">+ Create room</Button>
          </Link>
        </div>

        {/* Rooms */}
        {rooms.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed border-[var(--border)]
                       flex flex-col items-center justify-center gap-4
                       py-24 text-center"
          >
            <span className="text-3xl select-none">🎬</span>
            <p className="text-[var(--ink)] font-medium tracking-tight">No rooms yet</p>
            <p className="text-sm text-[var(--ink-muted)] max-w-xs">
              Create a room, paste a YouTube link, and share it with your friends.
            </p>
            <Link href="/room/new">
              <Button size="sm">Create your first room</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <Link
                key={room.id}
                href={`/room/${room.id}`}
                className="group flex flex-col gap-3 rounded-2xl border border-[var(--border)]
                           p-4 hover:border-[var(--ink-muted)] transition-colors duration-200"
              >
                {/* Thumbnail */}
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-[var(--bg-muted)]">
                  <img
                    src={`https://img.youtube.com/vi/${room.videoId}/hqdefault.jpg`}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-[1.02]
                               transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold tracking-tight text-[var(--ink)] truncate">
                    {room.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--ink-faint)] font-mono">
                      {room.id}
                    </span>
                    <span className="text-xs text-[var(--ink-faint)]">
                      {timeAgo(room.createdAt)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Create new — always last */}
            <Link
              href="/room/new"
              className="flex flex-col items-center justify-center gap-2 rounded-2xl
                         border border-dashed border-[var(--border)] aspect-[4/3]
                         text-[var(--ink-faint)] hover:border-[var(--ink-muted)]
                         hover:text-[var(--ink-muted)] transition-colors duration-200"
            >
              <span className="text-2xl select-none">+</span>
              <span className="text-xs tracking-tight">New room</span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}