import { useCallback, useEffect, useRef, useState } from 'react';
import { Timer, ChevronLeft, ChevronRight, CircleCheck, CircleX, Lock, RefreshCw, Flag, CloudOff } from 'lucide-react';
import { authFetch, EVAL_ID, fmtTiempo } from './api';

const LETRAS = ['A', 'B', 'C', 'D'];
const base = `/api/eval/${EVAL_ID}`;

export default function Evaluacion({ user, salir }) {
  const [info, setInfo] = useState(null);
  const [fase, setFase] = useState('cargando'); // cargando | intro | rindiendo | terminado | error
  const [error, setError] = useState('');
  const [examen, setExamen] = useState(null); // { preguntas, respuestas, finEn }
  const [resultado, setResultado] = useState(null);

  const manejarError = useCallback(
    (e) => {
      if (e.code === 'reauth') return salir();
      setError(e.message);
    },
    [salir]
  );

  const verResultado = useCallback(async () => {
    try {
      const d = await authFetch(user, `${base}/resultado`);
      setResultado(d);
      setFase('terminado');
    } catch (e) {
      manejarError(e);
      setFase('error');
    }
  }, [user, manejarError]);

  const entrar = useCallback(
    (d) => {
      if (d.intento?.estado === 'terminado') return verResultado();
      setExamen({ preguntas: d.preguntas, respuestas: d.respuestas || {}, finEn: Date.now() + d.intento.restante_seg * 1000 });
      setFase('rindiendo');
    },
    [verResultado]
  );

  const cargar = useCallback(async () => {
    setError('');
    try {
      const d = await authFetch(user, base);
      setInfo(d);
      if (!d.intento) return setFase('intro');
      if (d.intento.estado === 'terminado') return verResultado();
      entrar(await authFetch(user, `${base}/iniciar`, { method: 'POST' }));
    } catch (e) {
      manejarError(e);
      setFase('error');
    }
  }, [user, verResultado, entrar, manejarError]);

  useEffect(() => {
    // Carga inicial desde el servidor: el estado se actualiza al llegar la respuesta
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, [cargar]);

  const esProfe = user.role === 'admin';

  const comenzar = async (nuevo = false) => {
    const msg = esProfe
      ? nuevo
        ? '¿Empezar un intento nuevo? Se borra tu intento anterior de práctica.'
        : `Modo profesor: intento de práctica de ${info.minutos} minutos que no cuenta en los resultados. ¿Comenzar?`
      : `Tienes un solo intento y ${info.minutos} minutos desde que empieces. El tiempo corre aunque cierres la página. ¿Comenzar ahora?`;
    if (!window.confirm(msg)) return;
    try {
      entrar(await authFetch(user, `${base}/iniciar`, { method: 'POST', body: JSON.stringify({ nuevo }) }));
    } catch (e) {
      manejarError(e);
      if (e.status === 403) cargar();
    }
  };

  const terminar = async () => {
    try {
      await authFetch(user, `${base}/terminar`, { method: 'POST' });
    } catch (e) {
      manejarError(e);
    }
    verResultado();
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {error && <p className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-sm">{error}</p>}
      {fase === 'cargando' && <p className="text-slate-500">Cargando…</p>}
      {fase === 'error' && (
        <button onClick={cargar} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white">
          <RefreshCw className="w-4 h-4" /> Reintentar
        </button>
      )}
      {esProfe && fase !== 'cargando' && (
        <p className="mb-4 bg-sky-50 border border-sky-200 text-sky-900 rounded-xl p-3 text-sm">
          <b>Modo profesor:</b> puedes rendir las veces que quieras, aunque la evaluación esté cerrada. Tus intentos no
          aparecen en los resultados ni en la estadística del curso, y siempre ves la retroalimentación.
        </p>
      )}
      {fase === 'intro' && info && <Intro info={info} comenzar={() => comenzar(false)} recargar={cargar} esProfe={esProfe} />}
      {fase === 'rindiendo' && examen && <Rindiendo user={user} info={info} examen={examen} setExamen={setExamen} terminar={terminar} />}
      {fase === 'terminado' && resultado && (
        <Resultado info={info} resultado={resultado} recargar={verResultado} nuevoIntento={esProfe ? () => comenzar(true) : null} />
      )}
    </main>
  );
}

function Intro({ info, comenzar, recargar, esProfe }) {
  const abierta = info.config?.abierta || esProfe;
  return (
    <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm">
      <p className="text-xs uppercase tracking-widest text-teal-700 font-semibold">Evaluación</p>
      <h2 className="text-2xl font-bold mt-1">{info.titulo}</h2>
      <p className="text-slate-600 mt-2">
        Preguntas de casos y decisiones sobre la empresa Smart Home de la EFT. No basta con saber definiciones: tienes que
        elegir la mejor decisión en cada situación.
      </p>

      <div className="mt-5 grid sm:grid-cols-3 gap-3">
        {[
          [info.total, 'preguntas', 'Orden y alternativas al azar'],
          [info.minutos, 'minutos', 'El reloj corre aunque cierres la página'],
          ['1', 'intento', 'No se puede volver a rendir']
        ].map(([n, l, d]) => (
          <div key={l} className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-3xl font-bold">{n}</p>
            <p className="font-semibold">{l}</p>
            <p className="text-xs text-slate-500 mt-1">{d}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-6 font-semibold">Décimas para la nota</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {info.decimas.map((t) => (
          <span key={t.min} className="px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-sm">
            {t.min === 100 ? '100 %' : `${t.min} % o más`} → <b>{t.decimas} décima{t.decimas > 1 ? 's' : ''}</b>
          </span>
        ))}
      </div>

      <ul className="mt-5 text-sm text-slate-600 space-y-1 list-disc pl-5">
        <li>Cada respuesta se guarda al instante; puedes cambiarla mientras quede tiempo.</li>
        <li>Si se cae tu conexión o cierras la pestaña, vuelve a entrar: retomas donde quedaste, con el tiempo que te quede.</li>
        <li>Al acabarse el tiempo, la evaluación se cierra sola con lo que hayas respondido.</li>
        <li>El sistema registra si sales de la pestaña mientras rindes.</li>
      </ul>

      <div className="mt-6">
        {abierta ? (
          <button onClick={comenzar} className="px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700">
            Comenzar evaluación
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 text-slate-600">
              <Lock className="w-4 h-4" /> Tu profesor aún no abre la evaluación
            </span>
            <button onClick={recargar} className="inline-flex items-center gap-1.5 text-sm text-teal-700 hover:underline">
              <RefreshCw className="w-4 h-4" /> Revisar de nuevo
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Rindiendo({ user, info, examen, setExamen, terminar }) {
  const { preguntas, respuestas, finEn } = examen;
  const [idx, setIdx] = useState(0);
  const [restante, setRestante] = useState(() => (finEn - Date.now()) / 1000);
  const [estadoGuardado, setEstadoGuardado] = useState({}); // qid -> 'guardando' | 'error'
  const cerrando = useRef(false);

  const cerrar = useCallback(() => {
    if (cerrando.current) return;
    cerrando.current = true;
    terminar();
  }, [terminar]);

  useEffect(() => {
    const t = window.setInterval(() => {
      const r = (finEn - Date.now()) / 1000;
      setRestante(r);
      if (r <= 0) cerrar();
    }, 500);
    return () => window.clearInterval(t);
  }, [finEn, cerrar]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        authFetch(user, `/api/eval/${EVAL_ID}/salida`, { method: 'POST' }).catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [user]);

  const responder = async (qid, op) => {
    setExamen((x) => ({ ...x, respuestas: { ...x.respuestas, [qid]: op } }));
    setEstadoGuardado((s) => ({ ...s, [qid]: 'guardando' }));
    try {
      await authFetch(user, `/api/eval/${EVAL_ID}/respuesta`, { method: 'PUT', body: JSON.stringify({ qid, op }) });
      setEstadoGuardado((s) => {
        const n = { ...s };
        delete n[qid];
        return n;
      });
    } catch (e) {
      if (e.status === 409) return cerrar();
      setEstadoGuardado((s) => ({ ...s, [qid]: 'error' }));
    }
  };

  const p = preguntas[idx];
  const respondidas = preguntas.filter((x) => respuestas[x.id] !== undefined).length;
  const pendientesError = Object.values(estadoGuardado).filter((v) => v === 'error').length;
  const poco = restante < 300;

  const confirmarTermino = () => {
    const faltan = preguntas.length - respondidas;
    const msg = faltan
      ? `Te faltan ${faltan} pregunta${faltan > 1 ? 's' : ''} por responder. ¿Terminar igual? No podrás volver a rendir.`
      : '¿Terminar y enviar la evaluación? No podrás volver a rendir.';
    if (window.confirm(msg)) cerrar();
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 -mx-4 sm:mx-0 px-4 py-3 sm:rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shadow">
        <span className={`inline-flex items-center gap-2 font-mono text-lg ${poco ? 'text-amber-300' : ''}`}>
          <Timer className="w-5 h-5" /> {fmtTiempo(restante)}
        </span>
        <span className="text-sm text-slate-300">
          {respondidas} de {preguntas.length} respondidas
        </span>
        {pendientesError > 0 && (
          <span className="inline-flex items-center gap-1 text-sm text-rose-300">
            <CloudOff className="w-4 h-4" /> {pendientesError} sin guardar
          </span>
        )}
        <button onClick={confirmarTermino} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 font-semibold text-sm">
          <Flag className="w-4 h-4" /> Terminar
        </button>
      </div>

      <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex justify-between items-start gap-3">
          <p className="text-sm font-semibold text-teal-700">
            Pregunta {idx + 1} de {preguntas.length}
          </p>
          <span className="text-xs text-slate-500 text-right">{info.ejes?.[p.eje]}</span>
        </div>
        <p className="mt-3 text-lg leading-relaxed text-slate-900">{p.q}</p>

        <div className="mt-5 space-y-2">
          {p.ops.map((o, j) => {
            const sel = respuestas[p.id] === o.i;
            return (
              <button
                key={o.i}
                onClick={() => responder(p.id, o.i)}
                aria-pressed={sel}
                className={`w-full text-left flex gap-3 items-start rounded-xl border-2 p-3 sm:p-4 transition ${
                  sel ? 'border-teal-600 bg-teal-50' : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <span
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    sel ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {LETRAS[j]}
                </span>
                <span className="text-slate-800">{o.t}</span>
              </button>
            );
          })}
        </div>

        {estadoGuardado[p.id] === 'error' && (
          <p className="mt-3 text-sm text-rose-700 flex items-center gap-2">
            No se guardó esta respuesta.
            <button onClick={() => responder(p.id, respuestas[p.id])} className="underline font-semibold">
              Reintentar
            </button>
          </p>
        )}

        <div className="mt-6 flex justify-between gap-3">
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          {idx < preguntas.length - 1 ? (
            <button
              onClick={() => setIdx((i) => i + 1)}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={confirmarTermino} className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700">
              Terminar evaluación
            </button>
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-700 mb-2">Ir a la pregunta</p>
        <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5">
          {preguntas.map((x, i) => {
            const r = respuestas[x.id] !== undefined;
            const err = estadoGuardado[x.id] === 'error';
            return (
              <button
                key={x.id}
                onClick={() => setIdx(i)}
                className={`h-9 rounded-lg text-sm font-semibold ${
                  err ? 'bg-rose-500 text-white' : r ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                } ${i === idx ? 'ring-2 ring-offset-1 ring-slate-900' : ''}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Resultado({ info, resultado, recargar, nuevoIntento }) {
  const [soloMalas, setSoloMalas] = useState(false);
  const { intento, retro_publicada: retro, detalle } = resultado;
  const lista = (detalle || []).filter((p) => !soloMalas || p.tu !== p.ok);
  const nMalas = (detalle || []).filter((p) => p.tu !== p.ok).length;

  return (
    <div className="space-y-4">
      <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm text-center">
        <p className="text-xs uppercase tracking-widest text-teal-700 font-semibold">Evaluación terminada</p>
        <p className="text-5xl font-bold mt-2">
          {intento.puntaje}
          <span className="text-2xl text-slate-400">/{intento.total}</span>
        </p>
        <p className="text-slate-600 mt-1">{intento.porcentaje} % de logro</p>
        <p
          className={`inline-block mt-4 px-4 py-2 rounded-full font-semibold ${
            intento.decimas ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {intento.decimas ? `Ganaste ${intento.decimas} décima${intento.decimas > 1 ? 's' : ''} para la nota` : 'Esta vez no sumaste décimas'}
        </p>
        <p className="text-xs text-slate-500 mt-3">
          Décimas: {info?.decimas.map((t) => `${t.min === 100 ? '100 %' : `≥${t.min} %`} = ${t.decimas}`).join(' · ')}
        </p>
        {nuevoIntento && (
          <button
            onClick={nuevoIntento}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-700"
          >
            <RefreshCw className="w-4 h-4" /> Nuevo intento
          </button>
        )}
      </section>

      {!retro ? (
        <section className="bg-white rounded-2xl p-5 shadow-sm text-center text-slate-600">
          <p>
            Las respuestas correctas y sus justificaciones se publicarán cuando tu profesor cierre la evaluación para todo el
            curso.
          </p>
          <button onClick={recargar} className="mt-3 inline-flex items-center gap-1.5 text-sm text-teal-700 hover:underline">
            <RefreshCw className="w-4 h-4" /> Revisar si ya están publicadas
          </button>
        </section>
      ) : (
        <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h2 className="text-lg font-bold">Retroalimentación para tu defensa</h2>
            <label className="text-sm inline-flex items-center gap-2">
              <input type="checkbox" checked={soloMalas} onChange={(e) => setSoloMalas(e.target.checked)} />
              Ver solo las {nMalas} que fallé
            </label>
          </div>
          <div className="mt-4 space-y-4">
            {lista.map((p) => {
              const bien = p.tu === p.ok;
              return (
                <div key={p.id} className={`rounded-xl border p-4 ${bien ? 'border-emerald-200' : 'border-rose-200'}`}>
                  <div className="flex gap-2 items-start">
                    {bien ? <CircleCheck className="w-5 h-5 text-emerald-600 shrink-0" /> : <CircleX className="w-5 h-5 text-rose-600 shrink-0" />}
                    <div>
                      <p className="text-xs text-slate-500">{info?.ejes?.[p.eje]}</p>
                      <p className="font-medium mt-0.5">{p.q}</p>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {p.ops.map((o, j) => {
                      const esOk = o.i === p.ok;
                      const esTu = o.i === p.tu;
                      return (
                        <li
                          key={o.i}
                          className={`rounded-lg px-3 py-2 ${
                            esOk ? 'bg-emerald-50 text-emerald-900' : esTu ? 'bg-rose-50 text-rose-900' : 'text-slate-600'
                          }`}
                        >
                          <b>{LETRAS[j]}.</b> {o.t}
                          {esOk && <b> · correcta</b>}
                          {esTu && !esOk && <b> · tu respuesta</b>}
                        </li>
                      );
                    })}
                    {p.tu === null && <li className="text-rose-700 px-3">No respondiste esta pregunta.</li>}
                  </ul>
                  <p className="mt-3 text-sm text-slate-700 bg-slate-50 rounded-lg p-3">
                    <b>Por qué:</b> {p.exp}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
