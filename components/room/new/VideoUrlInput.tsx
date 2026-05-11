"use client";

interface VideoUrlInputProps {
  value:    string;
  onChange: (val: string) => void;
  error:    string | null;
}

export default function VideoUrlInput({ value, onChange, error }: VideoUrlInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium tracking-wide uppercase
                        text-[var(--ink-muted)]">
        YouTube URL
      </label>
      <input
        type="url"
        placeholder="https://youtube.com/watch?v=..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-sm
                   bg-transparent border border-[var(--border)]
                   text-[var(--ink)] placeholder:text-[var(--ink-faint)]
                   focus:outline-none focus:border-[var(--ink)]
                   transition-colors"
      />
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}