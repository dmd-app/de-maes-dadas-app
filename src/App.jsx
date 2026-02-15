import { useState } from 'react';
import { Flag, Heart, Users, BookOpen, MessageCircle, User, X, ArrowLeft, Share2, Send } from 'lucide-react';
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

const ActionGrid = ({ onNavigate, onSendPost }) => {
  const [isPanicOpen, setIsPanicOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendPost && onSendPost(message.trim());
      setMessage('');
      setIsPanicOpen(false);
    }
  };

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
          <h4 className="text-gray-800 font-bold mb-1">{"O que está pesando aí dentro?"}</h4>
          <p className="text-gray-400 text-sm mb-4">Desabafe...</p>
          
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF66C4] focus:outline-none text-gray-700 resize-none h-28 mb-4 text-sm"
            placeholder="Escreva aqui seus sentimentos..."
          ></textarea>
          
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => { setIsPanicOpen(false); setMessage(''); }}
              className="flex-1 py-3 text-gray-500 font-medium rounded-full border border-gray-200 hover:bg-gray-50 text-sm"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSend}
              className="flex-1 py-3 bg-gradient-to-r from-[#FF66C4] to-[#B946FF] text-white font-bold rounded-full shadow-md text-sm"
            >
              Enviar para a Aldeia
            </button>
          </div>
        </div>
      </div>

      <button onClick={() => onNavigate && onNavigate('rodas')} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition-shadow">
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

const ContentSection = ({ title, items, badgeColor, cardWidth = "180px" }) => (
  <section className="py-6 bg-soft-bg">
    <div className="px-6 mb-4 flex justify-between items-center">
      <h3 className="text-lg font-sans font-bold text-gray-800">{title}</h3>
      <a href="#" className="text-xs font-bold text-[#FF66C4] uppercase tracking-wider">Ver tudo</a>
    </div>
    
    <div className="flex overflow-x-auto px-6 gap-4 pb-8 snap-x hide-scrollbar">
      {items.map((item, idx) => (
        <div key={idx} style={{ minWidth: cardWidth, maxWidth: cardWidth }} className="snap-center bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0 hover:shadow-md transition-all flex flex-col">
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

// --- RODAS DE CONVERSA PAGE ---
const initialRodasPosts = [
  {
    category: "Maternidade Solo",
    categoryColor: "bg-soft-blue text-white",
    author: "Mariana S.",
    time: "2h atr\u00e1s",
    title: "Como voc\u00eas lidam com a solid\u00e3o no fim de semana?",
    desc: "Sinto que quando chega sexta-feira, todo mundo tem planos em fam\u00edlia e eu fico aqui...",
    likes: 24,
    comments: 12,
    commentsList: [
      { author: "Ana P.", time: "1h atr\u00e1s", text: "Eu te entendo demais. Aqui \u00e9 igual. Vamos marcar algo juntas?" },
      { author: "Juliana R.", time: "1h atr\u00e1s", text: "Passei por isso por muito tempo. O que me ajudou foi entrar em um grupo de m\u00e3es na vizinhan\u00e7a." },
      { author: "Camila F.", time: "45min atr\u00e1s", text: "Voc\u00ea n\u00e3o est\u00e1 sozinha. Estamos aqui." },
    ],
  },
  {
    category: "Desabafo",
    categoryColor: "bg-[#FF66C4] text-white",
    author: "An\u00f4nima",
    time: "5h atr\u00e1s",
    title: "Eu gritei hoje. E a culpa t\u00e1 me consumindo.",
    desc: "Foi por uma bobagem. O copo de leite caiu. Mas eu explodi como se fosse o fim do mundo.",
    likes: 156,
    comments: 43,
    commentsList: [
      { author: "Fernanda L.", time: "4h atr\u00e1s", text: "J\u00e1 passei por isso tantas vezes. Respira fundo, voc\u00ea \u00e9 humana." },
      { author: "Renata B.", time: "3h atr\u00e1s", text: "A culpa \u00e9 o peso mais pesado da maternidade. Mas voc\u00ea reconhecer j\u00e1 \u00e9 um ato de amor." },
      { author: "Beatriz S.", time: "2h atr\u00e1s", text: "Eu chorei lendo isso. Obrigada por compartilhar." },
      { author: "Luana M.", time: "1h atr\u00e1s", text: "Nenhuma m\u00e3e \u00e9 perfeita. Voc\u00ea est\u00e1 fazendo o seu melhor." },
    ],
  },
  {
    category: "Volta ao Trabalho",
    categoryColor: "bg-emerald-500 text-white",
    author: "Carla T.",
    time: "1d atr\u00e1s",
    title: "Dicas para a adapta\u00e7\u00e3o na creche?",
    desc: "Meu beb\u00ea tem 6 meses e eu s\u00f3 choro pensando em deixar ele l\u00e1 semana que vem.",
    likes: 8,
    comments: 5,
    commentsList: [
      { author: "Patricia A.", time: "20h atr\u00e1s", text: "Faz adapta\u00e7\u00e3o gradual. Primeiro dia 1h, segundo 2h... funciona muito!" },
      { author: "Debora K.", time: "18h atr\u00e1s", text: "Leva um paninho com seu cheiro. Ajuda demais." },
    ],
  },
  {
    category: "Sono",
    categoryColor: "bg-indigo-400 text-white",
    author: "Renata M.",
    time: "3h atr\u00e1s",
    title: "Algu\u00e9m mais acorda 5x por noite?",
    desc: "Meu filho tem 14 meses e ainda n\u00e3o dorme a noite toda. Estou destruida.",
    likes: 89,
    comments: 27,
    commentsList: [
      { author: "Amanda G.", time: "2h atr\u00e1s", text: "O meu tem 18 meses e \u00e9 a mesma coisa. Solidariedade total." },
      { author: "Isabela T.", time: "1h atr\u00e1s", text: "Consultora de sono mudou minha vida. Se precisar, indico." },
      { author: "Thais R.", time: "40min atr\u00e1s", text: "Fa\u00e7a revezamento com algu\u00e9m se puder. Voc\u00ea precisa dormir tamb\u00e9m." },
    ],
  },
];

const rodasFilters = ["Destaques", "Recentes", "Maternidade Solo", "Sono", "Desabafo"];

const RodasDeConversa = ({ onBack, posts, onOpenPost }) => {
  const [activeFilter, setActiveFilter] = useState("Destaques");

  return (
    <div className="min-h-screen bg-soft-bg pb-24 max-w-md mx-auto shadow-2xl font-sans text-gray-800">
      {/* Header */}
      <header className="p-6 pb-4 flex items-center gap-4 bg-soft-bg">
        <button onClick={onBack} className="text-gray-700">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 font-sans">Rodas de Conversa</h1>
      </header>

      {/* Filter Chips */}
      <div className="flex overflow-x-auto px-6 gap-3 pb-4 hide-scrollbar">
        {rodasFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === filter
                ? "bg-soft-blue text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="px-6 flex flex-col gap-4 pt-2">
        {posts.map((post, idx) => (
          <div key={idx} onClick={() => onOpenPost && onOpenPost(idx)} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform">
            {/* Meta */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${post.categoryColor}`}>
                {post.category}
              </span>
              <span className="text-xs text-gray-400">{'  \u2022  '}{post.author}{'  \u2022  '}{post.time}</span>
            </div>

            {/* Content */}
            <h3 className="font-bold text-gray-800 mb-1 leading-snug">{post.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">{post.desc}</p>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-gray-400 hover:text-[#FF66C4] transition-colors">
                  <Heart size={18} />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-400 hover:text-soft-blue transition-colors">
                  <MessageCircle size={18} />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
              </div>
              <button className="text-gray-300 hover:text-gray-500 transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- ALDEIA PAGE ---
const AldeiaPage = ({ onNavigate, posts }) => {
  return (
    <div className="min-h-screen bg-soft-bg pb-24 max-w-md mx-auto shadow-2xl font-sans text-gray-800">
      {/* Header */}
      <header className="p-6 pb-2 bg-soft-bg">
        <img src="/images/logo-horizontal-azul.png" alt="DeMãesDadas" className="h-8" />
        <p className="text-sm text-soft-pink font-sans font-medium">Aldeia Digital</p>
        <div className="mt-6">
          <p className="text-lg text-soft-blue font-sans">A sua aldeia</p>
        </div>
      </header>

      {/* Quick Actions */}
      <section className="px-6 py-4 flex flex-col gap-4">
        <button
          onClick={() => onNavigate('rodas')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-soft-pink flex-shrink-0">
            <Users size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-800 text-sm">Rodas de Conversa</h3>
            <p className="text-xs text-gray-400 mt-0.5">Desabafe, pergunte e acolha</p>
          </div>
        </button>

        <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow active:scale-[0.98]">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-soft-purple flex-shrink-0">
            <BookOpen size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-800 text-sm">Biblioteca (O Espelho)</h3>
            <p className="text-xs text-gray-400 mt-0.5">{"Conteúdos que refletem você"}</p>
          </div>
        </button>
      </section>

      {/* Recent Posts Preview */}
      <section className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-sans font-bold text-gray-800">Conversas Recentes</h3>
          <button onClick={() => onNavigate('rodas')} className="text-xs font-bold text-[#FF66C4] uppercase tracking-wider">Ver tudo</button>
        </div>
        <div className="flex flex-col gap-3">
          {posts.slice(0, 2).map((post, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${post.categoryColor}`}>
                  {post.category}
                </span>
                <span className="text-xs text-gray-400">{post.author}{'  \u2022  '}{post.time}</span>
              </div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">{post.title}</h4>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Heart size={14} /> {post.likes}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <MessageCircle size={14} /> {post.comments}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- POST DETAIL PAGE ---
const PostDetail = ({ post, onBack, onAddComment, onLikePost, onLikeComment, onReplyComment }) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleSendComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleSendReply = (commentIdx) => {
    if (replyText.trim()) {
      onReplyComment(commentIdx, replyText.trim());
      setReplyText('');
      setReplyingTo(null);
    }
  };

  return (
    <div className="min-h-screen bg-soft-bg pb-24 max-w-md mx-auto shadow-2xl font-sans text-gray-800">
      {/* Header */}
      <header className="p-6 pb-4 flex items-center gap-4 bg-soft-bg sticky top-0 z-10">
        <button onClick={onBack} className="text-gray-700">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 font-sans">Conversa</h1>
      </header>

      {/* Full Post */}
      <div className="px-6 pb-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${post.categoryColor}`}>
              {post.category}
            </span>
            <span className="text-xs text-gray-400">{post.author}{" \u2022 "}{post.time}</span>
          </div>

          <h2 className="font-bold text-gray-800 text-lg mb-2 leading-snug">{post.title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{post.desc}</p>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <button onClick={onLikePost} className={`flex items-center gap-1.5 transition-colors ${post.liked ? 'text-[#FF66C4]' : 'text-gray-400 hover:text-[#FF66C4]'}`}>
                <Heart size={18} fill={post.liked ? '#FF66C4' : 'none'} />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>
              <span className="flex items-center gap-1.5 text-gray-400">
                <MessageCircle size={18} />
                <span className="text-sm font-medium">{post.commentsList?.length || 0}</span>
              </span>
            </div>
            <button className="text-gray-300 hover:text-gray-500 transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Comment Input - Below post, above comments */}
      <div className="px-6 pb-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none px-3 py-2 bg-gray-50 rounded-xl"
            placeholder={"Escreva um coment\u00e1rio..."}
          />
          <button
            onClick={handleSendComment}
            className={`p-2.5 rounded-xl transition-all ${newComment.trim() ? 'bg-[#FF66C4] text-white' : 'bg-gray-100 text-gray-300'}`}
            disabled={!newComment.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="px-6">
        <h3 className="font-bold text-gray-800 mb-4">
          {"Coment\u00e1rios"} ({post.commentsList?.length || 0})
        </h3>

        {(!post.commentsList || post.commentsList.length === 0) && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
            <MessageCircle size={32} className="text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">{"Nenhum coment\u00e1rio ainda. Seja a primeira!"}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {post.commentsList
            ?.map((comment, idx) => ({ ...comment, originalIdx: idx }))
            .sort((a, b) => ((b.likes || 0) + (b.replies?.length || 0)) - ((a.likes || 0) + (a.replies?.length || 0)))
            .map((comment) => (
            <div key={comment.originalIdx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-soft-pink flex-shrink-0">
                  <User size={14} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{comment.author}</span>
                <span className="text-xs text-gray-400">{" \u2022 "}{comment.time}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pl-9">{comment.text}</p>

              {/* Comment actions: like + reply */}
              <div className="flex items-center gap-4 pl-9 mt-2">
                <button
                  onClick={() => onLikeComment(comment.originalIdx)}
                  className={`flex items-center gap-1 text-xs transition-colors ${comment.liked ? 'text-[#FF66C4]' : 'text-gray-400 hover:text-[#FF66C4]'}`}
                >
                  <Heart size={14} fill={comment.liked ? '#FF66C4' : 'none'} />
                  <span>{comment.likes || 0}</span>
                </button>
                <button
                  onClick={() => { setReplyingTo(replyingTo === comment.originalIdx ? null : comment.originalIdx); setReplyText(''); }}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-soft-blue transition-colors"
                >
                  <MessageCircle size={14} />
                  <span>Responder</span>
                </button>
              </div>

              {/* Reply input */}
              {replyingTo === comment.originalIdx && (
                <div className="pl-9 mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply(comment.originalIdx)}
                    className="flex-1 text-xs text-gray-700 placeholder-gray-400 outline-none px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:ring-1 focus:ring-[#FF66C4]"
                    placeholder={"Escreva uma resposta..."}
                    autoFocus
                  />
                  <button
                    onClick={() => handleSendReply(comment.originalIdx)}
                    className={`p-2 rounded-xl transition-all ${replyText.trim() ? 'bg-[#FF66C4] text-white' : 'bg-gray-100 text-gray-300'}`}
                    disabled={!replyText.trim()}
                  >
                    <Send size={14} />
                  </button>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="pl-9 mt-3 flex flex-col gap-2">
                  {comment.replies.map((reply, rIdx) => (
                    <div key={rIdx} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-soft-purple flex-shrink-0">
                          <User size={10} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{reply.author}</span>
                        <span className="text-[10px] text-gray-400">{" \u2022 "}{reply.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed pl-7">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('inicio');
  const [selectedPostIdx, setSelectedPostIdx] = useState(null);
  const [rodasPosts, setRodasPosts] = useState(initialRodasPosts);

  const handleSendPost = (text) => {
    const newPost = {
      category: "Desabafo",
      categoryColor: "bg-[#FF66C4] text-white",
      author: "Eu",
      time: "Agora",
      title: text.length > 60 ? text.slice(0, 60) + "..." : text,
      desc: text,
      likes: 0,
      comments: 0,
      commentsList: [],
    };
    setRodasPosts([newPost, ...rodasPosts]);
    setCurrentPage('rodas');
    window.scrollTo(0, 0);
  };

  const handleOpenPost = (idx) => {
    setSelectedPostIdx(idx);
    setCurrentPage('postDetail');
    window.scrollTo(0, 0);
  };

  const handleLikePost = () => {
    if (selectedPostIdx === null) return;
    const updated = [...rodasPosts];
    const post = { ...updated[selectedPostIdx] };
    if (post.liked) {
      post.likes = (post.likes || 1) - 1;
      post.liked = false;
    } else {
      post.likes = (post.likes || 0) + 1;
      post.liked = true;
    }
    updated[selectedPostIdx] = post;
    setRodasPosts(updated);
  };

  const handleAddComment = (text) => {
    if (selectedPostIdx === null) return;
    const updated = [...rodasPosts];
    const newComment = { author: "Eu", time: "Agora", text, likes: 0, liked: false, replies: [] };
    updated[selectedPostIdx] = {
      ...updated[selectedPostIdx],
      commentsList: [...(updated[selectedPostIdx].commentsList || []), newComment],
      comments: (updated[selectedPostIdx].comments || 0) + 1,
    };
    setRodasPosts(updated);
  };

  const handleLikeComment = (commentIdx) => {
    if (selectedPostIdx === null) return;
    const updated = [...rodasPosts];
    const post = { ...updated[selectedPostIdx] };
    const comments = [...(post.commentsList || [])];
    const comment = { ...comments[commentIdx] };
    if (comment.liked) {
      comment.likes = (comment.likes || 1) - 1;
      comment.liked = false;
    } else {
      comment.likes = (comment.likes || 0) + 1;
      comment.liked = true;
    }
    comments[commentIdx] = comment;
    post.commentsList = comments;
    updated[selectedPostIdx] = post;
    setRodasPosts(updated);
  };

  const handleReplyComment = (commentIdx, text) => {
    if (selectedPostIdx === null) return;
    const updated = [...rodasPosts];
    const post = { ...updated[selectedPostIdx] };
    const comments = [...(post.commentsList || [])];
    const comment = { ...comments[commentIdx] };
    const newReply = { author: "Eu", time: "Agora", text };
    comment.replies = [...(comment.replies || []), newReply];
    comments[commentIdx] = comment;
    post.commentsList = comments;
    updated[selectedPostIdx] = post;
    setRodasPosts(updated);
  };

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

  const guardioes = [
    {
      title: "Encontros Mensais ao Vivo",
      desc: "Conversas com quem caminha com o corpo, a escuta e a experiência.",
      tag: "AO VIVO",
      bgClass: "bg-gradient-to-br from-teal-200 to-emerald-300"
    },
    {
      title: "Conversas Abertas",
      desc: "Rodas de saberes que sustentam a vida. Sem gurus, com presença.",
      tag: "ABERTO",
      bgClass: "bg-gradient-to-br from-amber-200 to-orange-200"
    },
    {
      title: "Corpo, Emoção e Sono",
      desc: "Temas que atravessam a maternidade real, sem filtro.",
      tag: "TEMA",
      bgClass: "bg-gradient-to-br from-sky-200 to-blue-300"
    },
    {
      title: "Espiritualidade e Cuidado",
      desc: "O sagrado no cotidiano de quem cuida.",
      tag: "TEMA",
      bgClass: "bg-gradient-to-br from-purple-200 to-violet-300"
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

  // Render Post Detail page
  if (currentPage === 'postDetail' && selectedPostIdx !== null) {
    return (
      <>
        <PostDetail
          post={rodasPosts[selectedPostIdx]}
          onBack={() => { setCurrentPage('rodas'); setSelectedPostIdx(null); }}
          onAddComment={handleAddComment}
          onLikePost={handleLikePost}
          onLikeComment={handleLikeComment}
          onReplyComment={handleReplyComment}
        />
        <nav className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl px-8 py-5 flex justify-between items-center text-xs font-medium text-gray-400 max-w-[calc(28rem-2rem)] mx-auto z-50 shadow-lg border border-gray-100">
          <button onClick={() => { setCurrentPage('inicio'); setSelectedPostIdx(null); }} className="flex flex-col items-center gap-1 hover:text-gray-800 transition-colors">
            <Heart size={24} />
            <span>Inicio</span>
          </button>
          <button onClick={() => { setCurrentPage('aldeia'); setSelectedPostIdx(null); }} className="flex flex-col items-center gap-1 text-gray-800">
            <MessageCircle size={24} fill="#374151" stroke="#374151" />
            <span className="font-semibold">Aldeia</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-gray-800 transition-colors">
            <User size={24} />
            <span>Perfil</span>
          </button>
        </nav>
      </>
    );
  }

  // Render Rodas de Conversa page
  if (currentPage === 'rodas') {
    return (
      <>
        <RodasDeConversa onBack={() => setCurrentPage('aldeia')} posts={rodasPosts} onOpenPost={handleOpenPost} />
        <nav className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl px-8 py-5 flex justify-between items-center text-xs font-medium text-gray-400 max-w-[calc(28rem-2rem)] mx-auto z-50 shadow-lg border border-gray-100">
          <button onClick={() => setCurrentPage('inicio')} className="flex flex-col items-center gap-1 hover:text-gray-800 transition-colors">
            <Heart size={24} />
            <span>Inicio</span>
          </button>
          <button onClick={() => setCurrentPage('aldeia')} className="flex flex-col items-center gap-1 text-gray-800">
            <MessageCircle size={24} fill="#374151" stroke="#374151" />
            <span className="font-semibold">Aldeia</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-gray-800 transition-colors">
            <User size={24} />
            <span>Perfil</span>
          </button>
        </nav>
      </>
    );
  }

  // Render Aldeia page
  if (currentPage === 'aldeia') {
    return (
      <>
        <AldeiaPage onNavigate={(page) => { setCurrentPage(page); window.scrollTo(0, 0); }} posts={rodasPosts} />
        <nav className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl px-8 py-5 flex justify-between items-center text-xs font-medium text-gray-400 max-w-[calc(28rem-2rem)] mx-auto z-50 shadow-lg border border-gray-100">
          <button onClick={() => setCurrentPage('inicio')} className="flex flex-col items-center gap-1 hover:text-gray-800 transition-colors">
            <Heart size={24} />
            <span>Inicio</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-800">
            <MessageCircle size={24} fill="#374151" stroke="#374151" />
            <span className="font-semibold">Aldeia</span>
          </button>
          <button className="flex flex-col items-center gap-1 hover:text-gray-800 transition-colors">
            <User size={24} />
            <span>Perfil</span>
          </button>
        </nav>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-soft-bg pb-24 max-w-md mx-auto shadow-2xl font-sans text-gray-800">
      <Header />
      <MoodCup />
      <ActionGrid onNavigate={(page) => { setCurrentPage(page); window.scrollTo(0, 0); }} onSendPost={handleSendPost} />
      <ContentSection title="Jornadas da Cura" items={trilhas} badgeColor="bg-[#FF66C4] text-white" />
      {/* Os Guardioes do Cuidado */}
      <section className="py-6 bg-soft-bg">
        <div className="px-6 mb-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-sans font-bold text-gray-800">Os Guardi&#245;es do Cuidado</h3>
            <a href="#" className="text-xs font-bold text-[#FF66C4] uppercase tracking-wider">Ver tudo</a>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mt-1">
            Encontros com saberes que sustentam a vida. N&#227;o s&#227;o gurus. S&#227;o pessoas que caminham com o corpo, a escuta e a experi&#234;ncia.
          </p>
        </div>
        <div className="flex overflow-x-auto px-6 gap-4 pb-8 pt-2 snap-x hide-scrollbar">
          {guardioes.map((item, idx) => (
            <div key={idx} style={{ minWidth: "180px", maxWidth: "180px" }} className="snap-center bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0 hover:shadow-md transition-all flex flex-col">
              <div className={`h-32 relative ${item.bgClass} flex items-center justify-center overflow-hidden`}>
                <span className="absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full bg-white/90 text-emerald-700 z-10">
                  {item.tag}
                </span>
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

      <ContentSection title="Encontre Sua Tribo" items={tribos} badgeColor="bg-white text-[#8b5cf6]" cardWidth="280px" />
      
      {/* Footer Navigation - Floating */}
      <nav className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl px-8 py-5 flex justify-between items-center text-xs font-medium text-gray-400 max-w-[calc(28rem-2rem)] mx-auto z-50 shadow-lg border border-gray-100">
        <button className="flex flex-col items-center gap-1 text-gray-800">
          <Heart size={24} fill="#374151" stroke="#374151" />
          <span className="font-semibold">Inicio</span>
        </button>
        <button onClick={() => setCurrentPage('aldeia')} className="flex flex-col items-center gap-1 hover:text-gray-800 transition-colors">
          <MessageCircle size={24} />
          <span>Aldeia</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-gray-800 transition-colors">
          <User size={24} />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
