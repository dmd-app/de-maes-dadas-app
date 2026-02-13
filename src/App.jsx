import { useState } from 'react';
import { Flag, Heart, Users, BookOpen, MessageCircle } from 'lucide-react';
import './index.css';

// --- COMPONENTS ---

const Header = () => (
  <header className="p-6 pb-2 flex justify-between items-center bg-pop-pink">
    <div>
      <h1 className="text-3xl font-display font-bold text-pop-burgundy tracking-tighter">DeMãesDadas</h1>
      <p className="text-sm text-pop-burgundy/80 font-sans italic">Aldeia Digital</p>
    </div>
    <div className="w-12 h-12 rounded-full border-2 border-pop-orange bg-pop-yellow flex items-center justify-center text-pop-orange font-bold shadow-sm font-sans text-lg">
      RC
    </div>
  </header>
);

const MoodDashboard = () => {
  const [mood, setMood] = useState(5);
  
  const getMoodColor = (val) => {
    if (val < 4) return 'bg-pop-blue border-pop-blue text-white'; // Low mood
    if (val > 7) return 'bg-pop-burgundy border-pop-burgundy text-white';   // High stress/anger
    return 'bg-pop-light border-pop-burgundy text-pop-burgundy';                 // Neutral
  };

  const getMoodText = (val) => {
    if (val < 4) return "Copo Vazio (Exausta)";
    if (val > 7) return "Transbordando (Raiva)";
    return "Equilibrada (Por enquanto)";
  };

  return (
    <section className="px-6 py-4 bg-pop-pink">
      <div className={`p-6 rounded-[2rem] border-2 shadow-sm transition-colors duration-500 ${getMoodColor(mood)}`}>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-display font-bold inherit">Como está seu copo hoje?</h2>
            <p className="text-sm opacity-80 font-sans mt-1">{getMoodText(mood)}</p>
          </div>
          <span className="text-2xl font-display font-bold inherit">{mood}/10</span>
        </div>
        
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={mood} 
          onChange={(e) => setMood(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200/50 rounded-lg appearance-none cursor-pointer accent-current"
        />
        <div className="flex justify-between text-xs opacity-70 mt-2 font-bold">
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
    <section className="px-6 py-2 bg-pop-pink">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-pop-blue text-white border-0 py-5 rounded-full shadow-md flex items-center justify-center gap-3 transform active:scale-95 transition-all hover:bg-pop-blue/90 font-display"
      >
        <span className="font-bold text-xl tracking-wide">ABRIR O CORAÇÃO</span>
      </button>
      
      {isOpen && (
        <div className="mt-4 p-6 bg-pop-light rounded-[2rem] animate-fade-in shadow-xl">
          <textarea 
            className="w-full p-4 border-2 border-pop-burgundy/20 rounded-xl focus:ring-2 focus:ring-pop-burgundy focus:outline-none text-pop-burgundy bg-white font-sans"
            rows="4"
            placeholder="O que está pesando aí dentro? Desabafe..."
          ></textarea>
          <div className="flex justify-end mt-4 gap-3">
            <button 
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 text-pop-burgundy font-bold rounded-full hover:bg-pop-burgundy/5 transition-colors"
            >
              Cancelar
            </button>
            <button className="px-6 py-3 bg-pop-burgundy text-pop-light rounded-full font-bold shadow-md hover:bg-pop-burgundy/90">
              Enviar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

const ActionButtons = () => (
  <section className="px-6 py-4 grid grid-cols-2 gap-4 bg-pop-pink">
    <button className="p-5 bg-pop-green rounded-full shadow-md flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform">
      <Users size={24} className="text-pop-lime" />
      <span className="font-sans font-bold text-sm text-pop-lime tracking-wide">Rodas de Conversa</span>
    </button>
    
    <button className="p-5 bg-pop-orange rounded-full shadow-md flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform">
      <BookOpen size={24} className="text-white" />
      <span className="font-sans font-bold text-sm text-white tracking-wide">Biblioteca</span>
    </button>
  </section>
);

const ContentCarousel = ({ title, items }) => (
  <section className="py-6 bg-pop-pink">
    <div className="px-6 mb-4 flex justify-between items-center">
      <h3 className="text-xl font-display font-bold text-pop-burgundy">{title}</h3>
      <a href="#" className="text-xs font-sans font-bold text-pop-blue uppercase tracking-wider bg-white/50 px-3 py-1 rounded-full">Ver tudo</a>
    </div>
    
    <div className="flex overflow-x-auto px-6 gap-4 pb-8 snap-x hide-scrollbar">
      {items.map((item, idx) => (
        <div key={idx} className={`min-w-[260px] h-72 snap-center bg-pop-light rounded-[2.5rem] shadow-sm overflow-hidden flex-shrink-0 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col`}>
          <div className={`h-36 relative bg-gradient-to-br ${item.color} flex-shrink-0`}>
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="absolute bottom-0 left-0 p-5 w-full">
              <span className="text-pop-burgundy text-[10px] font-sans font-bold uppercase tracking-wider bg-white/80 px-3 py-1 rounded-full shadow-sm">
                {item.tag}
              </span>
            </div>
          </div>
          <div className="p-5 bg-pop-light flex flex-col flex-grow">
            <h4 className="font-display font-bold text-lg text-pop-burgundy mb-2 leading-tight">{item.title}</h4>
            <p className="text-xs font-sans text-pop-burgundy/70 line-clamp-3 leading-relaxed">{item.desc}</p>
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
      color: "from-pop-yellow to-yellow-200"
    },
    {
      title: "A Luz Vermelha da Raiva",
      desc: "Entenda por que você explode e como lidar com a culpa depois.",
      tag: "Psicologia",
      color: "from-pop-orange/50 to-orange-200"
    },
    {
      title: "Quem Cuida de Quem Cuida?",
      desc: "A política do cuidado e a solidão da mulher moderna.",
      tag: "Aldeia",
      color: "from-pop-green/50 to-green-200"
    }
  ];

  const tribos = [
    {
      title: "Mães de Bebês (0-1 ano)",
      desc: "Ninguém dorme aqui. Apoio para o puerpério imediato.",
      tag: "Tribo",
      color: "from-pop-blue/50 to-blue-200"
    },
    {
      title: "Mães Solo",
      desc: "A força da alcateia para quem carrega o piano sozinha.",
      tag: "Tribo",
      color: "from-purple-200 to-purple-300"
    }
  ];

  return (
    <div className="min-h-screen bg-pop-pink pb-24 max-w-md mx-auto shadow-2xl overflow-hidden font-sans text-black">
      <Header />
      <MoodDashboard />
      <PanicButton />
      <ActionButtons />
      <ContentCarousel title="Jornadas de Cura" items={jornadas} />
      <ContentCarousel title="Encontre Sua Tribo" items={tribos} />
      
      {/* Footer Navigation - Rounded Pill Style */}
      <nav className="fixed bottom-6 left-6 right-6 bg-pop-burgundy rounded-full px-6 py-4 flex justify-between items-center text-xs font-bold text-pop-pink/50 max-w-[calc(100%-3rem)] mx-auto z-50 shadow-2xl">
        <button className="flex flex-col items-center gap-1 text-pop-yellow transform scale-105">
          <Heart size={24} fill="#FDF0A6" />
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-white transition-colors">
          <MessageCircle size={24} />
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-white transition-colors">
          <Users size={24} />
        </button>
      </nav>
    </div>
  );
};

export default App;
