import { CircleAlert, Target, Users } from 'lucide-react';
import { CASO, EXAMEN, INDICADORES, MARCA, PERSONAS } from './datos';

export default function Caso({ estado, set, irA }) {
  const totalEje = INDICADORES.reduce((s, i) => s + i.peso, 0);

  return (
    <div className="space-y-6">
      <section className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-teal-700 font-semibold">El caso del examen</p>
          <h2 className="text-2xl font-bold mt-1">{MARCA}: la casa inteligente llega a Chile</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">{CASO.contexto}</p>
          <h3 className="mt-5 font-semibold flex items-center gap-2">
            <CircleAlert className="w-4 h-4 text-rose-600" /> El problema: el público…
          </h3>
          <ul className="mt-2 space-y-1.5">
            {CASO.problema.map((p) => (
              <li key={p} className="text-slate-700 pl-4 border-l-2 border-rose-200">
                {p}
              </li>
            ))}
          </ul>
          <h3 className="mt-5 font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-teal-600" /> Tu desafío
          </h3>
          <p className="mt-2 text-slate-700">{CASO.desafio}</p>
          <p className="mt-4 text-xs text-slate-500">
            La pauta oficial habla de «la empresa líder en electrodomésticos» sin darle nombre. En este laboratorio la
            llamamos {MARCA}; en tu informe puedes usar el nombre que acuerde tu grupo.
          </p>
        </div>

        <div className="lg:col-span-2 bg-slate-900 text-white rounded-2xl p-5 sm:p-6">
          <p className="text-xs uppercase tracking-widest text-teal-300 font-semibold">Cómo se evalúa</p>
          <p className="text-3xl font-bold mt-1">{EXAMEN.ponderacion}</p>
          <div className="mt-4 space-y-3">
            {EXAMEN.partes.map((p) => (
              <div key={p.nombre} className="bg-white/10 rounded-xl p-3">
                <div className="flex justify-between gap-2 font-semibold">
                  <span>{p.nombre}</span>
                  <span className="text-teal-300">{p.peso}</span>
                </div>
                <p className="text-sm text-slate-300 mt-1">{p.detalle}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-300 mt-4">
            El examen tiene 3 ejes. Este laboratorio cubre el <b className="text-white">Eje 1</b>: {totalEje} % del
            examen, repartido en 4 indicadores.
          </p>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold">Lo que te van a evaluar en el Eje 1</h2>
        <p className="text-sm text-slate-500 mt-1">Cada indicador tiene una estación del laboratorio para practicarlo.</p>
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          {INDICADORES.map((ind) => (
            <div key={ind.id} className="border border-slate-200 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold text-teal-700">{ind.id}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                  {ind.donde} · {ind.peso} %
                </span>
              </div>
              <p className="mt-2 font-medium">{ind.texto}</p>
              <p className="mt-3 text-sm">
                <span className="font-semibold text-emerald-700">Muy buen desempeño: </span>
                {ind.muyBien}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-semibold text-orange-600">Incipiente: </span>
                {ind.incipiente}
              </p>
              <button
                onClick={() => irA(ind.estacion)}
                className="mt-3 self-start text-sm font-semibold text-teal-700 hover:underline"
              >
                Practicar →
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-teal-600" /> Elige el buyer persona con el que vas a trabajar
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Todo el laboratorio se adapta a la persona que elijas. Puedes cambiarla cuando quieras.
        </p>
        <div className="mt-4 grid md:grid-cols-3 gap-3">
          {PERSONAS.map((p) => {
            const on = estado.persona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => set('persona', p.id)}
                aria-pressed={on}
                className={`text-left rounded-xl p-4 border-2 transition ${
                  on ? 'border-teal-600 bg-teal-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-3xl">{p.emoji}</div>
                <p className="font-bold mt-2">{p.nombre}</p>
                <p className="text-sm text-slate-500">{p.rol}</p>
                <p className="text-sm mt-3">
                  <b>Quiere:</b> {p.quiere}
                </p>
                <p className="text-sm mt-1">
                  <b>Objeción:</b> <i>{p.objecion}</i>
                </p>
                <p className="text-sm mt-1 text-slate-600">
                  <b>Dónde está:</b> {p.canales}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
