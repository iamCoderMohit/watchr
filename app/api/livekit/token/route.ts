import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createToken } from "@/lib/livekit";

// GET /api/livekit/token?roomId=xxx&userId=yyy&userName=zzz
export async function GET(req: Request) {
  const { userId: authedUserId } = await auth();
  if (!authedUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const roomId   = searchParams.get("roomId");
  const userId   = searchParams.get("userId");
  const userName = searchParams.get("userName") ?? "Guest";

  if (!roomId || !userId) {
    return NextResponse.json(
      { error: "roomId and userId are required" },
      { status: 400 }
    );
  }

  // Prevent users from minting tokens for other identities
  if (userId !== authedUserId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const token = await createToken(roomId, userId, userName);
    return NextResponse.json({ token });
  } catch (err) {
    console.error("[GET /api/livekit/token]", err);
    return NextResponse.json({ error: "Failed to create token" }, { status: 500 });
  }
}