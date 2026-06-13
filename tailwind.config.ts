import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./store/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        arabic: ["var(--font-arabic)", "Tahoma", "Arial", "sans-serif"]
      },
      colors: {
        emeraldDeep: "#0F5132",
        goldRich: "#D4AF37",
        ivoryWarm: "#F8F5EF",
        charcoal: "#1C1C1C"
      },
      boxShadow: {
        museum: "0 24px 80px rgba(15, 81, 50, 0.16)",
        gold: "0 0 0 1px rgba(212, 175, 55, 0.35), 0 18px 44px rgba(15, 81, 50, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
