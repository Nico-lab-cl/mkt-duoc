import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  ArrowLeftRight,
  Download,
  ClipboardCopy,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  ImageOff,
  FilePlus2,
  Bug,
  Wrench
} from 'lucide-react';
import { COLOR_HEX, shoeSvg } from './catalogo';
import { Termino } from './Glosario';
import { terminoById } from './guia';
import {
  TIPOS,
  tipoLabel,
  uid,
  plantillaVacia,
  plantillaConErrores,
  revisar,
  eventoPractica,
  correoPractica,
  aCsv,
  nuevoCampo,
  opcionesDesde
} from './practicaModelo';

/**
 * Práctica «Arma tu catálogo»: cada equipo define sus campos (tipo, valor
 * interno, nivel producto/variante), carga sus productos y prueba un carro
 * abandonado con ellos. El revisor marca los errores en vivo.
 * Se guarda sólo en el navegador de quien la usa.
 */

const LS_KEY = 'carritoLab.practica.v1';

function cargar() {
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* sin almacenamiento: se parte de cero */
  }
  return plantillaVacia();
}

const PASOS = [
  { id: 1, label: 'Define tus campos' },
  { id: 2, label: 'Carga tus productos' },
  { id: 3, label: 'Prueba el carro abandonado' }
];

export default function Practica() {
  const [modelo, setModelo] = useState(cargar);
  const [paso, setPaso] = useState(1);
  const [copiado, setCopiado] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(modelo));
    } catch {
      /* el navegador no deja guardar: sigue funcionando sin persistir */
    }
  }, [modelo]);

  const hallazgos = useMemo(() => revisar(modelo), [modelo]);

  const empezar = (tipo) => {
    if (modelo.productos.length || modelo.campos.length > 2) {
      if (!window.confirm('Esto borra tu catálogo actual. ¿Seguir?')) return;
    }
    setModelo(tipo === 'errores' ? plantillaConErrores() : plantillaVacia());
    setPaso(1);
  };

  const descargar = () => {
    const blob = new Blob(['﻿' + aCsv(modelo)], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mi-catalogo.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const copiarParaIA = async () => {
    const campos = modelo.campos.map(({ interno, etiqueta, tipo, nivel, obligatorio, opciones, min, max }) => ({
      nombre_interno: interno,
      etiqueta,
      tipo: tipoLabel(tipo),
      nivel,
      obligatorio,
      ...(tipo === 'lista' ? { opciones } : {}),
      ...(tipo === 'numero' ? { min, max } : {})
    }));
    const texto =
      'Soy estudiante de marketing. Armé este modelo de datos para el catálogo de una tienda online de calzado, ' +
      'que se conectará a un CRM para enviar correos de carrito abandonado. Revísalo: dime qué campos faltan, ' +
      'cuáles están en el nivel equivocado (producto o variante), cuáles deberían ser lista cerrada y por qué. ' +
      'Explícalo simple.\n\n' +
      JSON.stringify(campos, null, 2);
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado('Copiado. Pégalo en ChatGPT, Gemini o Claude y compara su respuesta con el revisor.');
    } catch {
      setCopiado('Tu navegador no dejó copiar. Usa «Descargar CSV».');
    }
    window.setTimeout(() => setCopiado(null), 5000);
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-6 space-y-5">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold">Práctica: arma tu catálogo</h2>
          <p className="text-slate-600 mt-1">
            Inventa los productos de una tienda, decide qué campos tiene cada uno y de qué tipo son, y después prueba
            qué le llega al CRM cuando alguien abandona el carro. El <b>revisor</b> de la derecha te va diciendo dónde
            te equivocaste.
          </p>
          <p className="text-xs text-slate-400 mt-1">Se guarda solo en este navegador.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => empezar('vacia')} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50">
            <FilePlus2 className="w-4 h-4" /> Empezar de cero
          </button>
          <button onClick={() => empezar('errores')} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100">
            <Bug className="w-4 h-4" /> Corregir un catálogo con errores
          </button>
          <button onClick={descargar} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50">
            <Download className="w-4 h-4" /> Descargar CSV
          </button>
          <button onClick={copiarParaIA} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50">
            <ClipboardCopy className="w-4 h-4" /> Copiar para revisar con IA
          </button>
        </div>
      </section>
      {copiado && <p className="text-sm bg-sky-50 border border-sky-200 text-sky-900 rounded-lg px-3 py-2">{copiado}</p>}

      <nav className="flex gap-2 overflow-x-auto">
        {PASOS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPaso(p.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm border ${
              paso === p.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-300 hover:bg-slate-50'
            }`}
          >
            Paso {p.id}: {p.label}
          </button>
        ))}
      </nav>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
        <div className="min-w-0">
          {paso === 1 && <PasoCampos modelo={modelo} setModelo={setModelo} />}
          {paso === 2 && <PasoProductos modelo={modelo} setModelo={setModelo} />}
          {paso === 3 && <PasoPrueba modelo={modelo} />}
          <div className="flex justify-between mt-4">
            <button disabled={paso === 1} onClick={() => setPaso(paso - 1)} className="text-sm px-3 py-2 rounded-lg border border-slate-300 bg-white disabled:opacity-30">
              ← Paso anterior
            </button>
            <button disabled={paso === 3} onClick={() => setPaso(paso + 1)} className="text-sm px-3 py-2 rounded-lg bg-slate-900 text-white disabled:opacity-30">
              Siguiente paso →
            </button>
          </div>
        </div>
        <Revisor hallazgos={hallazgos} />
      </div>
    </div>
  );
}

// ---------------- Paso 1 ----------------

function PasoCampos({ modelo, setModelo }) {
  const upd = (id, cambios) =>
    setModelo((m) => ({ ...m, campos: m.campos.map((f) => (f.id === id ? { ...f, ...cambios } : f)) }));
  const borrar = (id) => setModelo((m) => ({ ...m, campos: m.campos.filter((f) => f.id !== id) }));
  const agregar = (nivel) => setModelo((m) => ({ ...m, campos: [...m.campos, nuevoCampo(nivel)] }));

  const nivelBox = ({ nivel, titulo, ayuda }) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <h3 className="font-semibold">{titulo}</h3>
      <p className="text-xs text-slate-500 mt-0.5 mb-3">{ayuda}</p>
      <div className="space-y-3">
        {modelo.campos
          .filter((f) => f.nivel === nivel)
          .map((f) => (
            <CampoEditor key={f.id} f={f} upd={upd} borrar={borrar} />
          ))}
      </div>
      <button onClick={() => agregar(nivel)} className="mt-3 inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-dashed border-slate-400 hover:bg-slate-50">
        <Plus className="w-4 h-4" /> Agregar campo
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-sm text-sky-950 space-y-2">
        <p>
          <b>Cada campo tiene dos nombres.</b> El <b>nombre interno</b> lo leen las máquinas (minúsculas, sin espacios
          ni tildes: <code>material_capellada</code>). La <b>etiqueta</b> la ve la gente («Material de la capellada»).
        </p>
        <p>
          <b>¿Producto o variante?</b> En Producto va lo que comparten todas las versiones (nombre, marca, descripción).
          En Variante va lo que cambia de un par a otro: talla, color, foto, stock. Cada variante es un{' '}
          <Termino id="sku">SKU</Termino>.
        </p>
        <details className="text-xs">
          <summary className="cursor-pointer font-semibold">Tipos de campo</summary>
          <ul className="mt-2 space-y-1">
            {TIPOS.map((t) => (
              <li key={t.id}>
                <b>{t.label}:</b> {t.ayuda}
              </li>
            ))}
          </ul>
        </details>
      </div>
      {nivelBox({ nivel: 'producto', titulo: 'Tabla Producto', ayuda: 'Una fila por modelo de zapato.' })}
      {nivelBox({ nivel: 'variante', titulo: 'Tabla Variante (SKU)', ayuda: 'Una fila por cada combinación que se puede comprar: talla + color.' })}
    </div>
  );
}

function CampoEditor({ f, upd, borrar }) {
  const [nueva, setNueva] = useState('');
  const agregarOpcion = () => {
    if (!nueva.trim()) return;
    upd(f.id, { opciones: [...f.opciones, ...opcionesDesde(nueva.trim())] });
    setNueva('');
  };
  return (
    <div className="border border-slate-200 rounded-xl p-3">
      <div className="grid sm:grid-cols-[1fr_1fr_150px] gap-2">
        <label className="text-xs">
          <span className="block text-slate-500 mb-0.5">Nombre interno</span>
          <input value={f.interno} onChange={(e) => upd(f.id, { interno: e.target.value })} placeholder="ej: material_capellada" className="w-full font-mono text-sm rounded-lg border border-slate-300 px-2 py-1.5" />
        </label>
        <label className="text-xs">
          <span className="block text-slate-500 mb-0.5">Etiqueta visible</span>
          <input value={f.etiqueta} onChange={(e) => upd(f.id, { etiqueta: e.target.value })} placeholder="ej: Material de la capellada" className="w-full text-sm rounded-lg border border-slate-300 px-2 py-1.5" />
        </label>
        <label className="text-xs">
          <span className="block text-slate-500 mb-0.5">Tipo</span>
          <select value={f.tipo} onChange={(e) => upd(f.id, { tipo: e.target.value })} className="w-full text-sm rounded-lg border border-slate-300 px-2 py-1.5 bg-white">
            {TIPOS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {f.tipo === 'lista' && (
        <div className="mt-2 bg-slate-50 rounded-lg p-2">
          <p className="text-xs text-slate-500 mb-1">Opciones (etiqueta → valor interno)</p>
          <div className="space-y-1">
            {f.opciones.map((o, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <input
                  value={o.etiqueta}
                  onChange={(e) => upd(f.id, { opciones: f.opciones.map((x, j) => (j === i ? { ...x, etiqueta: e.target.value } : x)) })}
                  className="w-32 rounded border border-slate-300 px-1.5 py-1"
                />
                <span className="text-slate-400">→</span>
                <input
                  value={o.valor}
                  onChange={(e) => upd(f.id, { opciones: f.opciones.map((x, j) => (j === i ? { ...x, valor: e.target.value } : x)) })}
                  className="w-32 font-mono rounded border border-slate-300 px-1.5 py-1"
                />
                <button onClick={() => upd(f.id, { opciones: f.opciones.filter((_, j) => j !== i) })} className="p-1 text-slate-400 hover:text-rose-600" aria-label="Quitar opción">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 mt-1.5">
            <input
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && agregarOpcion()}
              placeholder="Nueva opción, ej: Cuero"
              className="w-40 text-xs rounded border border-slate-300 px-1.5 py-1"
            />
            <button onClick={agregarOpcion} className="text-xs px-2 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100">
              Agregar
            </button>
          </div>
        </div>
      )}

      {f.tipo === 'numero' && (
        <div className="mt-2 flex gap-2 text-xs">
          <label>
            Mínimo{' '}
            <input value={f.min} onChange={(e) => upd(f.id, { min: e.target.value })} className="w-20 rounded border border-slate-300 px-1.5 py-1" />
          </label>
          <label>
            Máximo{' '}
            <input value={f.max} onChange={(e) => upd(f.id, { max: e.target.value })} className="w-20 rounded border border-slate-300 px-1.5 py-1" />
          </label>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
        <label className="inline-flex items-center gap-1.5">
          <input type="checkbox" checked={f.obligatorio} onChange={(e) => upd(f.id, { obligatorio: e.target.checked })} /> Obligatorio
        </label>
        <button onClick={() => upd(f.id, { nivel: f.nivel === 'producto' ? 'variante' : 'producto' })} className="inline-flex items-center gap-1 text-sky-700 hover:underline">
          <ArrowLeftRight className="w-3.5 h-3.5" /> Mover a {f.nivel === 'producto' ? 'Variante' : 'Producto'}
        </button>
        <button onClick={() => borrar(f.id)} className="inline-flex items-center gap-1 text-rose-700 hover:underline ml-auto">
          <Trash2 className="w-3.5 h-3.5" /> Borrar campo
        </button>
      </div>
    </div>
  );
}

// ---------------- Paso 2 ----------------

function ValorInput({ f, value, onChange }) {
  const base = 'w-full text-sm rounded-lg border border-slate-300 px-2 py-1.5 bg-white';
  if (f.tipo === 'lista')
    return (
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={base} disabled={!f.opciones.length}>
        <option value="">{f.opciones.length ? '— elegir —' : 'define opciones en el paso 1'}</option>
        {f.opciones.map((o) => (
          <option key={o.valor + o.etiqueta} value={o.valor}>
            {o.etiqueta}
          </option>
        ))}
      </select>
    );
  if (f.tipo === 'numero') return <input type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={base} />;
  if (f.tipo === 'sino') return <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="mt-2" />;
  if (f.tipo === 'imagen')
    return (
      <span className="flex items-center gap-1.5">
        <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={base}>
          <option value="">sin foto</option>
          {Object.keys(COLOR_HEX).map((c) => (
            <option key={c} value={c}>
              foto zapato {c.toLowerCase()}
            </option>
          ))}
        </select>
        {value ? <img src={shoeSvg(value)} alt="" className="w-10 h-7 rounded object-cover shrink-0" /> : null}
      </span>
    );
  return <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={f.tipo === 'id' ? 'ej: P-001' : ''} className={base} />;
}

function PasoProductos({ modelo, setModelo }) {
  const prod = modelo.campos.filter((f) => f.nivel === 'producto');
  const vari = modelo.campos.filter((f) => f.nivel === 'variante');
  const mapP = (uidP, fn) => setModelo((m) => ({ ...m, productos: m.productos.map((p) => (p.uid === uidP ? fn(p) : p)) }));

  const agregarProducto = () => setModelo((m) => ({ ...m, productos: [...m.productos, { uid: uid('p'), valores: {}, variantes: [] }] }));
  const agregarVariante = (p) =>
    mapP(p.uid, (x) => {
      const ultima = x.variantes[x.variantes.length - 1];
      // Copia la variante anterior (menos el ID) para ir más rápido
      const valores = ultima ? Object.fromEntries(Object.entries(ultima.valores).filter(([k]) => vari.find((f) => f.id === k)?.tipo !== 'id')) : {};
      return { ...x, variantes: [...x.variantes, { uid: uid('v'), valores }] };
    });

  if (!prod.length && !vari.length) return <p className="bg-white rounded-2xl border p-4 text-sm">Primero define campos en el paso 1.</p>;

  return (
    <div className="space-y-4">
      {modelo.productos.length === 0 && (
        <p className="bg-white rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
          Todavía no hay productos. Inventa al menos 2 zapatos distintos, con más de una talla o color cada uno.
        </p>
      )}
      {modelo.productos.map((p, i) => (
        <div key={p.uid} className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Producto {i + 1}</h3>
            <button onClick={() => setModelo((m) => ({ ...m, productos: m.productos.filter((x) => x.uid !== p.uid) }))} className="text-xs inline-flex items-center gap-1 text-rose-700 hover:underline">
              <Trash2 className="w-3.5 h-3.5" /> Borrar producto
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {prod.map((f) => (
              <label key={f.id} className="text-xs">
                <span className="block text-slate-500 mb-0.5">
                  {f.etiqueta || f.interno || '(sin nombre)'} {f.obligatorio && <span className="text-rose-600">*</span>}
                  <span className="font-mono text-slate-400 ml-1">{f.interno}</span>
                </span>
                <ValorInput f={f} value={p.valores[f.id]} onChange={(v) => mapP(p.uid, (x) => ({ ...x, valores: { ...x.valores, [f.id]: v } }))} />
              </label>
            ))}
          </div>

          {vari.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold mb-1">Variantes (una fila por talla + color)</p>
              <div className="overflow-x-auto">
                <table className="text-xs min-w-full">
                  <thead>
                    <tr className="text-left text-slate-500">
                      {vari.map((f) => (
                        <th key={f.id} className="pr-2 pb-1 font-normal whitespace-nowrap">
                          {f.etiqueta || f.interno} <span className="font-mono text-slate-400">{f.interno}</span>
                        </th>
                      ))}
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {p.variantes.map((va) => (
                      <tr key={va.uid}>
                        {vari.map((f) => (
                          <td key={f.id} className="pr-2 pb-1 min-w-32 align-top">
                            <ValorInput
                              f={f}
                              value={va.valores[f.id]}
                              onChange={(v) =>
                                mapP(p.uid, (x) => ({
                                  ...x,
                                  variantes: x.variantes.map((y) => (y.uid === va.uid ? { ...y, valores: { ...y.valores, [f.id]: v } } : y))
                                }))
                              }
                            />
                          </td>
                        ))}
                        <td className="align-top">
                          <button onClick={() => mapP(p.uid, (x) => ({ ...x, variantes: x.variantes.filter((y) => y.uid !== va.uid) }))} className="p-1.5 text-slate-400 hover:text-rose-600" aria-label="Borrar variante">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => agregarVariante(p)} className="mt-2 inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-dashed border-slate-400 hover:bg-slate-50">
                <Plus className="w-3.5 h-3.5" /> Agregar variante
              </button>
            </div>
          )}
        </div>
      ))}
      <button onClick={agregarProducto} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600">
        <Plus className="w-4 h-4" /> Agregar producto
      </button>
    </div>
  );
}

// ---------------- Paso 3 ----------------

function PasoPrueba({ modelo }) {
  const [pi, setPi] = useState(0);
  const [vi, setVi] = useState(0);
  const [email, setEmail] = useState('ana@gmail.com');
  const producto = modelo.productos[pi] || modelo.productos[0];
  if (!producto) return <p className="bg-white rounded-2xl border p-4 text-sm">Primero crea un producto en el paso 2.</p>;
  const variante = producto.variantes[vi] || producto.variantes[0] || null;
  const pidF = modelo.campos.find((f) => f.nivel === 'producto' && f.tipo === 'id');
  const nomF = modelo.campos.find((f) => f.nivel === 'producto' && f.tipo === 'texto');
  const etiquetaP = (p, i) => [p.valores[pidF?.id], p.valores[nomF?.id]].filter(Boolean).join(' · ') || `Producto ${i + 1}`;
  const ev = eventoPractica(modelo, producto, variante, email);
  const c = correoPractica(modelo, producto, variante);
  const datos = [
    ['nombre', 'Nombre del producto'],
    ['talla', 'Talla'],
    ['color', 'Color'],
    ['precio', 'Precio'],
    ['foto', 'Foto']
  ];
  const malos = datos.filter(([k]) => c[k].problema).length;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 grid sm:grid-cols-3 gap-2">
        <label className="text-xs">
          <span className="block text-slate-500 mb-0.5">¿Qué zapato dejó en el carro?</span>
          <select value={pi} onChange={(e) => { setPi(Number(e.target.value)); setVi(0); }} className="w-full text-sm rounded-lg border border-slate-300 px-2 py-1.5 bg-white">
            {modelo.productos.map((p, i) => (
              <option key={p.uid} value={i}>
                {etiquetaP(p, i)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          <span className="block text-slate-500 mb-0.5">¿Qué variante?</span>
          <select value={vi} onChange={(e) => setVi(Number(e.target.value))} disabled={!producto.variantes.length} className="w-full text-sm rounded-lg border border-slate-300 px-2 py-1.5 bg-white">
            {producto.variantes.length === 0 && <option>sin variantes</option>}
            {producto.variantes.map((va, i) => (
              <option key={va.uid} value={i}>
                Variante {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          <span className="block text-slate-500 mb-0.5">Email del cliente</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-sm rounded-lg border border-slate-300 px-2 py-1.5" />
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">El correo que recibiría</h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="bg-amber-500 text-white px-4 py-2 text-sm font-bold">Tu tienda</div>
            <div className="p-4 text-sm space-y-3">
              <p className="font-semibold">Hola, ¿te olvidaste de algo?</p>
              <div className="flex gap-3 items-center border border-slate-100 rounded-lg p-2">
                {c.foto.valor && !c.foto.problema ? (
                  <img src={shoeSvg(c.foto.valor)} alt="" className="w-20 h-14 rounded object-cover" />
                ) : (
                  <div className="w-20 h-14 rounded bg-rose-50 border border-dashed border-rose-300 grid place-items-center text-rose-400">
                    <ImageOff className="w-5 h-5" />
                  </div>
                )}
                <div className="text-xs space-y-0.5 min-w-0">
                  <p className="font-semibold text-sm"><Dato d={c.nombre} /></p>
                  <p>Talla: <Dato d={c.talla} /></p>
                  <p>Color: <Dato d={c.color} /></p>
                  <p>Precio: <Dato d={c.precio} /></p>
                </div>
              </div>
              <span className="inline-block bg-slate-900 text-white rounded-lg px-4 py-2 text-xs font-semibold">Volver a mi carro</span>
            </div>
          </div>
          <p className={`text-sm mt-2 rounded-lg px-3 py-2 border ${malos ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
            {malos ? `${malos} de 5 datos del correo salen mal.` : 'El correo sale completo y correcto.'}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">¿De dónde sacó cada dato?</h3>
          <ul className="space-y-1.5 text-xs">
            {datos.map(([k, label]) => {
              const d = c[k];
              const f = c.mapeo[k];
              return (
                <li key={k} className={`border rounded-lg px-3 py-2 ${d.problema ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'}`}>
                  <b>{label}</b> ←{' '}
                  {f ? (
                    <span>
                      campo <code className="font-mono">{f.interno || '(sin nombre)'}</code> de {f.nivel === 'producto' ? 'Producto' : 'Variante'}
                    </span>
                  ) : (
                    <span>ningún campo</span>
                  )}
                  {d.problema && <span className="block text-rose-800 mt-0.5">{d.problema}</span>}
                </li>
              );
            })}
          </ul>
          <p className="text-[11px] text-slate-500 mt-2">
            El correo busca campos cuyo nombre contenga «nombre», «talla», «color» y «precio», y el campo de tipo Imagen.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-1">Lo que tu tienda le manda al CRM</h3>
        <p className="text-xs text-slate-500 mb-2">
          Fíjate: en el <Termino id="json">JSON</Termino> las listas cerradas viajan con su <b>valor interno</b>{' '}
          (<code>cuero</code>), y el correo muestra la <b>etiqueta</b> (Cuero).
        </p>
        <pre className="text-xs bg-slate-900 text-slate-100 rounded-xl p-3 overflow-x-auto leading-relaxed">{JSON.stringify(ev, null, 2)}</pre>
      </div>
    </div>
  );
}

function Dato({ d }) {
  if (!d.valor) return <span className="bg-rose-100 text-rose-800 rounded px-1">(vacío)</span>;
  if (d.problema) return <span className="bg-rose-100 text-rose-800 rounded px-1 underline decoration-wavy decoration-rose-500">{d.valor}</span>;
  return <span>{d.valor}</span>;
}

// ---------------- Revisor ----------------

function Revisor({ hallazgos }) {
  const errores = hallazgos.filter((h) => h.nivel === 'error').length;
  const avisos = hallazgos.filter((h) => h.nivel === 'warn').length;
  return (
    <aside className="bg-white rounded-2xl border border-slate-200 p-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
      <h3 className="font-semibold flex items-center gap-2">
        <Wrench className="w-4 h-4 text-sky-600" /> Revisor
      </h3>
      <p className="text-sm mt-1">
        {errores + avisos === 0 ? (
          <span className="text-emerald-700 font-semibold">Sin problemas. ¡Tu catálogo está listo para el CRM!</span>
        ) : (
          <>
            <span className="text-rose-700 font-semibold">{errores} error{errores === 1 ? '' : 'es'}</span> ·{' '}
            <span className="text-amber-700 font-semibold">{avisos} aviso{avisos === 1 ? '' : 's'}</span>
          </>
        )}
      </p>
      <ul className="mt-3 space-y-2">
        {hallazgos.map((h, i) => {
          const Icon = h.nivel === 'error' ? XCircle : h.nivel === 'warn' ? AlertTriangle : CheckCircle2;
          const cls = h.nivel === 'error' ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-amber-200 bg-amber-50 text-amber-900';
          return (
            <li key={i} className={`text-sm border rounded-lg px-3 py-2 ${cls}`}>
              <p className="text-[10px] uppercase tracking-wide opacity-70">{h.donde}</p>
              <p className="flex gap-1.5">
                <Icon className="w-4 h-4 shrink-0 mt-0.5" /> {h.texto}
              </p>
              <p className="text-xs mt-1 opacity-90">
                <b>Cómo arreglarlo:</b> {h.arreglo}
              </p>
              {h.terminos.length > 0 && (
                <p className="text-xs mt-0.5">
                  ¿Qué es?{' '}
                  {h.terminos.map((id, k) => (
                    <span key={id}>
                      {k > 0 && ' · '}
                      <Termino id={id}>{terminoById(id)?.termino}</Termino>
                    </span>
                  ))}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
