import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { motion } from 'framer-motion';
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
  ShieldCheck
} from 'lucide-react';

const platforms = [
  {
    id: 'meta',
    name: 'Meta Ads',
    description: 'Facebook & Instagram Ads Manager',
    icon: <Layout size={40} />,
    color: 'bg-[#1877F2]',
    lightColor: 'bg-[#E7F3FF]',
    textColor: 'text-[#1877F2]',
    status: 'active'
  },
  {
    id: 'chatflow',
    name: 'Marketing Conversacional',
    description: 'Diseño de Chatbots y Flujos Omnicanal',
    icon: <MessageSquare size={40} />,
    color: 'bg-[#16a34a]',
    lightColor: 'bg-[#f0fdf4]',
    textColor: 'text-[#16a34a]',
    status: 'active'
  },
  {
    id: 'google',
    name: 'Google Ads',
    description: 'Search, Display & Video Campaigns',
    icon: <Search size={40} />,
    color: 'bg-[#4285F4]',
    lightColor: 'bg-white',
    textColor: 'text-slate-700',
    border: 'border-2 border-slate-100',
    status: 'coming-soon'
  },
  {
    id: 'tiktok',
    name: 'TikTok Ads',
    description: 'For Business - Short Form Video',
    icon: <Video size={40} />,
    color: 'bg-black',
    lightColor: 'bg-[#121212]',
    textColor: 'text-white',
    status: 'coming-soon'
  }
];

const Dashboard = ({ onSelectPlatform, onChangeGroup }) => {
  const { projectData, currentUser } = useProject();
  const [adminData, setAdminData] = useState({ campaigns: [], chatflows: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      setLoading(true);
      fetch('/api/admin/all')
        .then(res => res.json())
        .then(data => {
          setAdminData(data);
          setLoading(false);
        });
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-start">
          <div>
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
              Dashboard Principal {currentUser?.role === 'admin' && <ShieldCheck size={14} />}
            </h2>
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Bienvenido, {currentUser?.full_name.split(' ')[0]}</h1>
            <div className="flex items-center gap-4 mt-3">
               <p className="text-slate-500 text-sm">
                 Sesión: <span className="font-bold text-slate-800">{currentUser?.email}</span>
               </p>
               {currentUser?.role === 'student' && (
                 <button 
                  onClick={onChangeGroup}
                  className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-1.5 shadow-sm"
                 >
                   <Users size={12} /> Cambiar Grupo
                 </button>
               )}
            </div>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hidden md:block">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado de Conexión</p>
             <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Base de Datos Conectada
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {platforms.map((platform, index) => (
            <motion.button
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={platform.status === 'active' ? { y: -8, transition: { duration: 0.2 } } : {}}
              onClick={() => platform.status === 'active' && onSelectPlatform(platform.id)}
              disabled={platform.status !== 'active'}
              className={`relative overflow-hidden group p-8 rounded-3xl text-left glass-card transition-all ${platform.border || ''} ${platform.status === 'active' ? 'hover:shadow-2xl cursor-pointer' : 'opacity-60 cursor-not-allowed grayscale'}`}
            >
              {platform.status === 'coming-soon' && (
                <div className="absolute top-4 right-4 bg-slate-200 text-slate-500 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                  Próximamente
                </div>
              )}

              <div className={`w-16 h-16 ${platform.color} ${platform.id === 'google' ? 'shadow-inner' : 'text-white'} rounded-2xl flex items-center justify-center mb-6 transition-transform ${platform.status === 'active' ? 'group-hover:scale-110' : ''}`}>
                {platform.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{platform.name}</h3>
              <p className="text-slate-500 mb-6 leading-relaxed text-sm">{platform.description}</p>
              
              <div className={`flex items-center gap-2 font-semibold ${platform.status === 'active' ? 'text-blue-600 group-hover:gap-4' : 'text-slate-400'} transition-all`}>
                {platform.status === 'active' ? 'Configurar Canal' : 'En desarrollo'} <ArrowRight size={18} />
              </div>

              {/* Decorative Background Elements */}
              <div className={`absolute -right-4 -bottom-4 w-32 h-32 ${platform.color} opacity-5 rounded-full blur-3xl`} />
            </motion.button>
          ))}
        </div>

        {/* --- PANEL DE ADMINISTRADOR (SOLO PROFE NICO) --- */}
        {currentUser?.role === 'admin' && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
               <div>
                 <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Panel de Control Docente</h2>
                 <p className="text-slate-500 text-sm">Monitoreo de campañas y flujos por grupo</p>
               </div>
               <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-600 transition-all">
                 <History size={18} /> Exportar Reporte Global
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(groupId => (
                <div key={groupId} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-slate-900 p-4 text-white">
                    <h4 className="font-bold flex items-center gap-2 italic">
                      <Users size={16} /> Grupo {groupId}
                    </h4>
                  </div>
                  <div className="p-4 space-y-6">
                    {/* Campañas del grupo */}
                    <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Campañas Meta Ads</h5>
                      <div className="space-y-2">
                        {adminData.campaigns.filter(c => c.group_id === groupId).map(camp => (
                          <div key={camp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group">
                            <div>
                              <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{camp.name}</p>
                              <p className="text-[10px] text-slate-500">{camp.student_name.split(' ')[0]}</p>
                            </div>
                            <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-600 cursor-pointer" />
                          </div>
                        ))}
                        {adminData.campaigns.filter(c => c.group_id === groupId).length === 0 && (
                          <p className="text-[10px] text-slate-400 italic">Sin campañas aún</p>
                        )}
                      </div>
                    </div>

                    {/* Chatflows del grupo */}
                    <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Chatflows</h5>
                      <div className="space-y-2">
                        {adminData.chatflows.filter(ch => ch.group_id === groupId).map(flow => (
                          <div key={flow.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group">
                            <div>
                              <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{flow.name}</p>
                              <p className="text-[10px] text-slate-500">{flow.student_name.split(' ')[0]}</p>
                            </div>
                            <ExternalLink size={14} className="text-slate-300 group-hover:text-green-600 cursor-pointer" />
                          </div>
                        ))}
                        {adminData.chatflows.filter(ch => ch.group_id === groupId).length === 0 && (
                          <p className="text-[10px] text-slate-400 italic">Sin flujos aún</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
