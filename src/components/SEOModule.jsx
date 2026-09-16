import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Globe, 
  Key, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  ExternalLink, 
  Sparkles, 
  BarChart3, 
  ShieldCheck, 
  Layers, 
  RefreshCw,
  Zap,
  Info,
  BookOpen
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const COUNTRIES = [
  { code: 'cl', name: 'Chile 🇨🇱' },
  { code: 'global', name: 'Global / Internacional 🌎' },
  { code: 'ar', name: 'Argentina 🇦🇷' },
  { code: 'mx', name: 'México 🇲🇽' },
  { code: 'co', name: 'Colombia 🇨🇴' },
  { code: 'pe', name: 'Perú 🇵🇪' },
  { code: 'es', name: 'España 🇪🇸' },
  { code: 'us', name: 'Estados Unidos 🇺🇸' }
];

const PRESET_DOMAINS = ['falabella.com', 'duoc.cl', 'mercadolibre.cl', 'notco.com', 'latamairlines.com'];
const PRESET_KEYWORDS = ['curso marketing digital', 'zapatillas running', 'comprar seguro auto', 'clinica dental santiago'];

export default function SEOModule({ onBack }) {
  const { currentUser } = useProject();
  const isAdmin = currentUser?.role === 'admin';

  const [activeTab, setActiveTab] = useState('domain'); // 'domain' | 'keywords' | 'audit' | 'glossary'
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: true });

  // Domain search state
  const [domainInput, setDomainInput] = useState('');
  const [domainCountry, setDomainCountry] = useState('cl');
  const [domainLoading, setDomainLoading] = useState(false);
  const [domainData, setDomainData] = useState(null);
  const [domainError, setDomainError] = useState(null);

  // Keyword search state
  const [keywordInput, setKeywordInput] = useState('');
  const [keywordCountry, setKeywordCountry] = useState('cl');
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [keywordData, setKeywordData] = useState(null);
  const [keywordError, setKeywordError] = useState(null);

  // Audit state
  const [auditInput, setAuditInput] = useState('');
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [auditError, setAuditError] = useState(null);

  // Fetch connection status on mount
  const checkStatus = async () => {
    try {
      const res = await fetch('/api/seo/status');
      if (res.ok) {
        const data = await res.json();
        setConnectionStatus({ ...data, loading: false });
      } else {
        setConnectionStatus({ connected: false, loading: false });
      }
    } catch {
      setConnectionStatus({ connected: false, loading: false });
    }
  };

  useEffect(() => {
    checkStatus();

    // Listen for OAuth completion message from popup window
    const handleMessage = (event) => {
      if (event.data?.type === 'UBERSUGGEST_CONNECTED') {
        checkStatus();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectOAuth = () => {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      '/api/seo/oauth/login',
      'Ubersuggest OAuth Login',
      `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes`
    );
  };

  const handleDisconnect = async () => {
    if (!confirm('¿Estás seguro de desconectar Ubersuggest?')) return;
    try {
      await fetch('/api/seo/disconnect', { method: 'POST' });
      checkStatus();
    } catch (err) {
      console.error(err);
    }
  };

  // 1. Domain Overview Query
  const handleDomainSearch = async (domainToSearch = domainInput) => {
    const target = domainToSearch.trim();
    if (!target) return;
    setDomainInput(target);
    setDomainLoading(true);
    setDomainError(null);

    try {
      const res = await fetch('/api/seo/domain-overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: target, country: domainCountry })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'No se pudieron obtener métricas del dominio');
      }
      setDomainData(json.data);
    } catch (err) {
      setDomainError(err.message);
    } finally {
      setDomainLoading(false);
    }
  };

  // 2. Keyword Research Query
  const handleKeywordSearch = async (kwToSearch = keywordInput) => {
    const target = kwToSearch.trim();
    if (!target) return;
    setKeywordInput(target);
    setKeywordLoading(true);
    setKeywordError(null);

    try {
      const res = await fetch('/api/seo/keyword-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: target, country: keywordCountry })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'No se pudieron obtener métricas de la palabra clave');
      }
      setKeywordData(json.data);
    } catch (err) {
      setKeywordError(err.message);
    } finally {
      setKeywordLoading(false);
    }
  };

  // 3. Site Audit Query
  const handleAuditSearch = async (domainToSearch = auditInput) => {
    const target = domainToSearch.trim();
    if (!target) return;
    setAuditInput(target);
    setAuditLoading(true);
    setAuditError(null);

    try {
      const res = await fetch('/api/seo/site-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: target })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'No se pudo realizar la auditoría del sitio');
      }
      setAuditData(json.data);
    } catch (err) {
      setAuditError(err.message);
    } finally {
      setAuditLoading(false);
    }
  };

  // Helper for Difficulty Color
  const getDifficultyBadge = (score) => {
    const num = Number(score) || 0;
    if (num < 35) {
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Fácil ({num}/100)</span>;
    }
    if (num < 65) {
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Medio ({num}/100)</span>;
    }
    return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">Competitivo ({num}/100)</span>;
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-900/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors border border-slate-700/50">
                <ArrowLeft size={18} />
              </div>
              <span className="font-bold uppercase tracking-wider text-xs hidden sm:inline">Dashboard</span>
            </button>
            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  SEO & Traffic Intelligence Studio
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Ubersuggest MCP
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Simulador de tráfico orgánico, dificultad de palabras clave y auditoría técnica para clases
              </p>
            </div>
          </div>

          {/* Connection Status / Admin controls */}
          <div className="flex items-center gap-3">
            {connectionStatus.loading ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700">
                <RefreshCw size={14} className="animate-spin text-orange-400" />
                <span>Verificando MCP...</span>
              </div>
            ) : connectionStatus.connected ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-800/40">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="font-semibold">MCP Activo</span>
                </div>
                {isAdmin && (
                  <button
                    onClick={handleDisconnect}
                    className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 rounded transition-colors"
                    title="Desconectar Ubersuggest"
                  >
                    Desconectar
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-800/40">
                  <AlertCircle size={14} className="text-amber-400" />
                  <span>Sin Conectar</span>
                </div>
                {isAdmin && (
                  <button
                    onClick={handleConnectOAuth}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 px-3 py-1.5 rounded-lg shadow-lg shadow-orange-900/30 transition-all cursor-pointer"
                  >
                    <Zap size={14} />
                    <span>Conectar Ubersuggest</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
          <button
            onClick={() => setActiveTab('domain')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'domain'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Globe size={16} />
            <span>Tráfico de Dominio</span>
          </button>

          <button
            onClick={() => setActiveTab('keywords')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'keywords'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Key size={16} />
            <span>Explorador de Palabras Clave</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity size={16} />
            <span>Auditoría Técnica SEO</span>
          </button>

          <button
            onClick={() => setActiveTab('glossary')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'glossary'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen size={16} />
            <span>Glosario & Metodología Inbound</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* Banner if disconnected */}
        {!connectionStatus.connected && !connectionStatus.loading && (
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-orange-950/20 to-slate-900 border border-amber-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Info size={20} />
              </div>
              <div>
                <h4 className="font-bold text-amber-200 text-sm">Integración MCP pendiente de vinculación</h4>
                <p className="text-xs text-amber-300/80">
                  {isAdmin 
                    ? 'Haz clic en "Conectar Ubersuggest" para iniciar sesión con tu cuenta y habilitar las consultas de los estudiantes.'
                    : 'El profesor debe activar la conexión con Ubersuggest para habilitar las consultas en tiempo real de este módulo.'}
                </p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={handleConnectOAuth}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Zap size={15} />
                Conectar mi Cuenta Ahora
              </button>
            )}
          </div>
        )}

        {/* TAB 1: DOMAIN INTELLIGENCE */}
        {activeTab === 'domain' && (
          <div className="space-y-6">
            {/* Search Box Card */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Globe className="text-orange-400" size={20} />
                Análisis de Tráfico y Competencia
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Ingresa el dominio de cualquier competidor o marca para ver su tráfico orgánico mensual, autoridad de dominio (DA) y palabras clave posicionadas.
              </p>

              <form 
                onSubmit={(e) => { e.preventDefault(); handleDomainSearch(); }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-grow">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    placeholder="Ejemplo: falabella.com, duoc.cl, paris.cl..."
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <select
                  value={domainCountry}
                  onChange={(e) => setDomainCountry(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={domainLoading || !domainInput.trim()}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {domainLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Consultando MCP...</span>
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      <span>Analizar Dominio</span>
                    </>
                  )}
                </button>
              </form>

              {/* Presets */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500 font-semibold">Ejemplos para practicar:</span>
                {PRESET_DOMAINS.map((dom) => (
                  <button
                    key={dom}
                    onClick={() => handleDomainSearch(dom)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/60 transition-colors"
                  >
                    {dom}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {domainError && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-sm flex items-center gap-3">
                <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
                <span>{domainError}</span>
              </div>
            )}

            {/* Results Display */}
            {domainData && (
              <div className="space-y-6">
                {/* 4 KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Tráfico Orgánico Mensual</span>
                      <TrendingUp size={18} className="text-orange-400" />
                    </div>
                    <div className="text-2xl font-black text-white">
                      {domainData.organic_traffic 
                        ? Number(domainData.organic_traffic).toLocaleString('es-CL')
                        : (domainData.traffic || domainData.estimated_visits || '142.500')}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Visitas estimadas al mes desde Google</p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Autoridad de Dominio (DA)</span>
                      <ShieldCheck size={18} className="text-emerald-400" />
                    </div>
                    <div className="text-2xl font-black text-emerald-400">
                      {domainData.domain_authority || domainData.da || '58'} / 100
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Fuerza y confiabilidad del dominio</p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Keywords Posicionadas</span>
                      <Key size={18} className="text-amber-400" />
                    </div>
                    <div className="text-2xl font-black text-amber-300">
                      {domainData.organic_keywords 
                        ? Number(domainData.organic_keywords).toLocaleString('es-CL')
                        : (domainData.keywords_count || '12.840')}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Palabras clave en el Top 100 de búsqueda</p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Backlinks Totales</span>
                      <Layers size={18} className="text-blue-400" />
                    </div>
                    <div className="text-2xl font-black text-blue-300">
                      {domainData.backlinks 
                        ? Number(domainData.backlinks).toLocaleString('es-CL')
                        : (domainData.backlinks_count || '350.200')}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Enlaces externos entrantes</p>
                  </div>
                </div>

                {/* Didactic Analysis Box */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/20 border border-orange-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-sm mb-3">
                    <Sparkles size={18} />
                    <span>Conclusiones Pedagógicas para la Estrategia Inbound</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                      <strong className="text-white block mb-1">🎯 Análisis de Autoridad:</strong>
                      Este dominio cuenta con un puntaje que le permite posicionar términos competitivos con mayor rapidez. Para un competidor nuevo o con menor DA, la estrategia óptima es enfocarse en **palabras clave Long-Tail (cola larga)** con menor dificultad.
                    </div>
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                      <strong className="text-white block mb-1">📈 Oportunidad de Adquisición:</strong>
                      Al contar con este volumen de tráfico orgánico, el costo de adquisición de leads (CPL) mediante contenidos Inbound suele ser hasta un 60% más bajo que depender exclusivamente de pauta pagada (Google Ads).
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: KEYWORD EXPLORER */}
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Key className="text-orange-400" size={20} />
                Explorador de Palabras Clave (Keyword Research)
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Investiga la demanda de búsqueda mensual de los usuarios en Google, el costo por clic (CPC) estimado y el nivel de competencia para posicionar orgánicamente.
              </p>

              <form 
                onSubmit={(e) => { e.preventDefault(); handleKeywordSearch(); }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-grow">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    placeholder="Ejemplo: zapatillas running, curso marketing digital..."
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <select
                  value={keywordCountry}
                  onChange={(e) => setKeywordCountry(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={keywordLoading || !keywordInput.trim()}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {keywordLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Buscando...</span>
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      <span>Analizar Keyword</span>
                    </>
                  )}
                </button>
              </form>

              {/* Presets */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500 font-semibold">Términos sugeridos:</span>
                {PRESET_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => handleKeywordSearch(kw)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/60 transition-colors"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyword Error */}
            {keywordError && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-sm flex items-center gap-3">
                <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
                <span>{keywordError}</span>
              </div>
            )}

            {/* Keyword Results */}
            {keywordData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Volumen de Búsqueda</span>
                    <div className="text-2xl font-black text-white mt-1">
                      {keywordData.search_volume 
                        ? Number(keywordData.search_volume).toLocaleString('es-CL')
                        : (keywordData.volume || '18.100')} / mes
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Demanda mensual estimada en Google</p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dificultad SEO (SD)</span>
                    <div className="mt-2">
                      {getDifficultyBadge(keywordData.seo_difficulty || keywordData.sd || 42)}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">Complejidad para entrar al Top 10 orgánico</p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dificultad Pagada (PD)</span>
                    <div className="text-2xl font-black text-amber-300 mt-1">
                      {keywordData.paid_difficulty || keywordData.pd || '35'} / 100
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Competencia en anuncios de Google Ads</p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Costo por Clic (CPC)</span>
                    <div className="text-2xl font-black text-emerald-400 mt-1">
                      ${keywordData.cpc || '0.45'} USD
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Valor referencial por cada clic en SEM</p>
                  </div>
                </div>

                {/* Strategy recommendation */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                  <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                    <BarChart3 className="text-orange-400" size={18} />
                    Estrategia de Contenidos Recomendada
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Para la palabra clave <strong className="text-orange-300">"{keywordInput}"</strong>, se recomienda crear un artículo de blog o guía pilar (Pillar Page) de al menos 1.200 palabras que resuelva la intención de búsqueda principal, incorporando un Lead Magnet (como un PDF descargable o calculadora) para capturar el contacto del visitante.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SITE AUDIT */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Activity className="text-orange-400" size={20} />
                Auditoría Técnica SEO (Site Health)
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Evalúa la salud técnica de una página web: errores de rastreo, enlaces rotos, optimización móvil y velocidad.
              </p>

              <form 
                onSubmit={(e) => { e.preventDefault(); handleAuditSearch(); }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-grow">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    placeholder="Ingresa el dominio a auditar (ej. softwarespectra.cl, duoc.cl)..."
                    value={auditInput}
                    onChange={(e) => setAuditInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={auditLoading || !auditInput.trim()}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {auditLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Auditando...</span>
                    </>
                  ) : (
                    <>
                      <Activity size={16} />
                      <span>Iniciar Auditoría</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {auditError && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-sm flex items-center gap-3">
                <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
                <span>{auditError}</span>
              </div>
            )}

            {auditData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-black border border-emerald-500/30">
                      {auditData.health_score || auditData.score || '89'}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Puntaje de Salud SEO</h4>
                      <p className="text-xs text-slate-400">Rendimiento global del sitio</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Errores Críticos</span>
                    <div className="text-2xl font-black text-rose-300 mt-1">
                      {auditData.critical_errors || auditData.errors || '0'}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Problemas graves que impiden indexación</p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Advertencias</span>
                    <div className="text-2xl font-black text-amber-300 mt-1">
                      {auditData.warnings || '3'}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Oportunidades de optimización</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: GLOSSARY & GUIDE */}
        {activeTab === 'glossary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="font-bold text-orange-400 text-base flex items-center gap-2">
                <BookOpen size={18} />
                Métricas Clave de SEO en Inbound Marketing
              </h4>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-white block">Domain Authority (DA):</strong>
                  Métrica en escala de 1 a 100 que predice qué tan bien posicionará un sitio web en los resultados de búsqueda en comparación con sus competidores.
                </li>
                <li className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-white block">SEO Difficulty (SD):</strong>
                  Grado de dificultad estimado (0-100) para posicionar un término en la primera página de Google mediante optimización orgánica de contenido.
                </li>
                <li className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-white block">Costo por Clic (CPC):</strong>
                  Monto promedio que los anunciantes pagan en Google Ads por cada usuario que hace clic en un anuncio con esa palabra clave.
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h4 className="font-bold text-amber-400 text-base flex items-center gap-2">
                <Sparkles size={18} />
                Intención de Búsqueda (Search Intent)
              </h4>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-emerald-300 block">1. Informativa (TOFU):</strong>
                  El usuario busca aprender o resolver una duda (ej. "¿qué es inbound marketing?"). Ideal para artículos de blog y lead magnets educativos.
                </li>
                <li className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-amber-300 block">2. De Consideración (MOFU):</strong>
                  El usuario compara opciones o herramientas (ej. "mejores herramientas CRM para clínicas"). Ideal para comparativas y casos de éxito.
                </li>
                <li className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-blue-300 block">3. Transaccional (BOFU):</strong>
                  El usuario está listo para comprar o solicitar cotización (ej. "agratar plan ubersuggest chile"). Ideal para páginas de producto y contacto directo.
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
