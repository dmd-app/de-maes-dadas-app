import { useState } from 'react';
import { Flag, Heart, Users, BookOpen, MessageCircle, User, X } from 'lucide-react';
import './index.css';

// --- COMPONENTS ---

const Header = () => (
  <header className="p-6 pb-2 flex justify-between items-start bg-soft-bg">
    <div>
      <img src="/images/logo-horizontal-azul.png" alt="DeMãesDadas" className="h-8" />
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
  
  const moodPhrases = [
    "Respire. Você precisa ser cuidada agora.",
    "Peça ajuda. Não carregue o mundo sozinha.",
    "Uma pausa de 5 minutos pode salvar seu dia.",
    "Você está fazendo o seu melhor.",
    "Quase lá. Mantenha a calma.",
    "Equilíbrio perfeito. Aproveite esse momento.",
    "Atenção aos sinais do corpo.",
    "Opa. A temperatura está subindo.",
    "Saia de cena antes de explodir.",
    "Luz vermelha! Pare tudo agora.",
    "Sua raiva é válida. Proteja-se.",
  ];

  const moodIcons = ["", "", "", "", "", "", "", "", "", "", ""];

  // Logic: 0 (Vazio/Exausta/Azul) -> 5 (Equilibrada/Verde) -> 10 (Cheio/Raiva/Vermelho)
  const getCupColor = (val) => {
    if (val <= 1) return 'bg-cup-empty';
    if (val <= 2) return 'bg-cup-low';
    if (val <= 4) return 'bg-cup-rising';
    if (val <= 6) return 'bg-cup-balanced';
    if (val <= 7) return 'bg-cup-warm';
    if (val <= 8) return 'bg-cup-high';
    return 'bg-cup-full';
  };

  const getPhraseColor = (val) => {
    if (val <= 2) return 'text-cup-empty';
    if (val <= 4) return 'text-cup-rising';
    if (val <= 6) return 'text-cup-balanced';
    if (val <= 8) return 'text-cup-high';
    return 'text-cup-full';
  };

  return (
    <section className="px-6 py-2 bg-soft-bg">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
        <h2 className="text-gray-700 font-sans mb-1 text-left">Como est&#225; seu copo hoje?</h2>
        <p className={`text-xs font-sans mb-4 text-left transition-all duration-300 ${getPhraseColor(mood)}`}>
          {mood <= 3 && 'Copo Vazio (Exausta)'}
          {mood >= 4 && mood <= 7 && 'Equilibrada (Por enquanto)'}
          {mood >= 8 && 'Transbordando (Raiva)'}
        </p>

        {/* Mood Number */}
        <div className={`text-3xl font-bold text-center transition-colors duration-300 ${getPhraseColor(mood)}`}>
          {mood}<span className="text-lg text-gray-300 font-normal">/10</span>
        </div>

        <p className={`text-sm font-sans italic mb-4 mt-1 text-center transition-all duration-300 ${getPhraseColor(mood)}`}>
          {`"${moodPhrases[mood]}" ${moodIcons[mood]}`}
        </p>

        {/* Slider with 7-stop gradient */}
        <div className="w-full relative">
          <div 
            className="h-3 w-full rounded-full absolute top-[6px]"
            style={{
              background: 'linear-gradient(to right, #3B82F6 0%, #06B6D4 16%, #34D399 33%, #22C55E 50%, #FBBF24 66%, #F97316 83%, #EF4444 100%)'
            }}
          ></div>
          <input 
            type="range" 
            min="0" 
            max="10" 
            value={mood} 
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="w-full h-3 bg-transparent rounded-lg appearance-none cursor-pointer relative z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-gray-300 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
          />
        </div>
        
        <div className="w-full flex justify-between text-xs mt-3 font-medium">
          <span className="text-cup-empty font-semibold">Vazio</span>
          <span className="text-cup-full font-semibold">Cheio</span>
        </div>
      </div>
    </section>
  );
};

const ActionGrid = () => {
  const [isPanicOpen, setIsPanicOpen] = useState(false);

  return (
    <section className="px-6 py-4 grid grid-cols-2 gap-4 bg-soft-bg">
      <button 
        onClick={() => setIsPanicOpen(!isPanicOpen)}
        className="col-span-2 bg-gradient-to-r from-[#FF66C4] to-[#B946FF] text-white p-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all"
      >
        <Heart fill="white" size={20} />
        <span className="font-bold tracking-wide">ABRIR O CORAÇÃO</span>
      </button>

      {/* Inline expand below button */}
      <div className={`col-span-2 overflow-hidden transition-all duration-300 ease-in-out ${isPanicOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center">
          <Heart size={36} className="text-[#FF66C4] mb-3 fill-[#FF66C4]" />
          <h4 className="text-gray-800 font-bold mb-1">O que está pesando aí dentro?</h4>
          <p className="text-gray-400 text-sm mb-4">Desabafe...</p>
          
          <textarea 
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF66C4] focus:outline-none text-gray-700 resize-none h-28 mb-4 text-sm"
            placeholder="Escreva aqui seus sentimentos..."
          ></textarea>
          
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setIsPanicOpen(false)}
              className="flex-1 py-3 text-gray-500 font-medium rounded-full border border-gray-200 hover:bg-gray-50 text-sm"
            >
              Cancelar
            </button>
            <button className="flex-1 py-3 bg-gradient-to-r from-[#FF66C4] to-[#B946FF] text-white font-bold rounded-full shadow-md text-sm">
              Enviar para a Aldeia
            </button>
          </div>
        </div>
      </div>

      <button className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-soft-pink">
          <Users size={24} />
        </div>
        <span className="text-gray-700 font-sans font-medium text-sm text-center">Rodas de Conversa</span>
      </button>
      
      <button className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-soft-purple">
          <BookOpen size={24} />
        </div>
        <span className="text-gray-700 font-sans font-medium text-sm text-center">Biblioteca<br />(O Espelho)</span>
      </button>
    </section>
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
        <div key={idx} className="min-w-[180px] max-w-[180px] snap-center bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0 hover:shadow-md transition-all flex flex-col">
          {/* Card Image Area */}
          <div className={`h-32 relative ${item.bgClass} flex items-center justify-center overflow-hidden`}>
             <span className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full ${badgeColor} z-10`}>
                {item.tag}
             </span>
             {item.image ? (
               <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
             ) : (
               <>
                 <div className="w-24 h-24 rounded-full bg-white/20 blur-2xl absolute -top-4 -right-4"></div>
                 <div className="w-32 h-32 rounded-full bg-black/5 blur-3xl absolute -bottom-10 -left-10"></div>
               </>
             )}
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
      bgClass: "bg-[#EAD6C6]",
      image: "/images/quem-cuida.jpeg"
    },
    {
      title: "O Luto da Identidade",
      desc: "Quem era você antes de ser mãe? Vamos reencontrar essa mulher.",
      tag: "DIVÃ",
      bgClass: "bg-gradient-to-br from-pink-200 to-red-100",
      image: "/images/luto-identidade.jpeg"
    },
    {
      title: "A Luz Vermelha da Raiva",
      desc: "Entenda por que você explode e como lidar com a culpa.",
      tag: "PSICOLOGIA",
      bgClass: "bg-gradient-to-br from-yellow-200 to-orange-100",
      image: "/images/luz-vermelha-raiva.jpeg"
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
      <ContentSection title="Jornadas da Cura" items={trilhas} badgeColor="bg-[#FF66C4] text-white" />
      <ContentSection title="Encontre Sua Tribo" items={tribos} badgeColor="bg-white text-[#8b5cf6]" />
      
      {/* Footer Navigation - Floating */}
      <nav className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl px-8 py-5 flex justify-between items-center text-xs font-medium text-gray-400 max-w-[calc(28rem-2rem)] mx-auto z-50 shadow-lg border border-gray-100">
        <button className="flex flex-col items-center gap-1 text-gray-800">
          <Heart size={24} fill="#374151" stroke="#374151" />
          <span className="font-semibold">Inicio</span>
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
