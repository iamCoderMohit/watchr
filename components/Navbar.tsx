"use client";

import { useEffect, useState } from "react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Button from "@/components/ui/Button";
import Link from "next/link";

const MENU_LINKS = [
  { label: "Features",  href: "#features" },
  { label: "Pricing",   href: "#pricing"  },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const [dark, setDark]       = useState(false);
  const [scroll, setScroll]   = useState(0);
  const [menuOpen, setMenu]   = useState(false);

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement;
      const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
      setScroll(isNaN(pct) ? 0 : pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Theme
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

  // Close menu on route change / escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 md:py-5">

        {/* Logo */}
        <Link
          href="/"
          className="text-[var(--ink)] text-base font-semibold tracking-tight
                     hover:opacity-70 transition-opacity shrink-0"
        >
          watchr
        </Link>

        {/* Center pill */}
        <div className="flex items-center gap-1 bg-[var(--pill-bg)] text-[var(--pill-fg)]
                        rounded-full pl-3 md:pl-4 pr-1.5 py-1.5">

          {/* Menu button */}
          <button
            onClick={() => setMenu(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium
                       tracking-tight pr-2 hover:opacity-70 transition-opacity cursor-pointer"
          >
            <span className="text-base leading-none">{menuOpen ? "✕" : "☰"}</span>
            <span>Menu</span>
          </button>

          <span className="hidden sm:block w-px h-4 bg-white/10" />

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm
                       bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            {dark ? "☀︎" : "☽"}
          </button>

          {/* Scroll progress */}
          <span className="text-xs text-white/40 px-2 w-8 text-right tabular-nums">
            {scroll}%
          </span>
        </div>

        {/* Auth — desktop */}
        <div className="hidden sm:flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <UserButton />
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

        {/* Mobile — hamburger */}
        <button
          className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full
                     bg-[var(--bg-muted)] text-[var(--ink)] text-base cursor-pointer"
          onClick={() => setMenu(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* ── Menu drawer ── */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setMenu(false)}
          />

          {/* Panel */}
          <div
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)]
                       max-w-sm rounded-2xl border border-[var(--border)]
                       bg-[var(--bg)] shadow-xl p-4 flex flex-col gap-1"
          >
            {MENU_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenu(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-[var(--ink)]
                           hover:bg-[var(--bg-muted)] transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Auth in menu on mobile */}
            <div className="sm:hidden pt-2 border-t border-[var(--border)] mt-1 flex flex-col gap-2">
              {isSignedIn ? (
                <Link href="/dashboard" onClick={() => setMenu(false)}>
                  <Button size="sm" className="w-full justify-center">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm" className="w-full justify-center">
                      Sign in
                    </Button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <Button size="sm" className="w-full justify-center">
                      Get started
                    </Button>
                  </SignInButton>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}