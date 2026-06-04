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
    text: 'Agarro CapCut/Canva y me pongo a crear los Reels y TikToks más virales.',
    role: 'Social Media Content',
    badge: 'Creador de Contenido',
    color: 'from-green-400 to-emerald-600',
    textNeon: 'text-green-400'
  },
  {
    id: 'B',
    text: 'Armo una estrategia para interactuar con los seguidores, crear memes y gestionar la comunidad.',
    role: 'Community Manager',
    badge: 'La Voz de la Marca',
    color: 'from-pink-400 to-rose-600',
    textNeon: 'text-pink-400'
  },
  {
    id: 'C',
    text: 'Pongo plata sobre la mesa y lanzo campañas en Instagram/TikTok para perseguir a los clientes por toda la web.',
    role: 'Trafficker / Paid Media',
    badge: 'Trafficker Digital',
    color: 'from-cyan-400 to-blue-600',
    textNeon: 'text-cyan-400'
  },
  {
    id: 'D',
    text: 'Le pago a Google para que, cuando alguien busque nuestro producto, seamos el primer enlace que vean.',
    role: 'Especialista SEM',
    badge: 'Especialista SEM',
    color: 'from-yellow-400 to-amber-600',
    textNeon: 'text-yellow-400'
  },
  {
    id: 'E',
    text: 'Analizo cómo busca la gente y optimizo la página web para aparecer primeros en Google, ¡pero gratis y a largo plazo!',
    role: 'Consultor SEO',
    badge: 'Consultor SEO',
    color: 'from-orange-400 to-red-600',
    textNeon: 'text-orange-400'
  },
  {
    id: 'F',
    text: 'Instalo herramientas de rastreo para analizar los datos de los usuarios, ver dónde hacen clic y predecir qué van a comprar.',
    role: 'Data Analyst',
    badge: 'Cerebro de Datos',
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
    favorite_social: '',
    test_answer: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [assignedLead, setAssignedLead] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectSocial = (social) => {
    setFormData(prev => ({ ...prev, favorite_social: social }));
  };

  const handleSelectOption = (optId) => {
    setFormData(prev => ({ ...prev, test_answer: optId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.city || !formData.favorite_social || !formData.test_answer) {
      setErrorMsg('Por favor completa todos los campos requeridos marcados con *');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
      favorite_social: '',
      test_answer: ''
    });
    setSubmitted(false);
    setAssignedLead(null);
  };

  const selectedOptDetails = TEST_OPTIONS.find(o => o.id === (assignedLead?.test_answer || formData.test_answer)) || TEST_OPTIONS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 font-sans selection:bg-cyan-500 selection:text-slate-900 relative overflow-hidden">
      {/* Elementos decorativos de fondo (Neon glow) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <div className="w-full max-w-4xl text-center mb-8 sm:mb-12 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-cyan-400 text-xs font-black uppercase tracking-widest mb-4 animate-pulse">
          <Sparkles size={12} /> Feria Vocacional Duoc UC
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-none bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent italic">
          Genera tu Identidad Digital
        </h1>
        <p className="text-slate-400 mt-3 text-sm sm:text-base font-semibold max-w-2xl mx-auto">
          Ingeniería en Marketing Digital • Descubre tu rol en la Matrix digital y descarga tu credencial Cyberpunk personalizada.
        </p>
      </div>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-4xl z-10">
        {!submitted ? (
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

              {/* Teléfono */}
              <div className="md:col-span-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2">Número de WhatsApp</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-3.5 text-slate-500" />
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="Ej: +56912345678" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-slate-200 transition-all font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Redes Sociales Favoritas */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Red Social Favorita *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SOCIAL_MEDIA.map(social => (
                  <button
                    key={social.id}
                    type="button"
                    onClick={() => handleSelectSocial(social.id)}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-bold text-sm transition-all duration-300 ${
                      formData.favorite_social === social.id 
                        ? 'border-cyan-500 bg-cyan-950/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 ' + social.color
                    }`}
                  >
                    {social.icon}
                    <span>{social.id}</span>
                    {formData.favorite_social === social.id && <Check size={14} className="ml-1 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Test de Especialidad Martech */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase flex items-center gap-3">
                <span className="w-2 h-6 bg-purple-500 rounded-full inline-block" />
                2. Test de Especialidad Martech
              </h2>
              <p className="text-slate-300 font-bold text-sm sm:text-base leading-relaxed">
                Imagina que hoy entras a trabajar a tu marca favorita (ej: Nike, PlayStation, Apple). ¿Cuál es tu primera movida para hacerlos explotar en ventas? *
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {TEST_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-300 ${
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
                    <span>Procesando en la Matrix...</span>
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
                  <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">RANGO ASIGNADO</span>
                  <span className={`text-xs font-black uppercase tracking-wider bg-gradient-to-r ${selectedOptDetails.color} bg-clip-text text-transparent italic`}>
                    {assignedLead?.range_assigned || selectedOptDetails.role}
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
