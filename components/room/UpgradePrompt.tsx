import Link from "next/link";
import Button from "@/components/ui/Button";

interface UpgradePromptProps {
  limit:     number;
  canUpgrade: boolean; // true if host is on free plan
}

export default function UpgradePrompt({ limit, canUpgrade }: UpgradePromptProps) {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
    >
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <span className="text-4xl select-none">🚪</span>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">
            Room is full
          </h1>
          <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
            This room has reached its {limit}-person limit.
            {canUpgrade && " The host can upgrade to Pro to let in up to 15 people."}
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {canUpgrade && (
            <Link href="/pricing">
              <Button className="w-full justify-center">
                Upgrade to Pro →
              </Button>
            </Link>
          )}
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-center">
              Go to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}