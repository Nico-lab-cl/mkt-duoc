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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 p-6">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-slate-600 font-bold">Cargando grupos disponibles...</p>
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
    <div className="min-h-screen bg-slate-50 text-slate-800 w-full overflow-y-auto py-12 px-4 sm:px-6 lg:px-8 font-sans flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider shadow-sm">
            <GraduationCap size={15} />
            <span>Simulador Inbound Marketing • Duoc UC</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
            Selección de Equipo
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
            Hola <strong className="text-blue-600 font-extrabold">{currentUser?.full_name || 'Estudiante'}</strong>
            {currentUser?.career_year && <span> ({currentUser.career_year})</span>}, 
            por favor selecciona el grupo al que perteneces para esta evaluación.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3 shadow-sm"
          >
            <AlertCircle size={18} className="text-rose-500 flex-shrink-0" />
            <span className="font-bold leading-relaxed">{errorMsg}</span>
          </motion.div>
        )}

        {/* SECCIÓN 1: GRUPOS DE 3ER AÑO (DISPONIBLES) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-sm font-black uppercase tracking-wider text-emerald-700">
                Equipos de 3° Año (Disponibles para Unirse)
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-bold hidden sm:inline">Selección activa para alumnos de 3er año</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {groups3rd.map((group) => (
              <motion.button
                key={group.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectGroup(group)}
                disabled={selectingId === group.id}
                className="bg-white hover:bg-blue-50/40 p-6 rounded-3xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all text-left group cursor-pointer relative shadow-sm"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <Users size={24} />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    {group.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Activo
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-5">Equipo de Trabajo Inbound</p>
                <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 font-black text-xs transition-colors">
                  <span>{selectingId === group.id ? 'Asignando...' : 'Unirse al Equipo'}</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* SECCIÓN 2: GRUPOS DE 4TO AÑO (CERRADOS / COMPLETADOS) */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-amber-600" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">
                Equipos de 4° Año (Cerrados / Cupos Completos)
              </h2>
            </div>
            <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              🔒 No admite nuevos integrantes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {groups4th.map((group) => (
              <div
                key={group.id}
                onClick={() => handleSelectGroup(group)}
                className="bg-slate-100/70 p-6 rounded-3xl border border-slate-200 opacity-70 hover:opacity-90 transition-all text-left relative cursor-not-allowed select-none"
              >
                <div className="w-12 h-12 bg-slate-200 text-slate-500 rounded-2xl flex items-center justify-center mb-4">
                  <Lock size={20} className="text-amber-600" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-bold text-slate-700">
                    {group.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Lock size={10} /> Cerrado
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-4">4° Año • Equipo Completado</p>
                <div className="text-xs text-slate-400 font-bold">
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
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between text-left transition-all hover:border-slate-300 shadow-sm cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <Users size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-700">Modo Invitado / Evaluación Individual</h4>
                  <p className="text-[11px] text-slate-500">Ingresar como invitado sin grupo asignado</p>
                </div>
              </div>
              <div className="text-xs font-bold text-slate-500 group-hover:text-blue-600 flex items-center gap-1">
                <span>Ingresar</span>
                <ArrowRight size={15} />
              </div>
            </button>
          </div>
        )}

        {/* Info Banner Bottom */}
        <div className="p-6 bg-blue-600 rounded-3xl text-white flex items-center justify-between shadow-lg shadow-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <p className="font-bold text-sm leading-relaxed">
              Tu elección de equipo es permanente para esta sesión. Si te equivocaste de grupo, el <strong className="underline">Profesor Nicolás</strong> puede reasignarte directamente desde su panel de control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSelection;
