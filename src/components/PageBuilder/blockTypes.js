// Block type definitions, templates, and palettes for the Page Builder

export const PALETTES = [
  { id: 'ocean', name: 'Océano', primary: '#0ea5e9', secondary: '#0284c7', accent: '#38bdf8', bg: '#f0f9ff', text: '#0c4a6e', light: '#e0f2fe', gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)' },
  { id: 'emerald', name: 'Esmeralda', primary: '#10b981', secondary: '#059669', accent: '#34d399', bg: '#ecfdf5', text: '#064e3b', light: '#d1fae5', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { id: 'dark', name: 'Ejecutivo', primary: '#1e293b', secondary: '#0f172a', accent: '#64748b', bg: '#f8fafc', text: '#0f172a', light: '#e2e8f0', gradient: 'linear-gradient(135deg, #1e293b, #334155)' },
  { id: 'sunset', name: 'Atardecer', primary: '#f97316', secondary: '#ea580c', accent: '#fb923c', bg: '#fff7ed', text: '#7c2d12', light: '#ffedd5', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
  { id: 'violet', name: 'Violeta', primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa', bg: '#f5f3ff', text: '#4c1d95', light: '#ede9fe', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  { id: 'none', name: 'Sin Color', primary: '#475569', secondary: '#334155', accent: '#94a3b8', bg: '#ffffff', text: '#1e293b', light: '#f1f5f9', gradient: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' },
];

export const getCustomPalette = (hex) => {
  // simple shade generator
  return { id: 'custom', name: 'Personalizado', primary: hex, secondary: hex, accent: hex, bg: '#ffffff', text: '#1e293b', light: `${hex}20`, gradient: `linear-gradient(135deg, ${hex}dd, ${hex})` };
};

export const BLOCK_DEFS = {
  hero: { label: 'Hero / Portada', emoji: '🎯' },
  text: { label: 'Texto / Párrafo', emoji: '📝' },
  checklist: { label: 'Checklist', emoji: '✅' },
  image: { label: 'Imagen', emoji: '🖼️' },
  calculator: { label: 'Calculadora', emoji: '🧮' },
  cta: { label: 'Call to Action', emoji: '🚀' },
  stats: { label: 'Estadísticas', emoji: '📊' },
  testimonial: { label: 'Testimonio', emoji: '💬' },
  divider: { label: 'Separador', emoji: '➖' },
  form: { label: 'Formulario', emoji: '📋' },
};

let _uid = 1;
export const uid = () => `b${Date.now()}_${_uid++}`;

export const createBlock = (type) => {
  const id = uid();
  const defaults = {
    hero: { title: 'Título Principal', subtitle: 'Tu propuesta de valor aquí', bgImage: null, showCta: false, ctaText: 'Descargar Gratis' },
    text: { heading: '', body: 'Escribe tu contenido aquí...', align: 'left' },
    checklist: { heading: 'Tu Checklist', items: [
      { id: uid(), text: 'Primer paso importante', done: false },
      { id: uid(), text: 'Segundo paso clave', done: false },
      { id: uid(), text: 'Tercer paso fundamental', done: false },
    ]},
    image: { src: null, caption: '', fullWidth: true },
    calculator: { heading: 'Calculadora de ROI', calcType: 'roi', inputs: { investment: 1000, revenue: 5000 } },
    cta: { heading: '¿Listo para empezar?', description: 'Descarga esta guía y transforma tu estrategia.', buttonText: 'Descargar Ahora', buttonUrl: '#', style: 'filled' },
    stats: { heading: '', items: [
      { value: '85%', label: 'Tasa de éxito' },
      { value: '3x', label: 'Más conversiones' },
      { value: '50%', label: 'Menos costo' },
    ]},
    testimonial: { quote: '"Esta herramienta cambió completamente nuestra estrategia de marketing digital."', author: 'María González', role: 'Directora de Marketing', avatar: null },
    divider: { style: 'line' },
    form: { heading: 'Obtén acceso ahora', description: 'Déjanos tus datos y te enviamos la guía completa.', buttonText: 'Enviar', fields: ['Nombre', 'Email'] },
  };
  return { id, type, data: defaults[type] || {} };
};

// Calculator logic
export const CALC_TYPES = {
  roi: { label: 'ROI (Retorno de Inversión)', fields: [{ key: 'investment', label: 'Inversión ($)' }, { key: 'revenue', label: 'Ingresos ($)' }], compute: (v) => { const roi = ((v.revenue - v.investment) / (v.investment || 1)) * 100; return { value: roi.toFixed(1) + '%', label: 'ROI', detail: `Ganancia neta: $${(v.revenue - v.investment).toLocaleString()}` }; }},
  cpl: { label: 'Costo por Lead (CPL)', fields: [{ key: 'adSpend', label: 'Gasto en Ads ($)' }, { key: 'leads', label: 'Leads generados' }], compute: (v) => { const cpl = v.adSpend / (v.leads || 1); return { value: '$' + cpl.toFixed(2), label: 'CPL', detail: `Con ${v.leads} leads del gasto total` }; }},
  roas: { label: 'ROAS', fields: [{ key: 'adSpend', label: 'Inversión Ads ($)' }, { key: 'revenue', label: 'Revenue ($)' }], compute: (v) => { const roas = v.revenue / (v.adSpend || 1); return { value: roas.toFixed(2) + 'x', label: 'ROAS', detail: `Por cada $1 invertido generas $${roas.toFixed(2)}` }; }},
  budget: { label: 'Presupuesto Mensual', fields: [{ key: 'daily', label: 'Presupuesto diario ($)' }, { key: 'cpc', label: 'CPC estimado ($)' }], compute: (v) => { const monthly = v.daily * 30; const clicks = monthly / (v.cpc || 1); return { value: '$' + monthly.toLocaleString(), label: 'Mensual', detail: `~${Math.round(clicks).toLocaleString()} clicks estimados` }; }},
};

// Pre-built templates
export const TEMPLATES = [
  { id: 'checklist', name: 'Checklist', emoji: '✅', desc: 'Lista de verificación profesional', blocks: () => [
    createBlock('hero'), createBlock('checklist'), createBlock('cta')
  ]},
  { id: 'ebook', name: 'Mini E-book', emoji: '📖', desc: 'Guía o e-book de una página', blocks: () => [
    createBlock('hero'), createBlock('text'), createBlock('image'), createBlock('text'), createBlock('cta')
  ]},
  { id: 'guide', name: 'Guía Completa', emoji: '📚', desc: 'Guía paso a paso con métricas', blocks: () => [
    createBlock('hero'), createBlock('stats'), createBlock('text'), createBlock('checklist'), createBlock('cta')
  ]},
  { id: 'calculator', name: 'Calculadora', emoji: '🧮', desc: 'Herramienta interactiva con cálculos', blocks: () => [
    createBlock('hero'), createBlock('calculator'), createBlock('text'), createBlock('cta')
  ]},
  { id: 'landing', name: 'Landing Page', emoji: '🚀', desc: 'Página de captura de leads', blocks: () => [
    createBlock('hero'), createBlock('stats'), createBlock('text'), createBlock('testimonial'), createBlock('cta'), createBlock('form')
  ]},
  { id: 'blank', name: 'En Blanco', emoji: '📄', desc: 'Empieza desde cero', blocks: () => [createBlock('hero')] },
];
