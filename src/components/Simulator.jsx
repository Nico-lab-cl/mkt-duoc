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
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const metaObjectives = [
  { id: 'awareness', name: 'Reconocimiento', icon: <BarChart3 size={20} />, description: 'Muestra tus anuncios a las personas que tienen más probabilidades de recordarlos.' },
  { id: 'traffic', name: 'Tráfico', icon: <Plus size={20} />, description: 'Dirige a las personas a un destino, como tu sitio web, app o evento de Facebook.' },
  { id: 'engagement', name: 'Interacción', icon: <Users size={20} />, description: 'Consigue más mensajes, reproducciones de video, interacciones con tus publicaciones, Me gusta de la página o respuestas a eventos.' },
  { id: 'leads', name: 'Clientes potenciales', icon: <Plus size={20} />, description: 'Genera clientes potenciales para tu empresa o marca.' },
  { id: 'promotion', name: 'Promoción de la app', icon: <Plus size={20} />, description: 'Consigue que más personas instalen tu app y la usen.' },
  { id: 'sales', name: 'Ventas', icon: <Plus size={20} />, description: 'Busca a personas con probabilidades de comprar tu producto o servicio.' },
];

const ageOptions = Array.from({ length: 48 }, (_, i) => (i + 18).toString()).concat(['65+']);

const Simulator = ({ platform, onFinish, onBack }) => {
  const { projectData, updateProjectData, currentUser } = useProject();
  const [view, setView] = useState('manager'); // 'manager' | 'modal' | 'editor'
  const [activeTab, setActiveTab] = useState('campaigns'); // 'campaigns' | 'adsets' | 'ads'
  const [currentStep, setCurrentStep] = useState(1); // 1: Campaña, 2: Ad Set, 3: Ad
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
    advantageBudget: false,
    adSet: {
      name: 'Nuevo conjunto de anuncios',
      performanceGoal: 'REACH',
      budget: '2500',
      budgetType: 'daily',
      startDate: '2026-04-28',
      startTime: '21:21',
      endDateEnabled: false,
      endDate: '',
      endTime: '',
      location: 'Chile',
      locationRadius: '40',
      locationType: 'home_recent',
      ageMin: '18',
      ageMax: '65',
      gender: 'all',
      detailedTargeting: '',
      placements: 'advantage',
      adSetJustification: '',
    },
    ad: {
      name: 'Nuevo anuncio',
      identityInstagram: '',
      format: 'single', 
      primaryText: '',
      headline: '',
      description: '',
      cta: 'LEARN_MORE',
      destinationUrl: '',
      automationJustification: '',
      creativeStrategyJustification: ''
    }
  });

  const handleCreate = () => setView('modal');
  const handleSelectObjective = (id) => {
    setFormData({...formData, objective: id});
  };

  const handleContinueFromModal = () => {
    if (formData.objective) {
      setView('editor');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setView('manager');
    }
  };

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
    } catch (err) {
      console.error('Error saving campaign');
    }

    onFinish();
  };

  if (view === 'manager') {
    return (
      <div className="flex flex-col h-screen bg-fb-bg text-fb-text-primary">
        <header className="h-14 bg-white border-b border-fb-border flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-3">
             <button 
               onClick={onBack}
               className="p-2 hover:bg-fb-header rounded-full transition-colors text-fb-text-secondary"
               title="Volver al Dashboard"
             >
               <Home size={20} />
             </button>
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
             <div className="flex items-center gap-2 px-3 py-1 bg-fb-header rounded-full text-xs font-bold text-fb-blue border border-fb-blue/20">
               <div className="w-4 h-4 bg-fb-blue rounded-full text-white flex items-center justify-center text-[10px]">100</div>
               Puntuación de recomendación
               <ChevronDown size={14} />
             </div>
             <div className="flex items-center gap-2">
               <button className="meta-btn-secondary h-8 flex items-center gap-1.5"><RotateCcw size={14} /> Descartar borradores</button>
               <button className="bg-fb-blue text-white px-4 py-1.5 rounded-md font-bold text-[13px] hover:bg-blue-700">Revisar y publicar</button>
             </div>
             <MoreVertical size={20} className="text-fb-text-secondary cursor-pointer" />
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
               <div className="text-xs font-bold text-fb-text-secondary border border-fb-border bg-white px-3 py-1.5 rounded-md flex items-center gap-2">
                 Últimos 30 días: 29 mar. 2026 - 27 abr. 2026
                 <ChevronDown size={14} />
               </div>
            </div>

            <div className="bg-white border-b border-fb-border p-2 flex items-center justify-between shadow-sm">
               <div className="flex items-center gap-2">
                 <button onClick={handleCreate} className="meta-btn-green">
                   <Plus size={16} /> Crear
                 </button>
                 <button className="meta-btn-secondary flex items-center gap-1.5"><Copy size={14} /> Duplicar</button>
                 <button className="meta-btn-secondary flex items-center gap-1.5"><Edit2 size={14} /> Editar</button>
                 <div className="h-6 w-px bg-fb-border mx-1" />
                 <button className="meta-btn-secondary flex items-center gap-1.5"><Trash2 size={14} /></button>
               </div>
               <div className="flex items-center gap-2">
                 <button className="meta-btn-secondary flex items-center gap-1.5"><ColumnsIcon size={14} /> Columnas: Rendimiento <ChevronDown size={14} /></button>
                 <button className="meta-btn-secondary flex items-center gap-1.5"><Filter size={14} /> Desglose <ChevronDown size={14} /></button>
               </div>
            </div>

            <div className="flex-grow overflow-auto bg-white">
              <div className="min-w-[1200px]">
                <div className="flex h-10 bg-fb-header border-b border-fb-border sticky top-0 z-10">
                  <div className="w-12 meta-table-header justify-center"><input type="checkbox" /></div>
                  <div className="w-40 meta-table-header">Act.</div>
                  <div className="w-[350px] meta-table-header border-r border-fb-border">Campaña</div>
                  <div className="w-32 meta-table-header">Entrega</div>
                  <div className="w-32 meta-table-header">Resultados</div>
                  <div className="w-32 meta-table-header">Alcance</div>
                  <div className="w-32 meta-table-header">Impresiones</div>
                  <div className="w-32 meta-table-header">Presupuesto</div>
                </div>

                {savedCampaigns.length > 0 ? (
                  savedCampaigns.map((camp, idx) => (
                    <div key={camp.id} className="flex h-12 border-b border-fb-border hover:bg-fb-header/50 items-center text-[12px]">
                      <div className="w-12 flex justify-center"><input type="checkbox" /></div>
                      <div className="w-40 px-3 flex items-center gap-2">
                         <div className="w-8 h-3 bg-fb-blue/20 rounded-full relative">
                            <div className="absolute left-1 top-0.5 w-2 h-2 bg-fb-blue rounded-full" />
                         </div>
                         <span className="font-bold text-fb-blue">ACTIVA</span>
                      </div>
                      <div className="w-[350px] px-3 font-bold text-fb-blue hover:underline cursor-pointer truncate">
                        {camp.name}
                        {currentUser?.role === 'admin' && (
                          <span className="block text-[10px] text-slate-400 font-normal italic">De: {camp.student_name} (G{camp.group_id})</span>
                        )}
                      </div>
                      <div className="w-32 px-3 text-slate-600">Aprendizaje</div>
                      <div className="w-32 px-3 font-bold">{Math.floor(Math.random() * 100)}</div>
                      <div className="w-32 px-3">{Math.floor(Math.random() * 1000)}</div>
                      <div className="w-32 px-3">{Math.floor(Math.random() * 2000)}</div>
                      <div className="w-32 px-3 font-bold">${camp.data?.adSet?.budget || '2.500'} CLP</div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-80 text-center p-20">
                    <div className="w-16 h-16 bg-fb-header rounded-full flex items-center justify-center mb-4 text-fb-text-secondary">
                      <Search size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Prepárate para publicar anuncios</h3>
                    <p className="text-sm text-fb-text-secondary max-w-md mx-auto mb-6">
                      Confirma unos detalles en Resumen de la cuenta para poder publicar tu primera campaña publicitaria.
                    </p>
                    <button onClick={handleCreate} className="meta-btn-green py-2 px-8">Ir a Resumen de la cuenta</button>
                  </div>
                )}
              </div>
            </div>

            <footer className="h-10 bg-white border-t border-fb-border px-4 flex items-center justify-between text-[11px] font-bold text-fb-text-secondary">
              <div className="flex items-center gap-4">
                <span>{savedCampaigns.length} Campañas</span>
                <span className="text-fb-blue uppercase">Ver configuración</span>
              </div>
              <div className="flex items-center gap-2">
                 <span>Resultados del total de las filas: {savedCampaigns.length}</span>
              </div>
            </footer>
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
                <div 
                  key={obj.id}
                  onClick={() => handleSelectObjective(obj.id)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-start gap-4 ${formData.objective === obj.id ? 'border-fb-blue bg-blue-50/50' : 'border-fb-border hover:bg-fb-header/50'}`}
                >
                  <div className={`p-2 rounded-lg ${formData.objective === obj.id ? 'bg-fb-blue text-white' : 'bg-fb-header text-fb-text-secondary'}`}>
                    {obj.icon}
                  </div>
                  <div>
                    <div className="font-bold text-fb-text-primary">{obj.name}</div>
                    <div className="text-xs text-fb-text-secondary mt-1">{obj.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-1/2 p-12 bg-fb-bg flex flex-col items-center justify-center text-center">
            {formData.objective ? (
              <div className="max-w-md animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-fb-blue rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-200">
                  {metaObjectives.find(o => o.id === formData.objective)?.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{metaObjectives.find(o => o.id === formData.objective)?.name}</h3>
                <p className="text-slate-500 mb-8 italic">"Esta elección define cómo Meta optimizará la entrega de tus anuncios para alcanzar los KPI de tu estrategia Inbound."</p>
                
                <div className="text-left bg-white p-6 rounded-2xl border border-fb-border shadow-sm mb-8">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Justificación (Obligatoria)</label>
                  <textarea 
                    className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-fb-blue transition-all"
                    placeholder="Explica la razón estratégica detrás de este objetivo..."
                    value={formData.objectiveJustification}
                    onChange={(e) => setFormData({...formData, objectiveJustification: e.target.value})}
                  />
                </div>

                <button 
                  onClick={handleContinueFromModal}
                  disabled={!formData.objectiveJustification}
                  className={`w-full py-4 bg-fb-blue text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-blue-700 transition-all ${!formData.objectiveJustification && 'opacity-50 grayscale'}`}
                >
                  Continuar <ChevronRight size={20} />
                </button>
              </div>
            ) : (
              <div className="max-w-xs">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4 border-4 border-dashed border-slate-200">
                   ?
                </div>
                <h3 className="text-lg font-bold text-slate-400">Selecciona un objetivo para ver los detalles</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'editor') {
    return (
      <div className="flex flex-col h-screen bg-fb-editor-bg">
        <header className="h-14 bg-white border-b border-fb-border flex items-center justify-between px-4 z-30 shadow-sm">
           <div className="flex items-center gap-3">
              <button onClick={handlePrev} className="p-2 hover:bg-fb-header rounded-full transition-colors"><ChevronRight size={20} className="rotate-180" /></button>
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-fb-text-secondary uppercase">Cerrar editor</span>
                 <span className="text-sm font-bold truncate max-w-[250px]">{formData.campaignName}</span>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex bg-fb-header rounded-md p-1 border border-fb-border">
                 <button 
                   onClick={() => setCurrentStep(1)} 
                   className={`px-4 py-1.5 text-xs font-bold rounded transition-all ${currentStep === 1 ? 'bg-white shadow-sm text-fb-blue' : 'text-fb-text-secondary hover:bg-white/50'}`}
                 >
                   1. Campaña
                 </button>
                 <button 
                   onClick={() => setCurrentStep(2)} 
                   className={`px-4 py-1.5 text-xs font-bold rounded transition-all ${currentStep === 2 ? 'bg-white shadow-sm text-fb-blue' : 'text-fb-text-secondary hover:bg-white/50'}`}
                 >
                   2. Conjunto
                 </button>
                 <button 
                   onClick={() => setCurrentStep(3)} 
                   className={`px-4 py-1.5 text-xs font-bold rounded transition-all ${currentStep === 3 ? 'bg-white shadow-sm text-fb-blue' : 'text-fb-text-secondary hover:bg-white/50'}`}
                 >
                   3. Anuncio
                 </button>
              </div>
              <button onClick={handleFinish} className="bg-fb-blue text-white px-6 py-2 rounded-md font-bold text-sm hover:bg-blue-700 shadow-md">
                 Finalizar y Guardar
              </button>
           </div>
        </header>

        <div className="flex flex-grow overflow-hidden relative">
          <aside className="w-[300px] bg-white border-r border-fb-border flex flex-col p-4 z-20">
             <div className="mb-6">
                <div className="text-[11px] font-black text-fb-text-secondary uppercase tracking-widest mb-4">Jerarquía de Campaña</div>
                <div className="space-y-1">
                   <div onClick={() => setCurrentStep(1)} className={`meta-step-item ${currentStep === 1 ? 'bg-blue-50 text-fb-blue border-l-4 border-fb-blue' : 'text-fb-text-primary hover:bg-fb-header'}`}>
                      <div className="p-1.5 bg-fb-blue text-white rounded-md"><BarChart3 size={14} /></div>
                      <span className="font-bold text-xs truncate">{formData.campaignName}</span>
                   </div>
                   <div onClick={() => setCurrentStep(2)} className={`meta-step-item ml-4 ${currentStep === 2 ? 'bg-blue-50 text-fb-blue border-l-4 border-fb-blue' : 'text-fb-text-primary hover:bg-fb-header'}`}>
                      <div className="p-1.5 bg-slate-200 text-slate-600 rounded-md"><Users size={14} /></div>
                      <span className="font-bold text-xs truncate">{formData.adSet.name}</span>
                   </div>
                   <div onClick={() => setCurrentStep(3)} className={`meta-step-item ml-8 ${currentStep === 3 ? 'bg-blue-50 text-fb-blue border-l-4 border-fb-blue' : 'text-fb-text-primary hover:bg-fb-header'}`}>
                      <div className="p-1.5 bg-slate-200 text-slate-600 rounded-md"><ImageIcon size={14} /></div>
                      <span className="font-bold text-xs truncate">{formData.ad.name}</span>
                   </div>
                </div>
             </div>
          </aside>

          <main className="flex-grow overflow-y-auto bg-fb-editor-bg custom-scrollbar relative">
             <div className="max-w-[850px] mx-auto py-10 px-6 space-y-8 pb-32">
                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title">Detalles de la campaña</div>
                       <div className="p-6 space-y-6">
                          <div>
                             <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Nombre de la campaña</label>
                             <input 
                               type="text" 
                               className="meta-editor-input" 
                               value={formData.campaignName} 
                               onChange={(e) => setFormData({...formData, campaignName: e.target.value})} 
                             />
                          </div>
                          
                          <div>
                             <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Categorías de anuncios especiales</label>
                             <select className="meta-editor-input" value={formData.specialCategories} onChange={(e) => setFormData({...formData, specialCategories: e.target.value})}>
                               <option value="NONE">Ninguna categoría seleccionada</option>
                               <option value="CREDIT">Crédito</option>
                               <option value="EMPLOYMENT">Empleo</option>
                               <option value="HOUSING">Vivienda</option>
                               <option value="ISSUES">Temas sociales, elecciones o política</option>
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title flex justify-between items-center">
                          Objetivo de la campaña
                          <span className="text-fb-blue text-xs font-bold cursor-pointer hover:underline" onClick={() => setView('modal')}>Editar</span>
                       </div>
                       <div className="p-6">
                          <div className="flex items-center gap-4 p-4 bg-fb-header rounded-lg border border-fb-border">
                             <div className="p-3 bg-fb-blue text-white rounded-xl shadow-md">
                               {metaObjectives.find(o => o.id === formData.objective)?.icon}
                             </div>
                             <div>
                               <div className="font-bold text-sm">{metaObjectives.find(o => o.id === formData.objective)?.name}</div>
                               <div className="text-[11px] text-fb-text-secondary">Seleccionado para esta estrategia.</div>
                             </div>
                          </div>
                          
                          <div className="justification-box">
                            <span className="justification-title">Justificación</span>
                            <textarea 
                              className="justification-input"
                              value={formData.objectiveJustification}
                              onChange={(e) => setFormData({...formData, objectiveJustification: e.target.value})}
                            />
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title">Nombre del conjunto de anuncios</div>
                       <div className="p-6">
                          <input 
                            type="text" 
                            className="meta-editor-input" 
                            value={formData.adSet.name} 
                            onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, name: e.target.value}})} 
                          />
                       </div>
                    </div>

                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title">Presupuesto y calendario</div>
                       <div className="p-6 space-y-6">
                          <div className="flex gap-4">
                             <div className="w-1/3">
                                <label className="text-[10px] text-fb-text-secondary mb-1 block uppercase">Tipo de presupuesto</label>
                                <select className="meta-editor-input" value={formData.adSet.budgetType} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, budgetType: e.target.value}})}>
                                   <option value="daily">Presupuesto diario</option>
                                   <option value="lifetime">Presupuesto total</option>
                                </select>
                             </div>
                             <div className="flex-grow">
                                <label className="text-[10px] text-fb-text-secondary mb-1 block uppercase">Importe</label>
                                <div className="relative">
                                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-fb-text-secondary">$</span>
                                   <input type="text" className="meta-editor-input pl-6 font-bold" value={formData.adSet.budget} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, budget: e.target.value}})} />
                                   <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-fb-text-secondary">CLP</span>
                                </div>
                             </div>
                          </div>

                          <div className="flex gap-2">
                             <div className="flex-grow">
                                <label className="text-[10px] text-fb-text-secondary mb-1 block uppercase">Fecha de inicio</label>
                                <input type="date" className="meta-editor-input" value={formData.adSet.startDate} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, startDate: e.target.value}})} />
                             </div>
                             <div className="w-32">
                                <label className="text-[10px] text-fb-text-secondary mb-1 block uppercase">Hora</label>
                                <input type="time" className="meta-editor-input" value={formData.adSet.startTime} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, startTime: e.target.value}})} />
                             </div>
                          </div>

                          <div className="flex items-center gap-2">
                             <input type="checkbox" id="end-date-toggle" checked={formData.adSet.endDateEnabled} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, endDateEnabled: e.target.checked}})} />
                             <label htmlFor="end-date-toggle" className="text-xs font-bold text-fb-text-secondary cursor-pointer">Establecer una fecha de finalización</label>
                          </div>

                          {formData.adSet.endDateEnabled && (
                            <div className="flex gap-2 animate-in fade-in duration-300">
                              <div className="flex-grow">
                                <label className="text-[10px] text-fb-text-secondary mb-1 block uppercase">Fecha de finalización</label>
                                <input type="date" className="meta-editor-input" value={formData.adSet.endDate} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, endDate: e.target.value}})} />
                              </div>
                              <div className="w-32">
                                <label className="text-[10px] text-fb-text-secondary mb-1 block uppercase">Hora</label>
                                <input type="time" className="meta-editor-input" value={formData.adSet.endTime} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, endTime: e.target.value}})} />
                              </div>
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title flex items-center gap-2">
                         <Check size={16} className="text-fb-green" /> Controles de audiencia
                       </div>
                       <div className="p-6 space-y-6">
                         <div>
                           <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Lugar</label>
                           <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-2 p-2 border border-fb-border rounded-md bg-white shadow-inner">
                                <Globe size={18} className="text-fb-blue" />
                                <input 
                                  type="text" 
                                  className="flex-grow bg-transparent border-none outline-none text-sm font-bold"
                                  placeholder="Escribe un país, región o ciudad..."
                                  value={formData.adSet.location}
                                  onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, location: e.target.value}})}
                                />
                                <div className="flex items-center gap-1 bg-fb-header px-2 py-1 rounded text-[10px] font-bold text-slate-600 border border-fb-border">
                                   +<input 
                                    type="number" 
                                    className="w-8 bg-transparent outline-none text-center" 
                                    value={formData.adSet.locationRadius}
                                    onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, locationRadius: e.target.value}})}
                                   /> KM
                                </div>
                              </div>
                           </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Edad mínima</label>
                               <select 
                                 className="meta-editor-input font-bold"
                                 value={formData.adSet.ageMin}
                                 onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, ageMin: e.target.value}})}
                               >
                                 {ageOptions.map(age => <option key={age} value={age}>{age}</option>)}
                               </select>
                            </div>
                         </div>

                         <div className="p-4 bg-blue-50/50 rounded-lg border border-fb-blue/20">
                           <div className="flex items-center justify-between mb-2">
                              <div className="font-bold text-[13px] text-fb-text-primary">Público Advantage+</div>
                              <div className="px-2 py-0.5 bg-blue-100 text-fb-blue rounded text-[10px] font-bold uppercase">Recomendado</div>
                           </div>
                           <p className="text-xs text-fb-text-secondary mb-4 leading-tight">Nuestra tecnología de anuncios busca automáticamente a tu público. Si añades una sugerencia de público, le daremos prioridad.</p>
                           
                           <button 
                             onClick={() => setShowAudienceSuggestions(!showAudienceSuggestions)}
                             className="meta-btn-secondary w-full justify-center flex items-center gap-2"
                           >
                             {showAudienceSuggestions ? 'Ocultar sugerencia de público' : 'Sugerencia de público (opcional)'} 
                             <ChevronDown size={14} className={showAudienceSuggestions ? 'rotate-180' : ''} />
                           </button>

                           {showAudienceSuggestions && (
                             <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="pt-4 border-t border-fb-blue/10">
                                  <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Rango de Edad</label>
                                  <div className="flex items-center gap-4">
                                    <select 
                                      className="meta-editor-input flex-grow font-bold"
                                      value={formData.adSet.ageMin}
                                      onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, ageMin: e.target.value}})}
                                    >
                                      {ageOptions.map(age => <option key={age} value={age}>{age}</option>)}
                                    </select>
                                    <span className="text-fb-text-secondary font-bold">a</span>
                                    <select 
                                      className="meta-editor-input flex-grow font-bold"
                                      value={formData.adSet.ageMax}
                                      onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, ageMax: e.target.value}})}
                                    >
                                      {ageOptions.map(age => <option key={age} value={age}>{age}</option>)}
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Sexo</label>
                                  <div className="flex gap-4">
                                    {['Todos', 'Hombres', 'Mujeres'].map(s => (
                                      <label key={s} className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="gender" checked={formData.adSet.gender === (s === 'Todos' ? 'all' : s.toLowerCase())} onChange={() => setFormData({...formData, adSet: {...formData.adSet, gender: s === 'Todos' ? 'all' : s.toLowerCase()}})} />
                                        <span className="text-sm">{s}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider flex justify-between items-center">
                                    Segmentación detallada
                                    <span className="text-fb-blue text-[10px] lowercase font-bold cursor-pointer hover:underline">Explorar</span>
                                  </label>
                                 <textarea 
                                    className="meta-editor-input h-24 pt-3" 
                                    placeholder="Intereses, comportamientos o datos demográficos..." 
                                    value={formData.adSet.detailedTargeting} 
                                    onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, detailedTargeting: e.target.value}})} 
                                  />
                                </div>

                                <div>
                                  <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Idiomas</label>
                                  <div className="p-3 border border-fb-border rounded-sm bg-fb-header/30 text-xs font-bold text-fb-text-secondary">Todos los idiomas</div>
                                </div>
                             </div>
                           )}
                         </div>

                         <div className="meta-editor-card !mx-0 !shadow-none !border-x-0 !border-b-0 pt-6">
                            <div className="meta-editor-section-title !p-0 mb-4">Optimización y entrega</div>
                            <div className="space-y-4">
                               <div>
                                  <label className="text-xs font-bold text-fb-text-secondary uppercase mb-1 block tracking-wider">Objetivo de rendimiento</label>
                                  <select className="meta-editor-input font-bold">
                                     <option>Maximizar el número de clics en el enlace</option>
                                     <option>Maximizar el alcance único diario</option>
                                     <option>Maximizar el número de impresiones</option>
                                     <option>Maximizar la conversión</option>
                                  </select>
                               </div>
                               <div className="p-4 bg-fb-header rounded-lg border border-fb-border border-dashed">
                                  <p className="text-[11px] text-fb-text-secondary leading-tight italic">
                                    "La optimización que elijas aquí determinará qué tipo de personas dentro de tu segmentación verán el anuncio con más frecuencia."
                                  </p>
                               </div>
                            </div>
                         </div>

                         <div className="justification-box">
                           <span className="justification-title">Justificación</span>
                           <textarea 
                             className="justification-input"
                             value={formData.adSet.adSetJustification}
                             onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, adSetJustification: e.target.value}})}
                           />
                         </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title">Identidad</div>
                       <div className="p-6">
                          <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Página de Facebook</label>
                          <div className="p-3 border border-fb-border rounded-sm bg-fb-header/30 flex items-center justify-between opacity-80">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-fb-blue rounded-full flex items-center justify-center text-white font-bold">f</div>
                               <span className="text-sm font-bold text-fb-text-secondary">{projectData.agencyName || 'Página seleccionada'}</span>
                             </div>
                             <ChevronDown size={16} className="text-fb-text-secondary" />
                          </div>
                       </div>
                    </div>

                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title">Contenido del anuncio</div>
                       <div className="p-6 space-y-6">
                          <div>
                            <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider flex justify-between">
                               Texto principal
                               <span className={formData.ad.primaryText.length > 125 ? 'text-fb-green' : 'text-fb-text-secondary'}>
                                 {formData.ad.primaryText.length} / 125*
                               </span>
                            </label>
                            <textarea 
                              className="meta-editor-input h-32 pt-3" 
                              value={formData.ad.primaryText} 
                              onChange={(e) => setFormData({...formData, ad: {...formData.ad, primaryText: e.target.value}})} 
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                             <div>
                               <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Título</label>
                               <input 
                                 type="text" 
                                 className="meta-editor-input font-bold" 
                                 value={formData.ad.headline} 
                                 onChange={(e) => setFormData({...formData, ad: {...formData.ad, headline: e.target.value}})} 
                               />
                             </div>
                             <div>
                               <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Llamada a la acción</label>
                               <select className="meta-editor-input" value={formData.ad.cta} onChange={(e) => setFormData({...formData, ad: {...formData.ad, cta: e.target.value}})}>
                                 <option value="LEARN_MORE">Más información</option>
                                 <option value="SUBSCRIBE">Suscribirte</option>
                                 <option value="SEND_MESSAGE">Enviar mensaje</option>
                               </select>
                             </div>
                          </div>

                          <div className="justification-box">
                           <span className="justification-title">Justificación</span>
                           <textarea 
                             className="justification-input"
                             value={formData.ad.creativeStrategyJustification}
                             onChange={(e) => setFormData({...formData, ad: {...formData.ad, creativeStrategyJustification: e.target.value}})}
                           />
                         </div>
                       </div>
                    </div>
                  </motion.div>
                )}
             </div>
          </main>

          {/* Sidebar de Vista Previa */}
          <aside className="w-[450px] bg-white border-l border-fb-border overflow-y-auto hidden xl:block p-6">
             <div className="sticky top-0 space-y-6">
                <div className="flex items-center justify-between border-b border-fb-border pb-4">
                   <h4 className="text-xs font-black text-fb-text-secondary uppercase tracking-widest">Vista previa del anuncio</h4>
                   <Maximize2 size={16} className="text-fb-text-secondary" />
                </div>
                
                <div className="bg-fb-header/20 border border-fb-border rounded-xl overflow-hidden shadow-2xl">
                   <div className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-fb-blue rounded-full border border-fb-border flex items-center justify-center text-white font-bold">
                         {projectData.agencyName?.[0] || 'A'}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[13px] font-bold leading-tight">{projectData.agencyName || 'Página de la Marca'}</span>
                         <span className="text-[11px] text-fb-text-secondary leading-tight">Publicidad · {formData.adSet.location}</span>
                      </div>
                   </div>
                   
                   <div className="p-4 pt-0 text-[13px] leading-snug whitespace-pre-wrap min-h-[3em]">
                      {formData.ad.primaryText || 'El texto principal aparecerá aquí...'}
                   </div>

                   <div className="aspect-square bg-fb-bg flex items-center justify-center border-y border-fb-border">
                      <ImageIcon size={64} className="opacity-10" />
                   </div>

                   <div className="p-4 flex items-center justify-between">
                      <div className="flex-grow pr-4 truncate">
                         <div className="text-[10px] text-fb-text-secondary uppercase truncate">SITIO.COM</div>
                         <div className="text-[15px] font-bold truncate text-fb-text-primary">{formData.ad.headline || 'Título del anuncio'}</div>
                      </div>
                      <button className="bg-[#e4e6eb] px-5 py-2 rounded-md text-[13px] font-bold flex-shrink-0">
                         {formData.ad.cta === 'LEARN_MORE' ? 'Más información' : 'Llamada a la acción'}
                      </button>
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
