/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-bg': '#FFF5F9',
        'soft-blue': '#1E3A8A',
        'soft-purple': '#A855F7',
        'soft-pink': '#EC4899',
        'soft-green': '#84CC16',
        'soft-orange': '#F97316',
        'cup-empty': '#3B82F6',
        'cup-low': '#06B6D4',
        'cup-rising': '#34D399',
        'cup-balanced': '#22C55E',
        'cup-warm': '#FBBF24',
        'cup-high': '#F97316',
        'cup-full': '#EF4444',
        'soft-gray': '#64748B',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
