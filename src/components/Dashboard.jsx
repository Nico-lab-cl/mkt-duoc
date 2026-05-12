import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, 
  Search, 
  Video, 
  ArrowRight, 
  MessageSquare, 
  Settings, 
  Users, 
  History,
  ExternalLink,
  ShieldCheck,
  Home,
  Monitor,
  Palette,
  LogOut,
  Bell,
  Menu,
  X,
  User as UserIcon,
  AlertCircle,
  BarChart
} from 'lucide-react';

import GroupsManagement from './GroupsManagement';


const platforms = [
  {
    id: 'meta',
    name: 'Meta Ads',
    description: 'Facebook & Instagram Ads Manager',
    icon: <Layout size={24} />,
    color: 'bg-[#1877F2]',
    status: 'active'
  },
  {
    id: 'chatflow',
    name: 'Marketing Conversacional',
    description: 'Diseño de Chatbots y Flujos Omnicanal',
    icon: <MessageSquare size={24} />,
    color: 'bg-[#16a34a]',
    status: 'active'
  },
  {
    id: 'google',
    name: 'Google Ads',
    description: 'Search, Display & Video Campaigns',
    icon: <Search size={24} />,
    color: 'bg-[#4285F4]',
    status: 'coming-soon'
  },
  {
    id: 'tiktok',
    name: 'TikTok Ads',
    description: 'For Business - Short Form Video',
    icon: <Video size={24} />,
    color: 'bg-black',
    status: 'coming-soon'
  },
  {
    id: 'kpi',
    name: 'Laboratorio Analítica y KPIs',
    description: 'Glosario y Práctica de Métricas para Inbound',
    icon: <BarChart size={24} />,
    color: 'bg-[#8b5cf6]',
    status: 'active'
  }
];



const Dashboard = ({ onSelectPlatform, onChangeGroup }) => {
  const { projectData, updateProjectData, currentUser, setCurrentUser, theme, setTheme } = useProject();
  const [activeView, setActiveView] = useState('home'); // 'home' | 'admin' | 'config' | 'groups'
  const [adminData, setAdminData] = useState({ campaigns: [], chatflows: [], evaluations: [] });
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: currentUser?.full_name || '',
    password: '',
    confirmPassword: ''
  });
  const [configMessage, setConfigMessage] = useState(null);

  const handleLogout = () => {
    setCurrentUser(null);
    window.location.reload(); 
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
      setConfigMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          full_name: profileForm.full_name,
          password: profileForm.password
        })
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        setConfigMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        setProfileForm({ ...profileForm, password: '', confirmPassword: '' });
        setTimeout(() => setConfigMessage(null), 3000);
      }
    } catch (error) {
      setConfigMessage({ type: 'error', text: 'Error al actualizar perfil' });
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin' && activeView === 'admin') {
      setLoading(true);
      fetch('/api/admin/all')
        .then(res => res.json())
        .then(data => {
          setAdminData(data);
          setLoading(false);
        });
    }
  }, [currentUser, activeView]);

  const SidebarItem = ({ icon: Icon, label, view, badge }) => (
    <button 
      onClick={() => setActiveView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 ${activeView === view ? 'text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
      style={activeView === view ? { backgroundColor: 'var(--primary)' } : {}}
    >
      <Icon size={20} />
      <span className="font-bold text-sm flex-grow text-left">{label}</span>
      {badge && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>}
    </button>
  );

  return (
    <div className="min-h-screen flex overflow-hidden transition-colors duration-500" style={{ backgroundColor: 'var(--main-bg)' }}>
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-slate-200 flex flex-col p-4 z-40 transition-colors duration-500 shadow-xl" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
        <div className="flex items-center gap-3 px-2 mb-8">
           <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: 'var(--primary)' }}>
              <ShieldCheck size={24} />
           </div>
           <div className="flex flex-col">
              <span className="font-black tracking-tighter leading-none" style={{ color: 'var(--text-primary)' }}>SIMULADOR</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MKA1215 v2.5</span>
           </div>
        </div>

        <nav className="flex-grow">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Simulación</p>
          <SidebarItem icon={Home} label="Dashboard" view="home" />
          
          {currentUser?.role === 'admin' && (
            <>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mt-8 mb-4">Administración</p>
              <SidebarItem icon={Monitor} label="Proyectos en Vivo" view="admin" badge="LIVE" />
              <SidebarItem icon={Users} label="Gestión de Grupos" view="groups" />
            </>
          )}

          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mt-8 mb-4">Personalización</p>
          <SidebarItem icon={Settings} label="Configuración" view="config" />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
           <div className="p-4 bg-slate-50/50 rounded-2xl flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                 {currentUser?.full_name[0]}
              </div>
              <div className="flex flex-col truncate">
                 <span className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{currentUser?.full_name}</span>
                 <span className="text-[10px] text-slate-400 font-bold uppercase truncate">{currentUser?.role}</span>
              </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-2 px-4 py-2 text-red-500 font-bold text-xs hover:bg-red-50 rounded-lg transition-colors"
           >
              <LogOut size={16} /> Salir
           </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow overflow-y-auto relative transition-colors duration-500" style={{ backgroundColor: 'var(--main-bg)' }}>
        {/* Header Superior */}
        <header className="h-20 border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-30 backdrop-blur-md transition-colors duration-500" style={{ backgroundColor: 'var(--header-bg)' }}>
           <h2 className="text-xl font-black tracking-tighter uppercase" style={{ color: 'var(--text-primary)' }}>
             {activeView === 'home' && 'Canales de Operación'}
             {activeView === 'admin' && 'Control de Proyectos Alumnos'}
             {activeView === 'groups' && 'Gestión de Equipos y Usuarios'}
             {activeView === 'config' && 'Ajustes de Perfil'}
           </h2>
           
           <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors relative">
                 <Bell size={20} />
                 <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <div className="h-8 w-px bg-slate-200 mx-2" />
              <button 
                onClick={() => setActiveView('config')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all group"
              >
                 <Settings size={18} className="text-slate-500 group-hover:rotate-90 transition-transform duration-500" />
                 <span className="text-sm font-bold text-slate-600">Configurar</span>
              </button>
           </div>
        </header>

        <div className="p-10">
          {activeView === 'home' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-24">
               <div className="bg-blue-600 p-8 rounded-[2rem] text-white flex items-center justify-between shadow-2xl shadow-blue-200 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black tracking-tighter mb-2 italic">ESTADO DEL PROYECTO: {projectData.projectName.toUpperCase()}</h3>
                    <p className="text-blue-100 font-medium max-w-lg">Has iniciado sesión como {currentUser?.full_name}. Selecciona una plataforma para continuar diseñando tu estrategia de Inbound Marketing.</p>
                  </div>
                  <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                {platforms.map((platform, index) => (
                  <motion.button
                    key={platform.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => platform.status === 'active' && onSelectPlatform(platform.id)}
                    className={`group p-8 rounded-3xl bg-white border border-slate-200 text-left shadow-sm transition-all ${platform.status === 'active' ? 'hover:shadow-2xl hover:border-blue-500 cursor-pointer' : 'opacity-50 grayscale cursor-not-allowed'}`}
                  >
                    <div className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                      {platform.icon}
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tighter mb-2">{platform.name}</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">{platform.description}</p>
                    <div className={`flex items-center gap-2 font-black text-xs uppercase tracking-widest ${platform.status === 'active' ? 'text-blue-600' : 'text-slate-400'}`}>
                      {platform.status === 'active' ? 'Iniciar Simulación' : 'Próximamente'} <ArrowRight size={16} />
                    </div>
                  </motion.button>
                ))}
               </div>
            </motion.div>
          )}

          {activeView === 'admin' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[1, 2, 3].map(groupId => (
                    <div key={groupId} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
                       <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                          <h4 className="font-black italic tracking-tighter text-xl uppercase">Grupo {groupId}</h4>
                          <span className="bg-green-500 w-2 h-2 rounded-full animate-pulse" />
                       </div>
                       <div className="p-6 flex-grow overflow-y-auto custom-scrollbar space-y-4">
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Entregas de Campañas (Meta)</h5>
                          {adminData.campaigns.filter(c => c.group_id === groupId).map(camp => (
                            <div key={camp.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-blue-200 transition-all cursor-pointer">
                               <p className="text-sm font-bold text-slate-800 mb-1">{camp.name}</p>
                               <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-blue-600 uppercase italic">{camp.student_name}</span>
                                  <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-500" />
                               </div>
                            </div>
                          ))}
                          
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 pt-6">Estrategias Conversacionales</h5>
                          {adminData.chatflows.filter(ch => ch.group_id === groupId).map(flow => (
                            <div key={flow.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-green-200 transition-all cursor-pointer">
                               <p className="text-sm font-bold text-slate-800 mb-1">{flow.name}</p>
                               <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-green-600 uppercase italic">{flow.student_name}</span>
                                  <ExternalLink size={14} className="text-slate-300 group-hover:text-green-500" />
                               </div>
                            </div>
                          ))}
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 pt-6">Evaluaciones de Métricas</h5>
                          {adminData.evaluations?.filter(ev => ev.group_id === groupId).map(ev => (
                            <div key={ev.id} onClick={() => setSelectedEvaluation(ev)} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-purple-200 transition-all cursor-pointer">
                               <p className="text-sm font-bold text-slate-800 mb-1">Evaluación: {ev.score}/10</p>
                               <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-purple-600 uppercase italic">{ev.student_name}</span>
                                  <ExternalLink size={14} className="text-slate-300 group-hover:text-purple-500" />
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeView === 'groups' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
               <GroupsManagement />
            </motion.div>
          )}

          {activeView === 'config' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pb-20">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Perfil Personal */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-xl shadow-slate-100">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: 'var(--primary)' }}>
                          <UserIcon size={24} />
                       </div>
                       <div>
                          <h3 className="text-xl font-black tracking-tighter uppercase italic">Perfil Personal</h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Actualiza tus credenciales</p>
                       </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nombre Completo</label>
                          <input 
                            type="text" 
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition-all font-bold text-sm text-slate-800"
                            value={profileForm.full_name}
                            onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nueva Contraseña</label>
                          <input 
                            type="password" 
                            placeholder="Dejar en blanco para no cambiar"
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition-all font-bold text-sm text-slate-800"
                            value={profileForm.password}
                            onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Confirmar Contraseña</label>
                          <input 
                            type="password" 
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition-all font-bold text-sm text-slate-800"
                            value={profileForm.confirmPassword}
                            onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                          />
                       </div>
                       <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all">
                          Actualizar Perfil
                       </button>
                    </form>
                  </div>

                  {/* Branding y Proyecto */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-xl shadow-slate-100">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: 'var(--primary)' }}>
                          <Palette size={24} />
                       </div>
                       <div>
                          <h3 className="text-xl font-black tracking-tighter uppercase italic">Identidad de Marca</h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Personaliza el simulador</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nombre de la Agencia / Grupo</label>
                          <input 
                            type="text" 
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition-all font-bold text-sm text-slate-800"
                            value={projectData.agencyName}
                            onChange={(e) => updateProjectData({ agencyName: e.target.value })}
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nombre del Proyecto Actual</label>
                          <input 
                            type="text" 
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition-all font-bold text-sm text-slate-800"
                            value={projectData.projectName}
                            onChange={(e) => updateProjectData({ projectName: e.target.value })}
                          />
                       </div>
                    </div>
                  </div>
               </div>



               {configMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm fixed bottom-10 right-10 shadow-2xl z-50 ${configMessage.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}
                  >
                    {configMessage.type === 'success' ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                    {configMessage.text}
                  </motion.div>
               )}
            </motion.div>
          )}
        </div>

        {/* EVALUATION MODAL */}
        <AnimatePresence>
          {selectedEvaluation && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div>
                    <h3 className="text-xl font-black uppercase italic">Evaluación de {selectedEvaluation.student_name}</h3>
                    <p className="text-sm font-bold text-slate-500">Puntaje Total: {selectedEvaluation.score} / 10</p>
                  </div>
                  <button onClick={() => setSelectedEvaluation(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6">
                  {selectedEvaluation.data?.answers?.map((ans, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border ${ans.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                      <p className="font-bold text-slate-800 mb-3">{idx + 1}. {ans.text}</p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                         <div>
                           <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Respuesta Alumno</span>
                           <span className={`font-bold ${ans.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>Opción {ans.selectedOption || 'N/A'}</span>
                         </div>
                         <div>
                           <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Respuesta Correcta</span>
                           <span className="font-bold text-emerald-600">Opción {ans.correctOption}</span>
                         </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                         <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Justificación Técnica</span>
                         <p className="text-sm text-slate-700 italic">{ans.justification || 'Sin justificación...'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default Dashboard;
