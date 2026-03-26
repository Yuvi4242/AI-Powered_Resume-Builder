/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F5FF',
          100: '#E5EDFF',
          200: '#CDDDFF',
          300: '#A3C2FF',
          400: '#739FFF',
          500: '#4278FF',
          600: '#1767FF',
          700: '#004DE6',
          800: '#003DB8',
          900: '#003399',
        },
        accent: {
          50: '#F0FDFB',
          100: '#CCFBF3',
          200: '#99F6E8',
          300: '#5CEBDC',
          400: '#2BD6C8',
          500: '#00BFA6',
          600: '#009986',
          700: '#007A6D',
          800: '#006158',
          900: '#00524B',
        }
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
