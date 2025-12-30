/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        brand: "var(--color-brand)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
