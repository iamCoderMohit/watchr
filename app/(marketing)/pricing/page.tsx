"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { PLANS } from "@/lib/plans";

declare global {
  interface Window { Razorpay: any; }
}

export default function PricingPage() {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      // 1 — create order
      const res = await fetch("/api/subscription/create", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create order");
      const { orderId, amount, currency, keyId } = await res.json();

      // 2 — load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const s   = document.createElement("script");
          s.src     = "https://checkout.razorpay.com/v1/checkout.js";
          s.onload  = () => resolve();
          s.onerror = () => reject(new Error("Razorpay failed to load"));
          document.head.appendChild(s);
        });
      }

      // 3 — open Razorpay checkout
      const rzp = new window.Razorpay({
        key:         keyId,
        amount,
        currency,
        order_id:    orderId,
        name:        "Watchr",
        description: "Pro Plan — ₹500/month",
        theme:       { color: "#000000" },
        handler: async (response: any) => {
          // 4 — verify payment on server
          const verify = await fetch("/api/subscription/verify", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            }),
          });

          if (verify.ok) {
            router.push("/dashboard?upgraded=true");
          } else {
            alert("Payment verification failed. Contact support.");
          }
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
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 gap-16">

        {/* Heading */}
        <div className="text-center flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-[var(--ink-faint)]">
            Pricing
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--ink)]">
            Simple pricing.
          </h1>
          <p className="text-sm text-[var(--ink-muted)] max-w-xs mx-auto">
            Start free. Upgrade when your crew gets bigger.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">

          {/* Free */}
          <div className="flex flex-col gap-6 rounded-2xl border border-[var(--border)]
                          p-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase tracking-widest text-[var(--ink-faint)]">
                {PLANS.free.name}
              </p>
              <p className="text-3xl font-bold tracking-tight text-[var(--ink)]">
                ₹0
              </p>
              <p className="text-xs text-[var(--ink-muted)]">forever</p>
            </div>

            <ul className="flex flex-col gap-2">
              {PLANS.free.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[var(--ink-muted)]">
                  <span className="text-[var(--ink-faint)]">✓</span> {f}
                </li>
              ))}
            </ul>

            <Button variant="ghost" className="w-full justify-center" disabled>
              Current plan
            </Button>
          </div>

          {/* Pro */}
          <div className="flex flex-col gap-6 rounded-2xl border-2 border-[var(--ink)]
                          p-6 relative">
            <div className="absolute -top-3 left-6">
              <span className="bg-[var(--ink)] text-[var(--bg)] text-[10px]
                               uppercase tracking-widest px-3 py-1 rounded-full">
                Popular
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase tracking-widest text-[var(--ink-faint)]">
                {PLANS.pro.name}
              </p>
              <p className="text-3xl font-bold tracking-tight text-[var(--ink)]">
                ₹500
              </p>
              <p className="text-xs text-[var(--ink-muted)]">per month</p>
            </div>

            <ul className="flex flex-col gap-2">
              {PLANS.pro.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[var(--ink-muted)]">
                  <span className="text-[var(--ink)]">✓</span> {f}
                </li>
              ))}
            </ul>

            <Button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full justify-center"
            >
              {loading ? "Loading…" : "Upgrade to Pro →"}
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}