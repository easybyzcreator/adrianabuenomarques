import { Phone, Check, Clipboard, Activity, Heart, GraduationCap, FileText } from "lucide-react";
import { CONTATO } from "../data";

interface Step {
  number: string;
  title: string;
  description: string;
  subPoints: string[];
  icon: any;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Primeiro Contato & Anamnese",
    description: "Uma conversa acolhedora com os pais ou responsáveis para escutar atenta e sensivelmente a história de vida da criança, suas dificuldades escolares, marcos de desenvolvimento e potenciais.",
    subPoints: [
      "Escuta sensível e sem julgamentos",
      "Investigação do histórico escolar",
      "Definição das metas iniciais de investigação"
    ],
    icon: Clipboard
  },
  {
    number: "02",
    title: "Avaliação Psicopedagógica",
    description: "Aplicação de instrumentos lúdicos e clínicos padronizados ao longo de 4 a 6 sessões individuais com a criança ou adolescente. Mapeamos estilos de aprendizagem, funções executivas e cognição.",
    subPoints: [
      "Testes de atenção, memória e raciocínio lógico",
      "Avaliação qualitativa de leitura e escrita",
      "Análise das bases emocionais da aprendizagem"
    ],
    icon: Activity
  },
  {
    number: "03",
    title: "Sessão de Devolutiva & Relatório",
    description: "Encontro com a família para apresentar o relatório clínico detalhado. Explicamos didaticamente os resultados e traçamos o Plano de Desenvolvimento Individualizado (PDI).",
    subPoints: [
      "Entrega do Relatório Técnico para a escola",
      "Orientações práticas para rotinas em casa",
      "Sugestões de encaminhamentos multidisciplinares"
    ],
    icon: FileText
  },
  {
    number: "04",
    title: "Intervenção Sistemática",
    description: "Sessões semanais individualizadas e cheias de ludicidade. Usamos jogos terapêuticos, materiais artísticos e arteterapia para destravar o prazer de aprender e desenvolver as funções cognitivas.",
    subPoints: [
      "Estimulação cognitiva e de funções executivas",
      "Alfabetização afetiva e lúdica",
      "Abordagem comportamental baseada em ABA"
    ],
    icon: Heart
  },
  {
    number: "05",
    title: "Acompanhamento & Parceria Escolar",
    description: "Realização de visitas técnicas periódicas à escola da criança para orientar professores, coordenadores e auxiliares na adaptação curricular, unindo família, clínica e escola.",
    subPoints: [
      "Reuniões de alinhamento com professores",
      "Adaptação prática de materiais avaliativos",
      "Monitoramento constante do progresso em sala"
    ],
    icon: GraduationCap
  }
];

export default function MethodologySection() {
  return (
    <section id="metodologia" className="py-24 bg-[#FAF0ED] text-brand-dark relative overflow-hidden">
      {/* Decorative vector overlays for matching brand */}
      <div className="absolute top-[10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-brand-pink/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-purple/5 blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title Block - Inspired by Image 6 style */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="font-sans text-xs font-bold text-brand-pink uppercase tracking-widest block mb-3">
            Como Funciona o Processo
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-brand-dark leading-tight">
            Uma Jornada de <span className="text-brand-pink font-semibold">Acolhimento</span> e <span className="text-brand-pink italic font-light">Resultados Claros</span>
          </h2>
          <p className="font-sans text-brand-dark/70 text-base mt-5 leading-relaxed max-w-2xl mx-auto text-justify">
            Nossa metodologia une a precisão da ciência cognitiva, o rigor da neuropsicopedagogia e a sensibilidade da arteterapia para criar um ambiente acolhedor, onde o afeto reconstrói a autoconfiança de quem aprende.
          </p>
        </div>

        {/* 2-Column Grid Layout - Replicating Image 6 exactly */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 max-w-5xl mx-auto" id="methodology-grid">
          {STEPS.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className="flex gap-6 items-start group"
                id={`step-container-${idx}`}
              >
                {/* Left side: beautiful circle icon - Replicating circular icons from Image 6 */}
                <div className="shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-brand-pink text-white shadow-md group-hover:scale-105 transition-transform duration-300 relative">
                  <IconComponent size={24} className="stroke-[2]" />
                  {/* Small step number badge */}
                  <span className="absolute -top-1 -right-1 bg-brand-dark text-white text-[9px] font-sans font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">
                    {step.number}
                  </span>
                </div>

                {/* Right side: text block */}
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-bold text-brand-dark mb-2 leading-snug group-hover:text-brand-pink transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm text-brand-dark/70 leading-relaxed mb-4 text-justify">
                    {step.description}
                  </p>

                  {/* Bullet sub-points */}
                  <ul className="space-y-2 border-t border-brand-pink/10 pt-3">
                    {step.subPoints.map((pt, ptIdx) => (
                      <li key={ptIdx} className="flex items-center gap-2">
                        <Check size={12} className="text-brand-pink shrink-0" />
                        <span className="font-sans text-xs text-brand-dark/80 leading-snug">
                          {pt}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Callout at the bottom */}
        <div className="mt-20 text-center max-w-xl mx-auto bg-white p-8 rounded-3xl border border-brand-pink/5 shadow-sm" id="methodology-bottom-callout">
          <div className="inline-flex items-center gap-2 mb-4 text-brand-pink justify-center">
            <Heart size={18} className="fill-brand-pink text-brand-pink" />
            <span className="font-serif font-bold text-sm text-brand-dark">Aprender com afeto, desenvolver com propósito</span>
          </div>
          <p className="font-sans text-xs text-brand-dark/70 leading-relaxed mb-6">
            Tem alguma dúvida sobre qual etapa é a ideal para o momento do seu filho ou aluno? Clique abaixo e fale diretamente com a psicopedagoga Adriana.
          </p>
          <a
            href={`https://wa.me/${CONTATO.telefoneLimpo}?text=${encodeURIComponent("Olá Adriana! Estava navegando no seu site e gostaria de tirar dúvidas sobre as etapas do acompanhamento psicopedagógico.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-pink hover:bg-brand-dark text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm"
          >
            <Phone size={12} />
            <span>Tirar dúvidas pelo WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
