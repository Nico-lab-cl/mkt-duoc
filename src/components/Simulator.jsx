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
  Share2,
  Phone,
  Link as LinkIcon,
  MessageCircle,
  Video
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

const trafficConversionLocations = [
  { id: 'website', name: 'Sitio web', desc: 'Dirige el tráfico a tu sitio web.' },
  { id: 'app', name: 'Aplicación', desc: 'Dirige el tráfico a tu aplicación.' },
  { id: 'messaging_apps', name: 'Destinos del mensaje', desc: 'Dirige el tráfico a Messenger, Instagram y WhatsApp.' },
  { id: 'instagram_facebook', name: 'Instagram o Facebook', desc: 'Envía tráfico a un perfil de Instagram, a una página de Facebook o a ambos sitios.' },
  { id: 'calls', name: 'Llamadas', desc: 'Consigue que más personas se pongan en contacto contigo por teléfono, Messenger o WhatsApp.' },
  { id: 'website_calls', name: 'Sitio web y llamadas', desc: 'Envía tráfico a tu sitio web y consigue que las personas llamen a tu empresa.' }
];

const trafficPerformanceGoals = {
  website: [
    { isHeader: true, name: 'Objetivos de tráfico' },
    { id: 'landing_page_views', name: 'Maximizar el número de visitas a la página de destino', desc: 'Intentaremos mostrar los anuncios a las personas con más probabilidades de ver el sitio web que has vinculado con tu anuncio.' },
    { id: 'link_clicks', name: 'Maximizar el número de clics en el enlace', desc: 'Intentaremos mostrar tus anuncios a las personas con más probabilidades de hacer clic en ellos.' },
    { isHeader: true, name: 'Otros objetivos' },
    { id: 'daily_unique_reach', name: 'Maximizar el alcance único diario', desc: 'Intentaremos mostrar tus anuncios a las personas hasta una vez al día.' },
    { id: 'conversations', name: 'Maximizar el número de conversaciones', desc: 'Intentaremos mostrar tus anuncios a las personas con más probabilidades de conversar contigo a través de mensajes.' },
    { id: 'impressions', name: 'Maximizar el número de impresiones', desc: 'Intentaremos mostrar tus anuncios a las personas tantas veces como sea posible.' }
  ],
  app: [
    { isHeader: true, name: 'Objetivos de tráfico' },
    { id: 'link_clicks', name: 'Maximizar el número de clics en el enlace', desc: 'Intentaremos mostrar tus anuncios a las personas con más probabilidades de hacer clic en ellos.' },
    { isHeader: true, name: 'Otros objetivos' },
    { id: 'daily_unique_reach', name: 'Maximizar el alcance único diario', desc: 'Intentaremos mostrar tus anuncios a las personas hasta una vez al día.' }
  ],
  messaging_apps: [
    { id: 'link_clicks', name: 'Maximizar el número de clics en el enlace', desc: 'Intentaremos mostrar tus anuncios a las personas con más probabilidades de hacer clic en ellos.' },
    { id: 'daily_unique_reach', name: 'Maximizar el alcance único diario', desc: 'Intentaremos mostrar tus anuncios a las personas hasta una vez al día.' }
  ],
  instagram_facebook: [
    { id: 'profile_visits', name: 'Maximizar el número de visitas al perfil de Instagram', desc: 'Mostraremos tus anuncios a las personas con más probabilidades de visitar tu perfil de Instagram.' }
  ],
  calls: [
    { id: 'calls', name: 'Maximizar el número de llamadas', desc: 'Intentaremos mostrar tus anuncios a las personas con más probabilidades de llamarte.' }
  ],
  website_calls: [
    { id: 'landing_page_views', name: 'Maximizar el número de visitas a la página de destino', desc: 'Intentaremos mostrar los anuncios a las personas con más probabilidades de ver el sitio web que has vinculado con tu anuncio.' }
  ]
};

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
  // UI state for editor dropdowns
  const [showEditorBuyingType, setShowEditorBuyingType] = useState(false);
  const [showEditorObjective, setShowEditorObjective] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showBidStrategyDropdown, setShowBidStrategyDropdown] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationMenuOpen, setLocationMenuOpen] = useState(null);
  const [locationIncludeOpen, setLocationIncludeOpen] = useState(null);

  const allCountries = ['Afganistán','Albania','Alemania','Andorra','Angola','Antigua y Barbuda','Arabia Saudita','Argelia','Argentina','Armenia','Australia','Austria','Azerbaiyán','Bahamas','Bangladés','Barbados','Baréin','Bélgica','Belice','Benín','Bielorrusia','Birmania','Bolivia','Bosnia y Herzegovina','Botsuana','Brasil','Brunéi','Bulgaria','Burkina Faso','Burundi','Bután','Cabo Verde','Camboya','Camerún','Canadá','Catar','Chad','Chile','China','Chipre','Colombia','Comoras','Corea del Norte','Corea del Sur','Costa de Marfil','Costa Rica','Croacia','Cuba','Dinamarca','Dominica','Ecuador','Egipto','El Salvador','Emiratos Árabes Unidos','Eritrea','Eslovaquia','Eslovenia','España','Estados Unidos','Estonia','Etiopía','Filipinas','Finlandia','Fiyi','Francia','Gabón','Gambia','Georgia','Ghana','Granada','Grecia','Guatemala','Guinea','Guinea-Bisáu','Guinea Ecuatorial','Guyana','Haití','Honduras','Hungría','India','Indonesia','Irak','Irán','Irlanda','Islandia','Islas Marshall','Islas Salomón','Israel','Italia','Jamaica','Japón','Jordania','Kazajistán','Kenia','Kirguistán','Kiribati','Kuwait','Laos','Lesoto','Letonia','Líbano','Liberia','Libia','Liechtenstein','Lituania','Luxemburgo','Madagascar','Malasia','Malaui','Maldivas','Malí','Malta','Marruecos','Mauricio','Mauritania','México','Micronesia','Moldavia','Mónaco','Mongolia','Montenegro','Mozambique','Namibia','Nauru','Nepal','Nicaragua','Níger','Nigeria','Noruega','Nueva Zelanda','Omán','Países Bajos','Pakistán','Palaos','Panamá','Papúa Nueva Guinea','Paraguay','Perú','Polonia','Portugal','Reino Unido','República Centroafricana','República Checa','República del Congo','República Democrática del Congo','República Dominicana','Ruanda','Rumanía','Rusia','Samoa','San Cristóbal y Nieves','San Marino','San Vicente y las Granadinas','Santa Lucía','Santo Tomé y Príncipe','Senegal','Serbia','Seychelles','Sierra Leona','Singapur','Siria','Somalia','Sri Lanka','Suazilandia','Sudáfrica','Sudán','Sudán del Sur','Suecia','Suiza','Surinam','Tailandia','Tanzania','Tayikistán','Timor Oriental','Togo','Tonga','Trinidad y Tobago','Túnez','Turkmenistán','Turquía','Tuvalu','Ucrania','Uganda','Uruguay','Uzbekistán','Vanuatu','Vaticano','Venezuela','Vietnam','Yemen','Yibuti','Zambia','Zimbabue'];

  const populationOptions = ['50 000','100 000','200 000','500 000','1 millón','2 millones','3 millones','+3 millones'];

  const interactionConversionLocations = [
  { id: 'messaging_apps', name: 'Aplicaciones de mensajería', desc: 'Consigue que las personas interactúen con tu marca en Messenger, WhatsApp o Instagram.' },
  { id: 'on_ad', name: 'En tu anuncio', desc: 'Consigue que la gente interactúe con tu publicación o evento, o que vea un vídeo.' },
  { id: 'calls', name: 'Llamadas', desc: 'Consigue que más personas se pongan en contacto contigo por teléfono, Messenger o WhatsApp.' },
  { id: 'website', name: 'Sitio web', desc: 'Consigue que las personas interactúan con tu sitio web.' },
  { id: 'app', name: 'Aplicación', desc: 'Consigue que las personas interactúen con tu aplicación.' },
  { id: 'instagram_facebook', name: 'Instagram o Facebook', desc: 'Consigue que la gente interactúe con tu perfil de Instagram, tu página de Facebook o ambos.' }
];

const interactionPerformanceGoals = {
  messaging_apps: [
    { id: 'conversations', name: 'Maximizar el número de conversaciones', desc: 'Intentaremos mostrar tus anuncios a las personas con más probabilidades de conversar contigo a través de mensajes.' }
  ],
  on_ad: [
    { isHeader: true, name: 'Objetivos de interacción' },
    { id: 'post_engagement', name: 'Maximizar las interacciones', desc: 'Intentaremos mostrar tus anuncios a las personas con más probabilidades de reaccionar a tu publicación, comentarla, compartirla o indicar que les gusta.' }
  ],
  calls: [
    { id: 'calls', name: 'Maximizar el número de llamadas', desc: 'Intentaremos mostrar tus anuncios a las personas con más probabilidades de llamarte.' }
  ],
  website: [
    { isHeader: true, name: 'Objetivos de interacción' },
    { id: 'conversions', name: 'Maximizar el número de conversiones', desc: 'Intentaremos mostrar tus anuncios a las personas con más probabilidades de realizar una acción concreta en tu sitio web.' },
    { isHeader: true, name: 'Otros objetivos' },
    { id: 'landing_page_views', name: 'Maximizar el número de visitas a la página de destino', desc: 'Intentaremos mostrar los anuncios a las personas con más probabilidades de ver el sitio web que has vinculado con tu anuncio.' },
    { id: 'link_clicks', name: 'Maximizar el número de clics en el enlace', desc: 'Intentaremos mostrar tus anuncios a las personas con más probabilidades de hacer clic en ellos.' },
    { id: 'daily_unique_reach', name: 'Maximizar el alcance único diario', desc: 'Intentaremos mostrar tus anuncios a las personas hasta una vez al día.' },
    { id: 'impressions', name: 'Maximizar el número de impresiones', desc: 'Intentaremos mostrar tus anuncios a las personas tantas veces como sea posible.' }
  ],
  app: [
    { isHeader: true, name: 'Objetivos de interacción' },
    { id: 'app_events', name: 'Maximizar el número de eventos de la aplicación', desc: 'Intentaremos mostrar tus anuncios a las personas con más probabilidades de realizar una acción concreta en tu aplicación al menos una vez.' },
    { isHeader: true, name: 'Otros objetivos' },
    { id: 'link_clicks', name: 'Maximizar el número de clics en el enlace', desc: 'Intentaremos mostrar tus anuncios a las personas con más probabilidades de hacer clic en ellos.' },
    { id: 'daily_unique_reach', name: 'Maximizar el alcance único diario', desc: 'Intentaremos mostrar tus anuncios a las personas hasta una vez al día.' }
  ],
  instagram_facebook: [
    { id: 'profile_visits', name: 'Maximizar el número de visitas al perfil de Instagram', desc: 'Intentaremos mostrar tus anuncios a las personas con más probabilidades de visitar o seguir tu perfil.' },
    { id: 'page_likes', name: 'Maximizar el número de Me gusta de la página', desc: 'Mostraremos tus anuncios a las personas adecuadas para que obtengas el mayor número de Me gusta al menor coste.' }
  ]
};

const interactionTypes = [
  { id: 'video_views', name: 'Visualizaciones de vídeo' },
  { id: 'post_engagement', name: 'Interacciones' },
  { id: 'event_responses', name: 'Respuestas al evento' },
  { id: 'reminders', name: 'Recordatorios programados' }
];

const appStores = [
  { id: 'all', name: 'Todas las tiendas de aplicaciones para Android y iOS' },
  { id: 'google_play', name: 'Google Play Store' },
  { id: 'apple_app_store', name: 'App Store de Apple' },
  { id: 'games', name: 'Juegos' },
  { id: 'meta_quest', name: 'Tienda de aplicaciones de Meta Quest' }
];

const bidStrategies = [
    { id: 'highest_volume', name: 'Volumen más alto', desc: 'Obtén el mayor volumen de resultados con tu presupuesto.' },
    { id: 'cost_per_result', name: 'Objetivo de coste por resultado', desc: 'Intenta conseguir un determinado coste por resultado a la vez que maximizas el volumen de resultados.' },
    { id: 'other', name: 'Otras opciones', desc: 'Límite de puja', isOther: true }
  ];

  const initialFormState = {
    objective: 'awareness',
    objectiveJustification: '',
    campaignName: 'Nueva campaña de Reconocimiento',
    specialCategories: 'NONE',
    buyingType: 'Subasta',
    advantageBudget: false,
    shareBudget: true,
    campaignBudget: '25000',
    bidStrategy: 'highest_volume',
    bidLimitAmount: '',
    campaignSpendingLimitEnabled: false,
    campaignSpendingLimitAmount: '',
    testAB: false,
    adSet: {
      name: 'Nuevo conjunto de anuncios',
      conversionLocation: 'website', // website, app, messaging_apps, instagram_facebook, calls, website_calls
      performanceGoal: 'landing_page_views',
      dynamicCreative: false,
      pageName: currentUser?.role === 'admin' ? 'Admin' : `Grupo ${currentUser?.group_id || 'X'}`,
      budget: '2500',
      budgetType: 'daily',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endDateEnabled: false,
      endDate: '',
      endTime: '09:00',
      locations: [{ name: 'Chile', includeMode: 'all', popMin: '500 000', popMax: '+3 millones' }],
      locationRadius: '40',
      locationSearch: '',
      includeUnknownAgeWhatsApp: true,
      excludedCustomAudiences: '',
      languages: ['Todos los idiomas'],
      advantageAudience: {
        customAudiences: '',
        ageMin: '18',
        ageMax: '65+',
        gender: 'all',
        detailedTargeting: ''
      },
      placements: 'advantage',
      platforms: ['facebook', 'instagram', 'messenger', 'audience'],
      adSetJustification: '',
      frequencyControlType: 'limit',
      frequencyControl: { count: 2, days: 7 },
      interactionType: 'post_engagement',
      appStore: 'all'
    },
    ad: {
      name: 'Nuevo anuncio',
      partnerAd: false,
      adConfig: 'create', // create, existing, creative_hub
      format: 'single', // single, carousel
      multiAd: false,
      destination: 'website', // instant_experience, website, call, messaging_apps
      messagingApps: { messenger: true, instagram: true, whatsapp: false },
      mediaType: 'image', // image, video
      mediaUrl: null,
      primaryText: '',
      headline: '',
      description: '',
      cta: 'LEARN_MORE',
      destinationUrl: '',
      displayLink: '',
      phoneNumber: '',
      creativeStrategyJustification: '',
      languagesEnabled: false,
      tracking: {
        websiteEvents: false,
        appEvents: false,
        offlineEvents: false,
        urlParams: ''
      },
      utmBuilder: {
        source: '',
        medium: '',
        name: '',
        content: '',
        term: ''
      }
    }
  };

  const [formData, setFormData] = useState(initialFormState);

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showUtmModal, setShowUtmModal] = useState(false);

  const generateUtmString = (builder) => {
    const params = [];
    if (builder.source) params.push(`utm_source=${builder.source}`);
    if (builder.medium) params.push(`utm_medium=${builder.medium}`);
    if (builder.campaign) params.push(`utm_campaign=${builder.campaign}`);
    if (builder.content) params.push(`utm_content=${builder.content}`);
    return params.join('&');
  };
  const commonLanguages = [
    'Español', 'Inglés (EE. UU.)', 'Inglés (Reino Unido)', 'Portugués (Brasil)', 'Portugués (Portugal)', 
    'Francés (Francia)', 'Italiano', 'Alemán', 'Chino (Simplificado)', 'Japonés'
  ];

  const handleAddLocation = (e) => {
    if (e.key === 'Enter' && formData.adSet.locationSearch.trim()) {
      e.preventDefault();
      const newLoc = formData.adSet.locationSearch.trim();
      if (!formData.adSet.locations.find(l => l.name === newLoc)) {
        setFormData({
          ...formData,
          adSet: {
            ...formData.adSet,
            locations: [...formData.adSet.locations, { name: newLoc, includeMode: 'all', popMin: '500 000', popMax: '+3 millones' }],
            locationSearch: ''
          }
        });
      }
    }
  };

  const addLocationFromDropdown = (countryName) => {
    if (!formData.adSet.locations.find(l => l.name === countryName)) {
      setFormData({
        ...formData,
        adSet: {
          ...formData.adSet,
          locations: [...formData.adSet.locations, { name: countryName, includeMode: 'all', popMin: '500 000', popMax: '+3 millones' }],
        }
      });
    }
    setLocationSearchQuery('');
    setShowLocationDropdown(false);
  };

  const removeLocation = (locName) => {
    setFormData({
      ...formData,
      adSet: {
        ...formData.adSet,
        locations: formData.adSet.locations.filter(l => l.name !== locName)
      }
    });
  };

  const updateLocationField = (locName, field, value) => {
    setFormData({
      ...formData,
      adSet: {
        ...formData.adSet,
        locations: formData.adSet.locations.map(l => l.name === locName ? { ...l, [field]: value } : l)
      }
    });
  };

  const toggleLanguage = (lang) => {
    let newLangs = [...formData.adSet.languages];
    if (newLangs.includes('Todos los idiomas')) {
      newLangs = [lang];
    } else if (newLangs.includes(lang)) {
      newLangs = newLangs.filter(l => l !== lang);
      if (newLangs.length === 0) newLangs = ['Todos los idiomas'];
    } else {
      newLangs.push(lang);
    }
    setFormData({ ...formData, adSet: { ...formData.adSet, languages: newLangs } });
  };

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
                        <div key={obj.id} onClick={() => {
                          let defaultLoc = 'website';
                          let defaultGoal = 'reach';
                          if (obj.id === 'traffic') {
                            defaultLoc = 'website';
                            defaultGoal = 'landing_page_views';
                          } else if (obj.id === 'engagement') {
                            defaultLoc = 'messaging_apps';
                            defaultGoal = 'conversations';
                          }
                          setFormData({
                            ...formData, 
                            objective: obj.id, 
                            campaignName: `Nueva campaña de ${obj.name}`,
                            adSet: {
                              ...formData.adSet,
                              conversionLocation: defaultLoc,
                              performanceGoal: defaultGoal
                            }
                          });
                        }} className={`p-2 rounded-md flex items-center gap-3 cursor-pointer transition-all ${formData.objective === obj.id ? 'bg-blue-50/50 ring-1 ring-fb-blue/20' : 'hover:bg-fb-header/50'}`}>
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
                      {/* === DETALLES DE LA CAMPAÑA === */}
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2"><div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div><span className="text-[13px] font-bold">Detalles de la campaña</span></div>
                         <div className="p-6 space-y-6">
                            {/* Tipo de compra - dropdown */}
                            <div>
                              <label className="text-[12px] font-bold text-slate-800 block mb-2">Tipo de compra</label>
                              <div className="relative">
                                <button 
                                  onClick={() => setShowEditorBuyingType(!showEditorBuyingType)} 
                                  className="w-full text-left border border-fb-border rounded-md p-3 flex items-center justify-between text-[13px] font-bold hover:border-fb-blue transition-colors bg-white"
                                >
                                  {formData.buyingType} <ChevronDown size={16} className="text-slate-400" />
                                </button>
                                {showEditorBuyingType && (
                                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-fb-border rounded-md shadow-xl z-50">
                                    {[{ id: 'Subasta', desc: 'Compra en tiempo real con pujas rentables.' }, { id: 'Reserva', desc: 'Compra por adelantado con resultados más predecibles.' }].map(type => (
                                      <div key={type.id} onClick={() => { setFormData({...formData, buyingType: type.id}); setShowEditorBuyingType(false); }} className={`p-3 flex items-start gap-3 cursor-pointer hover:bg-fb-header/50 transition-colors ${formData.buyingType === type.id ? 'bg-blue-50/50' : ''}`}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${formData.buyingType === type.id ? 'border-fb-blue' : 'border-slate-300'}`}>{formData.buyingType === type.id && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full" />}</div>
                                        <div><div className="text-[13px] font-bold">{type.id}</div><div className="text-[11px] text-fb-text-secondary leading-tight">{type.desc}</div></div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Objetivo de la campaña - radio list */}
                            <div>
                              <label className="text-[12px] font-bold text-slate-800 mb-2 flex items-center gap-1">Objetivo de la campaña <HelpCircle size={14} className="text-fb-text-secondary" /></label>
                              <div className="relative">
                                <button 
                                  onClick={() => setShowEditorObjective(!showEditorObjective)} 
                                  className="w-full text-left border border-fb-border rounded-md p-3 flex items-center justify-between text-[13px] font-bold hover:border-fb-blue transition-colors bg-white"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded bg-fb-blue text-white">{metaObjectives.find(o => o.id === formData.objective)?.icon}</div>
                                    {metaObjectives.find(o => o.id === formData.objective)?.name}
                                  </div>
                                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${showEditorObjective ? 'rotate-180' : ''}`} />
                                </button>
                                {showEditorObjective && (
                                  <div className="mt-1 bg-white border border-fb-border rounded-md shadow-xl z-50 overflow-hidden">
                                    {metaObjectives.map(obj => (
                                      <div 
                                        key={obj.id} 
                                        onClick={() => { 
                                          let defaultLoc = 'website';
                                          let defaultGoal = 'reach';
                                          if (obj.id === 'traffic') {
                                            defaultLoc = 'website';
                                            defaultGoal = 'landing_page_views';
                                          } else if (obj.id === 'engagement') {
                                            defaultLoc = 'messaging_apps';
                                            defaultGoal = 'conversations';
                                          }
                                          setFormData({
                                            ...formData, 
                                            objective: obj.id, 
                                            campaignName: `Nueva campaña de ${obj.name}`, 
                                            adSet: {
                                              ...formData.adSet, 
                                              name: `Nuevo conjunto de anuncios de ${obj.name}`,
                                              conversionLocation: defaultLoc,
                                              performanceGoal: defaultGoal
                                            }, 
                                            ad: {
                                              ...formData.ad, 
                                              name: `Nuevo anuncio de ${obj.name}`
                                            }
                                          });
                                          setShowEditorObjective(false);
                                        }} 
                                        className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-all border-b border-fb-border/50 last:border-0 ${formData.objective === obj.id ? 'bg-blue-50/70' : 'hover:bg-fb-header/50'}`}
                                      >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${formData.objective === obj.id ? 'border-fb-blue' : 'border-slate-300'}`}>
                                          {formData.objective === obj.id && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full" />}
                                        </div>
                                        <div className={`p-1.5 rounded ${formData.objective === obj.id ? 'bg-fb-blue text-white' : 'bg-slate-100 text-slate-500'}`}>{obj.icon}</div>
                                        <span className={`text-[13px] ${formData.objective === obj.id ? 'font-bold text-fb-blue' : 'font-medium text-slate-700'}`}>{obj.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Mostrar más opciones - toggle */}
                            <button 
                              onClick={() => setShowMoreOptions(!showMoreOptions)} 
                              className="text-fb-blue text-[12px] font-bold flex items-center gap-1 hover:underline"
                            >
                              {showMoreOptions ? 'Ocultar opciones' : 'Mostrar más opciones'} <ChevronDown size={14} className={`transition-transform ${showMoreOptions ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Expanded options: Spending Limit */}
                            {showMoreOptions && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 border-t border-fb-border pt-4">
                                <div>
                                  <label className="text-[12px] font-bold text-slate-800 flex items-center gap-1 mb-2">Límite de gasto de la campaña · Opcional <HelpCircle size={14} className="text-fb-text-secondary" /></label>
                                  <div 
                                    className="flex items-center gap-2 cursor-pointer mb-3" 
                                    onClick={() => setFormData({...formData, campaignSpendingLimitEnabled: !formData.campaignSpendingLimitEnabled})}
                                  >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${formData.campaignSpendingLimitEnabled ? 'bg-fb-blue border-fb-blue' : 'border-slate-300 bg-white'}`}>
                                      {formData.campaignSpendingLimitEnabled && <Check size={12} className="text-white" strokeWidth={3} />}
                                    </div>
                                    <span className="text-[12px] font-bold text-slate-700">Añadir límite de gasto de la campaña</span>
                                  </div>
                                  {formData.campaignSpendingLimitEnabled && (
                                    <div>
                                      <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">$</span>
                                        <input 
                                          type="text" 
                                          className="meta-editor-input pl-7 font-bold" 
                                          placeholder="Ningún límite establecido" 
                                          value={formData.campaignSpendingLimitAmount} 
                                          onChange={(e) => setFormData({...formData, campaignSpendingLimitAmount: e.target.value})} 
                                        />
                                      </div>
                                      <p className="text-[11px] text-fb-text-secondary mt-1">Gasto total: {formData.campaignSpendingLimitAmount ? `$${formData.campaignSpendingLimitAmount}` : '0 $'}</p>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                         </div>
                      </div>

                      {/* === PRESUPUESTO DE CAMPAÑA ADVANTAGE+ === */}
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-[13px] font-bold">Presupuesto de campaña de Advantage+ ✨</span></div><div className="flex items-center gap-2"><span className="text-[11px] font-bold text-slate-400">{formData.advantageBudget ? 'Activado' : 'Desactivado'}</span><div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.advantageBudget ? 'bg-fb-blue' : 'bg-fb-border'}`} onClick={() => setFormData({...formData, advantageBudget: !formData.advantageBudget})}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${formData.advantageBudget ? 'left-6' : 'left-1'}`} /></div></div></div>
                         <div className="p-6 space-y-4">
                            <p className="text-[11px] text-fb-text-secondary leading-relaxed">Distribuye tu presupuesto entre conjuntos de anuncios para conseguir más resultados. <span className="text-fb-blue cursor-pointer">Información sobre el presupuesto de campaña de Advantage+</span></p>
                            <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100 cursor-pointer" onClick={() => setFormData({...formData, shareBudget: !formData.shareBudget})}>
                              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${formData.shareBudget ? 'bg-fb-blue border-fb-blue' : 'border-slate-300 bg-white'}`}>
                                {formData.shareBudget && <Check size={12} className="text-white" strokeWidth={3} />}
                              </div>
                              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">Comparte hasta el 20 % de tu presupuesto con otros conjuntos de anuncios <HelpCircle size={12} className="text-fb-text-secondary" /></span>
                            </div>

                            {/* Estrategia de puja - dropdown with definitions */}
                            <div className="border-t border-fb-border pt-4">
                              <label className="text-[12px] font-bold text-slate-800 flex items-center gap-1 mb-2">Estrategia de puja de la campaña <HelpCircle size={14} className="text-fb-text-secondary" /></label>
                              <p className="text-[11px] text-fb-text-secondary mb-3">Cómo pujaremos en las subastas de anuncios.</p>
                              <div className="relative">
                                <button 
                                  onClick={() => setShowBidStrategyDropdown(!showBidStrategyDropdown)} 
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-fb-header border border-fb-border rounded-md text-[13px] font-bold hover:bg-slate-200 transition-colors"
                                >
                                  {bidStrategies.find(b => b.id === formData.bidStrategy)?.name || 'Volumen más alto'} <ChevronDown size={14} className={`text-slate-500 transition-transform ${showBidStrategyDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showBidStrategyDropdown && (
                                  <div className="absolute top-full left-0 mt-1 w-[480px] bg-white border border-fb-border rounded-md shadow-2xl z-50 overflow-hidden">
                                    {bidStrategies.map(strategy => (
                                      <div 
                                        key={strategy.id} 
                                        onClick={() => { setFormData({...formData, bidStrategy: strategy.id}); setShowBidStrategyDropdown(false); }} 
                                        className={`px-4 py-3 cursor-pointer transition-all border-b border-fb-border/50 last:border-0 flex items-start gap-3 ${formData.bidStrategy === strategy.id ? 'bg-blue-50/50' : 'hover:bg-fb-header/50'}`}
                                      >
                                        {!strategy.isOther ? (
                                          <>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${formData.bidStrategy === strategy.id ? 'border-fb-blue' : 'border-slate-300'}`}>
                                              {formData.bidStrategy === strategy.id && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full" />}
                                            </div>
                                            <div>
                                              <div className="text-[13px] font-bold">{strategy.name}</div>
                                              <div className="text-[11px] text-fb-text-secondary leading-relaxed">{strategy.desc}</div>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div className="flex-grow">
                                              <div className="text-[13px] font-bold text-slate-600">{strategy.name}</div>
                                              <div className="text-[11px] text-fb-text-secondary">{strategy.desc}</div>
                                            </div>
                                            <ChevronRight size={16} className="text-slate-400 mt-1" />
                                          </>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Bid limit input when applicable */}
                              {(formData.bidStrategy === 'cost_per_result' || formData.bidStrategy === 'other') && (
                                <div className="mt-4 p-4 bg-fb-header/30 rounded-lg border border-fb-border">
                                  <label className="text-[11px] font-bold text-slate-800 block mb-1">
                                    {formData.bidStrategy === 'cost_per_result' ? 'Objetivo de coste por resultado (CLP)' : 'Límite de puja (CLP)'}
                                  </label>
                                  <p className="text-[11px] text-fb-text-secondary mb-2">
                                    {formData.bidStrategy === 'cost_per_result' 
                                      ? 'Define el importe máximo que quieres pagar por resultado.'
                                      : 'Define el importe máximo que quieras pujar en las subastas.'}
                                  </p>
                                  <div className="relative w-48">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">$</span>
                                    <input 
                                      type="text" 
                                      className="meta-editor-input pl-7 font-bold" 
                                      placeholder="0" 
                                      value={formData.bidLimitAmount} 
                                      onChange={(e) => setFormData({...formData, bidLimitAmount: e.target.value})} 
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
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
                      {/* --- CONVERSION / GOAL CARD --- */}
                      {formData.objective === 'awareness' ? (
                        <div className="meta-editor-card p-0">
                           <div className="p-4 border-b border-fb-border flex items-center gap-2"><div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div><span className="text-[13px] font-bold uppercase tracking-tight">Reconocimiento</span></div>
                           <div className="p-6 space-y-6">
                              <div><label className="text-[12px] font-bold text-slate-800 block mb-1">Objetivo de rendimiento</label><select className="meta-editor-input font-bold" value={formData.adSet.performanceGoal} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, performanceGoal: e.target.value}})}>{performanceGoals.map((goal, idx) => goal.isHeader ? <optgroup key={idx} label={goal.name} /> : <option key={goal.id} value={goal.id}>{goal.name}</option>)}</select><p className="text-[11px] text-fb-text-secondary mt-1.5 leading-relaxed">{performanceGoals.find(g => g.id === formData.adSet.performanceGoal)?.desc}</p></div>
                              <div><label className="text-[12px] font-bold text-slate-800 block mb-1 flex items-center gap-1">Página de Facebook <HelpCircle size={14} className="text-slate-400" /></label><div className="flex gap-2"><select className="meta-editor-input font-bold flex-grow" value={formData.adSet.pageName} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, pageName: e.target.value}})}><option value="Seleccionar página">Seleccionar página</option><option value={formData.adSet.pageName}>{formData.adSet.pageName}</option></select><button className="px-3 border border-fb-border rounded-md hover:bg-fb-header"><Plus size={18} /></button></div></div>
                              <div className="pt-4 border-t border-fb-border space-y-4">
                                <label className="text-[12px] font-bold text-slate-800 flex items-center gap-1">Control de frecuencia <HelpCircle size={14} className="text-slate-400" /></label>
                                <div className="space-y-2">
                                  {/* Segmentación option */}
                                  <div 
                                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${formData.adSet.frequencyControlType === 'segmentation' ? 'border-fb-blue bg-blue-50/30' : 'border-fb-border hover:bg-fb-header/20'}`}
                                    onClick={() => setFormData({...formData, adSet: {...formData.adSet, frequencyControlType: 'segmentation'}})}
                                  >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${formData.adSet.frequencyControlType === 'segmentation' ? 'border-fb-blue' : 'border-slate-300'}`}>
                                      {formData.adSet.frequencyControlType === 'segmentation' && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full" />}
                                    </div>
                                    <div>
                                      <div className="text-[13px] font-bold">Segmentación</div>
                                      <div className="text-[11px] text-fb-text-secondary">Número medio de veces que quieres que las personas vean tus anuncios.</div>
                                    </div>
                                  </div>
                                  {/* Límite option */}
                                  <div 
                                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${formData.adSet.frequencyControlType === 'limit' ? 'border-fb-blue bg-blue-50/30' : 'border-fb-border hover:bg-fb-header/20'}`}
                                    onClick={() => setFormData({...formData, adSet: {...formData.adSet, frequencyControlType: 'limit'}})}
                                  >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${formData.adSet.frequencyControlType === 'limit' ? 'border-fb-blue' : 'border-slate-300'}`}>
                                      {formData.adSet.frequencyControlType === 'limit' && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full" />}
                                    </div>
                                    <div>
                                      <div className="text-[13px] font-bold">Límite</div>
                                      <div className="text-[11px] text-fb-text-secondary">Número máximo de veces que quieres que las personas vean tus anuncios.</div>
                                    </div>
                                  </div>
                                </div>
                                {formData.adSet.frequencyControlType === 'limit' && (
                                  <div className="pl-8 space-y-2">
                                    <div className="flex items-center gap-3">
                                      <input type="number" className="w-16 p-2 border border-fb-border rounded text-center font-bold text-[13px]" value={formData.adSet.frequencyControl.count} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, frequencyControl: {...formData.adSet.frequencyControl, count: e.target.value}}})} />
                                      <span className="text-[12px] text-slate-600">veces cada</span>
                                      <input type="number" className="w-16 p-2 border border-fb-border rounded text-center font-bold text-[13px]" value={formData.adSet.frequencyControl.days} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, frequencyControl: {...formData.adSet.frequencyControl, days: e.target.value}}})} />
                                      <span className="text-[12px] text-slate-600">días</span>
                                    </div>
                                    <p className="text-[11px] text-fb-text-secondary">Intentaremos mantener la frecuencia por debajo de {formData.adSet.frequencyControl.count} impresiones cada {formData.adSet.frequencyControl.days} días como máximo.</p>
                                  </div>
                                )}
                              </div>
                           </div>
                        </div>
                      ) : formData.objective === 'traffic' ? (
                        <div className="meta-editor-card p-0">
                          <div className="p-4 border-b border-fb-border flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div>
                            <span className="text-[13px] font-bold">Conversión</span>
                          </div>
                          <div className="p-6 space-y-6">
                            <div>
                              <label className="text-[12px] font-bold text-slate-800 block mb-1">Ubicación de la conversión</label>
                              <p className="text-[11px] text-fb-text-secondary mb-4">Elige dónde quieres aumentar el tráfico.</p>
                              <div className="space-y-3">
                                {trafficConversionLocations.map(loc => (
                                  <div 
                                    key={loc.id} 
                                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${formData.adSet.conversionLocation === loc.id ? 'border-fb-blue bg-blue-50/30' : 'border-fb-border hover:bg-fb-header/20'}`}
                                    onClick={() => {
                                      const defaultGoal = trafficPerformanceGoals[loc.id]?.find(g => !g.isHeader)?.id || '';
                                      setFormData({
                                        ...formData, 
                                        adSet: {
                                          ...formData.adSet, 
                                          conversionLocation: loc.id,
                                          performanceGoal: defaultGoal
                                        }
                                      });
                                    }}
                                  >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${formData.adSet.conversionLocation === loc.id ? 'border-fb-blue' : 'border-slate-300'}`}>
                                      {formData.adSet.conversionLocation === loc.id && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full" />}
                                    </div>
                                    <div>
                                      <div className="text-[13px] font-bold">{loc.name}</div>
                                      <div className="text-[11px] text-fb-text-secondary">{loc.desc}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {formData.adSet.conversionLocation === 'messaging_apps' && (
                              <div className="pt-4 border-t border-fb-border space-y-4">
                                <label className="text-[12px] font-bold text-slate-800 flex items-center gap-1">Destinos del mensaje <HelpCircle size={14} className="text-slate-400" /></label>
                                <div className="space-y-2">
                                  {[
                                    { name: 'Messenger', icon: <Send size={16} /> },
                                    { name: 'Instagram', icon: <Camera size={16} /> },
                                    { name: 'WhatsApp', icon: <MessageCircle size={16} /> }
                                  ].map(app => (
                                    <div key={app.name} className="flex items-center justify-between p-3 border border-fb-border rounded-lg bg-slate-50/50">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-fb-blue">
                                          {app.icon}
                                        </div>
                                        <span className="text-[13px] font-bold">{app.name}</span>
                                      </div>
                                      <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded border-slate-300 text-fb-blue" 
                                        checked={formData.ad.messagingApps[app.name.toLowerCase()]} 
                                        onChange={(e) => setFormData({...formData, ad: {...formData.ad, messagingApps: {...formData.ad.messagingApps, [app.name.toLowerCase()]: e.target.checked}}})} 
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {(formData.adSet.conversionLocation === 'instagram_facebook' || formData.adSet.conversionLocation === 'calls') && (
                              <div className="pt-4 border-t border-fb-border space-y-4">
                                <label className="text-[12px] font-bold text-slate-800 flex items-center gap-1">Página de Facebook <HelpCircle size={14} className="text-slate-400" /></label>
                                <div className="flex gap-2">
                                  <select className="meta-editor-input font-bold flex-grow" value={formData.adSet.pageName} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, pageName: e.target.value}})}>
                                    <option value={formData.adSet.pageName}>{formData.adSet.pageName}</option>
                                  </select>
                                  <button className="px-3 border border-fb-border rounded-md hover:bg-fb-header"><Plus size={18} /></button>
                                </div>
                                {formData.adSet.conversionLocation === 'instagram_facebook' && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 border border-fb-border rounded-lg bg-slate-50/50">
                                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600"><Camera size={16} /></div>
                                      <span className="text-[13px] font-bold">Cuenta de Instagram</span>
                                    </div>
                                    <div className="flex items-center gap-4 pl-2">
                                       <label className="flex items-center gap-2 cursor-pointer">
                                          <input type="radio" name="engagement_platform" checked className="accent-fb-blue" />
                                          <span className="text-[12px] font-bold text-slate-700">Perfil de Instagram</span>
                                       </label>
                                       <label className="flex items-center gap-2 cursor-pointer">
                                          <input type="radio" name="engagement_platform" className="accent-fb-blue" />
                                          <span className="text-[12px] font-bold text-slate-700">Página de Facebook</span>
                                       </label>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="pt-4 border-t border-fb-border">
                              <label className="text-[12px] font-bold text-slate-800 block mb-1">Objetivo de rendimiento</label>
                              <select 
                                className="meta-editor-input font-bold" 
                                value={formData.adSet.performanceGoal} 
                                onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, performanceGoal: e.target.value}})}
                              >
                                {trafficPerformanceGoals[formData.adSet.conversionLocation]?.map((goal, idx) => (
                                  goal.isHeader ? <optgroup key={idx} label={goal.name} /> : <option key={goal.id} value={goal.id}>{goal.name}</option>
                                ))}
                              </select>
                              <p className="text-[11px] text-fb-text-secondary mt-1.5 leading-relaxed">
                                {trafficPerformanceGoals[formData.adSet.conversionLocation]?.find(g => g.id === formData.adSet.performanceGoal)?.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : formData.objective === 'engagement' ? (
                        <div className="meta-editor-card p-0">
                          <div className="p-4 border-b border-fb-border flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div>
                            <span className="text-[13px] font-bold">Conversión</span>
                          </div>
                          <div className="p-6 space-y-6">
                            <div>
                              <label className="text-[12px] font-bold text-slate-800 block mb-1">Ubicación de la conversión</label>
                              <p className="text-[11px] text-fb-text-secondary mb-4">Elige dónde quieres aumentar la interacción.</p>
                              <div className="space-y-3">
                                {interactionConversionLocations.map(loc => (
                                  <div 
                                    key={loc.id} 
                                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${formData.adSet.conversionLocation === loc.id ? 'border-fb-blue bg-blue-50/30' : 'border-fb-border hover:bg-fb-header/20'}`}
                                    onClick={() => {
                                      const defaultGoal = interactionPerformanceGoals[loc.id]?.find(g => !g.isHeader)?.id || '';
                                      setFormData({
                                        ...formData, 
                                        adSet: {
                                          ...formData.adSet, 
                                          conversionLocation: loc.id,
                                          performanceGoal: defaultGoal
                                        }
                                      });
                                    }}
                                  >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${formData.adSet.conversionLocation === loc.id ? 'border-fb-blue' : 'border-slate-300'}`}>
                                      {formData.adSet.conversionLocation === loc.id && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full" />}
                                    </div>
                                    <div>
                                      <div className="text-[13px] font-bold">{loc.name}</div>
                                      <div className="text-[11px] text-fb-text-secondary">{loc.desc}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {formData.adSet.conversionLocation === 'messaging_apps' && (
                              <div className="pt-4 border-t border-fb-border space-y-4">
                                <label className="text-[12px] font-bold text-slate-800 flex items-center gap-1">Destinos del mensaje <HelpCircle size={14} className="text-slate-400" /></label>
                                <div className="space-y-2">
                                  {[
                                    { name: 'Messenger', icon: <Send size={16} /> },
                                    { name: 'Instagram', icon: <Camera size={16} /> },
                                    { name: 'WhatsApp', icon: <MessageCircle size={16} /> }
                                  ].map(app => (
                                    <div key={app.name} className="flex items-center justify-between p-3 border border-fb-border rounded-lg bg-slate-50/50">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-fb-blue">
                                          {app.icon}
                                        </div>
                                        <span className="text-[13px] font-bold">{app.name}</span>
                                      </div>
                                      <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded border-slate-300 text-fb-blue" 
                                        checked={formData.ad.messagingApps[app.name.toLowerCase()]} 
                                        onChange={(e) => setFormData({...formData, ad: {...formData.ad, messagingApps: {...formData.ad.messagingApps, [app.name.toLowerCase()]: e.target.checked}}})} 
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {formData.adSet.conversionLocation === 'on_ad' && (
                              <div className="pt-4 border-t border-fb-border space-y-4">
                                <label className="text-[12px] font-bold text-slate-800 block mb-1">Tipo de interacción</label>
                                <select 
                                  className="meta-editor-input font-bold" 
                                  value={formData.adSet.interactionType} 
                                  onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, interactionType: e.target.value}})}
                                >
                                  {interactionTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {formData.adSet.conversionLocation === 'app' && (
                              <div className="pt-4 border-t border-fb-border space-y-4">
                                <label className="text-[12px] font-bold text-slate-800 block mb-1">Tienda de aplicaciones</label>
                                <select 
                                  className="meta-editor-input font-bold" 
                                  value={formData.adSet.appStore} 
                                  onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, appStore: e.target.value}})}
                                >
                                  {appStores.map(store => (
                                    <option key={store.id} value={store.id}>{store.name}</option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {formData.adSet.conversionLocation === 'website' && (
                              <div className="pt-4 border-t border-fb-border space-y-4">
                                <label className="text-[12px] font-bold text-slate-800 block mb-1">Conjunto de datos</label>
                                <div className="p-3 border border-fb-border rounded-lg bg-slate-50/50 flex items-center justify-between">
                                  <span className="text-[13px] font-bold">API Profe Nico</span>
                                  <div className="text-[11px] text-green-600 font-bold flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" /> Activo
                                  </div>
                                </div>
                              </div>
                            )}

                            {(formData.adSet.conversionLocation === 'instagram_facebook' || formData.adSet.conversionLocation === 'calls') && (
                              <div className="pt-4 border-t border-fb-border space-y-4">
                                <label className="text-[12px] font-bold text-slate-800 flex items-center gap-1">Página de Facebook <HelpCircle size={14} className="text-slate-400" /></label>
                                <div className="flex gap-2">
                                  <select className="meta-editor-input font-bold flex-grow" value={formData.adSet.pageName} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, pageName: e.target.value}})}>
                                    <option value={formData.adSet.pageName}>{formData.adSet.pageName}</option>
                                  </select>
                                  <button className="px-3 border border-fb-border rounded-md hover:bg-fb-header"><Plus size={18} /></button>
                                </div>
                              </div>
                            )}

                            <div className="pt-4 border-t border-fb-border">
                              <label className="text-[12px] font-bold text-slate-800 block mb-1">Objetivo de rendimiento</label>
                              <select 
                                className="meta-editor-input font-bold" 
                                value={formData.adSet.performanceGoal} 
                                onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, performanceGoal: e.target.value}})}
                              >
                                {interactionPerformanceGoals[formData.adSet.conversionLocation]?.map((goal, idx) => (
                                  goal.isHeader ? <optgroup key={idx} label={goal.name} /> : <option key={goal.id} value={goal.id}>{goal.name}</option>
                                ))}
                              </select>
                              <p className="text-[11px] text-fb-text-secondary mt-1.5 leading-relaxed">
                                {interactionPerformanceGoals[formData.adSet.conversionLocation]?.find(g => g.id === formData.adSet.performanceGoal)?.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="meta-editor-card p-4 text-[12px] text-fb-text-secondary italic">Configuración de conversión para {formData.objective} próximamente...</div>
                      )}
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
                                  {/* Selected locations list */}
                                  <div className="space-y-2">
                                     {formData.adSet.locations.map(loc => (
                                        <div key={loc.name} className="bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-fb-border/50">
                                           <div className="flex items-center gap-3">
                                              <div className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0"><MapPin size={14} /></div>
                                              {/* Country name with include dropdown */}
                                              <div className="relative">
                                                <button 
                                                  onClick={() => setLocationIncludeOpen(locationIncludeOpen === loc.name ? null : loc.name)}
                                                  className="text-[13px] font-bold flex items-center gap-1 hover:text-fb-blue transition-colors"
                                                >
                                                  {loc.name} <ChevronDown size={12} />
                                                </button>
                                                {locationIncludeOpen === loc.name && (
                                                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-fb-border rounded-lg shadow-2xl z-50 p-4 space-y-3">
                                                    <div className="text-[12px] font-bold text-slate-800 mb-2">Incluir</div>
                                                    <div 
                                                      className={`flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-fb-header/50 ${loc.includeMode === 'all' ? 'text-fb-blue' : ''}`}
                                                      onClick={() => { updateLocationField(loc.name, 'includeMode', 'all'); setLocationIncludeOpen(null); }}
                                                    >
                                                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${loc.includeMode === 'all' ? 'border-fb-blue' : 'border-slate-300'}`}>
                                                        {loc.includeMode === 'all' && <div className="w-2 h-2 bg-fb-blue rounded-full" />}
                                                      </div>
                                                      <span className="text-[12px] font-bold">Incluir todas las áreas</span>
                                                    </div>
                                                    <div>
                                                      <div 
                                                        className={`flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-fb-header/50 ${loc.includeMode === 'cities' ? 'text-fb-blue' : ''}`}
                                                        onClick={() => updateLocationField(loc.name, 'includeMode', 'cities')}
                                                      >
                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${loc.includeMode === 'cities' ? 'border-fb-blue' : 'border-slate-300'}`}>
                                                          {loc.includeMode === 'cities' && <div className="w-2 h-2 bg-fb-blue rounded-full" />}
                                                        </div>
                                                        <span className="text-[12px] font-bold">Incluir solo ciudades</span>
                                                      </div>
                                                      {loc.includeMode === 'cities' && (
                                                        <div className="ml-6 mt-2 space-y-2">
                                                          <span className="text-[11px] text-fb-text-secondary flex items-center gap-1">Con la siguiente población <HelpCircle size={10} /></span>
                                                          <div className="flex items-center gap-2">
                                                            <select className="meta-editor-input text-[11px] font-bold w-28" value={loc.popMin} onChange={(e) => updateLocationField(loc.name, 'popMin', e.target.value)}>
                                                              {populationOptions.map(p => <option key={p} value={p}>{p}</option>)}
                                                            </select>
                                                            <span className="text-[11px] text-slate-400">-</span>
                                                            <select className="meta-editor-input text-[11px] font-bold w-28" value={loc.popMax} onChange={(e) => updateLocationField(loc.name, 'popMax', e.target.value)}>
                                                              {populationOptions.map(p => <option key={p} value={p}>{p}</option>)}
                                                            </select>
                                                          </div>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                           </div>
                                           <div className="relative flex items-center gap-1">
                                             <button 
                                               onClick={() => setLocationMenuOpen(locationMenuOpen === loc.name ? null : loc.name)}
                                               className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600"
                                             >
                                               <MoreHorizontal size={16} />
                                             </button>
                                             {locationMenuOpen === loc.name && (
                                               <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-fb-border rounded-lg shadow-2xl z-50 py-1 overflow-hidden">
                                                 <button onClick={() => { removeLocation(loc.name); setLocationMenuOpen(null); }} className="w-full text-left px-4 py-2.5 text-[12px] text-slate-700 hover:bg-fb-header/50 transition-colors">Excluir ubicación</button>
                                                 <button className="w-full text-left px-4 py-2.5 text-[12px] text-slate-700 hover:bg-fb-header/50 transition-colors">Excluir ciudades</button>
                                                 <button className="w-full text-left px-4 py-2.5 text-[12px] text-slate-700 hover:bg-fb-header/50 transition-colors border-t border-fb-border/50">Informar de un problema</button>
                                               </div>
                                             )}
                                             <button 
                                               onClick={() => removeLocation(loc.name)} 
                                               className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600"
                                             >
                                               <X size={16} />
                                             </button>
                                           </div>
                                        </div>
                                     ))}
                                  </div>
                                  
                                  {/* Search bar with country dropdown */}
                                  <div className="flex gap-2">
                                     <select className="meta-editor-input w-24 font-bold text-[12px]"><option>Incluir</option><option>Excluir</option></select>
                                     <div className="relative flex-grow">
                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                          type="text" 
                                          className="meta-editor-input pl-10 w-full text-[12px]" 
                                          placeholder="Buscar lugares..." 
                                          value={locationSearchQuery}
                                          onChange={(e) => { setLocationSearchQuery(e.target.value); setShowLocationDropdown(e.target.value.length > 0); }}
                                          onFocus={() => { if (locationSearchQuery.length > 0) setShowLocationDropdown(true); }}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                           <span className="text-[11px] font-bold text-slate-500 hover:text-fb-blue cursor-pointer flex items-center gap-1">Explorar <ChevronDown size={12} /></span>
                                        </div>
                                        {showLocationDropdown && (
                                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-fb-border rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto">
                                            {allCountries
                                              .filter(c => c.toLowerCase().includes(locationSearchQuery.toLowerCase()) && !formData.adSet.locations.find(l => l.name === c))
                                              .slice(0, 15)
                                              .map(country => (
                                                <div 
                                                  key={country} 
                                                  onClick={() => addLocationFromDropdown(country)}
                                                  className="px-4 py-2.5 text-[12px] font-medium text-slate-700 hover:bg-fb-header/50 cursor-pointer flex items-center gap-3 transition-colors"
                                                >
                                                  <MapPin size={14} className="text-green-500 flex-shrink-0" />
                                                  {country}
                                                </div>
                                              ))}
                                            {allCountries.filter(c => c.toLowerCase().includes(locationSearchQuery.toLowerCase()) && !formData.adSet.locations.find(l => l.name === c)).length === 0 && (
                                              <div className="px-4 py-3 text-[11px] text-fb-text-secondary text-center">No se encontraron resultados</div>
                                            )}
                                          </div>
                                        )}
                                     </div>
                                  </div>
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
                               <button onClick={() => setShowLanguageModal(true)} className="text-fb-blue text-[11px] font-bold hover:underline">Editar</button>
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

                       {/* --- UBICACIONES --- */}
                       <div className="meta-editor-card p-0">
                          <div className="p-4 border-b border-fb-border flex items-center gap-2">
                             <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div>
                             <span className="text-[13px] font-bold">Ubicaciones</span>
                          </div>
                          <div className="p-6 space-y-6">
                             <p className="text-[11px] text-fb-text-secondary leading-relaxed">
                                Elige dónde aparecerá tu anuncio en las tecnologías de Meta. <span className="text-fb-blue cursor-pointer">Más información</span>
                             </p>

                             <div className="space-y-4">
                                {/* Advantage+ Placements */}
                                <div 
                                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${formData.adSet.placements === 'advantage' ? 'border-fb-blue bg-blue-50/30' : 'border-fb-border hover:bg-fb-header/20'}`}
                                  onClick={() => setFormData({...formData, adSet: {...formData.adSet, placements: 'advantage'}})}
                                >
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${formData.adSet.placements === 'advantage' ? 'border-fb-blue' : 'border-slate-300'}`}>
                                    {formData.adSet.placements === 'advantage' && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full" />}
                                  </div>
                                  <div>
                                    <div className="text-[13px] font-bold flex items-center gap-1">Ubicaciones de Advantage+ (recomendado) <Zap size={14} className="text-fb-blue" /></div>
                                    <div className="text-[11px] text-fb-text-secondary leading-relaxed mt-1">
                                      Usa las ubicaciones de Advantage+ para maximizar tu presupuesto y mostrar tus anuncios a más personas. El sistema de entrega de Facebook distribuirá el presupuesto de tu conjunto de anuncios entre varias ubicaciones según donde sea más probable obtener un mejor rendimiento.
                                    </div>
                                  </div>
                                </div>

                                {/* Manual Placements */}
                                <div 
                                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${formData.adSet.placements === 'manual' ? 'border-fb-blue bg-blue-50/30' : 'border-fb-border hover:bg-fb-header/20'}`}
                                  onClick={() => setFormData({...formData, adSet: {...formData.adSet, placements: 'manual'}})}
                                >
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${formData.adSet.placements === 'manual' ? 'border-fb-blue' : 'border-slate-300'}`}>
                                    {formData.adSet.placements === 'manual' && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full" />}
                                  </div>
                                  <div>
                                    <div className="text-[13px] font-bold">Ubicaciones manuales</div>
                                    <div className="text-[11px] text-fb-text-secondary leading-relaxed mt-1">
                                      Elige manualmente los lugares donde quieres mostrar tu anuncio. Cuantas más ubicaciones selecciones, más oportunidades tendrás de llegar a tu audiencia objetivo y de conseguir tus objetivos de negocio.
                                    </div>
                                  </div>
                                </div>
                             </div>

                             {formData.adSet.placements === 'manual' && (
                               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-6 border-t border-fb-border space-y-8">
                                 {/* Plataformas */}
                                 <div>
                                   <label className="text-[13px] font-bold text-slate-800 block mb-4">Plataformas</label>
                                   <div className="grid grid-cols-2 gap-4">
                                     {['Facebook', 'Instagram', 'Audience Network', 'Messenger', 'Threads', 'WhatsApp'].map(platform => (
                                       <label key={platform} className="flex items-center gap-3 cursor-pointer group">
                                         <input 
                                           type="checkbox" 
                                           className="w-5 h-5 rounded border-slate-300 text-fb-blue focus:ring-fb-blue" 
                                           defaultChecked={platform !== 'Threads'}
                                         />
                                         <span className="text-[13px] text-slate-700">{platform}</span>
                                       </label>
                                     ))}
                                   </div>
                                 </div>

                                 {/* Ubicaciones (Categories) */}
                                 <div>
                                   <div className="flex items-center justify-between mb-4">
                                     <label className="text-[13px] font-bold text-slate-800">Ubicaciones</label>
                                     <span className="text-[11px] text-fb-text-secondary">18 de 18 ubicaciones admiten la personalización de activos</span>
                                   </div>

                                   <div className="space-y-4">
                                     {/* Feeds */}
                                     <div className="border border-fb-border rounded-lg overflow-hidden">
                                       <div className="bg-fb-header p-3 flex items-center justify-between border-b border-fb-border">
                                         <div className="flex items-center gap-2">
                                           <ChevronDown size={16} className="text-slate-400" />
                                           <span className="text-[12px] font-bold">Feeds</span>
                                         </div>
                                         <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                                       </div>
                                       <div className="p-3 space-y-3 bg-white">
                                         <p className="text-[11px] text-fb-text-secondary">Aumenta la visibilidad de tu empresa con anuncios en los feeds</p>
                                         {['Feed de Facebook', 'Feed del perfil de Facebook', 'Feed de Instagram', 'Feed del perfil de Instagram', 'Facebook Marketplace', 'Columna derecha de Facebook'].map(item => (
                                           <label key={item} className="flex items-center justify-between group cursor-pointer">
                                             <span className="text-[11px] text-slate-700 group-hover:text-fb-blue">{item}</span>
                                             <input type="checkbox" className="w-4 h-4 rounded" defaultChecked={item !== 'Columna derecha de Facebook'} />
                                           </label>
                                         ))}
                                       </div>
                                     </div>

                                     {/* Historias y Reels */}
                                     <div className="border border-fb-border rounded-lg overflow-hidden">
                                       <div className="bg-fb-header p-3 flex items-center justify-between border-b border-fb-border">
                                         <div className="flex items-center gap-2">
                                           <ChevronDown size={16} className="text-slate-400" />
                                           <span className="text-[12px] font-bold">Historias, estado y reels</span>
                                         </div>
                                         <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                                       </div>
                                       <div className="p-3 space-y-3 bg-white">
                                         <p className="text-[11px] text-fb-text-secondary">Cuenta una historia más visual y atractiva mediante anuncios verticales</p>
                                         {['Instagram Stories', 'Facebook Stories', 'Messenger Stories', 'Instagram Reels', 'Facebook Reels', 'Estado de WhatsApp'].map(item => (
                                           <label key={item} className="flex items-center justify-between group cursor-pointer">
                                             <span className="text-[11px] text-slate-700 group-hover:text-fb-blue">{item}</span>
                                             <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                                           </label>
                                         ))}
                                       </div>
                                     </div>

                                     {/* Resultados de búsqueda */}
                                     <div className="border border-fb-border rounded-lg overflow-hidden">
                                       <div className="bg-fb-header p-3 flex items-center justify-between border-b border-fb-border">
                                         <div className="flex items-center gap-2">
                                           <ChevronDown size={16} className="text-slate-400" />
                                           <span className="text-[12px] font-bold">Resultados de la búsqueda</span>
                                         </div>
                                         <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                                       </div>
                                       <div className="p-3 space-y-3 bg-white">
                                         <p className="text-[11px] text-fb-text-secondary">Aprovecha las búsquedas que hacen las personas para dar a conocer tu empresa</p>
                                         {['Resultados de búsqueda en Facebook', 'Resultados de búsqueda en Instagram'].map(item => (
                                           <label key={item} className="flex items-center justify-between group cursor-pointer">
                                             <span className="text-[11px] text-slate-700 group-hover:text-fb-blue">{item}</span>
                                             <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                                           </label>
                                         ))}
                                       </div>
                                     </div>
                                   </div>
                                 </div>
                               </motion.div>
                             )}
                          </div>
                       </div>

                      <div className="meta-editor-card p-6"><div className="justification-box"><span className="justification-title">Justificación</span><textarea className="justification-input" placeholder="Justificación estratégica del conjunto de anuncios..." value={formData.adSet.adSetJustification} onChange={(e) => setFormData({...formData, adSet: {...formData.adSet, adSetJustification: e.target.value}})} /></div></div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      {/* --- NOMBRE DEL ANUNCIO --- */}
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div>
                            <span className="text-[13px] font-bold">Nombre del anuncio</span>
                         </div>
                         <div className="p-6 flex items-center gap-4">
                            <input 
                              type="text" 
                              className="meta-editor-input flex-grow" 
                              value={formData.ad.name} 
                              onChange={(e) => setFormData({...formData, ad: {...formData.ad, name: e.target.value}})} 
                            />
                            <button className="px-4 py-2 border border-fb-border rounded-md text-[12px] font-bold hover:bg-fb-header transition-colors">Crear plantilla</button>
                         </div>
                      </div>

                      {/* --- ANUNCIO CON SOCIO --- */}
                      <div className="meta-editor-card p-6 flex items-center justify-between">
                         <div>
                            <span className="text-[13px] font-bold">Anuncio con socio</span>
                            <p className="text-[11px] text-fb-text-secondary mt-1">Publica anuncios con creadores, marcas y otras empresas. <span className="text-fb-blue cursor-pointer">Más información</span></p>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-[12px] font-bold text-fb-text-secondary">{formData.ad.partnerAd ? 'Sí' : 'No'}</span>
                            <div 
                              className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData.ad.partnerAd ? 'bg-fb-blue' : 'bg-fb-border'}`} 
                              onClick={() => setFormData({...formData, ad: {...formData.ad, partnerAd: !formData.ad.partnerAd}})}
                            >
                               <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${formData.ad.partnerAd ? 'left-6' : 'left-1'}`} />
                            </div>
                         </div>
                      </div>

                      {/* --- IDENTIDAD --- */}
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div>
                            <span className="text-[13px] font-bold">Identidad</span>
                         </div>
                         <div className="p-6 space-y-6">
                            <p className="text-[12px] text-fb-text-secondary">Los perfiles que se usarán en tu anuncio.</p>
                            
                            <div>
                               <label className="text-[12px] font-bold text-slate-800 block mb-1">* Página de Facebook <Info size={12} className="inline text-slate-400 ml-1" /></label>
                               <div className="bg-slate-50 p-3 border border-fb-border rounded flex items-center justify-between opacity-80">
                                  <div className="flex items-center gap-2">
                                     <div className="w-6 h-6 bg-fb-blue rounded flex items-center justify-center text-white text-[10px] font-bold">T</div>
                                     <span className="text-[13px] font-bold">{formData.adSet.pageName}</span>
                                  </div>
                                  <ChevronDown size={16} className="text-slate-400" />
                               </div>
                               <div className="mt-3 p-4 bg-slate-50 border border-fb-border rounded flex items-start gap-3">
                                  <Info size={16} className="text-slate-500 mt-0.5" />
                                  <p className="text-[11px] text-fb-text-secondary leading-tight">
                                     Selecciona una página para el conjunto de anuncios. En este anuncio debes seleccionar una página que represente a tu empresa... <br/>
                                     <span className="text-fb-blue font-bold cursor-pointer">Seleccionar página</span>
                                  </p>
                               </div>
                            </div>

                            <div>
                               <label className="text-[12px] font-bold text-slate-800 block mb-1">Perfil de Instagram <Info size={12} className="inline text-slate-400 ml-1" /></label>
                               <div className="bg-slate-50 p-3 border border-fb-border rounded flex items-center justify-between opacity-80">
                                  <div className="flex items-center gap-2">
                                     <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-pink-600"><Camera size={14} /></div>
                                     <span className="text-[13px] font-bold">@{formData.adSet.pageName.toLowerCase().replace(' ', '.')}</span>
                                  </div>
                                  <ChevronDown size={16} className="text-slate-400" />
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* --- CONFIGURACIÓN DEL ANUNCIO --- */}
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div>
                            <span className="text-[13px] font-bold">Configuración del anuncio</span>
                         </div>
                         <div className="p-6 space-y-6">
                            <select 
                              className="meta-editor-input font-bold" 
                              value={formData.ad.adConfig}
                              onChange={(e) => setFormData({...formData, ad: {...formData.ad, adConfig: e.target.value}})}
                            >
                               <option value="create">Crear anuncio</option>
                               <option value="existing">Usar publicación existente</option>
                               <option value="creative_hub">Usar modelo de anuncio de Creative Hub</option>
                            </select>

                            <div className="space-y-4">
                               <label className="text-[12px] font-bold text-slate-800 block">Formato <Info size={12} className="inline text-slate-400 ml-1" /></label>
                               <p className="text-[11px] text-fb-text-secondary">Elige un diseño de contenido del anuncio.</p>
                               
                               <div className="p-4 border border-fb-border rounded-lg bg-slate-50/50 flex items-start gap-3">
                                  <Info size={16} className="text-fb-blue mt-0.5" />
                                  <div>
                                     <span className="text-[13px] font-bold block">Cambió la selección de formato</span>
                                     <p className="text-[11px] text-fb-text-secondary leading-relaxed">
                                        Opciones de visualización del formato en "Contenido del anuncio" es la nueva forma de mostrar tu anuncio en formatos de colección... <span className="text-fb-blue cursor-pointer">Información sobre las opciones de visualización</span>
                                     </p>
                                  </div>
                                  <X size={14} className="text-slate-400 cursor-pointer" />
                               </div>

                               <div className="space-y-3 pt-2">
                                  <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setFormData({...formData, ad: {...formData.ad, format: 'single'}})}>
                                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.ad.format === 'single' ? 'border-fb-blue' : 'border-slate-300'}`}>
                                        {formData.ad.format === 'single' && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full" />}
                                     </div>
                                     <span className="text-[13px] text-slate-700">Un solo vídeo o imagen</span>
                                  </label>
                                  <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setFormData({...formData, ad: {...formData.ad, format: 'carousel'}})}>
                                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.ad.format === 'carousel' ? 'border-fb-blue' : 'border-slate-300'}`}>
                                        {formData.ad.format === 'carousel' && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full" />}
                                     </div>
                                     <span className="text-[13px] text-slate-700">Secuencia</span>
                                  </label>
                               </div>

                               <div className="pt-4 border-t border-fb-border">
                                  <label className="flex items-center gap-3 cursor-pointer">
                                     <input 
                                       type="checkbox" 
                                       className="w-5 h-5 rounded border-slate-300 text-fb-blue" 
                                       checked={formData.ad.multiAd}
                                       onChange={(e) => setFormData({...formData, ad: {...formData.ad, multiAd: e.target.checked}})}
                                     />
                                     <div>
                                        <span className="text-[13px] font-bold">Anuncios multianunciante</span>
                                        <p className="text-[11px] text-fb-text-secondary">Tu anuncio puede aparecer con otros en el mismo bloque de anuncios para contribuir a fomentar el descubrimiento...</p>
                                     </div>
                                  </label>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* --- DESTINO --- */}
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div>
                            <span className="text-[13px] font-bold">Destino</span>
                         </div>
                         <div className="p-6 space-y-6">
                            <p className="text-[11px] text-fb-text-secondary leading-relaxed">Dinos dónde quieres que se dirija a las personas inmediatamente después de que toquen tu anuncio o hagan clic en él. <span className="text-fb-blue cursor-pointer">Más información</span></p>
                            
                            <div className="space-y-4">
                               {(formData.objective === 'traffic' ? [
                                 { id: 'website', name: 'Sitio web', desc: 'Dirige a las personas a tu sitio web.', icon: <LinkIcon size={16} /> },
                                 { id: 'app', name: 'App', desc: 'Dirige a las personas a tu aplicación.', icon: <Smartphone size={16} /> },
                                 { id: 'messaging_apps', name: 'Aplicaciones de mensajería', desc: 'Dirige a la gente a Messenger, Instagram y WhatsApp.', icon: <MessageCircle size={16} /> },
                                 { id: 'call', name: 'Llamada', desc: 'Permite que las personas te llamen directamente.', icon: <Phone size={16} /> }
                               ] : [
                                 { id: 'instant_experience', name: 'Experiencia instantánea', desc: 'Dirige a las personas a una experiencia de carga rápida optimizada para móviles.', icon: <Smartphone size={16} /> },
                                 { id: 'website', name: 'Sitio web', desc: 'Dirige a las personas a tu sitio web.', icon: <LinkIcon size={16} /> },
                                 { id: 'call', name: 'Llamada', desc: 'Permite que las personas te llamen directamente.', icon: <Phone size={16} /> },
                                 { id: 'messaging_apps', name: 'Aplicaciones de mensajería', desc: 'Dirige a la gente a Messenger, Instagram y WhatsApp.', icon: <MessageCircle size={16} /> }
                               ]).map(opt => (
                                 <div key={opt.id} className="space-y-3">
                                   <label className="flex items-start gap-3 cursor-pointer group" onClick={() => setFormData({...formData, ad: {...formData.ad, destination: opt.id}})}>
                                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${formData.ad.destination === opt.id ? 'border-fb-blue' : 'border-slate-300'}`}>
                                         {formData.ad.destination === opt.id && <div className="w-2.5 h-2.5 bg-fb-blue rounded-full" />}
                                      </div>
                                      <div className="flex gap-3">
                                         <div className="text-slate-400 mt-0.5">{opt.icon}</div>
                                         <div>
                                            <div className="text-[13px] font-bold">{opt.name}</div>
                                            <div className="text-[11px] text-fb-text-secondary">{opt.desc}</div>
                                         </div>
                                      </div>
                                   </label>
                                   
                                   {opt.id === 'website' && formData.ad.destination === 'website' && (
                                     <div className="pl-8 space-y-4 pb-2">
                                       <div>
                                         <label className="text-[11px] font-bold text-slate-600 block mb-1">URL del sitio web</label>
                                         <input 
                                           type="text" 
                                           className="meta-editor-input text-[13px]" 
                                           placeholder="https://ejemplo.com"
                                           value={formData.ad.destinationUrl}
                                           onChange={(e) => setFormData({...formData, ad: {...formData.ad, destinationUrl: e.target.value}})}
                                         />
                                       </div>
                                       <div>
                                         <label className="text-[11px] font-bold text-slate-600 block mb-1 flex items-center gap-1">Enlace visible <HelpCircle size={12} /></label>
                                         <input 
                                           type="text" 
                                           className="meta-editor-input text-[13px]" 
                                           placeholder="ejemplo.com"
                                           value={formData.ad.displayLink}
                                           onChange={(e) => setFormData({...formData, ad: {...formData.ad, displayLink: e.target.value}})}
                                         />
                                       </div>
                                     </div>
                                   )}

                                   {opt.id === 'call' && formData.ad.destination === 'call' && (
                                     <div className="pl-8 pb-2">
                                       <label className="text-[11px] font-bold text-slate-600 block mb-1">Número de teléfono</label>
                                       <div className="flex gap-2">
                                         <div className="px-3 py-2 border border-fb-border rounded bg-fb-header/20 text-[13px] font-bold">+56</div>
                                         <input 
                                           type="text" 
                                           className="meta-editor-input flex-grow text-[13px]" 
                                           placeholder="9 1234 5678"
                                           value={formData.ad.phoneNumber}
                                           onChange={(e) => setFormData({...formData, ad: {...formData.ad, phoneNumber: e.target.value}})}
                                         />
                                       </div>
                                     </div>
                                   )}
                                 </div>
                               ))}
                            </div>

                            {formData.ad.destination === 'messaging_apps' && (
                               <div className="pl-8 space-y-4 pt-2">
                                  {[
                                    { id: 'messenger', name: 'Messenger', icon: <div className="w-8 h-8 bg-fb-blue rounded-full flex items-center justify-center text-white text-[12px] font-bold">M</div>, sub: formData.adSet.pageName },
                                    { id: 'instagram', name: 'Instagram', icon: <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600"><Camera size={16} /></div>, sub: `@${formData.adSet.pageName.toLowerCase().replace(' ', '.')}` },
                                    { id: 'whatsapp', name: 'WhatsApp', icon: <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600"><MessageCircle size={16} /></div>, sub: 'Conectar perfil', action: true }
                                  ].map(app => (
                                    <div key={app.id} className="flex items-center justify-between p-3 border border-fb-border rounded-lg bg-slate-50/50">
                                      <div className="flex items-center gap-3">
                                         {app.icon}
                                         <div><div className="text-[13px] font-bold">{app.name}</div><div className="text-[11px] text-fb-text-secondary">{app.sub}</div></div>
                                      </div>
                                      <div className="flex gap-2">
                                         {app.action && <button className="px-3 py-1 border border-fb-border rounded text-[11px] font-bold hover:bg-white">Conectar</button>}
                                         <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-fb-blue" checked={formData.ad.messagingApps[app.id]} onChange={(e) => setFormData({...formData, ad: {...formData.ad, messagingApps: {...formData.ad.messagingApps, [app.id]: e.target.checked}}})} />
                                      </div>
                                    </div>
                                  ))}
                               </div>
                            )}
                         </div>
                      </div>

                      {/* --- CONTENIDO DEL ANUNCIO --- */}
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div>
                            <span className="text-[13px] font-bold">Contenido del anuncio</span>
                         </div>
                         <div className="p-6 space-y-6">
                            <p className="text-[11px] text-fb-text-secondary leading-relaxed">Selecciona y optimiza el texto, el contenido multimedia y las mejoras de tus anuncios.</p>
                            
                            <div className="flex gap-2">
                               <div className="relative group flex-grow">
                                  <button className="w-full p-2 border border-fb-border rounded text-[13px] font-bold flex items-center justify-between hover:bg-slate-50">
                                     <span>Configurar contenido</span>
                                     <ChevronDown size={16} />
                                  </button>
                                  <div className="hidden group-focus-within:block absolute top-full left-0 right-0 mt-1 bg-white border border-fb-border rounded shadow-xl z-50 overflow-hidden">
                                     <div className="p-3 hover:bg-fb-header cursor-pointer flex items-center gap-2 border-b border-fb-border/50" onClick={() => document.getElementById('ad-media-upload').click()}>
                                        <Plus size={16} className="text-fb-blue" /> <span className="text-[13px] font-bold text-fb-blue">Añadir imagen</span>
                                     </div>
                                     <div className="p-2 hover:bg-fb-header cursor-pointer flex items-center gap-2" onClick={() => setFormData({...formData, ad: {...formData.ad, mediaType: 'image'}})}>
                                        <ImageIcon size={14} className="text-slate-500" /> <span className="text-[13px]">Seleccionar de la cuenta</span>
                                     </div>
                                     <div className="p-2 hover:bg-fb-header cursor-pointer flex items-center gap-2" onClick={() => setFormData({...formData, ad: {...formData.ad, mediaType: 'video'}})}>
                                        <Video size={14} className="text-slate-500" /> <span className="text-[13px]">Añadir vídeo</span>
                                     </div>
                                  </div>
                                  <input 
                                    id="ad-media-upload"
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        const url = URL.createObjectURL(file);
                                        setFormData({...formData, ad: {...formData.ad, mediaUrl: url, mediaType: 'image'}});
                                      }
                                    }}
                                  />
                               </div>
                               <button className="px-4 py-2 border border-fb-border rounded text-[13px] font-bold hover:bg-slate-50">Configurar prueba</button>
                            </div>

                            {/* FORMAT REMINDERS */}
                            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg flex gap-3">
                               <Info size={18} className="text-fb-blue mt-0.5 flex-shrink-0" />
                               <div className="space-y-1">
                                 <span className="text-[12px] font-bold text-slate-800">Recordatorio de formatos</span>
                                 <div className="grid grid-cols-2 gap-4 pt-1">
                                   <div>
                                     <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Móvil / Stories</div>
                                     <div className="text-[11px] text-slate-700 font-bold">Relación 9:16 (Vertical)</div>
                                     <div className="text-[10px] text-slate-500 italic">Ej: 1080 x 1920 px</div>
                                   </div>
                                   <div>
                                     <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Escritorio / Feed</div>
                                     <div className="text-[11px] text-slate-700 font-bold">Relación 1:1 o 4:5</div>
                                     <div className="text-[10px] text-slate-500 italic">Ej: 1080 x 1080 px</div>
                                   </div>
                                 </div>
                               </div>
                            </div>

                            <div className={`border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center bg-slate-50/30 overflow-hidden ${formData.ad.mediaUrl ? 'p-0 h-[300px]' : 'p-12 space-y-4'}`}>
                               {formData.ad.mediaUrl ? (
                                 <div className="relative w-full h-full group">
                                   <img src={formData.ad.mediaUrl} className="w-full h-full object-contain bg-slate-900/5" alt="Vista previa del anuncio" />
                                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                     <button 
                                       className="bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                                       onClick={() => document.getElementById('ad-media-upload').click()}
                                     >
                                       <RotateCcw size={18} className="text-slate-700" />
                                     </button>
                                     <button 
                                       className="bg-red-500 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                                       onClick={() => setFormData({...formData, ad: {...formData.ad, mediaUrl: null}})}
                                     >
                                       <Trash2 size={18} className="text-white" />
                                     </button>
                                   </div>
                                 </div>
                               ) : (
                                 <>
                                   <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300">
                                      {formData.ad.mediaType === 'image' ? <ImageIcon size={40} /> : <Video size={40} />}
                                   </div>
                                   <p className="text-[12px] text-fb-text-secondary font-bold">Añade contenido multimedia para ver ejemplos de anuncios.</p>
                                   <button 
                                     className="px-4 py-2 bg-fb-blue text-white rounded text-[12px] font-bold hover:bg-fb-blue/90 transition-colors"
                                     onClick={() => document.getElementById('ad-media-upload').click()}
                                   >
                                     Añadir imagen
                                   </button>
                                 </>
                               )}
                            </div>
                         </div>
                      </div>

                      {/* --- SEGUIMIENTO --- */}
                      <div className="meta-editor-card p-0">
                         <div className="p-4 border-b border-fb-border flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-green-500 flex items-center justify-center text-green-500"><Check size={12} strokeWidth={3} /></div>
                            <span className="text-[13px] font-bold">Seguimiento</span>
                         </div>
                         <div className="p-6 space-y-6">
                            <p className="text-[11px] text-fb-text-secondary leading-relaxed">
                               Elige los eventos de conversión a los que quieres hacerles seguimiento. Se hará seguimiento de forma predeterminada del conjunto de datos de conversión seleccionado de esta cuenta publicitaria.
                            </p>

                            <div className="space-y-4">
                               <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                     <input 
                                       type="checkbox" 
                                       className="w-5 h-5 rounded border-slate-300 text-fb-blue" 
                                       checked={formData.ad.tracking.websiteEvents}
                                       onChange={(e) => setFormData({...formData, ad: {...formData.ad, tracking: {...formData.ad.tracking, websiteEvents: e.target.checked}}})}
                                     />
                                     <span className="text-[13px] text-slate-700">Eventos del sitio web</span>
                                  </div>
                                  {formData.ad.tracking.websiteEvents && (
                                     <div className="pl-8 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                        <span className="text-[11px] font-bold text-green-600 tracking-wider">API PROFE NICO</span>
                                     </div>
                                  )}

                                  <div className="flex items-center gap-3">
                                     <input 
                                       type="checkbox" 
                                       className="w-5 h-5 rounded border-slate-300 text-fb-blue" 
                                       checked={formData.ad.tracking.appEvents}
                                       onChange={(e) => setFormData({...formData, ad: {...formData.ad, tracking: {...formData.ad.tracking, appEvents: e.target.checked}}})}
                                     />
                                     <span className="text-[13px] text-slate-700">Eventos de la aplicación</span>
                                  </div>
                                  {formData.ad.tracking.appEvents && (
                                     <div className="pl-8 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                        <span className="text-[11px] font-bold text-green-600 tracking-wider">API PROFE NICO</span>
                                     </div>
                                  )}

                                  <div className="flex items-center gap-3">
                                     <input 
                                       type="checkbox" 
                                       className="w-5 h-5 rounded border-slate-300 text-fb-blue" 
                                       checked={formData.ad.tracking.offlineEvents}
                                       onChange={(e) => setFormData({...formData, ad: {...formData.ad, tracking: {...formData.ad.tracking, offlineEvents: e.target.checked}}})}
                                     />
                                     <span className="text-[13px] text-slate-700">Eventos offline</span>
                                     <Info size={14} className="text-slate-400" />
                                  </div>
                               </div>

                               <div className="pt-4 border-t border-fb-border space-y-4">
                                  <div>
                                     <label className="text-[12px] font-bold text-slate-800 flex items-center justify-between">Parámetros de URL <Info size={14} className="text-slate-400" /></label>
                                     <input 
                                       type="text" 
                                       className="meta-editor-input mt-1" 
                                       placeholder="key1=value1&key2=value2"
                                       value={formData.ad.tracking.urlParams} 
                                       onChange={(e) => setFormData({...formData, ad: {...formData.ad, tracking: {...formData.ad.tracking, urlParams: e.target.value}}})} 
                                     />
                                     <button onClick={() => setShowUtmModal(true)} className="text-fb-blue text-[11px] font-bold mt-1 hover:underline">Crear un parámetro de URL</button>
                                  </div>

                                  <div className="space-y-1">
                                     <span className="text-[12px] font-bold text-slate-800">Herramienta de informes de terceros</span>
                                     <p className="text-[11px] text-fb-text-secondary leading-relaxed">
                                        Es posible que las compras de Meta no se incluyan en tus informes de Google. Conecta tu cuenta para medir las acciones de los anuncios... <span className="text-fb-blue cursor-pointer">Más información</span>
                                     </p>
                                     <button className="px-4 py-2 border border-fb-border rounded text-[13px] font-bold hover:bg-fb-header">Conectar</button>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="meta-editor-card p-6">
                         <div className="justification-box">
                            <span className="justification-title">Justificación</span>
                            <textarea 
                              className="justification-input" 
                              placeholder="Justificación estratégica del anuncio..." 
                              value={formData.ad.creativeStrategyJustification} 
                              onChange={(e) => setFormData({...formData, ad: {...formData.ad, creativeStrategyJustification: e.target.value}})} 
                            />
                         </div>
                      </div>
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
          {showLanguageModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-fb-border flex items-center justify-between">
                  <span className="font-bold text-slate-800">Seleccionar idiomas</span>
                  <button onClick={() => setShowLanguageModal(false)} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                </div>
                <div className="p-4 max-h-[400px] overflow-y-auto grid grid-cols-1 gap-2">
                  {commonLanguages.map(lang => (
                    <label key={lang} className="flex items-center gap-3 p-2 hover:bg-fb-header rounded-md cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 text-fb-blue focus:ring-fb-blue" 
                        checked={formData.adSet.languages.includes(lang)}
                        onChange={() => toggleLanguage(lang)}
                      />
                      <span className="text-[13px] font-bold text-slate-700 group-hover:text-fb-blue">{lang}</span>
                    </label>
                  ))}
                </div>
                <div className="p-4 border-t border-fb-border flex justify-end">
                  <button onClick={() => setShowLanguageModal(false)} className="px-6 py-2 bg-fb-blue text-white rounded-md font-bold text-[13px] hover:bg-blue-700">Listo</button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default Simulator;
