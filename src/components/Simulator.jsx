import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  Plus, 
  Copy, 
  Edit2, 
  Trash2, 
  Columns as ColumnsIcon, 
  Filter, 
  ChevronDown, 
  Layout, 
  Users, 
  Image as ImageIcon, 
  BarChart3, 
  Search, 
  RotateCcw, 
  Check, 
  Info, 
  MoreVertical,
  MoreHorizontal,
  Maximize2,
  ChevronRight,
  Monitor,
  Send,
  Globe,
  MapPin,
  Home,
  Zap,
  Smartphone,
  Target,
  Camera,
  MessageSquare,
  MousePointer2,
  Filter as FunnelIcon,
  ShoppingBag,
  Megaphone,
  X,
  HelpCircle,
  Calendar,
  Clock,
  ExternalLink,
  AlertCircle,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const performanceGoals = [
  { id: 'reach', name: 'Maximizar el alcance de los anuncios', desc: 'Intentaremos mostrar tus anuncios al mayor número de personas posible.' },
  { id: 'impressions', name: 'Maximizar el número de impresiones', desc: 'Intentaremos mostrar tus anuncios a las personas tantas veces como sea posible.' },
  { id: 'recall', name: 'Maximizar el lift en recuerdo publicitario', desc: 'Intentaremos mostrar tus anuncios a las personas que tengan más probabilidades de recordar haberlos visto.' },
  { isHeader: true, name: 'Objetivos de reproducción de vídeo' },
  { id: 'thruplay', name: 'Maximizar las reproducciones ThruPlay', desc: 'Intentaremos mostrar tus anuncios con vídeo a las personas que verán todo el vídeo si dura menos de 15 segundos. En el caso de los vídeos más largos, trataremos de mostrárselos a quienes tengan más probabilidades de reproducirlos durante al menos 15 segundos.' },
  { id: 'video_2s', name: 'Maximizar las reproducciones de vídeo continuas de 2 segundos', desc: 'Intentaremos mostrar tus anuncios con vídeo a las personas con más probabilidades de reproducirlos durante dos segundos seguidos o más.' }
];

const metaObjectives = [
  { id: 'awareness', name: 'Reconocimiento', icon: <Megaphone size={20} />, description: 'Muestra tus anuncios a las personas que tengan más probabilidades de recordarlos.', idealFor: ['Alcance', 'Reconocimiento de marca', 'Visualizaciones de vídeo'], illustration: '/meta_objective_illustration_1777446648999.png' },
  { id: 'traffic', name: 'Tráfico', icon: <MousePointer2 size={20} />, description: 'Dirige a las personas a un destino, como tu sitio web, app o evento de Facebook.', idealFor: ['Clics en el enlace', 'Visitas a la página de destino', 'Messenger y WhatsApp'], illustration: '/meta_objective_illustration_1777446648999.png' },
  { id: 'engagement', name: 'Interacción', icon: <MessageSquare size={20} />, description: 'Consigue más mensajes, reproducciones de video, interacciones con tus publicaciones.', idealFor: ['Messenger, Instagram y WhatsApp', 'Reproducciones de video', 'Interacción con la publicación'], illustration: '/meta_objective_illustration_1777446648999.png' },
  { id: 'leads', name: 'Clientes potenciales', icon: <FunnelIcon size={20} />, description: 'Genera clientes potenciales para tu empresa o marca.', idealFor: ['Formularios instantáneos', 'Mensajes', 'Llamadas'], illustration: '/meta_objective_illustration_1777446648999.png' },
  { id: 'promotion', name: 'Promoción de la aplicación', icon: <Smartphone size={20} />, description: 'Consigue que más personas instalen tu app y la usen.', idealFor: ['Instalaciones de la aplicación', 'Eventos de la aplicación'], illustration: '/meta_objective_illustration_1777446648999.png' },
  { id: 'sales', name: 'Ventas', icon: <ShoppingBag size={20} />, description: 'Busca a personas con probabilidades de comprar tu producto o servicio.', idealFor: ['Conversiones', 'Ventas del catálogo', 'Mensajes'], illustration: '/meta_objective_illustration_1777446648999.png' },
];

const ageOptions = Array.from({ length: 48 }, (_, i) => (i + 18).toString()).concat(['65+']);

const Simulator = ({ platform, onFinish, onBack }) => {
  const { projectData, updateProjectData, currentUser } = useProject();
  const [view, setView] = useState('manager'); 
  const [activeTab, setActiveTab] = useState('campaigns'); 
  const [currentStep, setCurrentStep] = useState(1); 
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [showBuyingTypeDropdown, setShowBuyingTypeDropdown] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  const initialFormState = {
    objective: 'awareness',
    objectiveJustification: '',
    campaignName: 'Nueva campaña de Reconocimiento',
    specialCategories: 'NONE',
    buyingType: 'Subasta',
    advantageBudget: false,
    shareBudget: true,
    campaignBudget: '25000',
    bidStrategy: 'Volumen más alto',
    testAB: false,
    adSet: {
      name: 'Nuevo conjunto de anuncios de Reconocimiento',
      performanceGoal: 'reach',
      dynamicCreative: false,
      pageName: currentUser?.role === 'admin' ? 'Admin' : `Grupo ${currentUser?.group_id || 'X'}`,
      budget: '2500',
      budgetType: 'daily',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endDateEnabled: false,
      endDate: '',
      endTime: '09:00',
      location: 'Chile',
      locationRadius: '40',
      locationSearch: '',
      includeUnknownAgeWhatsApp: true,
      excludedCustomAudiences: '',
      languages: ['Todos los idiomas'],
      advantageAudience: {
        customAudiences: '',
        ageMin: '18',
        ageMax: '65',
        gender: 'all',
        detailedTargeting: ''
      },
      placements: 'advantage',
      platforms: ['facebook', 'instagram', 'messenger', 'audience'],
      adSetJustification: '',
      frequencyControl: { count: 2, days: 7 }
    },
    ad: {
      name: 'Nuevo anuncio de Reconocimiento',
      partnerAd: false,
      format: 'single', 
      multiAd: false,
      primaryText: '',
      headline: '',
      description: '',
      cta: 'LEARN_MORE',
      destinationUrl: '',
      creativeStrategyJustification: '',
      languagesEnabled: false,
      tracking: {
        websiteEvents: false,
        appEvents: false,
        offlineEvents: false,
        urlParams: 'key1=value1&key2=value2'
      }
    }
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchCampaigns = async () => {
    setLoadingCampaigns(true);
    const url = currentUser?.role === 'admin' ? '/api/admin/all' : `/api/group-data/${currentUser?.group_id}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setSavedCampaigns(data.campaigns || []);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  useEffect(() => {
    if (view === 'manager') {
      fetchCampaigns();
    }
  }, [view, currentUser]);

  const handleEditCampaign = (camp) => {
    setFormData(camp.data || initialFormState);
    setSelectedCampaignId(camp.id);
    setView('editor');
    setCurrentStep(1);
  };

  const handleCreateNew = () => {
    setFormData(initialFormState);
    setSelectedCampaignId(null);
    setView('modal');
  };

  const handleDeleteCampaign = async () => {
    if (!selectedCampaignId) return;
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta campaña?')) return;
    
    try {
      const res = await fetch(`/api/campaigns/${selectedCampaignId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setSelectedCampaignId(null);
        fetchCampaigns();
      }
    } catch (err) {
      console.error('Error deleting campaign:', err);
    }
  };

  const handleFinish = async () => {
    updateProjectData({ platform, ...formData });
    try {
      await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: selectedCampaignId, // Enviar ID si estamos editando
          name: formData.campaignName, 
          userId: currentUser.id, 
          groupId: currentUser.group_id, 
          data: formData 
        })
      });
    } catch (err) { console.error('Error saving campaign'); }
    onFinish();
  };

  if (view === 'manager') {
    return (
      <div className="flex flex-col h-screen bg-fb-bg text-fb-text-primary">
        <header className="h-14 bg-white border-b border-fb-border flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-3">
             <button onClick={onBack} className="p-2 hover:bg-fb-header rounded-full transition-colors text-fb-text-secondary"><Home size={20} /></button>
             <div className="h-8 w-px bg-fb-border mx-1" />
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-fb-blue rounded-full flex items-center justify-center text-white font-bold">f</div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-fb-text-secondary uppercase leading-none">Administrador de anuncios</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold truncate max-w-[200px]">{projectData.agencyName} (ID: 57704623)</span>
                    <ChevronDown size={14} className="text-fb-text-secondary" />
                  </div>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full text-[10px] font-black text-green-600 border border-green-200">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> API PROFE NICO: CONECTADA
             </div>
             <button className="bg-fb-blue text-white px-4 py-1.5 rounded-md font-bold text-[13px] hover:bg-blue-700">Revisar y publicar</button>
          </div>
        </header>
        <div className="flex flex-grow overflow-hidden">
          <aside className="w-12 bg-fb-sidebar flex flex-col items-center py-4 gap-6 z-10">
            <Layout size={20} className="text-white opacity-40 hover:opacity-100 cursor-pointer" />
            <Users size={20} className="text-white cursor-pointer border-l-2 border-fb-blue pl-1" />
            <div className="flex-grow" />
          </aside>
          <main className="flex-grow flex flex-col overflow-hidden">
            <div className="bg-fb-header border-b border-fb-border px-4 flex items-center justify-between">
               <div className="flex gap-1 pt-1">
                 <div onClick={() => setActiveTab('campaigns')} className={`meta-tab ${activeTab === 'campaigns' ? 'meta-tab-active' : 'meta-tab-inactive'}`}>Campañas</div>
                 <div onClick={() => setActiveTab('adsets')} className={`meta-tab ${activeTab === 'adsets' ? 'meta-tab-active' : 'meta-tab-inactive'}`}>Conjuntos de anuncios</div>
                 <div onClick={() => setActiveTab('ads')} className={`meta-tab ${activeTab === 'ads' ? 'meta-tab-active' : 'meta-tab-inactive'}`}>Anuncios</div>
               </div>
            </div>
            <div className="bg-white border-b border-fb-border p-2 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <button onClick={handleCreateNew} className="meta-btn-green"><Plus size={16} /> Crear</button>
                 <button className="meta-btn-secondary" onClick={() => {
                   const camp = savedCampaigns.find(c => c.id === selectedCampaignId);
                   if (camp) handleEditCampaign(camp);
                 }} disabled={!selectedCampaignId}><Edit2 size={14} /> Editar</button>
                 <button className="meta-btn-secondary" disabled={!selectedCampaignId}><Copy size={14} /> Duplicar</button>
                 <div className="h-6 w-px bg-fb-border mx-1" />
                 <button onClick={handleDeleteCampaign} className="meta-btn-secondary" disabled={!selectedCampaignId}><Trash2 size={14} /></button>
               </div>
               <button onClick={fetchCampaigns} className="p-2 hover:bg-fb-header rounded-full text-slate-500"><RotateCcw size={16} className={loadingCampaigns ? 'animate-spin' : ''} /></button>
            </div>
            <div className="flex-grow overflow-auto bg-white">
              <div className="min-w-[1200px]">
                <div className="flex h-10 bg-fb-header border-b border-fb-border sticky top-0 z-10 font-bold text-[11px] text-fb-text-secondary uppercase">
                  <div className="w-12 flex justify-center items-center"><input type="checkbox" /></div>
                  <div className="w-40 px-3 flex items-center">Activado</div>
                  <div className="w-[350px] px-3 flex items-center border-r border-fb-border">Campaña</div>
                  <div className="w-32 px-3 flex items-center">Entrega</div>
                  <div className="w-32 px-3 flex items-center">Resultados</div>
                  <div className="w-32 px-3 flex items-center">Presupuesto</div>
                  {currentUser?.role === 'admin' && <div className="flex-grow px-3 flex items-center border-l border-fb-border text-fb-blue">Autor (Alumno)</div>}
                </div>
                {loadingCampaigns ? (
                  <div className="flex flex-col gap-4 p-12 items-center justify-center">
                    <div className="w-8 h-8 border-4 border-fb-blue border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cargando campañas...</span>
                  </div>
                ) : savedCampaigns.length === 0 ? (
                  <div className="p-20 text-center space-y-4">
                     <Megaphone size={48} className="mx-auto text-slate-200" />
                     <p className="text-slate-400 font-bold">No hay campañas guardadas aún.</p>
                     <button onClick={handleCreateNew} className="text-fb-blue font-bold hover:underline">¡Crea tu primera campaña!</button>
                  </div>
                ) : savedCampaigns.map((camp) => (
                  <div 
                    key={camp.id} 
                    className={`flex h-12 border-b border-fb-border items-center text-[12px] cursor-pointer transition-colors ${selectedCampaignId === camp.id ? 'bg-blue-50/50' : 'hover:bg-fb-header/40'}`}
                    onClick={() => setSelectedCampaignId(camp.id)}
                    onDoubleClick={() => handleEditCampaign(camp)}
                  >
                    <div className="w-12 flex justify-center" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedCampaignId === camp.id} onChange={() => setSelectedCampaignId(camp.id)} /></div>
                    <div className="w-40 px-3 flex items-center gap-2">
                      <div className={`w-8 h-4 ${camp.data?.active !== false ? 'bg-fb-blue/20' : 'bg-slate-200'} rounded-full relative`}>
                        <div className={`absolute top-1 w-2 h-2 rounded-full ${camp.data?.active !== false ? 'left-5 bg-fb-blue' : 'left-1 bg-slate-400'}`} />
                      </div>
                      <span className={`font-bold uppercase ${camp.data?.active !== false ? 'text-fb-blue' : 'text-slate-400'}`}>Activa</span>
                    </div>
                    <div className="w-[350px] px-3 font-bold text-fb-blue hover:underline truncate" onClick={() => handleEditCampaign(camp)}>
                      {camp.name}
                    </div>
                    <div className="w-32 px-3 text-slate-600">Aprendizaje</div>
                    <div className="w-32 px-3 font-bold">{Math.floor(Math.random() * 50)}</div>
                    <div className="w-32 px-3 font-bold">${camp.data?.adSet?.budget || '2.500'} CLP</div>
                    {currentUser?.role === 'admin' && (
                      <div className="flex-grow px-3 border-l border-fb-border flex flex-col justify-center">
                        <span className="font-bold text-slate-700">{camp.student_name || 'Desconocido'}</span>
                        <span className="text-[10px] text-fb-text-secondary">Grupo {camp.group_id}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (view === 'modal') {
    const selectedObj = metaObjectives.find(o => o.id === formData.objective);
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <header className="px-4 py-3 border-b border-fb-border flex items-center justify-between bg-[#f0f2f5]">
             <div className="bg-fb-blue text-white px-3 py-1 rounded text-xs font-bold">Crear campaña</div>
             <button onClick={() => setView('manager')} className="text-slate-500 hover:text-fb-text-primary"><X size={20} /></button>
          </header>
          <div className="flex-grow overflow-y-auto p-4 space-y-6">
             <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-800 flex items-center gap-1">Elige un tipo de compra <HelpCircle size={14} className="text-slate-400" /></label>
                <div className="relative">
                   <button onClick={() => setShowBuyingTypeDropdown(!showBuyingTypeDropdown)} className="w-full text-left border border-fb-border rounded p-2.5 flex items-center justify-between text-sm hover:border-fb-blue transition-colors">
                      {formData.buyingType} <ChevronDown size={16} className="text-slate-500" />
                   </button>
                   {showBuyingTypeDropdown && (
                     <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-fb-border rounded shadow-xl z-50">
                        {[{ id: 'Subasta', desc: 'Compra en tiempo real con pujas rentables.' }, { id: 'Reserva', desc: 'Compra por adelantado con resultados más predecibles.' }].map(type => (
                          <div key={type.id} onClick={() => { setFormData({...formData, buyingType: type.id}); setShowBuyingTypeDropdown(false); }} className={`p-3 flex items-start gap-3 cursor-pointer hover:bg-fb-header/50 transition-colors ${formData.buyingType === type.id ? 'bg-blue-50/50' : ''}`}>
                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${formData.buyingType === type.id ? 'border-fb-blue' : 'border-slate-300'}`}>{formData.buyingType === type.id && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full" />}</div>
                             <div><div className="text-[13px] font-bold">{type.id}</div><div className="text-[11px] text-fb-text-secondary leading-tight">{type.desc}</div></div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
             </div>
             <div className="space-y-4">
                <label className="text-[13px] font-bold text-slate-800">Elige un objetivo de campaña</label>
                <div className="flex gap-4 min-h-[400px]">
                   <div className="w-1/2 space-y-1">
                      {metaObjectives.map((obj) => (
                        <div key={obj.id} onClick={() => setFormData({...formData, objective: obj.id, campaignName: `Nueva campaña de ${obj.name}`})} className={`p-2 rounded-md flex items-center gap-3 cursor-pointer transition-all ${formData.objective === obj.id ? 'bg-blue-50/50 ring-1 ring-fb-blue/20' : 'hover:bg-fb-header/50'}`}>
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.objective === obj.id ? 'border-fb-blue' : 'border-slate-300'}`}>{formData.objective === obj.id && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full" />}</div>
                           <div className={`p-2 rounded ${formData.objective === obj.id ? 'bg-fb-blue text-white' : 'bg-slate-100 text-slate-500'}`}>{obj.icon}</div>
                           <span className={`text-[13px] ${formData.objective === obj.id ? 'font-bold text-fb-blue' : 'text-slate-700'}`}>{obj.name}</span>
                        </div>
                      ))}
                   </div>
                   <div className="w-1/2 bg-fb-bg/30 rounded-xl p-6 flex flex-col items-center text-center">
                      <div className="w-48 h-48 mb-6 relative"><img src={selectedObj.illustration} alt={selectedObj.name} className="w-full h-full object-contain" /></div>
                      <h3 className="text-[17px] font-bold mb-2">{selectedObj.name}</h3>
                      <p className="text-[12px] text-fb-text-secondary leading-relaxed mb-6">{selectedObj.description}</p>
                      <div className="w-full text-left">
                         <h4 className="text-[12px] font-bold mb-2">Ideal para:</h4>
                         <div className="flex flex-wrap gap-2">{selectedObj.idealFor.map(tag => <span key={tag} className="bg-white border border-slate-200 px-3 py-1 rounded text-[11px] text-slate-600">{tag}</span>)}</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          <footer className="px-4 py-3 border-t border-fb-border flex items-center justify-end bg-white gap-2">
             <button onClick={() => setView('manager')} className="px-4 py-2 border border-fb-border rounded-md text-[13px] font-bold hover:bg-fb-header transition-colors">Cancelar</button>
             <button onClick={() => setView('editor')} className="px-4 py-2 bg-fb-blue text-white rounded-md text-[13px] font-bold hover:bg-blue-700 transition-colors">Continuar</button>
          </footer>
        </div>
      </div>
    );
  }

  if (view === 'editor') {
    return (
      <div className="flex flex-col h-screen bg-fb-editor-bg">
        <header className="h-14 bg-white border-b border-fb-border flex items-center justify-between px-4 z-30 shadow-sm">
           <div className="flex items-center gap-3">
              <button onClick={() => setView('manager')} className="p-2 hover:bg-fb-header rounded-full transition-colors text-fb-text-secondary"><Home size={20} /></button>
              <div className="h-8 w-px bg-fb-border mx-1" />
              <span className="text-[13px] font-bold truncate max-w-[250px]">{formData.campaignName}</span>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full text-[10px] font-black text-green-600 border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> API PROFE NICO: CONECTADA
              </div>
              <div className="flex bg-fb-header rounded-md p-1 border border-fb-border">
                 {[1, 2, 3].map(s => <button key={s} onClick={() => setCurrentStep(s)} className={`px-4 py-1.5 text-xs font-bold rounded transition-all ${currentStep === s ? 'bg-white shadow-sm text-fb-blue' : 'text-fb-text-secondary hover:bg-white/50'}`}>{s}. {s === 1 ? 'Campaña' : s === 2 ? 'Conjunto' : 'Anuncio'}</button>)}
              </div>
              <button onClick={handleFinish} className="bg-fb-blue text-white px-6 py-2 rounded-md font-bold text-sm shadow-md hover:bg-blue-700">Finalizar y Guardar</button>
           </div>
        </header>

        <div className="flex flex-grow overflow-hidden relative">
          <aside className="w-[300px] bg-white border-r border-fb-border flex flex-col z-20">
             <div className="py-4">
                {currentStep === 1 && [{ id: 'name', label: 'Nombre' }, { id: 'details', label: 'Detalles de la campaña' }, { id: 'budget', label: 'Presupuesto de la campaña' }, { id: 'special', label: 'Categorías de anuncios especiales' }].map((nav, i) => <div key={nav.id} className={`px-6 py-2.5 text-[13px] border-l-4 transition-all cursor-pointer flex items-center justify-between ${i === 0 ? 'border-fb-blue text-fb-blue font-bold bg-blue-50/30' : 'border-transparent text-slate-500 hover:bg-fb-header'}`}>{nav.label}{i === 0 && <Check size={14} />}</div>)}
                {currentStep === 2 && [{ id: 'name', label: 'Nombre' }, { id: 'objective', label: 'Reconocimiento' }, { id: 'budget', label: 'Presupuesto y programación' }, { id: 'audience', label: 'Audiencia' }, { id: 'placements', label: 'Ubicaciones' }].map((nav, i) => <div key={nav.id} className={`px-6 py-2.5 text-[13px] border-l-4 transition-all cursor-pointer flex items-center justify-between ${i === 0 ? 'border-fb-blue text-fb-blue font-bold bg-blue-50/30' : 'border-transparent text-slate-500 hover:bg-fb-header'}`}>{nav.label}</div>)}
                {currentStep === 3 && [{ id: 'name', label: 'Nombre' }, { id: 'identity', label: 'Identidad' }, { id: 'config', label: 'Configuración del anuncio' }, { id: 'content', label: 'Contenido del anuncio' }, { id: 'tracking', label: 'Seguimiento' }].map((nav, i) => <div key={nav.id} className={`px-6 py-2.5 text-[13px] border-l-4 transition-all cursor-pointer flex items-center justify-between ${i === 0 ? 'border-fb-blue text-fb-blue font-bold bg-blue-50/30' : 'border-transparent text-slate-500 hover:bg-fb-header'}`}>{nav.label}</div>)}
             </div>
             <div className="mt-auto p-6 border-t border-fb-border">
                <div className="text-[11px] font-black text-fb-text-secondary uppercase tracking-widest mb-4">Jerarquía</div>
                <div className="space-y-1">
                   <div onClick={() => setCurrentStep(1)} className={`p-2 rounded-lg flex items-center gap-3 cursor-pointer ${currentStep === 1 ? 'bg-blue-50 text-fb-blue' : 'hover:bg-fb-header'}`}><BarChart3 size={14} /><span className="text-[11px] font-bold truncate">{formData.campaignName}</span></div>
                   <div onClick={() => setCurrentStep(2)} className={`p-2 rounded-lg flex items-center gap-3 cursor-pointer ml-4 ${currentStep === 2 ? 'bg-blue-50 text-fb-blue' : 'hover:bg-fb-header'}`}><Users size={14} /><span className="text-[11px] font-bold truncate">{formData.adSet.name}</span></div>
                   <div onClick={() => setCurrentStep(3)} className={`p-2 rounded-lg flex items-center gap-3 cursor-pointer ml-8 ${currentStep === 3 ? 'bg-blue-50 text-fb-blue' : 'hover:bg-fb-header'}`}><ImageIcon size={14} /><span className="text-[11px] font-bold truncate">{formData.ad.name}</span></div>
                </div>
             </div>
          </aside>

          <main className="flex-grow overflow-y-auto bg-fb-editor-bg custom-scrollbar pb-32">
             <div className="max-w-[850px] mx-auto py-8 px-6 grid grid-cols-12 gap-6">
                <div className="col-span-8 space-y-6">
                  {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2"><div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div><span className="text-[13px] font-bold">Nombre de la campaña</span></div>
                         <div className="p-6 flex items-center gap-4"><input type="text" className="meta-editor-input flex-grow" value={formData.campaignName} onChange={(e) => setFormData({...formData, campaignName: e.target.value})} /><button className="px-4 py-2 border border-fb-border rounded-md text-[12px] font-bold hover:bg-fb-header transition-colors">Crear plantilla</button></div>
                      </div>
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2"><div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div><span className="text-[13px] font-bold">Detalles de la campaña</span></div>
                         <div className="p-6 space-y-6">
                            <div><label className="text-[11px] font-black text-slate-800 uppercase block mb-1">Tipo de compra</label><div className="text-[13px] font-bold text-fb-text-primary">{formData.buyingType}</div></div>
                            <div><label className="text-[11px] font-black text-slate-800 uppercase block mb-1 flex items-center gap-1">Objetivo de la campaña <HelpCircle size={12} className="text-fb-text-secondary" /></label><div className="text-[13px] font-bold text-fb-text-primary uppercase">{metaObjectives.find(o => o.id === formData.objective)?.name}</div><button className="text-fb-blue text-[12px] font-bold mt-1 flex items-center">Mostrar más opciones <ChevronDown size={14} /></button></div>
                         </div>
                      </div>
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-[13px] font-bold">Presupuesto de campaña de Advantage+ ✨</span></div><div className="flex items-center gap-2"><span className="text-[11px] font-bold text-slate-400">{formData.advantageBudget ? 'Activado' : 'Desactivado'}</span><div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.advantageBudget ? 'bg-fb-blue' : 'bg-fb-border'}`} onClick={() => setFormData({...formData, advantageBudget: !formData.advantageBudget})}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${formData.advantageBudget ? 'left-6' : 'left-1'}`} /></div></div></div>
                         <div className="p-6 space-y-4">
                            <p className="text-[11px] text-fb-text-secondary leading-relaxed">Distribuye tu presupuesto entre conjuntos de anuncios para conseguir más resultados. <span className="text-fb-blue cursor-pointer">Información sobre el presupuesto de campaña de Advantage+</span></p>
                            <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100 cursor-pointer" onClick={() => setFormData({...formData, shareBudget: !formData.shareBudget})}><input type="checkbox" className="rounded cursor-pointer" checked={formData.shareBudget} onChange={() => {}} /><span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">Comparte hasta el 20 % de tu presupuesto con otros conjuntos de anuncios <HelpCircle size={12} /></span></div>
                            <div><label className="text-[11px] font-black text-slate-800 uppercase block mb-1 flex items-center gap-1">Estrategia de puja de la campaña <HelpCircle size={12} /></label><div className="text-[13px] font-bold text-fb-text-primary">{formData.bidStrategy}</div></div>
                         </div>
                      </div>
                      {/* --- TEST A/B --- */}
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center justify-between">
                            <span className="text-[13px] font-bold">Test A/B</span>
                            <div className="flex items-center gap-2">
                               <span className="text-[11px] font-bold text-slate-400">{formData.testAB ? 'Activado' : 'Desactivado'}</span>
                               <div 
                                 className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.testAB ? 'bg-fb-blue' : 'bg-fb-border'}`} 
                                 onClick={() => setFormData({...formData, testAB: !formData.testAB})}
                               >
                                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${formData.testAB ? 'left-6' : 'left-1'}`} />
                               </div>
                            </div>
                         </div>
                         <div className="p-6">
                            <p className="text-[11px] text-fb-text-secondary leading-relaxed">
                               Ayuda a mejorar el rendimiento de los anuncios comparando versiones para ver cuál funciona mejor. Para mayor precisión, cada una se mostrará a grupos distintos de tu audiencia. <span className="text-fb-blue cursor-pointer">Información sobre los tests A/B</span>
                            </p>
                         </div>
                      </div>

                      {/* --- CATEGORÍAS ESPECIALES --- */}
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500">
                               <Check size={12} strokeWidth={3} />
                            </div>
                            <span className="text-[13px] font-bold">Categorías de anuncios especiales</span>
                         </div>
                         <div className="p-6 space-y-4">
                            <p className="text-[11px] text-fb-text-secondary leading-relaxed">
                               Indica si tus anuncios están relacionados con productos y servicios financieros, empleo, vivienda, temas sociales, elecciones o política para evitar que se rechacen. Los requisitos varían en función del país. <span className="text-fb-blue cursor-pointer">Información sobre las categorías de anuncios especiales</span>
                            </p>
                            
                            <div>
                               <label className="text-[12px] font-bold text-slate-800 block mb-1">Categorías</label>
                               <p className="text-[11px] text-fb-text-secondary mb-3">Selecciona las categorías que mejor describan qué se anunciará en esta campaña.</p>
                               <select 
                                 className="meta-editor-input font-bold" 
                                 value={formData.specialCategories}
                                 onChange={(e) => setFormData({...formData, specialCategories: e.target.value})}
                               >
                                  <option value="NONE">Indica una categoría (si corresponde)</option>
                                  <option value="CREDIT">Crédito</option>
                                  <option value="EMPLOYMENT">Empleo</option>
                                  <option value="HOUSING">Vivienda</option>
                                  <option value="ISSUES_ELECTIONS_POLITICS">Temas sociales, elecciones o política</option>
                               </select>
                            </div>
                         </div>
                      </div>

                      <div className="meta-editor-card p-6"><div className="justification-box"><span className="justification-title">Justificación</span><textarea className="justification-input" placeholder="Justificación estratégica de la campaña..." value={formData.objectiveJustification} onChange={(e) => setFormData({...formData, objectiveJustification: e.target.value})} /></div></div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2"><div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div><span className="text-[13px] font-bold uppercase tracking-tight">Reconocimiento</span></div>
                         <div className="p-6 space-y-6">
                            <div><label className="text-[12px] font-bold text-slate-800 block mb-1">Objetivo de rendimiento</label><select className="meta-editor-input font-bold" value={formData.adSet.performanceGoal} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, performanceGoal: e.target.value}})}>{performanceGoals.map((goal, idx) => goal.isHeader ? <optgroup key={idx} label={goal.name} /> : <option key={goal.id} value={goal.id}>{goal.name}</option>)}</select><p className="text-[11px] text-fb-text-secondary mt-1.5 leading-relaxed">{performanceGoals.find(g => g.id === formData.adSet.performanceGoal)?.desc}</p></div>
                            <div><label className="text-[12px] font-bold text-slate-800 block mb-1 flex items-center gap-1">Página de Facebook <HelpCircle size={14} className="text-slate-400" /></label><div className="flex gap-2"><select className="meta-editor-input font-bold flex-grow" value={formData.adSet.pageName} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, pageName: e.target.value}})}><option value="Seleccionar página">Seleccionar página</option><option value={formData.adSet.pageName}>{formData.adSet.pageName}</option></select><button className="px-3 border border-fb-border rounded-md hover:bg-fb-header"><Plus size={18} /></button></div></div>
                            <div className="pt-4 border-t border-fb-border space-y-4"><label className="text-[12px] font-bold text-slate-800 block">Control de frecuencia <HelpCircle size={14} className="inline text-slate-400 ml-1" /></label><div className="space-y-3"><div className="flex items-start gap-3 p-3 border border-fb-border rounded-lg bg-fb-header/20"><div className="w-5 h-5 rounded-full border-2 border-fb-blue flex items-center justify-center mt-0.5"><div className="w-2.5 h-2.5 bg-fb-blue rounded-full" /></div><div><div className="text-[13px] font-bold">Límite</div><div className="text-[11px] text-fb-text-secondary">Número máximo de veces que quieres que las personas vean tus anuncios.</div></div></div><div className="flex items-center gap-3 pl-8"><input type="number" className="w-16 p-2 border border-fb-border rounded text-center font-bold" value={formData.adSet.frequencyControl.count} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, frequencyControl: {...formData.adSet.frequencyControl, count: e.target.value}}})} /><span className="text-[12px] text-slate-600">veces cada</span><input type="number" className="w-16 p-2 border border-fb-border rounded text-center font-bold" value={formData.adSet.frequencyControl.days} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, frequencyControl: {...formData.adSet.frequencyControl, days: e.target.value}}})} /><span className="text-[12px] text-slate-600">días</span></div></div></div>
                         </div>
                      </div>
                      <div className="meta-editor-card p-0"><div className="p-4 border-b border-fb-border flex items-center justify-between"><span className="text-[13px] font-bold">Contenido dinámico</span><div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.adSet.dynamicCreative ? 'bg-fb-blue' : 'bg-fb-border'}`} onClick={() => setFormData({...formData, adSet: {...formData.adSet, dynamicCreative: !formData.adSet.dynamicCreative}})}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${formData.adSet.dynamicCreative ? 'left-6' : 'left-1'}`} /></div></div></div>
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2"><div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div><span className="text-[13px] font-bold uppercase tracking-tight">Presupuesto y programación</span></div>
                         <div className="p-6 space-y-6">
                            <div className="flex gap-4"><div className="w-full"><label className="text-[12px] font-bold text-slate-800 block mb-1">Presupuesto</label><div className="flex gap-2"><select className="meta-editor-input font-bold w-1/3" value={formData.adSet.budgetType} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, budgetType: e.target.value}})}><option value="daily">Presupuesto diario</option><option value="total">Presupuesto total</option></select><div className="relative flex-grow"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">$</span><input type="text" className="meta-editor-input pl-6 font-bold" value={formData.adSet.budget} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, budget: e.target.value}})} /></div></div></div></div>
                            <div className="grid grid-cols-2 gap-6"><div><label className="text-[12px] font-bold text-slate-800 block mb-1">Fecha de inicio</label><div className="flex gap-2"><input type="date" className="meta-editor-input font-bold flex-grow" value={formData.adSet.startDate} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, startDate: e.target.value}})} /><input type="time" className="meta-editor-input font-bold w-24" value={formData.adSet.startTime} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, startTime: e.target.value}})} /></div></div><div><div className="flex items-center gap-2 mb-1"><input type="checkbox" className="rounded" checked={formData.adSet.endDateEnabled} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, endDateEnabled: e.target.checked}})} /><label className="text-[12px] font-bold text-slate-800">Definir una fecha de finalización</label></div><div className={`flex gap-2 transition-opacity ${formData.adSet.endDateEnabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}><input type="date" className="meta-editor-input font-bold flex-grow" value={formData.adSet.endDate} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, endDate: e.target.value}})} /><input type="time" className="meta-editor-input font-bold w-24" value={formData.adSet.endTime} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, endTime: e.target.value}})} /></div></div></div>
                          </div>
                      </div>

                      {/* --- CONTROLES DE AUDIENCIA --- */}
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500">
                                  <Check size={12} strokeWidth={3} />
                               </div>
                               <span className="text-[13px] font-bold">Controles de audiencia</span>
                               <Info size={14} className="text-slate-400" />
                            </div>
                         </div>
                         <div className="p-6 space-y-6">
                            <p className="text-[11px] text-fb-text-secondary leading-relaxed mb-4">
                               Ajusta los controles de audiencia únicamente para satisfacer condicionantes prácticos o legales. <span className="text-fb-blue cursor-pointer">Más información</span>
                            </p>
                            
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex gap-3">
                               <Info size={18} className="text-slate-400 mt-0.5" />
                               <div className="text-[11px] text-slate-600 leading-relaxed">
                                  Puedes establecer los controles de audiencia en esta cuenta publicitaria para aplicarlos a todas las campañas. <br/>
                                  <span className="text-fb-blue cursor-pointer font-bold">Establecer controles de audiencia para todas las campañas</span>
                               </div>
                            </div>

                            <button className="text-[13px] font-bold text-slate-800 flex items-center gap-1 hover:bg-slate-50 px-2 py-1 rounded">
                               Usar audiencia guardada <ChevronDown size={14} />
                            </button>

                            <div className="space-y-4 pt-4 border-t border-fb-border">
                               <label className="text-[12px] font-bold text-slate-800 block">* Lugares <Info size={12} className="inline text-slate-400 ml-1" /></label>
                               <div className="border border-fb-border rounded-lg p-4 space-y-4">
                                  <div className="bg-slate-50 p-3 rounded flex items-center justify-between">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center"><MapPin size={16} /></div>
                                        <span className="text-[13px] font-bold">{formData.adSet.location || 'Chile'}</span>
                                     </div>
                                     <ChevronDown size={16} className="text-slate-400" />
                                  </div>
                                  
                                  <div className="flex gap-2">
                                     <select className="meta-editor-input w-24 font-bold"><option>Incluir</option><option>Excluir</option></select>
                                     <div className="relative flex-grow">
                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                          type="text" 
                                          className="meta-editor-input pl-10 w-full" 
                                          placeholder="Buscar lugares" 
                                          value={formData.adSet.locationSearch}
                                          onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, locationSearch: e.target.value}})}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                           <span className="text-[11px] font-bold text-slate-500 hover:text-fb-blue cursor-pointer flex items-center gap-1">Explorar <ChevronDown size={12} /></span>
                                        </div>
                                     </div>
                                     <button className="p-2 border border-fb-border rounded hover:bg-slate-50"><ChevronDown size={16} /></button>
                                  </div>
                                  <button className="text-fb-blue text-[11px] font-bold hover:underline">Añadir lugares de forma masiva</button>
                               </div>
                            </div>

                            <button className="text-fb-blue text-[12px] font-bold flex items-center gap-1">Mostrar más opciones <ChevronDown size={14} /></button>
                            
                            <div className="space-y-4 pt-4">
                               <label className="text-[12px] font-bold text-slate-800 block">Edad mínima <Info size={12} className="inline text-slate-400 ml-1" /></label>
                               <div className="space-y-4">
                                  <select 
                                    className="meta-editor-input font-bold w-32"
                                    value={formData.adSet.ageMin}
                                    onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, ageMin: e.target.value}})}
                                  >
                                    {ageOptions.map(age => <option key={age} value={age}>{age}</option>)}
                                  </select>
                                  <label className="flex items-center gap-3 cursor-pointer group">
                                     <input 
                                       type="checkbox" 
                                       className="w-5 h-5 rounded border-slate-300 text-fb-blue focus:ring-fb-blue" 
                                       checked={formData.adSet.includeUnknownAgeWhatsApp}
                                       onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, includeUnknownAgeWhatsApp: e.target.checked}})}
                                     />
                                     <span className="text-[13px] text-slate-700">Incluir a personas de WhatsApp cuya edad se desconoce</span>
                                  </label>
                                  
                                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex gap-3">
                                     <Info size={18} className="text-slate-400 mt-0.5" />
                                     <div className="text-[11px] text-slate-600 leading-relaxed">
                                        <span className="font-bold">La audiencia se ha actualizado</span> <br/>
                                        Para llegar a más personas en la ubicación de estado de WhatsApp, el público de este conjunto de anuncios incluye personas en WhatsApp cuya edad se desconoce. <span className="text-fb-blue cursor-pointer">Información sobre cómo llegar a públicos nuevos</span>
                                     </div>
                                  </div>
                               </div>
                            </div>

                            <div className="space-y-2 pt-4">
                               <label className="text-[12px] font-bold text-fb-text-primary flex items-center justify-between">
                                  Excluir estas audiencias personalizadas <Info size={12} className="text-slate-400" />
                               </label>
                               <div className="relative">
                                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                  <input 
                                    type="text" 
                                    className="meta-editor-input pl-10 w-full" 
                                    placeholder="Buscar audiencias existentes" 
                                    value={formData.adSet.excludedCustomAudiences}
                                    onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, excludedCustomAudiences: e.target.value}})}
                                  />
                               </div>
                            </div>

                            <div className="space-y-1 pt-4">
                               <label className="text-[12px] font-bold text-fb-text-primary flex items-center gap-1">Idiomas <Info size={12} className="text-slate-400" /></label>
                               <p className="text-[12px] text-slate-600">{formData.adSet.languages.join(', ')}</p>
                               <button className="text-fb-blue text-[11px] font-bold hover:underline">Editar</button>
                            </div>
                         </div>
                      </div>

                      {/* --- AUDIENCIA DE ADVANTAGE+ --- */}
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500">
                                  <Check size={12} strokeWidth={3} />
                               </div>
                               <span className="text-[13px] font-bold">Audiencia de Advantage+ ✨</span>
                            </div>
                         </div>
                         <div className="p-6 space-y-6">
                            <p className="text-[11px] text-fb-text-secondary leading-relaxed">
                               Nuestra IA encuentra las audiencias para tus anuncios. Si añades una sugerencia de audiencia, guiarás a nuestra IA hacia las personas que crees que es más probable que respondan. <span className="text-fb-blue cursor-pointer">Información sobre la audiencia de Advantage+</span>
                            </p>

                            <div className="space-y-2">
                               <div className="flex items-center justify-between">
                                  <label className="text-[12px] font-bold text-slate-800">Incluir estas audiencias personalizadas <Info size={12} className="inline text-slate-400 ml-1" /></label>
                                  <button className="text-xs font-bold flex items-center gap-1">Crear <ChevronDown size={14} /></button>
                               </div>
                               <div className="relative">
                                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                  <input 
                                    type="text" 
                                    className="meta-editor-input pl-10 w-full" 
                                    placeholder="Buscar audiencias existentes" 
                                    value={formData.adSet.advantageAudience.customAudiences}
                                    onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, advantageAudience: {...formData.adSet.advantageAudience, customAudiences: e.target.value}}})}
                                  />
                               </div>
                            </div>

                            <div className="space-y-2">
                               <label className="text-[12px] font-bold text-slate-800 block">Edad <Info size={12} className="inline text-slate-400 ml-1" /></label>
                               <div className="flex gap-2">
                                  <select 
                                    className="meta-editor-input font-bold w-24"
                                    value={formData.adSet.advantageAudience.ageMin}
                                    onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, advantageAudience: {...formData.adSet.advantageAudience, ageMin: e.target.value}}})}
                                  >
                                    {ageOptions.map(age => <option key={age} value={age}>{age}</option>)}
                                  </select>
                                  <select 
                                    className="meta-editor-input font-bold w-24"
                                    value={formData.adSet.advantageAudience.ageMax}
                                    onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, advantageAudience: {...formData.adSet.advantageAudience, ageMax: e.target.value}}})}
                                  >
                                    {ageOptions.map(age => <option key={age} value={age}>{age}</option>)}
                                  </select>
                               </div>
                            </div>

                            <div className="space-y-2">
                               <label className="text-[12px] font-bold text-slate-800 block">Género <Info size={12} className="inline text-slate-400 ml-1" /></label>
                               <div className="flex gap-6">
                                  {['all', 'men', 'women'].map(g => (
                                    <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.adSet.advantageAudience.gender === g ? 'border-fb-blue' : 'border-slate-300 group-hover:border-slate-400'}`} onClick={() => setFormData({...formData, adSet: {...formData.adSet, advantageAudience: {...formData.adSet.advantageAudience, gender: g}}})}>
                                          {formData.adSet.advantageAudience.gender === g && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full" />}
                                       </div>
                                       <span className="text-[13px] text-slate-700 capitalize">{g === 'all' ? 'Todos' : g === 'men' ? 'Hombres' : 'Mujeres'}</span>
                                    </label>
                                  ))}
                               </div>
                            </div>

                            <div className="space-y-2">
                               <label className="text-[12px] font-bold text-slate-800 block">Segmentación detallada <Info size={12} className="inline text-slate-400 ml-1" /></label>
                               <p className="text-[11px] text-slate-600 font-bold">Incluir personas que coincidan con <Info size={10} className="inline" /></p>
                               <div className="flex gap-2">
                                  <div className="relative flex-grow">
                                     <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                     <input 
                                       type="text" 
                                       className="meta-editor-input pl-10 w-full" 
                                       placeholder="Añade datos demográficos, intereses o comportamientos" 
                                       value={formData.adSet.advantageAudience.detailedTargeting}
                                       onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, advantageAudience: {...formData.adSet.advantageAudience, detailedTargeting: e.target.value}}})}
                                     />
                                  </div>
                                  <button className="px-4 py-2 border border-fb-border rounded-md text-[13px] font-bold hover:bg-slate-50">Explorar</button>
                               </div>
                            </div>

                            <div className="pt-4 border-t border-fb-border flex items-center justify-between">
                               <button className="px-6 py-2 border border-fb-border rounded-md font-bold text-[13px] hover:bg-slate-50">Guardar audiencia</button>
                               <button className="text-fb-blue font-bold text-[12px] hover:underline">Cambiar a las opciones de audiencia originales</button>
                            </div>
                         </div>
                      </div>

                      <div className="meta-editor-card p-6"><div className="justification-box"><span className="justification-title">Justificación</span><textarea className="justification-input" placeholder="Justificación estratégica del conjunto de anuncios..." value={formData.adSet.adSetJustification} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, adSetJustification: e.target.value}})} /></div></div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2"><div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div><span className="text-[13px] font-bold">Nombre del anuncio</span></div>
                         <div className="p-6 flex items-center gap-4"><input type="text" className="meta-editor-input flex-grow" value={formData.ad.name} onChange={(e) => setFormData({...formData, ad: {...formData.ad, name: e.target.value}})} /><button className="px-4 py-2 border border-fb-border rounded-md text-[12px] font-bold hover:bg-fb-header transition-colors">Crear plantilla</button></div>
                      </div>
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2"><div className="w-4 h-4 bg-fb-blue rounded-full flex items-center justify-center text-white"><div className="w-2 h-2 border-r border-t border-white rotate-45" /></div><span className="text-[13px] font-bold">Identidad</span></div>
                         <div className="p-6 space-y-6">
                            <div><label className="text-[12px] font-bold text-slate-800 block mb-1">Página de Facebook <HelpCircle size={14} className="inline text-slate-400" /></label><select className="meta-editor-input font-bold" value={formData.adSet.pageName} readOnly><option>{formData.adSet.pageName}</option></select></div>
                            <div><label className="text-[12px] font-bold text-slate-800 block mb-1">Perfil de Instagram <HelpCircle size={14} className="inline text-slate-400" /></label><select className="meta-editor-input font-bold"><option>{formData.adSet.pageName}</option></select></div>
                            <div><label className="text-[12px] font-bold text-slate-800 block mb-1">WhatsApp <HelpCircle size={14} className="inline text-slate-400" /></label><div className="flex gap-2"><select className="meta-editor-input font-bold flex-grow"><option>Selecciona un número...</option></select><button className="px-4 py-2 border border-fb-border rounded-md text-[12px] font-bold hover:bg-fb-header">Conectar</button></div></div>
                         </div>
                      </div>
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2"><div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div><span className="text-[13px] font-bold">Configuración del anuncio</span></div>
                         <div className="p-6 space-y-6">
                            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg flex items-start gap-3"><Info size={16} className="text-fb-blue mt-0.5" /><div><span className="text-[13px] font-bold block">Cambió la selección de formato</span><p className="text-[11px] text-slate-600 leading-relaxed">Opciones de visualización del formato es la nueva forma de mostrar tu anuncio...</p></div></div>
                            <div className="space-y-2 pl-2">
                               <label className="flex items-center gap-3 cursor-pointer"><div className="w-5 h-5 rounded-full border-2 border-fb-blue flex items-center justify-center"><div className="w-2.5 h-2.5 bg-fb-blue rounded-full" /></div><span className="text-[13px] text-slate-700">Un solo vídeo o imagen</span></label>
                               <label className="flex items-center gap-3 cursor-pointer opacity-50"><div className="w-5 h-5 rounded-full border-2 border-slate-300" /><span className="text-[13px] text-slate-700">Secuencia</span></label>
                            </div>
                         </div>
                      </div>
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2"><div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div><span className="text-[13px] font-bold">Seguimiento</span></div>
                         <div className="p-6 space-y-4">
                            <div><label className="text-[12px] font-bold text-slate-800 block mb-1">Parámetros de URL</label><input type="text" className="meta-editor-input font-bold" value={formData.ad.tracking.urlParams} onChange={(e) => setFormData({...formData, ad: {...formData.ad, tracking: {...formData.ad.tracking, urlParams: e.target.value}}})} /></div>
                         </div>
                      </div>
                      <div className="meta-editor-card p-6"><div className="justification-box"><span className="justification-title">Justificación</span><textarea className="justification-input" placeholder="Justificación estratégica del anuncio..." value={formData.ad.creativeStrategyJustification} onChange={(e) => setFormData({...formData, ad: {...formData.ad, creativeStrategyJustification: e.target.value}})} /></div></div>
                    </motion.div>
                  )}
                </div>

                <div className="col-span-4 space-y-4">
                   <div className="bg-white border border-fb-border rounded-lg p-6 shadow-sm flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full border-[6px] border-fb-blue border-t-fb-header flex items-center justify-center"><span className="text-xl font-black text-fb-text-primary">100</span></div>
                      <div className="flex flex-col pr-2"><div className="flex items-center gap-1"><span className="text-[13px] font-bold">Puntuación</span><HelpCircle size={12} className="text-slate-400" /></div><p className="text-[11px] text-fb-text-secondary leading-tight mt-1">Configuración óptima detectada.</p></div>
                   </div>
                   {currentStep === 2 && (
                     <div className="bg-white border border-fb-border rounded-lg p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between"><span className="text-[13px] font-bold">Público estimado</span><HelpCircle size={14} className="text-slate-400" /></div>
                        <div className="text-xl font-black text-slate-800">16 800 000 - 19 700 000</div>
                        <div className="h-1.5 w-full bg-fb-header rounded-full overflow-hidden flex"><div className="w-1/3 bg-yellow-400" /><div className="w-1/3 bg-green-500 border-x-4 border-white" /><div className="w-1/3 bg-red-400" /></div>
                     </div>
                   )}
                   {currentStep === 3 && (
                     <div className="bg-white border border-fb-border rounded-lg p-4 shadow-sm space-y-4">
                        <button className="w-full py-2 border border-fb-border rounded-md text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-fb-header"><Maximize2 size={14} /> Vista previa avanzada</button>
                     </div>
                   )}
                </div>
             </div>
          </main>
          <footer className="h-14 bg-white border-t border-fb-border px-6 flex items-center justify-between z-40 fixed bottom-0 left-0 right-0">
             <button onClick={() => setView('manager')} className="px-4 py-2 border border-fb-border rounded-md text-[13px] font-bold hover:bg-fb-header">Cerrar</button>
             <div className="flex gap-4">
                <button onClick={() => setCurrentStep(currentStep - 1)} className="px-8 py-2 border border-fb-border rounded-md text-[13px] font-bold hover:bg-fb-header" disabled={currentStep === 1}>Atrás</button>
                {currentStep === 3 ? (
                  <button onClick={handleFinish} className="px-10 py-2 bg-fb-blue text-white rounded-md text-[13px] font-bold shadow-md hover:bg-blue-700">Finalizar y Guardar</button>
                ) : (
                  <button onClick={() => setCurrentStep(currentStep + 1)} className="px-8 py-2 bg-fb-blue text-white rounded-md text-[13px] font-bold hover:bg-blue-700">Siguiente</button>
                )}
             </div>
          </footer>
        </div>
      </div>
    );
  }
  return null;
};

export default Simulator;
