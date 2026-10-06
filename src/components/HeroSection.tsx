import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowDown, Sparkles, Heart } from "lucide-react";
import { FOTOS, CONTATO } from "../data";
import { trackClick } from "../lib/firebase";

const PROFESSIONS = [
  "Psicopedagoga",
  "Neuropsicopedagoga",
  "Arte Terapeuta",
  "Terapeuta ABA",
  "Educadora",
  "Pedagoga",
  "Mãe"
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentProfessionIdx, setCurrentProfessionIdx] = useState(0);

  // Scroll triggers using motion's useScroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth transforms linked to scroll progress (0 to 1)
  const imageScale = useTransform(scrollYProgress, [0, 0.4, 1], [1, 0.85, 0.7]);
  const imageY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -20, -50]);
  const imageBorderRadius = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "24px", "48px"]);
  
  const textLeftOpacity = useTransform(scrollYProgress, [0, 0.35, 0.6], [1, 0.5, 0]);
  const textLeftY = useTransform(scrollYProgress, [0, 0.35, 0.6], [0, -30, -50]);

  const textRightOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.95], [0, 0.3, 1, 1]);
  const textRightY = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.95], [50, 30, 0, 0]);

  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Cycle professions in the header text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProfessionIdx((prev) => (prev + 1) % PROFESSIONS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-[180vh] bg-brand-bg select-none"
      id="inicio"
    >
      {/* Sticky Frame representing 100vh of immersive interaction */}
      <div className="sticky top-0 h-[100vh] w-full flex flex-col justify-between overflow-hidden">
        
        {/* Abstract Background Design Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Soft color blobs simulating her soft colors */}
          <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-purple/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-pink/10 blur-[120px] pointer-events-none" />
          <div className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-brand-gold/10 blur-[100px] pointer-events-none" />
        </div>

        {/* Content Container Grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-20">
          
          {/* Column Left - Name, Profession Swapper, and Main Vision */}
          <motion.div
            style={{ opacity: textLeftOpacity, y: textLeftY }}
            className="md:col-span-4 flex flex-col justify-center items-start text-left z-20"
            id="hero-left-text"
          >
            <div className="inline-flex items-center gap-2 bg-brand-pink/10 border border-brand-pink/20 px-3 py-1.5 rounded-full mb-6">
              <Sparkles size={14} className="text-brand-pink animate-pulse" />
              <span className="font-sans text-[11px] font-bold text-brand-dark uppercase tracking-widest">
                Espaço de Aprendizagem
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brand-dark leading-none">
              Adriana Bueno <br />
              <span className="text-brand-pink italic">Marques</span>
            </h1>

            {/* Dynamic Profession Swapper */}
            <div className="h-10 mt-4 overflow-hidden flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={PROFESSIONS[currentProfessionIdx]}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="font-sans text-xl md:text-2xl font-semibold text-brand-purple tracking-tight"
                >
                  {PROFESSIONS[currentProfessionIdx]}
                </motion.span>
              </AnimatePresence>
            </div>

            <p className="font-sans text-base text-brand-dark/70 mt-6 leading-relaxed max-w-md text-justify">
              Oferecendo apoio psicopedagógico com olhar atento às individualidades, potencializando o desenvolvimento, com propósito de tornar o processo alegre, sensível e inclusivo.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="#atendimentos"
                className="bg-brand-pink hover:bg-brand-dark text-brand-bg px-6 py-3 rounded-full text-sm font-semibold tracking-wide text-center transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Conhecer Atendimentos
              </a>
              <a
                href="#quem-sou"
                className="border border-brand-pink/30 hover:bg-brand-pink/5 text-brand-pink px-6 py-3 rounded-full text-sm font-semibold tracking-wide text-center transition-all duration-300"
              >
                Saber Mais Sobre Mim
              </a>
            </div>
          </motion.div>

          {/* Column Center - The Portrait of Adriana (Moves and scales beautifully on scroll) */}
          <div className="md:col-span-4 h-full flex items-center justify-center relative z-10" id="hero-image-frame">
            <motion.div
              style={{
                scale: imageScale,
                y: imageY,
                borderRadius: imageBorderRadius,
              }}
              className="relative w-72 h-96 sm:w-80 sm:h-[450px] md:w-full md:h-[500px] overflow-hidden bg-brand-pink/5 shadow-2xl shadow-brand-pink/15 flex items-end justify-center group"
            >
              {/* Subtle visual glow behind her */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-pink/20 via-brand-purple/5 to-transparent z-0" />
              
              <img
                src={FOTOS.adriana}
                alt="Adriana Bueno Marques"
                className="h-[105%] w-auto max-w-none object-cover object-bottom z-10 select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Gentle bottom mask overlay to fade the image softly to white */}
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-brand-bg via-brand-bg/60 to-transparent z-20 pointer-events-none" />
            </motion.div>
          </div>

          {/* Column Right - The Slogan & Core Vision (Fades in on scroll) */}
          <motion.div
            style={{ opacity: textRightOpacity, y: textRightY }}
            className="md:col-span-4 flex flex-col justify-center items-start text-left z-20 md:pl-6"
            id="hero-right-text"
          >
            <div className="inline-flex items-center gap-2 text-brand-pink mb-4">
              <Heart size={18} className="fill-brand-pink" />
              <span className="font-serif font-bold text-lg text-brand-dark">A Conexão do Afeto</span>
            </div>

            <p className="font-serif italic text-2xl sm:text-3xl text-brand-dark font-medium leading-relaxed">
              &ldquo;Acredito na afetividade e que todos aprendem. Conectar com afetividade.&rdquo;
            </p>

            <div className="h-[2px] w-16 bg-brand-gold my-6" />

            <p className="font-sans text-sm text-brand-dark/70 leading-relaxed mb-6 text-justify">
              O aprendizado não é um processo puramente lógico; ele é afetivo, emocional e interativo. Minha missão é entender as barreiras individuais e construir caminhos suaves e motivadores para que cada pessoa brilhe.
            </p>

            <a
              href={`https://wa.me/${CONTATO.telefoneLimpo}?text=${encodeURIComponent("Olá Adriana! Estava navegando no seu site e gostaria de agendar uma sessão / conversar sobre atendimento.")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("Agendar uma Sessão (Hero)", "whatsapp")}
              className="group inline-flex items-center gap-2 bg-brand-pink hover:bg-brand-dark text-brand-bg font-sans text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <span>Agendar uma Sessão</span>
              <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform duration-300" />
            </a>
          </motion.div>
        </div>

        {/* Floating Bottom Scroll Indicator */}
        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="relative z-20 flex flex-col items-center gap-2 pb-8 pointer-events-none"
        >
          <span className="font-sans text-[10px] text-brand-dark/40 uppercase tracking-[0.2em] font-bold">
            Role para Descobrir
          </span>
          <div className="w-6 h-10 rounded-full border border-brand-pink/30 flex items-start justify-center p-1.5">
            <div
              className="w-1.5 h-2 rounded-full bg-brand-pink/70"
              style={{ animation: "scrollBounce 2s ease-in-out infinite" }}
            />
          </div>
        </motion.div>

        {/* Transition Gradient overlay at the absolute bottom of the Hero Section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-bg to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
