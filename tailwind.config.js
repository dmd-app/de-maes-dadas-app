/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-bg': '#FFF5F9',       // Fundo Rosa Bebê
        'soft-blue': '#1E3A8A',     // Azul do Logo
        'soft-purple': '#A855F7',   // Roxo dos Botões
        'soft-pink': '#EC4899',     // Rosa dos Detalhes
        'soft-green': '#84CC16',    // Verde do Copo Cheio
        'soft-orange': '#F97316',   // Laranja do Copo Vazio
        'soft-gray': '#64748B',     // Texto Secundário
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
