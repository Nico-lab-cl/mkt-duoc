import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MessageSquare, 
  User as UserIcon, 
  Zap, 
  Smartphone, 
  Download, 
  Trash2, 
  ChevronRight, 
  X,
  Send,
  MoreHorizontal,
  Info,
  ArrowRight,
  Database,
  Users,
  Home
} from 'lucide-react';

const nodeTypes = {
  BOT: { id: 'BOT', name: 'Bloque Bot', icon: <MessageSquare size={18} />, color: 'bg-blue-600', light: 'bg-blue-50' },
  USER: { id: 'USER', name: 'Bloque Usuario', icon: <UserIcon size={18} />, color: 'bg-green-600', light: 'bg-green-50' },
  ACTION: { id: 'ACTION', name: 'Bloque Acción', icon: <Zap size={18} />, color: 'bg-purple-600', light: 'bg-purple-50' }
};

const ChatflowSimulator = ({ onBack, onFinish }) => {
  const { projectData, currentUser } = useProject();
  const [view, setView] = useState('manager'); // 'manager' | 'editor'
  const [nodes, setNodes] = useState([
    { 
      id: '1', 
      type: 'BOT', 
      content: '¡Hola! Bienvenido a nuestra tienda. ¿En qué podemos ayudarte hoy?', 
      justification: 'Iniciamos con un saludo cálido para reducir la fricción inicial.',
      options: ['Ver productos', 'Hablar con humano']
    }
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState('1');
  const [channel, setChannel] = useState('whatsapp');
  const [trigger, setTrigger] = useState('El usuario envía palabra clave "HOLA"');
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
  const [savedChatflows, setSavedChatflows] = useState([]);
  const [loadingChatflows, setLoadingChatflows] = useState(false);
  const [selectedChatflowId, setSelectedChatflowId] = useState(null);

  const fetchChatflows = async () => {
    setLoadingChatflows(true);
    const url = currentUser?.role === 'admin' ? '/api/admin/all' : `/api/group-data/${currentUser?.group_id}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setSavedChatflows(data.chatflows || []);
    } catch (err) {
      console.error('Error fetching chatflows:', err);
    } finally {
      setLoadingChatflows(false);
    }
  };

  useEffect(() => {
    if (view === 'manager') {
      fetchChatflows();
    }
  }, [view, currentUser]);

  const handleEditChatflow = (flow) => {
    setNodes(flow.data || []);
    setSelectedChatflowId(flow.id);
    const nameMatch = flow.name.match(/Chatflow - (.*)/);
    if (nameMatch) setTrigger(nameMatch[1]);
    setView('editor');
  };

  const handleCreateNew = () => {
    setNodes([
      { 
        id: '1', 
        type: 'BOT', 
        content: '¡Hola! Bienvenido a nuestra tienda. ¿En qué podemos ayudarte hoy?', 
        justification: 'Iniciamos con un saludo cálido para reducir la fricción inicial.',
        options: ['Ver productos', 'Hablar con humano']
      }
    ]);
    setSelectedChatflowId(null);
    setTrigger('El usuario envía palabra clave "HOLA"');
    setView('editor');
  };

  const handleDeleteChatflow = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este flujo?')) return;
    try {
      const res = await fetch(`/api/chatflows/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchChatflows();
    } catch (err) {
      console.error('Error deleting chatflow:', err);
    }
  };

  // Cargar progreso desde localStorage al iniciar
  useEffect(() => {
    const savedChatflow = localStorage.getItem('simulador_chatflow_progress');
    if (savedChatflow) {
      try {
        const { nodes: savedNodes, channel: savedChannel, trigger: savedTrigger } = JSON.parse(savedChatflow);
        if (savedNodes) setNodes(savedNodes);
        if (savedChannel) setChannel(savedChannel);
        if (savedTrigger) setTrigger(savedTrigger);
      } catch (e) {
        console.error('Error loading saved chatflow', e);
      }
    }
  }, []);

  // Guardar progreso en localStorage automáticamente
  useEffect(() => {
    const chatflowData = { nodes, channel, trigger };
    localStorage.setItem('simulador_chatflow_progress', JSON.stringify(chatflowData));
    setSaveStatus('saving');
    const timer = setTimeout(() => setSaveStatus('saved'), 1000);
    return () => clearTimeout(timer);
  }, [nodes, channel, trigger]);

  const downloadJSON = () => {
    const chatflowData = {
      agencyName: projectData.agencyName,
      projectName: projectData.projectName,
      channel,
      trigger,
      nodes,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(chatflowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chatflow-${projectData.projectName || 'sin-nombre'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSummary = () => {
    let text = `ESTRATEGIA CHATFLOW - ${projectData.agencyName}\n`;
    text += `Proyecto: ${projectData.projectName}\n`;
    text += `Canal: ${channel}\n`;
    text += `Disparador: ${trigger}\n`;
    text += `-------------------------------------------\n\n`;
    
    nodes.forEach((node, i) => {
      text += `Paso ${i + 1}: ${nodeTypes[node.type].name}\n`;
      text += `Contenido: ${node.content}\n`;
      if (node.options && node.options.length > 0) {
        text += `Opciones: ${node.options.join(', ')}\n`;
      }
      text += `Justificación: ${node.justification || 'SIN JUSTIFICACIÓN'}\n`;
      text += `\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resumen-chatflow-${projectData.projectName || 'sin-nombre'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const addNode = (type) => {
    const newNode = {
      id: Date.now().toString(),
      type,
      content: type === 'ACTION' ? 'ETIQUETAR_LEAD' : 'Nuevo mensaje...',
      justification: '',
      options: []
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const updateNode = (id, updates) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNode = (id) => {
    const newNodes = nodes.filter(n => n.id !== id);
    setNodes(newNodes);
    if (selectedNodeId === id && newNodes.length > 0) {
      setSelectedNodeId(newNodes[0].id);
    }
  };

  if (view === 'manager') {
    return (
      <div className="h-screen flex flex-col bg-[#f8f9fa] text-slate-800 font-sans overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-200"
              title="Volver al Dashboard"
            >
              <Home size={22} />
            </button>
            <div className="h-10 w-[1px] bg-slate-200 mx-1" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest leading-none mb-1">Gestor de Estrategias</span>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Marketing Conversacional</h1>
            </div>
          </div>
          <button 
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-green-200 transition-all active:scale-95"
          >
            <Plus size={18} /> Crear Nuevo Flujo
          </button>
        </header>

        <main className="flex-grow p-10 overflow-y-auto custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Mis Chatflows Guardados</h2>
               <button onClick={fetchChatflows} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                 <Database size={20} className={loadingChatflows ? 'animate-spin' : ''} />
               </button>
            </div>

            {loadingChatflows ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Conectando con la base de datos...</p>
              </div>
            ) : savedChatflows.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
                <MessageSquare size={64} className="mx-auto text-slate-200 mb-6" />
                <h3 className="text-xl font-bold text-slate-400 mb-2">No hay estrategias guardadas</h3>
                <p className="text-slate-400 text-sm mb-8">Comienza diseñando tu primer flujo de conversación automatizado.</p>
                <button onClick={handleCreateNew} className="text-green-600 font-bold hover:underline">¡Crear mi primer flujo ahora!</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedChatflows.map((flow) => (
                  <motion.div 
                    key={flow.id}
                    whileHover={{ y: -5 }}
                    className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                        <MessageSquare size={24} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleDeleteChatflow(flow.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 mb-1">{flow.name}</h4>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                      <span>{flow.data?.length || 0} Bloques</span>
                      <span>•</span>
                      <span>{flow.student_name || 'Mi Equipo'}</span>
                    </div>
                    <button 
                      onClick={() => handleEditChatflow(flow)}
                      className="w-full py-3 bg-slate-50 group-hover:bg-green-600 group-hover:text-white text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      Continuar Editando <ArrowRight size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#f8f9fa] text-slate-800 font-sans overflow-hidden">
      {/* 1. Panel Superior (Header) */}
      <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('manager')}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-200"
            title="Volver al Gestor"
          >
            <ChevronRight className="rotate-180" size={22} />
          </button>
          
          <div className="h-10 w-[1px] bg-slate-200 mx-1" />

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none mb-1">Editando Chatflow</span>
            <h1 className="text-xl font-bold text-slate-900 leading-none">{projectData.agencyName || 'Agencia MKA'}</h1>
          </div>
          
          <div className="h-10 w-[1px] bg-slate-200" />
          
          <div className="flex items-center gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Canal</label>
              <select 
                value={channel} 
                onChange={(e) => setChannel(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="whatsapp">WhatsApp Business</option>
                <option value="instagram">Instagram DM</option>
                <option value="messenger">Facebook Messenger</option>
                <option value="web">Web Chatbot</option>
              </select>
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Trigger / Disparador</label>
              <input 
                type="text" 
                value={trigger} 
                onChange={(e) => setTrigger(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1 text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ej: Palabra clave PRECIO"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center mr-4">
             <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${saveStatus === 'saving' ? 'text-amber-500' : 'text-green-500'}`}>
                <div className={`w-2 h-2 rounded-full ${saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                {saveStatus === 'saving' ? 'Guardando...' : 'Progreso Guardado'}
             </div>
          </div>
          <button 
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm transition-all"
          >
            <Smartphone size={18} /> Previsualizar
          </button>
          <button 
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Download size={18} /> Finalizar y Exportar
          </button>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        {/* 2. Panel Izquierdo: Lienzo del Chatflow */}
        <main className="flex-grow overflow-y-auto p-12 custom-scrollbar relative bg-[#f1f3f5]">
          <div className="max-w-2xl mx-auto space-y-12 pb-32">
            {/* Start Node */}
            <div className="flex flex-col items-center">
              <div className="px-4 py-2 bg-slate-800 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                Inicio del Flujo
              </div>
              <div className="w-0.5 h-12 bg-slate-300" />
            </div>

            {nodes.map((node, index) => (
              <motion.div 
                key={node.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex flex-col items-center"
              >
                <div 
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`chat-node-card group w-full max-w-md ${selectedNodeId === node.id ? 'chat-node-active border-blue-500' : 'border-slate-200'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${nodeTypes[node.type].color} text-white`}>
                        {nodeTypes[node.type].icon}
                      </div>
                      <span className="text-xs font-black uppercase tracking-tight text-slate-500">{nodeTypes[node.type].name}</span>
                    </div>
                    <div className="flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                    {node.type === 'ACTION' ? (
                      <div className="flex items-center gap-2 text-purple-600 font-bold uppercase text-[11px]">
                        <Zap size={12} /> {node.content}
                      </div>
                    ) : node.content}
                  </div>

                  {node.options && node.options.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {node.options.map((opt, i) => (
                        <div key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold border border-blue-200">
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {!node.justification && (
                    <div className="mt-3 flex items-center gap-1.5 text-red-500 text-[10px] font-bold animate-pulse">
                      <Info size={12} /> Falta justificación
                    </div>
                  )}
                </div>

                {index < nodes.length - 1 && <div className="w-0.5 h-12 bg-slate-300" />}
                
                {/* Connector buttons between nodes */}
                <div className="absolute -bottom-8 flex gap-2 z-20">
                  <button 
                    onClick={() => addNode('BOT')}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 hover:scale-110 transition-transform"
                    title="Añadir Bloque Bot"
                  >
                    <MessageSquare size={14} />
                  </button>
                  <button 
                    onClick={() => addNode('USER')}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-green-600 hover:scale-110 transition-transform"
                    title="Añadir Bloque Usuario"
                  >
                    <UserIcon size={14} />
                  </button>
                  <button 
                    onClick={() => addNode('ACTION')}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-purple-600 hover:scale-110 transition-transform"
                    title="Añadir Bloque Acción"
                  >
                    <Zap size={14} />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Empty state when no nodes */}
            {nodes.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-slate-300 rounded-2xl">
                <p className="text-slate-500 font-medium">No hay bloques en tu flujo. Empieza añadiendo uno.</p>
                <div className="mt-6 flex justify-center gap-4">
                  <button onClick={() => addNode('BOT')} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm">Bot</button>
                  <button onClick={() => addNode('USER')} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm">Usuario</button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 3. Panel Derecho: Inspector Estratégico */}
        <aside className="w-[400px] bg-white border-l border-slate-200 flex flex-col z-10 shadow-[-4px_0_15px_rgba(0,0,0,0.02)]">
          {selectedNode ? (
            <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar flex-grow">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Configuración</h2>
                <div className={`px-3 py-1 rounded-full ${nodeTypes[selectedNode.type].light} ${nodeTypes[selectedNode.type].color.replace('bg-', 'text-')} text-[10px] font-black uppercase`}>
                  {nodeTypes[selectedNode.type].name}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-2">Contenido del Bloque</label>
                  {selectedNode.type === 'ACTION' ? (
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500"
                      value={selectedNode.content}
                      onChange={(e) => updateNode(selectedNode.id, { content: e.target.value })}
                    >
                      <option value="ETIQUETAR_LEAD">Etiquetar Lead</option>
                      <option value="ENVIAR_A_CRM">Enviar a CRM (HubSpot)</option>
                      <option value="DERIVAR_HUMANO">Derivar a Agente Humano</option>
                      <option value="NOTIFICACION_EQUIPO">Notificar al equipo de ventas</option>
                    </select>
                  ) : (
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      value={selectedNode.content}
                      onChange={(e) => updateNode(selectedNode.id, { content: e.target.value })}
                      placeholder="Escribe el mensaje..."
                    />
                  )}
                </div>

                {selectedNode.type === 'BOT' && (
                  <div>
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-2">Opciones / Botones</label>
                    <div className="space-y-2">
                      {selectedNode.options.map((opt, i) => (
                        <div key={i} className="flex gap-2">
                          <input 
                            type="text" 
                            className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...selectedNode.options];
                              newOpts[i] = e.target.value;
                              updateNode(selectedNode.id, { options: newOpts });
                            }}
                          />
                          <button onClick={() => {
                            const newOpts = selectedNode.options.filter((_, idx) => idx !== i);
                            updateNode(selectedNode.id, { options: newOpts });
                          }} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                        </div>
                      ))}
                      <button 
                        onClick={() => updateNode(selectedNode.id, { options: [...selectedNode.options, 'Nueva opción'] })}
                        className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-all"
                      >
                        + Añadir Opción
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-slate-100">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <label className="text-[11px] font-black text-amber-800 uppercase tracking-widest block mb-2">Justificación (CRÍTICO)</label>
                    <textarea 
                      className="w-full bg-white border border-amber-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-amber-500 min-h-[120px] shadow-inner text-amber-950 italic"
                      placeholder="¿Por qué es necesario este paso?"
                      value={selectedNode.justification}
                      onChange={(e) => updateNode(selectedNode.id, { justification: e.target.value })}
                    />
                    <p className="text-[10px] text-amber-700 mt-2 font-medium leading-relaxed">
                      Explica cómo esta respuesta o automatización aporta valor a la experiencia del usuario o ayuda a cualificar al lead, según la rúbrica de la Evaluación 1.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
              <ArrowRight size={48} className="mb-4" />
              <p className="font-bold text-slate-400">Selecciona un bloque del lienzo para configurar su estrategia.</p>
            </div>
          )}
          
          <div className="p-4 bg-slate-50 border-t border-slate-200">
             <button 
               onClick={() => setView('manager')}
               className="w-full py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-100 transition-all"
             >
               Volver al Gestor
             </button>
          </div>
        </aside>
      </div>

      {/* Smartphone Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
          >
            <div className="flex gap-12 items-center max-w-6xl w-full">
              {/* Smartphone Frame */}
              <div className="smartphone-frame">
                <div className="smartphone-notch" />
                <div className="smartphone-screen">
                  {/* App Header */}
                  <div className="h-16 bg-white border-b border-slate-100 flex items-center px-8 pt-4">
                     <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">A</div>
                     <div className="flex flex-col">
                        <span className="text-sm font-bold leading-none">{projectData.agencyName || 'Agencia MKA'}</span>
                        <span className="text-[10px] text-green-500 font-bold">En línea</span>
                     </div>
                  </div>
                  
                  {/* Chat Area */}
                  <div className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col space-y-2">
                    <div className="text-[10px] text-slate-400 self-center uppercase font-bold tracking-tighter mb-4">Hoy</div>
                    {nodes.filter(n => n.type !== 'ACTION').map((node, i) => (
                      <div key={node.id} className="flex flex-col">
                        <div className={`bubble ${node.type === 'BOT' ? 'bubble-bot' : 'bubble-user'}`}>
                          {node.content}
                        </div>
                        {node.type === 'BOT' && node.options && node.options.length > 0 && (
                          <div className="flex flex-col gap-2 my-2 items-start">
                            {node.options.map((opt, j) => (
                              <button key={j} className="bg-white border border-blue-500 text-blue-500 px-4 py-2 rounded-full text-xs font-bold w-full text-center hover:bg-blue-50 transition-colors">
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* App Input */}
                  <div className="h-16 border-t border-slate-100 p-3 flex items-center gap-2">
                    <div className="flex-grow bg-slate-100 rounded-full px-4 py-2 text-xs text-slate-400">Escribe un mensaje...</div>
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white"><Send size={14} /></div>
                  </div>
                </div>
              </div>

              {/* Preview Info */}
              <div className="flex-grow text-white space-y-6 hidden lg:block">
                <h2 className="text-4xl font-black uppercase tracking-tighter">Vista Previa</h2>
                <p className="text-slate-400 text-lg">Así es como tu público objetivo interactuará con la marca en <strong>{channel}</strong>.</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="p-3 bg-blue-600 rounded-xl"><Info size={24} /></div>
                    <div>
                      <h4 className="font-bold">Estructura Validada</h4>
                      <p className="text-sm text-slate-400">El flujo respeta las convenciones de UX conversacional.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPreview(false)}
                  className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Cerrar Vista Previa
                </button>
              </div>
            </div>
            <button onClick={() => setShowPreview(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"><X size={32} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full p-8 shadow-2xl relative"
            >
              <button onClick={() => setShowExport(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24} /></button>
              
              <div className="flex items-end justify-between mb-8 border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Estrategia Chatflow</h2>
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Exportación para Evaluación 1</p>
                </div>
                <div className="text-right">
                   <p className="text-sm font-bold text-slate-900">{projectData.agencyName}</p>
                   <p className="text-xs text-slate-500 uppercase tracking-tighter">{channel} · {trigger}</p>
                </div>
              </div>

              <div className="space-y-6">
                {nodes.map((node, i) => (
                  <div key={node.id} className="flex gap-6 items-start">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-xl ${nodeTypes[node.type].color} text-white flex items-center justify-center shadow-lg`}>
                        {nodeTypes[node.type].icon}
                      </div>
                      {i < nodes.length - 1 && <div className="w-0.5 h-12 bg-slate-100 my-1" />}
                    </div>
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                       <div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Contenido</span>
                         <p className="text-sm font-bold text-slate-700 italic">"{node.content}"</p>
                       </div>
                       <div className="border-l border-slate-200 pl-4">
                         <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-1">Justificación</span>
                         <p className="text-sm text-slate-600">{node.justification || 'SIN JUSTIFICACIÓN'}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex justify-between items-center bg-slate-900 text-white p-6 rounded-2xl gap-4">
                 <div className="flex items-center gap-3">
                   <Database className="text-blue-400" />
                   <p className="text-xs font-bold leading-tight">Tu progreso se guarda automáticamente en este equipo. Confirma para enviar al profesor.</p>
                 </div>
                 
                 <div className="flex gap-2">
                   <button 
                    onClick={downloadSummary}
                    className="px-4 py-2 bg-slate-700 text-white rounded-lg font-bold text-xs hover:bg-slate-600 transition-colors flex items-center gap-2"
                   >
                     <Download size={14} /> Resumen .TXT
                   </button>
                   <button 
                    onClick={downloadJSON}
                    className="px-4 py-2 bg-slate-700 text-white rounded-lg font-bold text-xs hover:bg-slate-600 transition-colors flex items-center gap-2"
                   >
                     <Download size={14} /> Config .JSON
                   </button>
                   <button 
                    onClick={async () => {
                      try {
                        await fetch('/api/chatflows', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            id: selectedChatflowId,
                            name: `Chatflow - ${trigger}`,
                            userId: currentUser.id,
                            groupId: currentUser.group_id,
                            data: nodes
                          })
                        });
                        localStorage.removeItem('simulador_chatflow_progress');
                        setView('manager');
                      } catch (err) {
                        console.error('Error saving chatflow');
                      }
                      setShowExport(false);
                    }}
                    className="px-6 py-2 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition-colors text-xs whitespace-nowrap"
                   >
                     Guardar en Base de Datos
                   </button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatflowSimulator;
