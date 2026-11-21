/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#06030c',
          900: '#080510',
          800: '#120b24',
          700: '#1b1136',
          600: '#2a1a54',
        },
        gold: {
          300: '#ffe27d',
          400: '#ffd043',
          500: '#e5b021',
        },
        rose: {
          300: '#ffaec5',
          400: '#ff82a3',
          500: '#f43f72',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
