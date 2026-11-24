import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw, Search, X, CircleCheck, CircleX, RotateCcw, Eye } from 'lucide-react';
import { authFetch, EVAL_ID } from './api';

const LETRAS = ['A', 'B', 'C', 'D'];
const base = `/api/admin/eval/${EVAL_ID}`;

const ESTADOS = {
  terminado: { label: 'Terminó', cls: 'bg-emerald-100 text-emerald-800' },
  en_curso: { label: 'Rindiendo', cls: 'bg-amber-100 text-amber-800' },
  sin: { label: 'Sin rendir', cls: 'bg-slate-100 text-slate-500' }
};

const estadoDe = (f) => f.intento?.estado || 'sin';
const minutosUsados = (i) =>
  i?.finished_at ? Math.max(0, Math.round((new Date(i.finished_at) - new Date(i.started_at)) / 60000)) : null;
const hora = (iso) => (iso ? new Date(iso).toLocaleString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—');
const csv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

function Interruptor({ on, onChange, titulo, texto, disabled }) {
  return (
    <button
      onClick={() => onChange(!on)}
      disabled={disabled}
      aria-pressed={on}
      className={`text-left flex gap-3 items-start rounded-xl border p-4 flex-1 min-w-[260px] ${on ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white'}`}
    >
      <span className={`mt-0.5 shrink-0 w-10 h-6 rounded-full relative transition ${on ? 'bg-teal-600' : 'bg-slate-300'}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
      </span>
      <span>
        <span className="block font-semibold">{titulo}</span>
        <span className="block text-xs text-slate-500 mt-0.5">{texto}</span>
      </span>
    </button>
  );
}

export default function RevisionEval({ user }) {
  const [vista, setVista] = useState('notas');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [filtro, setFiltro] = useState({ grupo: '', estado: '', q: '' });
  const [abierto, setAbierto] = useState(null);

  const cargar = useCallback(async () => {
    try {
      setData(await authFetch(user, base));
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }, [user]);

  useEffect(() => {
    // Carga inicial y refresco cada 30 s mientras el profesor mira el panel
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
    const t = window.setInterval(cargar, 30000);
    return () => window.clearInterval(t);
  }, [cargar]);

  const config = async (cambios) => {
    const msg =
      cambios.retro_publicada === true
        ? 'Al publicar la retroalimentación, quienes ya terminaron verán las respuestas correctas. Si alguien aún no rinde, podría conocerlas. ¿Publicar?'
        : cambios.abierta === false
        ? '¿Cerrar la evaluación? Nadie más podrá comenzar (quienes están rindiendo pueden terminar).'
        : null;
    if (msg && !window.confirm(msg)) return;
    setGuardando(true);
    try {
      const c = await authFetch(user, `${base}/config`, { method: 'PUT', body: JSON.stringify(cambios) });
      setData((d) => ({ ...d, config: c }));
    } catch (e) {
      setError(e.message);
    }
    setGuardando(false);
  };

  const reiniciar = async (f) => {
    if (!window.confirm(`¿Borrar el intento de ${f.full_name} para que pueda volver a rendir? Se pierde su puntaje actual.`)) return;
    try {
      await authFetch(user, `${base}/intento/${f.user_id}`, { method: 'DELETE' });
      cargar();
    } catch (e) {
      setError(e.message);
    }
  };

  const filas = useMemo(() => data?.filas || [], [data]);
  const grupos = useMemo(() => [...new Set(filas.map((f) => f.group_name || 'Sin grupo'))], [filas]);
  const visibles = filas.filter((f) => {
    if (filtro.grupo && (f.group_name || 'Sin grupo') !== filtro.grupo) return false;
    if (filtro.estado && estadoDe(f) !== filtro.estado) return false;
    const q = filtro.q.trim().toLowerCase();
    return !q || `${f.full_name} ${f.email}`.toLowerCase().includes(q);
  });
  const terminados = visibles.filter((f) => estadoDe(f) === 'terminado');
  const promedio = terminados.length
    ? Math.round((terminados.reduce((s, f) => s + f.intento.porcentaje, 0) / terminados.length) * 10) / 10
    : null;
  const porDecimas = [3, 2, 1, 0].map((d) => [d, terminados.filter((f) => f.intento.decimas === d).length]);

  const descargar = () => {
    const head = ['Nombre', 'Email', 'Grupo', 'Sede', 'Estado', 'Puntaje', 'Total', 'Porcentaje', 'Décimas', 'Inicio', 'Término', 'Minutos', 'Salidas de pestaña'];
    const lines = visibles.map((f) => {
      const i = f.intento;
      return [
        f.full_name, f.email, f.group_name || 'Sin grupo', f.campus, ESTADOS[estadoDe(f)].label,
        i?.puntaje ?? '', i?.total ?? '', i?.porcentaje ?? '', i?.decimas ?? '',
        i ? new Date(i.started_at).toLocaleString('es-CL') : '', i?.finished_at ? new Date(i.finished_at).toLocaleString('es-CL') : '',
        minutosUsados(i) ?? '', i ? f.salidas : ''
      ].map(csv).join(';');
    });
    const blob = new Blob(['﻿' + [head.map(csv).join(';'), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `evaluacion-${EVAL_ID}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const sel = 'rounded-lg border border-slate-300 p-2 text-sm bg-white';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      {error && <p className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-sm">{error}</p>}
      {!data && !error && <p className="text-slate-500">Cargando…</p>}

      {data && (
        <>
          <section className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap justify-between gap-2 items-baseline">
              <h2 className="text-lg font-bold">{data.titulo}</h2>
              <p className="text-sm text-slate-500">
                {data.total} preguntas · {data.minutos} min · 1 intento · enlace para estudiantes:{' '}
                <code className="bg-slate-100 px-1.5 py-0.5 rounded">/eft-lab/evaluacion</code>
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <Interruptor
                on={data.config.abierta}
                disabled={guardando}
                onChange={(v) => config({ abierta: v })}
                titulo={data.config.abierta ? 'Evaluación abierta' : 'Evaluación cerrada'}
                texto="Mientras esté abierta, los estudiantes pueden comenzar su intento."
              />
              <Interruptor
                on={data.config.retro_publicada}
                disabled={guardando}
                onChange={(v) => config({ retro_publicada: v })}
                titulo={data.config.retro_publicada ? 'Retroalimentación publicada' : 'Retroalimentación oculta'}
                texto="Publícala cuando todos hayan rendido: muestra respuestas correctas y justificaciones."
              />
            </div>
          </section>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              ['Terminaron', terminados.length, 'text-emerald-700'],
              ['Rindiendo ahora', visibles.filter((f) => estadoDe(f) === 'en_curso').length, 'text-amber-700'],
              ['Sin rendir', visibles.filter((f) => estadoDe(f) === 'sin').length, 'text-slate-500'],
              ['Promedio', promedio === null ? '—' : `${promedio} %`, 'text-slate-900']
            ].map(([l, n, c]) => (
              <div key={l} className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs text-slate-500">{l}</p>
                <p className={`text-2xl font-bold ${c}`}>{n}</p>
              </div>
            ))}
            <div className="bg-white rounded-xl p-4 shadow-sm col-span-2 md:col-span-1">
              <p className="text-xs text-slate-500">Estudiantes por décimas ganadas</p>
              <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                {porDecimas.map(([d, n]) => (
                  <span key={d} className={`px-2 py-1 rounded-full ${d ? 'bg-teal-50 text-teal-900' : 'bg-slate-100 text-slate-600'}`}>
                    {d} déc.: <b>{n}</b>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {[
              ['notas', 'Resultados'],
              ['banco', 'Banco de preguntas']
            ].map(([id, l]) => (
              <button
                key={id}
                onClick={() => setVista(id)}
                className={`px-3 py-1.5 rounded-lg text-sm ${vista === id ? 'bg-teal-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                {l}
              </button>
            ))}
          </div>

          {vista === 'notas' ? (
            <>
              <div className="bg-white rounded-xl p-3 shadow-sm flex flex-wrap gap-2 items-center">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                  <input className={`${sel} w-full pl-8`} placeholder="Buscar estudiante" value={filtro.q} onChange={(e) => setFiltro((f) => ({ ...f, q: e.target.value }))} />
                </div>
                <select className={sel} value={filtro.grupo} onChange={(e) => setFiltro((f) => ({ ...f, grupo: e.target.value }))}>
                  <option value="">Todos los grupos</option>
                  {grupos.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
                <select className={sel} value={filtro.estado} onChange={(e) => setFiltro((f) => ({ ...f, estado: e.target.value }))}>
                  <option value="">Todos los estados</option>
                  <option value="terminado">Terminó</option>
                  <option value="en_curso">Rindiendo</option>
                  <option value="sin">Sin rendir</option>
                </select>
                <button onClick={cargar} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-sm hover:bg-slate-50">
                  <RefreshCw className="w-4 h-4" /> Actualizar
                </button>
                <button onClick={descargar} disabled={!visibles.length} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 text-white text-sm hover:bg-teal-700 disabled:opacity-50">
                  <Download className="w-4 h-4" /> Excel (CSV)
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full min-w-[860px] text-sm">
                  <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                      <th className="p-3">Estudiante</th>
                      <th className="p-3">Grupo</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Puntaje</th>
                      <th className="p-3">Décimas</th>
                      <th className="p-3">Tiempo</th>
                      <th className="p-3" title="Veces que salió de la pestaña mientras rendía">Salidas</th>
                      <th className="p-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {visibles.map((f) => {
                      const i = f.intento;
                      const e = estadoDe(f);
                      return (
                        <tr key={f.user_id} className="border-t border-slate-100 align-top">
                          <td className="p-3">
                            <p className="font-semibold">{f.full_name || '—'}</p>
                            <p className="text-xs text-slate-500">{f.email}</p>
                          </td>
                          <td className="p-3">{f.group_name || 'Sin grupo'}</td>
                          <td className="p-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${ESTADOS[e].cls}`}>{ESTADOS[e].label}</span>
                            {i && <p className="text-xs text-slate-500 mt-1">{e === 'en_curso' ? `${i.respondidas}/${i.total} · inició ${hora(i.started_at)}` : hora(i.finished_at)}</p>}
                          </td>
                          <td className="p-3">{e === 'terminado' ? <b>{i.puntaje}/{i.total} · {i.porcentaje} %</b> : '—'}</td>
                          <td className="p-3">{e === 'terminado' ? <b className={i.decimas ? 'text-teal-700' : 'text-slate-400'}>{i.decimas}</b> : '—'}</td>
                          <td className="p-3">{minutosUsados(i) !== null ? `${minutosUsados(i)} min` : '—'}</td>
                          <td className="p-3">{i ? <span className={f.salidas > 3 ? 'text-rose-700 font-semibold' : ''}>{f.salidas}</span> : '—'}</td>
                          <td className="p-3 whitespace-nowrap">
                            {i && (
                              <>
                                <button onClick={() => setAbierto(f)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs hover:bg-slate-700">
                                  <Eye className="w-3.5 h-3.5" /> Ver
                                </button>
                                <button onClick={() => reiniciar(f)} title="Permitir que vuelva a rendir" className="ml-1 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs hover:bg-slate-50">
                                  <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {visibles.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-6 text-slate-500">No hay estudiantes con esos filtros.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <Banco user={user} ejes={data.ejes} />
          )}
        </>
      )}

      {abierto && <DetalleIntento user={user} fila={abierto} ejes={data?.ejes} cerrar={() => setAbierto(null)} />}
    </main>
  );
}

function Banco({ user, ejes }) {
  const [banco, setBanco] = useState(null);
  const [orden, setOrden] = useState('original');
  const [eje, setEje] = useState('');
  // Respuestas ocultas por defecto, para poder proyectar el banco y revelarlas en clase
  const [reveladas, setReveladas] = useState(() => new Set());
  const [proyectar, setProyectar] = useState(false);

  useEffect(() => {
    authFetch(user, `${base}/banco`).then(setBanco).catch(() => setBanco({ error: true }));
  }, [user]);

  if (!banco) return <p className="text-slate-500">Cargando banco…</p>;
  if (banco.error) return <p className="text-rose-700">No se pudo cargar el banco.</p>;

  let lista = banco.preguntas.filter((p) => !eje || String(p.eje) === eje);
  if (orden === 'dificiles') lista = [...lista].sort((a, b) => (a.acierto ?? 101) - (b.acierto ?? 101));

  const alternar = (id) =>
    setReveladas((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const todas = (mostrar) => setReveladas(mostrar ? new Set(lista.map((p) => p.id)) : new Set());

  return (
    <section className="space-y-3">
      <div className="bg-white rounded-xl p-3 shadow-sm flex flex-wrap gap-2 items-center text-sm">
        <span className="text-slate-600">{banco.intentos} intentos terminados</span>
        <button onClick={() => todas(true)} className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">
          Mostrar todas las respuestas
        </button>
        <button onClick={() => todas(false)} className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">
          Ocultar todas
        </button>
        <label className="inline-flex items-center gap-2 px-2">
          <input type="checkbox" checked={proyectar} onChange={(e) => setProyectar(e.target.checked)} />
          Modo proyección (letra grande, sin estadísticas)
        </label>
        <select className="rounded-lg border border-slate-300 p-2 bg-white" value={eje} onChange={(e) => setEje(e.target.value)}>
          <option value="">Todos los ejes</option>
          {Object.entries(ejes || {}).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select className="rounded-lg border border-slate-300 p-2 bg-white" value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="original">Orden del banco</option>
          <option value="dificiles">Más falladas primero</option>
        </select>
      </div>
      {lista.map((p, n) => {
        const ver = reveladas.has(p.id);
        return (
          <div key={p.id} className={`bg-white rounded-xl shadow-sm ${proyectar ? 'p-6 sm:p-8' : 'p-4'}`}>
            <div className={`flex flex-wrap justify-between gap-2 text-slate-500 ${proyectar ? 'text-sm' : 'text-xs'}`}>
              <span>{proyectar ? `Pregunta ${n + 1} · ${ejes?.[p.eje]}` : `${p.id} · ${ejes?.[p.eje]}`}</span>
              {!proyectar && ver && (
                <span className={p.acierto === null ? '' : p.acierto < 40 ? 'text-rose-700 font-semibold' : p.acierto < 70 ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                  {p.acierto === null ? 'Sin respuestas aún' : `${p.acierto} % de acierto (${p.respondidas} respuestas)`}
                </span>
              )}
            </div>
            <p className={`mt-2 font-medium ${proyectar ? 'text-2xl leading-snug' : ''}`}>{p.q}</p>
            <ul className={`mt-3 space-y-1.5 ${proyectar ? 'text-lg' : 'text-sm'}`}>
              {p.ops.map((o, j) => {
                const correcta = ver && j === p.ok;
                return (
                  <li
                    key={j}
                    className={`rounded-lg px-3 py-2 flex justify-between gap-3 transition ${
                      correcta ? 'bg-emerald-100 text-emerald-900 ring-2 ring-emerald-500' : ver ? 'text-slate-400' : 'text-slate-700 bg-slate-50'
                    }`}
                  >
                    <span>
                      <b>{LETRAS[j]}.</b> {o}
                      {correcta && <b> · correcta</b>}
                    </span>
                    {!proyectar && ver && p.respondidas > 0 && <span className="shrink-0 text-xs text-slate-500">{p.elegidas[j]}</span>}
                  </li>
                );
              })}
            </ul>
            {ver && <p className={`mt-3 text-slate-700 bg-emerald-50 rounded-lg p-3 ${proyectar ? 'text-lg' : 'text-sm'}`}>{p.exp}</p>}
            <button
              onClick={() => alternar(p.id)}
              className={`mt-3 inline-flex items-center gap-2 rounded-lg font-semibold ${proyectar ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm'} ${
                ver ? 'border border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              <Eye className="w-4 h-4" /> {ver ? 'Ocultar respuesta' : 'Mostrar respuesta'}
            </button>
          </div>
        );
      })}
    </section>
  );
}

function DetalleIntento({ user, fila, ejes, cerrar }) {
  const [d, setD] = useState(null);
  useEffect(() => {
    authFetch(user, `${base}/intento/${fila.user_id}`).then(setD).catch(() => setD({ error: true }));
  }, [user, fila.user_id]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 overflow-y-auto" onClick={cerrar}>
      <div className="max-w-4xl mx-auto my-6 px-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-slate-900 text-white rounded-t-2xl p-4 flex justify-between items-start gap-3">
          <div>
            <p className="text-lg font-bold">{fila.full_name}</p>
            <p className="text-sm text-slate-300">
              {fila.email} · {fila.group_name || 'Sin grupo'}
            </p>
            {d?.intento && (
              <p className="text-sm mt-1">
                {d.intento.estado === 'terminado'
                  ? `${d.intento.puntaje}/${d.intento.total} · ${d.intento.porcentaje} % · ${d.intento.decimas} décimas`
                  : `Rindiendo: ${d.intento.respondidas}/${d.intento.total} respondidas`}{' '}
                · salió de la pestaña {d.salidas} veces
              </p>
            )}
          </div>
          <button onClick={cerrar} aria-label="Cerrar" className="p-2 rounded-lg bg-white/10 hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="bg-slate-100 rounded-b-2xl p-4 space-y-3">
          {!d && <p className="text-slate-500">Cargando…</p>}
          {d?.error && <p className="text-rose-700">No se pudo cargar el intento.</p>}
          {d?.detalle?.map((p, n) => {
            const bien = p.tu === p.ok;
            return (
              <div key={p.id} className="bg-white rounded-xl p-3 text-sm">
                <div className="flex gap-2">
                  {bien ? <CircleCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <CircleX className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                  <p>
                    <span className="text-slate-400">
                      {n + 1}. {ejes?.[p.eje]} ·{' '}
                    </span>
                    {p.q}
                  </p>
                </div>
                <p className="mt-1.5 pl-6 text-slate-600">
                  Respondió:{' '}
                  {p.tu === null ? <i>sin respuesta</i> : <b className={bien ? 'text-emerald-700' : 'text-rose-700'}>{p.ops.find((o) => o.i === p.tu)?.t}</b>}
                </p>
                {!bien && (
                  <p className="pl-6 text-slate-600">
                    Correcta: <b className="text-emerald-700">{p.ops.find((o) => o.i === p.ok)?.t}</b>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
