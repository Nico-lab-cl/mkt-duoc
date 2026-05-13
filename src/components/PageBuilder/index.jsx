import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, Sparkles, Eye, Edit3, Share2,
  Copy, Link, Code, X, ExternalLink, Check
} from 'lucide-react';
import { PALETTES, TEMPLATES, BLOCK_DEFS, getCustomPalette } from './blockTypes';
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

// Export Modal (Simplified to just PDF)
const ExportModal = ({ isOpen, onClose, isExporting, onExportPDF }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}
          className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center"><Download size={16} className="text-white" /></div>
              <div><h3 className="text-base font-black text-slate-800">Exportar PDF</h3></div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl"><X size={18} className="text-slate-400" /></button>
          </div>
          <div className="p-5 space-y-3">
            <button onClick={onExportPDF} disabled={isExporting}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white transition-all text-left group">
              <div className="flex-grow text-center"><p className="font-bold text-sm">Descargar como PDF</p><p className="text-[10px] text-violet-200">Formato A4 alta calidad</p></div>
              {isExporting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            </button>
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
  const previewRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' or 'mobile'
  const [showTemplates, setShowTemplates] = useState(true);

  const [blocks, setBlocks] = useState([]);
  const [palette, setPalette] = useState('ocean');
  const [customHex, setCustomHex] = useState('#ff0000');
  const [author, setAuthor] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const handleTemplate = (template) => {
    setBlocks(template.blocks());
    setShowTemplates(false);
    setSelectedId(null);
  };

  const handleExport = async () => {
    setIsExporting(true);
    // Force preview to desktop before exporting
    const oldMode = previewMode;
    if (previewMode !== 'desktop') setPreviewMode('desktop');
    setTimeout(async () => {
      try { await exportToPDF(previewRef, blocks[0]?.data?.title); } catch (e) { console.error(e); }
      setPreviewMode(oldMode);
      setIsExporting(false);
      setShowExportModal(false);
    }, 100);
  };

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
          <button onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-violet-200 transition-all">
            <Download size={13} /> Exportar
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
            <p className="mt-4 mb-8 text-[9px] font-bold text-slate-400 text-center">Exportación optimizada (A4) disponible en el botón Exportar</p>
          </div>
        </main>
      </div>

      <ExportModal
        isOpen={showExportModal} onClose={() => setShowExportModal(false)}
        isExporting={isExporting} onExportPDF={handleExport}
      />
    </div>
  );
};

export default LeadMagnetStudio;
