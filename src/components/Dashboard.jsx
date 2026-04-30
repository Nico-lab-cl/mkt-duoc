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
  X
} from 'lucide-react';

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
  }
];

import GroupsManagement from './GroupsManagement';

const Dashboard = ({ onSelectPlatform, onChangeGroup }) => {
  const { projectData, updateProjectData, currentUser, setCurrentUser } = useProject();
  const [activeView, setActiveView] = useState('home'); // 'home' | 'admin' | 'config' | 'groups'
  const [adminData, setAdminData] = useState({ campaigns: [], chatflows: [] });
  const [loading, setLoading] = useState(false);
  const [showProfileConfig, setShowProfileConfig] = useState(false);

  const handleLogout = () => {
    setCurrentUser(null);
    window.location.reload(); // Recargar para limpiar todo el estado
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
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 ${activeView === view ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-100'}`}
    >
      <Icon size={20} />
      <span className="font-bold text-sm flex-grow text-left">{label}</span>
      {badge && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 z-40">
        <div className="flex items-center gap-3 px-2 mb-8">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
              <ShieldCheck size={24} />
           </div>
           <div className="flex flex-col">
              <span className="font-black text-slate-800 tracking-tighter leading-none">SIMULADOR</span>
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
           <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                 {currentUser?.full_name[0]}
              </div>
              <div className="flex flex-col truncate">
                 <span className="text-xs font-bold text-slate-800 truncate">{currentUser?.full_name}</span>
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
      <main className="flex-grow overflow-y-auto bg-[#F8FAFC] relative">
        {/* Header Superior */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-30">
           <h2 className="text-xl font-black text-slate-800 tracking-tighter uppercase">
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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
               <div className="bg-blue-600 p-8 rounded-[2rem] text-white flex items-center justify-between shadow-2xl shadow-blue-200 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black tracking-tighter mb-2 italic">ESTADO DEL PROYECTO: {projectData.projectName.toUpperCase()}</h3>
                    <p className="text-blue-100 font-medium max-w-lg">Has iniciado sesión como {currentUser?.full_name}. Selecciona una plataforma para continuar diseñando tu estrategia de Inbound Marketing.</p>
                  </div>
                  <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
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
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl bg-white rounded-[2rem] border border-slate-200 p-12 shadow-xl shadow-slate-100 mx-auto">
               <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                     <Palette size={40} />
                  </div>
                  <h3 className="text-3xl font-black tracking-tighter text-slate-800">CONFIGURA TU IDENTIDAD</h3>
                  <p className="text-slate-500 font-medium">Personaliza cómo se verá tu marca en el simulador.</p>
               </div>

               <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Nombre de la Agencia / Grupo</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition-all font-bold text-slate-800"
                      value={projectData.agencyName}
                      onChange={(e) => updateProjectData({ agencyName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Nombre del Proyecto Actual</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition-all font-bold text-slate-800"
                      value={projectData.projectName}
                      onChange={(e) => updateProjectData({ projectName: e.target.value })}
                    />
                  </div>
                  
                  <div className="pt-6">
                     <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all">
                        Guardar Cambios de Diseño
                     </button>
                  </div>
               </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
