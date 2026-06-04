import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Rocket, Shield, Lock, Mail, AlertCircle, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = ({ onNext }) => {
  const { setCurrentUser, updateProjectData } = useProject();
  
  // Modos de vista: 'login' | 'change-password' | 'recover-password'
  const [mode, setMode] = useState('login');
  
  const [formData, setFormData] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const registeredEmail = params.get('registered_email') || '';
    return { email: registeredEmail, password: '' };
  });
  
  const [successMsg, setSuccessMsg] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('registered') === 'true' 
      ? '¡Registro exitoso! Revisa tu WhatsApp y correo para ver tu contraseña temporal e ingresa aquí.' 
      : '';
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // States para cambio de contraseña
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // States para recuperación de contraseña
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        if (data.mustChangePassword) {
          setMode('change-password');
          setError('');
          setSuccessMsg('');
          setLoading(false);
          return;
        }

        // Limpiar parámetros de la URL al iniciar sesión exitosamente
        if (window.history.replaceState) {
          window.history.replaceState(null, '', '/');
        }
        setCurrentUser(data.user);
        // Sincronizar datos iniciales del proyecto con el nombre del usuario
        updateProjectData({ 
          agencyName: data.user.full_name,
          projectName: 'Proyecto Inicial'
        });
        onNext();
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          currentPassword: formData.password,
          newPassword
        })
      });
      const data = await response.json();
      if (data.success) {
        if (window.history.replaceState) {
          window.history.replaceState(null, '', '/');
        }
        setCurrentUser(data.user);
        updateProjectData({
          agencyName: data.user.full_name,
          projectName: 'Proyecto Inicial'
        });
        onNext();
      } else {
        setError(data.message || 'Error al cambiar contraseña');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const response = await fetch('/api/recover-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail })
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg('¡Clave temporal enviada! Revisa tu WhatsApp.');
        setRecoveryEmail('');
      } else {
        setError(data.message || 'Error al recuperar contraseña');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8"
      >
        {mode === 'login' && (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 text-white shadow-lg">
                <Rocket size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Marketing Inbound</h1>
              <p className="text-slate-500 mt-2 font-medium">Acceso al Simulador MKA1215</p>
            </div>

            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm rounded-lg flex items-center gap-2 font-bold"
              >
                <Check size={18} className="text-emerald-500 shrink-0" />
                {successMsg}
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2 font-bold"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-2">Correo Institucional</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    required
                    placeholder="ejemplo@duocuc.cl"
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-2">Contraseña</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="text-right mt-1.5">
                  <button 
                    type="button" 
                    onClick={() => {
                      setError('');
                      setSuccessMsg('');
                      setMode('recover-password');
                    }}
                    className="text-xs font-bold text-blue-650 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Validando...' : 'Entrar al Simulador'}
                <Shield size={18} />
              </button>
            </form>
          </>
        )}

        {mode === 'change-password' && (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-650 rounded-2xl mb-4 text-white shadow-lg">
                <Lock size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Crea tu Nueva Contraseña</h1>
              <p className="text-slate-500 mt-2 font-medium">Por seguridad, debes cambiar tu contraseña temporal antes de continuar.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2 font-bold"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-2">Nueva Contraseña</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    required
                    minLength={4}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-2">Confirmar Nueva Contraseña</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    required
                    minLength={4}
                    placeholder="Repite tu contraseña"
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Guardando...' : 'Guardar y Acceder'}
                <Shield size={18} />
              </button>
            </form>
          </>
        )}

        {mode === 'recover-password' && (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-600 rounded-2xl mb-4 text-white shadow-lg">
                <Mail size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Recuperar Contraseña</h1>
              <p className="text-slate-500 mt-2 font-medium">Ingresa tu correo institucional registrado para enviarte una nueva contraseña por WhatsApp.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2 font-bold"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm rounded-lg flex items-center gap-2 font-bold"
              >
                <Check size={18} className="text-emerald-500 shrink-0" />
                {successMsg}
              </motion.div>
            )}

            <form onSubmit={handleRecoverSubmit} className="space-y-5">
              <div>
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-2">Correo Institucional</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    required
                    placeholder="ejemplo@duocuc.cl"
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 bg-amber-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-100 hover:bg-amber-700 transition-all active:scale-95 cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Enviando...' : 'Enviar Contraseña por WhatsApp'}
              </button>

              <button 
                type="button" 
                onClick={() => {
                  setError('');
                  setSuccessMsg('');
                  setMode('login');
                }}
                className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-700 hover:underline block pt-2 cursor-pointer bg-transparent border-0"
              >
                Volver al Login
              </button>
            </form>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-4">
          <a 
            href="/identidad"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg hover:brightness-110 transition-all"
          >
            🎓 Invitado — Feria Vocacional
          </a>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
            Sandbox de Simulación Estratégica v2.0
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
