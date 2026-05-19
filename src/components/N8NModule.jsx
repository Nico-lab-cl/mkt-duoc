import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Zap, Plus, Trash2, Send, 
  CheckCircle, AlertCircle, Link2, Server, HelpCircle, 
  ChevronRight, ExternalLink
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const DEFAULT_FIELDS = [
  { id: '1', label: 'Nombre Completo', key: 'full_name' },
  { id: '2', label: 'Correo Electrónico', key: 'email' },
  { id: '3', label: 'Teléfono', key: 'phone' }
];

const N8NModule = ({ onBack }) => {
  const { currentUser } = useProject();
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testData, setTestData] = useState({});
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Handle test data changes
  useEffect(() => {
    const newTestData = {};
    fields.forEach(f => {
      newTestData[f.key] = testData[f.key] || '';
    });
    setTestData(newTestData);
  }, [fields]);

  const addField = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setFields([...fields, { id, label: '', key: '' }]);
  };

  const updateField = (id, field, value) => {
    setFields(fields.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleTest = async () => {
    if (!webhookUrl) {
      setErrorMessage('Por favor, ingresa la URL de tu Webhook de n8n.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    if (!webhookUrl.startsWith('http')) {
      setErrorMessage('La URL del Webhook debe comenzar con http:// o https://');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setErrorMessage(`Error del servidor n8n: ${response.status}`);
        setStatus('error');
      }
    } catch (err) {
      setErrorMessage('No se pudo conectar. Verifica que la URL sea correcta y que el nodo Webhook en n8n esté en modo "Listen for Test Event".');
      setStatus('error');
    }

    setTimeout(() => {
      if (status !== 'error') setStatus('idle'); // keep error visible a bit longer
    }, 5000);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="h-14 min-h-[56px] bg-white border-b border-slate-200 flex items-center justify-between px-5 z-50 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl group transition-all">
            <ArrowLeft size={18} className="text-slate-500 group-hover:text-slate-800" />
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#ff6d5a] flex items-center justify-center shadow-lg shadow-[#ff6d5a]/20">
              <Zap size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 uppercase leading-none tracking-tight">N8N Simulador</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Laboratorio de Automatización</p>
            </div>
          </div>
        </div>
        <a href="https://n8n-n8n.db8enk.easypanel.host/" target="_blank" rel="noreferrer" 
          className="flex items-center gap-2 px-4 py-1.5 bg-[#ff6d5a]/10 hover:bg-[#ff6d5a]/20 text-[#ff6d5a] rounded-lg text-[10px] font-black uppercase tracking-wider transition-all">
          <ExternalLink size={12} /> Abrir N8N
        </a>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Column: Assistant / Tutorial */}
        <aside className="w-[350px] lg:w-[400px] bg-white border-r border-slate-200 flex flex-col overflow-y-auto custom-scrollbar flex-shrink-0">
          <div className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff6d5a] to-orange-500 flex items-center justify-center text-white shadow-xl shadow-[#ff6d5a]/20 mb-6">
              <Server size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter mb-2 italic">Entrenador N8N</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
              Aprende a conectar formularios web con flujos de trabajo automatizados usando Webhooks.
            </p>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#ff6d5a] text-white flex items-center justify-center text-xs font-black">1</div>
                <div className="absolute left-3 top-8 bottom-[-16px] w-0.5 bg-slate-100" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Crea tu Formulario</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  A la derecha, define los campos que tu cliente llenará. 
                  <strong className="text-slate-700"> IMPORTANTE: </strong> Asigna un "Key" (clave) en minúsculas sin espacios a cada campo. Este será el nombre de la variable que viajará a n8n.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#ff6d5a] text-white flex items-center justify-center text-xs font-black">2</div>
                <div className="absolute left-3 top-8 bottom-[-16px] w-0.5 bg-slate-100" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Crea el Webhook en N8N</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-2">
                  Abre n8n, crea un nuevo workflow y agrega un nodo <strong>"Webhook"</strong>.
                </p>
                <ul className="text-[10px] space-y-1 text-slate-600 list-disc pl-4 mb-2 font-medium">
                  <li>Method: POST</li>
                  <li>Copia la <span className="font-bold text-[#ff6d5a]">Test URL</span></li>
                  <li>Presiona <strong>"Listen for Test Event"</strong></li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#ff6d5a] text-white flex items-center justify-center text-xs font-black">3</div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Pega la URL y Prueba</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pega la Test URL aquí abajo, llena datos de prueba en tu formulario y presiona Enviar. ¡Ve a n8n para ver la magia!
                </p>
              </div>
            </div>

            <div className="mt-10 p-5 bg-blue-50 border-2 border-blue-100 rounded-2xl">
              <div className="flex gap-3 mb-2">
                <HelpCircle size={16} className="text-blue-500 flex-shrink-0" />
                <h4 className="text-xs font-black text-blue-800 uppercase tracking-wider">¿Por qué usar Keys?</h4>
              </div>
              <p className="text-[10px] text-blue-600 font-medium leading-relaxed">
                Las máquinas no leen "Nombre Completo", prefieren identificadores limpios como <code>full_name</code>. N8N recibirá un objeto JSON usando las keys que definas.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Column: Workspace */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-2xl mx-auto space-y-8 pb-20">
            
            {/* Form Builder Section */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tighter">Constructor de Variables</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Define qué datos enviaremos</p>
                </div>
                <button onClick={addField} 
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-[#ff6d5a] text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors">
                  <Plus size={14} /> Nuevo Campo
                </button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {fields.map((field, index) => (
                    <motion.div key={field.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="flex gap-3 items-end p-4 bg-slate-50 border border-slate-100 rounded-2xl group">
                      <div className="w-6 h-6 rounded-full bg-white text-slate-400 flex items-center justify-center text-xs font-black shadow-sm shrink-0 mb-2">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1 ml-1">Etiqueta Visual</label>
                        <input type="text" value={field.label} onChange={e => updateField(field.id, 'label', e.target.value)} placeholder="Ej: Nombre Completo"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-[#ff6d5a] focus:ring-2 focus:ring-[#ff6d5a]/20 transition-all" />
                      </div>
                      <div className="flex-shrink-0 flex items-center mb-2 px-2 text-slate-300">
                        <ArrowLeft size={14} />
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] font-black text-[#ff6d5a] uppercase tracking-wider block mb-1 ml-1">Webhook Key (Payload)</label>
                        <input type="text" value={field.key} onChange={e => updateField(field.id, 'key', e.target.value)} placeholder="Ej: full_name"
                          className="w-full px-4 py-2.5 bg-white border border-[#ff6d5a]/30 rounded-xl text-sm font-mono text-[#ff6d5a] outline-none focus:border-[#ff6d5a] focus:ring-2 focus:ring-[#ff6d5a]/20 transition-all" />
                      </div>
                      <button onClick={() => removeField(field.id)} className="p-3 bg-white text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl shadow-sm transition-colors shrink-0">
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {fields.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm font-medium">No hay campos. Haz clic en "Nuevo Campo" para comenzar.</div>
                )}
              </div>
            </div>

            {/* Test Execution Section */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100">
              <div className="mb-6 pb-6 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-800 tracking-tighter mb-2">Conexión con N8N</h3>
                <label className="text-[10px] font-black text-[#ff6d5a] uppercase tracking-widest block mb-2">Test Webhook URL</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Link2 size={16} /></div>
                  <input type="text" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://n8n.../webhook-test/..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-[#ff6d5a] focus:bg-white outline-none rounded-xl text-sm font-mono text-slate-700 transition-all shadow-inner" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Datos de Prueba</h3>
                <div className="space-y-4 mb-6">
                  {fields.map(f => (
                    <div key={f.id}>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 ml-1">{f.label} <span className="text-[#ff6d5a] font-mono lowercase">({f.key})</span></label>
                      <input type="text" value={testData[f.key] || ''} onChange={e => setTestData({ ...testData, [f.key]: e.target.value })} placeholder={`Escribe un ${f.label.toLowerCase()} de prueba...`}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-400 transition-colors" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={handleTest} disabled={status === 'loading'}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 ${
                      status === 'loading' ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 
                      'bg-gradient-to-r from-[#ff6d5a] to-orange-500 text-white hover:shadow-[#ff6d5a]/30'
                    }`}>
                    {status === 'loading' ? (
                      <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><Send size={18} /> Enviar al Webhook</>
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-3">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold">¡Datos enviados con éxito!</p>
                        <p className="text-xs opacity-80">Revisa tu flujo en n8n, los datos ya deberían aparecer.</p>
                      </div>
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3">
                      <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold">Error de conexión</p>
                        <p className="text-xs opacity-80">{errorMessage}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Payload Preview */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Code size={14} /> Payload JSON</h4>
              <pre className="text-xs font-mono text-green-400 bg-black/50 p-4 rounded-xl overflow-x-auto">
                {JSON.stringify(testData, null, 2)}
              </pre>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

// Mock Code Icon
const Code = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

export default N8NModule;
