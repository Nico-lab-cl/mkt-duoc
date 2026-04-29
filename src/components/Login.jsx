import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Rocket, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = ({ onNext }) => {
  const { updateProjectData } = useProject();
  const [formData, setFormData] = useState({ agencyName: '', projectName: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.agencyName && formData.projectName) {
      updateProjectData(formData);
      onNext();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-navy rounded-2xl mb-4 text-white shadow-lg">
            <Rocket size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Simulador Inbound MKA1215</h1>
          <p className="text-slate-500 mt-2">Bienvenido a la Sala de Operaciones</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label-text">Nombre de su Agencia / Grupo</label>
            <input 
              type="text" 
              required
              placeholder="Ej: Marketing Masters"
              className="input-field"
              value={formData.agencyName}
              onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
            />
          </div>
          
          <div>
            <label className="label-text">Nombre del Proyecto</label>
            <input 
              type="text" 
              required
              placeholder="Ej: Escuela de Tenis ByCoachQuiroz"
              className="input-field"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            />
          </div>

          <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
            Ingresar a la Sala de Operaciones
            <Shield size={18} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Sandbox de Simulación Estratégica
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
