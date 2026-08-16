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
          300: '#f5df88',
          400: '#e5c365',
          500: '#d4af37',
          600: '#aa841e',
          700: '#806114',
        },
        midnight: '#0a0c10',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Cairo', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
