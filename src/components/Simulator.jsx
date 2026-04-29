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

  const [formData, setFormData] = useState({
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
      ageMin: '18',
      ageMax: '65',
      gender: 'all',
      detailedTargeting: '',
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
  });

  useEffect(() => {
    if (view === 'manager') {
      setLoadingCampaigns(true);
      const url = currentUser?.role === 'admin' ? '/api/admin/all' : `/api/group-data/${currentUser?.group_id}`;
      fetch(url).then(res => res.json()).then(data => { setSavedCampaigns(data.campaigns || []); setLoadingCampaigns(false); }).catch(err => { console.error(err); setLoadingCampaigns(false); });
    }
  }, [view, currentUser]);

  const handleFinish = async () => {
    updateProjectData({ platform, ...formData });
    try {
      await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.campaignName, userId: currentUser.id, groupId: currentUser.group_id, data: formData })
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
               <button onClick={() => setView('modal')} className="meta-btn-green"><Plus size={16} /> Crear</button>
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
                </div>
                {savedCampaigns.map((camp) => (
                  <div key={camp.id} className="flex h-12 border-b border-fb-border items-center text-[12px]">
                    <div className="w-12 flex justify-center"><input type="checkbox" /></div>
                    <div className="w-40 px-3 flex items-center gap-2"><div className="w-8 h-4 bg-fb-blue/20 rounded-full relative"><div className="absolute left-1 top-1 w-2 h-2 bg-fb-blue rounded-full" /></div><span className="font-bold text-fb-blue uppercase">Activa</span></div>
                    <div className="w-[350px] px-3 font-bold text-fb-blue hover:underline cursor-pointer truncate">{camp.name}</div>
                    <div className="w-32 px-3 text-slate-600">Aprendizaje</div>
                    <div className="w-32 px-3 font-bold">{Math.floor(Math.random() * 50)}</div>
                    <div className="w-32 px-3 font-bold">${camp.data?.adSet?.budget || '2.500'} CLP</div>
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
              {currentStep === 3 ? (
                <button onClick={handleFinish} className="bg-fb-green-btn text-white px-6 py-2 rounded-md font-bold text-sm shadow-md hover:bg-green-700">Publicar</button>
              ) : (
                <button onClick={handleFinish} className="bg-fb-blue text-white px-6 py-2 rounded-md font-bold text-sm shadow-md hover:bg-blue-700">Finalizar y Guardar</button>
              )}
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
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2"><div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div><span className="text-[13px] font-bold">Nombre del anuncio</span></div>
                         <div className="p-6 flex items-center gap-4"><input type="text" className="meta-editor-input flex-grow" value={formData.ad.name} onChange={(e) => setFormData({...formData, ad: {...formData.ad, name: e.target.value}})} /><button className="px-4 py-2 border border-fb-border rounded-md text-[12px] font-bold hover:bg-fb-header transition-colors">Crear plantilla</button></div>
                      </div>

                      <div className="meta-editor-card p-4 flex items-center justify-between">
                         <div className="flex flex-col"><span className="text-sm font-bold text-slate-800">Anuncio con socio</span><p className="text-[11px] text-fb-text-secondary leading-tight">Publica anuncios con creadores, marcas y otras empresas...</p></div>
                         <div className="flex items-center gap-2"><span className="text-[11px] font-bold text-slate-400">No</span><div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors bg-fb-border`}><div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all`} /></div></div>
                      </div>

                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2"><div className="w-4 h-4 bg-fb-blue rounded-full flex items-center justify-center text-white"><div className="w-2 h-2 border-r border-t border-white rotate-45" /></div><span className="text-[13px] font-bold">Identidad</span></div>
                         <div className="p-6 space-y-6">
                            <p className="text-[11px] text-fb-text-secondary">Los perfiles que se usarán en tu anuncio.</p>
                            <div><label className="text-[12px] font-bold text-slate-800 block mb-1">Página de Facebook <HelpCircle size={14} className="inline text-slate-400" /></label><select className="meta-editor-input font-bold" value={formData.adSet.pageName} readOnly><option>{formData.adSet.pageName}</option></select></div>
                            <div><label className="text-[12px] font-bold text-slate-800 block mb-1">Perfil de Instagram <HelpCircle size={14} className="inline text-slate-400" /></label><select className="meta-editor-input font-bold"><option>Seleccionar perfil</option><option>{formData.adSet.pageName}</option></select></div>
                            <div><label className="text-[12px] font-bold text-slate-800 block mb-1">Número de teléfono de WhatsApp <HelpCircle size={14} className="inline text-slate-400" /></label><div className="flex gap-2"><select className="meta-editor-input font-bold flex-grow"><option>Selecciona un número de W...</option></select><button className="px-4 py-2 border border-fb-border rounded-md text-[12px] font-bold hover:bg-fb-header">Conectar perfil</button></div></div>
                         </div>
                      </div>

                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2"><div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div><span className="text-[13px] font-bold">Configuración del anuncio</span></div>
                         <div className="p-6 space-y-6">
                            <select className="meta-editor-input font-bold"><option>Crear anuncio</option><option>Usar publicación existente</option></select>
                            <div className="space-y-3">
                               <label className="text-[12px] font-bold text-slate-800 block">Formato <HelpCircle size={14} className="inline text-slate-400" /></label>
                               <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg space-y-3">
                                  <div className="flex items-start gap-3"><Info size={16} className="text-fb-blue mt-0.5" /><div><span className="text-[13px] font-bold block">Cambió la selección de formato</span><p className="text-[11px] text-slate-600 leading-relaxed">Opciones de visualización del formato en "Contenido del anuncio" es la nueva forma de mostrar tu anuncio...</p></div></div>
                               </div>
                               <div className="space-y-2 pl-2 pt-2">
                                  <label className="flex items-center gap-3 cursor-pointer"><div className="w-5 h-5 rounded-full border-2 border-fb-blue flex items-center justify-center"><div className="w-2.5 h-2.5 bg-fb-blue rounded-full" /></div><span className="text-[13px] text-slate-700">Un solo vídeo o imagen</span></label>
                                  <label className="flex items-center gap-3 cursor-pointer opacity-50"><div className="w-5 h-5 rounded-full border-2 border-slate-300" /><span className="text-[13px] text-slate-700">Secuencia</span></label>
                               </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-fb-header/20 rounded-lg">
                               <input type="checkbox" className="rounded mt-1" />
                               <div><span className="text-[13px] font-bold block">Anuncios multianunciante</span><p className="text-[11px] text-fb-text-secondary leading-tight">Tu anuncio puede aparecer con otros en el mismo bloque de anuncios...</p></div>
                            </div>
                         </div>
                      </div>

                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2"><div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div><span className="text-[13px] font-bold">Contenido del anuncio</span></div>
                         <div className="p-6 space-y-6">
                            <button className="px-4 py-2 border border-fb-border rounded-md text-[13px] font-bold flex items-center gap-2">Configurar contenido <ChevronDown size={16} /></button>
                            <div className="pt-4 border-t border-fb-border space-y-3">
                               <label className="text-[12px] font-bold text-slate-800 block flex items-center gap-1">Tests de contenido <HelpCircle size={14} className="text-slate-400" /></label>
                               <p className="text-[11px] text-fb-text-secondary leading-tight">Compara hasta 5 versiones diferentes de tu contenido en un test...</p>
                               <button className="px-4 py-2 border border-fb-border rounded-md text-[13px] font-bold">Configurar prueba</button>
                            </div>
                         </div>
                      </div>

                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center justify-between">
                            <span className="text-[13px] font-bold">Idiomas</span>
                            <div className="flex items-center gap-2"><span className="text-[11px] font-bold text-slate-400">Desactivado</span><div className="w-10 h-5 rounded-full bg-fb-border relative"><div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full" /></div></div>
                         </div>
                      </div>

                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2"><div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div><span className="text-[13px] font-bold">Seguimiento</span></div>
                         <div className="p-6 space-y-6">
                            <p className="text-[11px] text-fb-text-secondary leading-relaxed">Elige los eventos de conversión a los que quieres hacerles seguimiento...</p>
                            <div className="space-y-3">
                               <label className="flex items-center gap-3 text-[13px] text-slate-700 opacity-50"><div className="w-4 h-4 border border-slate-300 rounded" /> Eventos del sitio web</label>
                               <label className="flex items-center gap-3 text-[13px] text-slate-700 opacity-50"><div className="w-4 h-4 border border-slate-300 rounded" /> Eventos de la aplicación</label>
                            </div>
                            <div>
                               <label className="text-[12px] font-bold text-slate-800 block mb-1 flex items-center gap-1">Parámetros de URL <HelpCircle size={14} className="text-slate-400" /></label>
                               <input type="text" className="meta-editor-input font-bold" value={formData.ad.tracking.urlParams} onChange={(e) => setFormData({...formData, ad: {...formData.ad, tracking: {...formData.ad.tracking, urlParams: e.target.value}}})} />
                            </div>
                            <div className="pt-4 border-t border-fb-border">
                               <h5 className="text-[12px] font-bold mb-1">Herramienta de informes de terceros</h5>
                               <p className="text-[11px] text-fb-text-secondary mb-3 leading-tight">Conecta tu cuenta para medir las acciones de los anuncios que envían a las personas a tu sitio...</p>
                               <button className="px-4 py-2 border border-fb-border rounded-md text-[13px] font-bold">Conectar</button>
                            </div>
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
                   {currentStep === 3 && (
                     <div className="bg-white border border-fb-border rounded-lg p-4 shadow-sm space-y-4">
                        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-10 h-5 bg-fb-header rounded-full relative"><div className="absolute top-1 left-1 w-3 h-3 bg-slate-400 rounded-full" /></div><span className="text-[11px] font-bold">Vista previa del anuncio</span></div></div>
                        <button className="w-full py-2 border border-fb-border rounded-md text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-fb-header"><Maximize2 size={14} /> Vista previa avanzada</button>
                        <div className="flex justify-center pt-2"><button className="p-2 border border-fb-border rounded-md text-slate-400"><Share2 size={18} /></button></div>
                     </div>
                   )}
                </div>
             </div>
          </main>
          <footer className="h-14 bg-white border-t border-fb-border px-6 flex items-center justify-between z-40 fixed bottom-0 left-0 right-0">
             <button onClick={() => setView('manager')} className="px-4 py-2 border border-fb-border rounded-md text-[13px] font-bold hover:bg-fb-header">Cerrar</button>
             <div className="flex gap-4">
                <button onClick={() => setCurrentStep(currentStep - 1)} className="px-8 py-2 border border-fb-border rounded-md text-[13px] font-bold hover:bg-fb-header">Atrás</button>
                {currentStep === 3 ? (
                  <button onClick={handleFinish} className="px-10 py-2 bg-fb-green-btn text-white rounded-md text-[13px] font-bold shadow-md hover:bg-green-700">Publicar</button>
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
