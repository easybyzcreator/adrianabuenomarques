export interface Atendimento {
  id: string;
  titulo: string;
  descricao: string;
  publicoAlvo: string;
  metodologia: string;
  oQueInclui: string[];
  modalidade: "online" | "presencial" | "hibrido";
  iconName: string;
}

export interface Curso {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  preco: string;
  cargaHoraria: string;
  oQueAprende: string[];
  destinadoA: string;
  image: string;
  categoria?: "workshop" | "formacao";
}

export interface Oficina {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  formato: string;
  publicoAlvo: string;
  preco: string;
  oQueOferece: string[];
  image: string;
}

export interface Produto {
  id: string;
  titulo: string;
  descricao: string;
  preco: string;
  tipo: "pdf" | "sistema" | "jogo" | "recurso";
  detalhes: string[];
  image: string;
}

export interface Formacao {
  titulo: string;
  instituicao: string;
  tipo: "pedagogia" | "pos" | "certificacao";
}

export interface Experiencia {
  cargo: string;
  local: string;
  periodo?: string;
  detalhes: string[];
}
