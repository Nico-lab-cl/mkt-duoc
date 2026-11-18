import { useState } from 'react';
import { CircleCheck, CircleAlert, Eye } from 'lucide-react';
import { MARCA, PRINCIPIOS } from './datos';

const TODO_ROTO = Object.fromEntries(PRINCIPIOS.map((p) => [p.id, false]));
const TODO_OK = Object.fromEntries(PRINCIPIOS.map((p) => [p.id, true]));

function Refri({ claro }) {
  return (
    <svg viewBox="0 0 60 90" className="w-16 h-24 shrink-0" aria-hidden="true">
      <rect x="4" y="2" width="52" height="86" rx="6" fill={claro ? '#e2e8f0' : '#cbd5e1'} />
      <line x1="4" y1="34" x2="56" y2="34" stroke="#94a3b8" strokeWidth="2" />
      <rect x="12" y="42" width="24" height="16" rx="2" fill="#2dd4bf" />
      <rect x="46" y="10" width="3" height="16" rx="1.5" fill="#64748b" />
      <rect x="46" y="44" width="3" height="24" rx="1.5" fill="#64748b" />
    </svg>
  );
}

/** Post de Instagram de la marca ficticia, armado según qué principios están aplicados. */
function Pieza({ p }) {
  const fondo = p.contraste ? 'bg-slate-900' : 'bg-amber-50';
  const titulo = !p.contraste ? 'text-amber-200' : p.marca ? 'text-white' : 'text-lime-300';
  const texto = p.contraste ? 'text-slate-300' : 'text-amber-200/90';
  const fuenteTitulo = p.marca ? 'font-sans' : 'font-serif italic';
  const fuenteSub = p.marca ? 'font-sans' : 'font-mono';
  const boton = !p.contraste
    ? 'bg-amber-100 text-amber-300'
    : p.marca
    ? 'bg-orange-500 text-white'
    : 'bg-fuchsia-500 text-white';
  const al = (x) => (p.alineacion ? 'self-start text-left' : x);

  return (
    <div
      className={`relative w-full max-w-[380px] aspect-square rounded-2xl overflow-hidden shadow-lg flex flex-col ${fondo} ${
        p.espacio ? 'p-7 gap-3' : 'p-2.5 gap-0.5'
      }`}
    >
      {p.marca ? (
        <p className={`${al('')} text-sm font-bold tracking-wide ${p.contraste ? 'text-teal-300' : 'text-amber-200'}`}>
          ● {MARCA}
        </p>
      ) : (
        <p className={`${al('self-end')} text-[10px] ${texto}`}>#domotica #smarthome #oferta</p>
      )}

      <h3
        className={`${al('self-center text-center')} ${fuenteTitulo} ${titulo} ${
          p.jerarquia ? 'text-[26px] leading-tight font-extrabold mt-1' : 'text-[13px] font-normal'
        }`}
      >
        Tu casa inteligente, sin complicaciones
      </h3>

      <p className={`${al('self-end text-right ml-10')} ${fuenteSub} ${texto} ${p.jerarquia ? 'text-sm' : 'text-[13px]'}`}>
        Controla tu horno y tu refri {MARCA} desde el celular. Se configura en 2 minutos.
      </p>

      {!p.espacio && (
        <p className={`${al('ml-6')} text-[11px] leading-tight ${texto}`}>
          Además ahorra energía, es compatible con asistentes de voz, tiene garantía extendida, despacho a todo Chile,
          cuotas sin interés y muchas funciones más que te van a encantar. ¡No te lo pierdas!
        </p>
      )}

      <div className={`flex items-end gap-3 ${p.espacio ? 'mt-auto' : ''} ${p.alineacion ? '' : 'flex-row-reverse'}`}>
        <Refri claro={!p.contraste} />
        <div className={`flex flex-col ${p.espacio ? 'gap-2' : 'gap-0.5'} ${p.alineacion ? 'items-start' : 'items-center'}`}>
          {p.cta ? (
            <span className={`${boton} rounded-full font-bold ${p.jerarquia ? 'px-4 py-2 text-sm' : 'px-2 py-1 text-[11px]'}`}>
              Descarga la guía gratis →
            </span>
          ) : (
            <>
              <span className={`${boton} rounded px-2 py-0.5 text-[11px]`}>Comprar</span>
              <span className={`${boton} rounded px-2 py-0.5 text-[11px]`}>Síguenos</span>
              <span className={`text-[10px] underline ${texto}`}>Más info aquí</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TallerDiseno() {
  const [p, setP] = useState(TODO_ROTO);
  const [verOriginal, setVerOriginal] = useState(false);
  const arreglados = PRINCIPIOS.filter((x) => p[x.id]).length;

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <p className="text-xs uppercase tracking-widest text-teal-700 font-semibold">IE1.2.2 · preparación</p>
        <h2 className="text-2xl font-bold mt-1">Taller: arregla este post</h2>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Este post de {MARCA} rompe 6 principios de diseño. Mira la pieza, encuentra qué falla y aplica cada principio
          para ver el cambio. Así vas a poder justificar tu propia pieza con argumentos, no con «quedó bonita».
        </p>

        <div className="mt-6 grid lg:grid-cols-[400px_1fr] gap-6 items-start">
          <div className="lg:sticky lg:top-4 flex flex-col items-center gap-3">
            <Pieza p={verOriginal ? TODO_ROTO : p} />
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onPointerDown={() => setVerOriginal(true)}
                onPointerUp={() => setVerOriginal(false)}
                onPointerLeave={() => setVerOriginal(false)}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-slate-300 hover:bg-slate-50 select-none"
              >
                <Eye className="w-3.5 h-3.5" /> Mantén apretado para ver el original
              </button>
              <button onClick={() => setP(TODO_ROTO)} className="text-xs px-3 py-1.5 rounded-full border border-slate-300 hover:bg-slate-50">
                Romper todo
              </button>
              <button onClick={() => setP(TODO_OK)} className="text-xs px-3 py-1.5 rounded-full bg-teal-600 text-white hover:bg-teal-700">
                Arreglar todo
              </button>
            </div>
            <p className="text-sm font-semibold">
              Arreglaste {arreglados} de {PRINCIPIOS.length}
            </p>
          </div>

          <div className="space-y-2">
            {PRINCIPIOS.map((x, i) => {
              const on = p[x.id];
              return (
                <div key={x.id} className={`rounded-xl border p-4 transition ${on ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200'}`}>
                  <button
                    onClick={() => setP((s) => ({ ...s, [x.id]: !s[x.id] }))}
                    aria-pressed={on}
                    className="w-full text-left flex items-start gap-3"
                  >
                    <span className={`mt-0.5 shrink-0 w-10 h-6 rounded-full relative transition ${on ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
                    </span>
                    <span className="flex-1">
                      <span className="font-semibold flex items-center gap-1.5">
                        {i + 1}. {x.nombre}
                        {on ? <CircleCheck className="w-4 h-4 text-emerald-600" /> : <CircleAlert className="w-4 h-4 text-orange-500" />}
                      </span>
                      <span className="block text-sm text-slate-600 mt-1">
                        {on ? (
                          <>
                            <b>Regla:</b> {x.regla}
                          </>
                        ) : (
                          <>
                            <b>Problema:</b> {x.problema}
                          </>
                        )}
                      </span>
                      {on && (
                        <span className="block text-xs text-emerald-800 mt-1">
                          Pregunta de control para tu pieza: {x.pregunta}
                        </span>
                      )}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
