import { useState } from 'react';
import { CircleCheck, CircleAlert, Printer, Copy, Check } from 'lucide-react';
import {
  ETAPAS,
  MARCA,
  PRINCIPIOS,
  evaluarFormato,
  etapaById,
  formatoById,
  herramientaById,
  personaById
} from './datos';

const CAMPOS_HERR = ['funciones', 'ventajas', 'limitaciones'];

export default function Entregable({ estado, irA, imagen }) {
  const [copiado, setCopiado] = useState(false);
  const persona = personaById(estado.persona);

  // Flywheel
  const filas = ETAPAS.filter((e) => e.id !== 'no').flatMap((et) =>
    Object.entries(estado.clasif)
      .filter(([fid, e]) => e === et.id && evaluarFormato(fid, e) !== 'mal')
      .map(([fid]) => ({ etapa: et.nombre, formato: formatoById(fid).nombre, ejemplo: (estado.ejemplos[fid] || '').trim() }))
  );
  const etapasCubiertas = new Set(filas.map((f) => f.etapa)).size;
  const conEjemplo = filas.filter((f) => f.ejemplo).length;

  // Herramientas
  const herrCompletas = estado.herrSel.filter((id) => CAMPOS_HERR.every((c) => (estado.herrNotas[id]?.[c] || '').trim()));
  const elegida = herramientaById(estado.herrElegida);
  const porque = (estado.herrNotas.__porque || '').trim();

  // Pieza
  const b = estado.brief;
  const evidencias = PRINCIPIOS.filter((p) => (estado.autoeval[p.id]?.evidencia || '').trim());
  const formatoPieza = formatoById(b.formato);
  const etapaPieza = etapaById(b.etapa);

  const checks = [
    {
      id: 'IE1.1.2',
      ok: filas.length >= 5 && etapasCubiertas === 3,
      texto: `${filas.length} formatos bien ubicados en ${etapasCubiertas} de 3 etapas (mínimo 5 y las 3 etapas)`,
      ir: 'flywheel'
    },
    {
      id: 'IE1.1.1',
      ok: filas.length >= 5 && conEjemplo === filas.length,
      texto: `${conEjemplo} de ${filas.length} formatos con ejemplo real`,
      ir: 'flywheel'
    },
    {
      id: 'IE1.2.1',
      ok: herrCompletas.length >= 2 && !!elegida && !!porque,
      texto: `${herrCompletas.length} herramientas comparadas completas (mínimo 2) · elección ${elegida && porque ? 'justificada' : 'pendiente'}`,
      ir: 'herramientas'
    },
    {
      id: 'IE1.2.2',
      ok: evidencias.length >= 4 && !!b.etapa && !!b.mensaje,
      texto: `${evidencias.length} de ${PRINCIPIOS.length} principios con evidencia (mínimo 4) · brief ${b.etapa && b.mensaje ? 'completo' : 'pendiente'}`,
      ir: 'pieza'
    }
  ];

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
    ...estado.herrSel.flatMap((id) => [
      `${herramientaById(id).nombre}`,
      ...CAMPOS_HERR.map((c) => `  ${c}: ${estado.herrNotas[id]?.[c] || '-'}`)
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

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap justify-between gap-3 items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-teal-700 font-semibold print:hidden">Resumen</p>
            <h2 className="text-2xl font-bold mt-1">Mi entregable del Eje 1</h2>
            <p className="text-slate-600 mt-1">
              Caso {MARCA} · Buyer persona: {persona.nombre}
            </p>
          </div>
          <div className="flex gap-2 print:hidden">
            <button
              onClick={copiar}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm font-semibold"
            >
              {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copiado ? 'Copiado' : 'Copiar texto'}
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 text-sm font-semibold"
            >
              <Printer className="w-4 h-4" /> Imprimir o guardar PDF
            </button>
          </div>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 gap-2 print:hidden">
          {checks.map((c) => (
            <button
              key={c.id}
              onClick={() => irA(c.ir)}
              className={`text-left rounded-xl p-3 border flex gap-2 ${c.ok ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}
            >
              {c.ok ? <CircleCheck className="w-5 h-5 text-emerald-600 shrink-0" /> : <CircleAlert className="w-5 h-5 text-amber-600 shrink-0" />}
              <span className="text-sm">
                <b className="font-mono">{c.id}</b> · {c.texto}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500 print:hidden">
          Este resumen es material de apoyo para tu informe: redáctalo con tus palabras, cita tus fuentes en APA y declara
          el uso de IA. Tu avance se guarda solo en este navegador.
        </p>
      </section>

      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-lg font-bold">1. Contenidos en el Flywheel</h3>
        {filas.length === 0 ? (
          <p className="text-sm text-slate-500 mt-2">Aún no clasificas formatos.</p>
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
        {estado.herrSel.length === 0 ? (
          <p className="text-sm text-slate-500 mt-2">Aún no eliges herramientas.</p>
        ) : (
          <div className="overflow-x-auto mt-3">
            <table className="w-full min-w-[520px] text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-2" />
                  {estado.herrSel.map((id) => (
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
                    {estado.herrSel.map((id) => (
                      <td key={id} className="p-2">
                        {estado.herrNotas[id]?.[c] || <span className="text-amber-700 italic">Falta</span>}
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
            <b>Elegimos {elegida.nombre}.</b> {porque}
          </p>
        )}
      </section>

      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-lg font-bold">3. Justificación de la pieza visual</h3>
        <div className="mt-3 grid md:grid-cols-[220px_1fr] gap-4 items-start">
          {imagen ? (
            <img src={imagen} alt="Pieza del grupo" className="w-full rounded-xl border border-slate-200" />
          ) : (
            <div className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-500 p-4 text-center">
              Sube tu pieza en «Tu pieza» para verla aquí (no se guarda al recargar)
            </div>
          )}
          <p className="text-sm leading-relaxed text-slate-800">{justificacion}</p>
        </div>
      </section>
    </div>
  );
}
