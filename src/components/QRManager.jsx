import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  Download, 
  Copy, 
  Trash2, 
  ExternalLink, 
  BarChart, 
  Smartphone, 
  Monitor, 
  Calendar, 
  X, 
  Check, 
  Link as LinkIcon, 
  Plus, 
  Clock, 
  Globe 
} from 'lucide-react';

// Función para parsear el User Agent
const parseUserAgent = (ua) => {
  let browser = 'Otros';
  let device = 'Escritorio';

  if (!ua) return { browser, device };
  const uaLower = ua.toLowerCase();
  
  // Parsear dispositivo
  if (uaLower.includes('mobi') || uaLower.includes('android') || uaLower.includes('iphone')) {
    device = 'Móvil';
  } else if (uaLower.includes('ipad') || uaLower.includes('tablet')) {
    device = 'Tablet';
  }

  // Parsear navegador
  if (uaLower.includes('firefox')) {
    browser = 'Firefox';
  } else if (uaLower.includes('chrome') || uaLower.includes('crios')) {
    browser = 'Chrome';
  } else if (uaLower.includes('safari') && !uaLower.includes('chrome')) {
    browser = 'Safari';
  } else if (uaLower.includes('edge') || uaLower.includes('edg')) {
    browser = 'Edge';
  } else if (uaLower.includes('opera') || uaLower.includes('opr')) {
    browser = 'Opera';
  }

  return { browser, device };
};

// Sub-componente para renderizar la imagen del QR de forma diferida
const QRThumbnail = ({ id, color, size = 150 }) => {
  const [dataUrl, setDataUrl] = useState('');
  const redirectUrl = `${window.location.origin}/qr/${id}`;

  useEffect(() => {
    QRCode.toDataURL(redirectUrl, {
      width: size,
      margin: 1,
      color: {
        dark: color || '#0f172a',
        light: '#ffffff'
      }
    })
    .then(setDataUrl)
    .catch(err => console.error('Error generating thumbnail:', err));
  }, [id, color, size, redirectUrl]);

  if (!dataUrl) {
    return (
      <div className="animate-pulse bg-slate-100 rounded-lg flex items-center justify-center" style={{ width: size, height: size }}>
        <QrCode size={24} className="text-slate-350" />
      </div>
    );
  }

  return (
    <img 
      src={dataUrl} 
      alt={`QR ${id}`} 
      className="rounded-lg shadow-sm border border-slate-100"
      style={{ width: size, height: size }}
    />
  );
};

const QRManager = ({ userId }) => {
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados del formulario
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [color, setColor] = useState('#0f172a');
  
  // Estado para Live Preview
  const [previewDataUrl, setPreviewDataUrl] = useState('');
  
  // Estados de estadísticas/modal
  const [selectedQr, setSelectedQr] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const colors = [
    { name: 'Slate Dark', hex: '#0f172a', class: 'bg-[#0f172a]' },
    { name: 'Duoc Blue', hex: '#2563eb', class: 'bg-[#2563eb]' },
    { name: 'Purple Neon', hex: '#7c3aed', class: 'bg-[#7c3aed]' },
    { name: 'Emerald', hex: '#059669', class: 'bg-[#059669]' },
    { name: 'Crimson', hex: '#e11d48', class: 'bg-[#e11d48]' }
  ];

  // Obtener QRs al montar
  useEffect(() => {
    fetchQrs();
  }, [userId]);

  const fetchQrs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/qr?user_id=${userId}`);
      const data = await response.json();
      setQrs(data);
    } catch (err) {
      console.error('Error al obtener QRs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar Live Preview en el cliente
  useEffect(() => {
    if (url.trim()) {
      let previewUrl = url.trim();
      if (!/^https?:\/\//i.test(previewUrl)) {
        previewUrl = 'https://' + previewUrl;
      }
      QRCode.toDataURL(previewUrl, {
        width: 250,
        margin: 1,
        color: {
          dark: color,
          light: '#ffffff'
        }
      })
      .then(setPreviewDataUrl)
      .catch(() => setPreviewDataUrl(''));
    } else {
      setPreviewDataUrl('');
    }
  }, [url, color]);

  // Crear QR
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    try {
      const response = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          destination_url: finalUrl,
          color,
          user_id: userId
        })
      });
      const data = await response.json();
      if (data.success) {
        setQrs(prev => [data.qr, ...prev]);
        setName('');
        setUrl('');
        setColor('#0f172a');
      } else {
        alert(data.error || 'Error al crear código QR');
      }
    } catch (err) {
      console.error(err);
      alert('Error al conectar con el servidor');
    }
  };

  // Descargar QR
  const handleDownload = async (qr) => {
    const redirectUrl = `${window.location.origin}/qr/${qr.id}`;
    try {
      const dataUrl = await QRCode.toDataURL(redirectUrl, {
        width: 600,
        margin: 2,
        color: {
          dark: qr.color || '#0f172a',
          light: '#ffffff'
        }
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `QR_${qr.name.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading QR:', err);
    }
  };

  // Copiar enlace acortado
  const handleCopyLink = (qrId) => {
    const link = `${window.location.origin}/qr/${qrId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(qrId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Eliminar QR
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este código QR y todo su historial de escaneo?')) return;
    try {
      const response = await fetch(`/api/qr/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setQrs(prev => prev.filter(qr => qr.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Ver estadísticas
  const handleViewStats = async (qr) => {
    setSelectedQr(qr);
    setLoadingStats(true);
    try {
      const response = await fetch(`/api/qr/stats/${qr.id}`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Procesamiento de estadísticas para visualización
  const getProcessedStats = () => {
    if (!stats || !stats.scans) return { devices: {}, browsers: {}, dates: {} };
    
    const devices = {};
    const browsers = {};
    const dates = {};

    stats.scans.forEach(scan => {
      const { device, browser } = parseUserAgent(scan.user_agent);
      devices[device] = (devices[device] || 0) + 1;
      browsers[browser] = (browsers[browser] || 0) + 1;

      const dateStr = new Date(scan.scanned_at).toLocaleDateString('es-CL');
      dates[dateStr] = (dates[dateStr] || 0) + 1;
    });

    return { devices, browsers, dates };
  };

  const processed = getProcessedStats();

  return (
    <div className="space-y-10 pb-36">
      
      {/* Explicación del Premio */}
      <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Premio Exclusivo</span>
          <h3 className="text-3xl font-black tracking-tighter italic">Herramienta de QR & Analíticas Integrada</h3>
          <p className="text-slate-350 text-sm mt-2 leading-relaxed">
            Te otorgamos este módulo para que puedas generar códigos QR personalizados para tus campañas de Inbound Marketing. 
            No necesitas usar herramientas externas con publicidad o cobros: crea enlaces de redirección y <strong>mide el comportamiento en tiempo real</strong> directamente desde Spectra.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL IZQUIERDO: CREACIÓN & LIVE PREVIEW */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-black tracking-tighter uppercase italic text-slate-800 mb-6 flex items-center gap-2">
              <Plus size={18} className="text-indigo-650" /> Nuevo Código QR
            </h3>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nombre Identificador</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej: Código Volante Feria, Link Bio Insta"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all text-sm font-semibold text-slate-800"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">URL de Destino</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450">
                    <LinkIcon size={16} />
                  </div>
                  <input 
                    type="text"
                    required
                    placeholder="https://tupagina.com/oferta"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all text-sm font-semibold text-slate-800"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Color del QR</label>
                <div className="flex gap-2.5">
                  {colors.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setColor(c.hex)}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${c.class} ${color === c.hex ? 'border-indigo-600 scale-110 shadow-lg shadow-indigo-100' : 'border-transparent hover:scale-105'}`}
                      title={c.name}
                    >
                      {color === c.hex && <Check size={12} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!name.trim() || !url.trim()}
                className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold uppercase text-xs tracking-widest transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Generar Código QR
              </button>
            </form>
          </div>

          {/* LIVE PREVIEW CARD */}
          <div className="bg-slate-50 rounded-[2rem] border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[320px]">
            <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block mb-4">Vista Previa en Tiempo Real</span>
            {previewDataUrl ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg"
              >
                <img src={previewDataUrl} alt="Preview QR" className="w-[180px] h-[180px]" />
                <span className="text-[11px] font-bold text-slate-450 block mt-4 truncate max-w-[200px]">{url}</span>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4">
                  <QrCode size={32} className="text-slate-350" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider">Completa los campos</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">El código QR y su redirección se generarán automáticamente.</p>
              </div>
            )}
          </div>
        </div>

        {/* PANEL DERECHO: MIS CÓDIGOS QR & SCAN COUNTERS */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm min-h-[600px] flex flex-col">
            <h3 className="text-lg font-black tracking-tighter uppercase italic text-slate-800 mb-6 flex items-center gap-2">
              <QrCode size={18} className="text-indigo-650" /> Mis Códigos QR Activos
            </h3>

            {loading ? (
              <div className="flex-grow flex items-center justify-center text-slate-400">
                <span className="animate-pulse font-bold text-sm uppercase tracking-widest">Cargando códigos QR...</span>
              </div>
            ) : qrs.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-slate-400 py-12">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                  <LinkIcon size={32} className="text-slate-350" />
                </div>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-600">No hay códigos creados aún</p>
                <p className="text-xs text-slate-400 mt-1 text-center max-w-sm">
                  Crea tu primer enlace acortado a la izquierda. Obtendrás un enlace de redirección seguro y métricas detalladas cada vez que alguien escanee el código.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {qrs.map((qr) => {
                  const shortUrl = `${window.location.origin}/qr/${qr.id}`;
                  return (
                    <motion.div 
                      key={qr.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl hover:border-indigo-250 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          <QRThumbnail id={qr.id} color={qr.color} size={100} />
                        </div>
                        <div className="min-w-0 flex-grow">
                          <p className="font-bold text-slate-850 text-base truncate mb-1" title={qr.name}>{qr.name}</p>
                          <p className="text-[10px] font-mono text-slate-400 truncate mb-3" title={qr.destination_url}>
                            Destino: {qr.destination_url}
                          </p>
                          
                          {/* Enlace acortado */}
                          <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-slate-600 truncate mr-2 select-all">
                              /qr/{qr.id}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyLink(qr.id)}
                              className="text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
                              title="Copiar enlace"
                            >
                              {copiedId === qr.id ? (
                                <Check size={14} className="text-emerald-500" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Contador de Escaneos y Acciones */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Escaneos Totales</span>
                          <span className="text-xl font-black text-indigo-650 flex items-center gap-1.5 mt-0.5">
                            {qr.scan_count} 
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                          </span>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleViewStats(qr)}
                            className="p-2 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-650 border border-slate-100 hover:border-indigo-150 rounded-xl transition-all cursor-pointer"
                            title="Ver Analíticas"
                          >
                            <BarChart size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(qr)}
                            className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-650 border border-slate-100 hover:border-blue-150 rounded-xl transition-all cursor-pointer"
                            title="Descargar imagen PNG"
                          >
                            <Download size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(qr.id)}
                            className="p-2 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500 border border-slate-100 hover:border-red-150 rounded-xl transition-all cursor-pointer"
                            title="Eliminar QR"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE ESTADÍSTICAS / ANALÍTICAS DETALLADAS */}
      <AnimatePresence>
        {selectedQr && stats && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100"
            >
              {/* Header Modal */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center">
                    <BarChart size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tighter uppercase italic text-slate-800">
                      Métricas: {selectedQr.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 truncate max-w-[400px]">
                      Destino: {selectedQr.destination_url}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => { setSelectedQr(null); setStats(null); }} 
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-450"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Contenido Modal */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6">
                
                {/* Stats Counters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col justify-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Escaneos Totales</span>
                    <span className="text-3xl font-black text-slate-800">{selectedQr.scan_count}</span>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col justify-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Enlace Corto</span>
                    <span className="text-sm font-mono font-bold text-indigo-650 truncate mt-1">/qr/{selectedQr.id}</span>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col justify-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fecha Creación</span>
                    <span className="text-sm font-bold text-slate-600 mt-1">
                      {new Date(selectedQr.created_at).toLocaleDateString('es-CL')}
                    </span>
                  </div>
                </div>

                {/* Gráficos / Breakdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Dispositivos (Móvil vs Escritorio) */}
                  <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4">
                    <h4 className="font-black text-xs uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                      <Smartphone size={14} /> Distribución por Dispositivo
                    </h4>
                    
                    {Object.keys(processed.devices).length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center font-semibold">Esperando escaneos...</p>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(processed.devices).map(([device, count]) => {
                          const percentage = Math.round((count / selectedQr.scan_count) * 100);
                          return (
                            <div key={device} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span>{device}</span>
                                <span>{count} ({percentage}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-500 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Navegadores (Chrome, Safari, etc.) */}
                  <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4">
                    <h4 className="font-black text-xs uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                      <Globe size={14} /> Navegador Web
                    </h4>
                    
                    {Object.keys(processed.browsers).length === 0 ? (
                      <p className="text-xs text-slate-400 py-6 text-center font-semibold">Esperando escaneos...</p>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(processed.browsers).map(([browser, count]) => {
                          const percentage = Math.round((count / selectedQr.scan_count) * 100);
                          return (
                            <div key={browser} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span>{browser}</span>
                                <span>{count} ({percentage}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>

                {/* Historial Reciente de Escaneos */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6">
                  <h4 className="font-black text-xs uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-1.5">
                    <Clock size={14} /> Historial Reciente de Escaneos
                  </h4>

                  {stats.scans.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                      Este código QR no ha registrado escaneos todavía.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-semibold text-slate-600">
                        <thead>
                          <tr className="text-[10px] text-slate-450 uppercase tracking-wider border-b border-slate-100">
                            <th className="pb-3">Fecha y Hora</th>
                            <th className="pb-3">Dispositivo</th>
                            <th className="pb-3">Navegador</th>
                            <th className="pb-3">IP Origen</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.scans.map((scan, index) => {
                            const { device, browser } = parseUserAgent(scan.user_agent);
                            const scanDate = new Date(scan.scanned_at);
                            return (
                              <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50">
                                <td className="py-2.5 text-slate-800">
                                  {scanDate.toLocaleDateString('es-CL')} {scanDate.toLocaleTimeString('es-CL')}
                                </td>
                                <td className="py-2.5">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${device === 'Móvil' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                                    {device}
                                  </span>
                                </td>
                                <td className="py-2.5 text-slate-700">{browser}</td>
                                <td className="py-2.5 font-mono text-slate-450">{scan.ip || '127.0.0.1'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default QRManager;
