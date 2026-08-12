import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ClipboardList,
  Search,
  RefreshCw,
  Download,
  Trash2,
  Loader2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Video,
  Paperclip,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Inbox,
  ExternalLink,
  Check
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { BRIEFING_SECTIONS, FILE_CATEGORIES, PALETTES } from './ClinicaBriefingForm';

/**
 * Panel para revisar los briefings que envían los clientes desde
 * /formulario-clinica-conectamedica. Solo visible para administradores; los
 * endpoints además verifican el rol en el servidor.
 */

const formatBytes = (bytes) => {
  const n = Number(bytes) || 0;
  if (n === 0) return '0 KB';
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const fileIcon = (mime = '') => {
  if (mime.startsWith('image/')) return ImageIcon;
  if (mime.startsWith('video/')) return Video;
  return FileText;
};

const isImage = (mime = '') => mime.startsWith('image/');

const categoryLabel = (id) => FILE_CATEGORIES.find((c) => c.id === id)?.label || 'Otros';

// Convierte cualquier respuesta a texto legible
const renderValue = (value) => {
  if (value === null || value === undefined || value === '') return null;
  if (Array.isArray(value)) return value.length ? value : null;
  return String(value);
};

const BriefingsAdmin = () => {
  const { currentUser } = useProject();
  const uid = currentUser?.id;

  const [list, setList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const authFetch = useCallback(
    (url, options = {}) =>
      fetch(url, { ...options, headers: { ...(options.headers || {}), 'x-user-id': String(uid || '') } }),
    [uid]
  );

  const loadList = useCallback(async () => {
    setLoadingList(true);
    setError('');
    try {
      const res = await authFetch('/api/admin/briefings');
      if (!res.ok) throw new Error((await res.json()).error || 'No se pudo cargar la lista');
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingList(false);
    }
  }, [authFetch]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    if (!selectedId) return;
    setLoadingDetail(true);
    authFetch(`/api/admin/briefings/${selectedId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || 'No se pudo cargar el formulario');
        return r.json();
      })
      .then(setDetail)
      .catch((err) => setError(err.message))
      .finally(() => setLoadingDetail(false));
  }, [selectedId, authFetch]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((b) =>
      [b.clinic_name, b.contact_name, b.contact_email, b.token].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [list, search]);

  const handleDelete = async (id) => {
    try {
      const res = await authFetch(`/api/admin/briefings/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'No se pudo eliminar');
      setConfirmDelete(null);
      if (selectedId === id) {
        setSelectedId(null);
        setDetail(null);
      }
      loadList();
    } catch (err) {
      setError(err.message);
    }
  };

  // Descarga las respuestas como texto plano para pegarlas en una propuesta
  const exportText = () => {
    if (!detail) return;
    const a = detail.briefing.answers || {};
    const lines = [
      `BRIEFING — ${detail.briefing.clinic_name || 'Sin nombre'}`,
      `Contacto: ${detail.briefing.contact_name || '—'} · ${detail.briefing.contact_email || '—'} · ${
        detail.briefing.contact_phone || '—'
      }`,
      `Recibido: ${formatDate(detail.briefing.created_at)}`,
      ''
    ];
    BRIEFING_SECTIONS.forEach((section) => {
      const answered = section.fields.filter((f) => renderValue(a[f.key]));
      if (answered.length === 0) return;
      lines.push(`\n== ${section.title.toUpperCase()} ==\n`);
      answered.forEach((f) => {
        const v = a[f.key];
        lines.push(`${f.label}`);
        lines.push(Array.isArray(v) ? v.map((i) => `  - ${i}`).join('\n') : `  ${v}`);
        lines.push('');
      });
    });
    if (detail.files.length) {
      lines.push('\n== ARCHIVOS ADJUNTOS ==\n');
      detail.files.forEach((f) => lines.push(`  - [${categoryLabel(f.category)}] ${f.file_name} (${formatBytes(f.file_size)})`));
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `briefing-${(detail.briefing.clinic_name || 'cliente').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex items-center gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <AlertCircle className="text-amber-500" />
        <p className="text-sm font-bold text-amber-800">Esta sección es solo para administradores.</p>
      </div>
    );
  }

  const answers = detail?.briefing?.answers || {};
  const filesByCategory = (detail?.files || []).reduce((acc, f) => {
    const cat = f.category || 'otros';
    (acc[cat] = acc[cat] || []).push(f);
    return acc;
  }, {});

  return (
    <div className="pb-20">
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <AlertCircle size={18} className="shrink-0 text-red-500" />
          <p className="flex-1 text-sm font-bold text-red-700">{error}</p>
          <button onClick={() => setError('')} className="text-xs font-bold text-red-500 underline">
            cerrar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        {/* --- LISTA --- */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList size={18} className="text-sky-600" />
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-800">
                Formularios ({list.length})
              </h3>
            </div>
            <button
              onClick={loadList}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-sky-600"
              title="Actualizar"
            >
              <RefreshCw size={15} className={loadingList ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="relative mb-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por clínica, contacto o código"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-[13px] outline-none transition focus:border-sky-400 focus:bg-white"
            />
          </div>

          {loadingList ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 size={22} className="animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Inbox size={34} className="mx-auto text-slate-300" />
              <p className="mt-3 text-[13px] font-bold text-slate-400">
                {list.length === 0 ? 'Todavía no llega ningún formulario' : 'Sin resultados para esa búsqueda'}
              </p>
              {list.length === 0 && (
                <a
                  href="/formulario-clinica-conectamedica"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-sky-600 hover:underline"
                >
                  Ver el formulario <ExternalLink size={12} />
                </a>
              )}
            </div>
          ) : (
            <div className="max-h-[65vh] space-y-2 overflow-y-auto pr-1">
              {filtered.map((b) => {
                const active = selectedId === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedId(b.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      active
                        ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-100'
                        : 'border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-[14px] font-bold text-slate-800">
                        {b.clinic_name || 'Clínica sin nombre'}
                      </p>
                      <ChevronRight size={15} className={active ? 'text-sky-500' : 'text-slate-300'} />
                    </div>
                    <p className="mt-0.5 truncate text-[12px] text-slate-500">{b.contact_name || 'Sin contacto'}</p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {formatDate(b.created_at).split(',')[0]}
                      </span>
                      {b.files_count > 0 && (
                        <span className="flex items-center gap-1 text-sky-600">
                          <Paperclip size={11} /> {b.files_count} · {formatBytes(b.files_bytes)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* --- DETALLE --- */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100">
          {!selectedId ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
              <ClipboardList size={44} className="text-slate-200" />
              <p className="mt-4 text-sm font-bold text-slate-400">
                Seleccione un formulario de la izquierda para ver las respuestas
              </p>
            </div>
          ) : loadingDetail ? (
            <div className="flex h-full min-h-[400px] items-center justify-center text-slate-400">
              <Loader2 size={26} className="animate-spin" />
            </div>
          ) : detail ? (
            <>
              {/* Encabezado */}
              <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    {detail.briefing.clinic_name || 'Clínica sin nombre'}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-[13px] text-slate-500">
                    {detail.briefing.contact_name && <span className="font-bold">{detail.briefing.contact_name}</span>}
                    {detail.briefing.contact_email && (
                      <a
                        href={`mailto:${detail.briefing.contact_email}`}
                        className="flex items-center gap-1.5 hover:text-sky-600"
                      >
                        <Mail size={13} /> {detail.briefing.contact_email}
                      </a>
                    )}
                    {detail.briefing.contact_phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={13} /> {detail.briefing.contact_phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} /> {formatDate(detail.briefing.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportText}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-slate-700"
                  >
                    <Download size={14} /> Descargar respuestas
                  </button>
                  {confirmDelete === detail.briefing.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(detail.briefing.id)}
                        className="rounded-xl bg-red-600 px-3 py-2.5 text-[12px] font-bold text-white hover:bg-red-700"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="rounded-xl px-3 py-2.5 text-[12px] font-bold text-slate-500 hover:bg-slate-100"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(detail.briefing.id)}
                      className="rounded-xl p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      title="Eliminar formulario y sus archivos"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Respuestas por sección */}
              <div className="space-y-10">
                {BRIEFING_SECTIONS.map((section) => {
                  const answered = section.fields.filter((f) => renderValue(answers[f.key]));
                  if (answered.length === 0) return null;
                  return (
                    <section key={section.id}>
                      <h3 className="mb-4 border-l-4 border-sky-500 pl-3 text-[12px] font-black uppercase tracking-widest text-slate-800">
                        {section.title}
                      </h3>
                      <div className="space-y-5">
                        {answered.map((f) => {
                          const value = answers[f.key];
                          const palette = f.type === 'palette' ? PALETTES.find((p) => p.name === value) : null;
                          return (
                            <div key={f.key}>
                              <p className="text-[12.5px] font-bold text-slate-400">{f.label}</p>
                              {palette ? (
                                <div className="mt-1.5 flex items-center gap-3">
                                  <span className="flex overflow-hidden rounded-lg border border-slate-200">
                                    {palette.colors.map((c) => (
                                      <span key={c} className="h-8 w-10" style={{ backgroundColor: c }} />
                                    ))}
                                  </span>
                                  <div>
                                    <p className="text-[14px] font-bold text-slate-800">{palette.name}</p>
                                    <p className="font-mono text-[11px] text-slate-400">{palette.colors.join('  ')}</p>
                                  </div>
                                </div>
                              ) : Array.isArray(value) ? (
                                <div className="mt-1.5 flex flex-wrap gap-1.5">
                                  {value.map((item) => (
                                    <span
                                      key={item}
                                      className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2.5 py-1 text-[13px] font-semibold text-sky-800"
                                    >
                                      <Check size={11} /> {item}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="mt-1 whitespace-pre-wrap text-[14.5px] leading-relaxed text-slate-800">
                                  {value}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}

                {/* Archivos */}
                {detail.files.length > 0 && (
                  <section>
                    <h3 className="mb-4 border-l-4 border-emerald-500 pl-3 text-[12px] font-black uppercase tracking-widest text-slate-800">
                      Material adjunto ({detail.files.length})
                    </h3>
                    <div className="space-y-6">
                      {FILE_CATEGORIES.filter((c) => filesByCategory[c.id]?.length).map((cat) => (
                        <div key={cat.id}>
                          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            {cat.label} · {filesByCategory[cat.id].length}
                          </p>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {filesByCategory[cat.id].map((f) => {
                              const Icon = fileIcon(f.mime_type);
                              const url = `/api/briefing-files/${f.id}/download?uid=${uid}`;
                              return (
                                <a
                                  key={f.id}
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition hover:border-sky-400 hover:shadow-md"
                                >
                                  {isImage(f.mime_type) ? (
                                    <img
                                      src={url}
                                      alt={f.file_name}
                                      loading="lazy"
                                      className="h-28 w-full bg-white object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-28 w-full items-center justify-center bg-white">
                                      <Icon size={30} className="text-slate-300 group-hover:text-sky-500" />
                                    </div>
                                  )}
                                  <div className="px-3 py-2">
                                    <p className="truncate text-[12px] font-bold text-slate-700">{f.file_name}</p>
                                    <p className="text-[10.5px] text-slate-400">{formatBytes(f.file_size)}</p>
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BriefingsAdmin;
