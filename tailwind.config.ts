import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#09090B",
          secondary: "#111114",
          card: "#17171C",
          elevated: "#1E1E24",
        },
        accent: {
          purple: "#A78BFA",
          sky: "#38BDF8",
          emerald: "#34D399",
          amber: "#FBBF24",
          rose: "#FB7185",
        },
        text: {
          primary: "#FAFAFA",
          secondary: "#A1A1AA",
          muted: "#71717A",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.08)",
          strong: "rgba(255, 255, 255, 0.16)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(167, 139, 250, 0.14), transparent 60%)",
        "sky-glow":
          "radial-gradient(circle at 85% 20%, rgba(56, 189, 248, 0.10), transparent 50%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        glow: "0 0 30px -5px rgba(167, 139, 250, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
