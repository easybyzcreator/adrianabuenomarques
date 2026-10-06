import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  image: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rosangela D.",
    role: "Mãe do Ryan (16 anos) - TEA Acompanhado desde os 10 anos.",
    text: "Sem palavras para descrever o desempenho do meu filho alcançado com dedicação e eficiência da Adriana para com ele, passando autoconfiança, bem estar, superando seus medos e renovando suas conquistas sempre contando com Amor e carinho.",
    rating: 5,
    image: "https://i.ibb.co/HptGFKJr/patitour-2026-09-16-T125741-746.png"
  },
  {
    name: "Juliane e Claudinei Silveira",
    role: "Pais do Arthur (10 anos) TDAH/TOD",
    text: "Não tenho palavras para agradecer tudo que a Adriana representou para nós. Ela acolheu o Arthur com muito carinho e foi essencial no desenvolvimento. É uma profissional incrível, preparada, dedicada e que realmente ama o que faz. Seu olhar humano, sua paciência e seu comprometimento fizeram toda diferença em nossas vidas! Nossa gratidão será eterna!",
    rating: 5,
    image: "https://i.ibb.co/6pnb8mB/patitour-2026-09-16-T125903-457.png"
  }
];

export default function TestimonialsSection() {
  return (
    <section id="depoimentos" className="py-24 bg-[#FAF6F2] relative overflow-hidden">
      {/* Decorative vectors to match brand style */}
      <div className="absolute top-[20%] left-[-5%] w-[25vw] h-[25vw] rounded-full bg-brand-pink/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30vw] h-[30vw] rounded-full bg-brand-purple/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-brand-pink mb-4 justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
            <span className="font-sans text-xs font-bold uppercase tracking-widest">Avaliações e Testemunhos</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-brand-dark leading-tight">
            O que dizem as <span className="text-brand-pink italic">Famílias</span>
          </h2>
          <p className="font-sans text-brand-dark/70 text-base mt-4 leading-relaxed">
            Relatos reais de pais, mães e educadores que vivenciaram a transformação escolar e emocional de suas crianças com o nosso apoio clínico e pedagógico.
          </p>
        </div>

        {/* Testimonials Grid (2 columns centered) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div
              key={idx}
              id={`testimonial-card-${idx}`}
              className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-brand-pink/10 hover:border-brand-pink/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="fill-brand-gold text-brand-gold stroke-[2]"
                      />
                    ))}
                  </div>
                  <Quote size={28} className="text-brand-pink/20" />
                </div>

                {/* Main Text */}
                <p className="font-sans text-base text-brand-dark/80 leading-relaxed italic mb-8">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>

              {/* Patient / Family Info */}
              <div className="flex items-center gap-4 border-t border-brand-pink/10 pt-6 mt-2">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-brand-pink/20 shadow-sm shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-brand-dark leading-tight">
                    {testimonial.name}
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-brand-pink font-medium mt-1">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
