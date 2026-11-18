import { useState } from 'react';
import { Copy, Check, Upload, Trash2 } from 'lucide-react';
import {
  ESCALA,
  ETAPAS,
  FORMATOS,
  MARCA,
  PERSONAS,
  PRINCIPIOS,
  herramientaById,
  personaById,
  etapaById,
  formatoById
} from './datos';

const OBJETIVOS = {
  atraer: 'educar y llegar a personas que aún no conocen la marca',
  interactuar: 'convertir la visita en lead a cambio de un contenido de valor',
  deleitar: 'ayudar al cliente a sacarle partido a su compra para que nos recomiende'
};

/** Prompt para pegar en cualquier herramienta de imagen con IA. */
const armarPrompt = (b, persona) => {
  const etapa = etapaById(b.etapa);
  const formato = formatoById(b.formato);
  return [
    `Crea una pieza gráfica para ${b.canal || 'Instagram (formato cuadrado 1:1)'} de ${MARCA}, una marca chilena de electrodomésticos inteligentes (Smart Home).`,
    `Público: ${persona.nombre}, ${persona.rol}. Quiere: ${persona.quiere.toLowerCase()} Su objeción: ${persona.objecion}`,
    etapa && `Etapa del Flywheel: ${etapa.nombre}. Objetivo: ${OBJETIVOS[b.etapa]}.`,
    formato && `La pieza promociona este contenido: ${formato.nombre.toLowerCase()}.`,
    b.mensaje && `Titular (escríbelo exactamente así, en español): "${b.mensaje}".`,
    b.cta && `Un solo botón o llamado a la acción: "${b.cta}".`,
    `Estilo: ${b.estilo || 'moderno, limpio, cálido y cercano'}. Paleta de marca: azul petróleo oscuro, turquesa y un acento naranja para el botón.`,
    'Aplica principios de diseño: alto contraste entre texto y fondo, jerarquía clara (titular protagonista), alineación a un solo eje, espacio en blanco generoso y un único CTA visible.',
    'Evita: texto pequeño o en exceso, más de dos tipografías, logos de otras marcas reales.'
  ]
    .filter(Boolean)
    .join('\n');
};

const Campo = ({ label, children }) => (
  <label className="block text-sm font-semibold">
    {label}
    <div className="mt-1 font-normal">{children}</div>
  </label>
);

const input =
  'w-full rounded-lg border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white';

/** Reduce la imagen a 1400 px y JPEG para que pese poco en la base de datos. */
const comprimir = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const max = 1400;
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * k);
      canvas.height = Math.round(img.height * k);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No pudimos leer esa imagen. Prueba con un JPG o PNG.'));
    };
    img.src = url;
  });

export default function TuPieza({ estado, set, irA, imagen, subirImagen, quitarImagen }) {
  const [copiado, setCopiado] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [errorImg, setErrorImg] = useState('');
  const b = { persona: estado.persona, ...estado.brief };
  const persona = personaById(b.persona);
  const prompt = armarPrompt(b, persona);
  const formatosEtapa = FORMATOS.filter((f) => f.etapa === b.etapa || f.tambien.includes(b.etapa));
  const herramienta = herramientaById(estado.herrElegida);

  const setB = (campo, valor) => {
    if (campo === 'persona') set('persona', valor);
    set('brief', (x) => ({ ...x, [campo]: valor, ...(campo === 'etapa' ? { formato: '' } : {}) }));
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      window.prompt('Copia el prompt:', prompt);
    }
  };

  const subir = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setErrorImg('');
    setSubiendo(true);
    try {
      await subirImagen(await comprimir(f), 'image/jpeg');
    } catch (err) {
      setErrorImg(err.message);
    } finally {
      setSubiendo(false);
    }
  };

  const ev = (pid, campo, valor) =>
    set('autoeval', (a) => ({ ...a, [pid]: { ...(a[pid] || {}), [campo]: valor } }));

  const evaluados = PRINCIPIOS.filter((x) => estado.autoeval[x.id]?.nivel !== undefined);
  const promedio = evaluados.length
    ? Math.round(evaluados.reduce((s, x) => s + estado.autoeval[x.id].nivel, 0) / evaluados.length)
    : null;

  return (
    <div className="space-y-6">
      {/* 1. Brief */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <p className="text-xs uppercase tracking-widest text-teal-700 font-semibold">IE1.2.2 · 3 % del informe + base del video</p>
        <h2 className="text-2xl font-bold mt-1">Paso 1: el brief de tu pieza</h2>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Antes de abrir cualquier herramienta, decide para quién es, en qué etapa está y qué tiene que hacer después de
          verla. Con esto el lab te arma el prompt.
        </p>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <Campo label="Buyer persona">
            <select className={input} value={b.persona} onChange={(e) => setB('persona', e.target.value)}>
              {PERSONAS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Etapa del Flywheel">
            <select className={input} value={b.etapa || ''} onChange={(e) => setB('etapa', e.target.value)}>
              <option value="">Selecciona…</option>
              {ETAPAS.filter((e) => e.id !== 'no').map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="¿Qué contenido promociona?">
            <select className={input} value={b.formato || ''} onChange={(e) => setB('formato', e.target.value)} disabled={!b.etapa}>
              <option value="">{b.etapa ? 'Selecciona…' : 'Primero elige la etapa'}</option>
              {formatosEtapa.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombre}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Canal y formato">
            <input
              className={input}
              value={b.canal || ''}
              onChange={(e) => setB('canal', e.target.value)}
              placeholder="Instagram (formato cuadrado 1:1)"
            />
          </Campo>
          <Campo label={`Titular (responde a: ${persona.objecion})`}>
            <input
              className={input}
              value={b.mensaje || ''}
              onChange={(e) => setB('mensaje', e.target.value)}
              placeholder="Ej.: Tu casa inteligente, sin complicaciones"
            />
          </Campo>
          <Campo label="Llamado a la acción (uno solo)">
            <input
              className={input}
              value={b.cta || ''}
              onChange={(e) => setB('cta', e.target.value)}
              placeholder="Ej.: Descarga la guía gratis"
            />
          </Campo>
          <Campo label="Estilo visual">
            <input
              className={input}
              value={b.estilo || ''}
              onChange={(e) => setB('estilo', e.target.value)}
              placeholder="moderno, limpio, cálido y cercano"
            />
          </Campo>
        </div>
      </section>

      {/* 2. Prompt */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <h2 className="text-xl font-bold">Paso 2: tu prompt para la herramienta de IA</h2>
        <p className="text-sm text-slate-600 mt-1">
          Pégalo en {herramienta ? herramienta.nombre : 'la herramienta que elegiste en la estación Herramientas'}. Si el
          texto sale deformado, genera la imagen sin texto y pon el titular encima en Canva o Adobe Express.
        </p>
        <pre className="mt-3 whitespace-pre-wrap text-sm bg-slate-900 text-slate-100 rounded-xl p-4 leading-relaxed">{prompt}</pre>
        <button
          onClick={copiar}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700"
        >
          {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copiado ? 'Copiado' : 'Copiar prompt'}
        </button>
        {!herramienta && (
          <button onClick={() => irA('herramientas')} className="ml-3 text-sm text-teal-700 hover:underline">
            Elegir herramienta →
          </button>
        )}
      </section>

      {/* 3. Autoevaluación */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <h2 className="text-xl font-bold">Paso 3: sube tu pieza y evalúala como lo haría el docente</h2>
        <p className="text-sm text-slate-600 mt-1">
          La imagen se guarda en tu entrega y solo la ven tú y tu profesor. Para cada principio, elige tu nivel y
          escribe la evidencia: <b>dónde</b> se ve en la pieza y <b>para qué</b> lo hiciste. Esas frases son tu
          justificación del informe.
        </p>

        <div className="mt-4 grid lg:grid-cols-[320px_1fr] gap-6 items-start">
          <div className="lg:sticky lg:top-4">
            {imagen ? (
              <div className="space-y-2">
                <img src={imagen} alt="Tu pieza" className="w-full rounded-xl border border-slate-200 shadow" />
                <div className="flex gap-3">
                  <label className="inline-flex items-center gap-1 text-xs text-teal-700 hover:underline cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Reemplazar
                    <input type="file" accept="image/*" className="sr-only" onChange={subir} disabled={subiendo} />
                  </label>
                  <button onClick={quitarImagen} className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-rose-700">
                    <Trash2 className="w-3.5 h-3.5" /> Quitar imagen
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 aspect-square rounded-xl border-2 border-dashed border-slate-300 text-slate-500 cursor-pointer hover:border-teal-500 hover:text-teal-700">
                <Upload className="w-8 h-8" />
                <span className="text-sm font-semibold">{subiendo ? 'Subiendo…' : 'Sube tu pieza (JPG o PNG)'}</span>
                <input type="file" accept="image/*" className="sr-only" onChange={subir} disabled={subiendo} />
              </label>
            )}
            {errorImg && <p className="mt-2 text-sm text-rose-700">{errorImg}</p>}
            {promedio !== null && (
              <div className="mt-3 rounded-xl bg-slate-900 text-white p-3 text-sm">
                <p className="font-semibold">
                  Autoevaluación: {promedio} % ({evaluados.length} de {PRINCIPIOS.length} principios)
                </p>
                <p className="text-slate-300 text-xs mt-1">
                  Lo que bajó de 80 % es lo primero que debes corregir antes de entregar.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {PRINCIPIOS.map((x) => {
              const a = estado.autoeval[x.id] || {};
              return (
                <div key={x.id} className="border border-slate-200 rounded-xl p-4">
                  <p className="font-semibold">{x.nombre}</p>
                  <p className="text-xs text-slate-500">{x.pregunta}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {ESCALA.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => ev(x.id, 'nivel', n.id)}
                        className={`text-xs px-2.5 py-1 rounded-full border ${
                          a.nivel === n.id ? `${n.color} text-white border-transparent` : 'border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {n.label} · {n.id} %
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    value={a.evidencia || ''}
                    onChange={(e) => ev(x.id, 'evidencia', e.target.value)}
                    placeholder={`Ej.: ${ejemploEvidencia(x.id)}`}
                    className={`${input} mt-2`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

const EJEMPLOS = {
  contraste: 'Titular blanco sobre fondo azul petróleo para que se lea en el celular incluso al sol.',
  jerarquia: 'El titular ocupa un tercio de la pieza; primero se lee la promesa, después el beneficio y al final el botón.',
  alineacion: 'Todo alineado a la izquierda para que la lectura baje en una sola línea hasta el CTA.',
  espacio: 'Dejamos solo una frase de apoyo y aire alrededor del titular para que el mensaje no compita.',
  marca: 'Repetimos la paleta y la tipografía de la marca y el logo arriba a la izquierda, igual que en la landing.',
  cta: 'Un único botón naranja «Descarga la guía gratis», coherente con la etapa Interactuar: busca el lead.'
};
const ejemploEvidencia = (id) => EJEMPLOS[id];
