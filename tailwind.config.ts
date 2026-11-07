import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#060608",
        obsidian: "#0A0A0E",
        truss: "#111115",
        gunmetal: "#18181F",
        steel: "#262630",
        crimson: {
          DEFAULT: "#DC143C",
          bright: "#F01E46",
          deep: "#8C0B25",
        },
        tungsten: {
          DEFAULT: "#FF6200",
          warm: "#FF7A26",
        },
        chalk: "#F6F5F2",
        bone: "#D6D3CD",
        ash: "#9E9A93",
      },
      fontFamily: {
        display: ["'Anton'", "sans-serif"],
        condensed: ["'Barlow Condensed'", "sans-serif"],
        sans: ["'Archivo'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        // Concentric Liquid Glass radii: panel → inset media → controls
        glass: "28px",
        "glass-sm": "20px",
        "glass-xs": "14px",
      },
      boxShadow: {
        stage: "0 24px 64px -12px rgba(0, 0, 0, 0.85)",
        proscenium: "0 32px 80px -16px rgba(220, 20, 60, 0.22), 0 20px 50px -10px rgba(0, 0, 0, 0.9)",
        deck: "0 18px 45px -8px rgba(0, 0, 0, 0.8)",
      },
    },
  },
  plugins: [],
};

export default config;
