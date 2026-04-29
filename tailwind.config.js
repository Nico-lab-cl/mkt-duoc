/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        meta: {
          primary: '#1877F2',
          secondary: '#E7F3FF',
          bg: '#F0F2F5',
        },
        google: {
          blue: '#4285F4',
          red: '#EA4335',
          yellow: '#FBBC05',
          green: '#34A853',
        },
        tiktok: {
          black: '#010101',
          red: '#EE1D52',
          cyan: '#69C9D0',
          dark: '#121212',
        },
        brand: {
          navy: '#002B49',
          accent: '#0070BA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
