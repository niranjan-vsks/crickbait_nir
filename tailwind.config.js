/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0A0E1A',
        surface: '#111827',
        elevated: '#1a2235',
        'border-dim': '#1F2937',
        orange: '#F97316',
        gold: '#FBBF24',
        'green-live': '#22C55E',
        'red-locked': '#EF4444',
        'grey-muted': '#6B7280',
        'text-primary': '#F9FAFB',
        'text-secondary': '#9CA3AF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      height: {
        'btn-primary': '52px',
        'btn-secondary': '44px',
      },
      borderRadius: {
        card: '1rem',
        pill: '9999px',
        input: '0.5rem',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.4)',
        glow: '0 0 20px rgba(249,115,22,0.3)',
      },
      animation: {
        'pulse-live': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
