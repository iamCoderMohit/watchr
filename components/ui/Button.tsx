"use client";

import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: "bg-[var(--cta-bg)] text-[var(--cta-fg)] hover:opacity-80",
  ghost:   "bg-transparent border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--bg-muted)]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        rounded-full font-semibold tracking-tight
        transition-all duration-200 active:scale-95
        cursor-pointer select-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </button>
  );
}