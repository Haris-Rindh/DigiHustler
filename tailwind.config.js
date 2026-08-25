/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: 'var(--bg-page)',
        surface: 'var(--bg-surface)',
        subtle: 'var(--bg-subtle)',
        'border-subtle': 'var(--border-subtle)',
        'border-hover': 'var(--border-hover)',
        heading: 'var(--text-heading)',
        body: 'var(--text-body)',
        muted: 'var(--text-muted)',
        dim: 'var(--text-dim)',
        brand: {
          DEFAULT: 'var(--brand-teal)',
          hover: 'var(--brand-teal-hover)',
          text: 'var(--brand-teal-text)',
          subtle: 'var(--brand-teal-subtle)',
        },
        status: {
          error: 'var(--color-status-error)',
          success: 'var(--color-status-success)',
          warning: 'var(--color-status-warning)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
