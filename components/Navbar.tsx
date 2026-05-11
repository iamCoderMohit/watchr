"use client";

import { useEffect, useState } from "react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("watchr-theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("watchr-theme", next ? "dark" : "light");
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-8 py-5">

      {/* Logo */}
      <Link
        href="/"
        className="text-[var(--ink)] text-base font-semibold tracking-tight hover:opacity-70 transition-opacity"
      >
        watchr
      </Link>

      {/* Center pill */}
      <div className="flex items-center gap-1 bg-[var(--pill-bg)] text-[var(--pill-fg)] rounded-full pl-4 pr-1.5 py-1.5">
        <span className="hidden sm:block text-sm font-medium tracking-tight pr-2">
          Menu
        </span>
        <span className="hidden sm:block w-px h-4 bg-white/10" />
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm
                     bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
        >
          {dark ? "☀︎" : "☽"}
        </button>
        <span className="text-xs text-white/40 px-2">0%</span>
      </div>

      {/* Auth */}
      <div className="flex items-center gap-3">
        {isSignedIn ? (
          <>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">Sign in</Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">Get started</Button>
            </SignInButton>
          </>
        )}
      </div>
    </nav>
  );
}