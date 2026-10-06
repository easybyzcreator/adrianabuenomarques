import { useState, useEffect } from "react";
import { Menu, X, Phone, Instagram, Facebook, Send } from "lucide-react";
import { CONTATO, FOTOS } from "../data";
import { trackClick } from "../lib/firebase";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Início", href: "#" },
    { name: "Quem Sou", href: "#quem-sou" },
    { name: "Atendimentos", href: "#atendimentos" },
    { name: "Oficinas & Cursos", href: "#cursos" },
    { name: "M.A.P.A.", href: "#mapa-acolhimento" },
    { name: "Metodologia", href: "#metodologia" },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-bg/90 backdrop-blur-md shadow-sm border-b border-brand-purple/10 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group" id="nav-logo-link">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-brand-bg flex items-center justify-center p-0.5 border border-brand-purple/20 transition-transform duration-300 group-hover:scale-105">
            <img
              src={FOTOS.logo}
              alt="Logo Adriana Bueno Marques"
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-sm tracking-tight text-brand-dark leading-none">
              Adriana Bueno Marques
            </span>
            <span className="font-sans text-[10px] text-brand-purple tracking-widest uppercase leading-none mt-1">
              Psicopedagogia
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8" id="nav-desktop-menu">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-sans text-sm font-medium text-brand-dark/80 hover:text-brand-pink transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-brand-pink after:origin-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Call To Action */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={CONTATO.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick("Facebook (Navbar)", "facebook")}
            className="text-brand-dark/70 hover:text-brand-pink transition-colors p-2 rounded-full hover:bg-brand-pink/5"
            aria-label="Facebook"
          >
            <Facebook size={18} />
          </a>
          <a
            href={CONTATO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick("Instagram (Navbar)", "instagram")}
            className="text-brand-dark/70 hover:text-brand-pink transition-colors p-2 rounded-full hover:bg-brand-pink/5"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
          <a
            href={`https://wa.me/${CONTATO.telefoneLimpo}?text=${encodeURIComponent("Olá Adriana! Estava navegando no seu site e gostaria de saber mais informações sobre os seus atendimentos.")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick("WhatsApp (Navbar)", "whatsapp")}
            className="flex items-center gap-2 bg-brand-pink hover:bg-brand-dark text-brand-bg px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-md"
            id="nav-cta-btn"
          >
            <Phone size={14} />
            <span>Falar no WhatsApp</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href={`https://wa.me/${CONTATO.telefoneLimpo}?text=${encodeURIComponent("Olá Adriana! Estava navegando no seu site e gostaria de tirar algumas dúvidas sobre os atendimentos.")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick("WhatsApp Mobile (Navbar)", "whatsapp")}
            className="p-2 text-brand-pink hover:text-brand-dark"
            aria-label="Call"
          >
            <Phone size={18} />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-brand-dark hover:text-brand-pink transition-colors"
            aria-label="Toggle Menu"
            id="nav-mobile-toggle"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-brand-bg border-b border-brand-purple/10 shadow-lg overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-screen opacity-100 py-6" : "max-h-0 opacity-0 pointer-events-none"
        }`}
        id="nav-mobile-menu"
      >
        <div className="flex flex-col px-6 gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-sans text-base font-semibold text-brand-dark/90 hover:text-brand-pink transition-colors py-1"
            >
              {link.name}
            </a>
          ))}
          <hr className="border-brand-purple/10 my-2" />
          <div className="flex flex-col gap-2 mt-2">
            <a
              href={CONTATO.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-brand-dark/70 hover:text-brand-pink transition-colors"
            >
              <Facebook size={18} />
              <span>Facebook /adriana.bueno</span>
            </a>
            <a
              href={CONTATO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-brand-dark/70 hover:text-brand-pink transition-colors"
            >
              <Instagram size={18} />
              <span>{CONTATO.instagram}</span>
            </a>
          </div>
          <a
            href={`https://wa.me/${CONTATO.telefoneLimpo}?text=${encodeURIComponent("Olá Adriana! Estava navegando no seu site e gostaria de saber mais informações sobre os seus atendimentos.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-brand-pink hover:bg-brand-dark text-brand-bg py-3 rounded-xl text-sm font-semibold tracking-wider uppercase transition-all duration-300 mt-2"
          >
            <Phone size={16} />
            <span>Contato WhatsApp</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
