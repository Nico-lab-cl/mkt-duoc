import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Copy, 
  Edit2, 
  Trash2, 
  Search, 
  ChevronDown, 
  MoreHorizontal, 
  X,
  Eye,
  MousePointer2,
  MessageSquare,
  UserPlus,
  Smartphone,
  ShoppingBag,
  Info,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Layout,
  Users,
  Image as ImageIcon,
  MoreVertical,
  RotateCcw,
  Download,
  Filter,
  BarChart3,
  Columns as ColumnsIcon,
  Monitor
} from 'lucide-react';

const metaObjectives = [
  { id: 'awareness', name: 'Reconocimiento', icon: <Eye size={18} />, desc: 'Muestra tus anuncios a las personas que tienen más probabilidades de recordarlos.' },
  { id: 'traffic', name: 'Tráfico', icon: <MousePointer2 size={18} />, desc: 'Dirige a las personas a un destino, como tu sitio web, app o evento de Facebook.' },
  { id: 'engagement', name: 'Interacción', icon: <MessageSquare size={18} />, desc: 'Consigue más mensajes, reproducciones de video, interacción con tus publicaciones, me gusta de la página o respuestas a eventos.' },
  { id: 'leads', name: 'Clientes Potenciales', icon: <UserPlus size={18} />, desc: 'Genera clientes potenciales para tu empresa o marca.' },
  { id: 'app_promotion', name: 'Promoción de la App', icon: <Smartphone size={18} />, desc: 'Busca personas que instalen tu app y sigan usándola.' },
  { id: 'sales', name: 'Ventas', icon: <ShoppingBag size={18} />, desc: 'Busca personas que tengan probabilidades de comprar tu producto o servicio.' },
];

const Simulator = ({ platform, onFinish, onBack }) => {
  const { projectData, updateProjectData } = useProject();
  const [view, setView] = useState('manager'); // 'manager' | 'modal' | 'editor'
  const [activeTab, setActiveTab] = useState('campaigns'); // 'campaigns' | 'adsets' | 'ads'
  const [currentStep, setCurrentStep] = useState(1); // 1: Campaña, 2: Ad Set, 3: Ad
  const [showAudienceSuggestions, setShowAudienceSuggestions] = useState(false);
  
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
      format: 'single', // 'single' | 'carousel' | 'collection'
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

  const handleFinish = () => {
    updateProjectData({ platform, ...formData });
    onFinish();
  };

  if (view === 'manager') {
    return (
      <div className="flex flex-col h-screen bg-fb-bg text-fb-text-primary">
        {/* Top Header (Facebook Breadcrumb Style) */}
        <header className="h-14 bg-white border-b border-fb-border flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-fb-blue rounded-full flex items-center justify-center text-white font-bold">f</div>
             <div className="h-8 w-px bg-fb-border mx-2" />
             <div className="flex flex-col">
               <span className="text-[10px] font-bold text-fb-text-secondary uppercase leading-none">Administrador de anuncios</span>
               <div className="flex items-center gap-1">
                 <span className="text-sm font-bold truncate max-w-[200px]">{projectData.agencyName} (ID: 57704623)</span>
                 <ChevronDown size={14} className="text-fb-text-secondary" />
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

        {/* Main Manager Area */}
        <div className="flex flex-grow overflow-hidden">
          {/* Left Icon Sidebar (The thin one) */}
          <aside className="w-12 bg-fb-sidebar flex flex-col items-center py-4 gap-6 z-10">
            <Layout size={20} className="text-white opacity-40 hover:opacity-100 cursor-pointer" />
            <Users size={20} className="text-white cursor-pointer border-l-2 border-fb-blue pl-1" />
            <ImageIcon size={20} className="text-white opacity-40 hover:opacity-100 cursor-pointer" />
            <div className="flex-grow" />
            <BarChart3 size={20} className="text-white opacity-40 hover:opacity-100 cursor-pointer" />
          </aside>

          {/* Table Content Area */}
          <main className="flex-grow flex flex-col overflow-hidden">
            {/* Tabs Bar */}
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

            {/* Action Buttons Bar */}
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

            {/* Table Header (Mimicking real columns) */}
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

                {/* Empty State / Row Mockup */}
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
              </div>
            </div>

            {/* Bottom Status Bar */}
            <footer className="h-10 bg-white border-t border-fb-border px-4 flex items-center justify-between text-[11px] font-bold text-fb-text-secondary">
              <div className="flex items-center gap-4">
                <span>0 Campañas seleccionadas</span>
                <span className="text-fb-blue uppercase">Ver configuración</span>
              </div>
              <div className="flex items-center gap-2">
                 <span>Resultados del total de las filas: 0</span>
              </div>
            </footer>
          </main>
        </div>
      </div>
    );
  }

  if (view === 'modal') {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white w-[800px] rounded-lg shadow-2xl overflow-hidden"
        >
          <div className="p-4 border-b border-fb-border flex items-center justify-between">
            <h2 className="text-lg font-bold">Crear una campaña nueva</h2>
            <X size={20} className="cursor-pointer text-fb-text-secondary" onClick={() => setView('manager')} />
          </div>

          <div className="p-8">
            <h3 className="text-sm font-bold text-fb-text-primary mb-2">Elige un objetivo de la campaña</h3>
            <p className="text-xs text-fb-text-secondary mb-6">El objetivo de la campaña es el resultado que quieres obtener de tus anuncios.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metaObjectives.map((obj) => (
                <div 
                  key={obj.id}
                  onClick={() => handleSelectObjective(obj.id)}
                  className={`p-4 border-2 rounded-xl flex items-start gap-4 cursor-pointer transition-all ${
                    formData.objective === obj.id 
                      ? 'border-fb-blue bg-blue-50/50' 
                      : 'border-fb-border hover:border-fb-blue'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    formData.objective === obj.id ? 'bg-fb-blue text-white' : 'bg-fb-header text-fb-text-secondary'
                  }`}>
                    {obj.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{obj.name}</h4>
                    <p className="text-[11px] text-fb-text-secondary mt-1 leading-tight">{obj.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-fb-header border-t border-fb-border flex justify-end gap-2">
             <button onClick={() => setView('manager')} className="meta-btn-secondary px-6">Cancelar</button>
             <button 
               onClick={handleContinueFromModal}
               disabled={!formData.objective} 
               className={`px-10 py-1.5 rounded-md font-bold text-[13px] transition-all ${
                 formData.objective 
                   ? 'bg-fb-green text-white hover:bg-[#008a00]' 
                   : 'bg-fb-header text-fb-text-secondary border border-fb-border cursor-not-allowed opacity-50'
               }`}
             >
               Continuar
             </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (view === 'editor') {
    return (
      <div className="flex h-screen bg-fb-bg text-fb-text-primary overflow-hidden">
        {/* Left Tree Sidebar (Real Meta Editor Style) */}
        <aside className="w-[300px] bg-white border-r border-fb-border flex flex-col">
          <header className="h-14 border-b border-fb-border flex items-center justify-between px-4 bg-white">
            <h3 className="font-bold text-sm">Editar campaña</h3>
            <div className="flex gap-2">
              <RotateCcw size={14} className="text-fb-text-secondary cursor-pointer" />
              <X size={16} className="text-fb-text-secondary cursor-pointer" onClick={() => setView('manager')} />
            </div>
          </header>

          <nav className="flex-grow p-4 space-y-4">
            {/* Level 1: Campaign */}
            <div 
              onClick={() => setCurrentStep(1)}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${currentStep === 1 ? 'bg-blue-50' : 'hover:bg-fb-header'}`}
            >
              <div className={`mt-1 w-6 h-6 rounded flex items-center justify-center ${currentStep === 1 ? 'bg-fb-blue text-white' : 'bg-fb-header text-fb-text-secondary'}`}>
                <Layout size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold truncate max-w-[200px]">{formData.campaignName}</span>
                <span className="text-[10px] text-fb-text-secondary uppercase font-bold tracking-tight">Campaña</span>
              </div>
            </div>

            {/* Level 2: Ad Set */}
            <div className="space-y-1">
              <div 
                onClick={() => setCurrentStep(2)}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer ml-6 transition-all ${currentStep === 2 ? 'bg-blue-50' : 'hover:bg-fb-header'}`}
              >
                <div className={`mt-1 w-6 h-6 rounded flex items-center justify-center ${currentStep === 2 ? 'bg-fb-blue text-white' : 'bg-fb-header text-fb-text-secondary'}`}>
                  <Users size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold truncate max-w-[180px]">{formData.adSet.name}</span>
                  <span className="text-[10px] text-fb-text-secondary uppercase font-bold tracking-tight">Conjunto de anuncios</span>
                </div>
              </div>
              
              {currentStep === 2 && (
                <div className="ml-16 space-y-2 border-l border-fb-border pl-4 py-2 animate-in slide-in-from-left duration-300">
                  <div className="text-[12px] text-fb-text-secondary hover:text-fb-blue cursor-pointer transition-colors">Presupuesto y programación</div>
                  <div className="text-[12px] text-fb-text-secondary hover:text-fb-blue cursor-pointer transition-colors">Audiencia</div>
                  <div className="text-[12px] text-fb-text-secondary hover:text-fb-blue cursor-pointer transition-colors">Ubicaciones</div>
                </div>
              )}
            </div>

            {/* Level 3: Ad */}
            <div className="space-y-1">
              <div 
                onClick={() => setCurrentStep(3)}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer ml-12 transition-all ${currentStep === 3 ? 'bg-blue-50' : 'hover:bg-fb-header'}`}
              >
                <div className={`mt-1 w-6 h-6 rounded flex items-center justify-center ${currentStep === 3 ? 'bg-fb-blue text-white' : 'bg-fb-header text-fb-text-secondary'}`}>
                  <ImageIcon size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold truncate max-w-[150px]">{formData.ad.name}</span>
                  <span className="text-[10px] text-fb-text-secondary uppercase font-bold tracking-tight">Anuncio</span>
                </div>
              </div>

              {currentStep === 3 && (
                <div className="ml-24 space-y-2 border-l border-fb-border pl-4 py-2 animate-in slide-in-from-left duration-300">
                  <div className="text-[12px] text-fb-text-secondary hover:text-fb-blue cursor-pointer transition-colors">Identidad</div>
                  <div className="text-[12px] text-fb-text-secondary hover:text-fb-blue cursor-pointer transition-colors">Configuración del anuncio</div>
                  <div className="text-[12px] text-fb-text-secondary hover:text-fb-blue cursor-pointer transition-colors">Contenido del anuncio</div>
                  <div className="text-[12px] text-fb-text-secondary hover:text-fb-blue cursor-pointer transition-colors">Seguimiento</div>
                </div>
              )}
            </div>
          </nav>

          <footer className="p-4 border-t border-fb-border bg-fb-header/50">
             <button onClick={handleFinish} className="w-full meta-btn-green justify-center py-2">
               Publicar borrador
             </button>
          </footer>
        </aside>

        {/* Editor Main Content Area */}
        <div className="flex-grow flex flex-col overflow-hidden">
          <header className="h-14 bg-white border-b border-fb-border flex items-center justify-between px-6 z-10 shadow-sm">
             <div className="flex items-center gap-3">
               <span className="text-[13px] text-fb-text-secondary flex items-center gap-2">
                 <span className="hover:underline cursor-pointer">{formData.campaignName}</span>
                 <ChevronRight size={14} />
                 <span className="hover:underline cursor-pointer font-bold text-fb-text-primary">{formData.adSet.name}</span>
                 <ChevronRight size={14} />
                 <span className="hover:underline cursor-pointer">1 anuncio</span>
               </span>
               <div className="h-4 w-px bg-fb-border mx-2" />
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-fb-blue rounded-full" />
                 <span className="text-[11px] font-bold text-fb-blue uppercase tracking-widest">En borrador</span>
               </div>
             </div>
             <div className="flex items-center gap-4">
               <button onClick={handlePrev} className="text-sm font-bold text-fb-text-secondary hover:text-fb-text-primary flex items-center gap-1">
                 <ChevronLeft size={16} /> Anterior
               </button>
               <button 
                onClick={currentStep < 3 ? () => setCurrentStep(currentStep + 1) : handleFinish}
                className="meta-btn-green px-8"
               >
                 {currentStep === 3 ? 'Finalizar' : 'Siguiente'}
                 {currentStep < 3 && <ChevronRight size={16} />}
               </button>
             </div>
          </header>

          <main className="flex-grow overflow-hidden bg-fb-bg flex">
            {/* Left Column: Editor Sections */}
            <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-3xl mx-auto pb-20">
                
                {/* CAMPAIGN STEP */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="meta-editor-card">
                      <div className="meta-editor-section-title">Nombre de la campaña</div>
                      <div className="p-6">
                         <input 
                          type="text" 
                          className="meta-editor-input font-bold" 
                          value={formData.campaignName} 
                          onChange={(e) => setFormData({...formData, campaignName: e.target.value})}
                         />
                      </div>
                    </div>

                    <div className="meta-editor-card">
                      <div className="meta-editor-section-title">Categorías especiales de anuncios</div>
                      <div className="p-6">
                        <p className="text-xs text-fb-text-secondary mb-4">Indica si tus anuncios están relacionados con temas sociales, elecciones o política, crédito, empleo o vivienda. <span className="text-fb-blue cursor-pointer hover:underline">Más información</span></p>
                        <select 
                          className="meta-editor-input"
                          value={formData.specialCategories}
                          onChange={(e) => setFormData({...formData, specialCategories: e.target.value})}
                        >
                          <option value="NONE">Ninguna categoría seleccionada</option>
                          <option value="CREDIT">Crédito</option>
                          <option value="EMPLOYMENT">Empleo</option>
                          <option value="HOUSING">Vivienda</option>
                          <option value="ISSUES_ELECTIONS_POLITICS">Temas sociales, elecciones o política</option>
                        </select>
                      </div>
                    </div>

                    <div className="meta-editor-card">
                      <div className="meta-editor-section-title flex justify-between items-center">
                        Detalles de la campaña
                        <span className="text-fb-blue text-xs font-bold cursor-pointer hover:underline">Editar</span>
                      </div>
                      <div className="p-6 space-y-4">
                         <div className="flex justify-between border-b border-fb-border pb-4">
                           <label className="text-xs font-bold text-fb-text-secondary uppercase tracking-wider">Tipo de compra</label>
                           <div className="text-sm font-bold">Subasta</div>
                         </div>
                         <div className="pt-2">
                           <label className="text-xs font-bold text-fb-text-secondary uppercase mb-3 block tracking-wider">Objetivo de la campaña</label>
                           <div className="p-4 bg-fb-header rounded-md border border-fb-border flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-fb-blue text-white rounded-full flex items-center justify-center shadow-inner">
                                  {metaObjectives.find(o => o.id === formData.objective)?.icon}
                                </div>
                                <div>
                                  <div className="font-bold text-sm">{metaObjectives.find(o => o.id === formData.objective)?.name}</div>
                                  <div className="text-[11px] text-fb-text-secondary">Bueno para: Alcance, Notoriedad de marca, Reproducciones de video.</div>
                                </div>
                              </div>
                              <span className="text-fb-blue text-xs font-bold cursor-pointer hover:underline" onClick={() => setView('modal')}>Editar</span>
                           </div>
                         </div>
                         
                         <div className="justification-box">
                           <span className="justification-title">Justificación Estratégica (Pedagógico)</span>
                           <textarea 
                             className="justification-input"
                             placeholder="Explica por qué elegiste este objetivo basándote en tu estrategia inbound..."
                             value={formData.objectiveJustification}
                             onChange={(e) => setFormData({...formData, objectiveJustification: e.target.value})}
                           />
                         </div>
                      </div>
                    </div>

                    <div className="meta-editor-card">
                      <div className="p-6 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm flex items-center gap-1.5">
                            Presupuesto de la campaña Advantage+
                            <Info size={14} className="text-fb-text-secondary" />
                          </div>
                          <div className="text-xs text-fb-text-secondary mt-1 max-w-[500px]">El presupuesto de la campaña Advantage+ distribuirá tu presupuesto entre los conjuntos de anuncios para obtener más resultados.</div>
                        </div>
                        <div 
                          onClick={() => setFormData({...formData, advantageBudget: !formData.advantageBudget})}
                          className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.advantageBudget ? 'bg-fb-blue' : 'bg-[#ced0d4]'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${formData.advantageBudget ? 'right-1' : 'left-1'}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AD SET STEP */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="meta-editor-card">
                      <div className="meta-editor-section-title">Nombre del conjunto de anuncios</div>
                      <div className="p-6">
                         <input 
                          type="text" 
                          className="meta-editor-input font-bold" 
                          value={formData.adSet.name} 
                          onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, name: e.target.value}})}
                         />
                      </div>
                    </div>

                    <div className="meta-editor-card">
                      <div className="meta-editor-section-title">Conversión</div>
                      <div className="p-6">
                         <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Meta de rendimiento</label>
                         <select 
                          className="meta-editor-input" 
                          value={formData.adSet.performanceGoal}
                          onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, performanceGoal: e.target.value}})}
                         >
                           <option value="REACH">Maximizar el alcance de los anuncios</option>
                           <option value="IMPRESSIONS">Maximizar el número de impresiones</option>
                           <option value="BRAND_AWARENESS">Maximizar el recuerdo del anuncio</option>
                           <option value="VIDEO_VIEWS">Maximizar las reproducciones de video ThruPlay</option>
                         </select>
                         <p className="text-[11px] text-fb-text-secondary mt-2">Trataremos de mostrar tus anuncios a las personas para ayudarte a obtener el mayor alcance al menor costo.</p>
                      </div>
                    </div>

                    <div className="meta-editor-card">
                      <div className="meta-editor-section-title flex items-center gap-2">
                        <Check size={16} className="text-fb-green" /> Presupuesto y programación
                      </div>
                      <div className="p-6 space-y-6">
                         <div>
                           <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Presupuesto</label>
                           <div className="flex gap-2 items-center">
                             <select className="meta-editor-input w-48">
                               <option>Presupuesto diario</option>
                               <option>Presupuesto total</option>
                             </select>
                             <div className="relative flex-grow">
                               <span className="absolute left-3 top-2 text-sm text-fb-text-secondary font-bold">$</span>
                               <input type="text" className="meta-editor-input pl-6 font-bold" value={formData.adSet.budget} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, budget: e.target.value}})} />
                               <span className="absolute right-3 top-2 text-xs text-fb-text-secondary font-bold">CLP</span>
                             </div>
                           </div>
                           <p className="text-[11px] text-fb-text-secondary mt-2">Estás usando el presupuesto del conjunto de anuncios e intentaremos gastar una media de ${formData.adSet.budget}.</p>
                         </div>

                         <div>
                           <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Programación</label>
                           <div className="flex gap-2">
                             <div className="flex-grow">
                               <label className="text-[10px] text-fb-text-secondary mb-1 block uppercase">Fecha de inicio</label>
                               <input type="date" className="meta-editor-input" value={formData.adSet.startDate} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, startDate: e.target.value}})} />
                             </div>
                             <div className="w-32">
                               <label className="text-[10px] text-fb-text-secondary mb-1 block uppercase">Hora</label>
                               <input type="time" className="meta-editor-input" value={formData.adSet.startTime} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, startTime: e.target.value}})} />
                             </div>
                             <div className="flex items-end pb-2">
                               <span className="text-[10px] text-fb-text-secondary font-bold uppercase ml-2">PDT</span>
                             </div>
                           </div>
                         </div>

                         <div className="flex items-center gap-2">
                           <input 
                            type="checkbox" 
                            id="end_date_toggle" 
                            checked={formData.adSet.endDateEnabled}
                            onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, endDateEnabled: e.target.checked}})}
                           />
                           <label htmlFor="end_date_toggle" className="text-xs font-bold text-fb-text-primary cursor-pointer">Definir una fecha de finalización</label>
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

                         <div className="text-fb-blue text-xs font-bold cursor-pointer hover:underline flex items-center gap-1">
                           Ocultar opciones <ChevronDown size={14} className="rotate-180" />
                         </div>
                      </div>
                    </div>

                    <div className="meta-editor-card">
                      <div className="meta-editor-section-title flex items-center gap-2">
                        <Check size={16} className="text-fb-green" /> Controles de audiencia <Info size={14} className="text-fb-text-secondary" />
                      </div>
                      <div className="p-6 space-y-6">
                        <p className="text-xs text-fb-text-secondary">Ajusta los controles de audiencia únicamente para satisfacer condicionantes prácticos o legales. <span className="text-fb-blue cursor-pointer hover:underline">Más información</span></p>
                        
                        <div className="p-4 bg-fb-header rounded-md border border-fb-border border-dashed">
                          <div className="flex items-center gap-2 text-fb-text-secondary text-xs">
                             <Info size={14} />
                             <span>Puedes establecer los controles de audiencia en esta cuenta publicitaria para aplicarlos a todas las campañas.</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Lugar</label>
                          <div className="p-3 border border-fb-border rounded-sm bg-white hover:border-fb-blue cursor-pointer flex justify-between items-center group">
                            <span className="text-sm font-bold">{formData.adSet.location}</span>
                            <span className="text-fb-blue text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Editar</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Edad mínima</label>
                              <div className="p-2 border border-fb-border rounded-sm text-sm font-bold">{formData.adSet.ageMin}</div>
                           </div>
                        </div>

                        <div className="p-4 bg-blue-50/50 rounded-lg border border-fb-blue/20">
                          <div className="flex items-center justify-between mb-2">
                             <div className="font-bold text-[13px] text-fb-text-primary">Público Advantage+</div>
                             <div className="px-2 py-0.5 bg-blue-100 text-fb-blue rounded text-[10px] font-bold uppercase">Recomendado</div>
                          </div>
                          <p className="text-xs text-fb-text-secondary mb-4 leading-tight">Nuestra tecnología de anuncios busca automáticamente a tu público. Si añades una sugerencia de público, le daremos prioridad, pero si encontramos una coincidencia mejor, ampliaremos la segmentación.</p>
                          
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
                                 <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Edad</label>
                                 <div className="flex items-center gap-4">
                                   <select className="meta-editor-input flex-grow">
                                      <option>18</option>
                                      <option>21</option>
                                   </select>
                                   <span className="text-fb-text-secondary">a</span>
                                   <select className="meta-editor-input flex-grow">
                                      <option>65+</option>
                                      <option>50</option>
                                   </select>
                                 </div>
                               </div>

                               <div>
                                 <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Sexo</label>
                                 <div className="flex gap-4">
                                   {['Todos', 'Hombres', 'Mujeres'].map(s => (
                                     <label key={s} className="flex items-center gap-2 cursor-pointer">
                                       <input type="radio" name="gender" defaultChecked={s === 'Todos'} />
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
                                 <div className="relative">
                                   <textarea 
                                    className="meta-editor-input h-24 pt-3" 
                                    placeholder="Añade datos demográficos, intereses o comportamientos..." 
                                    value={formData.adSet.detailedTargeting} 
                                    onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, detailedTargeting: e.target.value}})} 
                                   />
                                   <div className="absolute right-3 bottom-3 flex gap-2">
                                      <button className="text-[10px] font-bold text-fb-text-secondary bg-fb-header px-2 py-1 rounded hover:bg-fb-border">Sugerencias</button>
                                   </div>
                                 </div>
                               </div>
                            </div>
                          )}
                        </div>

                        <div className="justification-box">
                          <span className="justification-title">Justificación de la Segmentación</span>
                          <textarea 
                            className="justification-input"
                            placeholder="¿Por qué este público es el correcto para tu proyecto?"
                            value={formData.adSet.adSetJustification}
                            onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, adSetJustification: e.target.value}})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="meta-editor-card">
                      <div className="meta-editor-section-title">Ubicaciones</div>
                      <div className="p-6 space-y-6">
                         <div 
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.adSet.placements === 'advantage' ? 'border-fb-blue bg-blue-50/50 shadow-sm' : 'border-fb-border'}`}
                          onClick={() => setFormData({...formData, adSet: {...formData.adSet, placements: 'advantage'}})}
                         >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-100 text-fb-blue rounded">
                                  <Layout size={16} />
                                </div>
                                <div className="font-bold text-sm">Ubicaciones Advantage+ (recomendado)</div>
                              </div>
                              <input type="radio" checked={formData.adSet.placements === 'advantage'} readOnly className="mt-1" />
                            </div>
                            <p className="text-xs text-fb-text-secondary mt-2 ml-9">Usa nuestro sistema de entrega para maximizar tu presupuesto y mostrar tus anuncios a más personas. El sistema de Meta distribuirá el presupuesto de tu conjunto de anuncios entre varias ubicaciones basándose en dónde es más probable que tengan un mejor rendimiento.</p>
                         </div>

                         <div 
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.adSet.placements === 'manual' ? 'border-fb-blue bg-blue-50/50 shadow-sm' : 'border-fb-border'}`}
                          onClick={() => setFormData({...formData, adSet: {...formData.adSet, placements: 'manual'}})}
                         >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-fb-header text-fb-text-secondary rounded">
                                  <Monitor size={16} />
                                </div>
                                <div className="font-bold text-sm">Ubicaciones manuales</div>
                              </div>
                              <input type="radio" checked={formData.adSet.placements === 'manual'} readOnly className="mt-1" />
                            </div>
                            <p className="text-xs text-fb-text-secondary mt-2 ml-9">Elige manualmente los lugares donde se mostrará tu anuncio. Si quitas ubicaciones, es posible que el alcance disminuya y que las oportunidades de alcanzar tus objetivos sean menores.</p>
                            
                            {formData.adSet.placements === 'manual' && (
                              <div className="mt-6 ml-9 space-y-4 animate-in fade-in duration-300">
                                 <label className="text-[11px] font-bold text-fb-text-secondary uppercase tracking-wider">Plataformas</label>
                                 <div className="grid grid-cols-2 gap-y-3">
                                   {['Facebook', 'Instagram', 'Audience Network', 'Messenger'].map(platform => (
                                     <label key={platform} className="flex items-center gap-3 cursor-pointer group">
                                       <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-fb-border text-fb-blue focus:ring-fb-blue" />
                                       <span className="text-sm group-hover:text-fb-blue transition-colors">{platform}</span>
                                     </label>
                                   ))}
                                 </div>
                              </div>
                            )}
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AD STEP */}
                {currentStep === 3 && (
                  <div className="flex-grow space-y-6">
                    <div className="meta-editor-card">
                      <div className="meta-editor-section-title font-bold">Identidad</div>
                      <div className="p-6 space-y-4">
                         <div>
                            <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Página de Facebook</label>
                            <div className="p-3 border border-fb-border rounded-sm bg-white flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-fb-blue rounded-full flex items-center justify-center text-white font-bold text-xs">
                                    {projectData.agencyName?.[0] || 'A'}
                                 </div>
                                 <span className="text-sm font-bold text-fb-text-primary">{projectData.agencyName || 'Página de Agencia'}</span>
                               </div>
                               <ChevronDown size={16} className="text-fb-text-secondary" />
                            </div>
                         </div>
                         <div>
                            <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider flex justify-between">
                              Cuenta de Instagram
                              <span className="text-fb-blue text-[10px] lowercase font-bold cursor-pointer hover:underline">Vincular cuenta</span>
                            </label>
                            <div className="p-3 border border-fb-border rounded-sm bg-fb-header/30 flex items-center justify-between opacity-80">
                               <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                                    <ImageIcon size={14} />
                                 </div>
                                 <span className="text-sm font-bold text-fb-text-secondary">Usar página seleccionada</span>
                               </div>
                               <ChevronDown size={16} className="text-fb-text-secondary" />
                            </div>
                            <p className="text-[10px] text-fb-text-secondary mt-1">Tu anuncio usará el nombre y la foto de perfil de tu página de Facebook en Instagram.</p>
                         </div>
                      </div>
                    </div>

                    <div className="meta-editor-card">
                      <div className="meta-editor-section-title font-bold">Configuración del anuncio</div>
                      <div className="p-6 space-y-6">
                         <div>
                            <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Creación de anuncios</label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                               <div className="p-3 border border-fb-blue bg-blue-50/50 rounded-sm flex items-center gap-3 cursor-pointer">
                                  <Plus size={18} className="text-fb-blue" />
                                  <div className="text-sm font-bold text-fb-blue">Crear anuncio</div>
                               </div>
                               <div className="p-3 border border-fb-border rounded-sm flex items-center gap-3 cursor-pointer hover:bg-fb-header">
                                  <RotateCcw size={18} className="text-fb-text-secondary" />
                                  <div className="text-sm font-bold text-fb-text-secondary">Usar publicación existente</div>
                               </div>
                            </div>
                         </div>
                         
                         <div>
                            <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Formato</label>
                            <p className="text-xs text-fb-text-secondary mb-3">Elige cómo quieres estructurar tu anuncio.</p>
                            <div className="space-y-2">
                               {[
                                 { id: 'single', label: 'Una sola imagen o video', desc: 'Una imagen o un video, o una presentación con varias imágenes.' },
                                 { id: 'carousel', label: 'Secuencia', desc: 'Dos o más imágenes o videos desplazables.' },
                                 { id: 'collection', label: 'Colección', desc: 'Un grupo de artículos que se abre en una experiencia en pantalla completa.' }
                               ].map(f => (
                                 <label key={f.id} className={`flex items-start gap-3 p-3 border rounded-sm cursor-pointer transition-all ${formData.ad.format === f.id ? 'border-fb-blue bg-blue-50/20' : 'border-fb-border hover:bg-fb-header/50'}`}>
                                    <input type="radio" name="format" checked={formData.ad.format === f.id} onChange={() => setFormData({...formData, ad: {...formData.ad, format: f.id}})} className="mt-1" />
                                    <div className="flex flex-col">
                                       <span className={`text-sm font-bold ${formData.ad.format === f.id ? 'text-fb-blue' : 'text-fb-text-primary'}`}>{f.label}</span>
                                       <span className="text-[11px] text-fb-text-secondary">{f.desc}</span>
                                    </div>
                                 </label>
                               ))}
                            </div>
                         </div>
                      </div>
                    </div>

                    <div className="meta-editor-card">
                      <div className="meta-editor-section-title">Contenido del anuncio</div>
                      <div className="p-6 space-y-6">
                         <div>
                            <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Multimedia</label>
                            <div className="flex gap-2">
                               <button className="meta-btn-secondary flex items-center gap-2">
                                 <Plus size={16} /> Añadir imagen
                               </button>
                               <button className="meta-btn-secondary flex items-center gap-2">
                                 <Plus size={16} /> Añadir video
                               </button>
                            </div>
                            <div className="mt-4 p-8 border-2 border-dashed border-fb-border rounded-md flex flex-col items-center justify-center bg-fb-header/20">
                               <ImageIcon size={32} className="text-fb-text-secondary mb-2" />
                               <span className="text-xs text-fb-text-secondary font-bold">Selecciona una imagen o un video</span>
                            </div>
                         </div>

                         <div>
                           <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider flex justify-between">
                             Texto Principal
                             <span className={formData.ad.primaryText.length > 125 ? 'text-fb-green' : 'text-fb-text-secondary'}>
                               {formData.ad.primaryText.length} / 125*
                             </span>
                           </label>
                           <textarea 
                             className="meta-editor-input h-32 pt-3" 
                             placeholder="Escribe el texto principal de tu anuncio..." 
                             value={formData.ad.primaryText} 
                             onChange={(e) => setFormData({...formData, ad: {...formData.ad, primaryText: e.target.value}})} 
                           />
                           <div className="flex justify-between items-center mt-2">
                              <span className="text-[11px] text-fb-text-secondary">Añade hasta 5 opciones de texto principal.</span>
                              <button className="text-fb-blue text-xs font-bold hover:underline">+ Añadir opción</button>
                           </div>
                         </div>

                         <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Título (opcional)</label>
                              <input 
                                type="text" 
                                className="meta-editor-input font-bold" 
                                placeholder="Escribe un título corto..." 
                                value={formData.ad.headline} 
                                onChange={(e) => setFormData({...formData, ad: {...formData.ad, headline: e.target.value}})} 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Descripción (opcional)</label>
                              <input 
                                type="text" 
                                className="meta-editor-input" 
                                placeholder="Añade más detalles..." 
                                value={formData.ad.description} 
                                onChange={(e) => setFormData({...formData, ad: {...formData.ad, description: e.target.value}})} 
                              />
                            </div>
                         </div>

                         <div>
                            <label className="text-xs font-bold text-fb-text-secondary uppercase mb-2 block tracking-wider">Llamada a la acción</label>
                            <select 
                              className="meta-editor-input"
                              value={formData.ad.cta}
                              onChange={(e) => setFormData({...formData, ad: {...formData.ad, cta: e.target.value}})}
                            >
                              <option value="LEARN_MORE">Más información</option>
                              <option value="SUBSCRIBE">Suscribirte</option>
                              <option value="SEND_MESSAGE">Enviar mensaje</option>
                              <option value="SHOP_NOW">Comprar</option>
                              <option value="SIGN_UP">Registrarte</option>
                              <option value="CONTACT_US">Contactar</option>
                            </select>
                         </div>

                         <div className="justification-box">
                          <span className="justification-title">Estrategia Creativa</span>
                          <textarea 
                            className="justification-input"
                            placeholder="¿Por qué este diseño y copy conectarán con tu audiencia?"
                            value={formData.ad.creativeStrategyJustification}
                            onChange={(e) => setFormData({...formData, ad: {...formData.ad, creativeStrategyJustification: e.target.value}})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="meta-editor-card">
                       <div className="meta-editor-section-title">Destino</div>
                       <div className="p-6 space-y-4">
                          <div className="flex gap-4">
                             {['Sitio web', 'Experiencia instantánea', 'Evento de Facebook'].map(d => (
                               <label key={d} className="flex-grow p-3 border border-fb-border rounded-sm flex items-center gap-2 cursor-pointer hover:bg-fb-header">
                                  <input type="radio" name="dest" defaultChecked={d === 'Sitio web'} />
                                  <span className="text-sm font-bold">{d}</span>
                               </label>
                             ))}
                          </div>
                          <div>
                            <label className="text-xs font-bold text-fb-text-secondary uppercase mb-1 block tracking-wider">URL del sitio web</label>
                            <input 
                              type="text" 
                              className="meta-editor-input" 
                              placeholder="https://ejemplo.com/pagina-destino" 
                              value={formData.ad.destinationUrl} 
                              onChange={(e) => setFormData({...formData, ad: {...formData.ad, destinationUrl: e.target.value}})} 
                            />
                          </div>
                       </div>
                    </div>

                    <div className="meta-editor-card">
                      <div className="meta-editor-section-title">Seguimiento</div>
                      <div className="p-6">
                         <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                               <input type="checkbox" checked readOnly />
                               <label className="text-sm font-bold">Eventos del sitio web</label>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-fb-text-secondary">
                               <div className="w-2 h-2 bg-fb-green rounded-full" /> Activo
                            </div>
                         </div>
                         <div className="p-3 bg-fb-header rounded-sm border border-fb-border flex items-center justify-between">
                            <span className="text-sm font-bold">Pixel de {projectData.agencyName || 'Agencia'}</span>
                            <span className="text-xs text-fb-text-secondary">ID: 57704623...</span>
                         </div>
                      </div>
                    </div>
                    
                    {/* Preview Area (Always on the right for Step 3) */}
                    <div className="w-[400px] flex-shrink-0 hidden xl:block">
                        <div className="sticky top-0 space-y-4">
                          <div className="text-xs font-bold text-fb-text-secondary uppercase tracking-widest flex justify-between items-center px-2">
                            Vista previa del anuncio
                            <div className="flex gap-3">
                               <Maximize2 size={14} className="cursor-pointer hover:text-fb-blue" />
                               <MoreHorizontal size={14} className="cursor-pointer hover:text-fb-blue" />
                            </div>
                          </div>
                          
                          <div className="bg-fb-header/30 p-2 rounded-t-lg flex gap-2 overflow-x-auto no-scrollbar">
                             {['Facebook Feed', 'Instagram Feed', 'Stories', 'Reels'].map(v => (
                               <button key={v} className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${v === 'Facebook Feed' ? 'bg-white shadow-sm text-fb-blue' : 'text-fb-text-secondary hover:bg-white/50'}`}>
                                 {v}
                               </button>
                             ))}
                          </div>

                          <div className="bg-white border border-fb-border rounded-b-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
                             <div className="p-3 flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                 <div className="w-9 h-9 bg-fb-blue rounded-full border border-fb-border flex items-center justify-center text-white font-bold text-sm">
                                    {projectData.agencyName?.[0] || 'A'}
                                 </div>
                                 <div className="flex flex-col">
                                   <span className="text-[13px] font-bold leading-none hover:underline cursor-pointer">{projectData.agencyName || 'Página de Agencia'}</span>
                                   <span className="text-[11px] text-fb-text-secondary flex items-center gap-1 mt-0.5">Publicidad · {formData.adSet.location} <Info size={10} /></span>
                                 </div>
                               </div>
                               <MoreHorizontal size={16} className="text-fb-text-secondary" />
                             </div>
                             
                             <div className="p-3 pt-0 text-[13px] leading-snug whitespace-pre-wrap min-h-[1.5em]">
                               {formData.ad.primaryText || 'Tu texto principal aparecerá aquí para captar la atención de tu público objetivo.'}
                             </div>
                             
                             <div className="aspect-square bg-[#f0f2f5] flex flex-col items-center justify-center text-fb-text-secondary border-y border-fb-border group relative cursor-pointer overflow-hidden">
                                <ImageIcon size={48} className="opacity-20 group-hover:scale-110 transition-transform duration-700" />
                                <span className="italic text-[11px] mt-2 font-bold opacity-40 uppercase tracking-tighter">Imagen del anuncio</span>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                             </div>
                             
                             <div className="p-3 bg-white flex items-center justify-between border-b border-fb-border/50">
                               <div className="flex-grow overflow-hidden pr-2">
                                 <div className="text-[10px] text-fb-text-secondary uppercase truncate tracking-tight">{formData.ad.destinationUrl.split('/')[2] || 'SITIO.COM'}</div>
                                 <div className="text-[15px] font-bold truncate text-fb-text-primary leading-tight mt-0.5">{formData.ad.headline || 'Título atractivo aquí'}</div>
                                 {formData.ad.description && <div className="text-[12px] text-fb-text-secondary truncate mt-0.5">{formData.ad.description}</div>}
                               </div>
                               <button className="bg-[#e4e6eb] hover:bg-[#d8dadf] px-5 py-2 rounded-md text-[13px] font-bold transition-colors flex-shrink-0">
                                 {formData.ad.cta === 'LEARN_MORE' && 'Más información'}
                                 {formData.ad.cta === 'SUBSCRIBE' && 'Suscribirte'}
                                 {formData.ad.cta === 'SEND_MESSAGE' && 'Enviar mensaje'}
                                 {formData.ad.cta === 'SHOP_NOW' && 'Comprar'}
                                 {formData.ad.cta === 'SIGN_UP' && 'Registrarte'}
                                 {formData.ad.cta === 'CONTACT_US' && 'Contactar'}
                               </button>
                             </div>

                             <div className="px-3 py-2 flex items-center justify-between text-fb-text-secondary bg-[#f0f2f5]/30">
                                <div className="flex items-center gap-1.5 text-[12px]">
                                  <div className="flex -space-x-1">
                                    <div className="w-4 h-4 bg-fb-blue rounded-full flex items-center justify-center text-white scale-90 border border-white"><Check size={8} /></div>
                                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white scale-90 border border-white"><Plus size={8} /></div>
                                  </div>
                                  <span className="font-medium hover:underline cursor-pointer">824</span>
                                </div>
                                <div className="flex gap-4 text-[12px] font-medium">
                                  <span className="hover:underline cursor-pointer">156 comentarios</span>
                                  <span className="hover:underline cursor-pointer">92 veces compartido</span>
                                </div>
                             </div>
                          </div>

                          <div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-md">
                             <div className="flex items-start gap-2">
                                <Info size={14} className="text-yellow-600 mt-0.5" />
                                <div className="text-[11px] text-yellow-800 leading-tight">
                                   <span className="font-bold">Nota de diseño:</span> El formato de imagen es 1:1 (cuadrado) por defecto para el feed. Puedes cambiarlo en la sección multimedia.
                                </div>
                             </div>
                          </div>
                        </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Insights (Visible in all editor steps) */}
            <aside className="w-[320px] bg-white border-l border-fb-border overflow-y-auto p-5 custom-scrollbar hidden lg:block">
                <div className="space-y-6">
                   {/* Campaign Score */}
                   <div className="meta-editor-card border-fb-blue/30 overflow-hidden">
                      <div className="p-4 flex items-start gap-4">
                        <div className="relative w-14 h-14 flex-shrink-0">
                           <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path className="text-fb-header" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                              <path className="text-fb-green" strokeDasharray="97, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">97</div>
                        </div>
                        <div>
                           <div className="font-bold text-[13px] leading-tight mb-1">Puntuación de la campaña</div>
                           <p className="text-[11px] text-fb-text-secondary leading-tight">Tienes recomendaciones que aplicar para mejorar el rendimiento.</p>
                        </div>
                      </div>
                      <div className="bg-fb-header p-3 flex items-center justify-between border-t border-fb-border">
                         <span className="text-[11px] font-bold text-fb-blue cursor-pointer hover:underline">Ver recomendaciones</span>
                         <ChevronRight size={14} className="text-fb-blue" />
                      </div>
                   </div>

                   {/* Audience Estimation (Step 2 only) */}
                   {currentStep === 2 && (
                     <div className="meta-editor-card">
                       <div className="p-4 border-b border-fb-border">
                          <div className="font-bold text-[13px] flex items-center justify-between">
                            Tamaño de público estimado
                            <Info size={14} className="text-fb-text-secondary" />
                          </div>
                       </div>
                       <div className="p-4">
                          <div className="text-lg font-bold">16 800 000 - 19 700 000</div>
                          <div className="w-full h-2 bg-gradient-to-r from-red-500 via-fb-green to-yellow-500 rounded-full mt-2 relative">
                             <div className="absolute left-1/2 top-0 w-1 h-3 bg-fb-text-primary -translate-y-0.5 border border-white" />
                          </div>
                          <p className="text-[11px] text-fb-text-secondary mt-4 leading-tight italic">
                            Las estimaciones no incluyen las opciones de público Advantage+ ni las ubicaciones de WhatsApp y pueden variar considerablemente a lo largo del tiempo.
                          </p>
                       </div>
                     </div>
                   )}

                   {/* Ad Quality Estimation (Step 3 only) */}
                    {currentStep === 3 && (
                      <div className="meta-editor-card border-fb-blue/20">
                        <div className="p-4 border-b border-fb-border bg-fb-header/20">
                           <div className="font-bold text-[13px] flex items-center justify-between">
                             Calidad del contenido
                             <BarChart3 size={16} className="text-fb-blue" />
                           </div>
                        </div>
                        <div className="p-4 space-y-4">
                           <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                 <span className="font-bold">Interacción estimada</span>
                                 <span className="text-fb-green font-bold">Por encima de la media</span>
                              </div>
                              <div className="w-full h-1.5 bg-fb-header rounded-full overflow-hidden">
                                 <div className="w-[85%] h-full bg-fb-green" />
                              </div>
                           </div>
                           <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                 <span className="font-bold">Tasa de conversión</span>
                                 <span className="text-fb-text-secondary">Media</span>
                              </div>
                              <div className="w-full h-1.5 bg-fb-header rounded-full overflow-hidden">
                                 <div className="w-[50%] h-full bg-fb-blue" />
                              </div>
                           </div>
                           <p className="text-[10px] text-fb-text-secondary leading-tight bg-fb-header/50 p-2 rounded">
                              Tu anuncio tiene una alta probabilidad de generar interacción debido a la coherencia entre el texto y el objetivo de reconocimiento.
                           </p>
                        </div>
                      </div>
                    )}

                   {/* Advantage Card */}
                    <div className="meta-editor-card bg-fb-blue/5 border-fb-blue/20">
                       <div className="p-4">
                         <div className="flex items-center gap-2 text-fb-blue font-bold text-xs mb-2 uppercase tracking-tighter">
                            <Layout size={14} />
                            Anuncio Advantage+
                         </div>
                         <p className="text-xs text-fb-text-primary leading-tight font-bold mb-3">Maximiza el rendimiento automáticamente</p>
                         <p className="text-[11px] text-fb-text-secondary mb-4 leading-snug">Usar variaciones de texto y optimización de contenido puede mejorar el ROAS hasta en un 12%.</p>
                         <button className="w-full py-1.5 bg-fb-blue text-white rounded font-bold text-xs hover:bg-fb-blue/90 transition-colors">Activar todas las mejoras</button>
                       </div>
                    </div>
                 </div>
              </aside>

          </main>

          {/* Footer Navigation */}
          <footer className="h-16 bg-white border-t border-fb-border flex items-center justify-between px-6 flex-shrink-0 z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <button onClick={() => setView('manager')} className="meta-btn-secondary px-6">Cerrar</button>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-[11px] text-fb-text-secondary mr-4">
                 <div className="w-1.5 h-1.5 bg-fb-green rounded-full" />
                 Se guardaron todos los cambios en el borrador
              </div>
              <button className="meta-btn-secondary">Restablecer</button>
              {currentStep > 1 && (
                <button onClick={() => setCurrentStep(currentStep - 1)} className="meta-btn-secondary">Anterior</button>
              )}
              {currentStep < 3 ? (
                <button 
                  onClick={() => setCurrentStep(currentStep + 1)} 
                  className="bg-fb-blue text-white px-8 py-2 rounded-md font-bold text-sm hover:bg-fb-blue/90 shadow-lg shadow-fb-blue/20 transition-all active:scale-95"
                >
                  Siguiente
                </button>
              ) : (
                <button 
                  onClick={handleFinish} 
                  className="bg-fb-green text-white px-8 py-2 rounded-md font-bold text-sm hover:bg-fb-green/90 shadow-lg shadow-fb-green/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Plus size={16} /> Publicar borrador
                </button>
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
