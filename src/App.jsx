import { useState } from 'react';
import { Flag, Heart, Users, BookOpen, MessageCircle } from 'lucide-react';
import './index.css';

// --- COMPONENTS ---

const Header = () => (
  <header className="p-6 pb-2 flex justify-between items-center bg-dmd-bg">
    <div>
      <h1 className="text-3xl font-display font-bold text-dmd-black tracking-tighter">DeMãesDadas</h1>
      <p className="text-sm text-dmd-black font-sans italic">Aldeia Digital</p>
    </div>
    <div className="w-10 h-10 rounded-full border-2 border-dmd-black bg-dmd-blue flex items-center justify-center text-white font-bold shadow-md font-sans">
      RC
    </div>
  </header>
);

const MoodDashboard = () => {
  const [mood, setMood] = useState(5);
  
  const getMoodColor = (val) => {
    if (val < 4) return 'bg-dmd-lime border-dmd-black'; // Low mood
    if (val > 7) return 'bg-dmd-pink border-dmd-black';   // High stress/anger
    return 'bg-white border-dmd-black';                 // Neutral
  };

  const getMoodText = (val) => {
    if (val < 4) return "Copo Vazio (Exausta)";
    if (val > 7) return "Transbordando (Raiva)";
    return "Equilibrada (Por enquanto)";
  };

  return (
    <section className="px-6 py-4 bg-dmd-bg">
      <div className={`p-6 rounded-2xl border-2 shadow-md transition-colors duration-500 ${getMoodColor(mood)}`}>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-display font-bold text-dmd-black">Como está seu copo hoje?</h2>
            <p className="text-sm text-gray-800 font-sans mt-1">{getMoodText(mood)}</p>
          </div>
          <span className="text-2xl font-display font-bold text-dmd-black">{mood}/10</span>
        </div>
        
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={mood} 
          onChange={(e) => setMood(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-dmd-blue border border-black"
        />
        <div className="flex justify-between text-xs text-black mt-2">
          <span>Vazio</span>
          <span>Cheio</span>
        </div>
      </div>
    </section>
  );
};

const PanicButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="px-6 py-2 bg-dmd-bg">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-dmd-yellow text-dmd-bg border-2 border-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 transform active:scale-95 transition-all hover:bg-yellow-600 font-display"
      >
        <Flag size={24} color="#F6F3EE" />
        <span className="font-bold text-lg tracking-wide">ABRIR O CORAÇÃO</span>
      </button>
      
      {isOpen && (
        <div className="mt-4 p-4 bg-white rounded-xl border-2 border-black animate-fade-in shadow-md">
          <textarea 
            className="w-full p-3 border-2 border-black rounded-lg focus:ring-2 focus:ring-dmd-blue focus:outline-none text-black bg-gray-50"
            rows="4"
            placeholder="O que está pesando aí dentro? Desabafe..."
          ></textarea>
          <div className="flex justify-end mt-2 gap-2">
            <button 
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-black hover:text-gray-700 font-bold border-2 border-transparent hover:border-black rounded-lg"
            >
              Cancelar
            </button>
            <button className="px-4 py-2 bg-dmd-blue text-dmd-bg border-2 border-black rounded-lg font-bold hover:bg-blue-800 shadow-md">
              Enviar para a Aldeia
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

const ActionButtons = () => (
  <section className="px-6 py-4 grid grid-cols-2 gap-4 bg-dmd-bg">
    <button className="p-4 bg-dmd-pink rounded-xl shadow-md border-2 border-black flex flex-col items-center gap-2 hover:translate-y-1 transition-transform">
      <div className="w-10 h-10 bg-dmd-bg border-2 border-black rounded-full flex items-center justify-center text-black">
        <Users size={20} />
      </div>
      <span className="font-display font-bold text-sm text-dmd-bg tracking-wide drop-shadow-sm">Rodas de Conversa</span>
    </button>
    
    <button className="p-4 bg-dmd-lime rounded-xl shadow-md border-2 border-black flex flex-col items-center gap-2 hover:translate-y-1 transition-transform">
      <div className="w-10 h-10 bg-dmd-bg border-2 border-black rounded-full flex items-center justify-center text-black">
        <BookOpen size={20} />
      </div>
      <span className="font-display font-bold text-sm text-dmd-bg tracking-wide drop-shadow-sm">Biblioteca (O Espelho)</span>
    </button>
  </section>
);

const ContentCarousel = ({ title, items }) => (
  <section className="py-6 border-t-2 border-black bg-dmd-bg">
    <div className="px-6 mb-4 flex justify-between items-center">
      <h3 className="text-xl font-display font-bold text-black">{title}</h3>
      <a href="#" className="text-xs font-sans font-bold text-dmd-blue uppercase tracking-wider underline decoration-2 decoration-dmd-yellow">Ver tudo</a>
    </div>
    
    <div className="flex overflow-x-auto px-6 gap-4 pb-4 snap-x hide-scrollbar">
      {items.map((item, idx) => (
        <div key={idx} className={`min-w-[280px] snap-center bg-white rounded-xl border-2 border-black shadow-md overflow-hidden flex-shrink-0 hover:shadow-xl transition-shadow`}>
          <div className={`h-40 relative bg-gradient-to-br ${item.color}`}>
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <span className="text-black text-xs font-sans font-bold uppercase tracking-wider bg-white border-2 border-black px-2 py-1 rounded shadow-sm">
                {item.tag}
              </span>
            </div>
          </div>
          <div className="p-4 bg-white">
            <h4 className="font-display font-bold text-lg text-black mb-1 leading-tight">{item.title}</h4>
            <p className="text-sm font-sans text-gray-600 line-clamp-2">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const App = () => {
  const jornadas = [
    {
      title: "O Luto da Identidade",
      desc: "Quem era você antes de ser mãe? Vamos reencontrar essa mulher.",
      tag: "Divã",
      color: "from-dmd-yellow to-yellow-200"
    },
    {
      title: "A Luz Vermelha da Raiva",
      desc: "Entenda por que você explode e como lidar com a culpa depois.",
      tag: "Psicologia",
      color: "from-dmd-pink to-pink-200"
    },
    {
      title: "Quem Cuida de Quem Cuida?",
      desc: "A política do cuidado e a solidão da mulher moderna.",
      tag: "Aldeia",
      color: "from-dmd-lime to-green-200"
    }
  ];

  const tribos = [
    {
      title: "Mães de Bebês (0-1 ano)",
      desc: "Ninguém dorme aqui. Apoio para o puerpério imediato.",
      tag: "Tribo",
      color: "from-blue-200 to-blue-400"
    },
    {
      title: "Mães Solo",
      desc: "A força da alcateia para quem carrega o piano sozinha.",
      tag: "Tribo",
      color: "from-purple-200 to-purple-400"
    }
  ];

  return (
    <div className="min-h-screen bg-dmd-bg pb-20 max-w-md mx-auto shadow-2xl border-x-2 border-black overflow-hidden font-sans text-black">
      <Header />
      <MoodDashboard />
      <PanicButton />
      <ActionButtons />
      <ContentCarousel title="Jornadas de Cura" items={jornadas} />
      <ContentCarousel title="Encontre Sua Tribo" items={tribos} />
      
      {/* Footer Navigation */}
      <div className="fixed bottom-16 left-0 right-0 text-center text-[10px] font-bold text-red-500 bg-yellow-200 z-50">
        VERSÃO 2.0 - PELE NOVA (TESTE)
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black px-6 py-3 flex justify-between items-center text-xs font-bold text-gray-400 max-w-md mx-auto z-50">
        <button className="flex flex-col items-center gap-1 text-dmd-blue transform scale-105">
          <div className="p-1 bg-dmd-bg border-2 border-black rounded-full shadow-sm">
            <Heart size={20} fill="#2B4DBC" strokeWidth={2.5} />
          </div>
          <span className="text-black">Início</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-black transition-colors group">
          <MessageCircle size={20} className="group-hover:stroke-[2.5px]" />
          <span>Aldeia</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-black transition-colors group">
          <Users size={20} className="group-hover:stroke-[2.5px]" />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
