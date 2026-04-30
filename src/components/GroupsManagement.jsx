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
  Search
} from 'lucide-react';

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
    group_id: ''
  });
  const [newUserForm, setNewUserForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'student',
    group_id: ''
  });
  const [message, setMessage] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.group_name && u.group_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      group_id: user.group_id || ''
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
        setMessage({ type: 'success', text: 'Usuario actualizado correctamente' });
        setEditingUser(null);
        fetchData();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar usuario' });
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserForm)
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Usuario creado exitosamente' });
        setShowAddForm(false);
        setNewUserForm({ full_name: '', email: '', password: '', role: 'student', group_id: '' });
        fetchData();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al crear usuario' });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Usuario eliminado' });
        fetchData();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al eliminar usuario' });
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-3xl font-black tracking-tighter text-slate-800 uppercase italic">Gestión de Alumnos y Grupos</h3>
          <p className="text-slate-500 font-medium">Control total sobre los accesos y equipos de trabajo.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Buscar alumno o grupo..." 
               className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-xs"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100"
          >
            {showAddForm ? <X size={16} /> : <UserPlus size={16} />}
            {showAddForm ? 'Cancelar' : 'Nuevo Alumno'}
          </button>
          <button 
            onClick={fetchData}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-400"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Alumnos</span>
            <span className="text-2xl font-black text-slate-800 tracking-tighter">{users.length}</span>
         </div>
         <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Grupos Activos</span>
            <span className="text-2xl font-black text-blue-600 tracking-tighter">{groups.length}</span>
         </div>
         <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Sin Grupo</span>
            <span className="text-2xl font-black text-amber-500 tracking-tighter">{users.filter(u => !u.group_id).length}</span>
         </div>
         <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Admins</span>
            <span className="text-2xl font-black text-purple-600 tracking-tighter">{users.filter(u => u.role === 'admin').length}</span>
         </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreateUser} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-3 mb-2">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Registrar Nuevo Estudiante</h4>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nombre Completo</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white font-bold text-sm"
                  value={newUserForm.full_name}
                  onChange={(e) => setNewUserForm({...newUserForm, full_name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Email Institucional</label>
                <input 
                  required
                  type="email" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white font-bold text-sm"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Contraseña Inicial</label>
                <input 
                  type="password" 
                  placeholder="Por defecto: duoc2024"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white font-bold text-sm"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Rol de Usuario</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-sm"
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})}
                >
                  <option value="student">Alumno</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Asignar a Grupo</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-sm"
                  value={newUserForm.group_id}
                  onChange={(e) => setNewUserForm({...newUserForm, group_id: e.target.value})}
                >
                  <option value="">Sin Grupo</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all">
                  Crear Usuario
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
        >
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </motion.div>
      )}

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alumno / Usuario</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rol</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Grupo / Equipo</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  {editingUser === user.id ? (
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm text-slate-800"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-black text-xs uppercase border border-slate-200">
                        {user.full_name[0]}
                      </div>
                      <span className="font-bold text-slate-800 text-sm">{user.full_name}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingUser === user.id ? (
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm text-slate-800"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    />
                  ) : (
                    <span className="text-slate-500 font-medium text-sm">{user.email}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingUser === user.id ? (
                    <select 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm"
                      value={editForm.role}
                      onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                    >
                      <option value="student">Alumno</option>
                      <option value="admin">Administrador</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${user.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      {user.role === 'admin' ? 'Administrador' : 'Alumno'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingUser === user.id ? (
                    <select 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm"
                      value={editForm.group_id}
                      onChange={(e) => setEditForm({...editForm, group_id: e.target.value})}
                    >
                      <option value="">Sin Grupo</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.group_id ? 'bg-green-500' : 'bg-slate-300'}`} />
                      <span className="font-black text-slate-700 text-xs uppercase italic tracking-tight">{user.group_name || 'Sin Asignar'}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {editingUser === user.id ? (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleSave(user.id)}
                        className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        onClick={() => setEditingUser(null)}
                        className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {groups.map(group => {
          const groupMembers = users.filter(u => u.group_id === group.id);
          return (
            <div key={group.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={80} />
              </div>
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h4 className="font-black italic tracking-tighter text-xl uppercase text-slate-800 border-b-4 border-blue-500 pb-1">{group.name}</h4>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{groupMembers.length} Alumnos</span>
              </div>
              <div className="space-y-3 relative z-10">
                {groupMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm font-bold text-slate-700">{member.full_name}</span>
                    </div>
                    <UserIcon size={14} className="text-slate-300" />
                  </div>
                ))}
                {groupMembers.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-[2rem]">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Escuadrón Vacío</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupsManagement;
