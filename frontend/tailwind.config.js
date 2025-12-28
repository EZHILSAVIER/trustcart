/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // Vibrant Blue (blue-600) for high visibility
        secondary: "#475569", // slate-600
        accent: "#0f172a", // slate-900
      }
    },
  },
  plugins: [],
}
