import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, Type, AlignLeft, Image as ImageIcon,
  CheckSquare, BookOpen, Palette, Sparkles, Eye, Edit3,
  Plus, Trash2, FileText, Upload, AlignJustify,
  Copy, Link, Code, X, ExternalLink, Check, Share2, ChevronDown
} from 'lucide-react';

// ── Color Palettes ──
const COLOR_PALETTES = [
  { id: 'ocean', name: 'Océano', primary: '#0ea5e9', secondary: '#0284c7', accent: '#38bdf8', bg: '#f0f9ff', text: '#0c4a6e', light: '#e0f2fe', gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)' },
  { id: 'emerald', name: 'Esmeralda', primary: '#10b981', secondary: '#059669', accent: '#34d399', bg: '#ecfdf5', text: '#064e3b', light: '#d1fae5', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { id: 'dark', name: 'Ejecutivo', primary: '#1e293b', secondary: '#0f172a', accent: '#64748b', bg: '#f8fafc', text: '#0f172a', light: '#e2e8f0', gradient: 'linear-gradient(135deg, #1e293b, #334155)' },
  { id: 'sunset', name: 'Atardecer', primary: '#f97316', secondary: '#ea580c', accent: '#fb923c', bg: '#fff7ed', text: '#7c2d12', light: '#ffedd5', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
  { id: 'violet', name: 'Violeta', primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa', bg: '#f5f3ff', text: '#4c1d95', light: '#ede9fe', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
];

// ── Default content by type ──
const DEFAULT_ITEMS = {
  checklist: [
    { id: '1', text: 'Define tu Buyer Persona con datos reales', checked: false },
    { id: '2', text: 'Investiga las palabras clave de tu nicho', checked: false },
    { id: '3', text: 'Crea un calendario de contenido mensual', checked: false },
    { id: '4', text: 'Configura tus píxeles de seguimiento', checked: false },
    { id: '5', text: 'Diseña tu primer embudo de conversión', checked: false },
  ],
  ebook: [
    { id: '1', text: 'El marketing digital ha transformado la manera en que las marcas se conectan con sus audiencias. En este mini e-book, exploraremos las estrategias fundamentales que todo profesional debe dominar para crear campañas exitosas en el entorno digital actual.' },
    { id: '2', text: 'La clave del éxito radica en entender profundamente a tu audiencia objetivo. Utiliza herramientas de análisis de datos para construir perfiles detallados y personalizar cada punto de contacto en el journey del cliente.' },
  ]
};

// ── PDF Export Function ──
const exportToPDF = async (elementRef, title) => {
  const element = elementRef.current;
  if (!element) return;

  const { default: html2canvas } = await import('html2canvas-pro');
  const { jsPDF } = await import('jspdf');

  // A4 dimensions in mm
  const a4Width = 210;
  const a4Height = 297;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    width: element.scrollWidth,
    height: element.scrollHeight,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const imgWidth = a4Width;
  const imgHeight = (canvas.height * a4Width) / canvas.width;

  if (imgHeight <= a4Height) {
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  } else {
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= a4Height;
    while (heightLeft > 0) {
      position -= a4Height;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= a4Height;
    }
  }

  const safeName = (title || 'lead-magnet').replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
  pdf.save(`${safeName}.pdf`);
};

// ── Editor Panel Component ──
const EditorPanel = ({ state, setState, onImageUpload }) => {
  const fileInputRef = useRef(null);

  const updateField = (field, value) => setState(prev => ({ ...prev, [field]: value }));

  const addItem = () => {
    const newItem = state.type === 'checklist'
      ? { id: Date.now().toString(), text: '', checked: false }
      : { id: Date.now().toString(), text: '' };
    updateField('items', [...state.items, newItem]);
  };

  const updateItem = (id, field, value) => {
    updateField('items', state.items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id) => {
    if (state.items.length > 1) updateField('items', state.items.filter(item => item.id !== id));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => updateField('coverImage', ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const SectionTitle = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center"><Icon size={14} className="text-slate-500" /></div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{title}</span>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-6">
      {/* Type Selector */}
      <div>
        <SectionTitle icon={FileText} title="Tipo de Lead Magnet" />
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'checklist', icon: CheckSquare, label: 'Checklist' },
            { id: 'ebook', icon: BookOpen, label: 'Mini E-book' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setState(prev => ({ ...prev, type: opt.id, items: DEFAULT_ITEMS[opt.id] }))}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${state.type === opt.id ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <opt.icon size={20} className={state.type === opt.id ? 'text-blue-600' : 'text-slate-400'} />
              <span className={`text-sm font-bold ${state.type === opt.id ? 'text-blue-700' : 'text-slate-600'}`}>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Palette Selector */}
      <div>
        <SectionTitle icon={Palette} title="Paleta de Colores" />
        <div className="flex gap-2 flex-wrap">
          {COLOR_PALETTES.map(p => (
            <button
              key={p.id}
              onClick={() => updateField('palette', p.id)}
              className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${state.palette === p.id ? 'border-slate-800 bg-slate-50 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="w-5 h-5 rounded-full shadow-inner" style={{ background: p.gradient }} />
              <span className="text-xs font-bold text-slate-600">{p.name}</span>
              {state.palette === p.id && <div className="absolute -top-1 -right-1 w-3 h-3 bg-slate-800 rounded-full border-2 border-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <SectionTitle icon={Type} title="Título Principal" />
        <input
          type="text"
          value={state.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Ej: Guía Definitiva de Marketing Digital"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-300 outline-none transition-all font-bold text-sm text-slate-800"
        />
      </div>

      {/* Subtitle */}
      <div>
        <SectionTitle icon={AlignLeft} title="Subtítulo / Promesa de Valor" />
        <input
          type="text"
          value={state.subtitle}
          onChange={(e) => updateField('subtitle', e.target.value)}
          placeholder="Ej: Los 5 pasos que triplicarán tus conversiones"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-300 outline-none transition-all font-bold text-sm text-slate-800"
        />
      </div>

      {/* Cover Image */}
      <div>
        <SectionTitle icon={ImageIcon} title="Imagen de Fondo (Header)" />
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        {state.coverImage ? (
          <div className="relative group rounded-2xl overflow-hidden border border-slate-200">
            <img src={state.coverImage} alt="Cover" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white text-slate-800 rounded-xl text-xs font-bold">Cambiar</button>
              <button onClick={() => updateField('coverImage', null)} className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold">Eliminar</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-8 border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-400 hover:bg-blue-50/50 transition-all flex flex-col items-center gap-2 group"
          >
            <Upload size={24} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600">Subir imagen (JPG, PNG)</span>
          </button>
        )}
      </div>

      {/* Author */}
      <div>
        <SectionTitle icon={Edit3} title="Nombre del Autor / Marca" />
        <input
          type="text"
          value={state.author}
          onChange={(e) => updateField('author', e.target.value)}
          placeholder="Ej: Marketing Pro Academy"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-300 outline-none transition-all font-bold text-sm text-slate-800"
        />
      </div>

      {/* Content Items */}
      <div>
        <SectionTitle icon={state.type === 'checklist' ? CheckSquare : AlignJustify} title={state.type === 'checklist' ? 'Ítems del Checklist' : 'Párrafos del E-book'} />
        <div className="space-y-3">
          {state.items.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-start gap-2 group"
            >
              <span className="mt-3 text-[10px] font-black text-slate-300 w-5 text-center shrink-0">{idx + 1}</span>
              {state.type === 'checklist' ? (
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateItem(item.id, 'text', e.target.value)}
                  placeholder="Escribe un ítem..."
                  className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition-all text-sm text-slate-700"
                />
              ) : (
                <textarea
                  value={item.text}
                  onChange={(e) => updateItem(item.id, 'text', e.target.value)}
                  placeholder="Escribe un párrafo..."
                  rows={3}
                  className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition-all text-sm text-slate-700 resize-none"
                />
              )}
              <button
                onClick={() => removeItem(item.id)}
                className="mt-2.5 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/30 transition-all"
        >
          <Plus size={14} /> Agregar {state.type === 'checklist' ? 'ítem' : 'párrafo'}
        </button>
      </div>
    </div>
  );
};

// ── Live Preview Component ──
const LivePreview = React.forwardRef(({ state }, ref) => {
  const palette = COLOR_PALETTES.find(p => p.id === state.palette) || COLOR_PALETTES[0];

  return (
    <div
      ref={ref}
      className="bg-white shadow-2xl mx-auto"
      style={{
        width: '595px',
        minHeight: '842px',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Header Band with Background Image */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        padding: state.coverImage ? '60px 48px 48px' : '40px 48px 32px',
        minHeight: state.coverImage ? '260px' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        {/* Background: image or gradient */}
        {state.coverImage ? (
          <>
            <img
              src={state.coverImage}
              alt=""
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                objectFit: 'cover', zIndex: 0,
              }}
            />
            {/* Dark overlay for readability */}
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              background: `linear-gradient(180deg, ${palette.secondary}cc 0%, ${palette.primary}ee 60%, ${palette.primary} 100%)`,
              zIndex: 1,
            }} />
          </>
        ) : (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: palette.gradient, zIndex: 0,
          }} />
        )}

        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '40%', width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', zIndex: 2 }} />

        {/* Text content */}
        <div style={{ position: 'relative', zIndex: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '28px', height: '3px', background: 'rgba(255,255,255,0.6)', borderRadius: '2px' }} />
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '3px' }}>
              {state.type === 'checklist' ? 'Checklist' : 'Mini E-Book'}
            </span>
          </div>

          <h1 style={{
            fontSize: state.coverImage ? '32px' : '28px', fontWeight: 900, color: 'white',
            lineHeight: 1.15, marginBottom: '12px', letterSpacing: '-0.5px',
            textShadow: state.coverImage ? '0 2px 12px rgba(0,0,0,0.3)' : 'none',
          }}>
            {state.title || 'Tu Título Aquí'}
          </h1>

          {state.subtitle && (
            <p style={{
              fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.5, maxWidth: '85%',
              textShadow: state.coverImage ? '0 1px 6px rgba(0,0,0,0.2)' : 'none',
            }}>
              {state.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div style={{ padding: '32px 48px 40px' }}>
        {state.type === 'checklist' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {state.items.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  padding: '14px 18px', borderRadius: '12px',
                  background: idx % 2 === 0 ? palette.bg : '#ffffff',
                  border: `1px solid ${palette.light}`,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '24px', height: '24px', borderRadius: '7px', flexShrink: 0, marginTop: '1px',
                  border: `2.5px solid ${palette.primary}`, background: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: palette.primary }}>{idx + 1}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155', lineHeight: 1.6, flex: 1 }}>
                  {item.text || 'Escribe un ítem del checklist...'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {state.items.map((item, idx) => (
              <div key={item.id}>
                {idx === 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '4px', height: '24px', borderRadius: '2px', background: palette.gradient }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: palette.primary, textTransform: 'uppercase', letterSpacing: '2px' }}>Introducción</span>
                  </div>
                )}
                <p style={{ fontSize: '13px', fontWeight: 400, color: '#475569', lineHeight: 1.8, textAlign: 'justify' }}>
                  {item.text || 'Escribe el contenido de tu e-book aquí...'}
                </p>
                {idx < state.items.length - 1 && (
                  <div style={{ width: '40px', height: '2px', background: palette.light, margin: '8px 0 0', borderRadius: '1px' }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        margin: '0 48px', padding: '20px 0', borderTop: `2px solid ${palette.light}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: palette.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: '12px', fontWeight: 900 }}>{(state.author || 'A')[0].toUpperCase()}</span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>{state.author || 'Tu marca aquí'}</span>
        </div>
        <span style={{ fontSize: '9px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
          softwarespectra.cl
        </span>
      </div>
    </div>
  );
});
LivePreview.displayName = 'LivePreview';

// ── Helper: generate shareable URL ──
const generateShareableData = (state) => {
  const shareState = { ...state, coverImage: null }; // remove image for URL size
  const json = JSON.stringify(shareState);
  const encoded = btoa(unescape(encodeURIComponent(json)));
  return encoded;
};

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://softwarespectra.cl';
};

// ── Export Modal Component ──
const ExportModal = ({ isOpen, onClose, state, previewRef, isExporting, onExportPDF }) => {
  const [copied, setCopied] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState(null);

  if (!isOpen) return null;

  const baseUrl = getBaseUrl();
  const shareData = generateShareableData(state);
  const shareUrl = `${baseUrl}/lead-magnet?d=${shareData}`;

  const embedScript = `<!-- Lead Magnet Embed - softwarespectra.cl -->
<div id="lm-embed-container"></div>
<script>
(function() {
  var iframe = document.createElement('iframe');
  iframe.src = '${shareUrl}&embed=1';
  iframe.style.cssText = 'width:100%;max-width:620px;height:900px;border:none;border-radius:16px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.15);margin:0 auto;display:block;';
  iframe.title = '${(state.title || 'Lead Magnet').replace(/'/g, "\\'")}';
  document.getElementById('lm-embed-container').appendChild(iframe);
})();
</script>`;

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2500);
    } catch { /* fallback */ }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const resp = await fetch('/api/lead-magnets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: state.title,
          type: state.type,
          data: { ...state, coverImage: null },
        }),
      });
      const result = await resp.json();
      if (result.success) {
        const url = `${baseUrl}/lead-magnet/${result.id}`;
        setPublishedUrl(url);
      }
    } catch (err) {
      console.error('Publish error:', err);
      // fallback to client-side URL
      setPublishedUrl(shareUrl);
    } finally {
      setPublishing(false);
    }
  };

  const displayUrl = publishedUrl || shareUrl;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Share2 size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-800">Exportar & Compartir</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tu Lead Magnet está listo</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Options */}
          <div className="p-6 space-y-4">
            {/* 1. PDF Download */}
            <button
              onClick={onExportPDF}
              disabled={isExporting}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Download size={20} className="text-white" />
              </div>
              <div className="flex-grow">
                <p className="font-bold text-sm text-slate-800">Descargar como PDF</p>
                <p className="text-xs text-slate-400">Descarga directa en formato A4 de alta calidad</p>
              </div>
              {isExporting && <div className="w-5 h-5 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />}
            </button>

            {/* 2. Shareable URL */}
            <div className="rounded-2xl border-2 border-slate-200 overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Link size={20} className="text-white" />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-sm text-slate-800">URL Compartible</p>
                  <p className="text-xs text-slate-400">Enlace directo para ver el Lead Magnet online</p>
                </div>
              </div>
              <div className="px-4 pb-4">
                {!publishedUrl ? (
                  <button
                    onClick={handlePublish}
                    disabled={publishing}
                    className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {publishing ? (
                      <><div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" /> Generando URL...</>
                    ) : (
                      <><ExternalLink size={14} /> Generar URL Pública</>
                    )}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={displayUrl}
                      className="flex-grow px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono truncate"
                    />
                    <button
                      onClick={() => handleCopy(displayUrl, 'url')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${copied === 'url' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      {copied === 'url' ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar</>}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Embed Script */}
            <div className="rounded-2xl border-2 border-slate-200 overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <Code size={20} className="text-white" />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-sm text-slate-800">Script Embebible</p>
                  <p className="text-xs text-slate-400">Pega este código en cualquier página web</p>
                </div>
                <button
                  onClick={() => handleCopy(embedScript, 'embed')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${copied === 'embed' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                >
                  {copied === 'embed' ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar</>}
                </button>
              </div>
              <div className="px-4 pb-4">
                <pre className="p-3 bg-slate-900 text-green-400 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">
                  {embedScript}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


// ── Main Component ──
const LeadMagnetStudio = ({ onBack }) => {
  const previewRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  const [state, setState] = useState({
    type: 'checklist',
    palette: 'ocean',
    title: 'Checklist de Marketing Digital',
    subtitle: 'Los pasos esenciales para lanzar tu primera campaña exitosa',
    coverImage: null,
    author: '',
    items: DEFAULT_ITEMS.checklist,
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(previewRef, state.title);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#f1f5f9' }}>
      {/* ── Top Bar ── */}
      <header className="h-16 min-h-[64px] bg-white border-b border-slate-200 flex items-center justify-between px-6 z-50 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl transition-all group">
            <ArrowLeft size={20} className="text-slate-500 group-hover:text-slate-800 transition-colors" />
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-200">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-800 uppercase">Lead Magnet Studio</h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Diseñador Visual</p>
            </div>
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden bg-slate-100 rounded-xl p-1">
          <button onClick={() => setActiveTab('edit')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'edit' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            <Edit3 size={14} />
          </button>
          <button onClick={() => setActiveTab('preview')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            <Eye size={14} />
          </button>
        </div>

        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2.5 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 transition-all"
        >
          <Share2 size={15} />
          Exportar & Compartir
        </button>
      </header>

      {/* ── Two-Column Layout with proper scroll ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor - independent scroll */}
        <aside className={`w-full md:w-[420px] lg:w-[460px] bg-white border-r border-slate-200 flex-shrink-0 flex flex-col overflow-hidden ${activeTab !== 'edit' ? 'hidden md:flex' : 'flex'}`}>
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Edit3 size={14} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Panel de Edición</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <EditorPanel state={state} setState={setState} />
          </div>
        </aside>

        {/* Right: Live Preview - independent scroll */}
        <main
          className={`flex-1 overflow-y-auto ${activeTab !== 'preview' ? 'hidden md:block' : 'block'}`}
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)', backgroundSize: '24px 24px' }}
        >
          <div className="p-6 md:p-10 flex flex-col items-center">
            <div className="mb-4 flex items-center gap-2">
              <Eye size={14} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vista Previa en Tiempo Real</span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50"
              style={{ maxWidth: '595px', width: '100%' }}
            >
              <LivePreview ref={previewRef} state={state} />
            </motion.div>
            <p className="mt-6 mb-10 text-[10px] font-bold text-slate-400 text-center">
              Formato A4 · Se exportará tal como se ve aquí
            </p>
          </div>
        </main>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        state={state}
        previewRef={previewRef}
        isExporting={isExporting}
        onExportPDF={handleExport}
      />
    </div>
  );
};

export default LeadMagnetStudio;
