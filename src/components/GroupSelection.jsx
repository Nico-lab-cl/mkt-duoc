import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const GroupSelection = ({ onNext }) => {
  const { currentUser, setCurrentUser } = useProject();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/groups')
      .then(res => res.json())
      .then(data => {
        setGroups(data);
        setLoading(false);
      });
  }, []);

  const handleSelectGroup = async (groupId) => {
    try {
      const response = await fetch('/api/select-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, groupId }),
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        onNext();
      }
    } catch (err) {
      console.error('Error selecting group');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando grupos...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2">Selección de Equipo</h1>
          <p className="text-slate-500 font-medium italic">Hola {currentUser.full_name}, por favor selecciona el grupo al que perteneces para esta evaluación.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {groups.map((group) => (
            <motion.button
              key={group.id}
              whileHover={{ y: -5 }}
              onClick={() => handleSelectGroup(group.id)}
              className="bg-white p-8 rounded-3xl border-2 border-slate-100 hover:border-blue-500 hover:shadow-xl transition-all text-left group"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{group.name}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Unirse al equipo</p>
              <div className="flex items-center gap-2 text-blue-600 font-black text-sm">
                Seleccionar <ArrowRight size={16} />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-600 rounded-3xl text-white flex items-center justify-between shadow-lg shadow-blue-200">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <p className="font-bold text-sm leading-tight">Tu elección es permanente para esta sesión, pero el Profe Nico puede reasignarte si es necesario.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSelection;
