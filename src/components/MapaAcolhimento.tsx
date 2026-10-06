import { 
  Shield, 
  Layers, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  MessageCircle 
} from "lucide-react";
import { trackClick } from "../lib/firebase";

export default function MapaAcolhimento() {
  const whatsappUrl = `https://wa.me/5519997474575?text=${encodeURIComponent(
    "Oi Pati, estava no site da Adriana B Marques e tenho interesse em conhecer melhor o M.A.P.A.\nVocê pode me enviar maiores informações."
  )}`;

  return (
    <section id="produtos" className="relative py-20 bg-[#f0f7f3] border-b border-emerald-100/50">
      <div id="mapa-acolhimento" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Section (Imagem 2) */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-1.5 rounded-full bg-[#dcf2e3] border border-[#c1e9cc] text-[#246e3e] text-[11px] sm:text-xs font-semibold uppercase tracking-wider shadow-xs mb-6">
            <Layers size={15} className="text-[#246e3e] shrink-0" />
            <span>ESCOLAS, AEE, CLÍNICAS, TERAPEUTAS, ESPAÇOS RECREATIVOS, ACADEMIAS, PROFISSIONAIS LIBERAIS</span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-serif text-slate-800 leading-tight">
            M.A.P.A. do Acolhimento®:{" "}
            <span className="text-[#2ca55e] font-serif">Transforme o</span>
            <br className="hidden sm:block" />
            <span className="text-[#2ca55e] font-serif block sm:inline"> Primeiro Contato em Conexão</span>
          </h2>

          {/* Paragraphs */}
          <p className="text-slate-600 font-sans text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mt-6">
            O primeiro encontro com uma pessoa neurodivergente pode ser determinante para o sucesso do vínculo terapêutico ou pedagógico. Sem as informações certas, profissionais caminham no escuro, correndo o risco de provocar reações sensoriais, comportamentais ou emocionais de forma não intencional.
          </p>

          <p className="text-[#2ca55e] font-bold text-base sm:text-lg mt-6">
            O M.A.P.A. do Acolhimento® foi criado para mudar essa realidade.
          </p>

          <p className="text-slate-600 font-sans text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mt-4">
            Baseado na metodologia da Fabrine, este mapeamento digital estratégico é preenchido pelas famílias ou responsáveis e foi desenvolvido com um objetivo claro:{" "}
            <strong className="font-bold text-slate-800">
              eliminar por completo as lacunas de informação no primeiro contato profissional.
            </strong>
          </p>
        </div>

        {/* 2 Main Cards Grid (Imagem 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mt-14 text-left">
          
          {/* Card 1 (Left) */}
          <div className="bg-white rounded-[28px] p-7 sm:p-10 shadow-sm border border-emerald-100/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-amber-500 w-6 h-6 shrink-0" />
                <h3 className="font-serif text-2xl text-slate-800 font-normal">
                  Por que o M.A.P.A. do Acolhimento® é indispensável?
                </h3>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Com o M.A.P.A., você decodifica com precisão as especificidades do seu cliente, paciente ou aluno antes mesmo do primeiro encontro físico. Em uma única ferramenta visual e de rápida leitura, você tem acesso a dados cruciais como:
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">Sensibilidades Sensoriais:</h4>
                    <p className="text-slate-600 text-xs sm:text-sm">Sons, luzes, texturas e estressores ambientais.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">Seletividade Alimentar e Preferências:</h4>
                    <p className="text-slate-600 text-xs sm:text-sm">O que traz conforto e o que gera aversão.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">Canais de Comunicação:</h4>
                    <p className="text-slate-600 text-xs sm:text-sm">Como a pessoa se expressa e compreende o ambiente ao seu redor.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">Gatilhos e Sinais de Sobrecarga:</h4>
                    <p className="text-slate-600 text-xs sm:text-sm">Previsibilidade de itens que podem provocar crises ou desorganização.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">Interesses e Hiperfocos:</h4>
                    <p className="text-slate-600 text-xs sm:text-sm">Elementos reguladores que facilitam a criação de um vínculo afetivo e seguro desde o primeiro minuto.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2 (Right) */}
          <div className="bg-white rounded-[28px] p-7 sm:p-10 shadow-sm border border-emerald-100/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-[#2ca55e] w-6 h-6 shrink-0" />
                <h3 className="font-serif text-2xl text-slate-800 font-normal">
                  Segurança, Humanização e Previsibilidade
                </h3>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Seja na clínica, no atendimento especializado ou na sala de aula, o M.A.P.A. do Acolhimento® permite que você:
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#2ca55e] w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">Antecipe-se aos gatilhos:</h4>
                    <p className="text-slate-600 text-xs sm:text-sm">Antecipe-se aos gatilhos de crise e promova intervenções preventivas e respeitosas.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#2ca55e] w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">Preparo do ambiente:</h4>
                    <p className="text-slate-600 text-xs sm:text-sm">Prepare o ambiente com antecedência, removendo distratores e incluindo elementos reguladores.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#2ca55e] w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base">Construa um vínculo inabalável:</h4>
                    <p className="text-slate-600 text-xs sm:text-sm">Ofereça um acolhimento genuinamente humanizado e focado na singularidade de cada indivíduo.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="border-t border-slate-100 pt-6 mt-8">
              <p className="text-slate-500 italic text-xs sm:text-sm font-sans leading-relaxed">
                * Mais do que uma ficha de informações, o M.A.P.A. é um ato de respeito e uma ponte de confiança entre a família, a equipe profissional e a pessoa neurodivergente.
              </p>
            </div>
          </div>
        </div>

        {/* Quote and Highlight Callout (Imagem 4) */}
        <div className="text-center mt-16 max-w-3xl mx-auto px-4">
          <p className="italic font-serif text-slate-700 text-lg sm:text-xl leading-relaxed">
            &ldquo;Mais do que uma ficha de informações, o M.A.P.A. é um ato de respeito e uma ponte de confiança entre a família, a equipe profissional e a pessoa neurodivergente.&rdquo;
          </p>
          <h3 className="text-[#2ca55e] font-serif text-2xl sm:text-3xl mt-4">
            Leve mais previsibilidade e empatia para a sua prática diária!
          </h3>
          <div className="w-24 h-0.5 bg-[#dfc9b0] mx-auto mt-5 rounded-full" />
        </div>

        {/* Recommendations Grid (Imagem 5) */}
        <div className="max-w-6xl mx-auto mt-12 bg-white rounded-[28px] p-7 sm:p-10 shadow-sm border border-emerald-100/70 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dcf2e3] text-[#246e3e] text-xs font-bold uppercase tracking-wider self-start sm:self-auto">
              <Users size={14} />
              <span>RECOMENDADO PARA</span>
            </div>
            <p className="font-serif text-slate-700 text-base sm:text-lg">
              Como o M.A.P.A. do Acolhimento® apoia os diferentes agentes do ecossistema:
            </p>
          </div>

          <div className="border-t border-slate-100 my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2ca55e] shrink-0" />
                <h4 className="font-serif font-bold text-slate-800 text-base sm:text-lg">Escolas & AEE</h4>
              </div>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Ofereça um primeiro passo para organizar a adaptação escolar de forma humanizada, segura e preparada antes mesmo do sininho tocar.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shrink-0" />
                <h4 className="font-serif font-bold text-slate-800 text-base sm:text-lg">Clínicas & Terapeutas</h4>
              </div>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Garanta atendimentos mais previsíveis, acelere a criação do vínculo e elimine os pontos cegos do primeiro contato.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308] shrink-0" />
                <h4 className="font-serif font-bold text-slate-800 text-base sm:text-lg">Espaços & Redes de Apoio</h4>
              </div>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Espaços recreativos, Academias, Profissionais liberais, Redes de apoio: A ponte perfeita para garantir que as necessidades do seu filho ou acolhido sejam respeitadas em qualquer ambiente.
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Call to Action Button */}
        <div className="mt-14 text-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick("WhatsApp MAPA (Pati)", "whatsapp")}
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-full bg-[#25D366] hover:bg-[#1faa53] text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <MessageCircle size={22} className="fill-current shrink-0" />
            <span>Quero mais informações sobre o M.A.P.A</span>
          </a>
        </div>

      </div>
    </section>
  );
}
