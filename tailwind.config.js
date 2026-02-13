/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pop-pink': '#F0C4D5',      // Fundo Principal
        'pop-burgundy': '#7A1C38',  // Cor do Logo/Botão Forte
        'pop-blue': '#0A3F6B',      // Azul Escuro
        'pop-green': '#144D38',     // Verde Escuro
        'pop-lime': '#C8E068',      // Verde Lima
        'pop-orange': '#E67A48',    // Laranja
        'pop-yellow': '#FDF0A6',    // Amarelo Claro
        'pop-light': '#FDF3F6',     // Off-white rosado
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
