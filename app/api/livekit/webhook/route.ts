import { NextResponse } from "next/server";
import { WebhookReceiver } from "livekit-server-sdk";
import redis from "@/lib/redis";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(req: Request) {
  try {
    const body      = await req.text();
    const signature = req.headers.get("Authorization") ?? "";

    // Verify the request is genuinely from LiveKit
    const event = await receiver.receive(body, signature);

    const roomId = event.room?.name;
    if (!roomId) return NextResponse.json({ ok: true });

    const key = `room:${roomId}:count`;

    switch (event.event) {
      case "participant_joined":
        await redis.incr(key);
        // Expire after 24h in case room is abandoned
        await redis.expire(key, 60 * 60 * 24);
        break;

      case "participant_left":
        const count = await redis.decr(key);
        // Clean up if room is empty
        if (count <= 0) await redis.del(key);
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/livekit/webhook]", err);
    // Still return 200 — LiveKit retries on non-2xx
    return NextResponse.json({ ok: true });
  }
}