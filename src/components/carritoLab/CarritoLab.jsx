import { useMemo, useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  PencilRuler,
  Radio,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ImageOff,
  RotateCcw,
  Footprints,
  Play,
  LogOut,
  CreditCard,
  Lightbulb,
  Wand2,
  Eraser
} from 'lucide-react';
import usePageScroll from '../feedbackDocente/usePageScroll';
import { PRODUCTS, productById, shoeSvg, clp } from './catalogo';
import {
  RULES,
  NO_RULES,
  ALL_RULES,
  buildEvento,
  nuevoId,
  upsertContacto,
  CONTACTOS_INICIALES,
  IDENTIFICACION,
  esAnonimo
} from './motor';
import Backstage from './Backstage';
import ComoFunciona from './ComoFunciona';
import Practica from './Practica';
import Glosario, { Termino } from './Glosario';
import { GlosarioNav } from './navContext';

/**
 * Laboratorio de carrito abandonado → CRM → SEO.
 * Ruta pública: /carrito-lab
 *
 * Una zapatería ficticia donde los alumnos compran o abandonan el carro y ven,
 * al lado, qué dato viaja al CRM, qué correo/WhatsApp sale y qué entiende
 * Google. Las «reglas del modelo» se prenden y apagan para ver cómo cada
 * decisión de datos arregla (o rompe) la automatización y el SEO.
 */

const CLIENTE_VACIO = { ident: 'checkout', nombre: '', email: '', telefono: '', okEmail: true, okWhatsapp: false };

const VISTAS = [
  { id: 'como', label: '¿Cómo funciona?', icon: HelpCircle },
  { id: 'simulador', label: 'Simulador', icon: ShoppingCart },
  { id: 'practica', label: 'Práctica: arma tu catálogo', icon: PencilRuler },
  { id: 'glosario', label: 'Glosario y bibliografía', icon: BookOpen }
];

const vistaInicial = () => {
  const h = window.location.hash.replace('#', '');
  if (h === 'simulador' || h === 'practica') return h;
  if (h === 'glosario' || h.startsWith('g-') || h.startsWith('b-')) return 'glosario';
  return 'como';
};

const ESCENARIOS = [
  {
    id: 'ana',
    titulo: 'Ana escribe su correo con mayúscula',
    cart: [{ productId: 'P-1001', color: 'Negro', talla: '38', qty: 1 }],
    cliente: { ident: 'checkout', nombre: 'Ana', email: ' Ana@Gmail.com ', telefono: '+56 9 1234 5678', okEmail: true, okWhatsapp: false },
    pista: 'Ana ya es clienta (ana@gmail.com), pero esta vez escribió su email con espacios y mayúscula. Apreta «Irse sin pagar» y mira la pestaña CRM.'
  },
  {
    id: 'anonimo',
    titulo: 'Se va sin dejar su email',
    cart: [{ productId: 'P-1002', color: 'Negro', talla: '37', qty: 1 }],
    cliente: { ident: 'anonimo', nombre: '', email: '', telefono: '', okEmail: false, okWhatsapp: false },
    pista: 'Nadie sabe quién es. Apreta «Irse sin pagar»: ¿le puede escribir el CRM? ¿Qué otra opción queda?'
  },
  {
    id: 'talla',
    titulo: 'Talla L y talla 37 en el mismo carro',
    cart: [
      { productId: 'P-1002', color: 'Café', talla: '38', qty: 1 },
      { productId: 'P-1001', color: 'Blanco', talla: '37', qty: 1 }
    ],
    cliente: { ident: 'sesion', nombre: 'Bruno', email: 'bruno.diaz@gmail.com', telefono: '+56 9 5555 1212', okEmail: true, okWhatsapp: true },
    pista: 'Apreta «Irse sin pagar» y mira qué talla llega al correo de recuperación.'
  },
  {
    id: 'bicolor',
    titulo: 'Zapato bicolor y bimaterial',
    cart: [{ productId: 'P-1005', color: 'Café', talla: '41', qty: 1 }],
    cliente: { ident: 'cookie', nombre: 'Camila', email: 'camila.soto@yahoo.com', telefono: '+56 9 4444 3030', okEmail: true, okWhatsapp: false },
    pista: '¿De qué material es? Revisa el evento y la pestaña SEO.'
  },
  {
    id: 'wsp',
    titulo: 'Aceptó email, rechazó WhatsApp',
    cart: [{ productId: 'P-1003', color: 'Azul', talla: '36', qty: 1 }],
    cliente: { ident: 'checkout', nombre: 'Diego', email: 'diego.munoz@gmail.com', telefono: '+56 9 7777 8080', okEmail: true, okWhatsapp: false },
    pista: 'Apreta «Irse sin pagar» y revisa Mensajes. Después prende «Consentimiento por canal» y compara.'
  },
  {
    id: 'devolucion',
    titulo: 'Compra 3 tallas y devuelve 2',
    cart: [
      { productId: 'P-1004', color: 'Negro', talla: '40', qty: 1 },
      { productId: 'P-1004', color: 'Negro', talla: '41', qty: 1 },
      { productId: 'P-1004', color: 'Negro', talla: '42', qty: 1 }
    ],
    cliente: { ident: 'sesion', nombre: 'Elena', email: 'elena.vera@gmail.com', telefono: '+56 9 2222 9090', okEmail: true, okWhatsapp: true },
    pista: 'Paga, ve a CRM → Pedidos y devuelve 2 de las 3 tallas.'
  }
];

export default function CarritoLab() {
  usePageScroll();
  const [rules, setRules] = useState(NO_RULES);
  const [selectedId, setSelectedId] = useState(PRODUCTS[0].productId);
  const [pick, setPick] = useState({ color: PRODUCTS[0].colores[0], talla: null });
  const [cart, setCart] = useState([]);
  const [cliente, setCliente] = useState(CLIENTE_VACIO);
  const [contactos, setContactos] = useState(CONTACTOS_INICIALES);
  const [pedidos, setPedidos] = useState([]);
  const [ultima, setUltima] = useState(null); // { tipo, cart, cliente, contactosAntes }
  const [tab, setTab] = useState('evento');
  const [pista, setPista] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [capturado, setCapturado] = useState(false);
  const [vista, setVista] = useState(vistaInicial);
  const [resaltado, setResaltado] = useState(() => {
    const h = window.location.hash;
    return h.startsWith('#g-') ? h.slice(3) : null;
  });

  const selected = productById(selectedId);
  const total = useMemo(
    () => cart.reduce((s, l) => s + productById(l.productId).precio * l.qty, 0),
    [cart]
  );
  const nItems = cart.reduce((s, l) => s + l.qty, 0);

  const elegir = (p) => {
    setSelectedId(p.productId);
    setPick({ color: p.colores[0], talla: null });
  };

  const agregar = () => {
    if (!pick.talla) return;
    setCart((c) => {
      const i = c.findIndex(
        (l) => l.productId === selectedId && l.color === pick.color && l.talla === pick.talla
      );
      if (i >= 0) return c.map((l, j) => (j === i ? { ...l, qty: l.qty + 1 } : l));
      return [...c, { productId: selectedId, color: pick.color, talla: pick.talla, qty: 1 }];
    });
  };

  const cambiarQty = (i, d) =>
    setCart((c) =>
      c.map((l, j) => (j === i ? { ...l, qty: l.qty + d } : l)).filter((l) => l.qty > 0)
    );

  const anonimo = esAnonimo(cliente);
  const tieneEmail = !anonimo && cliente.email.trim() !== '';
  const puedeAbandonar = cart.length > 0 && (anonimo || tieneEmail);
  const puedePagar = cart.length > 0 && tieneEmail;

  const ejecutar = (tipo) => {
    if (tipo === 'abandono' ? !puedeAbandonar : !puedePagar) return;
    const ev = buildEvento(tipo, cart, cliente, rules, nuevoId(tipo));
    setUltima({ tipo, cart, cliente, contactosAntes: contactos, id: ev.cartId || ev.orderId, fecha: ev.fecha });
    if (!anonimo) setContactos((cs) => upsertContacto(cs, ev, cliente, rules, tipo));
    if (tipo === 'pedido') {
      setPedidos((ps) => [{ ev, modeloSku: rules.sku, devueltoTodo: false }, ...ps]);
      setCart([]);
      setAviso('Pedido pagado. Míralo en la pestaña CRM, sección Pedidos.');
      setTab('crm');
    } else {
      setAviso(
        anonimo
          ? 'Te fuiste sin dejar datos. La tienda ve un carro abandonado, pero no sabe de quién es.'
          : 'Te fuiste. La tienda no recibe ningún aviso en ese momento: espera a que venza la sesión (en VTEX, 30 minutos) y, como no hubo pago, le avisa al CRM. Mira la pestaña Mensajes.'
      );
      setTab('mensajes');
    }
    window.setTimeout(() => setAviso(null), 7000);
  };

  const cargarEscenario = (e) => {
    setCart(e.cart.map((l) => ({ ...l })));
    setCliente({ ...e.cliente });
    setCapturado(false);
    setPista(e);
    setVista('simulador');
    elegir(productById(e.cart[0].productId));
  };

  const irA = (v) => {
    setVista(v);
    setResaltado(null);
    window.history.replaceState(null, '', `#${v}`);
    window.scrollTo(0, 0);
  };

  const verTermino = (id) => {
    setVista('glosario');
    setResaltado(id);
    window.history.replaceState(null, '', `#g-${id}`);
    window.setTimeout(() => document.getElementById(`g-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const reiniciar = () => {
    setRules(NO_RULES);
    setCart([]);
    setCliente(CLIENTE_VACIO);
    setContactos(CONTACTOS_INICIALES);
    setPedidos([]);
    setUltima(null);
    setPista(null);
    setCapturado(false);
    setTab('evento');
  };

  const fotoTienda = rules.sku ? shoeSvg(pick.color) : selected.dirty.foto ? shoeSvg(selected.dirty.foto) : null;
  const nOn = Object.values(rules).filter(Boolean).length;

  return (
    <GlosarioNav.Provider value={{ verTermino }}>
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Encabezado */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-5 flex flex-wrap items-center gap-4 justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-sky-300 font-semibold">
              Laboratorio Martech · Taller Aplicado
            </p>
            <h1 className="text-xl sm:text-2xl font-bold">Carrito abandonado → CRM → SEO</h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Compra o abandona el carro en una tienda de prueba y mira qué datos viajan, qué mensaje sale y qué
              entiende Google.
            </p>
          </div>
          {vista === 'simulador' && (
            <button
              onClick={reiniciar}
              className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4" /> Reiniciar todo
            </button>
          )}
        </div>
        <nav className="max-w-[1500px] mx-auto px-2 sm:px-4 mt-4 flex gap-1 overflow-x-auto">
          {VISTAS.map(({ id, label, icon: Icon }, i) => (
            <button
              key={id}
              onClick={() => irA(id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-t-xl whitespace-nowrap ${
                vista === id ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" /> {i + 1}. {label}
            </button>
          ))}
        </nav>
      </header>

      {vista === 'como' && <ComoFunciona irA={irA} />}
      {vista === 'glosario' && <Glosario resaltado={resaltado} />}
      {vista === 'practica' && <Practica />}

      {vista === 'simulador' && (
      <>
      {/* Reglas del modelo */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center gap-2 justify-between mb-3">
            <h2 className="font-semibold text-slate-800">
              Reglas del modelo de datos{' '}
              <span className="text-slate-400 font-normal">({nOn} de {RULES.length} activas)</span>
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setRules(NO_RULES)}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-slate-300 hover:bg-slate-50"
              >
                <Eraser className="w-3.5 h-3.5" /> Así está hoy
              </button>
              <button
                onClick={() => setRules(ALL_RULES)}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Wand2 className="w-3.5 h-3.5" /> Modelo propuesto
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-2">
            {RULES.map((r, i) => {
              const on = rules[r.id];
              return (
                <div
                  key={r.id}
                  className={`p-3 rounded-xl border transition ${
                    on ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => setRules((x) => ({ ...x, [r.id]: !x[r.id] }))}
                    aria-pressed={on}
                    className="text-left w-full flex items-start gap-2"
                  >
                    <span
                      className={`mt-0.5 shrink-0 w-9 h-5 rounded-full relative transition ${
                        on ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          on ? 'left-[18px]' : 'left-0.5'
                        }`}
                      />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        {i + 1}. {r.titulo}
                      </span>
                      <span className="block text-xs text-slate-500 mt-1 leading-snug">{r.explica}</span>
                    </span>
                  </button>
                  <p className="text-xs text-slate-500 mt-1.5 pl-11">
                    ¿Qué es?{' '}
                    {r.terminos.map(([id, txt], k) => (
                      <span key={id}>
                        {k > 0 && ' · '}
                        <Termino id={id}>{txt}</Termino>
                      </span>
                    ))}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 py-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-start">
        {/* ---------- TIENDA ---------- */}
        <section className="space-y-4 min-w-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Play className="w-4 h-4 text-sky-600" /> Escenarios de la guía
            </h3>
            <div className="flex flex-wrap gap-2">
              {ESCENARIOS.map((e) => (
                <button
                  key={e.id}
                  onClick={() => cargarEscenario(e)}
                  className={`text-xs px-3 py-1.5 rounded-full border ${
                    pista?.id === e.id
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {e.titulo}
                </button>
              ))}
            </div>
            {pista && (
              <p className="mt-3 text-sm text-sky-900 bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 flex gap-2">
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" /> {pista.pista}
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-amber-50">
              <span className="font-bold text-amber-900 flex items-center gap-2">
                <Footprints className="w-5 h-5" /> Pasos · Calzado
                <span className="text-[10px] font-medium uppercase tracking-wide bg-amber-200/70 text-amber-900 rounded px-1.5 py-0.5">
                  tienda ficticia
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-amber-900">
                <ShoppingCart className="w-4 h-4" /> {nItems}
              </span>
            </div>

            {/* Grilla de productos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3">
              {PRODUCTS.map((p) => {
                const foto = p.dirty.foto || rules.sku ? shoeSvg(rules.sku ? p.colores[0] : p.dirty.foto) : null;
                return (
                  <button
                    key={p.productId}
                    onClick={() => elegir(p)}
                    className={`text-left rounded-xl border p-2 transition ${
                      selectedId === p.productId
                        ? 'border-amber-500 ring-2 ring-amber-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {foto ? (
                      <img src={foto} alt="" className="w-full aspect-[3/2] rounded-lg object-cover" />
                    ) : (
                      <div className="w-full aspect-[3/2] rounded-lg bg-slate-100 grid place-items-center text-slate-400">
                        <ImageOff className="w-6 h-6" />
                      </div>
                    )}
                    <span className="block text-sm font-medium mt-1.5 leading-tight">{p.nombre}</span>
                    <span className="block text-xs text-slate-500">{clp(p.precio)}</span>
                  </button>
                );
              })}
            </div>

            {/* Ficha del producto */}
            <div className="border-t border-slate-200 p-4 grid sm:grid-cols-[180px_1fr] gap-4">
              {fotoTienda ? (
                <img src={fotoTienda} alt="" className="w-full aspect-[3/2] rounded-xl object-cover" />
              ) : (
                <div className="w-full aspect-[3/2] rounded-xl bg-slate-100 grid place-items-center text-slate-400 text-xs gap-1">
                  <ImageOff className="w-7 h-7" /> sin foto
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs text-slate-500">
                  {selected.marca} · {selected.tipo} · {selected.genero} · horma {selected.horma.toLowerCase()}
                </p>
                <h3 className="font-bold text-lg leading-tight">{selected.nombre}</h3>
                <p className="text-sm text-slate-600 mt-1">{selected.descripcion}</p>
                <p className="text-xs mt-2 text-slate-700">
                  {rules.listas ? (
                    <>
                      <b>Capellada:</b> {selected.capellada} · <b>Suela:</b> {selected.suela}
                    </>
                  ) : (
                    <>
                      <b>Material:</b>{' '}
                      {selected.dirty.material || <span className="italic text-slate-400">(vacío)</span>}
                    </>
                  )}
                </p>

                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Color</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {selected.colores.map((c) => (
                      <button
                        key={c}
                        onClick={() => setPick((x) => ({ ...x, color: c }))}
                        className={`text-xs px-2.5 py-1 rounded-full border ${
                          pick.color === c ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300'
                        }`}
                      >
                        {rules.listas ? c : (selected.dirty.colorAlias?.[c] ?? c)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-600 mb-1">
                    Talla {rules.listas && <span className="font-normal text-slate-400">(chilena)</span>}
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {selected.skus
                      .filter((s) => s.color === pick.color)
                      .map((s) => (
                        <button
                          key={s.skuId}
                          onClick={() => setPick((x) => ({ ...x, talla: s.talla }))}
                          className={`min-w-10 text-sm px-2.5 py-1 rounded-lg border ${
                            pick.talla === s.talla
                              ? 'border-amber-600 bg-amber-500 text-white'
                              : 'border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {rules.listas ? s.talla : s.tallaRaw}
                          {rules.listas && s.tallaRaw !== s.talla && (
                            <span className="text-[10px] opacity-70"> ({s.tallaRaw})</span>
                          )}
                        </button>
                      ))}
                  </div>
                </div>

                <button
                  onClick={agregar}
                  disabled={!pick.talla}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white font-semibold text-sm disabled:opacity-40 hover:bg-amber-600"
                >
                  <Plus className="w-4 h-4" /> Agregar al carro
                </button>
              </div>
            </div>
          </div>

          {/* Carro + checkout */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Tu carro
            </h3>
            {cart.length === 0 ? (
              <p className="text-sm text-slate-500 mt-2">Vacío. Agrega un zapato o carga un escenario.</p>
            ) : (
              <ul className="mt-2 divide-y divide-slate-100">
                {cart.map((l, i) => {
                  const p = productById(l.productId);
                  return (
                    <li key={i} className="py-2 flex items-center gap-3 text-sm">
                      <img src={shoeSvg(l.color)} alt="" className="w-12 h-8 rounded object-cover" />
                      <span className="flex-1 min-w-0">
                        <span className="block font-medium truncate">{p.nombre}</span>
                        <span className="block text-xs text-slate-500">
                          {l.color} · talla {rules.listas ? l.talla : (p.tallasRaw?.[l.talla] ?? l.talla)}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <button onClick={() => cambiarQty(i, -1)} className="p-1 rounded hover:bg-slate-100" aria-label="Quitar uno">
                          {l.qty === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                        </button>
                        <span className="w-5 text-center">{l.qty}</span>
                        <button onClick={() => cambiarQty(i, 1)} className="p-1 rounded hover:bg-slate-100" aria-label="Agregar uno">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </span>
                      <span className="w-20 text-right">{clp(p.precio * l.qty)}</span>
                    </li>
                  );
                })}
                <li className="py-2 flex justify-between font-semibold text-sm">
                  <span>Total</span>
                  <span>{clp(total)}</span>
                </li>
              </ul>
            )}

            <div className="mt-4 border-t border-slate-100 pt-3">
              <p className="text-sm font-semibold">¿Cómo sabe la tienda quién eres?</p>
              <div className="grid sm:grid-cols-2 gap-2 mt-2">
                {IDENTIFICACION.map((i) => (
                  <label
                    key={i.id}
                    className={`flex gap-2 p-2.5 rounded-lg border cursor-pointer text-sm ${
                      cliente.ident === i.id ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ident"
                      className="mt-1"
                      checked={cliente.ident === i.id}
                      onChange={() => {
                        setCliente((c) => ({ ...c, ident: i.id }));
                        setCapturado(false);
                      }}
                    />
                    <span>
                      <span className="block font-medium leading-snug">{i.titulo}</span>
                      <span className="block text-xs text-slate-500 mt-0.5">{i.detalle}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {anonimo ? (
              <p className="text-sm mt-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600">
                No escribe nada. La tienda sólo sabe que «alguien» dejó algo en el carro: lo reconoce por una{' '}
                <Termino id="cookie">cookie</Termino> anónima (anon-8f2c1a), sin nombre ni email.
              </p>
            ) : (
              <>
                <p className="text-xs font-semibold text-slate-500 mt-4 uppercase tracking-wide">
                  {cliente.ident === 'checkout'
                    ? 'Checkout · Paso 1 de 3: tu email'
                    : cliente.ident === 'sesion'
                    ? 'Datos guardados en tu cuenta'
                    : 'Datos que dejaste en el newsletter'}
                </p>
                <div className="grid sm:grid-cols-3 gap-2 mt-1">
                  <Campo
                    label="Email"
                    value={cliente.email}
                    onChange={(v) => setCliente((c) => ({ ...c, email: v }))}
                    onBlur={() => cliente.ident === 'checkout' && cliente.email.trim() && setCapturado(true)}
                    hint="Prueba con espacios o mayúsculas"
                  />
                  <Campo
                    label="Nombre (opcional)"
                    value={cliente.nombre}
                    onChange={(v) => setCliente((c) => ({ ...c, nombre: v }))}
                  />
                  <Campo
                    label="Teléfono (opcional)"
                    value={cliente.telefono}
                    onChange={(v) => setCliente((c) => ({ ...c, telefono: v }))}
                  />
                </div>
                {cliente.ident === 'checkout' && capturado && (
                  <p className="text-xs mt-2 inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                    <Radio className="w-3.5 h-3.5" /> La tienda ya guardó tu email junto al carro. No apretaste ningún botón.
                  </p>
                )}
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={cliente.okEmail}
                      onChange={(e) => setCliente((c) => ({ ...c, okEmail: e.target.checked }))}
                    />
                    Acepto recibir ofertas por email
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={cliente.okWhatsapp}
                      onChange={(e) => setCliente((c) => ({ ...c, okWhatsapp: e.target.checked }))}
                    />
                    Acepto recibir mensajes por WhatsApp
                  </label>
                </div>
              </>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => ejecutar('abandono')}
                disabled={!puedeAbandonar}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold disabled:opacity-40 hover:bg-rose-700"
              >
                <LogOut className="w-4 h-4" /> Irse sin pagar
                <span className="font-normal opacity-80">(cerrar la pestaña)</span>
              </button>
              <button
                onClick={() => ejecutar('pedido')}
                disabled={!puedePagar}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold disabled:opacity-40 hover:bg-slate-700"
              >
                <CreditCard className="w-4 h-4" /> Pagar
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {cart.length === 0
                ? 'Agrega algo al carro o carga un escenario.'
                : anonimo
                ? 'Para pagar siempre hay que dar un email. Como visitante anónimo sólo puedes irte.'
                : !tieneEmail
                ? 'Escribe un email, o elige «Nadie: visitante anónimo».'
                : ''}
            </p>
            {aviso && (
              <p className="text-sm mt-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">{aviso}</p>
            )}
          </div>
        </section>

        {/* ---------- DETRÁS DE ESCENA ---------- */}
        <Backstage
          tab={tab}
          setTab={setTab}
          rules={rules}
          ultima={ultima}
          contactos={contactos}
          pedidos={pedidos}
          setPedidos={setPedidos}
          selected={selected}
        />
      </main>
      </>
      )}

      <footer className="max-w-[1500px] mx-auto px-4 sm:px-6 pb-8 pt-2 text-xs text-slate-400">
        Simulación con datos ficticios. No se guarda ni se envía nada: todo ocurre en tu navegador.
      </footer>
    </div>
    </GlosarioNav.Provider>
  );
}

function Campo({ label, value, onChange, onBlur, hint }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-600 mb-1">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={hint}
        className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
      />
    </label>
  );
}
