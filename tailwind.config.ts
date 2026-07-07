import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Deep medical azure — trust & clarity, with Tunisian red accent
        primary: {
          50: "#eff5ff",
          100: "#dbe8fe",
          200: "#bfd6fe",
          300: "#93b8fd",
          400: "#5b8ef8",
          500: "#3068ef",
          600: "#1c4fdb",
          700: "#1a40b8",
          800: "#1b3891",
          900: "#1a3173",
        },
        accent: {
          500: "#e70013",
          600: "#c40010",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: [
          "Iowan Old Style",
          "Palatino Linotype",
          "Palatino",
          "Book Antiqua",
          "Georgia",
          "serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
