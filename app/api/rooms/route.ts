import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import redis from "@/lib/redis";

export interface Room {
  id:        string;
  videoId:   string;
  hostId:    string;
  name:      string;
  createdAt: number;
}

// POST /api/rooms
// body: { videoId: string, name?: string }
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoId, name } = await req.json();

    if (!videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 });
    }

    const room: Room = {
      id:        nanoid(8),
      videoId,
      hostId:    userId,
      name:      name?.trim() || "Watchr Room",
      createdAt: Date.now(),
    };

    // Store room for 24 hours
    await redis.set(`room:${room.id}`, JSON.stringify(room), { ex: 60 * 60 * 24 });

    // Push room ID to user's list (newest first), keep last 20
    await redis.lpush(`user:${userId}:rooms`, room.id);
    await redis.ltrim(`user:${userId}:rooms`, 0, 19);

    return NextResponse.json(room, { status: 201 });
  } catch (err) {
    console.error("[POST /api/rooms]", err);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}