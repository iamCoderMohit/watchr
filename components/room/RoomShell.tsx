"use client";

interface RoomShellProps {
  loading: boolean;
  error:   string | null;
  children: React.ReactNode;
}

export default function RoomShell({ loading, error, children }: RoomShellProps) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: "var(--bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--ink-faint)]
                          border-t-[var(--ink)] animate-spin" />
          <span className="text-sm text-[var(--ink-muted)]">Joining room…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: "var(--bg)" }}>
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <span className="text-4xl">🎬</span>
          <p className="text-base font-semibold text-[var(--ink)]">{error}</p>
          <p className="text-sm text-[var(--ink-muted)]">
            Double-check the link or ask the host to resend it.
          </p>
          <a href="/"
             className="text-sm underline underline-offset-4 text-[var(--ink-muted)]
                        hover:text-[var(--ink)] transition-colors">
            Back to home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}