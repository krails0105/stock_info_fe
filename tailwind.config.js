/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'stock-red': '#FF4444',
        'stock-blue': '#4444FF',
        'stock-green': '#44FF44',
      },
    },
  },
  plugins: [],
} 