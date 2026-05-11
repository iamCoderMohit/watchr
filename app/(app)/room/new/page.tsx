"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Button from "@/components/ui/Button";
import VideoUrlInput from "@/components/room/new/VideoUrlInput";

// Extracts YouTube video ID from any common URL format
function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be"))    return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    return null;
  } catch {
    return null;
  }
}

export default function NewRoomPage() {
  const router = useRouter();

  const [url,      setUrl]      = useState("");
  const [name,     setName]     = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  async function handleCreate() {
    setUrlError(null);

    const videoId = extractVideoId(url.trim());
    if (!videoId) {
      setUrlError("Paste a valid YouTube link.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/rooms", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          videoId,
          name: name.trim() || "Watchr Room",
        }),
      });

      if (!res.ok) throw new Error("Failed to create room.");

      const { id } = await res.json();
      router.push(`/room/${id}`);
    } catch {
      setUrlError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md flex flex-col gap-8">

          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
              New room.
            </h1>
            <p className="text-sm text-[var(--ink-muted)]">
              Paste a YouTube link and share the room with your friends.
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">

            {/* YouTube URL */}
            <VideoUrlInput
              value={url}
              onChange={setUrl}
              error={urlError}
            />

            {/* Room name (optional) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium tracking-wide uppercase
                                text-[var(--ink-muted)]">
                Room name
                <span className="ml-1 normal-case text-[var(--ink-faint)]">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="Friday night movies"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={48}
                className="w-full px-4 py-3 rounded-xl text-sm
                           bg-transparent border border-[var(--border)]
                           text-[var(--ink)] placeholder:text-[var(--ink-faint)]
                           focus:outline-none focus:border-[var(--ink)]
                           transition-colors"
              />
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={handleCreate}
            disabled={loading}
            className="w-full justify-center py-3 text-sm"
          >
            {loading ? "Creating…" : "Create room →"}
          </Button>

          {/* Preview card — shows video thumbnail once URL is valid */}
          {extractVideoId(url.trim()) && (
            <div className="rounded-2xl overflow-hidden border border-[var(--border)]
                            aspect-video w-full">
              <img
                src={`https://img.youtube.com/vi/${extractVideoId(url.trim())}/hqdefault.jpg`}
                alt="Video preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}