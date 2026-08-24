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
          dark: '#071e26',
          surface: '#0d2833',
          elevated: '#113240',
          border: '#1e4a5d',
          teal: '#1a7a8c',
          'teal-hover': '#156575',
          sky: '#bde0fe',
          'sky-dark': '#8ecae6',
          mist: '#e2e8f0',
          white: '#ffffff',
        }
      },
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Syne', 'Outfit', 'sans-serif'],
        mono:    ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'marquee':       'marquee 28s linear infinite',
        'marquee-slow':  'marquee 40s linear infinite',
        'glow-pulse':    'glow-pulse 4s ease-in-out infinite',
        'border-spin':   'border-spin 3s linear infinite',
        'fade-up':       'fade-up 0.6s ease forwards',
        'grid-drift':    'grid-drift 20s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '0.7' },
        },
        'border-spin': {
          '0%':   { '--angle': '0deg' },
          '100%': { '--angle': '360deg' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'grid-drift': {
          '0%, 100%': { transform: 'translate(-50%, -50%) rotateX(50deg) translateZ(0px)' },
          '50%':      { transform: 'translate(-50%, -50%) rotateX(50deg) translateZ(20px)' },
        },
      },
    },
  },
  plugins: [],
}
