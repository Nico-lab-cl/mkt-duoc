import { useState, useEffect, useCallback } from 'react';
import {
  FlaskConical,
  Plus,
  Loader2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  PencilLine,
  FileText,
  MessageCircle,
  Users,
  X
} from 'lucide-react';
import usePageScroll from '../feedbackDocente/usePageScroll';

/**
 * Laboratorio Martech: /lab
 *
 * Cada equipo crea aquí su espacio (nombre + PIN) y obtiene /lab/<slug>, una
 * página propia donde publica el formulario y el chatbot de su HubSpot Free.
 * La lista sirve también para proyectarla en la sala durante la prueba cruzada.
 */

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100';

const Chip = ({ on, icon: Icon, label }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold ${
      on ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
    }`}
  >
    <Icon size={12} />
    {label}
  </span>
);

const CreateSpace = ({ onCreated, onCancel }) => {
  const [form, setForm] = useState({ team_name: '', members: '', pin: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/lab/spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'No se pudo crear el espacio');
      try {
        sessionStorage.setItem(`lab_pin_${data.space.slug}`, form.pin);
      } catch {
        // Sin almacenamiento: el editor pedirá el PIN de nuevo
      }
      onCreated(data.space);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-sky-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900">Crear el espacio de mi equipo</h2>
          <p className="mt-1 text-[14px] text-slate-500">
            Un espacio por equipo. Guarden el PIN: lo necesitan para cambiar su código.
          </p>
        </div>
        <button type="button" onClick={onCancel} className="rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Cerrar">
          <X size={18} />
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[14px] font-semibold text-slate-800">Nombre del equipo</span>
          <input
            className={inputClass}
            value={form.team_name}
            onChange={(e) => setForm({ ...form, team_name: e.target.value })}
            placeholder="Ej: Equipo 1"
            maxLength={60}
            required
          />
          {form.team_name && (
            <span className="mt-1.5 block text-[12.5px] text-slate-400">
              Su página será softwarespectra.cl/lab/
              {form.team_name
                .normalize('NFD')
                .replace(/[̀-ͯ]/g, '')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')}
            </span>
          )}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[14px] font-semibold text-slate-800">PIN del equipo</span>
          <input
            className={inputClass}
            value={form.pin}
            onChange={(e) => setForm({ ...form, pin: e.target.value })}
            placeholder="Mínimo 4 caracteres"
            minLength={4}
            maxLength={20}
            required
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-[14px] font-semibold text-slate-800">
            Integrantes <span className="ml-1 text-[12px] font-medium text-slate-400">(opcional)</span>
          </span>
          <input
            className={inputClass}
            value={form.members}
            onChange={(e) => setForm({ ...form, members: e.target.value })}
            placeholder="Camila Torres, Diego Rojas, …"
            maxLength={300}
          />
        </label>
      </div>
      {error && (
        <p className="mt-4 flex items-center gap-2 text-[13.5px] font-semibold text-rose-600">
          <AlertCircle size={15} /> {error}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-[14px] font-bold text-white transition hover:bg-slate-700 disabled:opacity-50"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
        Crear espacio
      </button>
    </form>
  );
};

export default function LabHome() {
  usePageScroll();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/lab/spaces');
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'No se pudieron cargar los equipos');
      setSpaces(data.spaces);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="px-1 pb-2">
          <p className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-sky-600">
            <FlaskConical size={14} /> Laboratorio Martech
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Del portal al CRM, en vivo
          </h1>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-slate-600">
            Cada equipo tiene una página en softwarespectra.cl donde publica el formulario y el chatbot de su HubSpot
            Free. Después, otro equipo la visita, deja sus datos y ustedes demuestran que el contacto llegó al CRM.
          </p>
        </header>

        {creating ? (
          <CreateSpace
            onCancel={() => setCreating(false)}
            onCreated={(space) => window.location.assign(`/lab/${space.slug}/editar`)}
          />
        ) : (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-[14px] font-bold text-white transition hover:bg-slate-700"
            >
              <Plus size={16} /> Crear el espacio de mi equipo
            </button>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-[14px] font-bold text-slate-700 transition hover:bg-slate-100"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Actualizar
            </button>
          </div>
        )}

        {error && (
          <p className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[14px] font-semibold text-rose-700">
            <AlertCircle size={16} /> {error}
          </p>
        )}

        {!loading && !error && spaces.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 px-6 py-14 text-center text-slate-500">
            <Users size={28} className="mx-auto text-slate-300" />
            <p className="mt-3 text-[15px] font-semibold">Todavía no hay equipos</p>
            <p className="text-[14px]">El primero en crear su espacio aparece aquí.</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {spaces.map((s) => (
            <article key={s.slug} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black tracking-tight text-slate-900">{s.team_name}</h2>
              <p className="text-[13px] text-slate-400">/lab/{s.slug}</p>
              {s.members && <p className="mt-2 text-[13.5px] leading-snug text-slate-600">{s.members}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                <Chip on={s.has_form} icon={FileText} label={s.has_form ? 'Formulario publicado' : 'Sin formulario'} />
                <Chip on={s.has_head} icon={MessageCircle} label={s.has_head ? 'Seguimiento / chat' : 'Sin seguimiento'} />
              </div>
              <div className="mt-auto flex gap-2 pt-5">
                <a
                  href={`/lab/${s.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-sky-700"
                >
                  <ExternalLink size={14} /> Ver página
                </a>
                <a
                  href={`/lab/${s.slug}/editar`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-[13.5px] font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  <PencilLine size={14} /> Editar
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
