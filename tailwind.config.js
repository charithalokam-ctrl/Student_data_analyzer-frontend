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
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          bg: '#090d16',
          surface: '#0f172a',
          card: '#131e33',
          border: '#1e293b',
          muted: '#334155'
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'flame-flicker': 'flameFlicker 1.8s infinite ease-in-out',
        'float-slow': 'floatSlow 4s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(56, 189, 248, 0.25)' },
          '50%': { boxShadow: '0 0 35px rgba(56, 189, 248, 0.65)' },
        },
        flameFlicker: {
          '0%, 100%': { transform: 'scale(1) rotate(-1deg)', filter: 'drop-shadow(0 0 12px rgba(249, 115, 22, 0.7))' },
          '50%': { transform: 'scale(1.08) rotate(2deg)', filter: 'drop-shadow(0 0 24px rgba(239, 68, 68, 0.9))' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
