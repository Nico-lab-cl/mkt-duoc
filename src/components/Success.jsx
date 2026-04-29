import React from 'react';
import { useProject } from '../context/ProjectContext';
import { motion } from 'framer-motion';
import { CheckCircle, Download, LayoutDashboard, Share2 } from 'lucide-react';

const Success = ({ onBackToDashboard }) => {
  const { projectData } = useProject();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5] p-6 font-sans">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl bg-white border border-[#CED0D4] shadow-sm rounded-xl overflow-hidden"
      >
        <div className="p-12 text-center border-b border-slate-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 text-green-600">
            <CheckCircle size={48} />
          </div>
          
          <h1 className="text-3xl font-bold text-[#1C1E21] mb-2">¡Campaña Publicada con Éxito!</h1>
          <p className="text-slate-500 text-lg">
            La configuración estratégica para <span className="font-bold text-slate-900">{projectData.projectName}</span> ha sido guardada en el simulador.
          </p>
        </div>

        <div className="p-8 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 px-4">Resumen de la Operación</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 mb-8">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Agencia</span>
              <p className="font-bold text-slate-800 text-lg leading-tight">{projectData.agencyName}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Canal Simulado</span>
              <p className="font-bold text-[#0064E0] text-lg leading-tight capitalize">{projectData.platform} Ads</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Estado</span>
              <p className="font-bold text-green-600 text-lg leading-tight">Activo / En Revisión</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 border-t border-slate-200 pt-8 mt-8">
            <button 
              onClick={onBackToDashboard}
              className="w-full md:w-auto px-8 py-3 bg-[#1C1E21] text-white rounded-lg font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <LayoutDashboard size={18} />
              Volver al Administrador
            </button>
            
            <button 
              className="w-full md:w-auto px-8 py-3 border-2 border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Exportar Informe PDF
            </button>

            <button 
              className="w-full md:w-auto px-8 py-3 border-2 border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
              Compartir con Profesor
            </button>
          </div>
        </div>

        <footer className="bg-white p-6 text-center text-xs text-slate-400 font-medium border-t border-slate-100">
          ID de Transacción: META_{Math.random().toString(36).substr(2, 9).toUpperCase()} | Generado por Simulador Inbound MKA1215
        </footer>
      </motion.div>
    </div>
  );
};

export default Success;
