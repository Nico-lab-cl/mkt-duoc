import { useState } from 'react';
import { CircleCheck, CircleAlert, Printer, Copy, Check, Send } from 'lucide-react';
import { MARCA, etapaById, formatoById, herramientaById, personaById, resumenEntrega } from './datos';

const fecha = (iso) =>
  iso ? new Date(iso).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' }) : '';

/**
 * Resumen del Eje 1. El estudiante lo ve con el botón «Enviar al profesor»;
 * el panel docente lo reutiliza en modo solo lectura (`soloLectura`).
 */
export default function Entregable({ estado, irA, imagen, meta, onEnviar, guardado, soloLectura = false }) {
  const [copiado, setCopiado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const persona = personaById(estado.persona);
  const r = resumenEntrega(estado);
  const { filas, elegida, porque, evidencias, checks, CAMPOS_HERR } = r;
  const herrSel = estado.herrSel || [];
  const herrNotas = estado.herrNotas || {};
  const b = estado.brief || {};
  const formatoPieza = formatoById(b.formato);
  const etapaPieza = etapaById(b.etapa);
  const listos = checks.filter((c) => c.ok).length;

  const justificacion = [
    `La pieza ${formatoPieza ? `promociona el contenido «${formatoPieza.nombre.toLowerCase()}»` : 'gráfica'} y está dirigida a ${persona.nombre.split(',')[0]} (${persona.rol.toLowerCase()}), cuya principal objeción es ${persona.objecion}`,
    etapaPieza && `Se ubica en la etapa ${etapaPieza.nombre} del Flywheel${b.cta ? `, por eso tiene un único llamado a la acción: «${b.cta}»` : ''}.`,
    b.mensaje && `El titular «${b.mensaje}» responde directamente a esa objeción.`,
    elegida && `Se elaboró con ${elegida.nombre}${porque ? `. ${porque}` : '.'}`,
    evidencias.length > 0 &&
      `Principios de diseño aplicados: ${evidencias.map((p) => `${p.nombre.toLowerCase()}: ${estado.autoeval[p.id].evidencia.trim()}`).join(' ')}`
  ]
    .filter(Boolean)
    .join(' ');

  const textoPlano = [
    `LABORATORIO EFT · EJE 1 · Caso ${MARCA}`,
    '',
    'CLASIFICACIÓN DE CONTENIDOS EN EL FLYWHEEL',
    ...filas.map((f) => `- ${f.etapa} | ${f.formato} | ${f.ejemplo || '(sin ejemplo)'}`),
    '',
    'COMPARACIÓN DE HERRAMIENTAS DE DISEÑO',
    ...herrSel.flatMap((id) => [
      `${herramientaById(id).nombre}`,
      ...CAMPOS_HERR.map((c) => `  ${c}: ${herrNotas[id]?.[c] || '-'}`)
    ]),
    elegida ? `Elegida: ${elegida.nombre}. ${porque}` : '',
    '',
    'JUSTIFICACIÓN DE LA PIEZA VISUAL',
    justificacion
  ].join('\n');

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(textoPlano);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      window.prompt('Copia el texto:', textoPlano);
    }
  };

  const enviar = async () => {
    if (listos < checks.length && !window.confirm(`Te faltan ${checks.length - listos} indicadores por completar. ¿Enviar igual?`)) return;
    setEnviando(true);
    await onEnviar();
    setEnviando(false);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap justify-between gap-3 items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-teal-700 font-semibold print:hidden">Resumen</p>
            <h2 className="text-2xl font-bold mt-1">{soloLectura ? 'Entregable del Eje 1' : 'Mi entregable del Eje 1'}</h2>
            <p className="text-slate-600 mt-1">
              Caso {MARCA} · Buyer persona: {persona.nombre}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <button
              onClick={copiar}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm font-semibold"
            >
              {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copiado ? 'Copiado' : 'Copiar texto'}
            </button>
            {!soloLectura && (
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm font-semibold"
              >
                <Printer className="w-4 h-4" /> Imprimir o PDF
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 gap-2 print:hidden">
          {checks.map((c) => {
            const Tag = soloLectura ? 'div' : 'button';
            return (
              <Tag
                key={c.id}
                onClick={soloLectura ? undefined : () => irA(c.ir)}
                className={`text-left rounded-xl p-3 border flex gap-2 ${c.ok ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}
              >
                {c.ok ? <CircleCheck className="w-5 h-5 text-emerald-600 shrink-0" /> : <CircleAlert className="w-5 h-5 text-amber-600 shrink-0" />}
                <span className="text-sm">
                  <b className="font-mono">{c.id}</b> · {c.texto}
                </span>
              </Tag>
            );
          })}
        </div>

        {!soloLectura && (
          <div className="mt-5 rounded-xl bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="text-sm">
              {meta?.submitted_at ? (
                <>
                  <p className="font-semibold text-teal-300">Enviado al profesor el {fecha(meta.submitted_at)}</p>
                  <p className="text-slate-300">
                    Puedes seguir mejorándolo y volver a enviarlo; el profesor ve siempre la última versión.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold">Aún no lo envías</p>
                  <p className="text-slate-300">
                    Tu avance se guarda solo, pero el profesor sabe que terminaste cuando lo envías ({listos} de{' '}
                    {checks.length} indicadores listos).
                  </p>
                </>
              )}
            </div>
            <button
              onClick={enviar}
              disabled={enviando || guardado === 'guardando'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-600 font-semibold disabled:opacity-60"
            >
              <Send className="w-4 h-4" /> {enviando ? 'Enviando…' : meta?.submitted_at ? 'Volver a enviar' : 'Enviar al profesor'}
            </button>
          </div>
        )}
        {!soloLectura && (
          <p className="mt-3 text-xs text-slate-500 print:hidden">
            Este resumen es material de apoyo para tu informe: redáctalo con tus palabras, cita tus fuentes en APA y
            declara el uso de IA.
          </p>
        )}
      </section>

      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-lg font-bold">1. Contenidos en el Flywheel</h3>
        {filas.length === 0 ? (
          <p className="text-sm text-slate-500 mt-2">Aún no hay formatos bien clasificados.</p>
        ) : (
          <div className="overflow-x-auto mt-3">
            <table className="w-full min-w-[520px] text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-2">Etapa</th>
                  <th className="p-2">Formato</th>
                  <th className="p-2">Ejemplo para el caso</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((f) => (
                  <tr key={f.formato} className="border-t border-slate-200 align-top">
                    <td className="p-2 font-semibold">{f.etapa}</td>
                    <td className="p-2">{f.formato}</td>
                    <td className={`p-2 ${f.ejemplo ? '' : 'text-amber-700 italic'}`}>{f.ejemplo || 'Falta el ejemplo'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-lg font-bold">2. Comparación de herramientas de diseño</h3>
        {herrSel.length === 0 ? (
          <p className="text-sm text-slate-500 mt-2">Aún no hay herramientas elegidas.</p>
        ) : (
          <div className="overflow-x-auto mt-3">
            <table className="w-full min-w-[520px] text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-2" />
                  {herrSel.map((id) => (
                    <th key={id} className="p-2">
                      {herramientaById(id).nombre}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CAMPOS_HERR.map((c) => (
                  <tr key={c} className="border-t border-slate-200 align-top">
                    <td className="p-2 font-semibold capitalize">{c}</td>
                    {herrSel.map((id) => (
                      <td key={id} className="p-2">
                        {herrNotas[id]?.[c] || <span className="text-amber-700 italic">Falta</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {elegida && (
          <p className="mt-3 text-sm">
            <b>Eligió {elegida.nombre}.</b> {porque}
          </p>
        )}
      </section>

      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-lg font-bold">3. Justificación de la pieza visual</h3>
        <div className="mt-3 grid md:grid-cols-[220px_1fr] gap-4 items-start">
          {imagen ? (
            <a href={imagen} target="_blank" rel="noreferrer">
              <img src={imagen} alt="Pieza gráfica" className="w-full rounded-xl border border-slate-200" />
            </a>
          ) : (
            <div className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-500 p-4 text-center">
              {soloLectura ? 'No subió pieza' : 'Sube tu pieza en «Tu pieza» para verla aquí'}
            </div>
          )}
          <p className="text-sm leading-relaxed text-slate-800">{justificacion}</p>
        </div>
      </section>
    </div>
  );
}
