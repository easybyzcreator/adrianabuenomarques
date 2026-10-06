import { useState, FormEvent } from "react";
import { Phone, Mail, Instagram, MapPin, Send, MessageCircle, Heart, Sparkles, Facebook, ArrowUp } from "lucide-react";
import { CONTATO, FOTOS } from "../data";
import { saveTriagem, trackClick } from "../lib/firebase";

export default function FooterSection() {
  const [nome, setNome] = useState("");
  const [relacao, setRelacao] = useState("pais"); // pais, professor, terapeuta, outro
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nome || !mensagem) return;

    setEnviado(true);
    
    try {
      // 1. Save triage to Firestore in real-time
      await saveTriagem({
        nome,
        relacao,
        email,
        telefone,
        mensagem
      });

      // 2. Track click event for metrics
      await trackClick(`Formulário de Triagem: ${nome}`, "whatsapp");

      // Build WhatsApp prefilled link and open it in a new tab
      const relacaoText = 
        relacao === "pais" ? "Pais / Responsável" : 
        relacao === "professor" ? "Educador / Professor" :
        relacao === "terapeuta" ? "Terapeuta / Colega" : "Outro";

      const text = `Olá Adriana! Estava navegando no seu site e preenchi o formulário de contato:\n\nNome: ${nome} (${relacaoText})\nE-mail: ${email}\nTelefone: ${telefone}\n\nMensagem: ${mensagem}`;
      const encodedText = encodeURIComponent(text);
      const url = `https://wa.me/${CONTATO.telefoneLimpo}?text=${encodedText}`;
      
      window.open(url, "_blank");
      
      // Reset form
      setNome("");
      setEmail("");
      setTelefone("");
      setMensagem("");
    } catch (err) {
      console.error("Erro ao registrar triagem:", err);
    } finally {
      setEnviado(false);
    }
  };

  const navLinks = [
    { name: "Sobre", href: "#quem-sou" },
    { name: "Atendimentos", href: "#atendimentos" },
    { name: "Metodologia", href: "#metodologia" },
    { name: "Cursos e Capacitações", href: "#cursos" },
    { name: "M.A.P.A. Inclusão", href: "#mapa" },
  ];

  return (
    <footer className="bg-brand-bg relative overflow-hidden pt-24" id="contato">
      {/* Background decoration */}
      <div className="absolute top-[5%] left-[-15%] w-[45vw] h-[45vw] rounded-full bg-brand-purple/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-brand-pink/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Contact Form Block */}
        <div className="bg-white border border-brand-pink/10 rounded-3xl p-8 sm:p-12 shadow-sm hover:shadow-md transition-shadow duration-300 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20" id="contact-panel-block">
          
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <div className="inline-flex items-center gap-2 text-brand-pink mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                <span className="font-sans text-xs font-bold uppercase tracking-widest">Vamos Conversar?</span>
              </div>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark leading-tight mb-4">
                Agende um Horário <br />
                <span className="text-brand-pink italic">ou Faça uma Pergunta</span>
              </h2>
              
              <p className="font-sans text-sm text-brand-dark/70 leading-relaxed mb-8">
                Estou de portas abertas para ouvir suas dores, analisar suas necessidades e encontrar, juntos, um caminho acolhedor e cheio de afeto para facilitar o processo de aprendizagem do seu filho ou aluno.
              </p>
            </div>

            {/* Direct Contact links */}
            <div className="space-y-4">
              <a
                href={`https://wa.me/${CONTATO.telefoneLimpo}?text=${encodeURIComponent("Olá Adriana! Estava navegando no seu site e gostaria de conversar sobre seus atendimentos psicopedagógicos.")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("WhatsApp (Footer)", "whatsapp")}
                className="flex items-center gap-4 p-4 rounded-2xl bg-brand-bg hover:bg-brand-pink/5 border border-brand-pink/5 transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="font-sans text-[10px] text-brand-dark/50 uppercase tracking-widest leading-none mb-1">WhatsApp</p>
                  <p className="font-sans text-sm font-bold text-brand-dark group-hover:text-brand-pink transition-colors">{CONTATO.telefone}</p>
                </div>
              </a>

              <a
                href={`mailto:${CONTATO.email}`}
                onClick={() => trackClick("E-mail Comercial (Footer)", "email")}
                className="flex items-center gap-4 p-4 rounded-2xl bg-brand-bg hover:bg-brand-pink/5 border border-brand-pink/5 transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-sans text-[10px] text-brand-dark/50 uppercase tracking-widest leading-none mb-1">E-mail Comercial</p>
                  <p className="font-sans text-sm font-bold text-brand-dark group-hover:text-brand-pink transition-colors truncate max-w-[200px] sm:max-w-xs">{CONTATO.email}</p>
                </div>
              </a>

              <a
                href={CONTATO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("Instagram Profissional (Footer)", "instagram")}
                className="flex items-center gap-4 p-4 rounded-2xl bg-brand-bg hover:bg-brand-pink/5 border border-brand-pink/5 transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                  <Instagram size={18} />
                </div>
                <div>
                  <p className="font-sans text-[10px] text-brand-dark/50 uppercase tracking-widest leading-none mb-1">Instagram Profissional</p>
                  <p className="font-sans text-sm font-bold text-brand-dark group-hover:text-brand-pink transition-colors">{CONTATO.instagram}</p>
                </div>
              </a>

              <a
                href={CONTATO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick("Local de Atendimento (Footer Card)", "maps")}
                className="flex items-center gap-4 p-4 rounded-2xl bg-brand-bg hover:bg-brand-pink/5 border border-brand-pink/5 transition-all group"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-olive/10 text-brand-olive flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-sans text-[10px] text-brand-dark/50 uppercase tracking-widest leading-none mb-1">Local de Atendimento</p>
                  <p className="font-sans text-sm font-bold text-brand-dark group-hover:text-brand-pink transition-colors">{CONTATO.localizacao}</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column - Interactive Form */}
          <div className="lg:col-span-7 bg-brand-bg/50 p-6 sm:p-8 rounded-2xl border border-brand-pink/5" id="form-container">
            <h3 className="font-serif text-lg font-bold text-brand-dark mb-6 flex items-center gap-2">
              <MessageCircle size={18} className="text-brand-pink" />
              <span>Envie sua Mensagem por WhatsApp</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Nome */}
              <div className="flex flex-col">
                <label htmlFor="form-nome" className="font-sans text-xs font-bold uppercase text-brand-dark/70 tracking-wider mb-2">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  id="form-nome"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Maria Eduarda Silva"
                  className="bg-white border border-brand-pink/10 focus:border-brand-pink outline-none px-4 py-3 rounded-xl font-sans text-sm text-brand-dark placeholder-brand-dark/30 transition-all shadow-inner"
                />
              </div>

              {/* Relação / Papel */}
              <div className="flex flex-col">
                <label className="font-sans text-xs font-bold uppercase text-brand-dark/70 tracking-wider mb-2">
                  Qual o seu papel? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "pais", label: "Pai / Mãe / Responsável" },
                    { id: "professor", label: "Professor / Coordenador" },
                    { id: "terapeuta", label: "Terapeuta / Psicólogo" },
                    { id: "outro", label: "Outro profissional" },
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setRelacao(role.id)}
                      className={`px-4 py-3 border rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                        relacao === role.id
                          ? "bg-brand-pink text-white border-brand-pink shadow-sm"
                          : "bg-white text-brand-dark/70 border-brand-pink/10 hover:border-brand-pink/30"
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email & Telefone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="form-email" className="font-sans text-xs font-bold uppercase text-brand-dark/70 tracking-wider mb-2">
                    E-mail para Contato
                  </label>
                  <input
                    type="email"
                    id="form-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: mae@email.com"
                    className="bg-white border border-brand-pink/10 focus:border-brand-pink outline-none px-4 py-3 rounded-xl font-sans text-sm text-brand-dark placeholder-brand-dark/30 transition-all shadow-inner"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label htmlFor="form-telefone" className="font-sans text-xs font-bold uppercase text-brand-dark/70 tracking-wider mb-2">
                    Celular / WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="form-telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="Ex: (19) 99999-9999"
                    className="bg-white border border-brand-pink/10 focus:border-brand-pink outline-none px-4 py-3 rounded-xl font-sans text-sm text-brand-dark placeholder-brand-dark/30 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Mensagem */}
              <div className="flex flex-col">
                <label htmlFor="form-mensagem" className="font-sans text-xs font-bold uppercase text-brand-dark/70 tracking-wider mb-2">
                  Sua Mensagem *
                </label>
                <textarea
                  id="form-mensagem"
                  required
                  rows={4}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Conte um pouco sobre as dificuldades, idade do paciente ou suas principais dúvidas..."
                  className="bg-white border border-brand-pink/10 focus:border-brand-pink outline-none p-4 rounded-xl font-sans text-sm text-brand-dark placeholder-brand-dark/30 transition-all shadow-inner resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={enviado}
                className="w-full bg-brand-pink hover:bg-brand-dark text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                id="submit-form-btn"
              >
                {enviado ? (
                  <>
                    <Sparkles size={14} className="animate-spin" />
                    <span>Redirecionando WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Enviar via WhatsApp</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>

      {/* VIVID FOOTER CONTAINER (Identical to user reference image) */}
      <div className="bg-brand-pink text-white pt-16 pb-12 mt-16 relative">
        {/* Soft background shape */}
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            
            {/* Column 1: Brand Info & Social Networks */}
            <div className="md:col-span-5 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-white p-1 border-2 border-white/40 shadow-md">
                    <img
                      src={FOTOS.logo}
                      alt="Logo Adriana Bueno Marques"
                      className="h-full w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white leading-none">Adriana Bueno Marques</h3>
                    <p className="font-sans text-[10px] text-white/90 font-bold tracking-widest uppercase mt-1">Clínica & Consultoria Pedagógica</p>
                  </div>
                </div>
                <p className="font-sans text-xs text-white/90 leading-relaxed max-w-sm">
                  Espaço de estimulação cognitiva, psicopedagogia e intervenção voltado para o acolhimento afetivo e o desenvolvimento de aprendizagens significativas de cada ser humano.
                </p>
              </div>

              {/* Social Media Buttons */}
              <div>
                <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-white/80 mb-3">Siga nas redes sociais</p>
                <div className="flex gap-3">
                  <a
                    href={CONTATO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full border border-white/40 hover:bg-white hover:text-brand-pink text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href={CONTATO.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full border border-white/40 hover:bg-white hover:text-brand-pink text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105"
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href={`https://wa.me/${CONTATO.telefoneLimpo}?text=${encodeURIComponent("Olá Adriana! Estava navegando no seu site e gostaria de falar com você.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full border border-white/40 hover:bg-white hover:text-brand-pink text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105"
                    aria-label="WhatsApp"
                  >
                    <Phone size={18} />
                  </a>
                  <a
                    href={`mailto:${CONTATO.email}`}
                    className="h-10 w-10 rounded-full border border-white/40 hover:bg-white hover:text-brand-pink text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105"
                    aria-label="E-mail"
                  >
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Anchor links (Bullets matching screenshot) */}
            <div className="md:col-span-3">
              <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-6 pb-2 border-b border-white/20">Navegação</h4>
              <ul className="space-y-3">
                {navLinks.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={link.href}
                      className="font-sans text-xs text-white/95 hover:text-white hover:underline transition-all flex items-center gap-2"
                    >
                      <span className="text-white/80">•</span>
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Quick contacts */}
            <div className="md:col-span-4">
              <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-6 pb-2 border-b border-white/20">Contato Direto</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Phone size={16} className="text-white/90 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans text-[10px] text-white/70 uppercase leading-none mb-1">Telefone / WhatsApp</p>
                    <a
                      href={`https://wa.me/${CONTATO.telefoneLimpo}?text=${encodeURIComponent("Olá Adriana! Estava navegando no seu site e gostaria de tirar algumas dúvidas pelo WhatsApp.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-xs text-white font-bold hover:underline"
                    >
                      {CONTATO.telefone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={16} className="text-white/90 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans text-[10px] text-white/70 uppercase leading-none mb-1">E-mail</p>
                    <a href={`mailto:${CONTATO.email}`} className="font-sans text-xs text-white font-bold hover:underline">
                      {CONTATO.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-white/90 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans text-[10px] text-white/70 uppercase leading-none mb-1">Localização</p>
                    <a 
                      href={CONTATO.googleMapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={() => trackClick("Localização Footer", "maps")}
                      className="font-sans text-xs text-white font-bold hover:underline"
                    >
                      {CONTATO.localizacao}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Section (Matching user reference image exactly) */}
          <div className="pt-8 border-t border-white/20 mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-white text-xs">
              
              {/* Left: Copyright */}
              <div className="text-center md:text-left text-white/90 text-xs">
                <p>© {new Date().getFullYear()} Adriana Bueno Marques – Clínica & Consultoria Pedagógica. Todos os direitos reservados.</p>
              </div>

              {/* Center: EasyByzCreator Logo (increased 100% in size) */}
              <div className="flex flex-col items-center justify-center text-center">
                <span className="font-sans text-[9px] uppercase font-bold tracking-widest text-white/80 mb-2">
                  DESENVOLVIDO POR
                </span>
                <a
                  href="https://easybyzcreator.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-transform hover:scale-105"
                  title="EasyByzCreator"
                >
                  <img
                    src="https://i.ibb.co/vxbvm33f/l-ebc.png"
                    alt="EasyByzCreator"
                    className="h-24 w-auto object-contain mx-auto"
                  />
                </a>
              </div>

              {/* Right: Developed with Love */}
              <div className="text-center md:text-right text-white/90 text-xs flex items-center justify-center md:justify-end gap-1">
                <span>Desenvolvido com</span>
                <Heart size={14} className="inline fill-white text-white mx-0.5" />
                <span>e Afetividade.</span>
              </div>

            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
