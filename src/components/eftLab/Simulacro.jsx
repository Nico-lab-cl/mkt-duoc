import { useEffect, useState } from 'react';
import { CircleCheck, CircleX, Mic, Timer, RotateCcw } from 'lucide-react';
import { PREGUNTAS_GERENCIA, QUIZ } from './datos';

const SEGUNDOS = 45;

function PreguntaGerencia({ p, i }) {
  const [restante, setRestante] = useState(null);
  const [ver, setVer] = useState(false);

  useEffect(() => {
    if (restante === null || restante <= 0) return;
    const t = window.setTimeout(() => setRestante((r) => r - 1), 1000);
    return () => window.clearTimeout(t);
  }, [restante]);

  const corriendo = restante !== null && restante > 0;

  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <p className="font-medium">
        {i + 1}. «{p.q}»
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setRestante(SEGUNDOS);
            setVer(false);
          }}
          className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-700"
        >
          <Mic className="w-4 h-4" /> {restante === null ? 'Responder en voz alta' : 'Otra vez'}
        </button>
        {restante !== null && (
          <span
            className={`inline-flex items-center gap-1 text-sm font-mono px-2 py-1 rounded ${
              corriendo ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            <Timer className="w-4 h-4" /> {corriendo ? `${restante} s` : '¡Tiempo!'}
          </span>
        )}
        <button onClick={() => setVer((v) => !v)} className="text-sm text-teal-700 hover:underline">
          {ver ? 'Ocultar' : 'Ver qué no puede faltar'}
        </button>
      </div>
      {ver && (
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          {p.claves.map((c) => (
            <li key={c} className="pl-3 border-l-2 border-teal-400">
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Simulacro({ estado, set }) {
  const resp = estado.quiz;
  const respondidas = Object.keys(resp).length;
  const buenas = QUIZ.filter((q, i) => resp[i] === q.ok).length;

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-teal-700 font-semibold">Repaso</p>
            <h2 className="text-2xl font-bold mt-1">Simulacro del Eje 1</h2>
            <p className="text-slate-600 mt-2">{QUIZ.length} preguntas con explicación inmediata.</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              {buenas}/{QUIZ.length}
            </p>
            <p className="text-xs text-slate-500">{respondidas} respondidas</p>
            {respondidas > 0 && (
              <button onClick={() => set('quiz', {})} className="mt-1 inline-flex items-center gap-1 text-xs text-slate-600 hover:underline">
                <RotateCcw className="w-3.5 h-3.5" /> Reintentar
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {QUIZ.map((q, i) => {
            const r = resp[i];
            const contestada = r !== undefined;
            return (
              <div key={q.q} className="border border-slate-200 rounded-xl p-4">
                <p className="font-medium">
                  {i + 1}. {q.q}
                </p>
                <div className="mt-3 grid sm:grid-cols-2 gap-2">
                  {q.ops.map((op, j) => {
                    let cls = 'border-slate-300 hover:border-slate-500 bg-white';
                    if (contestada && j === q.ok) cls = 'border-emerald-500 bg-emerald-50 text-emerald-900';
                    else if (contestada && j === r) cls = 'border-rose-500 bg-rose-50 text-rose-900';
                    else if (contestada) cls = 'border-slate-200 text-slate-400 bg-white';
                    return (
                      <button
                        key={op}
                        disabled={contestada}
                        onClick={() => set('quiz', (x) => ({ ...x, [i]: j }))}
                        className={`text-left text-sm px-3 py-2 rounded-lg border ${cls}`}
                      >
                        {op}
                      </button>
                    );
                  })}
                </div>
                {contestada && (
                  <p className={`mt-3 text-sm flex gap-2 ${r === q.ok ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {r === q.ok ? <CircleCheck className="w-4 h-4 mt-0.5 shrink-0" /> : <CircleX className="w-4 h-4 mt-0.5 shrink-0" />}
                    <span>{q.exp}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <h2 className="text-xl font-bold">Ensayo del video: preguntas de la gerencia</h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          El video es un elevator pitch ante la gerencia y vale el 70 % del examen. Responde cada pregunta en voz alta en{' '}
          {SEGUNDOS} segundos, sin leer. Después revisa si dijiste lo que no puede faltar.
        </p>
        <div className="mt-4 space-y-3">
          {PREGUNTAS_GERENCIA.map((p, i) => (
            <PreguntaGerencia key={p.q} p={p} i={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
