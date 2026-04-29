import React from 'react';
import { useProject } from '../context/ProjectContext';
import { motion } from 'framer-motion';
import { Layout, Search, Video, ArrowRight, MessageSquare } from 'lucide-react';

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

const Dashboard = ({ onSelectPlatform }) => {
  const { projectData } = useProject();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-2">Dashboard Principal</h2>
            <h1 className="text-4xl font-bold text-slate-800">Selecciona tu Canal</h1>
            <p className="text-slate-500 mt-2">
              Agencia: <span className="font-semibold text-slate-700">{projectData.agencyName}</span> | 
              Proyecto: <span className="font-semibold text-slate-700">{projectData.projectName}</span>
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl">
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
              
              <div className={`flex items-center gap-2 font-semibold ${platform.status === 'active' ? 'text-brand-accent group-hover:gap-4' : 'text-slate-400'} transition-all`}>
                {platform.status === 'active' ? 'Configurar Canal' : 'En desarrollo'} <ArrowRight size={18} />
              </div>

              {/* Decorative Background Elements */}
              <div className={`absolute -right-4 -bottom-4 w-32 h-32 ${platform.color} opacity-5 rounded-full blur-3xl`} />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
