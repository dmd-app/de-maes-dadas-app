import { useState } from 'react';
import { Flag, Heart, Users, BookOpen, MessageCircle, User, X, ArrowLeft, Share2, Send, Mail, Lock, Eye, EyeOff, Check, ChevronRight, ArrowRight, Settings, LogOut, Bell, Shield, HelpCircle, Edit3, Plus } from 'lucide-react';
import './index.css';

// --- SIGNUP PAGE (Criar Conta) ---
const SignupPage = ({ onSignup, onGoToLogin }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email obrigat\u00f3rio';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inv\u00e1lido';
    if (!username.trim()) newErrors.username = 'Nome obrigat\u00f3rio';
    if (!password.trim()) newErrors.password = 'Senha obrigat\u00f3ria';
    else if (password.length < 6) newErrors.password = 'M\u00ednimo 6 caracteres';
    if (!acceptedTerms) newErrors.terms = 'Aceite os termos';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSignup({ email, username });
    }
  };

  return (
    <div className="min-h-screen bg-soft-bg max-w-md mx-auto shadow-2xl font-sans text-gray-800 flex flex-col">
      <div className="relative overflow-hidden pt-16 pb-10 px-8">
        <div className="w-40 h-40 rounded-full bg-[#FF66C4]/10 blur-3xl absolute -top-10 -right-10"></div>
        <div className="w-32 h-32 rounded-full bg-soft-blue/10 blur-3xl absolute -bottom-5 -left-10"></div>
        <div className="relative z-10">
          <img src="/images/logo-horizontal-azul.png" alt="DeMaesDadas" className="h-10 mb-2" />
          <p className="text-sm text-soft-pink font-medium">Aldeia Digital</p>
          <h1 className="text-2xl font-bold text-gray-800 mt-6 leading-tight text-balance">
            {"Entre para a sua aldeia"}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            {"Crie sua conta e comece sua jornada"}
          </p>
        </div>
      </div>

      <div className="flex-1 px-8 pb-10 flex flex-col gap-4">
        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email</label>
          <div className={`flex items-center gap-3 bg-white rounded-xl border ${errors.email ? 'border-red-300' : 'border-gray-200'} px-4 py-3 focus-within:ring-2 focus-within:ring-soft-blue/30 transition-all`}>
            <Mail size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="flex-1 text-base text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
          </div>
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>

        {/* Username */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{"Nome de usu\u00e1rio"}</label>
          <div className={`flex items-center gap-3 bg-white rounded-xl border ${errors.username ? 'border-red-300' : 'border-gray-200'} px-4 py-3 focus-within:ring-2 focus-within:ring-soft-blue/30 transition-all`}>
            <User size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Como quer ser chamada?"
              className="flex-1 text-base text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
          </div>
          {errors.username && <p className="text-xs text-red-400 mt-1">{errors.username}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Senha</label>
          <div className={`flex items-center gap-3 bg-white rounded-xl border ${errors.password ? 'border-red-300' : 'border-gray-200'} px-4 py-3 focus-within:ring-2 focus-within:ring-soft-blue/30 transition-all`}>
            <Lock size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={"M\u00ednimo 6 caracteres"}
              className="flex-1 text-base text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
            <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 mt-1">
          <button
            onClick={() => setAcceptedTerms(!acceptedTerms)}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${acceptedTerms ? 'bg-soft-blue border-soft-blue' : errors.terms ? 'border-red-300' : 'border-gray-300'}`}
          >
            {acceptedTerms && <Check size={14} className="text-white" />}
          </button>
          <p className="text-xs text-gray-500 leading-relaxed">
            {"Li e aceito os "}
            <span className="text-soft-blue font-semibold underline">{"Termos e Condi\u00e7\u00f5es"}</span>
            {" e a "}
            <span className="text-soft-blue font-semibold underline">{"Pol\u00edtica de Privacidade"}</span>
          </p>
        </div>
        {errors.terms && <p className="text-xs text-red-400 -mt-2">{errors.terms}</p>}

        <button
          onClick={handleSubmit}
          className="w-full mt-4 py-4 bg-gradient-to-r from-[#FF66C4] to-[#B946FF] text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all text-sm tracking-wide"
        >
          CRIAR CONTA
        </button>

        <p className="text-center text-xs text-gray-400 mt-2">
          {"J\u00e1 tem conta? "}
          <button onClick={onGoToLogin} className="text-soft-blue font-semibold underline">Entrar</button>
        </p>
      </div>
    </div>
  );
};

// --- LOGIN PAGE (Entrar) ---
const LoginPage = ({ onLogin, onGoToSignup }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!identifier.trim()) newErrors.identifier = 'Email ou nome de usu\u00e1rio obrigat\u00f3rio';
    if (!password.trim()) newErrors.password = 'Senha obrigat\u00f3ria';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const isEmail = identifier.includes('@');
      onLogin({
        email: isEmail ? identifier : '',
        username: isEmail ? identifier.split('@')[0] : identifier,
      });
    }
  };

  return (
    <div className="min-h-screen bg-soft-bg max-w-md mx-auto shadow-2xl font-sans text-gray-800 flex flex-col">
      <div className="relative overflow-hidden pt-16 pb-10 px-8">
        <div className="w-40 h-40 rounded-full bg-[#FF66C4]/10 blur-3xl absolute -top-10 -right-10"></div>
        <div className="w-32 h-32 rounded-full bg-soft-blue/10 blur-3xl absolute -bottom-5 -left-10"></div>
        <div className="relative z-10">
          <img src="/images/logo-horizontal-azul.png" alt="DeMaesDadas" className="h-10 mb-2" />
          <p className="text-sm text-soft-pink font-medium">Aldeia Digital</p>
          <h1 className="text-2xl font-bold text-gray-800 mt-6 leading-tight text-balance">
            {"Bem-vinda de volta"}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            {"Entre na sua aldeia"}
          </p>
        </div>
      </div>

      <div className="flex-1 px-8 pb-10 flex flex-col gap-4">
        {/* Email or Username */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{"Email ou nome de usu\u00e1rio"}</label>
          <div className={`flex items-center gap-3 bg-white rounded-xl border ${errors.identifier ? 'border-red-300' : 'border-gray-200'} px-4 py-3 focus-within:ring-2 focus-within:ring-soft-blue/30 transition-all`}>
            <Mail size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={"seu@email.com ou nome de usu\u00e1rio"}
              className="flex-1 text-base text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
          </div>
          {errors.identifier && <p className="text-xs text-red-400 mt-1">{errors.identifier}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-600">Senha</label>
            <button className="text-xs text-[#FF66C4] font-semibold">Esqueci minha senha</button>
          </div>
          <div className={`flex items-center gap-3 bg-white rounded-xl border ${errors.password ? 'border-red-300' : 'border-gray-200'} px-4 py-3 focus-within:ring-2 focus-within:ring-soft-blue/30 transition-all`}>
            <Lock size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Sua senha"
              className="flex-1 text-base text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
            <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-4 py-4 bg-gradient-to-r from-[#FF66C4] to-[#B946FF] text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all text-sm tracking-wide"
        >
          ENTRAR
        </button>

        <p className="text-center text-xs text-gray-400 mt-2">
          {"N\u00e3o tem conta? "}
          <button onClick={onGoToSignup} className="text-soft-blue font-semibold underline">Criar conta</button>
        </p>
      </div>
    </div>
  );
};

// --- ONBOARDING ---
const onboardingScreens = [
  {
    lines: [
      { text: "Que bom que voc\u00ea chegou.", style: "text-2xl font-bold text-gray-800 leading-tight" },
      { text: "Aqui, voc\u00ea n\u00e3o precisa dar conta.", style: "text-lg text-gray-500 mt-3" },
    ],
    accent: "from-[#FF66C4]/20 to-[#B946FF]/20",
  },
  {
    subtitle: "Se voc\u00ea chegou at\u00e9 aqui, talvez j\u00e1 tenha sentido:",
    lines: [
      { text: "Que maternar pode ser lindo...", style: "text-gray-700 font-medium" },
      { text: "Mas tamb\u00e9m \u00e9 solit\u00e1rio.", style: "text-gray-400 italic" },
      { text: "Que voc\u00ea \u00e9 forte...", style: "text-gray-700 font-medium mt-3" },
      { text: "Mas \u00e0s vezes est\u00e1 exausta.", style: "text-gray-400 italic" },
      { text: "Que ama profundamente...", style: "text-gray-700 font-medium mt-3" },
      { text: "Mas que tamb\u00e9m quer voltar a se escutar.", style: "text-gray-400 italic" },
    ],
    accent: "from-soft-blue/10 to-[#06B6D4]/10",
  },
  {
    lines: [
      { text: "Aqui \u00e9 uma comunidade", style: "text-xl text-gray-800 font-bold" },
      { text: "de apoio Real.", style: "text-xl text-[#FF66C4] font-bold" },
      { text: "Sem idealiza\u00e7\u00f5es.", style: "text-gray-500 mt-4" },
      { text: "Sem M\u00e1scaras.", style: "text-gray-500" },
      { text: "Sem competi\u00e7\u00e3o.", style: "text-gray-500" },
    ],
    accent: "from-[#FF66C4]/15 to-pink-100/30",
  },
  {
    lines: [
      { text: "N\u00f3s n\u00e3o oferecemos respostas prontas.", style: "text-lg text-gray-800 font-bold leading-snug" },
      { text: "Oferecemos ferramentas.", style: "text-gray-600 mt-4 font-medium" },
      { text: "Perguntas certas.", style: "text-gray-600 font-medium" },
      { text: "Espa\u00e7os de escuta.", style: "text-gray-600 font-medium" },
      { text: "Presen\u00e7a.", style: "text-[#FF66C4] font-bold text-lg" },
    ],
    accent: "from-emerald-100/40 to-teal-100/30",
  },
  {
    lines: [
      { text: "Porque transforma\u00e7\u00e3o n\u00e3o acontece sozinha.", style: "text-gray-700 font-medium" },
      { text: "Empoderamento n\u00e3o nasce no isolamento.", style: "text-gray-700 font-medium mt-2" },
      { text: "E autocuidado n\u00e3o \u00e9 luxo \u2013 \u00e9 base.", style: "text-gray-800 font-bold mt-2" },
      { text: "Bem-vinda \u00e0 aldeia. \ud83d\udc99", style: "text-2xl font-bold text-soft-blue mt-8" },
    ],
    accent: "from-soft-blue/15 to-[#B946FF]/10",
  },
];

const OnboardingPage = ({ onComplete, userName }) => {
  const [step, setStep] = useState(0);
  const screen = onboardingScreens[step];
  const isLast = step === onboardingScreens.length - 1;

  return (
    <div className="min-h-screen bg-soft-bg max-w-md mx-auto shadow-2xl font-sans text-gray-800 flex flex-col">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pt-10 pb-2 px-8">
        {onboardingScreens.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step ? 'w-8 bg-[#FF66C4]' : i < step ? 'w-4 bg-[#FF66C4]/40' : 'w-4 bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Skip */}
      {!isLast && (
        <div className="flex justify-end px-8 pt-4">
          <button onClick={onComplete} className="text-xs text-gray-400 font-medium">
            Pular
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-10 pb-10 relative">
        {/* Decorative bg */}
        <div className={`absolute inset-0 bg-gradient-to-br ${screen.accent} rounded-3xl mx-6 my-10 opacity-50`}></div>

        <div className="relative z-10 flex flex-col">
          {step === 0 && userName && (
            <p className="text-sm text-[#FF66C4] font-semibold mb-6">{userName},</p>
          )}

          {screen.subtitle && (
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">{screen.subtitle}</p>
          )}

          {screen.lines.map((line, i) => (
            <p key={i} className={`${line.style} leading-relaxed`}>{line.text}</p>
          ))}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="px-8 pb-10 flex items-center justify-between">
        {step > 0 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="text-sm text-gray-400 font-medium"
          >
            Voltar
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={() => isLast ? onComplete() : setStep(step + 1)}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.97] ${
            isLast
              ? 'bg-gradient-to-r from-[#FF66C4] to-[#B946FF] text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200 shadow-sm'
          }`}
        >
          {isLast ? 'ENTRAR NA ALDEIA' : 'Continuar'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

// --- COMPONENTS ---

const Header = ({ userName }) => (
  <header className="p-6 pb-2 flex justify-between items-start bg-soft-bg">
    <div>
      <img src="/images/logo-horizontal-azul.png" alt="DeMãesDadas" className="h-8" />
      <p className="text-sm text-soft-pink font-sans font-medium">Aldeia Digital</p>
      <div className="mt-6">
        <p className="text-lg text-soft-blue font-sans">{"Bem-vinda, "}{userName || "Mam\u00e3e"}{" \ud83d\udc97"}</p>
      </div>
    </div>
    <div className="p-2 rounded-full border-2 border-soft-pink text-soft-pink">
      <MessageCircle size={24} />
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
      { author: "Ana P.", time: "1h atr\u00e1s", text: "Eu te entendo demais. Aqui \u00e9 igual. Vamos marcar algo juntas?", likes: 5, liked: false, replies: [] },
      { author: "Juliana R.", time: "1h atr\u00e1s", text: "Passei por isso por muito tempo. O que me ajudou foi entrar em um grupo de m\u00e3es na vizinhan\u00e7a.", likes: 12, liked: false, replies: [] },
      { author: "Camila F.", time: "45min atr\u00e1s", text: "Voc\u00ea n\u00e3o est\u00e1 sozinha. Estamos aqui.", likes: 8, liked: false, replies: [] },
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
      { author: "Fernanda L.", time: "4h atr\u00e1s", text: "J\u00e1 passei por isso tantas vezes. Respira fundo, voc\u00ea \u00e9 humana.", likes: 34, liked: false, replies: [] },
      { author: "Renata B.", time: "3h atr\u00e1s", text: "A culpa \u00e9 o peso mais pesado da maternidade. Mas voc\u00ea reconhecer j\u00e1 \u00e9 um ato de amor.", likes: 21, liked: false, replies: [] },
      { author: "Beatriz S.", time: "2h atr\u00e1s", text: "Eu chorei lendo isso. Obrigada por compartilhar.", likes: 15, liked: false, replies: [] },
      { author: "Luana M.", time: "1h atr\u00e1s", text: "Nenhuma m\u00e3e \u00e9 perfeita. Voc\u00ea est\u00e1 fazendo o seu melhor.", likes: 9, liked: false, replies: [] },
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
      { author: "Patricia A.", time: "20h atr\u00e1s", text: "Faz adapta\u00e7\u00e3o gradual. Primeiro dia 1h, segundo 2h... funciona muito!", likes: 3, liked: false, replies: [] },
      { author: "Debora K.", time: "18h atr\u00e1s", text: "Leva um paninho com seu cheiro. Ajuda demais.", likes: 7, liked: false, replies: [] },
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
      { author: "Amanda G.", time: "2h atr\u00e1s", text: "O meu tem 18 meses e \u00e9 a mesma coisa. Solidariedade total.", likes: 18, liked: false, replies: [] },
      { author: "Isabela T.", time: "1h atr\u00e1s", text: "Consultora de sono mudou minha vida. Se precisar, indico.", likes: 11, liked: false, replies: [] },
      { author: "Thais R.", time: "40min atr\u00e1s", text: "Fa\u00e7a revezamento com algu\u00e9m se puder. Voc\u00ea precisa dormir tamb\u00e9m.", likes: 6, liked: false, replies: [] },
    ],
  },
];

const rodasFilters = ["Destaques", "Recentes", "Maternidade Solo", "Sono", "Desabafo"];

const RodasDeConversa = ({ onBack, posts, onOpenPost, onSendPost }) => {
  const [activeFilter, setActiveFilter] = useState("Destaques");
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState("Desabafo");

  const categoryOptions = [
    { name: "Desabafo", color: "bg-[#FF66C4] text-white" },
    { name: "Sono", color: "bg-soft-blue text-white" },
    { name: "Maternidade Solo", color: "bg-soft-purple text-white" },
  ];

  const handleNewPost = () => {
    if (newPostText.trim()) {
      const cat = categoryOptions.find(c => c.name === newPostCategory);
      onSendPost && onSendPost(newPostText.trim(), newPostCategory, cat?.color || "bg-[#FF66C4] text-white");
      setNewPostText('');
      setNewPostCategory('Desabafo');
      setIsNewPostOpen(false);
    }
  };

  // Filter and sort posts, keeping original index
  const getFilteredPosts = () => {
    let indexed = posts.map((post, idx) => ({ ...post, originalIdx: idx }));

    // Category filters
    if (activeFilter !== "Destaques" && activeFilter !== "Recentes") {
      indexed = indexed.filter((p) => p.category === activeFilter);
    }

    // Sort
    if (activeFilter === "Destaques") {
      indexed.sort((a, b) => {
        const engA = (a.likes || 0) + (a.commentsList?.length || 0);
        const engB = (b.likes || 0) + (b.commentsList?.length || 0);
        return engB - engA;
      });
    }
    // Recentes: newest first (keep original order, newest = first in array)

    return indexed;
  };

  const filteredPosts = getFilteredPosts();

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
        {filteredPosts.length === 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
            <MessageCircle size={32} className="text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">{"Nenhuma conversa nessa categoria ainda."}</p>
          </div>
        )}
        {filteredPosts.map((post) => (
          <div key={post.originalIdx} onClick={() => onOpenPost && onOpenPost(post.originalIdx)} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform">
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

            {/* Actions - Static display */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <Heart size={18} />
                  <span className="text-sm font-medium">{post.likes}</span>
                </span>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <MessageCircle size={18} />
                  <span className="text-sm font-medium">{post.commentsList?.length || 0}</span>
                </span>
              </div>
              <span className="text-gray-300">
                <Share2 size={18} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating New Post Button */}
      <div className="sticky bottom-24 z-30 flex justify-end px-6 -mt-14 pointer-events-none">
        <button
          onClick={() => setIsNewPostOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-[#FF66C4] to-[#B946FF] text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all pointer-events-auto"
        >
          <Plus size={28} />
        </button>
      </div>

      {/* New Post Modal */}
      {isNewPostOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setIsNewPostOpen(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 text-lg">Iniciar conversa</h3>
              <button onClick={() => setIsNewPostOpen(false)} className="text-gray-400">
                <X size={22} />
              </button>
            </div>

            {/* Category selector */}
            <p className="text-xs font-semibold text-gray-600 mb-2">Categoria</p>
            <div className="flex gap-2 mb-4">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setNewPostCategory(cat.name)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    newPostCategory === cat.name
                      ? cat.color
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Text input */}
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder={"O que voc\u00ea quer compartilhar?"}
              className="w-full min-h-[120px] text-base text-gray-700 placeholder-gray-400 outline-none p-4 bg-gray-50 rounded-2xl border border-gray-200 resize-none focus:ring-2 focus:ring-[#FF66C4]/30 transition-all"
            />

            <button
              onClick={handleNewPost}
              disabled={!newPostText.trim()}
              className={`w-full mt-4 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all active:scale-[0.98] ${
                newPostText.trim()
                  ? 'bg-gradient-to-r from-[#FF66C4] to-[#B946FF] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-300'
              }`}
            >
              PUBLICAR
            </button>
          </div>
        </div>
      )}
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
                  <MessageCircle size={14} /> {post.commentsList?.length || 0}
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
const PostDetail = ({ post, onBack, onAddComment, onLikePost, onLikeComment, onReplyComment, onLikeReply }) => {
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
                      <div className="pl-7 mt-1.5">
                        <button
                          onClick={() => onLikeReply(comment.originalIdx, rIdx)}
                          className={`flex items-center gap-1 text-[11px] transition-colors ${reply.liked ? 'text-[#FF66C4]' : 'text-gray-400 hover:text-[#FF66C4]'}`}
                        >
                          <Heart size={12} fill={reply.liked ? '#FF66C4' : 'none'} />
                          <span>{reply.likes || 0}</span>
                        </button>
                      </div>
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

// --- PROFILE PAGE ---
const ProfilePage = ({ userName, userEmail, posts, onLogout }) => {
  const myPosts = posts.filter((p) => p.author === "Eu");
  const totalLikes = myPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalComments = myPosts.reduce((sum, p) => sum + (p.commentsList?.length || 0), 0);

  const menuItems = [
    { icon: Bell, label: "Notifica\u00e7\u00f5es", desc: "Gerencie seus alertas" },
    { icon: Shield, label: "Privacidade", desc: "Controle quem v\u00ea seu perfil" },
    { icon: HelpCircle, label: "Ajuda", desc: "D\u00favidas frequentes" },
    { icon: Settings, label: "Configura\u00e7\u00f5es", desc: "Prefer\u00eancias do app" },
  ];

  return (
    <div className="min-h-screen bg-soft-bg pb-24 max-w-md mx-auto shadow-2xl font-sans text-gray-800">
      {/* Header */}
      <header className="relative overflow-hidden pt-12 pb-8 px-6">
        <div className="w-48 h-48 rounded-full bg-[#FF66C4]/10 blur-3xl absolute -top-16 -right-16"></div>
        <div className="w-36 h-36 rounded-full bg-soft-blue/10 blur-3xl absolute -bottom-10 -left-10"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-800">Meu Perfil</h1>
          </div>

          {/* Avatar + Info */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF66C4] to-[#B946FF] flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white text-2xl font-bold">
                {userName ? userName.charAt(0).toUpperCase() : "M"}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-800">{userName || "Mam\u00e3e"}</h2>
                <button className="text-gray-400 hover:text-soft-blue transition-colors">
                  <Edit3 size={14} />
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-0.5">{userEmail}</p>
              <p className="text-xs text-[#FF66C4] font-semibold mt-1">Membro da Aldeia</p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-800">{myPosts.length}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Conversas</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-xl font-bold text-[#FF66C4]">{totalLikes}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Curtidas</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-soft-blue">{totalComments}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{"Coment\u00e1rios"}</p>
          </div>
        </div>
      </div>

      {/* My Posts */}
      <div className="px-6 pb-6">
        <h3 className="font-bold text-gray-800 mb-3">Minhas Conversas</h3>
        {myPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
            <MessageCircle size={32} className="text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">{"Voc\u00ea ainda n\u00e3o iniciou nenhuma conversa."}</p>
            <p className="text-xs text-gray-300 mt-1">{"Use o \"Abrir o Cora\u00e7\u00e3o\" para come\u00e7ar!"}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {myPosts.map((post, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${post.categoryColor}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">{post.time}</span>
                </div>
                <p className="text-sm font-semibold text-gray-700">{post.title}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Heart size={14} />
                    <span>{post.likes || 0}</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MessageCircle size={14} />
                    <span>{post.commentsList?.length || 0}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="px-6 pb-6">
        <h3 className="font-bold text-gray-800 mb-3">{"Configura\u00e7\u00f5es"}</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors ${idx < menuItems.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="w-10 h-10 rounded-xl bg-soft-bg flex items-center justify-center flex-shrink-0">
                <item.icon size={20} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-6 pb-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-4 bg-white rounded-2xl border border-red-100 text-red-400 font-semibold text-sm hover:bg-red-50 transition-colors shadow-sm"
        >
          <LogOut size={18} />
          <span>Sair da conta</span>
        </button>
      </div>
    </div>
  );
};

const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('dmd_user') || 'null');
  } catch {
    return null;
  }
};

const App = () => {
  const [savedUser] = useState(getSavedUser);
  const [currentPage, setCurrentPage] = useState(savedUser ? 'inicio' : 'signup');
  const [selectedPostIdx, setSelectedPostIdx] = useState(null);
  const [rodasPosts, setRodasPosts] = useState(initialRodasPosts);
  const [userName, setUserName] = useState(savedUser?.name || '');
  const [userEmail, setUserEmail] = useState(savedUser?.email || '');

  const handleSendPost = (text, category, categoryColor) => {
    const newPost = {
      category: category || "Desabafo",
      categoryColor: categoryColor || "bg-[#FF66C4] text-white",
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
    handleLikePostByIdx(selectedPostIdx);
  };

  const handleLikePostByIdx = (idx) => {
    const updated = [...rodasPosts];
    const post = { ...updated[idx] };
    if (post.liked) {
      post.likes = (post.likes || 1) - 1;
      post.liked = false;
    } else {
      post.likes = (post.likes || 0) + 1;
      post.liked = true;
    }
    updated[idx] = post;
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
    const newReply = { author: "Eu", time: "Agora", text, likes: 0, liked: false };
    comment.replies = [...(comment.replies || []), newReply];
    comments[commentIdx] = comment;
    post.commentsList = comments;
    updated[selectedPostIdx] = post;
    setRodasPosts(updated);
  };

  const handleLikeReply = (commentIdx, replyIdx) => {
    if (selectedPostIdx === null) return;
    const updated = [...rodasPosts];
    const post = { ...updated[selectedPostIdx] };
    const comments = [...(post.commentsList || [])];
    const comment = { ...comments[commentIdx] };
    const replies = [...(comment.replies || [])];
    const reply = { ...replies[replyIdx] };
    if (reply.liked) {
      reply.likes = (reply.likes || 1) - 1;
      reply.liked = false;
    } else {
      reply.likes = (reply.likes || 0) + 1;
      reply.liked = true;
    }
    replies[replyIdx] = reply;
    comment.replies = replies;
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

  // Render Login page (Entrar)
  if (currentPage === 'login') {
    return (
      <LoginPage
        onLogin={({ email, username }) => {
          setUserName(username);
          setUserEmail(email);
          localStorage.setItem('dmd_user', JSON.stringify({ name: username, email }));
          setCurrentPage('inicio');
        }}
        onGoToSignup={() => setCurrentPage('signup')}
      />
    );
  }

  // Render Signup page (Criar Conta)
  if (currentPage === 'signup') {
    return (
      <SignupPage
        onSignup={({ email, username }) => {
          setUserName(username);
          setUserEmail(email);
          localStorage.setItem('dmd_user', JSON.stringify({ name: username, email }));
          setCurrentPage('onboarding');
        }}
        onGoToLogin={() => setCurrentPage('login')}
      />
    );
  }

  // Render Onboarding
  if (currentPage === 'onboarding') {
    return (
      <OnboardingPage
        userName={userName}
        onComplete={() => setCurrentPage('inicio')}
      />
    );
  }

  // Render Profile page
  if (currentPage === 'perfil') {
    return (
      <>
        <ProfilePage
          userName={userName}
          userEmail={userEmail}
          posts={rodasPosts}
          onLogout={() => {
            setUserName('');
            setUserEmail('');
            localStorage.removeItem('dmd_user');
            setCurrentPage('login');
          }}
        />
        <nav className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl px-8 py-5 flex justify-between items-center text-xs font-medium text-gray-400 max-w-[calc(28rem-2rem)] mx-auto z-50 shadow-lg border border-gray-100">
          <button onClick={() => { setCurrentPage('inicio'); window.scrollTo(0, 0); }} className="flex flex-col items-center gap-1 hover:text-gray-800 transition-colors">
            <Heart size={24} />
            <span>Inicio</span>
          </button>
          <button onClick={() => { setCurrentPage('aldeia'); window.scrollTo(0, 0); }} className="flex flex-col items-center gap-1 hover:text-gray-800 transition-colors">
            <MessageCircle size={24} />
            <span>Aldeia</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-800">
            <User size={24} fill="#374151" stroke="#374151" />
            <span className="font-semibold">Perfil</span>
          </button>
        </nav>
      </>
    );
  }

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
          onLikeReply={handleLikeReply}
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
          <button onClick={() => { setCurrentPage('perfil'); setSelectedPostIdx(null); window.scrollTo(0, 0); }} className="flex flex-col items-center gap-1 hover:text-gray-800 transition-colors">
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
        <RodasDeConversa onBack={() => setCurrentPage('aldeia')} posts={rodasPosts} onOpenPost={handleOpenPost} onSendPost={handleSendPost} />
        <nav className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl px-8 py-5 flex justify-between items-center text-xs font-medium text-gray-400 max-w-[calc(28rem-2rem)] mx-auto z-50 shadow-lg border border-gray-100">
          <button onClick={() => setCurrentPage('inicio')} className="flex flex-col items-center gap-1 hover:text-gray-800 transition-colors">
            <Heart size={24} />
            <span>Inicio</span>
          </button>
          <button onClick={() => setCurrentPage('aldeia')} className="flex flex-col items-center gap-1 text-gray-800">
            <MessageCircle size={24} fill="#374151" stroke="#374151" />
            <span className="font-semibold">Aldeia</span>
          </button>
          <button onClick={() => { setCurrentPage('perfil'); window.scrollTo(0, 0); }} className="flex flex-col items-center gap-1 hover:text-gray-800 transition-colors">
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
          <button onClick={() => { setCurrentPage('perfil'); window.scrollTo(0, 0); }} className="flex flex-col items-center gap-1 hover:text-gray-800 transition-colors">
            <User size={24} />
            <span>Perfil</span>
          </button>
        </nav>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-soft-bg pb-24 max-w-md mx-auto shadow-2xl font-sans text-gray-800">
      <Header userName={userName} />
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
        <button onClick={() => { setCurrentPage('perfil'); window.scrollTo(0, 0); }} className="flex flex-col items-center gap-1 hover:text-gray-800 transition-colors">
          <User size={24} />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
