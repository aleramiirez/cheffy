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
          DEFAULT: '#2D5016',
          light: '#4A7C28',
          dark: '#1E3A0F',
        },
        accent: {
          DEFAULT: '#C9A84C',
          light: '#D9BC7A',
        },
        bg: {
          main: '#FAFAF7',
          card: '#FFFFFF',
        },
        text: {
          main: '#1C1C1E',
          muted: '#6B7280',
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