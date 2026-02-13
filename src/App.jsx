import { useState } from 'react';
import { Flag, Heart, Users, BookOpen, MessageCircle, User, X } from 'lucide-react';
import './index.css';

// --- COMPONENTS ---

const Header = () => (
  <header className="p-6 pb-2 flex justify-between items-start bg-soft-bg">
    <div>
      <h1 className="text-3xl font-display font-bold text-soft-blue tracking-tight">DeMãesDadas</h1>
      <p className="text-sm text-soft-pink font-sans font-medium">Aldeia Digital</p>
      <div className="mt-6">
        <p className="text-lg text-soft-blue font-sans">Bem-vinda, Mamãe 💗</p>
      </div>
    </div>
    <div className="p-2 rounded-full border-2 border-soft-pink text-soft-pink">
      <User size={24} />
    </div>
  </header>
);

const MoodCup = () => {
  const [mood, setMood] = useState(5);
  
  // Logic: 0 (Empty/Sad/Orange) -> 10 (Full/Happy/Green)
  const getCupColor = (val) => {
    if (val < 4) return 'bg-soft-orange'; 
    if (val > 7) return 'bg-soft-green';
    return 'bg-[#A3E635]'; // Lime green for middle
  };

  return (
    <section className="px-6 py-2 bg-soft-bg">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
        <h2 className="text-gray-700 font-sans mb-6">Como está seu copo hoje?</h2>
        
        {/* The Visual Cup */}
        <div className="relative w-32 h-44 border-x-4 border-b-4 border-gray-200 rounded-b-2xl mb-6 overflow-hidden">
          {/* Liquid */}
          <div 
            className={`absolute bottom-0 left-0 w-full transition-all duration-500 ease-out ${getCupColor(mood)}`}
            style={{ height: `${mood * 10}%` }}
          >
            {/* Surface Line */}
            <div className="w-full h-1 bg-white/30 absolute top-0"></div>
          </div>
        </div>

        {/* The Badge */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-4 transition-colors ${getCupColor(mood)}`}>
          {mood}
        </div>

        {/* Slider */}
        <div className="w-full relative">
          {/* Gradient Track Background */}
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-soft-orange via-yellow-400 to-soft-green absolute top-2"></div>
          <input 
            type="range" 
            min="0" 
            max="10" 
            value={mood} 
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer relative z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-soft-pink [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>
        
        <div className="w-full flex justify-between text-xs text-gray-400 mt-2 font-medium">
          <span>0 - Vazio</span>
          <span>10 - Cheio</span>
        </div>
      </div>
    </section>
  );
};

const ActionGrid = () => {
  const [isPanicOpen, setIsPanicOpen] = useState(false);

  return (
    <>
      <section className="px-6 py-4 grid grid-cols-2 gap-4 bg-soft-bg">
        <button 
          onClick={() => setIsPanicOpen(true)}
          className="col-span-2 bg-gradient-to-r from-[#FF66C4] to-[#B946FF] text-white p-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all"
        >
          <Heart fill="white" size={20} />
          <span className="font-bold tracking-wide">ABRIR O CORAÇÃO</span>
        </button>

        <button className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-soft-pink">
            <MessageCircle size={24} />
          </div>
          <span className="text-gray-700 font-sans font-medium text-sm text-center">Rodas de Conversa</span>
        </button>
        
        <button className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-soft-purple">
            <BookOpen size={24} />
          </div>
          <span className="text-gray-700 font-sans font-medium text-sm text-center">Biblioteca (O Espelho)</span>
        </button>
      </section>

      {/* Panic Modal Overlay */}
      {isPanicOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl">
            {/* Header Gradient */}
            <div className="bg-gradient-to-r from-[#FF66C4] to-[#B946FF] p-6 text-center relative">
              <h3 className="text-white font-bold text-lg uppercase tracking-wider">Abrir o Coração</h3>
              <button onClick={() => setIsPanicOpen(false)} className="absolute top-6 right-6 text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 flex flex-col items-center">
              <Heart size={48} className="text-[#FF66C4] mb-4 fill-[#FF66C4]" />
              <h4 className="text-gray-800 font-bold mb-1">O que está pesando aí dentro?</h4>
              <p className="text-gray-400 text-sm mb-6">Desabafe...</p>
              
              <textarea 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF66C4] focus:outline-none text-gray-700 resize-none h-32 mb-6"
                placeholder="Escreva aqui seus sentimentos..."
              ></textarea>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setIsPanicOpen(false)}
                  className="flex-1 py-3 text-gray-500 font-medium rounded-full border border-gray-200 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button className="flex-1 py-3 bg-gradient-to-r from-[#FF66C4] to-[#B946FF] text-white font-bold rounded-full shadow-md">
                  Enviar para a Aldeia
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ContentSection = ({ title, items, badgeColor }) => (
  <section className="py-6 bg-soft-bg">
    <div className="px-6 mb-4 flex justify-between items-center">
      <h3 className="text-lg font-sans font-bold text-gray-800">{title}</h3>
      <a href="#" className="text-xs font-bold text-[#FF66C4] uppercase tracking-wider">Ver tudo</a>
    </div>
    
    <div className="flex overflow-x-auto px-6 gap-4 pb-8 snap-x hide-scrollbar">
      {items.map((item, idx) => (
        <div key={idx} className="min-w-[240px] snap-center bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0 hover:shadow-md transition-all flex flex-col">
          {/* Card Image Area - imitating illustrations with gradients/patterns */}
          <div className={`h-32 relative ${item.bgClass} flex items-center justify-center overflow-hidden`}>
             <span className={`absolute top-4 left-4 text-[10px] font-bold text-white px-3 py-1 rounded-full ${badgeColor} z-10`}>
                {item.tag}
             </span>
             {/* Abstract Shapes (CSS) */}
             <div className="w-24 h-24 rounded-full bg-white/20 blur-2xl absolute -top-4 -right-4"></div>
             <div className="w-32 h-32 rounded-full bg-black/5 blur-3xl absolute -bottom-10 -left-10"></div>
          </div>
          
          <div className="p-5">
            <h4 className="font-sans font-bold text-gray-800 mb-2">{item.title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const App = () => {
  const trilhas = [
    {
      title: "Quem Cuida de Quem Cuida?",
      desc: "A política do cuidado e a solidão da mulher moderna.",
      tag: "ALDEIA",
      bgClass: "bg-[#EAD6C6]" // Beige/Earth tone
    },
    {
      title: "O Luto da Identidade",
      desc: "Quem era você antes de ser mãe? Vamos reencontrar essa mulher.",
      tag: "DIVÃ",
      bgClass: "bg-gradient-to-br from-pink-200 to-red-100" 
    },
    {
      title: "A Luz Vermelha da Raiva",
      desc: "Entenda por que você explode e como lidar com a culpa.",
      tag: "PSICOLOGIA",
      bgClass: "bg-gradient-to-br from-yellow-200 to-orange-100"
    }
  ];

  const tribos = [
    {
      title: "Mães Solo",
      desc: "A força da alcateia para quem carrega o piano sozinha.",
      tag: "TRIBO",
      bgClass: "bg-gradient-to-br from-[#d946ef] to-[#8b5cf6]" // Purple/Pink Gradient like screenshot
    },
    {
      title: "Mães de Bebês",
      desc: "Ninguém dorme aqui. Apoio para o puerpério imediato.",
      tag: "TRIBO",
      bgClass: "bg-gradient-to-br from-blue-300 to-blue-500" // Blue Gradient
    }
  ];

  return (
    <div className="min-h-screen bg-soft-bg pb-24 max-w-md mx-auto shadow-2xl font-sans text-gray-800">
      <Header />
      <MoodCup />
      <ActionGrid />
      <ContentSection title="Trilhas da Cura" items={trilhas} badgeColor="bg-[#FF66C4]" />
      <ContentSection title="Encontre Sua Tribo" items={tribos} badgeColor="bg-white text-[#8b5cf6]" />
      
      {/* Footer Navigation - Clean White */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center text-xs font-medium text-gray-400 max-w-md mx-auto z-50">
        <button className="flex flex-col items-center gap-1 text-[#FF66C4]">
          <div className="p-1 bg-pink-50 rounded-lg">
             <Heart size={24} fill="#FF66C4" />
          </div>
          <span>Início</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-[#FF66C4] transition-colors">
          <MessageCircle size={24} />
          <span>Aldeia</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-[#FF66C4] transition-colors">
          <User size={24} />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
