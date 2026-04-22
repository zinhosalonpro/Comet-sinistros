/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        comet: {
          50:  '#f0f4ff',
          100: '#dde6ff',
          200: '#c3d0ff',
          300: '#9db0fd',
          400: '#7285f9',
          500: '#4f5ef3',
          600: '#3a3ee7',
          700: '#2e2fcc',
          800: '#2929a5',
          900: '#272881',
          950: '#18184c',
        },
      },
    },
  },
  plugins: [],
}
