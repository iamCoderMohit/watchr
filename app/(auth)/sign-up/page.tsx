import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ background: "var(--bg)" }}
    >
      <span className="text-lg font-semibold tracking-tight text-[var(--ink)]">
        watchr
      </span>
      <SignUp />
    </main>
  );
}