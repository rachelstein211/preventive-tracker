/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: "#0EA5E9",      // primary blue
        ink: "#111827",        // text
        canvas: "#F3F4F6",     // background
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06)", // subtle shadow
      },
    },
  },
  plugins: [],
};