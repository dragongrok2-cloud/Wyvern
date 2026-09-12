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
        wyvern: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316", // огонь
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        scale: {
          900: "#0f0f12",
          800: "#18181b",
          700: "#27272a",
          600: "#3f3f46",
        },
      },
      fontFamily: {
        dragon: ["var(--font-dragon)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
