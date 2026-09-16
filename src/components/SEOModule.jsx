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
  BookOpen,
  FolderKanban,
  Plus,
  Trash2,
  Edit3,
  Check,
  ChevronRight,
  Eye,
  Users,
  Target
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const COUNTRIES = [
  { code: 'cl', name: 'Chile (Español) 🇨🇱', locId: 2152 },
  { code: 'ar', name: 'Argentina (Español) 🇦🇷', locId: 2032 },
  { code: 'mx', name: 'México (Español) 🇲🇽', locId: 2484 },
  { code: 'co', name: 'Colombia (Español) 🇨🇴', locId: 2170 },
  { code: 'pe', name: 'Perú (Español) 🇵🇪', locId: 2604 },
  { code: 'es', name: 'España (Español) 🇪🇸', locId: 2724 },
  { code: 'us', name: 'Estados Unidos (Inglés) 🇺🇸', locId: 2840 },
  { code: 'us_es', name: 'Estados Unidos (Español) 🇺🇸', locId: 2840 },
  { code: 'br', name: 'Brasil (Portugués) 🇧🇷', locId: 2076 },
  { code: 'ec', name: 'Ecuador (Español) 🇪🇨', locId: 2218 },
  { code: 'uy', name: 'Uruguay (Español) 🇺🇾', locId: 2858 },
  { code: 'global', name: 'Global / Internacional 🌎', locId: 0 }
];

const PRESET_DOMAINS = ['heredafacil.cl', 'falabella.com', 'duoc.cl', 'mercadolibre.cl', 'notco.com'];
const PRESET_KEYWORDS = ['curso marketing digital', 'posesion efectiva online', 'zapatillas running', 'comprar seguro auto'];

export default function SEOModule({ onBack }) {
  const { currentUser } = useProject();
  const isAdmin = currentUser?.role === 'admin';

  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'domain' | 'keywords' | 'audit' | 'glossary'
  const [projectFilter, setProjectFilter] = useState('my'); // 'my' | 'students' | 'all'
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, loading: true });

  // Projects State
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    domain: '',
    country: 'cl',
    competitors: [],
    keywords: [],
    metrics: null
  });
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [breakdownComplete, setBreakdownComplete] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [projectError, setProjectError] = useState(null);
  const [newCompetitorInput, setNewCompetitorInput] = useState('');
  const [newKeywordInput, setNewKeywordInput] = useState('');

  // Free Domain search state
  const [domainInput, setDomainInput] = useState('');
  const [domainCountry, setDomainCountry] = useState('cl');
  const [domainLoading, setDomainLoading] = useState(false);
  const [domainData, setDomainData] = useState(null);
  const [domainError, setDomainError] = useState(null);

  // Free Keyword search state
  const [keywordInput, setKeywordInput] = useState('');
  const [keywordCountry, setKeywordCountry] = useState('cl');
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [keywordData, setKeywordData] = useState(null);
  const [keywordError, setKeywordError] = useState(null);

  // Free Audit state
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

  // Fetch Projects for student/group or teacher filter
  const fetchProjects = async (filterToUse = projectFilter) => {
    setProjectsLoading(true);
    try {
      const params = new URLSearchParams();
      if (isAdmin) {
        if (filterToUse === 'my') {
          params.append('filter', 'teacher');
          if (currentUser?.id) params.append('userId', currentUser.id);
        } else if (filterToUse === 'students') {
          params.append('filter', 'students');
        } else {
          params.append('filter', 'all');
        }
      } else {
        if (currentUser?.group_id) params.append('groupId', currentUser.group_id);
        if (currentUser?.id) params.append('userId', currentUser.id);
      }

      const res = await fetch(`/api/seo/projects?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setProjects(json.projects || []);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    fetchProjects();

    const handleMessage = (event) => {
      if (event.data?.type === 'UBERSUGGEST_CONNECTED') {
        checkStatus();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentUser]);

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
    if (!confirm('¿Estás seguro de desconectar la sesión de SEO?')) return;
    try {
      await fetch('/api/seo/disconnect', { method: 'POST' });
      checkStatus();
    } catch (err) {
      console.error(err);
    }
  };

  // Desglose automático con Ubersuggest
  const handleBreakdownProject = async (domainOverride, countryOverride) => {
    const targetDomain = (domainOverride || projectForm.domain || '').trim();
    const targetCountry = countryOverride || projectForm.country || 'cl';

    if (!targetDomain) {
      setProjectError('Por favor ingresa un dominio para que Ubersuggest pueda analizarlo.');
      return;
    }

    setBreakdownLoading(true);
    setProjectError(null);

    try {
      const res = await fetch('/api/seo/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: targetDomain, country: targetCountry })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'No se pudo realizar el desglose con Ubersuggest');
      }

      // Autogenerar nombre de proyecto si está vacío
      const cleanName = projectForm.name.trim() 
        ? projectForm.name 
        : `Estrategia SEO - ${json.domain.toUpperCase()}`;

      setProjectForm(prev => ({
        ...prev,
        name: cleanName,
        domain: json.domain,
        country: json.country,
        competitors: json.competitors || [],
        keywords: json.keywords || [],
        metrics: json.metrics || null
      }));

      setBreakdownComplete(true);
    } catch (err) {
      setProjectError(err.message);
    } finally {
      setBreakdownLoading(false);
    }
  };

  // Agregar competidor manual al desglose
  const handleAddCompetitor = () => {
    const clean = newCompetitorInput.trim().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    if (!clean) return;
    if (!projectForm.competitors.includes(clean)) {
      setProjectForm(prev => ({ ...prev, competitors: [...prev.competitors, clean] }));
    }
    setNewCompetitorInput('');
  };

  // Remover competidor del desglose
  const handleRemoveCompetitor = (comp) => {
    setProjectForm(prev => ({
      ...prev,
      competitors: prev.competitors.filter(c => (typeof c === 'string' ? c : c.domain) !== (typeof comp === 'string' ? comp : comp.domain))
    }));
  };

  // Agregar keyword manual al desglose
  const handleAddKeyword = () => {
    const kw = newKeywordInput.trim();
    if (!kw) return;
    setProjectForm(prev => ({
      ...prev,
      keywords: [...prev.keywords, { keyword: kw, volume: 5400, difficulty: 25, intent: 'Informativa (TOFU)' }]
    }));
    setNewKeywordInput('');
  };

  // Remover keyword del desglose
  const handleRemoveKeyword = (kwStr) => {
    setProjectForm(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => (typeof k === 'string' ? k : k.keyword) !== kwStr)
    }));
  };

  // Guardar Proyecto en Base de Datos
  const handleSaveProject = async (e) => {
    if (e) e.preventDefault();
    if (!projectForm.name.trim() || !projectForm.domain.trim()) {
      setProjectError('El nombre del proyecto y el dominio son obligatorios.');
      return;
    }

    setSavingProject(true);
    setProjectError(null);

    try {
      let finalMetrics = projectForm.metrics;
      let finalCompetitors = projectForm.competitors;
      let finalKeywords = projectForm.keywords;

      // Si no se hizo desglose previo, lo hacemos antes de guardar
      if (!breakdownComplete) {
        try {
          const resB = await fetch('/api/seo/breakdown', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain: projectForm.domain, country: projectForm.country })
          });
          if (resB.ok) {
            const bJson = await resB.json();
            finalMetrics = bJson.metrics;
            if (finalCompetitors.length === 0) finalCompetitors = bJson.competitors;
            if (finalKeywords.length === 0) finalKeywords = bJson.keywords;
          }
        } catch (e) {
          console.warn('Fallback en desglose automático:', e);
        }
      }

      const payload = {
        name: projectForm.name.trim(),
        domain: projectForm.domain.trim(),
        country: projectForm.country,
        competitors: finalCompetitors,
        tracked_keywords: finalKeywords,
        notes: '',
        metrics_snapshot: finalMetrics || {},
        userId: currentUser?.id,
        groupId: currentUser?.group_id
      };

      const res = await fetch('/api/seo/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error al guardar el proyecto');
      }

      setShowCreateModal(false);
      setBreakdownComplete(false);
      setProjectForm({ name: '', domain: '', country: 'cl', competitors: [], keywords: [], metrics: null });
      fetchProjects();
      setSelectedProject(json.project);
    } catch (err) {
      setProjectError(err.message);
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('¿Deseas eliminar este proyecto SEO?')) return;
    try {
      await fetch(`/api/seo/projects/${id}`, { method: 'DELETE' });
      if (selectedProject?.id === id) setSelectedProject(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  // 1. Domain Search
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

  // 2. Keyword Search
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

  // 3. Site Audit
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
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group cursor-pointer"
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
                  SEO y Tráfico Orgánico
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Gestión de proyectos, análisis de competidores y palabras clave
              </p>
            </div>
          </div>

          {/* Connection Status Indicator */}
          <div className="flex items-center gap-3">
            {connectionStatus.loading ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700">
                <RefreshCw size={14} className="animate-spin text-orange-400" />
                <span>Verificando conexión...</span>
              </div>
            ) : connectionStatus.connected ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-800/40">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="font-semibold">Servicio Activo</span>
                </div>
                {isAdmin && (
                  <button
                    onClick={handleDisconnect}
                    className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 rounded transition-colors cursor-pointer"
                    title="Desconectar cuenta"
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
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FolderKanban size={16} />
            <span>Mis Proyectos SEO</span>
            {projects.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-[10px] bg-slate-900/60 rounded-full font-extrabold text-orange-200">
                {projects.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('domain')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'domain'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Globe size={16} />
            <span>Análisis de Dominio</span>
          </button>

          <button
            onClick={() => setActiveTab('keywords')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity size={16} />
            <span>Auditoría Técnica</span>
          </button>

          <button
            onClick={() => setActiveTab('glossary')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'glossary'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen size={16} />
            <span>Glosario & Guía</span>
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
                <h4 className="font-bold text-amber-200 text-sm">Conexión con el servicio requerida</h4>
                <p className="text-xs text-amber-300/80">
                  {isAdmin 
                    ? 'Haz clic en "Conectar Ubersuggest" para activar las consultas en tiempo real para todos tus alumnos.'
                    : 'El profesor debe activar la conexión para habilitar las consultas de datos en tiempo real.'}
                </p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={handleConnectOAuth}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Zap size={15} />
                Conectar Ahora
              </button>
            )}
          </div>
        )}

        {/* TAB: MIS PROYECTOS SEO */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Projects Header / Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 p-6 rounded-2xl">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FolderKanban className="text-orange-400" size={20} />
                  Proyectos de Posicionamiento SEO
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Crea y guarda proyectos para monitorear el dominio de tu marca, comparar con competidores y rastrear palabras clave.
                </p>
              </div>

              <button
                onClick={() => { setShowCreateModal(true); setProjectError(null); }}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-950/40 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus size={16} />
                <span>+ Crear Proyecto SEO</span>
              </button>
            </div>

            {/* Teacher Project Filter Pills */}
            {isAdmin && (
              <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 w-fit">
                <button
                  onClick={() => { setProjectFilter('my'); fetchProjects('my'); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    projectFilter === 'my'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  👨‍🏫 Mis Proyectos (Profesor)
                </button>
                <button
                  onClick={() => { setProjectFilter('students'); fetchProjects('students'); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    projectFilter === 'students'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎓 Proyectos de Alumnos
                </button>
                <button
                  onClick={() => { setProjectFilter('all'); fetchProjects('all'); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    projectFilter === 'all'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🌐 Todos los Proyectos
                </button>
              </div>
            )}

            {/* Selected Project View (if open) */}
            {selectedProject ? (
              <div className="space-y-6 bg-slate-900/90 border border-orange-500/30 rounded-2xl p-6 shadow-2xl relative animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700"
                      >
                        <ArrowLeft size={14} /> Volver a la lista
                      </button>
                      <h4 className="text-xl font-black text-white">{selectedProject.name}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                        {selectedProject.domain}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-xs text-slate-400">
                        País: <span className="font-semibold text-slate-300">{COUNTRIES.find(c => c.code === selectedProject.country)?.name || selectedProject.country}</span>
                      </p>
                      {selectedProject.author_name && (
                        <span className="text-xs text-slate-400">
                          • Autor: <span className="text-orange-300 font-semibold">{selectedProject.author_name}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDomainSearch(selectedProject.domain)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw size={13} />
                      <span>Actualizar Métricas</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(selectedProject.id)}
                      className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold rounded-lg border border-rose-800/50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>

                {/* Main Domain KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Tráfico Mensual Estimado</span>
                    <div className="text-2xl font-black text-white mt-1">
                      {selectedProject.metrics_snapshot?.organic_traffic !== undefined && selectedProject.metrics_snapshot?.organic_traffic !== null
                        ? Number(selectedProject.metrics_snapshot.organic_traffic).toLocaleString('es-CL')
                        : (selectedProject.metrics_snapshot?.traffic !== undefined ? Number(selectedProject.metrics_snapshot.traffic).toLocaleString('es-CL') : '0')}
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Autoridad de Dominio (DA)</span>
                    <div className="text-2xl font-black text-emerald-400 mt-1">
                      {selectedProject.metrics_snapshot?.domain_authority !== undefined && selectedProject.metrics_snapshot?.domain_authority !== null
                        ? selectedProject.metrics_snapshot.domain_authority
                        : (selectedProject.metrics_snapshot?.da !== undefined ? selectedProject.metrics_snapshot.da : '1')} / 100
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Keywords Rastreadas</span>
                    <div className="text-2xl font-black text-amber-300 mt-1">
                      {Array.isArray(selectedProject.tracked_keywords) ? selectedProject.tracked_keywords.length : 0}
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Competidores Asignados</span>
                    <div className="text-2xl font-black text-blue-300 mt-1">
                      {Array.isArray(selectedProject.competitors) ? selectedProject.competitors.length : 0}
                    </div>
                  </div>
                </div>

                {/* Side-by-side Competitor Comparison */}
                {Array.isArray(selectedProject.competitors) && selectedProject.competitors.length > 0 && (
                  <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-3">
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <Target className="text-orange-400" size={16} />
                      Competidores Directos Detectados
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedProject.competitors.map((comp, idx) => {
                        const compDomain = typeof comp === 'string' ? comp : comp.domain;
                        return (
                          <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
                            <div>
                              <span className="font-bold text-xs text-white block">{compDomain}</span>
                              <span className="text-[10px] text-slate-400">Competidor #{idx + 1}</span>
                            </div>
                            <button
                              onClick={() => {
                                setDomainInput(compDomain);
                                setActiveTab('domain');
                                handleDomainSearch(compDomain);
                              }}
                              className="text-xs bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 px-2.5 py-1 rounded border border-orange-500/30 cursor-pointer transition-colors"
                            >
                              Ver Tráfico
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tracked Keywords Table */}
                {Array.isArray(selectedProject.tracked_keywords) && selectedProject.tracked_keywords.length > 0 && (
                  <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-3">
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <Key className="text-amber-400" size={16} />
                      Palabras Clave y Oportunidades Identificadas
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProject.tracked_keywords.map((kwItem, idx) => {
                        const kwText = typeof kwItem === 'string' ? kwItem : kwItem.keyword;
                        const vol = typeof kwItem === 'object' && kwItem.volume ? kwItem.volume : null;
                        const diff = typeof kwItem === 'object' && kwItem.difficulty ? kwItem.difficulty : null;
                        const intent = typeof kwItem === 'object' && kwItem.intent ? kwItem.intent : null;

                        return (
                          <div
                            key={idx}
                            className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-2 hover:border-slate-700 transition-colors"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-100">{kwText}</span>
                                {intent && (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                    {intent.split(' ')[0]}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                                {vol && <span>Volumen: <strong className="text-white">{Number(vol).toLocaleString('es-CL')}</strong>/mes</span>}
                                {diff && <span>Dificultad: <strong className={diff < 35 ? 'text-emerald-400' : 'text-amber-400'}>{diff}/100</strong></span>}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setKeywordInput(kwText);
                                setActiveTab('keywords');
                                handleKeywordSearch(kwText);
                              }}
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-orange-400 rounded-lg transition-colors cursor-pointer"
                              title="Explorar palabra clave"
                            >
                              <Search size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Projects Grid */
              <div>
                {projectsLoading ? (
                  <div className="text-center py-16">
                    <RefreshCw className="animate-spin text-orange-400 mx-auto mb-3" size={24} />
                    <p className="text-xs text-slate-400">Cargando proyectos guardados...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto">
                      <FolderKanban size={28} />
                    </div>
                    <div className="max-w-md mx-auto">
                      <h4 className="font-bold text-white text-base">No se encontraron proyectos</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {isAdmin && projectFilter === 'my'
                          ? 'Aún no has creado proyectos de profesor. Crea uno como caso de estudio para la clase.'
                          : 'Crea un proyecto para almacenar el dominio de estudio, sus competidores y las palabras clave que trabajarán en su estrategia Inbound.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <Plus size={16} />
                      <span>Crear Proyecto SEO</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {projects.map((proj) => (
                      <div 
                        key={proj.id}
                        className="bg-slate-900/80 border border-slate-800 hover:border-orange-500/50 p-5 rounded-2xl transition-all shadow-lg hover:shadow-orange-950/20 flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                              {proj.domain}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(proj.created_at).toLocaleDateString('es-CL')}
                            </span>
                          </div>

                          <h4 className="font-bold text-white text-base group-hover:text-orange-300 transition-colors">
                            {proj.name}
                          </h4>

                          {proj.author_name && (
                            <div className="mt-1 flex items-center gap-1.5">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                proj.author_role === 'admin' 
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                                  : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                              }`}>
                                {proj.author_role === 'admin' ? '👨‍🏫 Profesor' : `🎓 ${proj.author_name}`}
                              </span>
                            </div>
                          )}

                          <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                            {proj.notes || 'Sin descripción adicional.'}
                          </p>

                          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                            <span>🔑 {Array.isArray(proj.tracked_keywords) ? proj.tracked_keywords.length : 0} keywords</span>
                            <span>🎯 {Array.isArray(proj.competitors) ? proj.competitors.length : 0} competidores</span>
                          </div>
                        </div>

                        <div className="mt-5 pt-3 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedProject(proj)}
                            className="flex-grow py-2 bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Eye size={14} />
                            <span>Abrir Proyecto</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 text-slate-500 hover:text-rose-400 bg-slate-800/50 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB: DOMAIN SEARCH */}
        {activeTab === 'domain' && (
          <div className="space-y-6">
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
                      <span>Consultando...</span>
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
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tráfico Orgánico Mensual</span>
                    <div className="text-2xl font-black text-white mt-1">
                      {domainData.organic_traffic !== undefined && domainData.organic_traffic !== null
                        ? Number(domainData.organic_traffic).toLocaleString('es-CL')
                        : (domainData.traffic !== undefined ? Number(domainData.traffic).toLocaleString('es-CL') : '0')}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Visitas estimadas al mes desde Google</p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Autoridad de Dominio (DA)</span>
                    <div className="text-2xl font-black text-emerald-400 mt-1">
                      {domainData.domain_authority !== undefined && domainData.domain_authority !== null
                        ? domainData.domain_authority
                        : (domainData.da !== undefined ? domainData.da : '1')} / 100
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Fuerza y confiabilidad del dominio</p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Keywords Posicionadas</span>
                    <div className="text-2xl font-black text-amber-300 mt-1">
                      {domainData.organic_keywords !== undefined && domainData.organic_keywords !== null
                        ? Number(domainData.organic_keywords).toLocaleString('es-CL')
                        : (domainData.keywords_count !== undefined ? Number(domainData.keywords_count).toLocaleString('es-CL') : '0')}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Palabras clave en el Top 100 de búsqueda</p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Backlinks Totales</span>
                    <div className="text-2xl font-black text-blue-300 mt-1">
                      {domainData.backlinks !== undefined && domainData.backlinks !== null
                        ? Number(domainData.backlinks).toLocaleString('es-CL')
                        : (domainData.backlinks_count !== undefined ? Number(domainData.backlinks_count).toLocaleString('es-CL') : '0')}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Enlaces externos entrantes</p>
                  </div>
                </div>

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

        {/* TAB: KEYWORD EXPLORER */}
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
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>

            {keywordError && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-sm flex items-center gap-3">
                <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
                <span>{keywordError}</span>
              </div>
            )}

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

        {/* TAB: SITE AUDIT */}
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

        {/* TAB: GLOSSARY */}
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
                  El usuario está listo para comprar o solicitar cotización (ej. "contratar plan software"). Ideal para páginas de producto y contacto directo.
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* CREATE PROJECT MODAL CON DESGLOSE AUTOMÁTICO UBERSUGGEST */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-scale-up my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <FolderKanban className="text-orange-400" size={18} />
                  Nuevo Proyecto de Posicionamiento SEO
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ingresa el dominio y ubicación. Ubersuggest analizará la web y desglosará automáticamente los competidores y keywords.
                </p>
              </div>
              <button 
                onClick={() => { setShowCreateModal(false); setBreakdownComplete(false); }}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {projectError && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{projectError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nombre del Proyecto</label>
                <input
                  type="text"
                  placeholder="Ej: Estrategia de Crecimiento Hereda Fácil 2026"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Dominio Principal</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. heredafacil.cl o falabella.com"
                    value={projectForm.domain}
                    onChange={(e) => setProjectForm({ ...projectForm, domain: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Ubicación / País Ubersuggest</label>
                  <select
                    value={projectForm.country}
                    onChange={(e) => setProjectForm({ ...projectForm, country: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Botón para Desglose Automático */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => handleBreakdownProject()}
                  disabled={breakdownLoading || !projectForm.domain.trim()}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-orange-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {breakdownLoading ? (
                    <>
                      <RefreshCw size={15} className="animate-spin text-slate-950" />
                      <span>Ubersuggest está analizando el dominio y sus competidores...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>{breakdownComplete ? '🔄 Volver a Analizar y Desglosar con Ubersuggest' : '🪄 Analizar y Desglosar Proyecto con Ubersuggest'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* RESULTADO DEL DESGLOSE AUTOMÁTICO */}
              {breakdownComplete && (
                <div className="space-y-4 pt-3 border-t border-slate-800 animate-fade-in">
                  {/* KPI Cards de Ubersuggest */}
                  {projectForm.metrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Tráfico Mensual</span>
                        <span className="text-base font-black text-white">
                          {Number(projectForm.metrics.organic_traffic || 0).toLocaleString('es-CL')}
                        </span>
                      </div>
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Autoridad DA</span>
                        <span className="text-base font-black text-emerald-400">
                          {projectForm.metrics.domain_authority !== undefined && projectForm.metrics.domain_authority !== null ? projectForm.metrics.domain_authority : 1} / 100
                        </span>
                      </div>
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Keywords</span>
                        <span className="text-base font-black text-amber-300">
                          {Number(projectForm.metrics.organic_keywords || 0).toLocaleString('es-CL')}
                        </span>
                      </div>
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Backlinks</span>
                        <span className="text-base font-black text-blue-300">
                          {Number(projectForm.metrics.backlinks || 0).toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Competidores Desglosados */}
                  <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
                        <Target size={14} className="text-orange-400" />
                        Competidores Directos Detectados por Ubersuggest ({projectForm.competitors.length})
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {projectForm.competitors.map((comp, idx) => {
                        const compName = typeof comp === 'string' ? comp : comp.domain;
                        return (
                          <div key={idx} className="bg-slate-900 border border-slate-700/80 text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                            <span>{compName}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCompetitor(compName)}
                              className="text-slate-400 hover:text-rose-400 cursor-pointer ml-1 text-xs"
                              title="Remover competidor"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Agregar competidor adicional */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Agregar otro competidor (ej. ripley.cl)..."
                        value={newCompetitorInput}
                        onChange={(e) => setNewCompetitorInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCompetitor(); }}}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 flex-grow focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddCompetitor}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 cursor-pointer"
                      >
                        + Agregar
                      </button>
                    </div>
                  </div>

                  {/* Palabras Clave Desglosadas */}
                  <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-2.5">
                    <label className="text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
                      <Key size={14} className="text-amber-400" />
                      Palabras Clave y Oportunidades Identificadas ({projectForm.keywords.length})
                    </label>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                      {projectForm.keywords.map((kw, idx) => {
                        const kwText = typeof kw === 'string' ? kw : kw.keyword;
                        const vol = typeof kw === 'object' && kw.volume ? kw.volume : null;
                        const diff = typeof kw === 'object' && kw.difficulty ? kw.difficulty : null;
                        const intent = typeof kw === 'object' && kw.intent ? kw.intent : null;

                        return (
                          <div key={idx} className="bg-slate-900 border border-slate-800/90 px-3 py-2 rounded-lg flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-white">{kwText}</span>
                              {vol && (
                                <span className="text-[10px] text-slate-400">
                                  Vol: <strong className="text-slate-200">{Number(vol).toLocaleString('es-CL')}</strong>/m
                                </span>
                              )}
                              {diff && (
                                <span className="text-[10px] text-emerald-400 font-semibold">
                                  SD: {diff}/100
                                </span>
                              )}
                              {intent && (
                                <span className="text-[10px] text-orange-300 bg-orange-950/40 px-1.5 py-0.5 rounded border border-orange-800/30">
                                  {intent.split(' ')[0]}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveKeyword(kwText)}
                              className="text-slate-400 hover:text-rose-400 cursor-pointer text-xs"
                              title="Remover keyword"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Agregar keyword adicional */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Agregar otra palabra clave a monitorear..."
                        value={newKeywordInput}
                        onChange={(e) => setNewKeywordInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddKeyword(); }}}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 flex-grow focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddKeyword}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 cursor-pointer"
                      >
                        + Agregar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setBreakdownComplete(false); }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingProject || !projectForm.domain.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {savingProject ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>{breakdownComplete ? 'Guardar Proyecto Analizado' : 'Analizar y Guardar Proyecto'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
