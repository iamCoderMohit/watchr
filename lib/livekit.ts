import { AccessToken } from "livekit-server-sdk";

export async function createToken(roomId: string, userId: string, userName: string) {
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    {
      identity: userId,   // unique — used for host detection
      name:     userName, // display name shown in the UI
    }
  );

  token.addGrant({
    roomJoin:     true,
    room:         roomId,
    canPublish:   true,
    canSubscribe: true,
  });

  return token.toJwt();
}