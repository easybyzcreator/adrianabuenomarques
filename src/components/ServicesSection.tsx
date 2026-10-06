import { Check, Phone, Brain, HeartHandshake, FileText, Sparkles, Palette, ClipboardCheck, Calculator, MapPin } from "lucide-react";
import { ATENDIMENTOS, CONTATO } from "../data";

export default function ServicesSection() {
  // Helper to map icon names to Lucide icons
  const renderIcon = (iconName: string, size = 22, className = "text-brand-pink") => {
    switch (iconName) {
      case "Brain":
        return <Brain size={size} className={className} />;
      case "HeartHandshake":
        return <HeartHandshake size={size} className={className} />;
      case "FileText":
        return <FileText size={size} className={className} />;
      case "Sparkles":
        return <Sparkles size={size} className={className} />;
      case "Palette":
        return <Palette size={size} className={className} />;
      case "ClipboardCheck":
        return <ClipboardCheck size={size} className={className} />;
      case "Calculator":
        return <Calculator size={size} className={className} />;
      default:
        return <Brain size={size} className={className} />;
    }
  };

  return (
    <section id="atendimentos" className="py-24 bg-brand-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[20%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-brand-purple/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-gold/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title and Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-pink/10 text-brand-pink text-xs font-bold uppercase tracking-wider mb-4 border border-brand-pink/15">
            <MapPin size={14} />
            <span>Atendimentos Clínicos Presenciais em Americana - SP</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-brand-dark leading-tight">
            Abordagem clínica focada na <br />
            <span className="text-brand-gold italic">neurodiversidade</span>
          </h2>
          <p className="font-sans text-brand-dark/70 text-base md:text-lg mt-6 leading-relaxed max-w-2xl mx-auto">
            Diagnóstico e intervenção de barreiras pedagógicas através de afeto, escuta ativa, ciência e estimulação cognitiva individualizada.
          </p>

          <p className="font-sans text-xs text-brand-dark/50 mt-3 font-medium">
            📍 Localização: {CONTATO.localizacao}
          </p>
        </div>

        {/* 2-Column Balanced Grid - 4 on left, 4 on right (Zero buraco / espaço sobrando) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="services-grid">
          {ATENDIMENTOS.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-brand-pink/10 rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group hover:border-brand-pink/30"
            >
              {/* Decorative top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-gold opacity-80" />

              <div>
                {/* Header: Icon, Badge and Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-brand-pink/10 text-brand-pink flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                    {renderIcon(service.iconName, 24)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-pink bg-brand-pink/5 px-2.5 py-0.5 rounded-full border border-brand-pink/10 mb-1.5">
                      Presencial
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-dark leading-tight group-hover:text-brand-pink transition-colors duration-300">
                      {service.titulo}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="font-sans text-sm text-brand-dark/80 leading-relaxed mb-5">
                  {service.descricao}
                </p>

                {/* Público-Alvo e Metodologia Box */}
                <div className="bg-brand-bg/70 p-4 rounded-2xl mb-5 border border-brand-pink/5 text-xs text-brand-dark/75 space-y-3">
                  <div>
                    <span className="font-bold text-brand-gold uppercase text-[10px] tracking-wider block mb-0.5">
                      Público-Alvo
                    </span>
                    <p className="leading-relaxed text-brand-dark/80">{service.publicoAlvo}</p>
                  </div>
                  <div>
                    <span className="font-bold text-brand-gold uppercase text-[10px] tracking-wider block mb-0.5">
                      Nossa Metodologia
                    </span>
                    <p className="leading-relaxed text-brand-dark/80">{service.metodologia}</p>
                  </div>
                </div>

                {/* O que está incluído */}
                <div className="mb-6">
                  <h4 className="font-sans text-[11px] font-bold text-brand-dark uppercase tracking-wider mb-3">
                    O que está incluído no processo:
                  </h4>
                  <ul className="space-y-2">
                    {service.oQueInclui.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="h-4 w-4 rounded-full bg-brand-olive/10 text-brand-olive flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={11} className="stroke-[3]" />
                        </div>
                        <span className="font-sans text-xs text-brand-dark/80 leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer: Location info & CTA Button */}
              <div className="pt-5 border-t border-brand-pink/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-2">
                <span className="font-sans text-xs text-brand-dark/50 flex items-center gap-1">
                  <MapPin size={13} className="text-brand-pink shrink-0" />
                  <span>Americana - SP</span>
                </span>
                
                <a
                  href={`https://wa.me/${CONTATO.telefoneLimpo}?text=${encodeURIComponent(`Olá Adriana! Estava navegando no seu site e gostaria de saber como funciona o atendimento de "${service.titulo}".`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-pink hover:bg-brand-dark text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Phone size={13} />
                  <span>Saber Mais via WhatsApp</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
