import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F4EE",
        card: "#FFFFFF",
        ink: "#14140F",
        inksoft: "#6B655C",
        muted2: "#8B897E",
        rule: "#E3DFD6",

        darkbg: "#0D0D0B",
        darkcard: "#1B1B17",
        cream: "#F5F4EE",
        mutedlight: "#B5B3A6",
        ruledark: "rgba(255,255,255,0.1)",

        accent: "#D4FF3F",
        accenthover: "#BFE81A",
        accenttint: "#EAFAC0",
        accenttinttext: "#3C4A17",
      },
      fontFamily: {
        serif: ["Space Grotesk", "sans-serif"],
        sans: ["Manrope", "sans-serif"],
        hand: ["Caveat", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
