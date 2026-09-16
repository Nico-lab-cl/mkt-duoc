import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { Users, ArrowRight, CheckCircle2, Lock, ShieldCheck, AlertCircle, Sparkles, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const GroupSelection = ({ onNext }) => {
  const { currentUser, setCurrentUser } = useProject();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectingId, setSelectingId] = useState(null);

  useEffect(() => {
    fetch('/api/groups')
      .then(res => res.json())
      .then(data => {
        setGroups(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSelectGroup = async (group) => {
    if (group.is_locked || group.year === '4to Año' || group.name?.includes('4°') || group.name?.includes('4to')) {
      setErrorMsg(`El ${group.name} corresponde a los alumnos de 4° Año y se encuentra completo y cerrado. Por favor selecciona un grupo de 3° Año.`);
      return;
    }

    setErrorMsg(null);
    setSelectingId(group.id);

    try {
      const response = await fetch('/api/select-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, groupId: group.id }),
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        onNext();
      } else {
        setErrorMsg(data.error || 'No se pudo seleccionar este grupo.');
      }
    } catch (err) {
      setErrorMsg('Error de conexión al seleccionar el grupo.');
    } finally {
      setSelectingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-slate-400 font-bold">Cargando grupos disponibles...</p>
      </div>
    );
  }

  // Filtrar grupos por 3er Año, 4to Año e Invitados
  const groups3rd = groups.filter(g => 
    g.year === '3er Año' || 
    g.id === 4 || g.id === 5 || g.id === 6 || 
    (g.name?.includes('3°') || g.name?.includes('3er'))
  );

  const groups4th = groups.filter(g => 
    g.year === '4to Año' || 
    g.id === 1 || g.id === 2 || g.id === 3 || 
    (g.name?.includes('4°') || g.name?.includes('4to'))
  );

  const guestsGroup = groups.find(g => g.id === 999 || g.name?.toLowerCase().includes('invitad'));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl w-full space-y-8 my-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-wider">
            <GraduationCap size={15} />
            <span>Simulador Inbound Marketing • Duoc UC</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Selección de Equipo
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Hola <strong className="text-blue-400">{currentUser?.full_name || 'Estudiante'}</strong>
            {currentUser?.career_year && <span> ({currentUser.career_year})</span>}, 
            por favor selecciona el grupo al que perteneces para esta evaluación.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-3 shadow-lg"
          >
            <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
            <span className="font-semibold leading-relaxed">{errorMsg}</span>
          </motion.div>
        )}

        {/* SECCIÓN 1: GRUPOS DE 3ER AÑO (DISPONIBLES) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400">
                Equipos de 3° Año (Disponibles para Unirse)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Selección activa para este semestre</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {groups3rd.map((group) => (
              <motion.button
                key={group.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectGroup(group)}
                disabled={selectingId === group.id}
                className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900/90 hover:from-blue-950/40 hover:to-slate-900 p-6 rounded-2xl border-2 border-slate-800 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-950/50 transition-all text-left group cursor-pointer relative overflow-hidden"
              >
                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                  <Users size={22} />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-black text-white group-hover:text-blue-300 transition-colors">
                    {group.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Activo
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold mb-5">Equipo de Trabajo Inbound</p>
                <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 font-extrabold text-xs transition-colors">
                  <span>{selectingId === group.id ? 'Asignando...' : 'Seleccionar Equipo'}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* SECCIÓN 2: GRUPOS DE 4TO AÑO (CERRADOS / NO SE PUEDE AGREGAR MÁS) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <Lock size={15} className="text-amber-400" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
                Equipos de 4° Año (Cerrados / Cupos Completados)
              </h2>
            </div>
            <span className="text-xs text-amber-400/80 font-semibold">🔒 No admite nuevos integrantes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {groups4th.map((group) => (
              <div
                key={group.id}
                onClick={() => handleSelectGroup(group)}
                className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 opacity-60 hover:opacity-80 transition-all text-left relative cursor-not-allowed select-none group"
              >
                <div className="w-12 h-12 bg-slate-800/80 text-slate-400 rounded-xl flex items-center justify-center mb-4 border border-slate-700/50">
                  <Lock size={20} className="text-amber-400/70" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-bold text-slate-300">
                    {group.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Lock size={10} /> Cerrado
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mb-4">4° Año • Equipo Completado</p>
                <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                  <span>Cupos completos</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN 3: INVITADOS (OPCIONAL) */}
        {guestsGroup && (
          <div className="pt-2">
            <button
              onClick={() => handleSelectGroup(guestsGroup)}
              className="w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between text-left transition-all hover:border-slate-700 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                  <Users size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-300 group-hover:text-white">Modo Invitado / Evaluación Individual</h4>
                  <p className="text-[11px] text-slate-500">Ingresar como invitado sin grupo asignado</p>
                </div>
              </div>
              <div className="text-xs font-bold text-slate-400 group-hover:text-blue-400 flex items-center gap-1">
                <span>Ingresar</span>
                <ArrowRight size={14} />
              </div>
            </button>
          </div>
        )}

        {/* Info Banner Bottom */}
        <div className="p-5 bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-900/30 border border-blue-800/40 rounded-2xl text-slate-300 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-500/30">
              <CheckCircle2 size={18} />
            </div>
            <p className="font-semibold text-xs leading-relaxed text-slate-300">
              Tu selección de equipo es permanente para esta sesión evaluativa. Si te equivocaste, el <strong className="text-white">Profesor Nicolás</strong> puede reasignarte directamente desde su panel de administración.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSelection;
