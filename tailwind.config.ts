/** @type {import('tailwindcss').Config} */
import { type Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#800020", // burgundy
        secondary: "#ffffff", // white
        background: "#ffffff",
        foreground: "#171717",
        darkBackground: "#0a0a0a",
        darkForeground: "#ededed",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        mono: ["monospace"],
      },
    },
  },
  plugins: [],
}

export default config