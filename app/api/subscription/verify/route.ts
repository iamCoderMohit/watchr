import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";
import { setUserPlan } from "@/lib/plans";

// POST /api/subscription/verify
// body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    // Verify signature — prevents fake payment confirmations
    const body      = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected  = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Upgrade user to pro for 31 days
    await setUserPlan(userId, "pro");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/subscription/verify]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}