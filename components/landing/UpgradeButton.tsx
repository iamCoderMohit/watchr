"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window { Razorpay: any; }
}

export default function UpgradeButton() {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/subscription/create", { method: "POST" });

      // Not signed in — redirect to sign-in first
      if (res.status === 401) {
        router.push("/sign-in");
        return;
      }

      if (!res.ok) throw new Error("Failed to create order");
      const { orderId, amount, currency, keyId } = await res.json();

      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const s   = document.createElement("script");
          s.src     = "https://checkout.razorpay.com/v1/checkout.js";
          s.onload  = () => resolve();
          s.onerror = () => reject(new Error("Razorpay failed to load"));
          document.head.appendChild(s);
        });
      }

      const rzp = new window.Razorpay({
        key:         keyId,
        amount,
        currency,
        order_id:    orderId,
        name:        "Watchr",
        description: "Pro Plan — ₹500/month",
        theme:       { color: "#000000" },
        handler: async (response: any) => {
          const verify = await fetch("/api/subscription/verify", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            }),
          });

          if (verify.ok) router.push("/dashboard?upgraded=true");
          else alert("Payment verification failed. Contact support.");
        },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full rounded-full py-3 text-sm font-semibold tracking-tight
                 bg-[var(--cta-bg)] text-[var(--cta-fg)]
                 hover:opacity-80 transition-opacity cursor-pointer
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Loading…" : "Upgrade to Pro →"}
    </button>
  );
}