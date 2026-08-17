/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          200: '#fdf3d0',
          300: '#f9e8b2',
          400: '#eac869',
          500: '#cba135',
          600: '#a37d20',
          700: '#7a5a12',
          800: '#523a0a',
        },
        midnight: '#06070a',
        luxury: {
          black: '#06070a',
          surface: '#0d1017',
          surfaceHover: '#131822',
          charcoal: '#161b26',
          border: 'rgba(203, 161, 53, 0.16)',
          borderHover: 'rgba(203, 161, 53, 0.42)',
          muted: '#94a3b8',
          white: '#f8fafc',
          champagne: '#faebd7'
        }
      },
      fontFamily: {
        alexandria: ['Alexandria', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        marcellus: ['Marcellus', 'serif'],
        sans: ['Outfit', 'Alexandria', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        subtleGlow: 'subtleGlow 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        subtleGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      },
    },
  },
  plugins: [],
}
