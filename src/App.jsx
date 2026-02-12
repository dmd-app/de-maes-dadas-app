import { useState } from 'react';
import { Flag, Heart, Users, BookOpen, MessageCircle } from 'lucide-react';
import './index.css';

// --- COMPONENTS ---

const Header = () => (
  <header className="p-6 pb-2 flex justify-between items-center">
    <div>
      <h1 className="text-2xl font-bold text-dmd-terracotta">De Mães Dadas</h1>
      <p className="text-sm text-gray-500 font-serif italic">Aldeia Digital</p>
    </div>
    <div className="w-10 h-10 rounded-full bg-dmd-terracotta flex items-center justify-center text-white font-bold">
      RC
    </div>
  </header>
);

const MoodDashboard = () => {
  const [mood, setMood] = useState(5);
  
  const getMoodColor = (val) => {
    if (val < 4) return 'bg-blue-100 border-blue-300'; // Low mood
    if (val > 7) return 'bg-red-100 border-red-300';   // High stress/anger
    return 'bg-white border-gray-200';                 // Neutral
  };

  const getMoodText = (val) => {
    if (val < 4) return "Copo Vazio (Exausta)";
    if (val > 7) return "Transbordando (Raiva)";
    return "Equilibrada (Por enquanto)";
  };

  return (
    <section className="px-6 py-4">
      <div className={`p-6 rounded-2xl shadow-sm border transition-colors duration-500 ${getMoodColor(mood)}`}>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-dmd-green">Como está seu copo hoje?</h2>
            <p className="text-sm text-gray-600 mt-1">{getMoodText(mood)}</p>
          </div>
          <span className="text-2xl font-bold text-dmd-terracotta">{mood}/10</span>
        </div>
        
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={mood} 
          onChange={(e) => setMood(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-dmd-terracotta"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
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
    <section className="px-6 py-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-dmd-terracotta text-white py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 transform active:scale-95 transition-all"
      >
        <Flag size={24} />
        <span className="font-bold text-lg tracking-wide">ABRIR O CORAÇÃO</span>
      </button>
      
      {isOpen && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-dmd-terracotta animate-fade-in">
          <textarea 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-dmd-terracotta focus:outline-none text-gray-700"
            rows="4"
            placeholder="O que está pesando aí dentro? Desabafe..."
          ></textarea>
          <div className="flex justify-end mt-2 gap-2">
            <button 
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
            <button className="px-4 py-2 bg-dmd-green text-white rounded-lg font-medium">
              Enviar para a Aldeia
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

const ActionButtons = () => (
  <section className="px-6 py-4 grid grid-cols-2 gap-4">
    <button className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
      <div className="w-10 h-10 bg-dmd-cream rounded-full flex items-center justify-center text-dmd-green">
        <Users size={20} />
      </div>
      <span className="font-bold text-sm text-dmd-green">Rodas de Conversa</span>
    </button>
    
    <button className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
      <div className="w-10 h-10 bg-dmd-soft-green rounded-full flex items-center justify-center text-white">
        <BookOpen size={20} />
      </div>
      <span className="font-bold text-sm text-dmd-green">Biblioteca (O Espelho)</span>
    </button>
  </section>
);

const ContentCarousel = ({ title, items }) => (
  <section className="py-6 border-t border-gray-200">
    <div className="px-6 mb-4 flex justify-between items-center">
      <h3 className="text-xl font-serif font-bold text-dmd-green">{title}</h3>
      <a href="#" className="text-xs font-bold text-dmd-terracotta uppercase tracking-wider">Ver tudo</a>
    </div>
    
    <div className="flex overflow-x-auto px-6 gap-4 pb-4 snap-x hide-scrollbar">
      {items.map((item, idx) => (
        <div key={idx} className="min-w-[280px] snap-center bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0">
          <div className="h-40 bg-gray-200 relative">
            {/* Placeholder for images - using gradients for now */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`}></div>
            <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
              <span className="text-white text-xs font-bold uppercase tracking-wider bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                {item.tag}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h4 className="font-serif font-bold text-lg text-dmd-green mb-1 leading-tight">{item.title}</h4>
            <p className="text-sm text-gray-500 line-clamp-2">{item.desc}</p>
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
      color: "from-orange-100 to-orange-300"
    },
    {
      title: "A Luz Vermelha da Raiva",
      desc: "Entenda por que você explode e como lidar com a culpa depois.",
      tag: "Psicologia",
      color: "from-red-100 to-red-300"
    },
    {
      title: "Quem Cuida de Quem Cuida?",
      desc: "A política do cuidado e a solidão da mulher moderna.",
      tag: "Aldeia",
      color: "from-green-100 to-green-300"
    }
  ];

  const tribos = [
    {
      title: "Mães de Bebês (0-1 ano)",
      desc: "Ninguém dorme aqui. Apoio para o puerpério imediato.",
      tag: "Tribo",
      color: "from-purple-100 to-purple-300"
    },
    {
      title: "Mães Solo",
      desc: "A força da alcateia para quem carrega o piano sozinha.",
      tag: "Tribo",
      color: "from-blue-100 to-blue-300"
    }
  ];

  return (
    <div className="min-h-screen bg-dmd-beige pb-20 max-w-md mx-auto shadow-2xl overflow-hidden">
      <Header />
      <MoodDashboard />
      <PanicButton />
      <ActionButtons />
      <ContentCarousel title="Jornadas de Cura" items={jornadas} />
      <ContentCarousel title="Encontre Sua Tribo" items={tribos} />
      
      {/* Footer Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center text-xs font-medium text-gray-400 max-w-md mx-auto">
        <button className="flex flex-col items-center gap-1 text-dmd-terracotta">
          <div className="p-1 bg-orange-50 rounded-full">
            <Heart size={20} fill="#E07A5F" />
          </div>
          <span>Início</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-dmd-green">
          <MessageCircle size={20} />
          <span>Aldeia</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-dmd-green">
          <Users size={20} />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
