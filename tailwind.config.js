/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C45C26',
          light: '#D97842',
          dark: '#9E4A1E',
        },
        accent: {
          DEFAULT: '#E8A87C',
          light: '#F0C4A0',
        },
        bg: {
          main: '#FAF7F2',
          card: '#FFFFFF',
        },
        text: {
          main: '#2C2416',
          muted: '#8B7355',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        modal: '0 4px 24px 0 rgba(0,0,0,0.12)',
        fab: '0 4px 16px 0 rgba(45,80,22,0.35)',
      },
      screens: {
        xs: '390px',
      },
    },
  },
  plugins: [],
}