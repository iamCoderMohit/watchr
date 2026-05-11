import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      colors: {
        // light
        surface: "#ffffff",
        "surface-muted": "#f5f5f3",
        ink: "#0a0a0a",
        "ink-muted": "#6b6b6b",
        "ink-faint": "#b0b0b0",
        border: "#e4e4e0",
        // dark equivalents via CSS vars
      },
      borderRadius: {
        squircle: "30% 70% 70% 30% / 30% 30% 70% 70%",
        pill: "9999px",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "float-mid": "float 4.5s ease-in-out infinite 1s",
        "float-fast": "float 3.5s ease-in-out infinite 0.5s",
        "fade-up": "fadeUp 0.7s ease forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;