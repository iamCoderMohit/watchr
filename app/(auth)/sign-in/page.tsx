import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ background: "var(--bg)" }}
    >
      <span className="text-lg font-semibold tracking-tight text-[var(--ink)]">
        watchr
      </span>
      <SignIn />
    </main>
  );
}