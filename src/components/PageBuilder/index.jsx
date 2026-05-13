import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, Sparkles, Eye, Edit3, Share2,
  Copy, Link, Code, X, ExternalLink, Check
} from 'lucide-react';
import { PALETTES, TEMPLATES, BLOCK_DEFS, getCustomPalette } from './blockTypes';
import { useProject } from '../../context/ProjectContext';
import LivePreview from './BlockPreview';
import EditorPanel from './BlockEditor';

// PDF Export
const exportToPDF = async (ref, title) => {
  const el = ref.current; if (!el) return;
  const { default: html2canvas } = await import('html2canvas-pro');
  const { jsPDF } = await import('jspdf');
  const canvas = await html2canvas(el, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#fff', logging: false });
  const pdf = new jsPDF('p', 'mm', 'a4');
  const w = 210, h = (canvas.height * 210) / canvas.width;
  let left = h, pos = 0;
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, h);
  left -= 297;
  while (left > 0) { pos -= 297; pdf.addPage(); pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, pos, w, h); left -= 297; }
  pdf.save(`${(title || 'lead-magnet').replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase()}.pdf`);
};

// Shareable helpers
const encodeState = (s) => btoa(unescape(encodeURIComponent(JSON.stringify(s))));
const getBase = () => (typeof window !== 'undefined' ? window.location.origin : 'https://softwarespectra.cl');

// Share Modal with PDF, URL and Embed
const ShareModal = ({ isOpen, onClose, isExporting, onExportPDF, publishedUrl, embedCode }) => {
  const [copied, setCopied] = React.useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()}
          className="bg-white rounded-[2.5rem] w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                <Share2 size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Compartir y Exportar</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Publica tu creación</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-100">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* PDF Option */}
            <div className="group">
              <button onClick={onExportPDF} disabled={isExporting}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50/50 transition-all text-left">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"><Download size={20} /></div>
                <div className="flex-grow">
                  <p className="font-black text-slate-800 text-sm">Descargar PDF</p>
                  <p className="text-[10px] text-slate-400 font-medium tracking-tight">Formato A4 profesional de alta fidelidad</p>
                </div>
                {isExporting ? <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /> : <ArrowLeft size={16} className="text-slate-300 rotate-180" />}
              </button>
            </div>

            {publishedUrl ? (
              <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-2">
                {/* Public URL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Enlace Público</label>
                  <div className="flex gap-2 p-2 bg-slate-50 border-2 border-slate-100 rounded-2xl items-center">
                    <div className="px-3 py-1.5 text-xs text-slate-500 font-medium truncate flex-grow select-all bg-white rounded-xl border border-slate-100">
                      {publishedUrl}
                    </div>
                    <button onClick={() => copyToClipboard(publishedUrl, 'url')} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] transition-all ${copied === 'url' ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-slate-800 text-white hover:bg-slate-900 shadow-lg shadow-slate-200'}`}>
                      {copied === 'url' ? <><Check size={12} /> Copiado</> : <><Link size={12} /> Copiar</>}
                    </button>
                    <a href={publishedUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 rounded-xl transition-all">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {/* Embed Code */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código de Inserción (Embed)</label>
                  <div className="relative group">
                    <pre className="p-4 bg-slate-900 rounded-2xl text-[10px] text-indigo-300 font-mono overflow-x-auto border-2 border-slate-800 group-hover:border-indigo-500/30 transition-all">
                      {embedCode}
                    </pre>
                    <button onClick={() => copyToClipboard(embedCode, 'embed')} 
                      className={`absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-[9px] transition-all ${copied === 'embed' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'}`}>
                      {copied === 'embed' ? <><Check size={10} /> Copiado</> : <><Code size={10} /> Copiar Código</>}
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-400 font-medium text-center italic">Copia este código para insertar el bloque en cualquier sitio web.</p>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <button onClick={() => window.dispatchEvent(new CustomEvent('publish-requested'))}
                  className="w-full flex items-center gap-4 p-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xl shadow-indigo-100 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform"><Sparkles size={24} /></div>
                  <div className="flex-grow text-left">
                    <p className="font-black text-base leading-tight">Publicar Página</p>
                    <p className="text-[10px] text-indigo-100 font-medium">Obtener URL pública y código embed</p>
                  </div>
                  <ArrowLeft size={20} className="rotate-180 opacity-50" />
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 text-center">
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Lead Magnet Studio • Marketing Digital Lab</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Template selector screen
const TemplateSelector = ({ onSelect }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center p-10">
    <div className="text-center mb-8">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-200">
        <Sparkles size={28} className="text-white" />
      </div>
      <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Lead Magnet Studio</h2>
      <p className="text-sm text-slate-500 max-w-md">Selecciona una plantilla para comenzar a diseñar tu landing page, guía o calculadora.</p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl w-full">
      {TEMPLATES.map(t => (
        <motion.button key={t.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(t)}
          className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-violet-400 hover:shadow-xl hover:shadow-violet-100 transition-all text-left group flex flex-col items-center text-center">
          <span className="text-3xl block mb-3">{t.emoji}</span>
          <h3 className="text-sm font-black text-slate-800 mb-1">{t.name}</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed">{t.desc}</p>
        </motion.button>
      ))}
    </div>
  </motion.div>
);

// Main component
const LeadMagnetStudio = ({ onBack }) => {
  const { currentUser } = useProject();
  const previewRef = React.useRef(null);
  const [isExporting, setIsExporting] = React.useState(false);
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('edit');
  const [previewMode, setPreviewMode] = React.useState('desktop'); // 'desktop' or 'mobile'
  const [showTemplates, setShowTemplates] = React.useState(true);

  const [blocks, setBlocks] = React.useState([]);
  const [palette, setPalette] = React.useState('ocean');
  const [customHex, setCustomHex] = React.useState('#ff0000');
  const [author, setAuthor] = React.useState(currentUser?.full_name || '');
  const [selectedId, setSelectedId] = React.useState(null);
  const [publishedId, setPublishedId] = React.useState(null);

  const [saveMessage, setSaveMessage] = React.useState(null);

  const handleTemplate = (template) => {
    setBlocks(template.blocks());
    setShowTemplates(false);
    setSelectedId(null);
    setPublishedId(null);
  };

  const handleSave = async () => {
    setIsExporting(true);
    try {
      const payload = {
        title: blocks[0]?.data?.title || 'Mi Landing Page',
        type: 'page_builder',
        userId: currentUser?.id,
        groupId: currentUser?.group_id,
        data: { blocks, palette, customHex, author }
      };
      const res = await fetch('/api/lead-magnets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        setPublishedId(result.id);
        setSaveMessage('¡Proyecto guardado con éxito!');
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error saving:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePublish = async () => {
    setIsExporting(true);
    try {
      const payload = {
        title: blocks[0]?.data?.title || 'Mi Landing Page',
        type: 'page_builder',
        userId: currentUser?.id,
        groupId: currentUser?.group_id,
        data: { blocks, palette, customHex, author }
      };
      const res = await fetch('/api/lead-magnets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        setPublishedId(result.id);
        setShowExportModal(true);
      }
    } catch (err) {
      console.error('Error publishing:', err);
    } finally {
      setIsExporting(false);
    }
  };

  React.useEffect(() => {
    const onPublish = () => handlePublish();
    window.addEventListener('publish-requested', onPublish);
    return () => window.removeEventListener('publish-requested', onPublish);
  }, [blocks, palette, customHex, author]);

  const handleExport = async () => {
    setIsExporting(true);
    const oldMode = previewMode;
    if (previewMode !== 'desktop') setPreviewMode('desktop');
    setTimeout(async () => {
      try { await exportToPDF(previewRef, blocks[0]?.data?.title); } catch (e) { console.error(e); }
      setPreviewMode(oldMode);
      setIsExporting(false);
    }, 100);
  };

  const publicUrl = publishedId ? `${window.location.origin}/p/${publishedId}` : null;
  const embedCode = publicUrl ? `<iframe src="${publicUrl}" width="100%" height="600px" frameborder="0"></iframe>` : '';

  // Resolve palette string into actual palette ID to pass down (if custom, pass 'custom' and store in blockTypes)
  const resolvedPalette = palette === 'custom' ? getCustomPalette(customHex) : PALETTES.find(p => p.id === palette);

  if (showTemplates) {
    return (
      <div className="h-screen flex flex-col" style={{ backgroundColor: '#f1f5f9' }}>
        <header className="h-14 min-h-[56px] bg-white border-b border-slate-200 flex items-center px-6 flex-shrink-0 shadow-sm">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl"><ArrowLeft size={20} className="text-slate-500" /></button>
        </header>
        <div className="flex-1 overflow-y-auto"><TemplateSelector onSelect={handleTemplate} /></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#f1f5f9' }}>
      {/* Top Bar */}
      <header className="h-14 min-h-[56px] bg-white border-b border-slate-200 flex items-center justify-between px-5 z-50 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl group"><ArrowLeft size={18} className="text-slate-500 group-hover:text-slate-800" /></button>
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-200"><Sparkles size={14} className="text-white" /></div>
            <div><p className="text-xs font-black text-slate-800 uppercase leading-none">Lead Magnet Studio</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Page Builder Premium</p></div>
          </div>
          <button onClick={() => setShowTemplates(true)} className="ml-4 px-3 py-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all">
            Cambiar plantilla
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex md:hidden bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setActiveTab('edit')} className={`px-3 py-1 rounded text-[10px] font-bold ${activeTab === 'edit' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}><Edit3 size={12} /></button>
            <button onClick={() => setActiveTab('preview')} className={`px-3 py-1 rounded text-[10px] font-bold ${activeTab === 'preview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}><Eye size={12} /></button>
          </div>
          
          <button onClick={handleSave} disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2 bg-white border-2 border-slate-200 hover:border-violet-500 hover:text-violet-600 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 group">
            <Check size={14} className={saveMessage ? 'text-green-500' : 'text-slate-400 group-hover:text-violet-500'} /> 
            {saveMessage ? 'Guardado' : 'Guardar'}
          </button>

          <button onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-black text-[10px] uppercase tracking-wider shadow-lg shadow-violet-200 transition-all active:scale-95 group">
            <Share2 size={14} className="group-hover:rotate-12 transition-transform" /> Compartir
          </button>
        </div>
      </header>

      {/* Floating Save Message */}
      <AnimatePresence>
        {saveMessage && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"><Check size={14} /></div>
            <span className="text-sm font-bold">{saveMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Two-column layout */}
      <div className="flex flex-1 overflow-hidden">
        <aside className={`w-full md:w-[380px] lg:w-[420px] bg-white border-r border-slate-200 flex-shrink-0 flex flex-col overflow-hidden ${activeTab !== 'edit' ? 'hidden md:flex' : 'flex'}`}>
          <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center gap-2"><Edit3 size={12} className="text-slate-400" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Editor</span></div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <EditorPanel blocks={blocks} setBlocks={setBlocks} selectedId={selectedId} setSelectedId={setSelectedId} palette={palette} setPalette={setPalette} customHex={customHex} setCustomHex={setCustomHex} author={author} setAuthor={setAuthor} />
          </div>
        </aside>

        <main className={`flex-1 overflow-y-auto relative ${activeTab !== 'preview' ? 'hidden md:block' : 'block'}`}
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)', backgroundSize: '24px 24px' }}>
          
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white p-1 rounded-xl shadow-md border border-slate-200 z-10">
            <button onClick={() => setPreviewMode('desktop')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${previewMode === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Desktop</button>
            <button onClick={() => setPreviewMode('mobile')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${previewMode === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Móvil</button>
          </div>

          <div className="p-6 md:p-8 pt-20 flex flex-col items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50 transition-all duration-300 ${previewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-[800px]'}`} >
              <LivePreview ref={previewRef} blocks={blocks} palette={palette === 'custom' ? resolvedPalette.id : palette} resolvedPalette={resolvedPalette} author={author} />
            </motion.div>
            <p className="mt-4 mb-8 text-[9px] font-bold text-slate-400 text-center">Exportación optimizada (A4) disponible en el botón Compartir</p>
          </div>
        </main>
      </div>

      <ShareModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
        isExporting={isExporting} 
        onExportPDF={handleExport}
        publishedUrl={publicUrl}
        embedCode={embedCode}
      />
    </div>
  );
};

export default LeadMagnetStudio;
