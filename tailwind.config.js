/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#07090D',
          light: '#F8FAFC',
        },
        surface: {
          DEFAULT: '#0D1117',
          light: '#FFFFFF',
          elevated: '#111722',
          'elevated-light': '#F1F5F9',
        },
        fintech: {
          mint: '#00F59B',
          'mint-dark': '#00C878',
          'mint-glow': 'rgba(0, 245, 155, 0.15)',
          blue: '#38BDF8',
          'blue-glow': 'rgba(56, 189, 248, 0.15)',
          amber: '#F59E0B',
          'amber-glow': 'rgba(245, 158, 11, 0.15)',
          rose: '#EF4444',
          'rose-glow': 'rgba(239, 68, 68, 0.15)',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          'subtle-light': 'rgba(0, 0, 0, 0.08)',
          highlight: 'rgba(255, 255, 255, 0.16)',
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-mint': '0 0 25px -5px rgba(0, 245, 155, 0.25)',
        'glow-blue': '0 0 25px -5px rgba(56, 189, 248, 0.25)',
        'card-subtle': '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
