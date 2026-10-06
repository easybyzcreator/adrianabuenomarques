import { useState } from "react";
import { Calendar, Clock, Check, Users, ShoppingBag, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { CURSOS, OFICINAS, CONTATO } from "../data";

export default function WorkshopsAndCourses() {
  const [viewMode, setViewMode] = useState<"oficinas" | "workshop" | "formacao">("oficinas");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [expandedOficinas, setExpandedOficinas] = useState<Record<string, boolean>>({});

  const toggleOficina = (id: string) => {
    setExpandedOficinas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter courses based on active view mode (workshop or teacher training)
  const filteredCourses = CURSOS.filter((curso) => {
    if (viewMode === "workshop") return curso.categoria === "workshop";
    if (viewMode === "formacao") return curso.categoria === "formacao";
    return false;
  });

  return (
    <section id="cursos" className="py-24 bg-[#FDFCFB] relative overflow-hidden">
      {/* Visual background decoration */}
      <div className="absolute top-[10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-brand-pink/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-purple/5 blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title and Segment Swapper */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="text-left max-w-xl">
            <div className="inline-flex items-center gap-2 text-brand-pink mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
              <span className="font-sans text-xs font-bold uppercase tracking-widest">Capacitação & Oficinas</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-brand-dark leading-tight">
              Cursos e Oficinas <br />
              <span className="text-brand-pink italic">Inclusivas</span>
            </h2>
            <p className="font-sans text-brand-dark/70 text-base mt-4 leading-relaxed">
              Formações pedagógicas completas para impulsionar sua prática docente e oficinas lúdico-terapêuticas voltadas ao desenvolvimento integral de crianças.
            </p>
          </div>

          {/* Sliding segment selector */}
          <div className="flex flex-wrap bg-brand-pink/5 p-1 rounded-3xl md:rounded-full border border-brand-pink/10 self-start md:self-end gap-1">
            <button
              id="btn-oficinas"
              onClick={() => setViewMode("oficinas")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                viewMode === "oficinas"
                  ? "bg-brand-pink text-white shadow-sm"
                  : "text-brand-dark/70 hover:text-brand-pink"
              }`}
            >
              <Calendar size={14} />
              <span>Nossas Oficinas</span>
            </button>
            <button
              id="btn-workshop"
              onClick={() => setViewMode("workshop")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                viewMode === "workshop"
                  ? "bg-brand-pink text-white shadow-sm"
                  : "text-brand-dark/70 hover:text-brand-pink"
              }`}
            >
              <BookOpen size={14} />
              <span>Workshop</span>
            </button>
            <button
              id="btn-formacao"
              onClick={() => setViewMode("formacao")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                viewMode === "formacao"
                  ? "bg-brand-pink text-white shadow-sm"
                  : "text-brand-dark/70 hover:text-brand-pink"
              }`}
            >
              <Users size={14} />
              <span>Formação para professores</span>
            </button>
          </div>
        </div>

        {/* Display Content Grid */}
        {viewMode === "oficinas" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="oficinas-grid">
            {OFICINAS.map((oficina) => {
              const isExpanded = !!expandedOficinas[oficina.id];
              return (
                <div
                  key={oficina.id}
                  className="bg-white border border-brand-pink/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image section */}
                    <div className="relative h-48 overflow-hidden bg-brand-pink/10">
                      <img
                        src={oficina.image}
                        alt={oficina.titulo}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-brand-pink font-sans text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase border border-brand-pink/10 shadow-sm">
                        ✨ Oficina Prática
                      </span>
                    </div>

                    {/* Body Content */}
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-brand-dark mb-3 leading-snug group-hover:text-brand-pink transition-colors duration-300">
                        {oficina.titulo}
                      </h3>
                      <p className="font-sans text-xs text-brand-dark/70 leading-relaxed mb-6">
                        {oficina.descricao}
                      </p>

                      {/* Metadata indicators (Always visible - Image 2) */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 font-sans text-xs text-brand-dark/80 font-medium">
                          <Clock size={14} className="text-brand-pink shrink-0" />
                          <span>Duração: {oficina.duracao}</span>
                        </div>
                        <div className="flex items-center gap-2 font-sans text-xs text-brand-dark/80 font-medium">
                          <Calendar size={14} className="text-brand-pink shrink-0" />
                          <span>Formato: {oficina.formato}</span>
                        </div>
                        <div className="flex items-center gap-2 font-sans text-xs text-brand-dark/80 font-medium">
                          <Users size={14} className="text-brand-pink shrink-0" />
                          <span>Público: {oficina.publicoAlvo}</span>
                        </div>
                      </div>

                      {/* Expandable info block */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-brand-pink/5 animate-in fade-in duration-300">
                          <h4 className="font-sans text-[10px] font-bold text-brand-gold uppercase tracking-wider mb-3">
                            O que ela oferece:
                          </h4>
                          <ul className="space-y-2 mb-6">
                            {oficina.oQueOferece.map((of, oIdx) => (
                              <li key={oIdx} className="flex items-start gap-2">
                                <Check size={12} className="text-brand-olive shrink-0 mt-0.5" />
                                <span className="font-sans text-xs text-brand-dark/80 leading-snug">
                                  {of}
                                </span>
                              </li>
                            ))}
                          </ul>

                          {/* Inline Investment and Action */}
                          <div className="pt-4 border-t border-brand-pink/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                              <p className="font-sans text-[10px] text-brand-dark/50">Valor do Investimento</p>
                              <p className="font-serif text-base font-bold text-brand-dark">{oficina.preco}</p>
                            </div>
                            <a
                              href={`https://wa.me/${CONTATO.telefoneLimpo}?text=${encodeURIComponent(`Olá Adriana! Estava navegando no seu site e gostaria de me inscrever ou saber mais detalhes da oficina: "${oficina.titulo}".`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto text-center bg-brand-pink hover:bg-brand-dark text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <ShoppingBag size={13} />
                              <span>Inscrever-se</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Toggle Button Footer */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => toggleOficina(oficina.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-brand-pink/20 text-brand-pink hover:bg-brand-pink/5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp size={14} />
                          <span>Recolher informações</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown size={14} />
                          <span>Expandir e ver mais</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="cursos-grid">
            {filteredCourses.map((curso) => (
              <div
                key={curso.id}
                className="bg-white border border-brand-pink/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row group"
              >
                {/* Image section */}
                <div className="relative w-full md:w-2/5 min-h-[220px] md:min-h-full overflow-hidden bg-brand-pink/10">
                  <img
                    src={curso.image}
                    alt={curso.titulo}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-brand-pink font-sans text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase border border-brand-pink/10 shadow-sm">
                    {viewMode === "workshop" ? "🎓 Workshop Online" : "🏫 Formação Docente"}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-sans text-[10px] font-bold text-brand-pink uppercase tracking-widest block mb-2">
                      {curso.cargaHoraria}
                    </span>
                    
                    <h3 className="font-serif text-2xl font-bold text-brand-dark mb-2 leading-snug group-hover:text-brand-pink transition-colors duration-300">
                      {curso.titulo}
                    </h3>
                    
                    <p className="font-sans text-xs italic text-brand-pink font-medium mb-4">
                      {curso.subtitulo}
                    </p>

                    <p className="font-sans text-xs text-brand-dark/70 leading-relaxed mb-6">
                      {curso.descricao}
                    </p>

                    <h4 className="font-sans text-[10px] font-bold text-brand-gold uppercase tracking-wider mb-2">
                      Destaques do aprendizado:
                    </h4>
                    <ul className="space-y-2">
                      {curso.oQueAprende.slice(0, 3).map((ap, apIdx) => (
                        <li key={apIdx} className="flex items-start gap-2">
                          <Check size={12} className="text-brand-olive shrink-0 mt-1" />
                          <span className="font-sans text-xs text-brand-dark/80 leading-relaxed">
                            {ap}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing and Action button */}
                  <div className="mt-8 pt-6 border-t border-brand-pink/5 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-sans text-[10px] text-brand-dark/50">Inscrição / Acesso</p>
                      <p className="font-serif text-lg font-bold text-brand-dark">{curso.preco}</p>
                    </div>
                    
                    <button
                      onClick={() => setSelectedItem(curso)}
                      className="bg-brand-pink hover:bg-brand-dark text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
                    >
                      Garantir Vaga
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Modal for Workshops/Courses Details */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm" id="detail-modal">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 sm:p-10 shadow-2xl relative overflow-hidden border border-brand-pink/15 animate-in fade-in zoom-in duration-300">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-brand-pink" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="font-sans text-[10px] font-bold text-brand-pink uppercase tracking-widest block mb-1">
                    {selectedItem.cargaHoraria ? "Inscrição de Curso" : "Agendamento de Oficina"}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-brand-dark leading-snug">
                    {selectedItem.titulo}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 text-brand-dark/50 hover:text-brand-dark hover:bg-brand-pink/10 rounded-full transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="font-sans text-sm text-brand-dark/80 leading-relaxed mb-6 bg-brand-pink/5 p-4 rounded-xl">
                {selectedItem.descricao}
              </p>

              <div className="space-y-4 mb-8">
                <h4 className="font-sans text-xs font-bold text-brand-gold uppercase tracking-wider">
                  O que está incluído no programa:
                </h4>
                <ul className="space-y-2.5">
                  {(selectedItem.oQueAprende || selectedItem.oQueOferece).map((it: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-brand-olive/10 text-brand-olive flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} className="stroke-[3]" />
                      </div>
                      <span className="font-sans text-xs text-brand-dark/80 leading-relaxed">
                        {it}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action and pricing panel */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-brand-pink/10">
                <div className="text-center sm:text-left">
                  <p className="font-sans text-xs text-brand-dark/50">Valor de Lançamento</p>
                  <p className="font-serif text-xl font-bold text-brand-dark">{selectedItem.preco}</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="flex-1 sm:flex-initial px-5 py-3 border border-brand-pink/20 text-brand-pink hover:bg-brand-pink/5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Voltar
                  </button>
                  <a
                    href={`https://wa.me/${CONTATO.telefoneLimpo}?text=${encodeURIComponent(`Olá Adriana! Estava navegando no seu site e gostaria de me inscrever ou saber mais detalhes de: "${selectedItem.titulo}".`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-brand-pink hover:bg-brand-dark text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <ShoppingBag size={14} />
                    <span>Confirmar via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
