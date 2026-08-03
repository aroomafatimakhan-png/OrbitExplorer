import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#05070D",
        "void-deep": "#020306",
        panel: "rgba(12,16,28,0.55)",
        "panel-border": "rgba(143,217,255,0.18)",
        starlight: "#8FD9FF",
        signal: "#FFB86B",
        violet: "#7C6CF2",
        mist: "#E8ECF5",
        "mist-dim": "#8892A8",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        hud: "0 0 0 1px rgba(143,217,255,0.15), 0 8px 40px rgba(0,0,0,0.5)",
        glow: "0 0 24px rgba(143,217,255,0.35)",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        pulseRing: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.04)" },
        },
      },
      animation: {
        scan: "scan 3s linear infinite",
        pulseRing: "pulseRing 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
