/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dmd-terracotta': '#E07A5F',
        'dmd-beige': '#F4F1DE',
        'dmd-green': '#3D405B',
        'dmd-soft-green': '#81B29A',
        'dmd-cream': '#F2CC8F',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
