/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dmd-bg': '#F6F3EE',
        'dmd-blue': '#2B4DBC',
        'dmd-yellow': '#C78A1D',
        'dmd-pink': '#FFBAF7',
        'dmd-lime': '#DCFFA2',
        'dmd-black': '#000000',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
