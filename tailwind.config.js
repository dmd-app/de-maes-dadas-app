/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-bg': '#F0F4FF',       // Fundo Azul Bebê
        'soft-blue': '#1E3A8A',     // Azul do Logo
        'soft-purple': '#A855F7',   // Roxo dos Botões
        'soft-pink': '#EC4899',     // Rosa dos Detalhes
        'soft-green': '#84CC16',    // Verde do Copo Cheio
        'soft-orange': '#F97316',   // Laranja do Copo Vazio
        'cup-empty': '#3B82F6',     // Azul - Exausta/Tristeza (0-1)
        'cup-low': '#06B6D4',       // Ciano - Precisando de ajuda (2)
        'cup-rising': '#34D399',    // Verde claro - Melhorando (3-4)
        'cup-balanced': '#22C55E',  // Verde - Equilibrada/Meta (5-6)
        'cup-warm': '#FBBF24',      // Amarelo - Atenção (7)
        'cup-high': '#F97316',      // Laranja - Temperatura subindo (8)
        'cup-full': '#EF4444',      // Vermelho - Raiva/Explosão (9-10)
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
