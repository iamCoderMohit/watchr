import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import redis from "@/lib/redis";
import { getUserPlan, PLANS } from "@/lib/plans";
import { Room } from "@/app/api/rooms/route";

// GET /api/rooms/[roomId]/join
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await params;

    // Fetch room
    const raw = await redis.get(`room:${roomId}`);
    if (!raw) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const room: Room = typeof raw === "string" ? JSON.parse(raw) : raw;

    // Get host's plan — limit is based on host, not joiner
    const plan  = await getUserPlan(room.hostId);
    const limit = PLANS[plan].maxParticipants;

    // Get current participant count from LiveKit via stored count in Redis
    // We track this with a simple counter that LiveKit webhook updates
    const countRaw = await redis.get(`room:${roomId}:count`);
    const count    = typeof countRaw === "number" ? countRaw : parseInt(countRaw as string ?? "0", 10);

    if (count >= limit) {
      return NextResponse.json(
        {
          error:   "Room is full",
          limit,
          plan,
          upgrade: plan === "free",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ allowed: true, limit, plan });
  } catch (err) {
    console.error("[GET /api/rooms/:roomId/join]", err);
    return NextResponse.json({ error: "Failed to check room" }, { status: 500 });
  }
}