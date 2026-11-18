import { CircleCheck, CircleX, Info, Plus, Check, PenLine } from 'lucide-react';
import { ESCENARIOS_HERRAMIENTA, HERRAMIENTAS, herramientaById } from './datos';

const CAMPOS = [
  { id: 'funciones', label: 'Funciones' },
  { id: 'ventajas', label: 'Ventajas' },
  { id: 'limitaciones', label: 'Limitaciones' }
];

const MAX_SEL = 3;
const input = 'w-full rounded-lg border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white';

export default function Herramientas({ estado, set }) {
  const sel = estado.herrSel;
  const notas = estado.herrNotas;
  const otras = estado.escenariosOtra || {};
  const nombre = (id) => herramientaById(id, estado.herrOtra).nombre;

  const aciertos = ESCENARIOS_HERRAMIENTA.filter((e) => e.correctas.includes(estado.escenarios[e.id])).length;
  const abiertas = ESCENARIOS_HERRAMIENTA.filter((e) => estado.escenarios[e.id] === 'otra').length;
  const respondidos = Object.keys(estado.escenarios).length;

  const toggle = (id) =>
    set('herrSel', (s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= MAX_SEL ? s : [...s, id]));

  const nota = (id, campo, valor) =>
    set('herrNotas', (n) => ({ ...n, [id]: { ...(n[id] || {}), [campo]: valor } }));

  const usarFicha = (id) => {
    const h = herramientaById(id);
    set('herrNotas', (n) => ({
      ...n,
      [id]: { funciones: h.funciones, ventajas: h.ventajas, limitaciones: h.limitaciones, ...(n[id] || {}) }
    }));
  };

  const otraEsc = (id, campo, valor) =>
    set('escenariosOtra', (o) => ({ ...(o || {}), [id]: { ...((o || {})[id] || {}), [campo]: valor } }));

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <p className="text-xs uppercase tracking-widest text-teal-700 font-semibold">IE1.2.1 · 10 % del examen (video)</p>
        <h2 className="text-2xl font-bold mt-1">¿Qué herramienta usarías para…?</h2>
        <p className="text-slate-600 mt-2 max-w-3xl">
          No existe «la mejor herramienta»: cada una sirve para algo. En el video tienes que comparar funciones,
          ventajas y limitaciones y decir cuál elegiste y por qué. Calienta con estos {ESCENARIOS_HERRAMIENTA.length}{' '}
          casos. Si usarías una que no está en la lista, elige <b>Otra</b> y cuéntanos cuál.
        </p>
        <div className="mt-4 space-y-4">
          {ESCENARIOS_HERRAMIENTA.map((e, i) => {
            const r = estado.escenarios[e.id];
            const esOtra = r === 'otra';
            const ok = r && e.correctas.includes(r);
            const o = otras[e.id] || {};
            return (
              <div key={e.id} className="border border-slate-200 rounded-xl p-4">
                <p className="font-medium">
                  {i + 1}. {e.texto}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {HERRAMIENTAS.map((h) => {
                    const elegido = r === h.id;
                    const esCorrecta = e.correctas.includes(h.id);
                    let cls = 'bg-white border-slate-300 hover:border-slate-500';
                    if (r && elegido) cls = ok ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-rose-600 text-white border-rose-600';
                    else if (r && esCorrecta) cls = 'bg-emerald-50 border-emerald-400 text-emerald-800';
                    return (
                      <button
                        key={h.id}
                        onClick={() => set('escenarios', (x) => ({ ...x, [e.id]: h.id }))}
                        className={`px-3 py-1.5 rounded-lg text-sm border ${cls}`}
                      >
                        {h.nombre}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => set('escenarios', (x) => ({ ...x, [e.id]: 'otra' }))}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-dashed ${
                      esOtra ? 'bg-sky-600 text-white border-sky-600' : 'bg-white border-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <PenLine className="w-3.5 h-3.5" /> Otra…
                  </button>
                </div>

                {esOtra && (
                  <div className="mt-3 grid sm:grid-cols-[220px_1fr] gap-2">
                    <input
                      className={input}
                      value={o.nombre || ''}
                      onChange={(ev) => otraEsc(e.id, 'nombre', ev.target.value)}
                      placeholder="¿Qué herramienta?"
                      maxLength={60}
                    />
                    <input
                      className={input}
                      value={o.porque || ''}
                      onChange={(ev) => otraEsc(e.id, 'porque', ev.target.value)}
                      placeholder="¿Por qué esa para este caso?"
                      maxLength={300}
                    />
                  </div>
                )}

                {r && (
                  <p className={`mt-3 text-sm flex gap-2 ${esOtra ? 'text-sky-800' : ok ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {esOtra ? (
                      <PenLine className="w-4 h-4 mt-0.5 shrink-0" />
                    ) : ok ? (
                      <CircleCheck className="w-4 h-4 mt-0.5 shrink-0" />
                    ) : (
                      <CircleX className="w-4 h-4 mt-0.5 shrink-0" />
                    )}
                    <span>
                      {esOtra
                        ? 'Respuesta abierta: tu profesor la revisará. Compárala con las sugeridas (en verde). '
                        : ok
                        ? 'Buena elección. '
                        : 'Hay mejores opciones (marcadas en verde). '}
                      {e.explica}
                    </span>
                  </p>
                )}
                {esOtra && (
                  <p className="mt-1 text-xs text-slate-500">
                    Sugeridas: {e.correctas.map((id) => herramientaById(id).nombre).join(', ')}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        {respondidos > 0 && (
          <p className="mt-4 text-sm font-semibold">
            Llevas {aciertos} de {ESCENARIOS_HERRAMIENTA.length} bien
            {abiertas > 0 && ` · ${abiertas} respuesta${abiertas > 1 ? 's' : ''} abierta${abiertas > 1 ? 's' : ''}`}.
          </p>
        )}
      </section>

      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-bold">Elige hasta {MAX_SEL} herramientas para tu comparación</h2>
        <p className="text-sm text-slate-600 mt-1">
          Ideal: una de plantillas (Canva, Adobe Express) contra una o dos con IA. Así tu comparación tiene contraste.
          También puedes sumar una herramienta que no esté en la lista.
        </p>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {HERRAMIENTAS.map((h) => {
            const on = sel.includes(h.id);
            const lleno = !on && sel.length >= MAX_SEL;
            return (
              <button
                key={h.id}
                onClick={() => toggle(h.id)}
                disabled={lleno}
                aria-pressed={on}
                className={`text-left rounded-xl p-4 border-2 transition ${
                  on ? 'border-teal-600 bg-teal-50' : lleno ? 'border-slate-200 opacity-50' : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <p className="font-bold">{h.nombre}</p>
                  {on ? <Check className="w-5 h-5 text-teal-700 shrink-0" /> : <Plus className="w-5 h-5 text-slate-400 shrink-0" />}
                </div>
                <p className="text-xs text-slate-500">{h.tipo}</p>
                <p className="text-sm mt-2 text-slate-700">{h.funciones}</p>
              </button>
            );
          })}

          {(() => {
            const on = sel.includes('otra');
            const lleno = !on && sel.length >= MAX_SEL;
            return (
              <div
                className={`rounded-xl p-4 border-2 border-dashed transition ${
                  on ? 'border-teal-600 bg-teal-50' : lleno ? 'border-slate-200 opacity-50' : 'border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <p className="font-bold">Otra herramienta</p>
                  <PenLine className="w-5 h-5 text-slate-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-500">La que tú uses y no esté aquí</p>
                <input
                  className={`${input} mt-2`}
                  value={estado.herrOtra || ''}
                  onChange={(e) => set('herrOtra', e.target.value)}
                  placeholder="Nombre (ej.: Leonardo AI)"
                  maxLength={60}
                />
                <button
                  onClick={() => toggle('otra')}
                  disabled={lleno || (!on && !(estado.herrOtra || '').trim())}
                  className="mt-2 text-sm font-semibold text-teal-700 hover:underline disabled:text-slate-400 disabled:no-underline"
                >
                  {on ? 'Quitar de la comparación' : 'Agregar a la comparación'}
                </button>
              </div>
            );
          })()}
        </div>
        <p className="mt-3 text-xs text-slate-500 flex gap-1.5">
          <Info className="w-4 h-4 shrink-0" />
          Las funciones y los planes gratis de estas herramientas cambian seguido. Pruébalas tú y verifica antes de
          citarlas en el informe.
        </p>
      </section>

      {sel.length > 0 && (
        <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold">Tu cuadro comparativo</h2>
          <p className="text-sm text-slate-600 mt-1">
            Escríbelo con tus palabras y desde tu experiencia probándolas. La ficha de referencia es solo un punto de
            partida.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 w-32" />
                  {sel.map((id) => (
                    <th key={id} className="text-left p-2 align-bottom">
                      <p className="font-bold">{nombre(id)}</p>
                      {id !== 'otra' && (
                        <button onClick={() => usarFicha(id)} className="text-xs font-normal text-teal-700 hover:underline">
                          Rellenar vacíos con la ficha
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CAMPOS.map((c) => (
                  <tr key={c.id} className="border-t border-slate-200">
                    <td className="p-2 font-semibold align-top">{c.label}</td>
                    {sel.map((id) => (
                      <td key={id} className="p-2 align-top">
                        <textarea
                          rows={3}
                          value={notas[id]?.[c.id] || ''}
                          onChange={(e) => nota(id, c.id, e.target.value)}
                          className={input}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid md:grid-cols-[260px_1fr] gap-3 items-start">
            <label className="text-sm font-semibold">
              Para mi pieza elegí:
              <select
                value={estado.herrElegida}
                onChange={(e) => set('herrElegida', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-2 font-normal"
              >
                <option value="">Selecciona…</option>
                {sel.map((id) => (
                  <option key={id} value={id}>
                    {nombre(id)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              ¿Por qué esa y no las otras?
              <textarea
                rows={3}
                value={notas.__porque || ''}
                onChange={(e) => set('herrNotas', (n) => ({ ...n, __porque: e.target.value }))}
                placeholder="Ej.: Generamos la foto en Gemini porque necesitábamos una cocina realista, pero el titular lo pusimos en Canva porque la IA deformaba el texto."
                className={`${input} mt-1 font-normal`}
              />
            </label>
          </div>
        </section>
      )}
    </div>
  );
}
