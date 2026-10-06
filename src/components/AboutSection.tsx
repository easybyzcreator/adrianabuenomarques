import { useState } from "react";
import { BookOpen, Award, Briefcase, GraduationCap, ArrowUpRight, Sparkles, Heart } from "lucide-react";
import { FORMACAO_ACADEMICA, EXPERIENCIAS, FOTOS } from "../data";

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState<"formacao" | "experiencia">("formacao");

  return (
    <section id="quem-sou" className="py-24 bg-brand-bg relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-brand-pink/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-olive/5 blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Intro Section: Split Grid with Story on Left and Large Text Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Left Block - Story & Picture Thumbnail */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 text-brand-pink mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-purple" />
              <span className="font-sans text-xs font-bold uppercase tracking-widest">Quem é Adriana Bueno Marques</span>
            </div>
            
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-brand-dark leading-tight mb-6">
              Educadora por Vocação, <br />
              <span className="text-brand-pink italic">Psicopedagoga por Amor</span>
            </h2>

            <div className="font-sans text-brand-dark/80 space-y-4 text-base leading-relaxed text-justify">
              <p>
                <strong>Cristã</strong>, casada com Jônatas, mãe intensa de dois adolescentes, Isabelle 17 anos e Gabriel 13, natural e residente em <strong>Americana – SP</strong>, educadora, professora e coordenadora de gestão pedagógica, sou uma profissional dedicada integralmente ao universo do <strong>desenvolvimento infantil</strong> e da <strong>aprendizagem inclusiva</strong>. Com uma trajetória de mais de duas décadas na educação pública (municipal e estadual), encontrei na clínica a minha grande paixão: apoiar e desatar nós que impedem crianças e jovens de aprenderem.
              </p>
              <p>
                Acredito firmemente que todo ser humano é plenamente capaz de aprender. A aprendizagem não ocorre do nada ou num estalar de dedos, mas através de <strong>vínculos emocionais sólidos</strong>. É por meio do <strong>olhar acolhedor</strong>, da <strong>escuta atenta</strong> e de <strong>estratégias neuropsicopedagógicas</strong> fundamentadas em evidências científicas que as transformações verdadeiras acontecem.
              </p>
              <p>
                Minha formação é ampla e contínua. Sou <strong>pedagoga graduada pela UNICAMP</strong>, <strong>Artes visuais</strong> de segunda graduação, pós-graduada em <strong>Psicopedagogia institucional e clínica</strong>, <strong>Neuropsicopedagogia clínica</strong>, <strong>Educação Inclusiva pela UNESP</strong>, <strong>Arteterapia</strong>, além de possuir formação qualificada na abordagem <strong>ABA (Análise do Comportamento Aplicada)</strong>, capacitando-me para o acompanhamento personalizado de perfis neurodivergentes.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8 w-full" id="about-stats">
              <div className="bg-brand-pink/5 border border-brand-pink/10 p-5 rounded-2xl flex flex-col">
                <span className="font-serif font-bold text-3xl text-brand-pink leading-none">18+ anos</span>
                <span className="font-sans text-xs text-brand-dark/70 font-medium tracking-wide uppercase mt-2">
                  Gestão & Coordenação
                </span>
              </div>
              <div className="bg-brand-gold/5 border border-brand-gold/10 p-5 rounded-2xl flex flex-col">
                <span className="font-serif font-bold text-3xl text-brand-gold leading-none">Milhares</span>
                <span className="font-sans text-xs text-brand-dark/70 font-medium tracking-wide uppercase mt-2">
                  De Vidas Impactadas
                </span>
              </div>
            </div>
          </div>

          {/* Right Block - Immersive Mission & Philosophy Card */}
          <div className="lg:col-span-5" id="about-philosophy-card">
            <div className="bg-brand-pink text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between h-full min-h-[420px] border border-white/10">
              {/* Pattern Background Overlay */}
              <div className="absolute top-[-20%] right-[-20%] w-60 h-60 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 rounded-full bg-white/10 blur-2xl" />

              <div className="relative z-10">
                <div className="h-10 w-10 bg-white/20 border border-white/30 rounded-xl flex items-center justify-center text-white mb-8">
                  <Heart className="fill-white" size={20} />
                </div>
                
                <span className="font-sans text-[10px] font-bold text-white/80 uppercase tracking-widest block mb-3">
                  Missão Profissional
                </span>
                
                <blockquote className="font-serif text-2xl font-semibold italic text-white leading-relaxed">
                  &ldquo;Promover uma educação acolhedora, inclusiva e transformadora, contribuindo para que cada indivíduo desenvolva suas potencialidades e conquiste autonomia em seu processo de aprendizagem.&rdquo;
                </blockquote>
              </div>

              <div className="relative z-10 border-t border-white/20 pt-8 mt-8 flex items-center justify-between">
                <div>
                  <p className="font-serif text-base font-bold text-white">Adriana Bueno Marques</p>
                  <p className="font-sans text-xs text-white/80 mt-0.5">Psicopedagoga & Educadora</p>
                </div>
                <div className="font-sans text-xs font-bold text-white tracking-widest uppercase bg-white/20 border border-white/10 px-3 py-1.5 rounded-full">
                  Americana - SP
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab-driven Qualifications and Experiences Grid */}
        <div className="mt-24" id="curriculo-tabbed-section">
          <div className="flex flex-col items-center justify-center mb-12">
            <h3 className="font-serif text-3xl font-bold text-brand-dark mb-4 text-center">
              Currículo e Competências
            </h3>
            <p className="font-sans text-sm text-brand-dark/70 text-center max-w-md mb-8">
              Uma trajetória sólida pautada pela dedicação, estudo continuado e experiência de impacto nas escolas públicas e na clínica privada.
            </p>
            
            {/* Tab controls */}
            <div className="flex bg-brand-pink/5 p-1 rounded-full border border-brand-pink/10">
              <button
                onClick={() => setActiveTab("formacao")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === "formacao"
                    ? "bg-brand-pink text-brand-bg shadow-sm"
                    : "text-brand-dark/70 hover:text-brand-pink"
                }`}
              >
                <GraduationCap size={16} />
                <span>Formação Acadêmica</span>
              </button>
              <button
                onClick={() => setActiveTab("experiencia")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === "experiencia"
                    ? "bg-brand-pink text-brand-bg shadow-sm"
                    : "text-brand-dark/70 hover:text-brand-pink"
                }`}
              >
                <Briefcase size={16} />
                <span>Experiência Profissional</span>
              </button>
            </div>
          </div>

          {/* Tab content area */}
          <div className="min-h-[400px]">
            {activeTab === "formacao" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="formacoes-grid">
                {FORMACAO_ACADEMICA.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FDFCFB] hover:bg-white border border-brand-purple/5 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-default"
                  >
                    <div>
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105 ${
                        item.tipo === "pedagogia"
                          ? "bg-brand-purple/10 text-brand-purple"
                          : item.tipo === "pos"
                          ? "bg-brand-pink/10 text-brand-pink"
                          : "bg-brand-olive/10 text-brand-olive"
                      }`}>
                        {item.tipo === "pedagogia" ? (
                          <GraduationCap size={20} />
                        ) : item.tipo === "pos" ? (
                          <BookOpen size={20} />
                        ) : (
                          <Award size={20} />
                        )}
                      </div>
                      
                      <span className="font-sans text-[10px] font-bold text-brand-pink/80 uppercase tracking-widest block mb-2">
                        {item.tipo === "pedagogia"
                          ? "Graduação"
                          : item.tipo === "pos"
                          ? "Pós-graduação"
                          : "Certificação Especial"}
                      </span>

                      <h4 className="font-serif text-lg font-bold text-brand-dark group-hover:text-brand-pink transition-colors duration-300">
                        {item.titulo}
                      </h4>
                    </div>

                    <p className="font-sans text-xs text-brand-dark/70 mt-4 pt-4 border-t border-brand-purple/5 flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-brand-gold" />
                      {item.instituicao}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto" id="experiencias-list">
                {EXPERIENCIAS.map((exp, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FDFCFB] border border-brand-purple/5 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row gap-6 hover:border-brand-purple/10 transition-colors duration-300"
                  >
                    {/* Icon Column */}
                    <div className="flex md:flex-col items-start gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
                        <Briefcase size={22} />
                      </div>
                      {exp.periodo && (
                        <span className="hidden md:inline-block font-sans text-xs font-bold text-brand-pink bg-brand-pink/5 border border-brand-pink/10 px-3 py-1 rounded-full mt-2 text-center">
                          {exp.periodo}
                        </span>
                      )}
                    </div>

                    {/* Information Column */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div>
                          <h4 className="font-serif text-xl font-bold text-brand-dark">
                            {exp.cargo}
                          </h4>
                          <p className="font-sans text-sm text-brand-pink font-semibold mt-0.5">
                            {exp.local}
                          </p>
                        </div>
                        {exp.periodo && (
                          <span className="inline-block md:hidden self-start font-sans text-xs font-bold text-brand-pink bg-brand-pink/5 border border-brand-pink/10 px-3 py-1 rounded-full text-center">
                            {exp.periodo}
                          </span>
                        )}
                      </div>

                      <ul className="space-y-2.5">
                        {exp.detalhes.map((det, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2.5 font-sans text-sm text-brand-dark/80 leading-relaxed">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink mt-2 shrink-0" />
                            <span>{det}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
