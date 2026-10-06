import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  ClipboardList, 
  Layers, 
  MousePointerClick, 
  Settings, 
  LogOut, 
  Users, 
  DollarSign, 
  Plus, 
  Trash2, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle, 
  X, 
  Lock, 
  Info,
  Calendar,
  AlertCircle,
  QrCode,
  Link,
  Copy,
  Download
} from "lucide-react";
import { 
  db, 
  auth, 
  authenticateAnonymously, 
  DEFAULT_PASSWORD_FALLBACK 
} from "../lib/firebase";
import { 
  collection, 
  doc, 
  getDoc,
  onSnapshot, 
  setDoc, 
  updateDoc, 
  addDoc, 
  deleteDoc,
  serverTimestamp 
} from "firebase/firestore";

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export default function AdminDashboard({ onBackToSite }: AdminDashboardProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<"metrics" | "leads" | "crm" | "clicks" | "settings">("metrics");
  
  // Login state
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Firestore real-time data
  const [triagens, setTriagens] = useState<any[]>([]);
  const [cliques, setCliques] = useState<any[]>([]);
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [config, setConfig] = useState<any>({
    adminPassword: DEFAULT_PASSWORD_FALLBACK,
    porcentagemFabrine: 50,
    porcentagemParceiro: 25,
    porcentagemClinica: 25,
    nomeFabrine: "Fabrine (Profissional)",
    nomeParceiro: "Parceiro / Indicação",
    nomeClinica: "Clínica / Custos"
  });

  // Modals and form states
  const [isLancamentoModalOpen, setIsLancamentoModalOpen] = useState(false);
  const [formNomeCliente, setFormNomeCliente] = useState("");
  const [formTipoServico, setFormTipoServico] = useState("");
  const [formValorTotal, setFormValorTotal] = useState("");
  const [formObservacoes, setFormObservacoes] = useState("");
  
  // Custom names and splits during launch
  const [formNomeFabrine, setFormNomeFabrine] = useState("Fabrine (Profissional)");
  const [formNomeParceiro, setFormNomeParceiro] = useState("Parceiro / Indicação");
  const [formNomeClinica, setFormNomeClinica] = useState("Clínica / Custos");
  
  const [splitFabrine, setSplitFabrine] = useState(50);
  const [splitParceiro, setSplitParceiro] = useState(25);
  const [splitClinica, setSplitClinica] = useState(25);

  // Password changing form state
  const [newPassword, setNewPassword] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");

  // QR Code share state
  const [qrCodeUrl, setQrCodeUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "https://adrianabueno.psicopedagoga.com";
  });
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrCodeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check login session storage on mount
  useEffect(() => {
    const cachedAuth = sessionStorage.getItem("admin_authenticated");
    if (cachedAuth === "true") {
      setIsPasswordVerified(true);
      authenticateAnonymously();
    }
    setLoadingAuth(false);
  }, []);

  // Listen to Firestore real-time snapshots
  useEffect(() => {
    if (!isPasswordVerified) return;

    // 1. Config
    const unsubConfig = onSnapshot(doc(db, "config", "admin"), (snapshot) => {
      if (snapshot.exists()) {
        setConfig(snapshot.data());
        // Sync default percentage splits for new launches
        const data = snapshot.data();
        setSplitFabrine(data.porcentagemFabrine ?? 50);
        setSplitParceiro(data.porcentagemParceiro ?? 25);
        setSplitClinica(data.porcentagemClinica ?? 25);
        setFormNomeFabrine(data.nomeFabrine ?? "Fabrine (Profissional)");
        setFormNomeParceiro(data.nomeParceiro ?? "Parceiro / Indicação");
        setFormNomeClinica(data.nomeClinica ?? "Clínica / Custos");
      } else {
        // Initialize default config in DB if missing
        setDoc(doc(db, "config", "admin"), {
          adminPassword: DEFAULT_PASSWORD_FALLBACK,
          porcentagemFabrine: 50,
          porcentagemParceiro: 25,
          porcentagemClinica: 25,
          nomeFabrine: "Fabrine (Profissional)",
          nomeParceiro: "Parceiro / Indicação",
          nomeClinica: "Clínica / Custos"
        });
      }
    });

    // 2. Triagens (Leads)
    const unsubTriagens = onSnapshot(collection(db, "triagens"), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      // Sort by date descending
      list.sort((a, b) => new Date(b.dataHora || 0).getTime() - new Date(a.dataHora || 0).getTime());
      setTriagens(list);
    });

    // 3. Cliques
    const unsubCliques = onSnapshot(collection(db, "cliques"), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      // Sort descending
      list.sort((a, b) => new Date(b.dataHora || 0).getTime() - new Date(a.dataHora || 0).getTime());
      setCliques(list);
    });

    // 4. Lancamentos (CRM)
    const unsubLancamentos = onSnapshot(collection(db, "lancamentos"), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      list.sort((a, b) => new Date(b.dataHora || 0).getTime() - new Date(a.dataHora || 0).getTime());
      setLancamentos(list);
    });

    return () => {
      unsubConfig();
      unsubTriagens();
      unsubCliques();
      unsubLancamentos();
    };
  }, [isPasswordVerified]);

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      // First, get the config from DB if possible to check the customized password
      // Since unauthenticated read is blocked by firebase rules sometimes, we can sign in anonymously first!
      await authenticateAnonymously();
      
      const configDoc = await doc(db, "config", "admin");
      // Wait, we need to read from DB. But let's check config read. If it fails due to permissions,
      // it means they aren't authenticated yet. Our rules let authenticated users read.
      // So we authenticated anonymously above. Let's retrieve config:
      const snapshot = await getDoc(configDoc);
      let targetPassword = DEFAULT_PASSWORD_FALLBACK;
      if (snapshot.exists()) {
        targetPassword = snapshot.data().adminPassword || DEFAULT_PASSWORD_FALLBACK;
      }

      if (passwordInput === targetPassword) {
        setIsPasswordVerified(true);
        sessionStorage.setItem("admin_authenticated", "true");
      } else {
        setLoginError("Senha incorreta. Tente novamente.");
      }
    } catch (err) {
      // Fallback comparison if firebase read fails
      if (passwordInput === DEFAULT_PASSWORD_FALLBACK) {
        setIsPasswordVerified(true);
        sessionStorage.setItem("admin_authenticated", "true");
        authenticateAnonymously().catch(console.error);
      } else {
        setLoginError("Senha incorreta ou erro de conexão.");
        console.error("Login verification error:", err);
      }
    }
  };

  const handleLogout = () => {
    setIsPasswordVerified(false);
    sessionStorage.removeItem("admin_authenticated");
    setPasswordInput("");
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError("");
    setPasswordChangeSuccess("");

    if (newPassword.trim().length < 4) {
      setPasswordChangeError("A senha deve conter pelo menos 4 caracteres.");
      return;
    }

    try {
      await updateDoc(doc(db, "config", "admin"), {
        adminPassword: newPassword.trim()
      });
      setPasswordChangeSuccess("Senha administrativa atualizada com sucesso!");
      setNewPassword("");
    } catch (err) {
      setPasswordChangeError("Erro ao salvar nova senha no banco de dados.");
    }
  };

  // Update commission splits in settings
  const handleUpdateDefaultSplits = async (
    pFabrine: number, 
    pParceiro: number, 
    pClinica: number,
    nFabrine: string,
    nParceiro: string,
    nClinica: string
  ) => {
    if (pFabrine + pParceiro + pClinica !== 100) {
      alert("A soma das porcentagens deve ser exatamente 100%!");
      return;
    }
    try {
      await updateDoc(doc(db, "config", "admin"), {
        porcentagemFabrine: pFabrine,
        porcentagemParceiro: pParceiro,
        porcentagemClinica: pClinica,
        nomeFabrine: nFabrine.trim() || "Fabrine (Profissional)",
        nomeParceiro: nParceiro.trim() || "Parceiro / Indicação",
        nomeClinica: nClinica.trim() || "Clínica / Custos"
      });
      alert("Configurações padrão salvas com sucesso!");
    } catch (err) {
      alert("Erro ao atualizar divisões no banco de dados.");
    }
  };

  // Add Financial Launching
  const handleAddLancamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNomeCliente || !formTipoServico || !formValorTotal) {
      alert("Por favor preencha todos os campos obrigatórios.");
      return;
    }

    const valor = parseFloat(formValorTotal);
    if (isNaN(valor) || valor <= 0) {
      alert("Por favor digite um valor válido.");
      return;
    }

    if (splitFabrine + splitParceiro + splitClinica !== 100) {
      alert("A soma das porcentagens deve ser exatamente 100%!");
      return;
    }

    try {
      const cFabrine = (valor * splitFabrine) / 100;
      const cParceiro = (valor * splitParceiro) / 100;
      const cClinica = (valor * splitClinica) / 100;

      await addDoc(collection(db, "lancamentos"), {
        nomeCliente: formNomeCliente,
        tipoServico: formTipoServico,
        valorTotal: valor,
        observacoes: formObservacoes,
        comissaoFabrine: cFabrine,
        comissaoParceiro: cParceiro,
        comissaoClinica: cClinica,
        porcentagemFabrine: splitFabrine,
        porcentagemParceiro: splitParceiro,
        porcentagemClinica: splitClinica,
        nomeFabrine: formNomeFabrine.trim() || "Fabrine (Profissional)",
        nomeParceiro: formNomeParceiro.trim() || "Parceiro / Indicação",
        nomeClinica: formNomeClinica.trim() || "Clínica / Custos",
        dataHora: new Date().toISOString()
      });

      // Reset form & close
      setFormNomeCliente("");
      setFormTipoServico("");
      setFormValorTotal("");
      setFormObservacoes("");
      setIsLancamentoModalOpen(false);
    } catch (err) {
      alert("Erro ao registrar lançamento financeiro.");
    }
  };

  // Delete launching
  const handleDeleteLancamento = async (id: string) => {
    if (confirm("Deseja realmente excluir este lançamento financeiro?")) {
      try {
        await deleteDoc(doc(db, "lancamentos", id));
      } catch (err) {
        alert("Erro ao excluir lançamento.");
      }
    }
  };

  // Change triage lead status
  const handleUpdateTriageStatus = async (id: string, newStatus: "pendente" | "em_atendimento" | "finalizado") => {
    try {
      await updateDoc(doc(db, "triagens", id), {
        status: newStatus
      });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  // Convert/faturar triage directly
  const handleFaturarTriage = (triage: any) => {
    setFormNomeCliente(triage.nome);
    setFormTipoServico("Atendimento Clínico - Triagem");
    setFormValorTotal("");
    setFormObservacoes(`Faturamento originado da ficha de triagem preenchida em ${new Date(triage.dataHora).toLocaleDateString("pt-BR")}`);
    
    // Autofill defaults from config
    setSplitFabrine(config.porcentagemFabrine ?? 50);
    setSplitParceiro(config.porcentagemParceiro ?? 25);
    setSplitClinica(config.porcentagemClinica ?? 25);
    setFormNomeFabrine(config.nomeFabrine ?? "Fabrine (Profissional)");
    setFormNomeParceiro(config.nomeParceiro ?? "Parceiro / Indicação");
    setFormNomeClinica(config.nomeClinica ?? "Clínica / Custos");

    setIsLancamentoModalOpen(true);
    setActiveTab("crm");
  };

  // Financial calculations
  const totalFaturamento = lancamentos.reduce((acc, curr) => acc + (curr.valorTotal || 0), 0);
  const totalFabrine = lancamentos.reduce((acc, curr) => acc + (curr.comissaoFabrine || 0), 0);
  const totalParceiro = lancamentos.reduce((acc, curr) => acc + (curr.comissaoParceiro || 0), 0);
  const totalClinica = lancamentos.reduce((acc, curr) => acc + (curr.comissaoClinica || 0), 0);

  // Helper formatting currency
  const formatBRL = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  // Display date
  const formatDateTime = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString("pt-BR");
  };

  // Download QR Code helper function (1000x1000px)
  const downloadQRCode = async (urlToDownload: string) => {
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(urlToDownload)}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "qrcode-divulgacao-1000x1000.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Erro ao baixar QR Code:", error);
      // Fallback: open in new tab
      window.open(`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(urlToDownload)}`, "_blank");
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-dark/70 text-sm">Carregando painel...</p>
        </div>
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!isPasswordVerified) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center font-sans px-6 py-12 relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-purple/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-pink/5 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-white border border-brand-pink/10 rounded-3xl p-8 shadow-xl relative z-10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl font-bold text-brand-dark mb-2">Painel Estratégico</h1>
            <p className="text-brand-dark/60 text-xs uppercase tracking-widest font-bold">Gestão & Métricas da Adriana</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="login-pass" className="font-sans text-xs font-bold uppercase text-brand-dark/70 tracking-wider mb-2 flex items-center gap-1.5">
                <Lock size={12} className="text-brand-pink" />
                <span>Senha Administrativa</span>
              </label>
              <input
                type="password"
                id="login-pass"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Digite a senha de acesso"
                className="bg-brand-bg border border-brand-pink/10 focus:border-brand-pink outline-none px-4 py-3.5 rounded-xl font-sans text-sm text-brand-dark placeholder-brand-dark/30 transition-all shadow-inner"
              />
              {loginError && (
                <p className="text-red-500 text-xs font-semibold mt-2 flex items-center gap-1">
                  <AlertCircle size={12} />
                  <span>{loginError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-brand-pink hover:bg-brand-dark text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Entrar no Painel</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-brand-pink/5 text-center">
            <button
              onClick={onBackToSite}
              className="text-xs text-brand-purple hover:text-brand-pink font-semibold hover:underline"
            >
              ← Voltar ao Site Principal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN ADMIN PANEL ---
  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-brand-dark pb-16">
      
      {/* Top micro-bar */}
      <header className="bg-white border-b border-brand-pink/5 py-4 px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-lg font-bold text-brand-dark flex items-center gap-2">
            <span>Painel Estratégico do Negócio</span>
            <span className="text-[10px] bg-brand-pink/10 text-brand-pink px-2 py-0.5 rounded-full font-bold font-sans uppercase">Admin</span>
          </h1>
          <p className="text-[11px] text-brand-dark/60">Análise de interações, CRM financeiro e divisão de comissões calculadas</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="text-xs font-bold text-brand-purple/80 hover:text-brand-pink border border-brand-purple/20 hover:border-brand-pink/30 px-4 py-2 rounded-full transition-all cursor-pointer bg-brand-bg"
          >
            Site Principal
          </button>
          <button
            onClick={handleLogout}
            className="bg-brand-pink/10 hover:bg-brand-pink text-brand-pink hover:text-white p-2 rounded-full transition-all cursor-pointer"
            title="Sair do painel"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Primary Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white border border-brand-pink/10 rounded-2xl p-4 shadow-sm space-y-2 sticky top-24">
            
            <p className="text-[10px] text-brand-dark/40 uppercase font-bold tracking-wider px-3 pb-2 pt-1">Menu de Navegação</p>
            
            <button
              onClick={() => setActiveTab("metrics")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                activeTab === "metrics"
                  ? "bg-brand-gold text-white shadow-sm shadow-brand-gold/20"
                  : "text-brand-dark/80 hover:bg-brand-pink/5 hover:text-brand-pink"
              }`}
            >
              <TrendingUp size={16} />
              <span>Visão Geral / Métricas</span>
            </button>

            <button
              onClick={() => setActiveTab("leads")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                activeTab === "leads"
                  ? "bg-brand-gold text-white shadow-sm shadow-brand-gold/20"
                  : "text-brand-dark/80 hover:bg-brand-pink/5 hover:text-brand-pink"
              }`}
            >
              <ClipboardList size={16} />
              <div className="flex-1 flex items-center justify-between">
                <span>Triagens & Leads</span>
                {triagens.filter(t => t.status === "pendente").length > 0 && (
                  <span className="bg-brand-pink text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-bold">
                    {triagens.filter(t => t.status === "pendente").length}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setActiveTab("crm")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                activeTab === "crm"
                  ? "bg-brand-gold text-white shadow-sm shadow-brand-gold/20"
                  : "text-brand-dark/80 hover:bg-brand-pink/5 hover:text-brand-pink"
              }`}
            >
              <Layers size={16} />
              <span>CRM & Comissões</span>
            </button>

            <button
              onClick={() => setActiveTab("clicks")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                activeTab === "clicks"
                  ? "bg-brand-gold text-white shadow-sm shadow-brand-gold/20"
                  : "text-brand-dark/80 hover:bg-brand-pink/5 hover:text-brand-pink"
              }`}
            >
              <MousePointerClick size={16} />
              <span>Cliques WhatsApp</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                activeTab === "settings"
                  ? "bg-brand-gold text-white shadow-sm shadow-brand-gold/20"
                  : "text-brand-dark/80 hover:bg-brand-pink/5 hover:text-brand-pink"
              }`}
            >
              <Settings size={16} />
              <span>Configurar Acesso</span>
            </button>

            <div className="pt-4 mt-4 border-t border-brand-pink/5">
              <button
                onClick={onBackToSite}
                className="w-full flex items-center gap-2 px-4 py-3 text-xs font-semibold text-brand-purple hover:text-brand-pink transition-colors text-left"
              >
                <span>← Voltar ao Site Principal</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Dynamic Panel Content Area */}
        <main className="lg:col-span-9 space-y-8">
          
          {/* ==================== TAB 1: VISÃO GERAL / MÉTRICAS ==================== */}
          {activeTab === "metrics" && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-dark leading-none">Visão Geral</h2>
                <p className="text-xs text-brand-dark/60 mt-1">Desempenho e métricas em tempo real das interações e finanças</p>
              </div>

              {/* Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Stat 1: Triagens */}
                <div className="bg-white border border-brand-pink/10 rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-2.5 py-0.5 rounded-full">Triagens</span>
                    <h3 className="font-serif text-3xl font-bold text-brand-dark mt-2">{triagens.length}</h3>
                    <p className="text-[11px] text-brand-dark/50 mt-1">Fichas de pré-atendimento registradas</p>
                  </div>
                </div>

                {/* Stat 2: WhatsApp Clicks */}
                <div className="bg-white border border-brand-pink/10 rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <MousePointerClick size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-50 px-2.5 py-0.5 rounded-full">Clicks WA</span>
                    <h3 className="font-serif text-3xl font-bold text-brand-dark mt-2">{cliques.length}</h3>
                    <p className="text-[11px] text-brand-dark/50 mt-1">Cliques totais em botões de contato</p>
                  </div>
                </div>

                {/* Stat 3: Faturamento Total */}
                <div className="bg-white border border-brand-pink/10 rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="h-10 w-10 rounded-xl bg-rose-50 text-brand-pink flex items-center justify-center shrink-0">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-pink bg-rose-50 px-2.5 py-0.5 rounded-full">Faturamento</span>
                    <h3 className="font-serif text-2xl font-bold text-brand-dark mt-2">{formatBRL(totalFaturamento)}</h3>
                    <p className="text-[11px] text-brand-dark/50 mt-1">Faturamento registrado no CRM</p>
                  </div>
                </div>
              </div>

              {/* Commission splits & costs card */}
              <div className="bg-white border border-brand-pink/10 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-dark flex items-center gap-2">
                    <Layers size={18} className="text-brand-pink" />
                    <span>Divisão de Comissões e Custos</span>
                  </h3>
                  <p className="text-[11px] text-brand-dark/60">Cálculo das divisões com base nas vendas e nas proporções pré-definidas</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-brand-bg p-4 rounded-xl border border-brand-pink/5">
                    <p className="text-[10px] text-brand-dark/50 uppercase font-bold tracking-wider">{config.nomeFabrine || "Fabrine (Profissional)"}</p>
                    <p className="text-xl font-bold text-brand-dark mt-1">{formatBRL(totalFabrine)}</p>
                  </div>
                  <div className="bg-brand-bg p-4 rounded-xl border border-brand-pink/5">
                    <p className="text-[10px] text-brand-dark/50 uppercase font-bold tracking-wider">{config.nomeParceiro || "Parceiro / Indicação"}</p>
                    <p className="text-xl font-bold text-brand-dark mt-1">{formatBRL(totalParceiro)}</p>
                  </div>
                  <div className="bg-brand-bg p-4 rounded-xl border border-brand-pink/5">
                    <p className="text-[10px] text-brand-dark/50 uppercase font-bold tracking-wider">{config.nomeClinica || "Clínica / Custos"}</p>
                    <p className="text-xl font-bold text-brand-dark mt-1">{formatBRL(totalClinica)}</p>
                  </div>
                </div>
              </div>

              {/* QR Code de Divulgação do Site Section */}
              <div className="bg-white border border-brand-pink/10 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-brand-pink/5">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-brand-dark flex items-center gap-2">
                      <QrCode className="text-brand-pink" size={18} />
                      <span>QR Code de Divulgação do Site</span>
                    </h3>
                    <p className="text-[11px] text-brand-dark/60 mt-1">
                      Compartilhe seu site com facilidade. Ideal para folhetos, cartões de visita ou recepção do seu consultório.
                    </p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Rastreamento Dinâmico Ativo
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-center bg-brand-bg/40 p-6 rounded-2xl border border-brand-pink/5">
                  {/* QR Code Frame */}
                  <div className="flex flex-col items-center bg-white p-4 rounded-xl border border-brand-pink/10 shadow-sm shrink-0">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "https://adrianabueno.psicopedagoga.com")}`} 
                      alt="QR Code de Divulgação" 
                      className="w-[160px] h-[160px]"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] text-brand-dark/40 mt-2 font-mono break-all max-w-[160px] text-center font-semibold">
                      {typeof window !== "undefined" ? window.location.origin : "https://adrianabueno.psicopedagoga.com"}
                    </span>
                  </div>

                  {/* Actions and Info */}
                  <div className="flex-1 space-y-4 w-full text-center sm:text-left">
                    <div className="space-y-2">
                      <h4 className="font-serif text-base font-bold text-brand-dark">Rastreamento Inteligente</h4>
                      <p className="text-xs text-brand-dark/70 leading-relaxed">
                        Este QR Code utiliza automaticamente o endereço <strong>{typeof window !== "undefined" ? window.location.origin : "https://adrianabueno.psicopedagoga.com"}</strong>. Ao mudar o domínio ou acessar o site de outro endereço, ele continuará apontando para o lugar correto, evitando redirecionamentos inválidos e telas em branco.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => {
                          const url = typeof window !== "undefined" ? window.location.origin : "https://adrianabueno.psicopedagoga.com";
                          navigator.clipboard.writeText(url);
                          alert("Link copiado para a área de transferência!");
                        }}
                        className="flex items-center gap-1.5 bg-white hover:bg-brand-pink/5 border border-brand-pink/15 hover:border-brand-pink/30 text-brand-dark px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                      >
                        <Copy size={14} className="text-brand-purple" />
                        <span>Copiar Link do Site</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadQRCode(typeof window !== "undefined" ? window.location.origin : "https://adrianabueno.psicopedagoga.com")}
                        className="flex items-center gap-1.5 bg-brand-pink hover:bg-brand-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
                      >
                        <Download size={14} />
                        <span>Baixar Alta Resolução (1000x1000px)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Triages */}
              <div className="bg-white border border-brand-pink/10 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-brand-dark flex items-center gap-2">
                    <ClipboardList size={18} className="text-brand-pink" />
                    <span>Triagens Mais Recentes</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab("leads")} 
                    className="text-xs font-semibold text-brand-pink hover:underline"
                  >
                    Ver todas
                  </button>
                </div>

                {triagens.length === 0 ? (
                  <div className="text-center py-12 text-brand-dark/40 text-sm">
                    Nenhuma triagem enviada ainda.
                  </div>
                ) : (
                  <div className="divide-y divide-brand-pink/5">
                    {triagens.slice(0, 3).map((item) => (
                      <div key={item.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <p className="font-bold text-brand-dark text-sm">{item.nome}</p>
                          <p className="text-xs text-brand-dark/50">
                            {item.relacao === "pais" ? "Pais/Responsável" : item.relacao === "professor" ? "Educador/Prof" : "Profissional"} • {formatDateTime(item.dataHora)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                            item.status === "pendente" 
                              ? "bg-amber-50 text-amber-600" 
                              : item.status === "em_atendimento"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ==================== TAB 2: TRIAGENS & LEADS ==================== */}
          {activeTab === "leads" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-brand-dark leading-none">Triagens de Atendimento</h2>
                  <p className="text-xs text-brand-dark/60 mt-1">Gerencie leads, marque andamentos e fature no CRM</p>
                </div>
                <div className="bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full font-bold text-xs uppercase shrink-0">
                  {triagens.length} Cadastros
                </div>
              </div>

              {triagens.length === 0 ? (
                <div className="bg-white border border-brand-pink/10 rounded-2xl py-16 px-6 text-center shadow-sm">
                  <Users size={32} className="text-brand-pink/30 mx-auto mb-4 animate-pulse" />
                  <h3 className="font-serif text-base font-bold text-brand-dark">Nenhuma triagem cadastrada ainda.</h3>
                  <p className="text-xs text-brand-dark/60 mt-1 max-w-sm mx-auto">Aparecerão aqui assim que preencherem o formulário no site.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {triagens.map((item) => (
                    <div key={item.id} className="bg-white border border-brand-pink/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        
                        {/* Title and date */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-serif text-base font-bold text-brand-dark">{item.nome}</h3>
                            <span className="text-[10px] font-bold text-brand-purple bg-brand-purple/10 px-2.5 py-0.5 rounded-full capitalize">
                              {item.relacao === "pais" ? "Pais / Responsável" : item.relacao === "professor" ? "Educador / Professor" : item.relacao === "terapeuta" ? "Terapeuta / Colega" : "Outro"}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                              item.status === "pendente" 
                                ? "bg-amber-50 text-amber-600" 
                                : item.status === "em_atendimento"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="text-xs text-brand-dark/50 flex items-center gap-1.5">
                            <Clock size={12} />
                            <span>Cadastrado em {formatDateTime(item.dataHora)}</span>
                          </div>
                        </div>

                        {/* Dropdown status update / Actions */}
                        <div className="flex items-center gap-2 flex-wrap sm:shrink-0">
                          <select
                            value={item.status}
                            onChange={(e) => handleUpdateTriageStatus(item.id, e.target.value as any)}
                            className="bg-brand-bg border border-brand-pink/10 outline-none px-3 py-1.5 rounded-lg text-xs text-brand-dark font-bold cursor-pointer"
                          >
                            <option value="pendente">Pendente</option>
                            <option value="em_atendimento">Em Atendimento</option>
                            <option value="finalizado">Finalizado</option>
                          </select>

                          <button
                            onClick={() => handleFaturarTriage(item)}
                            className="bg-brand-pink text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-brand-dark transition-all cursor-pointer"
                          >
                            Faturar no CRM
                          </button>
                        </div>
                      </div>

                      {/* Contact metadata */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-brand-pink/5 text-xs text-brand-dark/80">
                        {item.telefone && (
                          <a 
                            href={`https://wa.me/55${item.telefone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-brand-pink text-left transition-colors font-bold"
                          >
                            <Phone size={14} className="text-brand-pink" />
                            <span>{item.telefone} (Chamar no WhatsApp)</span>
                          </a>
                        )}
                        {item.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-brand-pink" />
                            <span>{item.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Msg */}
                      <div className="bg-brand-bg rounded-xl p-4 mt-4 border border-brand-pink/5 text-xs leading-relaxed text-brand-dark/80">
                        <p className="font-bold text-[10px] text-brand-dark/40 uppercase mb-1">Mensagem enviada:</p>
                        <p className="whitespace-pre-line">{item.mensagem}</p>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 3: CRM & COMISSÕES ==================== */}
          {activeTab === "crm" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-brand-dark leading-none">Controle Financeiro & CRM</h2>
                  <p className="text-xs text-brand-dark/60 mt-1">Sessões cobradas, faturamentos e divisões de comissões calculadas</p>
                </div>
                <button
                  onClick={() => {
                    setFormNomeCliente("");
                    setFormTipoServico("");
                    setFormValorTotal("");
                    setFormObservacoes("");
                    setSplitFabrine(config.porcentagemFabrine ?? 50);
                    setSplitParceiro(config.porcentagemParceiro ?? 25);
                    setSplitClinica(config.porcentagemClinica ?? 25);
                    setFormNomeFabrine(config.nomeFabrine ?? "Fabrine (Profissional)");
                    setFormNomeParceiro(config.nomeParceiro ?? "Parceiro / Indicação");
                    setFormNomeClinica(config.nomeClinica ?? "Clínica / Custos");
                    setIsLancamentoModalOpen(true);
                  }}
                  className="bg-brand-gold hover:bg-brand-dark text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all duration-300 shadow-sm cursor-pointer shrink-0"
                >
                  <Plus size={14} />
                  <span>Novo Lançamento</span>
                </button>
              </div>

              {/* Stat split review */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-brand-pink/5">
                  <p className="text-[9px] text-brand-dark/50 uppercase font-bold tracking-wider">Total Geral Cobrado</p>
                  <p className="text-xl font-bold text-brand-dark mt-1">{formatBRL(totalFaturamento)}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-brand-pink/10">
                  <p className="text-[9px] text-brand-dark/50 uppercase font-bold tracking-wider">{config.nomeFabrine || "Fabrine (Profissional)"}</p>
                  <p className="text-xl font-bold text-brand-dark mt-1">{formatBRL(totalFabrine)}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-brand-pink/10">
                  <p className="text-[9px] text-brand-dark/50 uppercase font-bold tracking-wider">{config.nomeParceiro || "Parceiro / Indicação"}</p>
                  <p className="text-xl font-bold text-brand-dark mt-1">{formatBRL(totalParceiro)}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-brand-pink/10">
                  <p className="text-[9px] text-brand-dark/50 uppercase font-bold tracking-wider">{config.nomeClinica || "Clínica / Custos"}</p>
                  <p className="text-xl font-bold text-brand-dark mt-1">{formatBRL(totalClinica)}</p>
                </div>
              </div>

              {/* Launches table / grid */}
              {lancamentos.length === 0 ? (
                <div className="bg-white border border-brand-pink/10 rounded-2xl py-16 px-6 text-center shadow-sm">
                  <DollarSign size={32} className="text-brand-pink/30 mx-auto mb-4 animate-pulse" />
                  <h3 className="font-serif text-base font-bold text-brand-dark">Nenhum faturamento registrado ainda.</h3>
                  <p className="text-xs text-brand-dark/60 mt-1 max-w-sm mx-auto">Clique em "Novo Lançamento" ou converta uma triagem para começar.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lancamentos.map((item) => (
                    <div key={item.id} className="bg-white border border-brand-pink/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative">
                      
                      <button
                        onClick={() => handleDeleteLancamento(item.id)}
                        className="absolute top-6 right-6 text-brand-dark/30 hover:text-red-500 transition-colors cursor-pointer"
                        title="Excluir lançamento"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pr-8">
                        <div className="md:col-span-5 space-y-1">
                          <span className="text-[9px] font-bold uppercase bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-full">CRM Vendas</span>
                          <h4 className="font-serif text-base font-bold text-brand-dark">{item.nomeCliente}</h4>
                          <p className="text-xs text-brand-dark/80 font-semibold">{item.tipoServico}</p>
                          <div className="text-[10px] text-brand-dark/50 flex items-center gap-1 mt-1">
                            <Calendar size={10} />
                            <span>{formatDateTime(item.dataHora)}</span>
                          </div>
                        </div>

                        {/* Valor total */}
                        <div className="md:col-span-2">
                          <p className="text-[10px] text-brand-dark/40 uppercase font-bold tracking-wider">Valor Pago</p>
                          <p className="text-base font-bold text-brand-dark">{formatBRL(item.valorTotal)}</p>
                        </div>

                        {/* Commissions split output */}
                        <div className="md:col-span-5 space-y-1 bg-brand-bg p-3 rounded-xl border border-brand-pink/5 text-[11px]">
                          <p className="text-[9px] text-brand-dark/40 uppercase font-bold tracking-wider mb-2">Divisão Detalhada:</p>
                          <div className="flex justify-between items-center text-brand-dark/80">
                            <span>{item.nomeFabrine || config.nomeFabrine || "Fabrine (Profissional)"} ({item.porcentagemFabrine ?? 50}%):</span>
                            <span className="font-bold">{formatBRL(item.comissaoFabrine ?? 0)}</span>
                          </div>
                          <div className="flex justify-between items-center text-brand-dark/80">
                            <span>{item.nomeParceiro || config.nomeParceiro || "Parceiro / Indicação"} ({item.porcentagemParceiro ?? 25}%):</span>
                            <span className="font-bold">{formatBRL(item.comissaoParceiro ?? 0)}</span>
                          </div>
                          <div className="flex justify-between items-center text-brand-dark/80 border-t border-brand-pink/5 pt-1 mt-1">
                            <span>{item.nomeClinica || config.nomeClinica || "Clínica / Custos"} ({item.porcentagemClinica ?? 25}%):</span>
                            <span className="font-bold">{formatBRL(item.comissaoClinica ?? 0)}</span>
                          </div>
                        </div>
                      </div>

                      {item.observacoes && (
                        <div className="mt-4 pt-3 border-t border-brand-pink/5 text-[11px] text-brand-dark/60 leading-relaxed italic">
                          Obs: {item.observacoes}
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 4: CLIQUES WHATSAPP ==================== */}
          {activeTab === "clicks" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-brand-dark leading-none">Cliques em Botões de Contato</h2>
                  <p className="text-xs text-brand-dark/60 mt-1">Interesses captados por cliques rápidos no WhatsApp e Redes Sociais</p>
                </div>
                <div className="bg-brand-pink/10 text-brand-pink px-4 py-2 rounded-full font-bold text-xs uppercase">
                  {cliques.length} Cliques Rastreados
                </div>
              </div>

              {cliques.length === 0 ? (
                <div className="bg-white border border-brand-pink/10 rounded-2xl py-16 px-6 text-center shadow-sm">
                  <MousePointerClick size={32} className="text-brand-pink/30 mx-auto mb-4" />
                  <h3 className="font-serif text-base font-bold text-brand-dark">Nenhum clique detectado ainda.</h3>
                  <p className="text-xs text-brand-dark/60 mt-1">Sua conta do Firebase está conectada! Os cliques nas redes aparecerão aqui.</p>
                </div>
              ) : (
                <div className="bg-white border border-brand-pink/10 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FAF7F2] border-b border-brand-pink/5 text-xs font-bold uppercase text-brand-dark/70 tracking-wider">
                          <th className="px-6 py-4">Canal / Recurso Clicado</th>
                          <th className="px-6 py-4">Tipo</th>
                          <th className="px-6 py-4">Data & Hora</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-pink/5 text-xs">
                        {cliques.map((item) => (
                          <tr key={item.id} className="hover:bg-brand-bg transition-colors">
                            <td className="px-6 py-4 font-bold text-brand-dark">{item.canal}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                                item.tipo === "whatsapp" 
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                  : item.tipo === "instagram"
                                  ? "bg-purple-50 text-purple-600 border border-purple-100"
                                  : "bg-blue-50 text-blue-600 border border-blue-100"
                              }`}>
                                {item.tipo}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-brand-dark/60">{formatDateTime(item.dataHora)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 5: CONFIGURAR ACESSO ==================== */}
          {activeTab === "settings" && (
            <div className="space-y-8">
              
              {/* Title */}
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-dark leading-none">Segurança e Chave de Acesso</h2>
                <p className="text-xs text-brand-dark/60 mt-1">Altere a senha que dá acesso a este painel administrativo</p>
              </div>

              {/* Password Changing Form */}
              <div className="bg-white border border-brand-pink/10 rounded-2xl p-6 shadow-sm space-y-6">
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div className="flex flex-col">
                    <label htmlFor="new-pass" className="font-sans text-xs font-bold uppercase text-brand-dark/70 tracking-wider mb-2">
                      NOVA SENHA ADMINISTRATIVA
                    </label>
                    <input
                      type="text"
                      id="new-pass"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Digite a nova senha desejada"
                      className="bg-brand-bg border border-brand-pink/10 focus:border-brand-pink outline-none px-4 py-3.5 rounded-xl font-sans text-sm text-brand-dark placeholder-brand-dark/30 transition-all shadow-inner"
                    />
                  </div>

                  {passwordChangeSuccess && (
                    <p className="text-emerald-600 text-xs font-semibold flex items-center gap-1.5 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <CheckCircle size={14} />
                      <span>{passwordChangeSuccess}</span>
                    </p>
                  )}

                  {passwordChangeError && (
                    <p className="text-red-600 text-xs font-semibold flex items-center gap-1.5 bg-red-50 p-3 rounded-xl border border-red-100">
                      <AlertCircle size={14} />
                      <span>{passwordChangeError}</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    className="bg-[#5A3340] hover:bg-brand-dark text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md"
                  >
                    Salvar Nova Senha
                  </button>
                </form>
              </div>

              {/* Commission Splits Customizer */}
              <div className="bg-white border border-brand-pink/10 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-dark">Configuração Padrão das Comissões</h3>
                  <p className="text-xs text-brand-dark/60 mt-1">Ajuste os nomes padrão e as divisões percentuais de cada faturamento no CRM (a soma deve ser exatamente 100%)</p>
                </div>

                <div className="space-y-5 max-w-lg pt-2">
                  {/* Recipient 1 */}
                  <div className="flex flex-col sm:flex-row gap-4 items-end bg-brand-bg/40 p-4 rounded-xl border border-brand-pink/5">
                    <div className="flex-1 flex flex-col min-w-[200px]">
                      <label className="text-[10px] text-brand-dark/50 uppercase font-bold tracking-wider mb-1.5">Nome Destinatário 1</label>
                      <input
                        type="text"
                        value={config.nomeFabrine ?? "Fabrine (Profissional)"}
                        onChange={(e) => setConfig({ ...config, nomeFabrine: e.target.value })}
                        placeholder="Ex: Fabrine (Profissional)"
                        className="bg-white border border-brand-pink/10 focus:border-brand-pink outline-none px-3 py-2 rounded-xl text-xs font-semibold text-brand-dark"
                      />
                    </div>
                    <div className="w-28 flex flex-col">
                      <label className="text-[10px] text-brand-dark/50 uppercase font-bold tracking-wider mb-1.5">Porcentagem</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={config.porcentagemFabrine ?? 50}
                          onChange={(e) => setConfig({ ...config, porcentagemFabrine: parseInt(e.target.value) || 0 })}
                          className="w-full text-center bg-white border border-brand-pink/10 outline-none p-2 rounded-xl text-xs font-bold text-brand-dark"
                        />
                        <span className="text-xs text-brand-dark/50">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Recipient 2 */}
                  <div className="flex flex-col sm:flex-row gap-4 items-end bg-brand-bg/40 p-4 rounded-xl border border-brand-pink/5">
                    <div className="flex-1 flex flex-col min-w-[200px]">
                      <label className="text-[10px] text-brand-dark/50 uppercase font-bold tracking-wider mb-1.5">Nome Destinatário 2</label>
                      <input
                        type="text"
                        value={config.nomeParceiro ?? "Parceiro / Indicação"}
                        onChange={(e) => setConfig({ ...config, nomeParceiro: e.target.value })}
                        placeholder="Ex: Parceiro / Indicação"
                        className="bg-white border border-brand-pink/10 focus:border-brand-pink outline-none px-3 py-2 rounded-xl text-xs font-semibold text-brand-dark"
                      />
                    </div>
                    <div className="w-28 flex flex-col">
                      <label className="text-[10px] text-brand-dark/50 uppercase font-bold tracking-wider mb-1.5">Porcentagem</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={config.porcentagemParceiro ?? 25}
                          onChange={(e) => setConfig({ ...config, porcentagemParceiro: parseInt(e.target.value) || 0 })}
                          className="w-full text-center bg-white border border-brand-pink/10 outline-none p-2 rounded-xl text-xs font-bold text-brand-dark"
                        />
                        <span className="text-xs text-brand-dark/50">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Recipient 3 */}
                  <div className="flex flex-col sm:flex-row gap-4 items-end bg-brand-bg/40 p-4 rounded-xl border border-brand-pink/5">
                    <div className="flex-1 flex flex-col min-w-[200px]">
                      <label className="text-[10px] text-brand-dark/50 uppercase font-bold tracking-wider mb-1.5">Nome Destinatário 3</label>
                      <input
                        type="text"
                        value={config.nomeClinica ?? "Clínica / Custos"}
                        onChange={(e) => setConfig({ ...config, nomeClinica: e.target.value })}
                        placeholder="Ex: Clínica / Custos"
                        className="bg-white border border-brand-pink/10 focus:border-brand-pink outline-none px-3 py-2 rounded-xl text-xs font-semibold text-brand-dark"
                      />
                    </div>
                    <div className="w-28 flex flex-col">
                      <label className="text-[10px] text-brand-dark/50 uppercase font-bold tracking-wider mb-1.5">Porcentagem</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={config.porcentagemClinica ?? 25}
                          onChange={(e) => setConfig({ ...config, porcentagemClinica: parseInt(e.target.value) || 0 })}
                          className="w-full text-center bg-white border border-brand-pink/10 outline-none p-2 rounded-xl text-xs font-bold text-brand-dark"
                        />
                        <span className="text-xs text-brand-dark/50">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold py-3 px-4 rounded-xl bg-brand-bg border border-brand-pink/5">
                    <span>Soma das Porcentagens:</span>
                    <span className={`${
                      (config.porcentagemFabrine + config.porcentagemParceiro + config.porcentagemClinica) === 100
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}>
                      {config.porcentagemFabrine + config.porcentagemParceiro + config.porcentagemClinica}%
                    </span>
                  </div>

                  <button
                    onClick={() => handleUpdateDefaultSplits(
                      config.porcentagemFabrine, 
                      config.porcentagemParceiro, 
                      config.porcentagemClinica,
                      config.nomeFabrine ?? "Fabrine (Profissional)",
                      config.nomeParceiro ?? "Parceiro / Indicação",
                      config.nomeClinica ?? "Clínica / Custos"
                    )}
                    className="bg-brand-pink hover:bg-brand-dark text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md"
                  >
                    Salvar Configurações Padrão
                  </button>
                </div>
              </div>

              {/* QR Code & Sharing Section */}
              <div className="bg-white border border-brand-pink/10 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-dark flex items-center gap-2">
                    <QrCode className="text-brand-pink" size={18} />
                    <span>Compartilhamento e QR Code do Site</span>
                  </h3>
                  <p className="text-xs text-brand-dark/60 mt-1">
                    Gere, visualize e baixe o QR Code exclusivo do seu site para enviar aos seus clientes ou divulgar em materiais impressos.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-center bg-brand-bg/40 p-6 rounded-2xl border border-brand-pink/5">
                  {/* QR Code Display Container */}
                  <div className="flex flex-col items-center bg-white p-4 rounded-xl border border-brand-pink/10 shadow-sm shrink-0">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`} 
                      alt="QR Code do Site" 
                      className="w-[180px] h-[180px]"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] text-brand-dark/40 mt-2 font-mono break-all max-w-[180px] text-center">
                      {qrCodeUrl}
                    </span>
                  </div>

                  {/* Settings and sharing actions */}
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex flex-col">
                      <label className="text-[10px] text-brand-dark/50 uppercase font-bold tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Link size={12} className="text-brand-pink" />
                        <span>Link do QR Code (URL do Site)</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={qrCodeUrl}
                          onChange={(e) => setQrCodeUrl(e.target.value)}
                          placeholder="Digite ou cole a URL para o QR Code"
                          className="bg-white border border-brand-pink/10 focus:border-brand-pink outline-none px-3 py-2 rounded-xl text-xs font-semibold text-brand-dark flex-1 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setQrCodeUrl(window.location.origin)}
                          className="px-3 py-2 bg-white hover:bg-brand-pink/10 border border-brand-pink/10 hover:border-brand-pink/20 rounded-xl text-xs font-bold text-brand-purple transition-all"
                          title="Restaurar endereço padrão"
                        >
                          Padrão
                        </button>
                      </div>
                      <p className="text-[10px] text-brand-dark/40 mt-1">
                        Seu site principal foi detectado automaticamente. Caso use um domínio personalizado no futuro, digite o novo endereço acima.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="flex items-center gap-1.5 bg-[#FAF7F2] hover:bg-brand-pink/10 border border-brand-pink/15 hover:border-brand-pink/30 text-brand-dark px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                      >
                        <Copy size={14} className="text-brand-purple" />
                        <span>{copied ? "Link Copiado!" : "Copiar Link"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadQRCode(qrCodeUrl)}
                        className="flex items-center gap-1.5 bg-brand-pink hover:bg-brand-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
                      >
                        <Download size={14} />
                        <span>Baixar Alta Resolução (1000x1000px)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ==================== CRM: NOVO LANÇAMENTO FINANCEIRO MODAL ==================== */}
      {isLancamentoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-brand-pink/10 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsLancamentoModalOpen(false)}
              className="absolute top-6 right-6 text-brand-dark/40 hover:text-brand-pink transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="font-serif text-xl font-bold text-brand-dark mb-6">Novo Lançamento Financeiro</h3>

            <form onSubmit={handleAddLancamento} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="crm-paciente" className="font-sans text-xs font-bold uppercase text-brand-dark/70 tracking-wider mb-2">
                    NOME DO PACIENTE / CLIENTE *
                  </label>
                  <input
                    type="text"
                    id="crm-paciente"
                    required
                    value={formNomeCliente}
                    onChange={(e) => setFormNomeCliente(e.target.value)}
                    placeholder="Ex: Joãozinho"
                    className="bg-brand-bg border border-brand-pink/10 focus:border-brand-pink outline-none px-4 py-3 rounded-xl text-sm text-brand-dark"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="crm-servico" className="font-sans text-xs font-bold uppercase text-brand-dark/70 tracking-wider mb-2">
                    TIPO DE SERVIÇO / ATENDIMENTO *
                  </label>
                  <input
                    type="text"
                    id="crm-servico"
                    required
                    value={formTipoServico}
                    onChange={(e) => setFormTipoServico(e.target.value)}
                    placeholder="Ex: Avaliação Clínica, Livro, Curso..."
                    className="bg-brand-bg border border-brand-pink/10 focus:border-brand-pink outline-none px-4 py-3 rounded-xl text-sm text-brand-dark"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="crm-valor" className="font-sans text-xs font-bold uppercase text-brand-dark/70 tracking-wider mb-2">
                    VALOR TOTAL PAGO (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    id="crm-valor"
                    required
                    value={formValorTotal}
                    onChange={(e) => setFormValorTotal(e.target.value)}
                    placeholder="Ex: 1500.00"
                    className="bg-brand-bg border border-brand-pink/10 focus:border-brand-pink outline-none px-4 py-3 rounded-xl text-sm text-brand-dark font-bold text-brand-pink"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="crm-obs" className="font-sans text-xs font-bold uppercase text-brand-dark/70 tracking-wider mb-2">
                    OBSERVAÇÕES / DETALHES
                  </label>
                  <input
                    type="text"
                    id="crm-obs"
                    value={formObservacoes}
                    onChange={(e) => setFormObservacoes(e.target.value)}
                    placeholder="Qualquer nota adicional"
                    className="bg-brand-bg border border-brand-pink/10 focus:border-brand-pink outline-none px-4 py-3 rounded-xl text-sm text-brand-dark"
                  />
                </div>
              </div>

              {/* Commission adjust for this launch */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-brand-pink/5 space-y-4">
                <p className="text-[10px] text-brand-dark/50 uppercase font-bold tracking-wider leading-relaxed">
                  Configuração de comissão dos 3 destinatários (SOMA IDEAL = 100%)
                </p>

                <div className="space-y-3">
                  {/* Recipient 1 */}
                  <div className="flex justify-between items-center gap-3">
                    <input
                      type="text"
                      value={formNomeFabrine}
                      onChange={(e) => setFormNomeFabrine(e.target.value)}
                      placeholder="Nome Destinatário 1"
                      className="text-xs font-semibold text-brand-dark bg-white border border-brand-pink/15 focus:border-brand-pink outline-none px-2.5 py-1.5 rounded-xl flex-1 min-w-0 shadow-sm"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={splitFabrine}
                        onChange={(e) => setSplitFabrine(parseInt(e.target.value) || 0)}
                        className="w-12 text-center bg-white border border-brand-pink/15 outline-none py-1.5 rounded-xl text-xs font-bold text-brand-dark"
                      />
                      <span className="text-xs text-brand-dark/50">%</span>
                      <span className="text-xs font-bold text-brand-dark/70 min-w-[70px] text-right">
                        {formatBRL((parseFloat(formValorTotal) || 0) * splitFabrine / 100)}
                      </span>
                    </div>
                  </div>

                  {/* Recipient 2 */}
                  <div className="flex justify-between items-center gap-3">
                    <input
                      type="text"
                      value={formNomeParceiro}
                      onChange={(e) => setFormNomeParceiro(e.target.value)}
                      placeholder="Nome Destinatário 2"
                      className="text-xs font-semibold text-brand-dark bg-white border border-brand-pink/15 focus:border-brand-pink outline-none px-2.5 py-1.5 rounded-xl flex-1 min-w-0 shadow-sm"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={splitParceiro}
                        onChange={(e) => setSplitParceiro(parseInt(e.target.value) || 0)}
                        className="w-12 text-center bg-white border border-brand-pink/15 outline-none py-1.5 rounded-xl text-xs font-bold text-brand-dark"
                      />
                      <span className="text-xs text-brand-dark/50">%</span>
                      <span className="text-xs font-bold text-brand-dark/70 min-w-[70px] text-right">
                        {formatBRL((parseFloat(formValorTotal) || 0) * splitParceiro / 100)}
                      </span>
                    </div>
                  </div>

                  {/* Recipient 3 */}
                  <div className="flex justify-between items-center gap-3">
                    <input
                      type="text"
                      value={formNomeClinica}
                      onChange={(e) => setFormNomeClinica(e.target.value)}
                      placeholder="Nome Destinatário 3"
                      className="text-xs font-semibold text-brand-dark bg-white border border-brand-pink/15 focus:border-brand-pink outline-none px-2.5 py-1.5 rounded-xl flex-1 min-w-0 shadow-sm"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={splitClinica}
                        onChange={(e) => setSplitClinica(parseInt(e.target.value) || 0)}
                        className="w-12 text-center bg-white border border-brand-pink/15 outline-none py-1.5 rounded-xl text-xs font-bold text-brand-dark"
                      />
                      <span className="text-xs text-brand-dark/50">%</span>
                      <span className="text-xs font-bold text-brand-dark/70 min-w-[70px] text-right">
                        {formatBRL((parseFloat(formValorTotal) || 0) * splitClinica / 100)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-brand-pink/5">
                    <span>Soma das Porcentagens:</span>
                    <span className={(splitFabrine + splitParceiro + splitClinica) === 100 ? "text-emerald-600" : "text-red-500"}>
                      {splitFabrine + splitParceiro + splitClinica}%
                    </span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsLancamentoModalOpen(false)}
                  className="flex-1 border border-brand-pink/20 hover:bg-brand-pink/5 text-brand-dark py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-pink hover:bg-brand-dark text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer text-center"
                >
                  Confirmar e Salvar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
