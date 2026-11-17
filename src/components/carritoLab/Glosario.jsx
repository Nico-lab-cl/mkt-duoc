import { useState } from 'react';
import { Search, BookOpen, ExternalLink } from 'lucide-react';
import { GLOSARIO, BIBLIOGRAFIA, fuenteById, terminoById } from './guia';
import { useGlosarioNav } from './navContext';

/** Palabra subrayada que lleva a su definición en el glosario. */
export function Termino({ id, children, className = '' }) {
  const { verTermino } = useGlosarioNav();
  const t = terminoById(id);
  return (
    <button
      type="button"
      onClick={() => verTermino(id)}
      title={t ? t.definicion || `${t.termino}: ${t.simple}` : undefined}
      className={`inline text-sky-700 underline decoration-dotted underline-offset-2 hover:text-sky-900 ${className}`}
    >
      {children}
    </button>
  );
}

const sinTildes = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function Glosario({ resaltado }) {
  const [q, setQ] = useState('');
  const lista = GLOSARIO.filter(
    (g) => !q.trim() || sinTildes(`${g.termino} ${g.definicion || ''} ${g.simple}`).includes(sinTildes(q.trim()))
  );
  const numero = (id) => BIBLIOGRAFIA.findIndex((b) => b.id === id) + 1;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <section>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-sky-600" /> Glosario y bibliografía
        </h2>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Los conceptos técnicos del laboratorio: primero la definición formal (con sus siglas y el término en
          inglés, como aparecerá en la industria), luego una explicación en simple y un ejemplo. Los números entre
          corchetes llevan a la fuente.
        </p>
        <label className="mt-4 flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-2 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar: TRIM, JSON, SKU…"
            className="flex-1 outline-none text-sm bg-transparent"
          />
        </label>
      </section>

      <section className="grid md:grid-cols-2 gap-3">
        {lista.map((g) => (
          <article
            key={g.id}
            id={`g-${g.id}`}
            className={`bg-white rounded-2xl border p-4 scroll-mt-24 transition ${
              resaltado === g.id ? 'border-sky-500 ring-4 ring-sky-100' : 'border-slate-200'
            }`}
          >
            <h3 className="font-bold text-lg">{g.termino}</h3>
            {g.definicion && (
              <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                <span className="block text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Definición</span>
                {g.definicion}
              </p>
            )}
            <p className="text-sm text-slate-700 mt-2 leading-relaxed">
              <span className="block text-[11px] uppercase tracking-wide text-slate-400 font-semibold">En simple</span>
              {g.simple}
            </p>
            <p className="text-sm mt-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-amber-950">
              <b>Ejemplo:</b> {g.ejemplo}
            </p>
            {g.fuentes?.length > 0 && (
              <p className="text-xs text-slate-500 mt-2">
                Fuentes:{' '}
                {g.fuentes.map((f) => (
                  <a key={f} href={`#b-${f}`} className="text-sky-700 hover:underline mr-1.5" title={fuenteById(f)?.cita}>
                    [{numero(f)}]
                  </a>
                ))}
              </p>
            )}
          </article>
        ))}
        {lista.length === 0 && <p className="text-sm text-slate-500">No hay términos con «{q}».</p>}
      </section>

      <section>
        <h3 className="font-semibold text-lg mb-3">Bibliografía</h3>
        <ol className="space-y-2">
          {BIBLIOGRAFIA.map((b, i) => (
            <li key={b.id} id={`b-${b.id}`} className="bg-white border border-slate-200 rounded-xl p-3 text-sm scroll-mt-24">
              <span className="font-mono text-slate-400 mr-2">[{i + 1}]</span>
              {b.cita}{' '}
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sky-700 hover:underline break-all"
              >
                {b.url} <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
              <span className="block text-xs text-slate-500 mt-1">{b.nota}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
