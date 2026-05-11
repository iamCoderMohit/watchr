import redis from "@/lib/redis";

export type Plan = "free" | "pro";

export const PLANS = {
  free: {
    name:         "Free",
    price:        0,
    maxParticipants: 4,
    features: [
      "Up to 4 people per room",
      "YouTube sync",
      "Voice & video chat",
      "Emoji reactions",
    ],
  },
  pro: {
    name:         "Pro",
    price:        500,        // INR per month
    maxParticipants: 15,
    features: [
      "Up to 15 people per room",
      "Everything in Free",
      "Persistent rooms",
      "Priority support",
    ],
  },
} as const;

export async function getUserPlan(userId: string): Promise<Plan> {
  try {
    const plan = await redis.get(`user:${userId}:plan`) as string | null;
    return plan === "pro" ? "pro" : "free";
  } catch {
    return "free";
  }
}

export async function setUserPlan(userId: string, plan: Plan) {
  // Pro plan stored for 31 days — refresh on each payment
  await redis.set(`user:${userId}:plan`, plan, { ex: 60 * 60 * 24 * 31 });
}