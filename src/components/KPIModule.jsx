import React, { useState } from 'react';
import KPIGlossary from './KPIGlossary';
import KPIGym from './KPIGym';
import { ArrowLeft, BookOpen, Dumbbell } from 'lucide-react';

const KPIModule = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('glossary');

  return (
    <div className="bg-slate-900 h-screen flex flex-col font-sans overflow-hidden">
      {/* Navbar Superior */}
      <div className="bg-slate-900 border-b border-slate-700/50 flex-shrink-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="font-bold uppercase tracking-widest text-xs">Volver al Dashboard</span>
          </button>
          
          <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('glossary')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'glossary' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <BookOpen size={16} /> Glosario Teórico
            </button>
            <button
              onClick={() => setActiveTab('gym')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === 'gym' 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Dumbbell size={16} /> Práctica
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenido principal con scroll interno */}
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {activeTab === 'glossary' && (
          <div className="animate-fade-in">
            <KPIGlossary />
          </div>
        )}
        {activeTab === 'gym' && (
          <div className="animate-fade-in">
            <KPIGym />
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIModule;
