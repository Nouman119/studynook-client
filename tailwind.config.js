/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366F1",
          dark: "#4F46E5",
          soft: "#EEF2FF",
        },
        accent: "#0EA5E9",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        surface: {
          light: "#FAFAFB",
          card: "#FFFFFF",
          dark: "#09090B",
        }
      },
    },
  },
  plugins: [],
};