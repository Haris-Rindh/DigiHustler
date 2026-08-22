/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        breeze: {
          dark: '#071e26',       // Deepest Ocean Navy (Background)
          surface: '#0d2833',    // Card Background
          elevated: '#113240',   // Modal & Hover Background
          border: '#1e4a5d',     // Subtle Crisp Border
          teal: '#1a7a8c',       // Ocean Teal (Primary Action Accent)
          'teal-hover': '#156575',
          sky: '#bde0fe',        // Sky Breeze (Soft Accent & Status Pills)
          'sky-dark': '#8ecae6',
          mist: '#e2e8f0',       // Ice Mist Text / Subtle Elements
          white: '#ffffff',      // Pure White Text & High Contrast
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
