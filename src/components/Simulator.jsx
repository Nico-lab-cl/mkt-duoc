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
  Facebook,
  Instagram,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const metaObjectives = [
  { id: 'awareness', name: 'Reconocimiento', icon: <BarChart3 size={20} />, description: 'Muestra tus anuncios a las personas que tienen más probabilidades de recordarlos.' },
  { id: 'traffic', name: 'Tráfico', icon: <Plus size={20} />, description: 'Dirige a las personas a un destino, como tu sitio web, app o evento de Facebook.' },
  { id: 'engagement', name: 'Interacción', icon: <MessageSquareIcon size={20} />, description: 'Consigue más mensajes, reproducciones de video, interacciones con tus publicaciones.' },
  { id: 'leads', name: 'Clientes potenciales', icon: <Users size={20} />, description: 'Genera clientes potenciales para tu empresa o marca.' },
  { id: 'promotion', name: 'Promoción de la app', icon: <Smartphone size={20} />, description: 'Consigue que más personas instalen tu app y la usen.' },
  { id: 'sales', name: 'Ventas', icon: <Plus size={20} />, description: 'Busca a personas con probabilidades de comprar tu producto o servicio.' },
];

const MessageSquareIcon = ({ size }) => <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} />;

const ageOptions = Array.from({ length: 48 }, (_, i) => (i + 18).toString()).concat(['65+']);

const Simulator = ({ platform, onFinish, onBack }) => {
  const { projectData, updateProjectData, currentUser } = useProject();
  const [view, setView] = useState('manager'); 
  const [activeTab, setActiveTab] = useState('campaigns'); 
  const [currentStep, setCurrentStep] = useState(1); 
  const [showAudienceSuggestions, setShowAudienceSuggestions] = useState(false);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  useEffect(() => {
    if (view === 'manager') {
      setLoadingCampaigns(true);
      const url = currentUser?.role === 'admin' 
        ? '/api/admin/all' 
        : `/api/group-data/${currentUser?.group_id}`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          setSavedCampaigns(data.campaigns || []);
          setLoadingCampaigns(false);
        })
        .catch(err => {
          console.error('Error fetching campaigns:', err);
          setLoadingCampaigns(false);
        });
    }
  }, [view, currentUser]);
  
  const [formData, setFormData] = useState({
    objective: '',
    objectiveJustification: '',
    campaignName: 'Nueva campaña',
    specialCategories: 'NONE',
    buyingType: 'Subasta',
    advantageBudget: false,
    campaignBudget: '25000',
    bidStrategy: 'Menor costo',
    adSet: {
      name: 'Nuevo conjunto de anuncios',
      performanceGoal: 'Maximizar el número de clics en el enlace',
      dynamicCreative: false,
      budget: '2500',
      budgetType: 'daily',
      startDate: '2026-04-28',
      startTime: '21:21',
      endDateEnabled: false,
      endDate: '',
      endTime: '',
      location: 'Chile',
      locationRadius: '40',
      ageMin: '18',
      ageMax: '65',
      gender: 'all',
      detailedTargeting: '',
      placements: 'advantage',
      platforms: ['facebook', 'instagram', 'messenger', 'audience'],
      adSetJustification: '',
    },
    ad: {
      name: 'Nuevo anuncio',
      format: 'single', 
      primaryText: '',
      headline: '',
      description: '',
      cta: 'LEARN_MORE',
      destinationUrl: '',
      creativeStrategyJustification: ''
    }
  });

  const handleFinish = async () => {
    updateProjectData({ platform, ...formData });
    try {
      await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.campaignName || 'Campaña sin nombre',
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
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               API PROFE NICO: CONECTADA
             </div>
             <div className="flex items-center gap-2">
               <button className="bg-fb-blue text-white px-4 py-1.5 rounded-md font-bold text-[13px] hover:bg-blue-700">Revisar y publicar</button>
             </div>
          </div>
        </header>

        <div className="flex flex-grow overflow-hidden">
          <aside className="w-12 bg-fb-sidebar flex flex-col items-center py-4 gap-6 z-10">
            <Layout size={20} className="text-white opacity-40 hover:opacity-100 cursor-pointer" />
            <Users size={20} className="text-white cursor-pointer border-l-2 border-fb-blue pl-1" />
            <ImageIcon size={20} className="text-white opacity-40 hover:opacity-100 cursor-pointer" />
            <div className="flex-grow" />
            <BarChart3 size={20} className="text-white opacity-40 hover:opacity-100 cursor-pointer" />
          </aside>

          <main className="flex-grow flex flex-col overflow-hidden">
            <div className="bg-fb-header border-b border-fb-border px-4 flex items-center justify-between">
               <div className="flex gap-1 pt-1">
                 <div onClick={() => setActiveTab('campaigns')} className={`meta-tab ${activeTab === 'campaigns' ? 'meta-tab-active' : 'meta-tab-inactive'}`}>Campañas</div>
                 <div onClick={() => setActiveTab('adsets')} className={`meta-tab ${activeTab === 'adsets' ? 'meta-tab-active' : 'meta-tab-inactive'}`}>Conjuntos de anuncios</div>
                 <div onClick={() => setActiveTab('ads')} className={`meta-tab ${activeTab === 'ads' ? 'meta-tab-active' : 'meta-tab-inactive'}`}>Anuncios</div>
               </div>
            </div>

            <div className="bg-white border-b border-fb-border p-2 flex items-center justify-between shadow-sm">
               <div className="flex items-center gap-2">
                 <button onClick={() => setView('modal')} className="meta-btn-green"><Plus size={16} /> Crear</button>
                 <button className="meta-btn-secondary"><Copy size={14} /> Duplicar</button>
                 <button className="meta-btn-secondary"><Edit2 size={14} /> Editar</button>
                 <div className="h-6 w-px bg-fb-border mx-1" />
                 <button className="meta-btn-secondary"><Trash2 size={14} /></button>
               </div>
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
                  <div key={camp.id} className="flex h-12 border-b border-fb-border hover:bg-fb-header/50 items-center text-[12px]">
                    <div className="w-12 flex justify-center"><input type="checkbox" /></div>
                    <div className="w-40 px-3 flex items-center gap-2">
                       <div className="w-8 h-4 bg-fb-blue/20 rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-2 h-2 bg-fb-blue rounded-full" />
                       </div>
                       <span className="font-bold text-fb-blue">ACTIVA</span>
                    </div>
                    <div className="w-[350px] px-3 font-bold text-fb-blue hover:underline cursor-pointer truncate">
                      {camp.name}
                      {currentUser?.role === 'admin' && <span className="block text-[10px] text-slate-400 font-normal italic">De: {camp.student_name} (G{camp.group_id})</span>}
                    </div>
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
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <header className="h-14 border-b border-fb-border flex items-center justify-between px-6">
          <h2 className="text-xl font-bold">Elegir un objetivo de la campaña</h2>
          <button onClick={() => setView('manager')} className="text-fb-text-secondary hover:text-fb-text-primary">✕</button>
        </header>
        <div className="flex-grow flex overflow-hidden">
          <div className="w-1/2 p-8 overflow-y-auto border-r border-fb-border">
            <div className="grid grid-cols-1 gap-4">
              {metaObjectives.map((obj) => (
                <div key={obj.id} onClick={() => setFormData({...formData, objective: obj.id})} className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-start gap-4 ${formData.objective === obj.id ? 'border-fb-blue bg-blue-50/50' : 'border-fb-border hover:bg-fb-header/50'}`}>
                  <div className={`p-2 rounded-lg ${formData.objective === obj.id ? 'bg-fb-blue text-white' : 'bg-fb-header text-fb-text-secondary'}`}>{obj.icon}</div>
                  <div><div className="font-bold text-fb-text-primary">{obj.name}</div><div className="text-xs text-fb-text-secondary mt-1">{obj.description}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/2 p-12 bg-fb-bg flex flex-col items-center justify-center text-center">
            {formData.objective ? (
              <div className="max-w-md">
                <h3 className="text-2xl font-bold mb-4">{metaObjectives.find(o => o.id === formData.objective)?.name}</h3>
                <textarea className="w-full h-32 p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none mb-8" placeholder="Justificación estratégica..." value={formData.objectiveJustification} onChange={(e) => setFormData({...formData, objectiveJustification: e.target.value})} />
                <button onClick={() => setView('editor')} disabled={!formData.objectiveJustification} className={`w-full py-4 bg-fb-blue text-white rounded-xl font-bold ${!formData.objectiveJustification && 'opacity-50'}`}>Continuar</button>
              </div>
            ) : <h3 className="text-lg font-bold text-slate-400">Selecciona un objetivo</h3>}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'editor') {
    return (
      <div className="flex flex-col h-screen bg-fb-editor-bg">
        <header className="h-14 bg-white border-b border-fb-border flex items-center justify-between px-4 z-30">
           <div className="flex items-center gap-3">
              <button onClick={() => setView('manager')} className="p-2 hover:bg-fb-header rounded-full"><Home size={20} /></button>
              <span className="text-sm font-bold truncate max-w-[250px]">{formData.campaignName}</span>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full text-[10px] font-black text-green-600 border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                API PROFE NICO: CONECTADA
              </div>
              <div className="flex bg-fb-header rounded-md p-1 border border-fb-border">
                 {[1, 2, 3].map(s => <button key={s} onClick={() => setCurrentStep(s)} className={`px-4 py-1.5 text-xs font-bold rounded transition-all ${currentStep === s ? 'bg-white shadow-sm text-fb-blue' : 'text-fb-text-secondary hover:bg-white/50'}`}>{s}. {s === 1 ? 'Campaña' : s === 2 ? 'Conjunto' : 'Anuncio'}</button>)}
              </div>
              <button onClick={handleFinish} className="bg-fb-blue text-white px-6 py-2 rounded-md font-bold text-sm">Finalizar y Guardar</button>
           </div>
        </header>

        <div className="flex flex-grow overflow-hidden relative">
          <aside className="w-[280px] bg-white border-r border-fb-border flex flex-col p-4 z-20">
             <div className="text-[11px] font-black text-fb-text-secondary uppercase tracking-widest mb-4">Jerarquía</div>
             <div className="space-y-1">
                <div onClick={() => setCurrentStep(1)} className={`p-2 rounded-lg flex items-center gap-3 cursor-pointer ${currentStep === 1 ? 'bg-blue-50 text-fb-blue border-l-4 border-fb-blue' : 'hover:bg-fb-header'}`}><BarChart3 size={14} /><span className="text-xs font-bold truncate">{formData.campaignName}</span></div>
                <div onClick={() => setCurrentStep(2)} className={`p-2 rounded-lg flex items-center gap-3 cursor-pointer ml-4 ${currentStep === 2 ? 'bg-blue-50 text-fb-blue border-l-4 border-fb-blue' : 'hover:bg-fb-header'}`}><Users size={14} /><span className="text-xs font-bold truncate">{formData.adSet.name}</span></div>
                <div onClick={() => setCurrentStep(3)} className={`p-2 rounded-lg flex items-center gap-3 cursor-pointer ml-8 ${currentStep === 3 ? 'bg-blue-50 text-fb-blue border-l-4 border-fb-blue' : 'hover:bg-fb-header'}`}><ImageIcon size={14} /><span className="text-xs font-bold truncate">{formData.ad.name}</span></div>
             </div>
          </aside>

          <main className="flex-grow overflow-y-auto bg-fb-editor-bg pb-32">
             <div className="max-w-[850px] mx-auto py-10 px-6 space-y-8">
                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title">Detalles de la campaña</div>
                       <div className="p-6 space-y-6">
                          <div>
                             <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Nombre de la campaña</label>
                             <input type="text" className="meta-editor-input" value={formData.campaignName} onChange={(e) => setFormData({...formData, campaignName: e.target.value})} />
                          </div>
                          <div>
                             <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Categorías especiales</label>
                             <select className="meta-editor-input" value={formData.specialCategories} onChange={(e) => setFormData({...formData, specialCategories: e.target.value})}>
                               <option value="NONE">Ninguna</option>
                               <option value="CREDIT">Crédito</option>
                               <option value="EMPLOYMENT">Empleo</option>
                               <option value="HOUSING">Vivienda</option>
                             </select>
                          </div>
                          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-fb-border">
                             <div>
                                <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Tipo de compra</label>
                                <div className="text-sm font-bold text-fb-text-primary">Subasta</div>
                             </div>
                             <div>
                                <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Objetivo</label>
                                <div className="text-sm font-bold text-fb-text-primary">{metaObjectives.find(o => o.id === formData.objective)?.name}</div>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title flex justify-between items-center">
                          Presupuesto de la campaña Advantage
                          <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.advantageBudget ? 'bg-fb-blue' : 'bg-fb-border'}`} onClick={() => setFormData({...formData, advantageBudget: !formData.advantageBudget})}>
                             <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.advantageBudget ? 'left-6' : 'left-1'}`} />
                          </div>
                       </div>
                       <div className="p-6 space-y-6">
                          {formData.advantageBudget && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-6 overflow-hidden">
                               <div className="flex gap-4">
                                  <div className="flex-grow">
                                     <label className="text-[10px] font-bold text-fb-text-secondary uppercase block mb-1">Presupuesto de la campaña</label>
                                     <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-fb-text-secondary">$</span>
                                        <input type="text" className="meta-editor-input pl-6 font-bold" value={formData.campaignBudget} onChange={(e) => setFormData({...formData, campaignBudget: e.target.value})} />
                                     </div>
                                  </div>
                                  <div className="w-1/3">
                                     <label className="text-[10px] font-bold text-fb-text-secondary uppercase block mb-1">Estrategia de puja</label>
                                     <select className="meta-editor-input font-bold" value={formData.bidStrategy} onChange={(e) => setFormData({...formData, bidStrategy: e.target.value})}>
                                        <option>Menor costo</option>
                                        <option>Límite de puja</option>
                                        <option>ROAS deseado</option>
                                     </select>
                                  </div>
                               </div>
                            </motion.div>
                          )}
                          <div className="justification-box">
                             <span className="justification-title">Justificación</span>
                             <textarea className="justification-input" value={formData.objectiveJustification} onChange={(e) => setFormData({...formData, objectiveJustification: e.target.value})} />
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title">Conjunto de anuncios</div>
                       <div className="p-6 space-y-6">
                          <div>
                             <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Nombre</label>
                             <input type="text" className="meta-editor-input" value={formData.adSet.name} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, name: e.target.value}})} />
                          </div>
                          <div>
                             <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Objetivo de rendimiento</label>
                             <select className="meta-editor-input font-bold" value={formData.adSet.performanceGoal} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, performanceGoal: e.target.value}})}>
                                <option>Maximizar el número de clics en el enlace</option>
                                <option>Maximizar las impresiones</option>
                                <option>Maximizar el alcance único diario</option>
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title flex justify-between items-center">
                          Contenido dinámico
                          <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.adSet.dynamicCreative ? 'bg-fb-blue' : 'bg-fb-border'}`} onClick={() => setFormData({...formData, adSet: {...formData.adSet, dynamicCreative: !formData.adSet.dynamicCreative}})}>
                             <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.adSet.dynamicCreative ? 'left-6' : 'left-1'}`} />
                          </div>
                       </div>
                    </div>

                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title">Público</div>
                       <div className="p-6 space-y-6">
                          <div>
                            <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Lugar</label>
                            <div className="flex items-center gap-2 p-2 border border-fb-border rounded-md bg-white">
                               <Globe size={18} className="text-fb-blue" />
                               <input type="text" className="flex-grow bg-transparent border-none outline-none text-sm font-bold" value={formData.adSet.location} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, location: e.target.value}})} />
                               <div className="text-[10px] font-bold text-fb-text-secondary bg-fb-header px-2 py-1 rounded">+{formData.adSet.locationRadius} KM</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                               <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Edad mínima</label>
                               <select className="meta-editor-input font-bold" value={formData.adSet.ageMin} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, ageMin: e.target.value}})}>
                                 {ageOptions.map(age => <option key={age} value={age}>{age}</option>)}
                               </select>
                             </div>
                             <div>
                               <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Edad máxima</label>
                               <select className="meta-editor-input font-bold" value={formData.adSet.ageMax} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, ageMax: e.target.value}})}>
                                 {ageOptions.map(age => <option key={age} value={age}>{age}</option>)}
                               </select>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title">Ubicaciones</div>
                       <div className="p-6 space-y-6">
                          <div className="flex gap-4">
                             {['facebook', 'instagram', 'messenger', 'audience'].map(p => (
                               <div key={p} className={`flex-grow p-4 border rounded-xl flex flex-col items-center gap-2 transition-all cursor-pointer ${formData.adSet.platforms.includes(p) ? 'border-fb-blue bg-blue-50/50 text-fb-blue' : 'border-fb-border text-fb-text-secondary opacity-50'}`} onClick={() => {
                                 const platforms = formData.adSet.platforms.includes(p) ? formData.adSet.platforms.filter(x => x !== p) : [...formData.adSet.platforms, p];
                                 setFormData({...formData, adSet: {...formData.adSet, platforms}});
                               }}>
                                 {p === 'facebook' && <Facebook size={24} />}
                                 {p === 'instagram' && <Instagram size={24} />}
                                 {p === 'messenger' && <Send size={24} />}
                                 {p === 'audience' && <Target size={24} />}
                                 <span className="text-[10px] font-black uppercase">{p}</span>
                               </div>
                             ))}
                          </div>
                          <div className="justification-box">
                             <span className="justification-title">Justificación</span>
                             <textarea className="justification-input" value={formData.adSet.adSetJustification} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, adSetJustification: e.target.value}})} />
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title">Contenido del anuncio</div>
                       <div className="p-6 space-y-6">
                          <div>
                            <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Texto principal</label>
                            <textarea className="meta-editor-input h-32 pt-3" placeholder="Escribe el texto principal..." value={formData.ad.primaryText} onChange={(e) => setFormData({...formData, ad: {...formData.ad, primaryText: e.target.value}})} />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                             <div>
                               <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Título</label>
                               <input type="text" className="meta-editor-input font-bold" placeholder="Escribe un título corto..." value={formData.ad.headline} onChange={(e) => setFormData({...formData, ad: {...formData.ad, headline: e.target.value}})} />
                             </div>
                             <div>
                               <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Llamada a la acción</label>
                               <select className="meta-editor-input font-bold" value={formData.ad.cta} onChange={(e) => setFormData({...formData, ad: {...formData.ad, cta: e.target.value}})}>
                                 <option value="LEARN_MORE">Más información</option>
                                 <option value="SUBSCRIBE">Suscribirte</option>
                                 <option value="SEND_MESSAGE">Enviar mensaje</option>
                               </select>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title">Seguimiento (Tracking)</div>
                       <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center border border-green-200">
                                   <Zap size={20} />
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-sm font-bold text-slate-800">Pixel de {projectData.agencyName || 'Marca'}</span>
                                   <span className="text-[10px] text-green-500 font-black uppercase">Activo y Recibiendo Eventos</span>
                                </div>
                             </div>
                             <div className="text-[10px] font-bold text-slate-400">ID: 577046238821</div>
                          </div>
                          <div className="justification-box">
                             <span className="justification-title">Justificación</span>
                             <textarea className="justification-input" placeholder="Justificación creativa..." value={formData.ad.creativeStrategyJustification} onChange={(e) => setFormData({...formData, ad: {...formData.ad, creativeStrategyJustification: e.target.value}})} />
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}
             </div>
          </main>

          <aside className="w-[420px] bg-white border-l border-fb-border overflow-y-auto hidden xl:block p-6">
             <div className="sticky top-0 space-y-6">
                <div className="flex items-center justify-between border-b border-fb-border pb-4">
                   <h4 className="text-xs font-black text-fb-text-secondary uppercase tracking-widest">Vista previa</h4>
                </div>
                <div className="bg-white border border-fb-border rounded-xl overflow-hidden shadow-2xl">
                   <div className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-fb-blue rounded-full flex items-center justify-center text-white font-bold">{projectData.agencyName?.[0] || 'A'}</div>
                      <div className="flex flex-col">
                         <span className="text-[13px] font-bold">{projectData.agencyName || 'Página'}</span>
                         <span className="text-[11px] text-fb-text-secondary">Publicidad · {formData.adSet.location}</span>
                      </div>
                   </div>
                   <div className="p-4 pt-0 text-[13px] leading-snug whitespace-pre-wrap min-h-[3em]">{formData.ad.primaryText || 'Texto principal aquí...'}</div>
                   <div className="aspect-square bg-fb-bg flex items-center justify-center border-y border-fb-border"><ImageIcon size={64} className="opacity-10" /></div>
                   <div className="p-4 flex items-center justify-between">
                      <div className="flex-grow pr-4 truncate">
                         <div className="text-[10px] text-fb-text-secondary uppercase">SITIO.COM</div>
                         <div className="text-[15px] font-bold truncate text-fb-text-primary">{formData.ad.headline || 'Título del anuncio'}</div>
                      </div>
                      <button className="bg-[#e4e6eb] px-5 py-2 rounded-md text-[13px] font-bold">{formData.ad.cta === 'LEARN_MORE' ? 'Más información' : 'Ver más'}</button>
                   </div>
                </div>
             </div>
          </aside>
        </div>
      </div>
    );
  }

  return null;
};

export default Simulator;
