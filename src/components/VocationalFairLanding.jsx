import React, { useState } from 'react';
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
  Check
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
    textNeon: 'text-green-400'
  },
  {
    id: 'B',
    text: 'Crear un servidor de Discord para fans y hacer dinámicas y sorteos semanales de hamburguesas.',
    role: 'Community Manager',
    badge: 'Community Architect',
    rpgClass: 'COMMUNITY ARCHITECT',
    color: 'from-pink-400 to-rose-600',
    textNeon: 'text-pink-400'
  },
  {
    id: 'C',
    text: 'Lanzar campañas de anuncios pagados dirigidos a los fans de streamers en Latinoamérica.',
    role: 'Trafficker / Paid Media',
    badge: 'Growth Ads Specialist',
    rpgClass: 'GROWTH ADS SPECIALIST',
    color: 'from-cyan-400 to-blue-600',
    textNeon: 'text-cyan-400'
  },
  {
    id: 'D',
    text: 'Pagar para que cuando la gente busque "hambre" o "comida rápida" en Google, salgamos primeros.',
    role: 'Especialista SEM',
    badge: 'SEM Manager',
    rpgClass: 'SEM MANAGER',
    color: 'from-yellow-400 to-amber-600',
    textNeon: 'text-yellow-400'
  },
  {
    id: 'E',
    text: 'Optimizar la web de Beast Burger para que aparezca primera en Google de forma gratis.',
    role: 'Consultor SEO',
    badge: 'SEO Growth Hacker',
    rpgClass: 'SEO GROWTH HACKER',
    color: 'from-orange-400 to-red-600',
    textNeon: 'text-orange-400'
  },
  {
    id: 'F',
    text: 'Analizar los gráficos de visitas por minuto y ventas para saber qué ciudades tienen más demanda.',
    role: 'Data Analyst',
    badge: 'Data Analytics Guru',
    rpgClass: 'DATA ANALYTICS GURU',
    color: 'from-purple-400 to-indigo-600',
    textNeon: 'text-purple-400'
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

const TOUR_SLIDES = [
  {
    title: "Bienvenido a la Matrix del Marketing",
    subtitle: "INGENIERÍA EN MARKETING DIGITAL DUOC UC",
    description: "Hoy vas a sumergirte en el software que usan nuestros estudiantes universitarios. Aprenderás a dominar los canales digitales que mueven millones de dólares en el mundo real.",
    accent: "from-cyan-500 to-blue-500",
    shadow: "shadow-cyan-500/20",
    border: "border-cyan-500/30",
    icon: (
      <svg className="w-16 h-16 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    )
  },
  {
    title: "1. Configuración de Campañas",
    subtitle: "INSTAGRAM • TIKTOK • GOOGLE • FACEBOOK • YOUTUBE",
    description: "Aprende a controlar la pauta publicitaria en las plataformas más grandes del mundo. En Duoc UC configuramos y simulamos campañas reales, segmentamos audiencias y gestionamos presupuestos para llegar a miles de clientes.",
    accent: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20",
    border: "border-blue-500/30",
    icon: (
      <div className="flex flex-wrap gap-2 items-center justify-center p-1 text-slate-100 max-w-[95px] select-none">
        {/* Facebook */}
        <svg className="w-6 h-6 text-[#1877F2] drop-shadow-[0_0_6px_rgba(24,119,242,0.4)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        {/* Instagram */}
        <svg className="w-6 h-6 text-[#E1306C] drop-shadow-[0_0_6px_rgba(225,48,108,0.4)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
        {/* TikTok */}
        <svg className="w-6 h-6 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.23-.45-.47-.65-.73v7.07c0 2.76-1.02 5.47-3.21 7.19-2.14 1.66-5.11 2.21-7.72 1.43-2.61-.79-4.73-2.91-5.5-5.52-.77-2.61-.22-5.58 1.44-7.72 1.72-2.19 4.43-3.21 7.19-3.21v4.03c-1.53 0-3.09.63-4.17 1.75-1.11 1.12-1.62 2.7-1.79 4.24v.1c0 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79h.1c1.53 0 3.09-.63 4.17-1.75 1.11-1.12 1.62-2.7 1.79-4.24V.02z"/>
        </svg>
        {/* YouTube */}
        <svg className="w-6 h-6 text-[#FF0000] drop-shadow-[0_0_6px_rgba(255,0,0,0.4)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        {/* Google */}
        <svg className="w-6 h-6 drop-shadow-[0_0_6px_rgba(234,67,53,0.3)]" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.277 1.565-1.762 4.593-6.887 4.593-4.43 0-8.04-3.668-8.04-8.193S7.81 2.607 12.24 2.607c2.52 0 4.21 1.05 5.17 1.977l3.24-3.12C18.59.852 15.69 0 12.24 0 5.58 0 0 5.487 0 12.2s5.58 12.2 12.24 12.2c6.96 0 11.57-4.89 11.57-11.78 0-.79-.08-1.4-.19-1.97H12.24z"/>
        </svg>
      </div>
    )
  },
  {
    title: "2. Chatbots",
    subtitle: "MARKETING CONVERSACIONAL",
    description: "Diseña flujos de conversación inteligentes que guían al cliente y cierran ventas de forma automática. En el simulador creamos bots estructurados que responden al instante, resolviendo dudas de los usuarios.",
    accent: "from-green-500 to-emerald-600",
    shadow: "shadow-green-500/20",
    border: "border-green-500/30",
    icon: (
      <div className="flex gap-4 items-center justify-center p-1 text-slate-100 select-none">
        {/* WhatsApp */}
        <svg className="w-8 h-8 text-[#25D366] drop-shadow-[0_0_6px_rgba(37,211,102,0.4)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.858.002-2.634-1.013-5.11-2.861-6.963-1.848-1.854-4.321-2.87-6.956-2.871-5.439 0-9.861 4.42-9.864 9.86-.001 1.738.455 3.433 1.32 4.932l-.991 3.623 3.717-.975zm11.758-7.079c-.097-.163-.359-.261-.754-.457-.395-.197-2.336-1.153-2.696-1.284-.36-.131-.622-.197-.884.197-.262.393-.997 1.25-.198 1.348.33.065 1.547.457 2.203.457.656 0 1.22-.097 1.517-.261.298-.163.56-.261.56-.554s-.065-.554-.163-.717zm-4.331-2.228c-.262-.393-.524-.458-.884-.458s-.622-.033-.884.097c-.262.131-.997.755-.997 1.842 0 1.088.754 2.142.884 2.306.131.163 1.484 2.27 3.6 3.181.504.216.897.346 1.203.443.507.161.968.138 1.332.084.407-.06 1.22-.497 1.385-.978.164-.48.164-.897.115-.978-.05-.084-.197-.131-.59-.328z"/>
        </svg>
        {/* Facebook Messenger */}
        <svg className="w-8 h-8 text-[#0084FF] drop-shadow-[0_0_6px_rgba(0,132,255,0.4)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.36 2 2 6.13 2 11.69c0 3.16 1.43 5.92 3.67 7.74V23l3.35-1.84c.94.26 1.94.42 2.98.42 5.64 0 10-4.13 10-9.69C22 6.13 17.64 2 12 2zm1.09 12.87l-2.67-2.85-5.2 2.85 5.71-6.07 2.7 2.85 5.17-2.85-5.71 6.07z"/>
        </svg>
      </div>
    )
  },
  {
    title: "3. Automatización",
    subtitle: "PROCESOS Y WORKFLOWS EFICIENTES",
    description: "Conecta diferentes herramientas y bases de datos para crear flujos de trabajo que funcionan en piloto automático. Automatiza el envío de correos, el traspaso de leads y las alertas del equipo para optimizar el tiempo.",
    accent: "from-orange-500 to-red-600",
    shadow: "shadow-orange-500/20",
    border: "border-orange-500/30",
    icon: (
      <div className="flex gap-4 items-center justify-center p-1 text-slate-100 select-none">
        {/* Zapier Underscore */}
        <svg className="w-8 h-8 text-[#FF4F00] drop-shadow-[0_0_6px_rgba(255,79,0,0.4)]" viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="16" width="20" height="5" rx="1.5" />
        </svg>
        {/* Make overlapping dots */}
        <div className="flex items-center justify-center w-8 h-8 relative drop-shadow-[0_0_6px_rgba(138,43,226,0.4)]">
          <circle cx="7" cy="14" r="5.5" fill="#4B0082" />
          <circle cx="15" cy="9" r="5" fill="#8A2BE2" opacity="0.95" />
          <circle cx="16" cy="16" r="4.5" fill="#DA70D6" opacity="0.85" />
        </div>
      </div>
    )
  },
  {
    title: "4. Analítica y Laboratorio de KPIs",
    subtitle: "EL CEREBRO DETRÁS DE LOS NÚMEROS",
    description: "Analizamos el rendimiento en vivo: visitas, CTR, conversiones y retorno de inversión (ROI). Los números te dicen exactamente si tu estrategia está funcionando o qué debes cambiar para ganar.",
    accent: "from-purple-500 to-indigo-600",
    shadow: "shadow-purple-500/20",
    border: "border-purple-500/30",
    icon: (
      <div className="flex gap-4 items-center justify-center p-1 text-slate-100 select-none">
        {/* Google Analytics */}
        <svg className="w-8 h-8 drop-shadow-[0_0_6px_rgba(244,180,0,0.4)]" viewBox="0 0 24 24" fill="currentColor">
          <path fill="#F4B400" d="M6.5 13.5c0-.83-.67-1.5-1.5-1.5S3.5 12.67 3.5 13.5v5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5z" />
          <path fill="#F9AB00" d="M12.5 1.5c0-.83-.67-1.5-1.5-1.5S9.5.67 9.5 1.5v11c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-11z" />
          <path fill="#E37400" d="M18.5 7.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5z" />
        </svg>
        {/* Google Sheets */}
        <svg className="w-8 h-8 text-[#0F9D58] drop-shadow-[0_0_6px_rgba(15,157,88,0.4)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      </div>
    )
  }
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

  const [tourIndex, setTourIndex] = useState(0);
  const [showTour, setShowTour] = useState(true);

  const [whatsappDigits, setWhatsappDigits] = useState(''); // Solo 8 dígitos
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [assignedLead, setAssignedLead] = useState(null);
  const [downloading, setDownloading] = useState(false);

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
        setSubmitted(true);
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
    setSubmitted(false);
    setAssignedLead(null);
  };

  const selectedOptDetails = TEST_OPTIONS.find(o => o.id === (assignedLead?.test_answer || formData.test_answer)) || TEST_OPTIONS[0];

  return (
    // CAMBIO DE ESTILO: Se removió overflow-hidden para permitir el scroll natural de la página en dispositivos y resoluciones pequeñas
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-4 sm:p-8 font-sans selection:bg-cyan-500 selection:text-slate-900 relative overflow-x-hidden">
      {/* Elementos decorativos de fondo (Neon glow) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <div className="w-full max-w-4xl text-left mb-8 sm:mb-12 mt-4 z-10 flex flex-col items-start">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-cyan-400 text-xs font-black uppercase tracking-widest mb-4 animate-pulse">
          <Sparkles size={12} /> Feria Vocacional Duoc UC
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-none bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent italic">
          Genera tu Identidad Digital
        </h1>
        <p className="text-slate-400 mt-3 text-sm sm:text-base font-semibold max-w-2xl text-left">
          Ingeniería en Marketing Digital • Descubre tu rol en la Matrix digital y descarga tu credencial Cyberpunk personalizada.
        </p>
      </div>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-4xl z-10 pb-16">
        {showTour ? (
          /* RECORRIDO ESTUDIANTIL */
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-start text-left space-y-6 animate-fade-in relative overflow-hidden">
            {/* Elementos neón del slide */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${TOUR_SLIDES[tourIndex].accent} opacity-5 rounded-full blur-2xl pointer-events-none`} />

            {/* Header del Slide */}
            <div className="w-full flex justify-start items-center pb-4 border-b border-slate-850">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                RECORRIDO MARTECH • PASO {tourIndex + 1} DE {TOUR_SLIDES.length}
              </span>
            </div>

            {/* Icono de Módulo */}
            <div className={`w-28 h-28 rounded-[2rem] bg-slate-950 border ${TOUR_SLIDES[tourIndex].border} flex items-center justify-center shadow-2xl ${TOUR_SLIDES[tourIndex].shadow} transition-transform duration-500 hover:scale-105`}>
              {TOUR_SLIDES[tourIndex].icon}
            </div>

            {/* Título y Subtítulo */}
            <div className="space-y-2">
              <span className={`text-[10px] sm:text-xs font-black bg-gradient-to-r ${TOUR_SLIDES[tourIndex].accent} bg-clip-text text-transparent uppercase tracking-widest block`}>
                {TOUR_SLIDES[tourIndex].subtitle}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight italic leading-tight">
                {TOUR_SLIDES[tourIndex].title}
              </h2>
            </div>

            {/* Descripción */}
            <p className="text-slate-300 text-sm sm:text-base font-medium max-w-xl leading-relaxed text-justify">
              {TOUR_SLIDES[tourIndex].description}
            </p>

            {/* Indicadores de Progreso */}
            <div className="flex gap-2">
              {TOUR_SLIDES.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === tourIndex ? `w-8 bg-gradient-to-r ${TOUR_SLIDES[tourIndex].accent}` : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Botones de Navegación del Tour */}
            <div className="w-full pt-4 flex gap-4">
              {tourIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => setTourIndex(prev => prev - 1)}
                  className="flex-1 py-3.5 bg-slate-950 hover:bg-slate-900 text-slate-300 font-bold uppercase tracking-wider text-xs rounded-xl border border-slate-800 transition-all cursor-pointer"
                >
                  Anterior
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  if (tourIndex < TOUR_SLIDES.length - 1) {
                    setTourIndex(prev => prev + 1);
                  } else {
                    setShowTour(false);
                  }
                }}
                className={`flex-1 py-3.5 bg-gradient-to-r ${TOUR_SLIDES[tourIndex].accent} hover:brightness-110 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all cursor-pointer`}
              >
                {tourIndex === TOUR_SLIDES.length - 1 ? 'Iniciar Desafío' : 'Siguiente Módulo'}
              </button>
            </div>
          </div>
        ) : !submitted ? (
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
              <p className="text-slate-300 font-bold text-sm sm:text-base leading-relaxed">
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
          <div className="flex flex-col items-center space-y-8 animate-fade-in">
            {/* CREDENCIAL CARD CONTENEDOR */}
            <div 
              id="digital-credential"
              className="w-full max-w-lg aspect-[1.6/1] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden select-none"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(6, 182, 212, 0.05)'
              }}
            >
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

            <div className="text-center text-slate-500 text-xs pt-4">
              <p>Muestra tu credencial al docente del taller para recibir tu premio.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocationalFairLanding;
