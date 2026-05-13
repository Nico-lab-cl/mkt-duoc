import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, Sparkles, Eye, Edit3, Share2,
  Copy, Link, Code, X, ExternalLink, Check
} from 'lucide-react';
import { PALETTES, TEMPLATES, BLOCK_DEFS } from './blockTypes';
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

// Export Modal
const ExportModal = ({ isOpen, onClose, state, isExporting, onExportPDF }) => {
  const [copied, setCopied] = useState(null);
  const [pubUrl, setPubUrl] = useState(null);
  const [publishing, setPublishing] = useState(false);
  if (!isOpen) return null;

  const base = getBase();
  const safe = { ...state, blocks: state.blocks.map(b => ({ ...b, data: { ...b.data, bgImage: b.data.bgImage ? '[img]' : null, src: b.data.src ? '[img]' : null } })) };
  const shareUrl = pubUrl || `${base}/lead-magnet?d=${encodeState(safe)}`;

  const embedScript = `<!-- Lead Magnet - softwarespectra.cl -->\n<div id="lm-embed"></div>\n<script>\n(function(){var f=document.createElement('iframe');f.src='${shareUrl}&embed=1';f.style='width:100%;max-width:620px;height:900px;border:none;border-radius:16px;box-shadow:0 25px 50px rgba(0,0,0,.12);margin:0 auto;display:block';document.getElementById('lm-embed').appendChild(f)})();\n</script>`;

  const handleCopy = async (text, id) => { try { await navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2500); } catch {} };
  const handlePublish = async () => {
    setPublishing(true);
    try {
      const r = await fetch('/api/lead-magnets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: state.blocks[0]?.data?.title || 'Lead Magnet', type: 'pagebuilder', data: safe }) });
      const res = await r.json();
      if (res.success) setPubUrl(`${base}/lead-magnet/${res.id}`);
    } catch { setPubUrl(shareUrl); }
    setPublishing(false);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}
          className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center"><Share2 size={16} className="text-white" /></div>
              <div><h3 className="text-base font-black text-slate-800">Exportar & Compartir</h3><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tu Lead Magnet está listo</p></div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} className="text-slate-400" /></button>
          </div>
          <div className="p-5 space-y-3">
            <button onClick={onExportPDF} disabled={isExporting}
              className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 transition-all text-left group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0"><Download size={18} className="text-white" /></div>
              <div className="flex-grow"><p className="font-bold text-sm text-slate-800">Descargar PDF</p><p className="text-[10px] text-slate-400">Formato A4 alta calidad</p></div>
              {isExporting && <div className="w-4 h-4 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />}
            </button>

            <div className="rounded-2xl border-2 border-slate-200 overflow-hidden">
              <div className="p-3 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0"><Link size={18} className="text-white" /></div>
                <div className="flex-grow"><p className="font-bold text-sm text-slate-800">URL Compartible</p><p className="text-[10px] text-slate-400">Enlace directo online</p></div>
              </div>
              <div className="px-3 pb-3">
                {!pubUrl ? (
                  <button onClick={handlePublish} disabled={publishing}
                    className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                    {publishing ? <><div className="w-3.5 h-3.5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" /> Generando...</> : <><ExternalLink size={13} /> Generar URL</>}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input readOnly value={pubUrl} className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-600 font-mono truncate" />
                    <button onClick={() => handleCopy(pubUrl, 'url')}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold flex items-center gap-1 flex-shrink-0 ${copied === 'url' ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white'}`}>
                      {copied === 'url' ? <><Check size={12} /> ✓</> : <><Copy size={12} /> Copiar</>}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border-2 border-slate-200 overflow-hidden">
              <div className="p-3 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0"><Code size={18} className="text-white" /></div>
                <div className="flex-grow"><p className="font-bold text-sm text-slate-800">Script Embebible</p><p className="text-[10px] text-slate-400">Pegar en cualquier web</p></div>
                <button onClick={() => handleCopy(embedScript, 'embed')}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 ${copied === 'embed' ? 'bg-green-100 text-green-700' : 'bg-emerald-600 text-white'}`}>
                  {copied === 'embed' ? <><Check size={12} /> ✓</> : <><Copy size={12} /> Copiar</>}
                </button>
              </div>
              <div className="px-3 pb-3">
                <pre className="p-2.5 bg-slate-900 text-green-400 rounded-xl text-[9px] font-mono overflow-x-auto leading-relaxed max-h-24 overflow-y-auto">{embedScript}</pre>
              </div>
            </div>
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
      <p className="text-sm text-slate-500 max-w-md">Selecciona una plantilla para comenzar a diseñar tu lead magnet, guía, calculadora o landing page.</p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl w-full">
      {TEMPLATES.map(t => (
        <motion.button key={t.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(t)}
          className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-violet-400 hover:shadow-xl hover:shadow-violet-100 transition-all text-left group">
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
  const previewRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const [showTemplates, setShowTemplates] = useState(true);

  const [blocks, setBlocks] = useState([]);
  const [palette, setPalette] = useState('ocean');
  const [author, setAuthor] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const handleTemplate = (template) => {
    setBlocks(template.blocks());
    setShowTemplates(false);
    setSelectedId(null);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try { await exportToPDF(previewRef, blocks[0]?.data?.title); } catch (e) { console.error(e); }
    setIsExporting(false);
  };

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
            <div><p className="text-xs font-black text-slate-800 uppercase leading-none">Lead Magnet Studio</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Page Builder</p></div>
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
          <button onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-violet-200 transition-all">
            <Share2 size={13} /> Exportar & Compartir
          </button>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="flex flex-1 overflow-hidden">
        <aside className={`w-full md:w-[380px] lg:w-[420px] bg-white border-r border-slate-200 flex-shrink-0 flex flex-col overflow-hidden ${activeTab !== 'edit' ? 'hidden md:flex' : 'flex'}`}>
          <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center gap-2"><Edit3 size={12} className="text-slate-400" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Editor</span></div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <EditorPanel blocks={blocks} setBlocks={setBlocks} selectedId={selectedId} setSelectedId={setSelectedId} palette={palette} setPalette={setPalette} author={author} setAuthor={setAuthor} />
          </div>
        </aside>

        <main className={`flex-1 overflow-y-auto ${activeTab !== 'preview' ? 'hidden md:block' : 'block'}`}
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)', backgroundSize: '24px 24px' }}>
          <div className="p-6 md:p-8 flex flex-col items-center">
            <div className="mb-3 flex items-center gap-2"><Eye size={12} className="text-slate-400" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Vista Previa</span></div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50" style={{ maxWidth: '595px', width: '100%' }}>
              <LivePreview ref={previewRef} blocks={blocks} palette={palette} author={author} />
            </motion.div>
            <p className="mt-4 mb-8 text-[9px] font-bold text-slate-400 text-center">Formato A4 · Se exportará tal como se ve</p>
          </div>
        </main>
      </div>

      <ExportModal
        isOpen={showExportModal} onClose={() => setShowExportModal(false)}
        state={{ blocks, palette, author }}
        isExporting={isExporting} onExportPDF={handleExport}
      />
    </div>
  );
};

export default LeadMagnetStudio;
