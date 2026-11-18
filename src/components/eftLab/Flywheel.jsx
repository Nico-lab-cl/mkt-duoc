import { useState } from 'react';
import { CircleCheck, CircleAlert, CircleX, Lightbulb, X } from 'lucide-react';
import { ETAPAS, FORMATOS, evaluarFormato, formatoById, personaById } from './datos';

const COLOR = {
  sky: { head: 'bg-sky-600', ring: 'ring-sky-400', soft: 'bg-sky-50 border-sky-200' },
  amber: { head: 'bg-amber-500', ring: 'ring-amber-400', soft: 'bg-amber-50 border-amber-200' },
  emerald: { head: 'bg-emerald-600', ring: 'ring-emerald-400', soft: 'bg-emerald-50 border-emerald-200' },
  rose: { head: 'bg-rose-600', ring: 'ring-rose-400', soft: 'bg-rose-50 border-rose-200' }
};

const ICONO = {
  ok: <CircleCheck className="w-4 h-4 text-emerald-600 shrink-0" />,
  parcial: <CircleAlert className="w-4 h-4 text-amber-500 shrink-0" />,
  mal: <CircleX className="w-4 h-4 text-rose-600 shrink-0" />
};

export default function Flywheel({ estado, set }) {
  const [elegido, setElegido] = useState(null);
  const [abierto, setAbierto] = useState(null);
  const persona = personaById(estado.persona);
  const clasif = estado.clasif;

  const pendientes = FORMATOS.filter((f) => !clasif[f.id]);
  const colocados = Object.entries(clasif);
  const buenos = colocados.filter(([fid, et]) => et !== 'no' && evaluarFormato(fid, et) !== 'mal');
  const etapasCubiertas = new Set(buenos.map(([, et]) => et));
  const correctosNo = colocados.filter(([fid, et]) => et === 'no' && evaluarFormato(fid, et) === 'ok').length;
  const cumple = buenos.length >= 5 && etapasCubiertas.size === 3;

  const colocar = (etapaId) => {
    if (!elegido) return;
    set('clasif', (c) => ({ ...c, [elegido]: etapaId }));
    setAbierto(elegido);
    setElegido(null);
  };

  const quitar = (fid) => {
    set('clasif', (c) => {
      const n = { ...c };
      delete n[fid];
      return n;
    });
    if (abierto === fid) setAbierto(null);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap gap-4 justify-between items-start">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-teal-700 font-semibold">IE1.1.2 · IE1.1.1</p>
            <h2 className="text-2xl font-bold mt-1">Clasifica los contenidos en el Flywheel</h2>
            <p className="text-slate-600 mt-2">
              Toca un formato y después la etapa donde lo usarías con{' '}
              <b>
                {persona.emoji} {persona.nombre}
              </b>
              . Ojo: hay contenidos que <b>no son Inbound</b>.
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Su objeción: <i>{persona.objecion}</i>
            </p>
          </div>
          <div
            className={`rounded-xl px-4 py-3 text-sm min-w-[220px] ${
              cumple ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <p className="font-semibold">{cumple ? '¡Cumples el mínimo del IE1.1.2!' : 'Meta del informe'}</p>
            <p className="mt-1">
              {buenos.length} de 5 formatos Inbound bien ubicados
              <br />
              {etapasCubiertas.size} de 3 etapas cubiertas
              {correctosNo > 0 && (
                <>
                  <br />
                  {correctosNo} trampa{correctosNo > 1 ? 's' : ''} detectada{correctosNo > 1 ? 's' : ''}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Formatos pendientes */}
        <div className="mt-5">
          <p className="text-sm font-semibold text-slate-700">
            Formatos por ubicar ({pendientes.length})
            {elegido && <span className="text-teal-700 font-normal"> · ahora toca una etapa ↓</span>}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {pendientes.map((f) => (
              <button
                key={f.id}
                onClick={() => setElegido(elegido === f.id ? null : f.id)}
                aria-pressed={elegido === f.id}
                className={`px-3 py-2 rounded-lg text-sm border transition ${
                  elegido === f.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-300 hover:border-slate-500'
                }`}
              >
                {f.nombre}
              </button>
            ))}
            {pendientes.length === 0 && (
              <p className="text-sm text-slate-500">Ubicaste todos. Revisa las explicaciones y completa tus ejemplos abajo.</p>
            )}
          </div>
        </div>

        {/* Etapas */}
        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ETAPAS.map((et) => {
            const c = COLOR[et.color];
            const items = colocados.filter(([, e]) => e === et.id);
            return (
              <div
                key={et.id}
                className={`rounded-xl border ${c.soft} flex flex-col ${elegido ? `ring-2 ${c.ring} cursor-pointer` : ''}`}
                onClick={() => colocar(et.id)}
                role={elegido ? 'button' : undefined}
                tabIndex={elegido ? 0 : undefined}
                onKeyDown={(e) => e.key === 'Enter' && colocar(et.id)}
              >
                <div className={`${c.head} text-white rounded-t-xl px-3 py-2`}>
                  <p className="font-bold">{et.nombre}</p>
                  <p className="text-xs opacity-90">{et.meta}</p>
                </div>
                <div className="p-2 space-y-2 min-h-[110px]">
                  {items.length === 0 && <p className="text-xs text-slate-500 p-2">{et.ejemplo}</p>}
                  {items.map(([fid]) => {
                    const f = formatoById(fid);
                    const r = evaluarFormato(fid, et.id);
                    const ver = abierto === fid;
                    return (
                      <div key={fid} className="bg-white rounded-lg border border-slate-200 p-2 text-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start gap-1.5">
                          {ICONO[r]}
                          <button className="flex-1 text-left font-medium" onClick={() => setAbierto(ver ? null : fid)}>
                            {f.nombre}
                          </button>
                          <button onClick={() => quitar(fid)} aria-label={`Quitar ${f.nombre}`} className="text-slate-400 hover:text-slate-700">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {ver && (
                          <div className="mt-2 text-xs text-slate-600 space-y-1">
                            {r === 'mal' && (
                              <p className="font-semibold text-rose-700">
                                Mejor en: {ETAPAS.find((x) => x.id === f.etapa).nombre}
                              </p>
                            )}
                            {r === 'parcial' && <p className="font-semibold text-amber-700">Aceptable, con matiz:</p>}
                            <p>{f.porque}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1">{ICONO.ok} Bien</span>
          <span className="inline-flex items-center gap-1">{ICONO.parcial} Aceptable si lo justificas</span>
          <span className="inline-flex items-center gap-1">{ICONO.mal} Revisa (toca el formato para ver por qué)</span>
        </p>
      </section>

      {/* Ejemplos para el informe */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold">Tu tabla para el informe: un ejemplo real por formato</h2>
        <p className="text-sm text-slate-600 mt-1">
          El IE1.1.1 pide <b>ejemplos reales</b>. Escribe para cada formato bien ubicado un tema concreto para{' '}
          {persona.nombre.split(',')[0]}: título, canal y qué objeción responde.
        </p>
        {buenos.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Primero ubica formatos en Atraer, Interactuar o Deleitar.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {ETAPAS.filter((e) => e.id !== 'no').map((et) =>
              buenos
                .filter(([, e]) => e === et.id)
                .map(([fid]) => {
                  const f = formatoById(fid);
                  const val = estado.ejemplos[fid] || '';
                  return (
                    <div key={fid} className="grid md:grid-cols-[200px_1fr] gap-2 items-start">
                      <div>
                        <p className="font-semibold text-sm">{f.nombre}</p>
                        <p className="text-xs text-slate-500">{et.nombre}</p>
                      </div>
                      <div>
                        <textarea
                          value={val}
                          onChange={(e) => set('ejemplos', (x) => ({ ...x, [fid]: e.target.value }))}
                          rows={2}
                          placeholder={`Ej.: ${f.ejemplo}`}
                          className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        {!val && (
                          <button
                            onClick={() => set('ejemplos', (x) => ({ ...x, [fid]: f.ejemplo }))}
                            className="mt-1 inline-flex items-center gap-1 text-xs text-teal-700 hover:underline"
                          >
                            <Lightbulb className="w-3.5 h-3.5" /> Partir del ejemplo sugerido y adaptarlo
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}
      </section>
    </div>
  );
}
