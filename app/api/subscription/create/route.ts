import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import razorpay from "@/lib/razorpay";

// POST /api/subscription/create
export async function POST() {
  try {
    console.log("key_id set?", !!process.env.RAZORPAY_KEY_ID);
console.log("key_secret set?", !!process.env.RAZORPAY_KEY_SECRET);
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await razorpay.orders.create({
      amount:   50000,        // 500 INR in paise
      currency: "INR",
      notes:    { userId },   // attach userId so we can verify later
    });

    return NextResponse.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[POST /api/subscription/create]", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}