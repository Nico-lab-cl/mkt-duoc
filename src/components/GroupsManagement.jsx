import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Edit2, 
  Save, 
  X, 
  UserPlus, 
  RefreshCcw, 
  Shield, 
  User as UserIcon, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  Mail,
  GraduationCap,
  MapPin,
  Send,
  Key,
  Lock,
  Filter,
  Check
} from 'lucide-react';

const SEDES_DUOC = [
  'Sede Plaza Vespucio',
  'Sede San Carlos de Apoquindo',
  'Sede Antonio Varas',
  'Sede Viña del Mar',
  'Sede Concepción',
  'Sede Plaza Norte',
  'Sede Maipú',
  'Sede Alameda',
  'Sede San Bernardo',
  'Sede Melipilla',
  'Sede Puente Alto',
  'Sede Padre Alonso de Ovalle',
  'Sede Valparaíso',
  'Sede Puerto Montt',
  'Campus Virtual / Online',
  'Otra Sede'
];

const ANOS_CARRERA = [
  '1er Año',
  '2do Año',
  '3er Año',
  '4to Año',
  'Egresado / Titulado'
];

const GroupsManagement = () => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    role: 'student',
    group_id: '',
    career_year: '',
    campus: ''
  });

  const [newUserForm, setNewUserForm] = useState({
    full_name: '',
    email: '',
    career_year: '1er Año',
    campus: 'Sede Plaza Vespucio',
    role: 'student',
    group_id: '',
    password: '',
    send_email: true
  });

  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCampus, setFilterCampus] = useState('ALL');
  const [filterYear, setFilterYear] = useState('ALL');
  const [sendingUserId, setSendingUserId] = useState(null);
  const [submittingUser, setSubmittingUser] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, groupsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/groups')
      ]);
      const usersData = await usersRes.json();
      const groupsData = await groupsRes.json();
      setUsers(usersData);
      setGroups(groupsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.group_name && u.group_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.campus && u.campus.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCampus = filterCampus === 'ALL' || u.campus === filterCampus;
    const matchesYear = filterYear === 'ALL' || u.career_year === filterYear;

    return matchesSearch && matchesCampus && matchesYear;
  });

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({
      full_name: user.full_name || '',
      email: user.email || '',
      role: user.role || 'student',
      group_id: user.group_id || '',
      career_year: user.career_year || '1er Año',
      campus: user.campus || 'Sede Plaza Vespucio'
    });
  };

  const handleSave = async (userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Alumno actualizado correctamente' });
        setEditingUser(null);
        fetchData();
        setTimeout(() => setMessage(null), 3500);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar alumno' });
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmittingUser(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserForm)
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        setMessage({ 
          type: 'success', 
          text: `¡Alumno ${newUserForm.full_name} registrado! Clave temporal: ${data.tmpPassword} ${data.emailSent ? '(Correo de bienvenida enviado por n8n)' : ''}` 
        });
        setShowAddForm(false);
        setNewUserForm({
          full_name: '',
          email: '',
          career_year: '1er Año',
          campus: 'Sede Plaza Vespucio',
          role: 'student',
          group_id: '',
          password: '',
          send_email: true
        });
        fetchData();
        setTimeout(() => setMessage(null), 6000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al registrar alumno' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión al registrar alumno' });
    } finally {
      setSubmittingUser(false);
    }
  };

  const handleResendCredentials = async (user) => {
    setSendingUserId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/resend-credentials`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ 
          type: 'success', 
          text: `Nueva clave temporal enviada a ${user.email}: ${data.tmpPassword}` 
        });
        fetchData();
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al reenviar credenciales' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al conectar con el servidor' });
    } finally {
      setSendingUserId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de eliminar este alumno de la plataforma?')) return;
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Alumno eliminado' });
        fetchData();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al eliminar alumno' });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <RefreshCcw className="animate-spin text-blue-600" size={32} />
      <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Cargando gestión de alumnos...</span>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-3xl font-black tracking-tighter text-slate-800 uppercase italic">
            Gestión de Alumnos y Accesos
          </h3>
          <p className="text-slate-500 font-medium text-sm">
            Registra nuevos estudiantes, envía contraseñas temporales y asigna sedes y años de carrera.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Buscar alumno, sede, email..." 
               className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>

          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 cursor-pointer"
          >
            {showAddForm ? <X size={16} /> : <UserPlus size={16} />}
            {showAddForm ? 'Cancelar' : '+ Agregar Alumno'}
          </button>

          <button 
            onClick={fetchData}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 cursor-pointer"
            title="Recargar listado"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl font-bold text-xs flex items-center gap-3 border shadow-sm ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-rose-600" />}
          <span>{message.text}</span>
        </motion.div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Alumnos</span>
            <span className="text-2xl font-black text-slate-800 tracking-tighter">{users.filter(u => u.role !== 'admin').length}</span>
         </div>
         <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Grupos Activos</span>
            <span className="text-2xl font-black text-blue-600 tracking-tighter">{groups.length}</span>
         </div>
         <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Con Clave Temporal</span>
            <span className="text-2xl font-black text-amber-500 tracking-tighter">{users.filter(u => u.must_change_password).length}</span>
         </div>
         <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Sedes Registradas</span>
            <span className="text-2xl font-black text-purple-600 tracking-tighter">
              {new Set(users.map(u => u.campus).filter(Boolean)).size || 1}
            </span>
         </div>
      </div>

      {/* FORM: REGISTRAR NUEVO ALUMNO */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreateUser} className="bg-white p-8 rounded-[2.5rem] border border-blue-200 shadow-2xl shadow-blue-50/50 mb-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 uppercase italic">
                      Registrar Nuevo Alumno en la Plataforma
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">
                      El alumno recibirá un correo con su contraseña temporal y al ingresar se le solicitará cambiarla.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Nombre Completo */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Nombre Completo del Alumno *
                  </label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      required
                      type="text" 
                      placeholder="Ej: Constanza Morales Valenzuela"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white font-bold text-xs text-slate-800"
                      value={newUserForm.full_name}
                      onChange={(e) => setNewUserForm({...newUserForm, full_name: e.target.value})}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Email Institucional del Alumno *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      required
                      type="email" 
                      placeholder="ej: c.morales@alumnos.duoc.cl"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white font-bold text-xs text-slate-800"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                    />
                  </div>
                </div>

                {/* Año de Carrera */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Año de Carrera *
                  </label>
                  <div className="relative">
                    <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs text-slate-800 cursor-pointer"
                      value={newUserForm.career_year}
                      onChange={(e) => setNewUserForm({...newUserForm, career_year: e.target.value})}
                    >
                      {ANOS_CARRERA.map(ano => (
                        <option key={ano} value={ano}>{ano}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sede Duoc UC */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Sede Duoc UC *
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs text-slate-800 cursor-pointer"
                      value={newUserForm.campus}
                      onChange={(e) => setNewUserForm({...newUserForm, campus: e.target.value})}
                    >
                      {SEDES_DUOC.map(sede => (
                        <option key={sede} value={sede}>{sede}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Asignar Grupo */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Grupo de Trabajo (Opcional)
                  </label>
                  <div className="relative">
                    <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs text-slate-800 cursor-pointer"
                      value={newUserForm.group_id}
                      onChange={(e) => setNewUserForm({...newUserForm, group_id: e.target.value})}
                    >
                      <option value="">Sin Grupo (Asignar después)</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contraseña Temporal Opcional */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Contraseña Temporal (Opcional)
                  </label>
                  <div className="relative">
                    <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Autogenerar automática si se deja vacío"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white font-bold text-xs text-slate-800"
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Informative Banner */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3 text-xs text-blue-900">
                <Send size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Proceso de Bienvenida Automático:</p>
                  <p className="text-blue-700">
                    Al hacer clic en <strong>"Crear y Enviar Correo"</strong>, el sistema generará una clave temporal segura, notificará al webhook de n8n para enviar el correo al alumno y exigirá el cambio de contraseña al ingresar.
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingUser}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submittingUser ? (
                    <>
                      <RefreshCcw size={15} className="animate-spin" />
                      <span>Registrando y Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Crear y Enviar Correo al Alumno</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Filter size={15} />
          <span>Filtros:</span>
        </div>

        {/* Filter Sede */}
        <select
          value={filterCampus}
          onChange={(e) => setFilterCampus(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
        >
          <option value="ALL">Todas las Sedes</option>
          {SEDES_DUOC.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Filter Año */}
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
        >
          <option value="ALL">Todos los Años</option>
          {ANOS_CARRERA.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        {(filterCampus !== 'ALL' || filterYear !== 'ALL' || searchTerm) && (
          <button
            onClick={() => { setFilterCampus('ALL'); setFilterYear('ALL'); setSearchTerm(''); }}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold ml-auto cursor-pointer"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                <th className="p-5">Alumno</th>
                <th className="p-5">Año de Carrera</th>
                <th className="p-5">Sede Duoc UC</th>
                <th className="p-5">Grupo</th>
                <th className="p-5">Estado Clave</th>
                <th className="p-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-400 font-medium">
                    No se encontraron alumnos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Alumno info */}
                    <td className="p-5">
                      {editingUser === user.id ? (
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                            value={editForm.full_name}
                            onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                            placeholder="Nombre"
                          />
                          <input 
                            type="email" 
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            placeholder="Correo"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role === 'admin' ? <Shield size={16} /> : <UserIcon size={16} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 flex items-center gap-2">
                              {user.full_name || 'Sin Nombre'}
                              {user.role === 'admin' && (
                                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-black">
                                  Profesor
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium">{user.email}</p>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Año de Carrera */}
                    <td className="p-5">
                      {editingUser === user.id ? (
                        <select
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                          value={editForm.career_year}
                          onChange={(e) => setEditForm({...editForm, career_year: e.target.value})}
                        >
                          {ANOS_CARRERA.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                          {user.career_year || '1er Año'}
                        </span>
                      )}
                    </td>

                    {/* Sede */}
                    <td className="p-5">
                      {editingUser === user.id ? (
                        <select
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                          value={editForm.campus}
                          onChange={(e) => setEditForm({...editForm, campus: e.target.value})}
                        >
                          {SEDES_DUOC.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs">
                          <MapPin size={13} className="text-slate-400" />
                          <span>{user.campus || 'Sede Plaza Vespucio'}</span>
                        </div>
                      )}
                    </td>

                    {/* Grupo */}
                    <td className="p-5">
                      {editingUser === user.id ? (
                        <select 
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                          value={editForm.group_id}
                          onChange={(e) => setEditForm({...editForm, group_id: e.target.value})}
                        >
                          <option value="">Sin Grupo</option>
                          {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          user.group_id 
                            ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          {user.group_name || 'Sin Asignar'}
                        </span>
                      )}
                    </td>

                    {/* Estado Clave */}
                    <td className="p-5">
                      {user.must_change_password ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Lock size={11} />
                          <span>Temporal (Pendiente)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check size={11} />
                          <span>Clave Activa</span>
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="p-5 text-right space-x-1 whitespace-nowrap">
                      {editingUser === user.id ? (
                        <>
                          <button 
                            onClick={() => handleSave(user.id)}
                            className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100 cursor-pointer"
                            title="Guardar cambios"
                          >
                            <Save size={15} />
                          </button>
                          <button 
                            onClick={() => setEditingUser(null)}
                            className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
                            title="Cancelar"
                          >
                            <X size={15} />
                          </button>
                        </>
                      ) : (
                        <>
                          {user.role !== 'admin' && (
                            <button 
                              onClick={() => handleResendCredentials(user)}
                              disabled={sendingUserId === user.id}
                              className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all cursor-pointer"
                              title="Reenviar Contraseña Temporal por Correo"
                            >
                              {sendingUserId === user.id ? <RefreshCcw size={15} className="animate-spin" /> : <Mail size={15} />}
                            </button>
                          )}
                          <button 
                            onClick={() => handleEdit(user)}
                            className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                            title="Editar Alumno"
                          >
                            <Edit2 size={15} />
                          </button>
                          {user.role !== 'admin' && (
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all cursor-pointer"
                              title="Eliminar Alumno"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GroupsManagement;
