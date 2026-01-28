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
      colors: {
        primary: {
          person1: "var(--primary-person1)", // Azul para persona 1
          person2: "var(--primary-person2)", // Rosa para persona 2
        },
      },
    },
  },
  plugins: [],
};
export default config;
