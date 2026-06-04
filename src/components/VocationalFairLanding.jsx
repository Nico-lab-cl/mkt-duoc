import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas-pro';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  School, 
  Calendar,
  Sparkles, 
  QrCode, 
  Download, 
  RefreshCw, 
  Check,
  Zap,
  Home,
  Layout,
  MessageSquare,
  BarChart,
  Lock,
  ArrowRight,
  ChevronRight,
  Info,
  ShieldCheck
} from 'lucide-react';

const CITIES = [
  'Valparaíso',
  'Viña del Mar',
  'Quilpué',
  'Villa Alemana',
  'Concón',
  'Limache',
  'Quillota',
  'San Antonio',
  'San Felipe',
  'Los Andes',
  'Casablanca',
  'Quintero',
  'Olmué',
  'Algarrobo',
  'El Quisco',
  'El Tabo',
  'La Calera',
  'Puchuncaví',
  'Zapallar',
  'Papudo',
  'Otra'
];

const TEST_OPTIONS = [
  {
    id: 'A',
    text: 'Grabar y editar Reels/TikToks dinámicos con ganchos virales mostrando las hamburguesas.',
    role: 'Social Media Content',
    badge: 'Viral Video Specialist',
    rpgClass: 'VIRAL VIDEO SPECIALIST',
    color: 'from-green-400 to-emerald-600',
    textNeon: 'text-green-400',
    skills: [
      { name: 'Viralidad / Hooks', val: 95 },
      { name: 'Creatividad Visual', val: 90 },
      { name: 'Edición TikTok/Reels', val: 85 }
    ]
  },
  {
    id: 'B',
    text: 'Crear un servidor de Discord para fans y hacer dinámicas y sorteos semanales de hamburguesas.',
    role: 'Community Manager',
    badge: 'Community Architect',
    rpgClass: 'COMMUNITY ARCHITECT',
    color: 'from-pink-400 to-rose-600',
    textNeon: 'text-pink-400',
    skills: [
      { name: 'Engagement / Sorteos', val: 92 },
      { name: 'Estrategia Social', val: 90 },
      { name: 'Gestión de Discord', val: 85 }
    ]
  },
  {
    id: 'C',
    text: 'Lanzar campañas de anuncios pagados dirigidos a los fans de streamers en Latinoamérica.',
    role: 'Trafficker / Paid Media',
    badge: 'Growth Ads Specialist',
    rpgClass: 'GROWTH ADS SPECIALIST',
    color: 'from-cyan-400 to-blue-600',
    textNeon: 'text-cyan-400',
    skills: [
      { name: 'Retorno Inversión (ROI)', val: 95 },
      { name: 'Segmentación de Públicos', val: 92 },
      { name: 'Paid Ads (Meta/TikTok)', val: 88 }
    ]
  },
  {
    id: 'D',
    text: 'Pagar para que cuando la gente busque "hambre" o "comida rápida" en Google, salgamos primeros.',
    role: 'Especialista SEM',
    badge: 'SEM Manager',
    rpgClass: 'SEM MANAGER',
    color: 'from-yellow-400 to-amber-600',
    textNeon: 'text-yellow-400',
    skills: [
      { name: 'Optimización AdWords', val: 94 },
      { name: 'Análisis de Pujas', val: 90 },
      { name: 'Copywriting Comercial', val: 85 }
    ]
  },
  {
    id: 'E',
    text: 'Optimizar la web de Beast Burger para que aparezca primera en Google de forma gratis.',
    role: 'Consultor SEO',
    badge: 'SEO Growth Hacker',
    rpgClass: 'SEO GROWTH HACKER',
    color: 'from-orange-400 to-red-600',
    textNeon: 'text-orange-400',
    skills: [
      { name: 'Tráfico Orgánico', val: 96 },
      { name: 'Link Building', val: 88 },
      { name: 'Auditoría Técnica Web', val: 90 }
    ]
  },
  {
    id: 'F',
    text: 'Analizar los gráficos de visitas por minuto y ventas para saber qué ciudades tienen más demanda.',
    role: 'Data Analyst',
    badge: 'Data Analytics Guru',
    rpgClass: 'DATA ANALYTICS GURU',
    color: 'from-purple-400 to-indigo-600',
    textNeon: 'text-purple-400',
    skills: [
      { name: 'Visualización Looker', val: 95 },
      { name: 'Modelado de Atribución', val: 90 },
      { name: 'KPIs & Dashboards', val: 92 }
    ]
  }
];

const SOCIAL_MEDIA = [
  { 
    id: 'TikTok', 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
      </svg>
    ), 
    color: 'hover:border-slate-100 hover:bg-slate-900' 
  },
  { 
    id: 'Instagram', 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ), 
    color: 'hover:border-pink-500 hover:bg-pink-950/30' 
  },
  { 
    id: 'YouTube', 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
      </svg>
    ), 
    color: 'hover:border-red-500 hover:bg-red-950/30' 
  },
  { 
    id: 'Twitch', 
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9H9V6h2v5zm4 0h-2V6h2v5z"></path>
      </svg>
    ), 
    color: 'hover:border-purple-500 hover:bg-purple-950/30' 
  },
  {
    id: 'Facebook',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    ),
    color: 'hover:border-blue-600 hover:bg-blue-950/30'
  },
  {
    id: 'LinkedIn',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
    color: 'hover:border-blue-500 hover:bg-blue-950/30'
  },
  {
    id: 'Reddit',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.5a2.5 2.5 0 0 1-4.8 1 12.8 12.8 0 0 0-4.7-1.3l1-3.6 3.1.7a1.5 1.5 0 1 1 0 3H16.6l-3.3-.8-1 4a12.8 12.8 0 0 0-4.7 1.3 2.5 2.5 0 1 1-2.1-4.1 2.5 2.5 0 0 1 2.1 1.1c1.5-.7 3.3-1.1 5.3-1.2l1-4.2a1 1 0 0 1 .8-.8l4 .9a1.5 1.5 0 1 1 .1 1.7M12 18c2.8 0 5-1.8 5-4H7c0 2.2 2.2 4 5 4z"></path>
      </svg>
    ),
    color: 'hover:border-orange-500 hover:bg-orange-950/30'
  },
  {
    id: 'X',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
      </svg>
    ),
    color: 'hover:border-slate-400 hover:bg-slate-900/50'
  },
  {
    id: 'Kick',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="3"></rect>
        <path d="M8 8v8h2v-3h2v3h2V8h-2v3h-2V8H8z"></path>
      </svg>
    ),
    color: 'hover:border-green-500 hover:bg-green-950/30'
  }
];

// TOUR_SLIDES removed - replaced with direct dashboard and simulator tour;

const CHILEAN_NAMES = [
  'Catalina Orellana', 'Benjamín Soto', 'Sofía Henríquez', 'Diego Valenzuela',
  'Isidora Carrasco', 'Nicolás Fuentes', 'Florencia Muñoz', 'Bastián Contreras',
  'Martina Yáñez', 'Sebastián Araya', 'Camila Poblete', 'Ignacio Espinosa',
  'Javiera Vergara', 'Matías Lagos', 'Valentina Gajardo', 'Lucas Riquelme',
  'Antonia Olivares', 'Joaquín Castro', 'Emilia Pardo', 'Vicente Sandoval'
];

const VocationalFairLanding = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    region: 'Región de Valparaíso',
    city: '',
    school: '',
    email: '',
    phone: '',
    favorite_social: [], // Ahora es un array para selección múltiple
    test_answer: ''
  });

  const [step, setStep] = useState('tour-intro'); // 'tour-intro' | 'software-tour' | 'form' | 'credential'
  const [softwareStep, setSoftwareStep] = useState(0); // 0: Dashboard, 1: Meta Ads, 2: Marketing Conversacional, 3: Lead Magnet, 4: N8N Automatizaciones, 5: Laboratorio de Analíticas y KPI
  
  // Mockups de Simulación
  const [mockBudget, setMockBudget] = useState(150000);
  const [mockPlatform, setMockPlatform] = useState('Instagram');
  const [mockAge, setMockAge] = useState('18-24');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy Spectra Bot 🤖. Bienvenido al taller de Marketing Digital de Duoc UC. Haz clic en una opción para interactuar:' }
  ]);
  const [autoNode, setAutoNode] = useState(-1); // -1: idle, 0: Webhook, 1: AI, 2: WhatsApp
  const [autoRunning, setAutoRunning] = useState(false);
  const [autoFinished, setAutoFinished] = useState(false);
  const [mockCity, setMockCity] = useState('Valparaíso');

  // Lead Magnet Simulator States
  const [lmTemplate, setLmTemplate] = useState('Ebook');
  const [lmColor, setLmColor] = useState('cyan');
  const [lmCta, setLmCta] = useState('¡Descargar Ebook Gratis!');
  const [lmLeadsCount, setLmLeadsCount] = useState(42);
  const [lmSubmitted, setLmSubmitted] = useState(false);
  const [lmTestName, setLmTestName] = useState('');
  const [lmTestEmail, setLmTestEmail] = useState('');

  // Lead Magnet Traffic Simulation
  const [lmSimulationActive, setLmSimulationActive] = useState(false);
  const [lmVisitsCount, setLmVisitsCount] = useState(168);
  const [lmRecentLeads, setLmRecentLeads] = useState([
    { name: 'Claudio Muñoz', city: 'Valparaíso', time: 'Hace 2 min' },
    { name: 'Francisca Rojas', city: 'Viña del Mar', time: 'Hace 5 min' },
    { name: 'Matías Silva', city: 'Quilpué', time: 'Hace 8 min' }
  ]);
  const [lmFlash, setLmFlash] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll para el chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Simulación de Tráfico para Lead Magnet
  useEffect(() => {
    let interval = null;
    if (lmSimulationActive) {
      interval = setInterval(() => {
        const newVisits = Math.floor(Math.random() * 5) + 3;
        setLmVisitsCount(prev => prev + newVisits);
        
        if (Math.random() < 0.28) {
          setLmLeadsCount(prev => prev + 1);
          setLmFlash(true);
          setTimeout(() => setLmFlash(false), 500);

          const randomName = CHILEAN_NAMES[Math.floor(Math.random() * CHILEAN_NAMES.length)];
          const randomCity = CITIES.filter(c => c !== 'Otra')[Math.floor(Math.random() * (CITIES.length - 1))];
          const newLead = {
            name: randomName,
            city: randomCity,
            time: 'Hace unos segundos'
          };
          setLmRecentLeads(prev => [newLead, ...prev.slice(0, 3)]);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lmSimulationActive]);

  const handleChatOption = (userText, botResponse) => {
    const userMsg = { sender: 'user', text: userText };
    const botMsg = { sender: 'bot', text: botResponse };
    setChatMessages(prev => [...prev, userMsg, botMsg]);
  };

  const runAutomation = () => {
    if (autoRunning) return;
    setAutoRunning(true);
    setAutoFinished(false);
    setAutoNode(0);
    
    setTimeout(() => setAutoNode(1), 1000);
    setTimeout(() => setAutoNode(2), 2000);
    setTimeout(() => {
      setAutoRunning(false);
      setAutoFinished(true);
      setAutoNode(-1);
    }, 3000);
  };

  const [whatsappDigits, setWhatsappDigits] = useState(''); // Solo 8 dígitos
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [assignedLead, setAssignedLead] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodingStep, setDecodingStep] = useState(0);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - (box.width / 2);
    const y = e.clientY - box.top - (box.height / 2);
    
    // Rotación suave 3D de máx 12 grados
    const factorX = -(y / (box.height / 2)) * 12;
    const factorY = (x / (box.width / 2)) * 12;
    
    // Posición del reflejo lumínico
    const shineX = ((e.clientX - box.left) / box.width) * 100;
    const shineY = ((e.clientY - box.top) / box.height) * 100;

    setRotate({ x: factorX, y: factorY });
    setShine({ x: shineX, y: shineY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setShine({ x: 50, y: 50 });
  };

  React.useEffect(() => {
    // Habilitar scroll vertical en el body
    document.body.style.setProperty('overflow', 'auto', 'important');
    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectSocial = (socialId) => {
    setFormData(prev => {
      const current = prev.favorite_social || [];
      let updated;
      if (current.includes(socialId)) {
        updated = current.filter(s => s !== socialId);
      } else {
        updated = [...current, socialId];
      }
      return { ...prev, favorite_social: updated };
    });
  };

  const handleSelectOption = (optId) => {
    setFormData(prev => ({ ...prev, test_answer: optId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.city || formData.favorite_social.length === 0 || !formData.test_answer) {
      setErrorMsg('Por favor completa todos los campos requeridos marcados con *');
      return;
    }

    if (whatsappDigits.length !== 8) {
      setErrorMsg('El número de WhatsApp de por sí debe tener exactamente 8 dígitos después de +56 9');
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      phone: '+569' + whatsappDigits, // Concatenar prefijo chileno oficial
      favorite_social: formData.favorite_social.join(', ') // Guardar como string separado por comas
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (data.success) {
        setAssignedLead(data.lead);
        
        // Iniciar secuencia de decodificación interactiva cyberpunk
        setIsDecoding(true);
        setDecodingStep(0);
        
        // Simular progreso de análisis paso a paso en la Matrix
        setTimeout(() => setDecodingStep(1), 700);
        setTimeout(() => setDecodingStep(2), 1400);
        setTimeout(() => setDecodingStep(3), 2100);
        setTimeout(() => {
          setIsDecoding(false);
          setStep('credential');
        }, 2800);
      } else {
        setErrorMsg(data.error || 'Error al guardar tus datos. Inténtalo nuevamente.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error de red al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const element = document.getElementById('digital-credential');
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 3, // Alta calidad
        backgroundColor: '#0f172a',
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `credencial_${formData.first_name.toLowerCase()}_${formData.last_name.toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error al descargar la credencial:', err);
      alert('Hubo un error al generar la imagen. Por favor toma una captura de pantalla.');
    } finally {
      setDownloading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      age: '',
      region: 'Región de Valparaíso',
      city: '',
      school: '',
      email: '',
      phone: '',
      favorite_social: [],
      test_answer: ''
    });
    setWhatsappDigits('');
    setStep('tour-intro');
    setSoftwareStep(0);
    setAssignedLead(null);
    setLmSimulationActive(false);
    setLmVisitsCount(168);
    setLmLeadsCount(42);
    setLmRecentLeads([
      { name: 'Claudio Muñoz', city: 'Valparaíso', time: 'Hace 2 min' },
      { name: 'Francisca Rojas', city: 'Viña del Mar', time: 'Hace 5 min' },
      { name: 'Matías Silva', city: 'Quilpué', time: 'Hace 8 min' }
    ]);
  };

  const selectedOptDetails = TEST_OPTIONS.find(o => o.id === (assignedLead?.test_answer || formData.test_answer)) || TEST_OPTIONS[0];

  return (
    // CAMBIO DE ESTILO: Se removió overflow-hidden para permitir el scroll natural de la página en dispositivos y resoluciones pequeñas
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-4 sm:p-8 font-sans selection:bg-cyan-500 selection:text-slate-900 relative overflow-x-hidden">
      {/* Elementos decorativos de fondo (Neon glow) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <div className="w-full max-w-7xl text-left mb-8 sm:mb-12 mt-4 z-10 flex flex-col items-start">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-cyan-400 text-sm font-black uppercase tracking-widest mb-4 animate-pulse">
          <Sparkles size={14} /> Feria Vocacional Duoc UC
        </div>
        <h1 className="text-4xl sm:text-7xl font-black tracking-tight uppercase leading-none bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent italic">
          Genera tu Identidad Digital
        </h1>
        <p className="text-slate-400 mt-3 text-base sm:text-lg font-semibold max-w-3xl text-left">
          Ingeniería en Marketing Digital • Descubre tu rol en la Matrix digital y descarga tu credencial Cyberpunk personalizada.
        </p>
      </div>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-7xl z-10 pb-16">
        {step === 'tour-intro' ? (
          /* PÁGINA DE BIENVENIDA */
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col items-start text-left space-y-6 animate-fade-in relative overflow-hidden max-w-2xl mx-auto w-full">
            {/* Glow decorativo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-5 rounded-full blur-2xl pointer-events-none" />

            <div className="w-full flex justify-start items-center pb-4 border-b border-slate-850">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                BIENVENIDA • INGENIERÍA EN MARKETING DIGITAL DUOC UC
              </span>
            </div>

            {/* Icono de Módulo */}
            <div className="w-24 h-24 rounded-[1.8rem] bg-slate-950 border border-cyan-500/30 flex items-center justify-center shadow-2xl shadow-cyan-500/10 transition-transform duration-500 hover:scale-105">
              <svg className="w-12 h-12 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <span className="text-[10px] sm:text-xs font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-widest block">
                EXPERIENCIA INTERACTIVA
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight italic leading-tight">
                Bienvenido a la Matrix de Spectra
              </h2>
            </div>

            {/* Descripción */}
            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed text-justify">
              Hoy vas a sumergirte en el software que usan nuestros estudiantes universitarios. Aprenderás a dominar los canales digitales que mueven millones de dólares en el mundo real. Navega libremente por la plataforma y, al finalizar el recorrido, conoce tu vocación en Marketing Digital para descargar tu credencial cyberpunk personalizada.
            </p>

            {/* Botones de Navegación del Tour */}
            <div className="w-full pt-4">
              <button
                type="button"
                onClick={() => {
                  setStep('software-tour');
                  setSoftwareStep(0);
                }}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-indigo-950/40 transition-all cursor-pointer"
              >
                Iniciar Desafío
              </button>
            </div>
          </div>
        ) : step === 'software-tour' ? (
          /* RECORRIDO INTERACTIVO POR EL SOFTWARE MOCKUP */
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col space-y-6 animate-fade-in relative overflow-hidden w-full">
            {/* Cabecera del Dashboard Mockup */}
            <div className="w-full flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-white italic text-sm shadow">
                  S
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-black text-white tracking-tight uppercase leading-none">Spectra Simulator</h3>
                  <span className="text-[9px] font-bold text-slate-500 tracking-wider block mt-1">SOFTWARE DE ENTRENAMIENTO MARTECH</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="hidden sm:inline-block text-[8px] font-black text-green-400 uppercase tracking-widest bg-green-950/30 px-2 py-0.5 rounded border border-green-900/20 mr-1">
                  API PROFE NICO: CONECTADA
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                  MODO INVITADO VIP
                </span>
              </div>
            </div>

            {/* Layout Cuerpo: Sidebar + Contenido */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[480px]">
              {/* Sidebar */}
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-slate-800/80 md:pr-4">
                <button
                  type="button"
                  onClick={() => setSoftwareStep(0)}
                  className={`flex items-center gap-3 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer w-full text-left whitespace-nowrap ${
                    softwareStep === 0 ? 'bg-cyan-600/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]' : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setSoftwareStep(1)}
                  className={`flex items-center gap-3 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer w-full text-left whitespace-nowrap ${
                    softwareStep === 1 ? 'bg-blue-600/10 border border-blue-500/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]' : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                  1. Meta Ads
                </button>
                <button
                  type="button"
                  onClick={() => setSoftwareStep(2)}
                  className={`flex items-center gap-3 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer w-full text-left whitespace-nowrap ${
                    softwareStep === 2 ? 'bg-green-600/10 border border-green-500/30 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.15)]' : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  2. M. Conversacional
                </button>
                <button
                  type="button"
                  onClick={() => setSoftwareStep(3)}
                  className={`flex items-center gap-3 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer w-full text-left whitespace-nowrap ${
                    softwareStep === 3 ? 'bg-amber-600/10 border border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]' : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  3. Lead Magnet
                </button>
                <button
                  type="button"
                  onClick={() => setSoftwareStep(4)}
                  className={`flex items-center gap-3 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer w-full text-left whitespace-nowrap ${
                    softwareStep === 4 ? 'bg-orange-600/10 border border-orange-500/30 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)]' : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  4. N8N Automación
                </button>
                <button
                  type="button"
                  onClick={() => setSoftwareStep(5)}
                  className={`flex items-center gap-3 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer w-full text-left whitespace-nowrap ${
                    softwareStep === 5 ? 'bg-purple-600/10 border border-purple-500/30 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.15)]' : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                  5. Lab Analíticas
                </button>
              </div>

              <div className="md:col-span-3 flex flex-col justify-between min-h-[480px]">
                {softwareStep === 0 && (
                  /* VISTA DASHBOARD (INICIO) */
                  <div className="space-y-8 animate-fade-in text-left">
                    {/* Hero Welcome banner */}
                    <div className="bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-slate-900/80 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-cyan-950/5">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                      <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-2">Canales de Simulación Activos</h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
                        ¡Bienvenido/a al panel de control de Spectra! Aquí aprenderás cómo las marcas configuran sus anuncios en redes sociales, responden automáticamente a miles de personas por chat, regalan cosas para conseguir contactos interesados y analizan estadísticas en mapas en tiempo real. ¡Elige cualquiera de los módulos activos para empezar a simular!
                      </p>
                    </div>

                    {/* Card Grid - Much bigger and more interactive */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Meta Ads Card */}
                      <div 
                        onClick={() => setSoftwareStep(1)}
                        className="bg-slate-955/80 backdrop-blur border border-slate-800 rounded-2xl p-6 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:bg-slate-900/40 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[220px] group shadow-lg hover:-translate-y-1"
                      >
                        <div className="space-y-4">
                          <div className="w-14 h-14 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                          </div>
                          <div>
                            <h4 className="text-base font-black uppercase text-white tracking-wider group-hover:text-blue-400 transition-colors">Meta Ads</h4>
                            <p className="text-sm text-slate-400 mt-2 leading-relaxed text-left text-justify">
                              Crea anuncios pagados para Instagram y Facebook. Elige cuánto dinero gastar al mes y mira a cuántas personas puedes llegar.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-900">
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-950/60 px-2.5 py-1 rounded border border-blue-800/30">Módulo Activo</span>
                          <span className="text-sm font-bold text-slate-500 uppercase flex items-center gap-1 group-hover:text-blue-400 transition-colors">Simular →</span>
                        </div>
                      </div>

                      {/* Marketing Conversacional Card */}
                      <div 
                        onClick={() => setSoftwareStep(2)}
                        className="bg-slate-950/80 backdrop-blur border border-slate-800 rounded-2xl p-6 hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:bg-slate-900/40 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[220px] group shadow-lg hover:-translate-y-1"
                      >
                        <div className="space-y-4">
                          <div className="w-14 h-14 bg-green-600/10 text-green-400 border border-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                          </div>
                          <div>
                            <h4 className="text-base font-black uppercase text-white tracking-wider group-hover:text-green-400 transition-colors">M. Conversacional</h4>
                            <p className="text-sm text-slate-400 mt-2 leading-relaxed text-left text-justify">
                              Crea respuestas automáticas para tus chats. Simula un robot de WhatsApp que atiende y responde las dudas de los clientes al instante.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-900">
                          <span className="text-[10px] font-black text-green-400 uppercase tracking-widest bg-green-950/60 px-2.5 py-1 rounded border border-green-800/30">Módulo Activo</span>
                          <span className="text-sm font-bold text-slate-500 uppercase flex items-center gap-1 group-hover:text-green-400 transition-colors">Simular →</span>
                        </div>
                      </div>

                      {/* Lead Magnet Card */}
                      <div 
                        onClick={() => setSoftwareStep(3)}
                        className="bg-slate-955/80 backdrop-blur border border-slate-800 rounded-2xl p-6 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:bg-slate-900/40 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[220px] group shadow-lg hover:-translate-y-1"
                      >
                        <div className="space-y-4">
                          <div className="w-14 h-14 bg-amber-600/10 text-amber-400 border border-amber-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                          </div>
                          <div>
                            <h4 className="text-base font-black uppercase text-white tracking-wider group-hover:text-amber-400 transition-colors">Lead Magnet</h4>
                            <p className="text-sm text-slate-400 mt-2 leading-relaxed text-left text-justify">
                              Ofrece un regalo virtual (como un descuento de hamburguesas) a cambio de los datos de contacto del cliente para venderles después.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-900">
                          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-955/60 px-2.5 py-1 rounded border border-amber-800/30">Módulo Activo</span>
                          <span className="text-sm font-bold text-slate-500 uppercase flex items-center gap-1 group-hover:text-amber-400 transition-colors">Simular →</span>
                        </div>
                      </div>

                      {/* N8N Automatizaciones Card */}
                      <div 
                        onClick={() => setSoftwareStep(4)}
                        className="bg-slate-955/80 backdrop-blur border border-slate-800 rounded-2xl p-6 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:bg-slate-900/40 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[220px] group shadow-lg hover:-translate-y-1"
                      >
                        <div className="space-y-4">
                          <div className="w-14 h-14 bg-orange-600/10 text-orange-400 border border-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                          </div>
                          <div>
                            <h4 className="text-base font-black uppercase text-white tracking-wider group-hover:text-orange-400 transition-colors">N8N Automatizaciones</h4>
                            <p className="text-sm text-slate-400 mt-2 leading-relaxed text-left text-justify">
                              Conecta aplicaciones entre sí. Haz que cuando un cliente compre, la Inteligencia Artificial analice sus datos y le mande un WhatsApp automático.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-900">
                          <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest bg-orange-950/60 px-2.5 py-1 rounded border border-orange-800/30">Módulo Activo</span>
                          <span className="text-sm font-bold text-slate-500 uppercase flex items-center gap-1 group-hover:text-orange-400 transition-colors">Simular →</span>
                        </div>
                      </div>

                      {/* Laboratorio de Analíticas y KPI Card */}
                      <div 
                        onClick={() => setSoftwareStep(5)}
                        className="bg-slate-955/80 backdrop-blur border border-slate-800 rounded-2xl p-6 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:bg-slate-900/40 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[220px] group shadow-lg hover:-translate-y-1"
                      >
                        <div className="space-y-4">
                          <div className="w-14 h-14 bg-purple-600/10 text-purple-400 border border-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                          </div>
                          <div>
                            <h4 className="text-base font-black uppercase text-white tracking-wider group-hover:text-purple-400 transition-colors">Lab de Analíticas y KPI</h4>
                            <p className="text-sm text-slate-400 mt-2 leading-relaxed text-left text-justify">
                              Analiza los resultados de tus campañas. Mira cuánta gente hizo clic en tus anuncios, cuánto dinero ganaste y filtra las estadísticas por tu comuna.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-900">
                          <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest bg-purple-950/60 px-2.5 py-1 rounded border border-purple-800/30">Módulo Activo</span>
                          <span className="text-sm font-bold text-slate-500 uppercase flex items-center gap-1 group-hover:text-purple-400 transition-colors">Simular →</span>
                        </div>
                      </div>
                    </div>

                    {/* Locked Modules Section - Marked as "Solo para alumnos" */}
                    <div className="space-y-4 pt-6 border-t border-slate-800/50">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Otros Módulos del Software (Exclusivos para Alumnos)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                          { name: 'Google Ads', desc: 'Anuncios en el buscador de Google. Para aparecer primero cuando la gente busca algo que quiere comprar.' },
                          { name: 'TikTok Ads', desc: 'Anuncios con videos divertidos e interactivos en TikTok para conectar con personas de tu edad.' },
                          { name: 'WhatsApp API', desc: 'Envío masivo de mensajes y robots automáticos a gran escala para atender a miles de clientes a la vez.' }
                        ].map(mod => (
                          <div key={mod.name} className="bg-slate-950/40 border border-slate-900/60 rounded-2xl p-5 flex flex-col justify-between min-h-[155px] relative select-none">
                            <div className="absolute top-4 right-4 text-slate-700">
                              <Lock size={16} />
                            </div>
                            <div className="space-y-2">
                              <span className="text-sm font-black text-slate-500 block leading-none">{mod.name}</span>
                              <p className="text-[11px] text-slate-600 leading-relaxed text-left text-justify">{mod.desc}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-900/40 flex items-center justify-between">
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">Solo para alumnos</span>
                              <span className="text-[9px] font-bold text-slate-700 uppercase tracking-wider">Próximamente</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {softwareStep === 1 && (
                  /* SIMULADOR META ADS */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in text-left">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-black uppercase text-blue-400 tracking-wider">Campaña de Publicidad Digital (Meta Ads)</h4>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 block">Configuración de Anuncio</span>
                      </div>
                      
                      <p className="text-sm text-slate-300 leading-relaxed text-justify">
                        ¿Has visto los anuncios con la etiqueta "Publicidad" mientras navegas por Instagram o Facebook? Eso es Meta Ads. En vez de publicar gratis para tus amigos, le pagas a la plataforma para que tu anuncio (como un video o imagen de MrBeast Burger) le aparezca sí o sí a miles de jóvenes de tu edad y de la comuna que tú elijas.
                      </p>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dinero Mensual a Gastar</label>
                        <input
                          type="range"
                          min="10000"
                          max="500000"
                          step="10000"
                          value={mockBudget}
                          onChange={(e) => setMockBudget(Number(e.target.value))}
                          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-sm font-bold text-slate-300">
                          <span>$10.000 CLP</span>
                          <span className="text-blue-400 font-black">${mockBudget.toLocaleString('es-CL')} CLP</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Red Social del Anuncio</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Facebook', 'Instagram', 'Ambas'].map(plat => (
                            <button
                              key={plat}
                              type="button"
                              onClick={() => {
                                setMockPlatform(plat);
                              }}
                              className={`py-2 px-3 rounded-lg text-center font-bold text-xs uppercase border transition-all cursor-pointer ${
                                mockPlatform === plat || (plat === 'Ambas' && (mockPlatform !== 'Facebook' && mockPlatform !== 'Instagram'))
                                  ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)]' 
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              {plat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Edades de la gente que lo verá</label>
                        <select
                          value={mockAge}
                          onChange={(e) => setMockAge(e.target.value)}
                          className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-lg text-sm font-bold text-slate-300 outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="15-18">15-18 años (Escolares de Media)</option>
                          <option value="18-24">18-24 años (Universitarios / Egresados)</option>
                          <option value="25-34">25-34 años (Profesionales Jóvenes)</option>
                        </select>
                      </div>

                      {/* Calculated metrics details */}
                      <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2.5">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Resultados estimados de tu publicidad</div>
                        <div className="grid grid-cols-2 gap-3 text-left">
                          <div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase block">Gente que verá el anuncio 👤</span>
                            <span className="text-sm font-black text-white block mt-0.5">{Math.floor(mockBudget * 0.18).toLocaleString('es-CL')} pers.</span>
                          </div>
                          <div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase block">Contactos interesados 💬</span>
                            <span className="text-sm font-black text-white block mt-0.5">{Math.floor(mockBudget / 900).toLocaleString('es-CL')} personas</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Meta Ads Preview Card (Instagram/Facebook template) */}
                    <div className="bg-slate-955 border border-slate-855 rounded-2xl p-4 flex flex-col justify-between max-w-[340px] mx-auto w-full shadow-xl relative overflow-hidden">
                      {/* Glow background */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-slate-900">
                        {mockPlatform === 'Facebook' ? (
                          // Facebook Avatar
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-xs shadow">f</div>
                        ) : (
                          // Instagram Avatar
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center font-black text-white text-[11px] shadow-sm">IG</div>
                        )}
                        <div>
                          <span className="text-xs font-black text-white block">
                            {mockPlatform === 'Facebook' ? 'Spectra Marketing Digital' : 'spectra_digital'}
                          </span>
                          <span className="text-[9px] text-slate-500 block">
                            Publicidad • {mockPlatform === 'Facebook' ? 'Facebook Feed' : 'Instagram Feed'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Interactive Image Box - showing rankaspect image */}
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-805/80 shadow-inner group">
                        <img 
                          src="/meta-ads-optimize.png" 
                          className="w-full h-full object-cover" 
                          alt="Meta Ads Optimize" 
                        />
                        <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-2 py-0.5 rounded text-[8px] font-mono text-cyan-400 font-bold">
                          PRESUPUESTO: ${mockBudget.toLocaleString('es-CL')}
                        </div>
                      </div>
                      
                      {/* Bottom Info Bar depending on platform */}
                      {mockPlatform === 'Facebook' ? (
                        <div className="mt-3 bg-slate-900/60 border border-slate-850 p-2 rounded-xl flex items-center justify-between gap-2">
                          <div className="text-left max-w-[70%]">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase truncate">Spectra Duoc UC</span>
                            <span className="text-xs font-black text-white block leading-snug truncate">Estudia Ingeniería en Marketing Digital</span>
                          </div>
                          <button type="button" className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black uppercase text-[9px] tracking-wider rounded border border-slate-700 cursor-pointer">
                            Más Info
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-900">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 block">Audiencia: {mockAge}</span>
                            <span className="text-[8px] font-medium text-slate-500 block">Segmento Escolar</span>
                          </div>
                          <button type="button" className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-505 text-white font-black uppercase text-[9px] tracking-widest rounded-lg cursor-pointer transition-colors shadow">
                           Ver Más
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {softwareStep === 2 && (
                  /* SIMULADOR MARKETING CONVERSACIONAL */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in text-left">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-black uppercase text-green-400 tracking-wider">Chat Automático (Marketing Conversacional)</h4>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 block">Diseño de un robot de atención por chat</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed text-justify">
                        ¿Te imaginas atender las preguntas de 1.000 clientes al mismo tiempo? ¡Te volverías loco! Para eso sirven los Chatbots: son robots en WhatsApp o Instagram que programamos para que respondan las preguntas típicas de la gente al instante, de día o de noche, simulando ser una persona real.
                      </p>
                      
                      {/* Node flow diagram mock */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pasos del Robot de Chat</span>
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-3.5 p-3 bg-slate-955 border border-slate-850 rounded-xl">
                            <div className="w-6 h-6 rounded-md bg-green-500/10 text-green-400 flex items-center justify-center font-black text-xs border border-green-500/20 flex-shrink-0">1</div>
                            <div>
                              <span className="text-xs font-black text-white block leading-none">Inicio del chat: WhatsApp</span>
                              <span className="text-[9px] text-slate-500 font-bold block mt-1 uppercase">El cliente escribe un mensaje</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3.5 p-3 bg-slate-955 border border-slate-850 rounded-xl">
                            <div className="w-6 h-6 rounded-md bg-green-500/10 text-green-400 flex items-center justify-center font-black text-xs border border-green-500/20 flex-shrink-0">2</div>
                            <div>
                              <span className="text-xs font-black text-white block leading-none">Menú de dudas frecuentes</span>
                              <span className="text-[9px] text-slate-500 font-bold block mt-1 uppercase">El robot le da varias opciones a elegir</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Smartphone Mockup */}
                    <div className="border-4 border-slate-855 bg-slate-955 rounded-[2.2rem] w-full max-w-[300px] aspect-[9/16] mx-auto p-3.5 flex flex-col justify-between shadow-2xl relative">
                      {/* Notch */}
                      <div className="w-14 h-3.5 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center border border-slate-850/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-850" />
                      </div>
                      
                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 flex flex-col justify-start py-2 custom-scrollbar">
                        {chatMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-2xl text-xs leading-snug font-bold max-w-[85%] ${
                              msg.sender === 'bot' 
                                ? 'bg-slate-900 border border-slate-800 text-slate-200 self-start rounded-tl-none' 
                                : 'bg-green-600 text-white self-end rounded-tr-none shadow-sm animate-fade-in'
                            }`}
                          >
                            {msg.text}
                          </div>
                        ))}
                        {/* Elemento de anclaje para auto-scroll */}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Buttons */}
                      <div className="border-t border-slate-900 pt-2.5 flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleChatOption(
                            '¿De qué se trata la carrera?', 
                            'Estudiarás cómo usar internet, redes sociales y tecnología para hacer crecer marcas y negocios reales. ¡Es muy práctica! ⚡'
                          )}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-green-500/30 text-slate-300 hover:text-green-400 font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer transition-all"
                        >
                          ¿De qué se trata la carrera?
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChatOption(
                            '¿Cuánto dura y dónde se estudia?', 
                            'Dura 4 años (8 semestres) y obtienes el título profesional en Duoc UC de la Región de Valparaíso. 🎓'
                          )}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-green-500/30 text-slate-300 hover:text-green-400 font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer transition-all"
                        >
                          ¿Cuánto dura y dónde se estudia?
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChatOption(
                            '¿Cuáles son los trabajos del futuro?', 
                            'Trabajarás manejando redes sociales, analizando datos de ventas, creando anuncios pagados o automatizando procesos con Inteligencia Artificial. 💼'
                          )}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-green-500/30 text-slate-300 hover:text-green-400 font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer transition-all"
                        >
                          ¿Cuáles son los trabajos del futuro?
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {softwareStep === 3 && (
                  /* SIMULADOR LEAD MAGNET */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in text-left">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-black uppercase text-amber-400 tracking-wider">Campaña de Regalo Digital (Lead Magnet)</h4>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 block">Simula cómo llegan visitas e interesados</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed text-justify">
                        ¿Quién no ama las cosas gratis? Un Lead Magnet es un regalo digital (como un cupón de 50% de descuento o una guía de secretos de tu influencer favorito) que le das a las personas en una página web. A cambio, ellos te dejan su nombre y WhatsApp. Así consigues contactos interesados para ofrecerles tus productos después de forma amistosa.
                      </p>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">1. Selecciona el regalo digital</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'Ebook', label: 'Ebook: 10 Secretos de MrBeast' },
                            { id: 'Descuento', label: 'Cupón: 50% en Beast Burger' }
                          ].map(t => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => {
                                setLmTemplate(t.id);
                                if (t.id === 'Ebook') {
                                  setLmCta('¡Descargar Ebook Gratis!');
                                } else {
                                  setLmCta('¡Reclamar 50% Descuento!');
                                }
                                setLmSubmitted(false);
                              }}
                              className={`py-2 px-3 rounded-lg text-center font-bold text-xs border transition-all cursor-pointer ${
                                lmTemplate === t.id ? 'bg-amber-600/20 border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">2. Personaliza el Color del Botón</label>
                        <div className="flex gap-2">
                          {[
                            { id: 'cyan', colorClass: 'bg-cyan-500', name: 'Cyan neón' },
                            { id: 'purple', colorClass: 'bg-purple-500', name: 'Morado Matrix' },
                            { id: 'green', colorClass: 'bg-emerald-500', name: 'Tóxico Green' }
                          ].map(c => (
                            <button
                              key={c.id}
                              type="button"
                              title={c.name}
                              onClick={() => setLmColor(c.id)}
                              className={`w-6 h-6 rounded-full ${c.colorClass} border-2 transition-all cursor-pointer ${
                                lmColor === c.id ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-90'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Simulation Controls */}
                      <div className="space-y-3 pt-2 border-t border-slate-800/60">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">3. Panel de Simulación de Tráfico</label>
                        <button
                          type="button"
                          onClick={() => setLmSimulationActive(!lmSimulationActive)}
                          className={`w-full py-2.5 rounded-xl font-black uppercase text-sm tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                            lmSimulationActive 
                              ? 'bg-red-700 hover:bg-red-650 text-white shadow-[0_0_15px_rgba(220,38,38,0.25)]' 
                              : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 text-white shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                          }`}
                        >
                          {lmSimulationActive ? (
                            <>
                              <span className="w-2.5 h-2.5 rounded-full bg-red-450 animate-ping" />
                              <span>Pausar Simulación ⏸️</span>
                            </>
                          ) : (
                            <>
                              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                              <span>¡Simular Tráfico en Vivo! ⚡</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Lead Magnet Metrics Display */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-center">
                          <span className="text-[8px] font-bold text-slate-500 block uppercase tracking-wide">Visitas en Vivo 👁️</span>
                          <span className="text-base font-black text-white block mt-0.5">{lmVisitsCount}</span>
                        </div>
                        <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-center">
                          <span className="text-[8px] font-bold text-slate-500 block uppercase tracking-wide">Interesados (Leads) 📝</span>
                          <span className="text-base font-black text-white block mt-0.5">{lmLeadsCount}</span>
                        </div>
                        <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-center">
                          <span className="text-[8px] font-bold text-slate-500 block uppercase tracking-wide">Tasa de Conversión 📈</span>
                          <span className="text-base font-black text-amber-400 block mt-0.5">
                            {lmVisitsCount > 0 ? ((lmLeadsCount / lmVisitsCount) * 100).toFixed(1) + '%' : '0%'}
                          </span>
                        </div>
                      </div>

                      {/* Live capture logs */}
                      <div className="p-3 bg-slate-950 border border-slate-855 rounded-xl">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Historial de Leads Capturados en la Simulación:</span>
                        <div className="space-y-1.5 max-h-[85px] overflow-y-auto">
                          {lmRecentLeads.map((l, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs font-mono text-slate-350 bg-slate-900/50 p-1.5 rounded border border-slate-850/50 animate-fade-in">
                              <span className="font-bold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {l.name}
                              </span>
                              <span className="text-[9px] text-slate-500">{l.city} • {l.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Live Preview Container (Landing Page mockup) */}
                    <div className={`bg-slate-950 border rounded-2xl p-4 flex flex-col justify-between max-w-[340px] mx-auto w-full shadow-xl relative overflow-hidden transition-all duration-300 ${
                      lmFlash ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] scale-[1.01]' : 'border-slate-855'
                    }`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-900">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Ejemplo de Landing Page</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${lmSimulationActive ? 'bg-amber-500 animate-ping' : 'bg-slate-600'}`} />
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            {lmSimulationActive ? 'Simulando tráfico' : 'Página activa'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 flex-1 flex flex-col justify-between space-y-3 min-h-[220px] relative">
                        {lmTemplate === 'Ebook' ? (
                          <div className="space-y-1.5 text-center my-auto">
                            <div className="w-12 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded shadow-md mx-auto flex items-center justify-center text-xs font-black text-slate-955 uppercase tracking-tighter">
                              BOOK
                            </div>
                            <h5 className="text-xs font-black text-white uppercase tracking-tight leading-tight mt-2">10 Leyes del Growth Marketing</h5>
                            <p className="text-[10px] text-slate-400 leading-snug">El ebook definitivo para estallar tus conversiones.</p>
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-center my-auto">
                            <div className="w-14 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-md mx-auto flex items-center justify-center text-sm font-black text-slate-955">
                              🍔 50%
                            </div>
                            <h5 className="text-xs font-black text-white uppercase tracking-tight leading-tight mt-2">MrBeast Burger Taller Especial</h5>
                            <p className="text-[10px] text-slate-400 leading-snug">Descuento exclusivo para alumnos de la feria vocacional.</p>
                          </div>
                        )}

                        <div className="space-y-2 opacity-80 pointer-events-none select-none">
                          <div className="relative">
                            <input 
                              type="text" 
                              readOnly
                              value={lmSimulationActive && lmRecentLeads.length > 0 ? lmRecentLeads[0].name : 'Camila Silva'} 
                              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-850 rounded-md text-xs font-semibold text-slate-400 outline-none"
                            />
                            <span className="absolute right-2.5 top-1.5 text-[9px] font-mono text-slate-600">Nombre</span>
                          </div>
                          <div className="relative">
                            <input 
                              type="text" 
                              readOnly
                              value={lmSimulationActive && lmRecentLeads.length > 0 ? lmRecentLeads[0].name.toLowerCase().split(' ')[0] + '@correo.com' : 'camila@correo.com'} 
                              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-850 rounded-md text-xs font-semibold text-slate-400 outline-none"
                            />
                            <span className="absolute right-2.5 top-1.5 text-[9px] font-mono text-slate-600">Email</span>
                          </div>
                          <button
                            type="button"
                            className={`w-full py-2 font-black uppercase text-[10px] tracking-wider rounded-lg text-white transition-all cursor-pointer ${
                              lmColor === 'cyan' ? 'bg-cyan-600 shadow-[0_0_10px_rgba(6,182,212,0.3)]' :
                              lmColor === 'purple' ? 'bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.3)]' :
                              'bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                            }`}
                          >
                            {lmCta}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {softwareStep === 4 && (
                  /* SIMULADOR AUTOMATIZACIÓN */
                  <div className="flex flex-col gap-5 animate-fade-in justify-center items-center py-2 text-left">
                    <div className="w-full">
                      <h4 className="text-sm font-black uppercase text-orange-400 tracking-wider">N8N Automatizaciones</h4>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 block">Integraciones en Segundo Plano</span>
                    </div>
                    
                    <p className="text-sm text-slate-350 leading-relaxed text-justify w-full">
                      ¿Imaginas tener que copiar el WhatsApp de cada persona que se registra en tu página y enviarle un mensaje a mano? Sería eterno. Con N8N creas automatizaciones: una regla digital secreta que dice: "Apenas alguien se registre, mándale este WhatsApp personalizado usando Inteligencia Artificial". Todo pasa en 2 segundos, de forma automática y sin que muevas un dedo.
                    </p>
                    
                    {/* Workflow Canvas */}
                    <div className="w-full max-w-lg bg-slate-950 border border-slate-850 rounded-2xl p-6 flex flex-col items-center justify-between shadow-lg relative overflow-hidden min-h-[180px]">
                      {/* grid background pattern */}
                      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
                      
                      <div className="w-full flex justify-between items-center relative py-4 z-10">
                        {/* Connecting Lines */}
                        <div className="absolute top-[24px] left-[15%] right-[15%] h-0.5 bg-slate-800 z-0" />
                        <div 
                          className="absolute top-[24px] left-[15%] h-0.5 bg-gradient-to-r from-orange-500 via-amber-400 to-green-500 transition-all duration-[2000ms] ease-out z-0" 
                          style={{ width: autoNode === -1 ? '0%' : autoNode === 0 ? '30%' : autoNode === 1 ? '70%' : '75%' }}
                        />

                        {/* Node 1: Webhook */}
                        <div className={`flex flex-col items-center gap-1.5 z-10 w-1/3 transition-all duration-300 ${autoNode >= 0 ? 'scale-105' : 'opacity-40'}`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border font-bold text-xs ${
                            autoNode === 0 
                              ? 'bg-orange-500/20 border-orange-500 text-orange-400 animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                              : autoNode > 0 ? 'bg-orange-600 border-orange-600 text-white' : 'bg-slate-950 border-slate-805 text-slate-500'
                          }`}>
                            Webhook
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Registro Web</span>
                        </div>

                        {/* Node 2: n8n AI Classifier */}
                        <div className={`flex flex-col items-center gap-1.5 z-10 w-1/3 transition-all duration-300 ${autoNode >= 1 ? 'scale-105' : 'opacity-40'}`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border font-bold text-xs ${
                            autoNode === 1 
                              ? 'bg-amber-500/20 border-amber-500 text-amber-400 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                              : autoNode > 1 ? 'bg-amber-600 border-amber-600 text-white' : 'bg-slate-950 border-slate-805 text-slate-500'
                          }`}>
                            n8n / IA
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">IA Clasificación</span>
                        </div>

                        {/* Node 3: WhatsApp */}
                        <div className={`flex flex-col items-center gap-1.5 z-10 w-1/3 transition-all duration-300 ${autoNode >= 2 ? 'scale-105' : 'opacity-40'}`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border font-bold text-xs ${
                            autoNode === 2 
                              ? 'bg-green-500/20 border-green-500 text-green-400 animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                              : autoFinished ? 'bg-green-600 border-green-600 text-white' : 'bg-slate-950 border-slate-805 text-slate-500'
                          }`}>
                            WhatsApp
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Envío Mensaje</span>
                        </div>
                      </div>
                    </div>

                    {/* Platform logos & triggers */}
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                      {/* Logos official Zapier / Make / n8n */}
                      <div className="flex items-center gap-3">
                        {/* n8n */}
                        <div className="flex items-center gap-1 bg-slate-955 px-2.5 py-1.5 rounded-lg border border-slate-855 shadow-sm" title="n8n Integration">
                          <svg className="w-5 h-4 text-[#FF6D5A]" viewBox="0 0 228 120" fill="currentColor">
                            <path d="M204 48C192.817 48 183.42 40.3514 180.756 30H153.248C147.382 30 142.376 34.241 141.412 40.0272L140.425 45.9456C139.489 51.5648 136.646 56.4554 132.626 60C136.646 63.5446 139.489 68.4352 140.425 74.0544L141.412 79.9728C142.376 85.759 147.382 90 153.248 90H156.756C159.42 79.6486 168.817 72 180 72C193.255 72 204 82.7452 204 96C204 109.255 193.255 120 180 120C168.817 120 159.42 112.351 156.756 102H153.248C141.516 102 131.504 93.5181 129.575 81.9456L128.588 76.0272C127.624 70.241 122.618 66 116.752 66H107.244C104.58 76.3514 95.183 84 84 84C72.817 84 63.4204 76.3514 60.7561 66H47.2439C44.5796 76.3514 35.183 84 24 84C10.7452 84 0 73.2548 0 60C0 46.7452 10.7452 36 24 36C35.183 36 44.5796 43.6486 47.2439 54H60.7561C63.4204 43.6486 72.817 36 84 36C95.183 36 104.58 43.6486 107.244 54H116.752C122.618 54 127.624 49.759 128.588 43.9728L129.575 38.0544C131.504 26.4819 141.516 18 153.248 18L180.756 18C183.42 7.64864 192.817 0 204 0C217.255 0 228 10.7452 228 24C228 37.2548 217.255 48 204 48ZM204 36C210.627 36 216 30.6274 216 24C216 17.3726 210.627 12 204 12C197.373 12 192 17.3726 192 24C192 30.6274 197.373 36 204 36ZM24 72C30.6274 72 36 66.6274 36 60C36 53.3726 30.6274 48 24 48C17.3726 48 12 53.3726 12 60C12 66.6274 17.3726 72 24 72ZM96 60C96 66.6274 90.6274 72 84 72C77.3726 72 72 66.6274 72 60C72 53.3726 77.3726 48 84 48C90.6274 48 96 53.3726 96 60ZM192 96C192 102.627 186.627 108 180 108C173.373 108 168 102.627 168 96C168 89.3726 173.373 84 180 84C186.627 84 192 89.3726 192 96Z" />
                          </svg>
                          <span className="text-[9px] text-slate-400 font-black uppercase">n8n</span>
                        </div>
                        
                        {/* Zapier */}
                        <div className="flex items-center gap-1.5 bg-slate-955 px-2.5 py-1.5 rounded-lg border border-slate-855 shadow-sm" title="Zapier Integration">
                          <svg className="w-3.5 h-3.5 text-[#FF4F00]" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="2" y="16" width="20" height="5" rx="1.5" />
                          </svg>
                          <span className="text-[9px] text-slate-400 font-black uppercase">Zapier</span>
                        </div>
                        
                        {/* Make */}
                        <div className="flex items-center gap-1.5 bg-slate-955 px-2.5 py-1.5 rounded-lg border border-slate-855 shadow-sm" title="Make Integration">
                          <div className="flex items-center justify-center w-3.5 h-3.5 relative">
                            <circle cx="3" cy="10" r="3" fill="#4B0082" />
                            <circle cx="8" cy="6" r="2.5" fill="#8A2BE2" opacity="0.95" />
                            <circle cx="9" cy="11" r="2.2" fill="#DA70D6" opacity="0.85" />
                          </div>
                          <span className="text-[9px] text-slate-400 font-black uppercase">Make</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={autoRunning}
                        onClick={runAutomation}
                        className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-black uppercase text-xs tracking-widest rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                      >
                        <Zap size={10} className={autoRunning ? 'animate-bounce' : ''} />
                        <span>{autoRunning ? 'Corriendo...' : autoFinished ? 'Ejecutado con Éxito ✓' : 'Ejecutar Integración'}</span>
                      </button>
                    </div>
                    
                    {autoFinished && (
                      <p className="text-xs text-emerald-450 font-mono font-bold animate-fade-in bg-emerald-950/20 px-3 py-2 rounded-xl border border-emerald-900/30 w-full">
                        [SUCCESS]: Lead recibido de la web, clasificado por IA como 'GROWTH MARKETING' y mensaje enviado a WhatsApp.
                      </p>
                    )}
                  </div>
                )}

                {softwareStep === 5 && (
                  /* SIMULADOR ANALÍTICA */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in text-left">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-black uppercase text-purple-400 tracking-wider">Laboratorio de Analíticas y KPI</h4>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 block font-bold">Monitoreo de Conversiones y Métricas</span>
                      </div>
                      
                      <p className="text-sm text-slate-300 leading-relaxed text-justify">
                        En el marketing digital no adivinamos si algo funciona, ¡lo medimos todo! En este panel ves los números reales (KPIs) de tus campañas: cuánta gente hace clic (CTR), cuánto dinero ganas de vuelta por cada peso invertido (ROI) y cuánto te cuesta conseguir cada cliente interesado (Costo por Lead).
                      </p>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Filtrar por Comuna</label>
                        <div className="flex gap-1.5 flex-wrap">
                          {['Valparaíso', 'Viña del Mar', 'Quillota', 'Quilpué'].map(city => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => setMockCity(city)}
                              className={`py-1.5 px-3 rounded-lg font-bold text-xs uppercase border transition-all cursor-pointer ${
                                mockCity === city ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)]' : 'bg-slate-955 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-center">
                          <span className="text-[8px] font-bold text-slate-550 block uppercase tracking-wide">CTR Promedio</span>
                          <span className="text-sm font-black text-white block mt-0.5">
                            {mockCity === 'Valparaíso' ? '5.4%' : mockCity === 'Viña del Mar' ? '6.8%' : mockCity === 'Quillota' ? '4.2%' : '4.9%'}
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-center">
                          <span className="text-[8px] font-bold text-slate-550 block uppercase tracking-wide">ROI Promedio</span>
                          <span className="text-sm font-black text-white block mt-0.5">
                            {mockCity === 'Valparaíso' ? '2.8x' : mockCity === 'Viña del Mar' ? '3.6x' : mockCity === 'Quillota' ? '2.1x' : '2.4x'}
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-center">
                          <span className="text-[8px] font-bold text-slate-550 block uppercase tracking-wide">Costo Lead</span>
                          <span className="text-sm font-black text-white block mt-0.5">
                            {mockCity === 'Valparaíso' ? '$450' : mockCity === 'Viña del Mar' ? '$380' : mockCity === 'Quillota' ? '$610' : '$540'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Gráfico de Barras */}
                    <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-1.5">Conversiones por Canal en {mockCity}</div>
                      
                      <div className="flex h-44 items-end justify-around pt-6 pb-2">
                        {/* Meta Ads Bar */}
                        <div className="flex flex-col items-center gap-1.5 w-8">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md transition-all duration-500 shadow-md"
                            style={{ 
                              height: mockCity === 'Valparaíso' ? '90px' : mockCity === 'Viña del Mar' ? '140px' : mockCity === 'Quillota' ? '70px' : '85px' 
                            }}
                          />
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Meta</span>
                        </div>
                        
                        {/* Google Ads Bar */}
                        <div className="flex flex-col items-center gap-1.5 w-8">
                          <div 
                            className="w-full bg-gradient-to-t from-yellow-500 to-amber-400 rounded-t-md transition-all duration-500 shadow-md"
                            style={{ 
                              height: mockCity === 'Valparaíso' ? '130px' : mockCity === 'Viña del Mar' ? '90px' : mockCity === 'Quillota' ? '60px' : '75px' 
                            }}
                          />
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Google</span>
                        </div>
                        
                        {/* TikTok Ads Bar */}
                        <div className="flex flex-col items-center gap-1.5 w-8">
                          <div 
                            className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-md transition-all duration-500 shadow-md"
                            style={{ 
                              height: mockCity === 'Valparaíso' ? '70px' : mockCity === 'Viña del Mar' ? '110px' : mockCity === 'Quillota' ? '135px' : '115px' 
                            }}
                          />
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">TikTok</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* GUÍA DE COADYUVANTE (TOUR ASSISTANT) */}
            <div className="w-full bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-cyan-950/10 z-10">
              <div className="flex items-start gap-3 text-left">
                <div className="p-2 bg-cyan-950/50 rounded-xl border border-cyan-800/30 text-cyan-400">
                  <Sparkles size={16} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-[8px] font-black text-slate-550 uppercase tracking-widest">
                    {softwareStep === 0 ? "Guía de la Matrix • Consola Principal" : `Guía de la Matrix • Paso ${softwareStep} de 5`}
                  </h4>
                  <p className="text-xs font-bold text-slate-200 mt-1 max-w-lg leading-relaxed text-justify">
                    {softwareStep === 0 && "Consola Principal: Aquí puedes ver los canales de marketing digital activos. Presiona Siguiente para ir a Meta Ads."}
                    {softwareStep === 1 && "Meta Ads Manager: Mueve la barra de presupuesto para ver cuántas personas verán tu anuncio en Facebook o Instagram."}
                    {softwareStep === 2 && "Marketing Conversacional: Haz clic en las preguntas del celular para ver cómo el robot de chat responde al instante."}
                    {softwareStep === 3 && "Lead Magnet Studio: Personaliza el botón de regalo y activa la simulación para ver cómo entran interesados automáticamente."}
                    {softwareStep === 4 && "N8N Automatizaciones: Presiona 'Ejecutar Integración' y mira cómo viajan los datos automáticamente a WhatsApp usando IA."}
                    {softwareStep === 5 && "Laboratorio de Analíticas y KPI: Cambia las comunas para ver cómo varían los clics, el retorno y el costo por cliente."}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (softwareStep > 0) {
                      setSoftwareStep(prev => prev - 1);
                    } else {
                      setStep('tour-intro');
                    }
                  }}
                  className="flex-1 md:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 font-bold uppercase tracking-wider text-[10px] rounded-lg border border-slate-800 transition-all cursor-pointer"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (softwareStep < 5) {
                      setSoftwareStep(prev => prev + 1);
                    } else {
                      setStep('form');
                    }
                  }}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-black uppercase tracking-wider text-[10px] rounded-lg shadow-md transition-all cursor-pointer"
                >
                  {softwareStep === 5 ? 'Registrar Vocación' : 'Siguiente'}
                </button>
              </div>
            </div>
          </div>
        ) : step === 'form' ? (
          <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase flex items-center gap-3">
              <span className="w-2 h-6 bg-cyan-500 rounded-full inline-block" />
              1. Datos de Registro Martech
            </h2>

            {errorMsg && (
              <div className="p-4 bg-red-950/40 border border-red-800 text-red-400 rounded-2xl text-sm font-bold flex items-center gap-2">
                <span>⚠️ {errorMsg}</span>
              </div>
            )}

            {/* Inputs de Datos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nombre *</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    name="first_name" 
                    required
                    placeholder="Tu Nombre" 
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-slate-200 transition-all font-bold text-sm"
                  />
                </div>
              </div>

              {/* Apellido */}
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Apellido *</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    name="last_name" 
                    required
                    placeholder="Tu Apellido" 
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-slate-200 transition-all font-bold text-sm"
                  />
                </div>
              </div>

              {/* Edad */}
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Edad</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-4 top-3.5 text-slate-500" />
                  <input 
                    type="number" 
                    name="age" 
                    placeholder="¿Cuántos años tienes?" 
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-slate-200 transition-all font-bold text-sm"
                  />
                </div>
              </div>

              {/* Comuna Dropdown */}
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Comuna / Ciudad *</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-3.5 text-slate-500" />
                  <select 
                    name="city" 
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-slate-200 transition-all font-bold text-sm appearance-none"
                  >
                    <option value="" disabled className="text-slate-600">Selecciona tu comuna</option>
                    {CITIES.map(c => (
                      <option key={c} value={c} className="bg-slate-950 text-slate-200">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Colegio */}
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Colegio</label>
                <div className="relative">
                  <School size={16} className="absolute left-4 top-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    name="school" 
                    placeholder="¿En qué colegio estudias?" 
                    value={formData.school}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-slate-200 transition-all font-bold text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Email *</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-3.5 text-slate-500" />
                  <input 
                    type="email" 
                    name="email" 
                    required
                    placeholder="correo@ejemplo.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-slate-200 transition-all font-bold text-sm"
                  />
                </div>
              </div>

              {/* Teléfono WhatsApp con Prefijo chileno oficial +56 9 */}
              <div className="md:col-span-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Número de WhatsApp *</label>
                <div className="flex rounded-xl border border-slate-800 bg-slate-950 overflow-hidden focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
                  <div className="flex items-center gap-1.5 px-4 bg-slate-900 text-slate-400 font-black text-sm border-r border-slate-800 select-none">
                    <Phone size={16} className="text-slate-500" />
                    <span>+56 9</span>
                  </div>
                  <input 
                    type="text" 
                    required
                    maxLength={8}
                    placeholder="12345678" 
                    value={whatsappDigits}
                    onChange={(e) => {
                      // Permitir solo números
                      const val = e.target.value.replace(/\D/g, '');
                      setWhatsappDigits(val);
                    }}
                    className="w-full px-4 py-3 bg-transparent outline-none text-slate-200 font-bold text-sm"
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-semibold mt-1.5 block">
                  Completa con los 8 dígitos restantes (ej: +56 9 [12345678]).
                </span>
              </div>
            </div>

            {/* Redes Sociales Favoritas */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Red Social Favorita * (Puedes seleccionar más de una)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {SOCIAL_MEDIA.map(social => {
                  const isSelected = formData.favorite_social.includes(social.id);
                  return (
                    <button
                      key={social.id}
                      type="button"
                      onClick={() => handleSelectSocial(social.id)}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-bold text-sm transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'border-cyan-500 bg-cyan-950/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 ' + social.color
                      }`}
                    >
                      {social.icon}
                      <span>{social.id}</span>
                      {isSelected && <Check size={14} className="ml-1 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Test de Especialidad Martech */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase flex items-center gap-3">
                <span className="w-2 h-6 bg-purple-500 rounded-full inline-block" />
                2. Test de Especialidad (El Desafío Influencer)
              </h2>
              <p className="text-slate-300 font-bold text-sm sm:text-base leading-relaxed text-left text-justify">
                Imagina que MrBeast te contrata hoy mismo en su equipo de marketing para expandir su marca. ¿Cuál sería tu primera acción estratégica para multiplicar las ventas de sus hamburguesas Beast Burger? *
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {TEST_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      formData.test_answer === opt.id 
                        ? 'border-purple-500 bg-purple-950/20 text-slate-100 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                        formData.test_answer === opt.id ? 'bg-purple-500 text-white' : 'bg-slate-850 text-slate-400'
                      }`}>
                        {opt.id}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-wider ${
                        formData.test_answer === opt.id ? 'text-purple-400' : 'text-slate-500'
                      }`}>
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                      {opt.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* BOTÓN SUBMIT */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-cyan-950/20 hover:shadow-cyan-500/10 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    <span>Calculando tu clase en la Matrix...</span>
                  </>
                ) : (
                  <>
                    <span>Generar Credencial Digital</span>
                    <Sparkles className="group-hover:scale-125 transition-transform" size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* PESTAÑA CREDENCIAL GENERADA */
          <div className="flex flex-col items-center space-y-8 animate-fade-in w-full">
            {/* CREDENCIAL CARD CONTENEDOR */}
            <div 
              id="digital-credential"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full max-w-lg aspect-[1.6/1] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden select-none cursor-pointer transition-transform duration-100 ease-out"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(6, 182, 212, 0.05)',
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Reflejo lumínico dinámico */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20 mix-blend-color-dodge transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.8) 0%, transparent 60%)`
                }}
              />

              {/* Luz neón estática */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* CARD HEADER */}
              <div className="flex items-start justify-between z-10">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-cyan-500 rounded-full inline-block" />
                    <span className="font-black text-xs tracking-wider text-slate-300 uppercase">Duoc UC</span>
                  </div>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Marketing Digital</span>
                </div>
                <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-black uppercase text-cyan-400 tracking-wider">
                  PASE VIP VOCACIONAL
                </div>
              </div>

              {/* CARD BODY */}
              <div className="my-6 z-10 flex justify-between items-end">
                <div className="space-y-2 max-w-[70%]">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">IDENTIDAD CONFIRMADA</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase truncate italic leading-tight">
                    {assignedLead?.first_name || formData.first_name} {assignedLead?.last_name || formData.last_name}
                  </h3>
                  
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest block">COLEGIO</span>
                      <span className="text-xs font-bold text-slate-300 truncate block max-w-[150px]">
                        {assignedLead?.school || formData.school || 'Duoc UC Visitante'}
                      </span>
                    </div>
                    <div className="w-px h-6 bg-slate-800" />
                    <div>
                      <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest block">PROCEDENCIA</span>
                      <span className="text-xs font-bold text-slate-300 truncate block max-w-[150px]">
                        {assignedLead?.city || formData.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR CODE */}
                <div className="w-20 h-20 bg-white p-1 rounded-xl flex items-center justify-center shadow-lg border border-slate-800/80">
                  <img 
                    src="https://quickchart.io/qr?text=https://www.duoc.cl/carreras/ingenieria-en-marketing-digital/&size=150" 
                    alt="QR Code" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 z-10">
                <div className="flex flex-col">
                  <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">CLASE / RANGO</span>
                  <span className={`text-xs font-black uppercase tracking-wider bg-gradient-to-r ${selectedOptDetails.color} bg-clip-text text-transparent italic`}>
                    {selectedOptDetails.rpgClass}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[8px] font-mono">
                  <QrCode size={10} className="text-slate-600" /> ID_{Math.floor(100000 + Math.random() * 900000)}
                </div>
              </div>
            </div>

            {/* STATS BARS */}
            <div className="w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={12} className="text-cyan-400" /> Atributos de Especialidad
                </h4>
                <span className={`text-[10px] font-black uppercase tracking-widest bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 ${selectedOptDetails.textNeon}`}>
                  {selectedOptDetails.badge}
                </span>
              </div>
              <div className="space-y-4">
                {selectedOptDetails.skills?.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                      <span className="text-slate-400">{skill.name}</span>
                      <span className={selectedOptDetails.textNeon}>{skill.val}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                      {/* Animated neon progress bar */}
                      <div 
                        className={`h-full bg-gradient-to-r ${selectedOptDetails.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTONES ACCIÓN */}
            <div className="w-full max-w-lg flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-cyan-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {downloading ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    <span>Renderizando...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Descargar Credencial</span>
                  </>
                )}
              </button>

              <button
                onClick={resetForm}
                className="py-4 px-6 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold uppercase tracking-wider text-xs rounded-2xl border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Generar Otra</span>
              </button>
            </div>

            <div className="text-left text-justify text-slate-500 text-xs pt-4">
              <p>Muestra tu credencial al docente del taller para recibir tu premio.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocationalFairLanding;
