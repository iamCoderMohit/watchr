import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { Room } from "@/app/api/rooms/route";

// GET /api/rooms/:roomId
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params;
    const raw = await redis.get(`room:${roomId}`);

    if (!raw) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const room: Room = typeof raw === "string" ? JSON.parse(raw) : raw;
    return NextResponse.json(room);
  } catch (err) {
    console.error("[GET /api/rooms/:roomId]", err);
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 });
  }
}