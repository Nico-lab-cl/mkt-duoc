import { useEffect, useMemo, useState } from 'react';
import { CircleCheck, CircleAlert, CircleX, Download, RefreshCw, Search, X, Image as ImageIcon } from 'lucide-react';
import { ESCALA, ETAPAS, PRINCIPIOS, etapaById, evaluarFormato, formatoById, resumenEntrega } from './datos';
import Entregable from './Entregable';

const LAB = 'eje1';

const fecha = (iso) =>
  iso ? new Date(iso).toLocaleString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

const estadoDe = (row) => (row.submitted_at ? 'enviado' : row.data ? 'progreso' : 'sin');

const BADGE = {
  enviado: { label: 'Enviado', cls: 'bg-emerald-100 text-emerald-800' },
  progreso: { label: 'En progreso', cls: 'bg-amber-100 text-amber-800' },
  sin: { label: 'Sin empezar', cls: 'bg-slate-100 text-slate-500' }
};

const ICONO = {
  ok: <CircleCheck className="w-4 h-4 text-emerald-600 shrink-0" />,
  parcial: <CircleAlert className="w-4 h-4 text-amber-500 shrink-0" />,
  mal: <CircleX className="w-4 h-4 text-rose-600 shrink-0" />
};

const csv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export default function Revision({ user }) {
  const [filas, setFilas] = useState(null);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState({ grupo: '', sede: '', estado: '', q: '' });
  const [abierto, setAbierto] = useState(null);
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let vivo = true;
    fetch(`/api/admin/eft-lab/${LAB}`, { headers: { 'x-user-id': String(user.id) } })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'No se pudieron cargar las entregas');
        return d;
      })
      .then((d) => {
        if (!vivo) return;
        setError('');
        setFilas(d.map((row) => ({ ...row, estado: estadoDe(row), r: row.data ? resumenEntrega(row.data) : null })));
      })
      .catch((e) => vivo && setError(e.message));
    return () => {
      vivo = false;
    };
  }, [user.id, recarga]);

  const grupos = useMemo(() => [...new Set((filas || []).map((f) => f.group_name || 'Sin grupo'))], [filas]);
  const sedes = useMemo(() => [...new Set((filas || []).map((f) => f.campus).filter(Boolean))], [filas]);

  const visibles = (filas || []).filter((f) => {
    if (filtro.grupo && (f.group_name || 'Sin grupo') !== filtro.grupo) return false;
    if (filtro.sede && f.campus !== filtro.sede) return false;
    if (filtro.estado && f.estado !== filtro.estado) return false;
    const q = filtro.q.trim().toLowerCase();
    if (q && !`${f.full_name} ${f.email}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const cuenta = (e) => visibles.filter((f) => f.estado === e).length;

  const descargar = () => {
    const head = ['Nombre', 'Email', 'Grupo', 'Sede', 'Estado', 'Enviado', 'Actualizado', 'Flywheel bien', 'Flywheel aceptable', 'Flywheel mal', 'Flywheel ubicados', 'IE1.1.2', 'IE1.1.1', 'IE1.2.1', 'IE1.2.2', 'Simulacro', 'Pieza'];
    const lines = visibles.map((f) => {
      const r = f.r;
      return [
        f.full_name, f.email, f.group_name || 'Sin grupo', f.campus, BADGE[f.estado].label,
        f.submitted_at ? new Date(f.submitted_at).toLocaleString('es-CL') : '',
        f.updated_at ? new Date(f.updated_at).toLocaleString('es-CL') : '',
        r?.flywheel.ok ?? '', r?.flywheel.parcial ?? '', r?.flywheel.mal ?? '', r?.flywheel.total ?? '',
        ...(r ? r.checks.map((c) => (c.ok ? 'Sí' : 'No')) : ['', '', '', '']),
        r ? `${r.quiz.buenas}/${r.quiz.total}` : '', f.has_image ? 'Sí' : 'No'
      ].map(csv).join(';');
    });
    const blob = new Blob(['﻿' + [head.map(csv).join(';'), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `eft-lab-eje1-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const sel = 'rounded-lg border border-slate-300 p-2 text-sm bg-white';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Estudiantes', visibles.length, 'text-slate-900'],
          ['Enviados', cuenta('enviado'), 'text-emerald-700'],
          ['En progreso', cuenta('progreso'), 'text-amber-700'],
          ['Sin empezar', cuenta('sin'), 'text-slate-500']
        ].map(([l, n, c]) => (
          <div key={l} className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">{l}</p>
            <p className={`text-3xl font-bold ${c}`}>{filas ? n : '…'}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-3 shadow-sm flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            className={`${sel} w-full pl-8`}
            placeholder="Buscar estudiante o correo"
            value={filtro.q}
            onChange={(e) => setFiltro((f) => ({ ...f, q: e.target.value }))}
          />
        </div>
        <select className={sel} value={filtro.grupo} onChange={(e) => setFiltro((f) => ({ ...f, grupo: e.target.value }))}>
          <option value="">Todos los grupos</option>
          {grupos.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <select className={sel} value={filtro.sede} onChange={(e) => setFiltro((f) => ({ ...f, sede: e.target.value }))}>
          <option value="">Todas las sedes</option>
          {sedes.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select className={sel} value={filtro.estado} onChange={(e) => setFiltro((f) => ({ ...f, estado: e.target.value }))}>
          <option value="">Todos los estados</option>
          <option value="enviado">Enviado</option>
          <option value="progreso">En progreso</option>
          <option value="sin">Sin empezar</option>
        </select>
        <button onClick={() => setRecarga((x) => x + 1)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-sm hover:bg-slate-50">
          <RefreshCw className="w-4 h-4" /> Actualizar
        </button>
        <button onClick={descargar} disabled={!visibles.length} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 text-white text-sm hover:bg-teal-700 disabled:opacity-50">
          <Download className="w-4 h-4" /> Excel (CSV)
        </button>
      </div>

      {error && <p className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="p-3">Estudiante</th>
              <th className="p-3">Grupo</th>
              <th className="p-3" title="Primer y único intento">Flywheel (intento único)</th>
              <th className="p-3">Indicadores Eje 1</th>
              <th className="p-3">Simulacro</th>
              <th className="p-3">Pieza</th>
              <th className="p-3">Estado</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {filas === null && !error && (
              <tr>
                <td colSpan={8} className="p-6 text-slate-500">Cargando…</td>
              </tr>
            )}
            {visibles.map((f) => (
              <tr key={f.user_id} className="border-t border-slate-100 hover:bg-slate-50 align-top">
                <td className="p-3">
                  <p className="font-semibold">{f.full_name || '—'}</p>
                  <p className="text-xs text-slate-500">{f.email}</p>
                </td>
                <td className="p-3">
                  <p>{f.group_name || 'Sin grupo'}</p>
                  <p className="text-xs text-slate-500">{f.campus}</p>
                </td>
                <td className="p-3">
                  {f.r && f.r.flywheel.total > 0 ? (
                    <span className="inline-flex gap-2 items-center">
                      <span className="inline-flex items-center gap-0.5">{ICONO.ok}{f.r.flywheel.ok}</span>
                      <span className="inline-flex items-center gap-0.5">{ICONO.parcial}{f.r.flywheel.parcial}</span>
                      <span className="inline-flex items-center gap-0.5">{ICONO.mal}{f.r.flywheel.mal}</span>
                      <span className="text-xs text-slate-500">de {f.r.flywheel.total}</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="p-3">
                  {f.r ? (
                    <span className="flex gap-1">
                      {f.r.checks.map((c) => (
                        <span
                          key={c.id}
                          title={`${c.id}: ${c.texto}`}
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${c.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}
                        >
                          {c.id.replace('IE', '')}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="p-3">{f.r && f.r.quiz.respondidas ? `${f.r.quiz.buenas}/${f.r.quiz.total}` : '—'}</td>
                <td className="p-3">{f.has_image ? <ImageIcon className="w-4 h-4 text-teal-700" /> : <span className="text-slate-400">—</span>}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${BADGE[f.estado].cls}`}>{BADGE[f.estado].label}</span>
                  <p className="text-xs text-slate-500 mt-1">{fecha(f.submitted_at || f.updated_at)}</p>
                </td>
                <td className="p-3">
                  {f.data && (
                    <button onClick={() => setAbierto(f)} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs hover:bg-slate-700">
                      Revisar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filas && visibles.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-slate-500">No hay estudiantes con esos filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {abierto && <Detalle fila={abierto} admin={user} cerrar={() => setAbierto(null)} />}
    </main>
  );
}

function Detalle({ fila, admin, cerrar }) {
  const d = fila.data;
  const imagen = fila.has_image ? `/api/eft-lab/${LAB}/imagen/${fila.user_id}?uid=${admin.id}` : null;
  const respuestas = Object.entries(d.clasif || {}).filter(([fid]) => formatoById(fid));

  useEffect(() => {
    const k = (e) => e.key === 'Escape' && cerrar();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [cerrar]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 overflow-y-auto" onClick={cerrar}>
      <div className="max-w-5xl mx-auto my-6 px-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-slate-900 text-white rounded-t-2xl p-4 flex justify-between items-start gap-3">
          <div>
            <p className="text-lg font-bold">{fila.full_name}</p>
            <p className="text-sm text-slate-300">
              {fila.email} · {fila.group_name || 'Sin grupo'} {fila.campus ? `· ${fila.campus}` : ''}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {fila.submitted_at ? `Enviado ${fecha(fila.submitted_at)}` : 'No enviado'} · Última edición {fecha(fila.updated_at)}
            </p>
          </div>
          <button onClick={cerrar} aria-label="Cerrar" className="p-2 rounded-lg bg-white/10 hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-100 rounded-b-2xl p-4 sm:p-6 space-y-6">
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
            <h3 className="text-lg font-bold">Flywheel: respuestas del intento único</h3>
            {respuestas.length === 0 ? (
              <p className="text-sm text-slate-500 mt-2">No ubicó formatos.</p>
            ) : (
              <div className="mt-3 grid sm:grid-cols-2 gap-2">
                {respuestas.map(([fid, et]) => {
                  const f = formatoById(fid);
                  const r = evaluarFormato(fid, et);
                  return (
                    <div key={fid} className="flex items-start gap-2 text-sm border border-slate-200 rounded-lg p-2">
                      {ICONO[r]}
                      <span>
                        <b>{f.nombre}</b> → {etapaById(et)?.nombre}
                        {r !== 'ok' && (
                          <span className="block text-xs text-slate-500">Esperado: {ETAPAS.find((x) => x.id === f.etapa).nombre}</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
            <h3 className="text-lg font-bold">Autoevaluación de la pieza</h3>
            <div className="mt-3 space-y-2">
              {PRINCIPIOS.map((p) => {
                const a = d.autoeval?.[p.id];
                const nivel = ESCALA.find((n) => n.id === a?.nivel);
                return (
                  <div key={p.id} className="text-sm grid sm:grid-cols-[180px_1fr] gap-1 border-t border-slate-100 pt-2">
                    <span className="font-semibold">
                      {p.nombre}
                      {nivel && <span className={`ml-2 text-[10px] text-white px-1.5 py-0.5 rounded ${nivel.color}`}>{nivel.id} %</span>}
                    </span>
                    <span className={a?.evidencia ? '' : 'text-slate-400'}>{a?.evidencia || 'Sin evidencia'}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <Entregable estado={{ persona: 'carolina', ...d }} imagen={imagen} soloLectura />
        </div>
      </div>
    </div>
  );
}
