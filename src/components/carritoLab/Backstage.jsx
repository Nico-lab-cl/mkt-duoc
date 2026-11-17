import {
  Braces,
  Mail,
  MessageCircle,
  Users,
  Search,
  Table,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ImageOff,
  ArrowRight,
  Undo2,
  Ban
} from 'lucide-react';
import { PRODUCTS, clp } from './catalogo';
import {
  RULES,
  buildEvento,
  alertasDeEvento,
  mensajesPermitidos,
  normEmail,
  facetas,
  encontrables,
  jsonLd,
  slug,
  esenciales
} from './motor';

const TABS = [
  { id: 'evento', label: 'Evento', icon: Braces },
  { id: 'mensajes', label: 'Mensajes', icon: Mail },
  { id: 'crm', label: 'CRM', icon: Users },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'ficha', label: 'Catálogo', icon: Table }
];

const ruleName = (id) => RULES.find((r) => r.id === id)?.corto;

// Muestra la foto como URL corta en el JSON (internamente es un SVG inline)
function jsonReplacer(k, v) {
  if (k === 'foto' && v) return `https://pasos.example/img/${this.skuId || this.productId}.png`;
  return v;
}
const pretty = (o) => JSON.stringify(o, jsonReplacer, 2);

export default function Backstage({ tab, setTab, rules, ultima, contactos, pedidos, setPedidos, selected }) {
  const ev = ultima
    ? buildEvento(ultima.tipo, ultima.cart, ultima.cliente, rules, ultima.id, ultima.fecha)
    : null;
  const alertas = ev ? alertasDeEvento(ev, ultima.cliente, rules, ultima.contactosAntes) : [];
  const nErr = alertas.filter((a) => a.nivel === 'error').length;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 min-w-0 lg:sticky lg:top-4">
      <div className="px-4 pt-4">
        <h2 className="font-semibold text-slate-800">Detrás de escena</h2>
        <FlujoDato ultima={ultima} nErr={nErr} />
      </div>
      <nav className="flex gap-1 px-2 mt-3 border-b border-slate-200 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm border-b-2 -mb-px whitespace-nowrap ${
              tab === id
                ? 'border-sky-600 text-sky-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
            {id === 'evento' && nErr > 0 && (
              <span className="ml-0.5 text-[10px] bg-rose-600 text-white rounded-full px-1.5">{nErr}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="p-4 max-h-none lg:max-h-[calc(100vh-180px)] overflow-y-auto">
        {tab === 'evento' && <TabEvento ev={ev} alertas={alertas} ultima={ultima} rules={rules} />}
        {tab === 'mensajes' && <TabMensajes ev={ev} ultima={ultima} rules={rules} />}
        {tab === 'crm' && <TabCrm contactos={contactos} pedidos={pedidos} setPedidos={setPedidos} />}
        {tab === 'seo' && <TabSeo rules={rules} selected={selected} />}
        {tab === 'ficha' && <TabFicha rules={rules} selected={selected} />}
      </div>
    </section>
  );
}

function FlujoDato({ ultima, nErr }) {
  const pasos = ['Tienda', 'Evento', 'CRM', ultima?.tipo === 'pedido' ? 'Pedido' : 'Email / WhatsApp'];
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs">
      {pasos.map((p, i) => (
        <span key={p} className="inline-flex items-center gap-1.5">
          <span
            className={`px-2 py-1 rounded-md border ${
              !ultima
                ? 'border-slate-200 text-slate-400'
                : i > 0 && nErr > 0
                ? 'border-rose-300 bg-rose-50 text-rose-700'
                : 'border-emerald-300 bg-emerald-50 text-emerald-700'
            }`}
          >
            {p}
          </span>
          {i < pasos.length - 1 && <ArrowRight className="w-3 h-3 text-slate-400" />}
        </span>
      ))}
      <span className="text-slate-400 ml-1">· también alimenta Google (pestaña SEO)</span>
    </div>
  );
}

function Vacio({ children }) {
  return <p className="text-sm text-slate-500 bg-slate-50 rounded-xl p-4">{children}</p>;
}

function Alerta({ a }) {
  const Icon = a.nivel === 'error' ? XCircle : a.nivel === 'warn' ? AlertTriangle : CheckCircle2;
  const cls =
    a.nivel === 'error'
      ? 'bg-rose-50 border-rose-200 text-rose-900'
      : a.nivel === 'warn'
      ? 'bg-amber-50 border-amber-200 text-amber-900'
      : 'bg-emerald-50 border-emerald-200 text-emerald-900';
  return (
    <li className={`flex gap-2 items-start text-sm border rounded-lg px-3 py-2 ${cls}`}>
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      <span className="flex-1">
        {a.texto}
        {a.regla && (
          <span className="block text-xs mt-0.5 opacity-80">Lo arregla la regla: «{ruleName(a.regla)}»</span>
        )}
      </span>
    </li>
  );
}

function TabEvento({ ev, alertas, ultima }) {
  if (!ev)
    return (
      <Vacio>
        Todavía no pasa nada. Agrega algo al carro (o carga un escenario), completa nombre y email, y
        <b> abandona</b> o <b>paga</b>. Aquí vas a ver el evento que la tienda le manda al CRM.
      </Vacio>
    );
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        {ultima.tipo === 'abandono' ? 'Carro abandonado' : 'Pedido pagado'} por {ultima.cliente.nombre}. El
        evento se <b>recalcula con las reglas actuales</b>: préndelas y apágalas para ver qué cambia.
      </p>
      <div>
        <h3 className="text-sm font-semibold mb-2">¿Qué problema tendría la automatización?</h3>
        <ul className="space-y-1.5">
          {alertas.map((a, i) => (
            <Alerta key={i} a={a} />
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Lo que viaja de la tienda al CRM (JSON)</h3>
        <pre className="text-xs bg-slate-900 text-slate-100 rounded-xl p-3 overflow-x-auto leading-relaxed">
          {pretty(ev)}
        </pre>
      </div>
    </div>
  );
}

const ambigua = (t) => /[,\s-]/.test(String(t).trim()) || /[A-Za-z]/.test(String(t));

function Marca({ bad, children }) {
  return bad ? (
    <span className="bg-rose-100 text-rose-800 rounded px-1 underline decoration-wavy decoration-rose-500">{children}</span>
  ) : (
    <>{children}</>
  );
}

function TabMensajes({ ev, ultima, rules }) {
  if (!ev || ultima.tipo !== 'abandono')
    return (
      <Vacio>
        Los mensajes de recuperación salen cuando alguien <b>abandona</b> el carro. Llena el carro y usa
        «Cerrar la pestaña (abandonar)».
      </Vacio>
    );
  const c = ultima.cliente;
  const m = mensajesPermitidos(c, rules);
  const it = ev.items[0];
  const material = (i) =>
    i.material_capellada ? `${i.material_capellada} (suela ${i.material_suela.toLowerCase()})` : i.material;

  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-500">
        La automatización se dispara 1 hora después del abandono (acá, al instante) y arma el mensaje sólo con
        los campos del evento. No lee descripciones ni adivina.
      </p>

      {/* Email */}
      <div>
        <Canal titulo="Email de recuperación" icon={Mail} enviado={m.email} permiso={c.okEmail} />
        {m.email && (
          <div className="border border-slate-200 rounded-xl overflow-hidden mt-2">
            <div className="bg-amber-500 text-white px-4 py-2 text-sm font-bold">Pasos · Calzado</div>
            <div className="p-4 text-sm space-y-3">
              <p className="text-xs text-slate-500">
                Para: <code className="bg-slate-100 px-1 rounded">{ev.cliente.email}</code>
              </p>
              <p className="font-semibold">Hola {c.nombre}, ¿te olvidaste de algo?</p>
              {ev.items.map((i, k) => (
                <div key={k} className="flex gap-3 items-center border border-slate-100 rounded-lg p-2">
                  {i.foto ? (
                    <img src={i.foto} alt="" className="w-20 h-14 rounded object-cover" />
                  ) : (
                    <div className="w-20 h-14 rounded bg-rose-50 border border-dashed border-rose-300 grid place-items-center text-rose-400">
                      <ImageOff className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0 text-xs space-y-0.5">
                    <p className="font-semibold text-sm">{i.nombre}</p>
                    <p>
                      Talla: <Marca bad={ambigua(i.talla)}>{i.talla || '—'}</Marca>
                    </p>
                    <p>
                      Color: <Marca bad={/[,/-]/.test(i.color) || i.color !== i.color.trim()}>{i.color}</Marca>
                    </p>
                    <p>
                      Material:{' '}
                      <Marca bad={!material(i) || /sint/i.test(i.material || '')}>{material(i) || '(vacío)'}</Marca>
                    </p>
                  </div>
                  <span className="ml-auto text-sm font-semibold">{clp(i.precio)}</span>
                </div>
              ))}
              <span className="inline-block bg-slate-900 text-white rounded-lg px-4 py-2 text-xs font-semibold">
                Volver a mi carro
              </span>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp */}
      <div>
        <Canal titulo="WhatsApp de recuperación" icon={MessageCircle} enviado={m.whatsapp} permiso={c.okWhatsapp} />
        {m.whatsapp && (
          <div className="mt-2 bg-[#e5ddd5] rounded-xl p-3">
            <div className="max-w-[85%] bg-white rounded-lg rounded-tl-none px-3 py-2 text-sm shadow-sm">
              Hola {c.nombre} 👋 dejaste <b>{it.nombre}</b> talla{' '}
              <Marca bad={ambigua(it.talla)}>{it.talla}</Marca> en tu carro. ¡Quedan pocas unidades!{' '}
              <span className="text-sky-700 underline">pasos.example/carro</span>
              <span className="block text-[10px] text-right text-slate-400 mt-1">para {ev.cliente.telefono}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Canal({ titulo, icon: Icon, enviado, permiso }) {
  let badge;
  if (enviado && !permiso)
    badge = <span className="text-xs bg-rose-600 text-white rounded-full px-2 py-0.5">ENVIADO SIN PERMISO</span>;
  else if (enviado) badge = <span className="text-xs bg-emerald-100 text-emerald-800 rounded-full px-2 py-0.5">Enviado</span>;
  else
    badge = (
      <span className="text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 inline-flex items-center gap-1">
        <Ban className="w-3 h-3" /> No se envía: sin permiso
      </span>
    );
  return (
    <h3 className="text-sm font-semibold flex items-center gap-2 flex-wrap">
      <Icon className="w-4 h-4" /> {titulo} {badge}
    </h3>
  );
}

const visible = (s) => s.replace(/ /g, '␣');

function TabCrm({ contactos, pedidos, setPedidos }) {
  const grupos = contactos.reduce((m, c) => {
    const k = normEmail(c.email);
    m[k] = (m[k] || 0) + 1;
    return m;
  }, {});
  const dupes = Object.values(grupos).filter((n) => n > 1).length;

  const devolver = (pi, ii) =>
    setPedidos((ps) =>
      ps.map((p, j) => {
        if (j !== pi) return p;
        if (!p.modeloSku) return { ...p, devueltoTodo: true, ev: { ...p.ev, estado: 'devuelto' } };
        return {
          ...p,
          ev: { ...p.ev, items: p.ev.items.map((it, k) => (k === ii ? { ...it, estado: 'devuelto' } : it)) }
        };
      })
    );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-1">Contactos ({contactos.length})</h3>
        {dupes > 0 ? (
          <p className="text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mb-2">
            {dupes} persona{dupes > 1 ? 's' : ''} aparece{dupes > 1 ? 'n' : ''} duplicada{dupes > 1 ? 's' : ''}: el
            CRM le va a mandar dos correos, su historial queda partido y no sabes que ya era clienta.
          </p>
        ) : (
          <p className="text-xs text-slate-500 mb-2">La llave del contacto es el email tal como llega en el evento.</p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-1.5 pr-2">Email (llave)</th>
                <th className="pr-2">Nombre</th>
                <th className="pr-2">Consentimiento</th>
                <th className="pr-2 text-center">Carros</th>
                <th className="text-center">Pedidos</th>
              </tr>
            </thead>
            <tbody>
              {contactos.map((c) => {
                const dup = grupos[normEmail(c.email)] > 1;
                return (
                  <tr key={c.email} className={`border-t border-slate-100 ${dup ? 'bg-rose-50' : ''}`}>
                    <td className="py-1.5 pr-2 font-mono">
                      «{visible(c.email)}»
                      {dup && <span className="ml-1 text-[10px] bg-rose-600 text-white rounded px-1">duplicado</span>}
                      {c.nuevo && !dup && <span className="ml-1 text-[10px] bg-sky-100 text-sky-700 rounded px-1">nuevo</span>}
                    </td>
                    <td className="pr-2">{c.nombre}</td>
                    <td className="pr-2">
                      {'general' in c.consent ? (
                        <span>acepta_comunicaciones: {c.consent.general ? 'Sí' : 'No'}</span>
                      ) : (
                        <span className="space-x-1">
                          <Chip ok={c.consent.email}>email</Chip>
                          <Chip ok={c.consent.whatsapp}>whatsapp</Chip>
                        </span>
                      )}
                    </td>
                    <td className="pr-2 text-center">{c.carros}</td>
                    <td className="text-center">{c.pedidos}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-1">Pedidos</h3>
        {pedidos.length === 0 ? (
          <Vacio>Sin pedidos todavía. Prueba el escenario «Compra 3 tallas y devuelve 2».</Vacio>
        ) : (
          <div className="space-y-3">
            {pedidos.map((p, pi) => {
              const comprados = p.devueltoTodo ? 0 : p.ev.items.filter((i) => i.estado !== 'devuelto').length;
              return (
                <div key={p.ev.orderId} className="border border-slate-200 rounded-xl p-3">
                  <div className="flex flex-wrap justify-between gap-2 text-xs">
                    <span className="font-mono font-semibold">{p.ev.orderId}</span>
                    <span className="text-slate-500">
                      {p.ev.cliente.email} · modelo {p.modeloSku ? 'con detalle por SKU' : 'sin SKU (estado en la cabecera)'}
                    </span>
                  </div>
                  {!p.modeloSku && (
                    <p className="text-xs mt-1">
                      Estado del pedido: <b>{p.ev.estado}</b>
                    </p>
                  )}
                  <ul className="mt-2 space-y-1">
                    {p.ev.items.map((it, ii) => {
                      const dev = p.devueltoTodo || it.estado === 'devuelto';
                      return (
                        <li key={ii} className="flex items-center gap-2 text-xs">
                          <span className={`flex-1 ${dev ? 'line-through text-slate-400' : ''}`}>
                            {it.nombre} · talla {it.talla}
                          </span>
                          {p.modeloSku && <span className="text-slate-500">{it.estado}</span>}
                          <button
                            onClick={() => devolver(pi, ii)}
                            disabled={dev}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50"
                          >
                            <Undo2 className="w-3 h-3" /> Devolver
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {p.devueltoTodo && (
                    <p className="text-xs mt-2 text-rose-800 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1.5">
                      Sin detalle por SKU, devolver una talla marca <b>todo el pedido</b> como devuelto. El CRM cree que
                      no compró nada y la mete al flujo de «vuelve a comprar».
                    </p>
                  )}
                  {p.modeloSku && comprados < p.ev.items.length && (
                    <p className="text-xs mt-2 text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1.5">
                      El estado vive en cada ítem: el CRM sabe que se quedó con {comprados} de {p.ev.items.length} y cuál talla
                      le quedó bien.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ ok, children }) {
  return (
    <span className={`inline-block rounded px-1.5 py-0.5 ${ok ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500 line-through'}`}>
      {children}
    </span>
  );
}

function TabSeo({ rules, selected }) {
  const f = facetas(rules);
  const e = encontrables(rules);
  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-500">
        Con los mismos campos la tienda arma los filtros (que Google puede indexar como páginas) y los datos
        estructurados de cada ficha.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Metrica titulo="Buscar «zapatos de cuero»" n={e.cuero} total={e.cueroReal} />
        <Metrica titulo="Buscar «zapatos negros»" n={e.negro} total={e.negroReal} />
      </div>
      <Faceta titulo="Filtro por material" items={f.material} base="material" />
      <Faceta titulo="Filtro por color" items={f.color} base="color" />
      <div>
        <h3 className="text-sm font-semibold mb-1">Datos estructurados (schema.org) de «{selected.nombre}»</h3>
        <p className="text-xs text-slate-500 mb-2">
          {rules.sku
            ? 'Con SKU, cada variante se declara con su talla, color, foto y stock.'
            : 'Sin SKU, Google recibe una sola oferta con todas las tallas en un texto.'}
        </p>
        <pre className="text-xs bg-slate-900 text-slate-100 rounded-xl p-3 overflow-x-auto leading-relaxed">
          {JSON.stringify(jsonLd(selected, rules), null, 2)}
        </pre>
      </div>
    </div>
  );
}

function Metrica({ titulo, n, total }) {
  const ok = n === total;
  return (
    <div className={`rounded-xl border p-3 ${ok ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
      <p className="text-xs text-slate-600">{titulo}</p>
      <p className={`text-2xl font-bold ${ok ? 'text-emerald-700' : 'text-rose-700'}`}>
        {n} <span className="text-sm font-normal text-slate-500">de {total}</span>
      </p>
      <p className="text-[11px] text-slate-500">productos que sí lo son</p>
    </div>
  );
}

function Faceta({ titulo, items, base }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-1">
        {titulo} <span className="font-normal text-slate-400">({items.length} valores)</span>
      </h3>
      <ul className="space-y-1">
        {items.map((it) => {
          const vacio = !it.valor.trim();
          const s = vacio ? '' : slug(it.valor);
          return (
            <li key={it.valor + base} className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`font-mono px-1.5 py-0.5 rounded ${vacio ? 'bg-rose-100 text-rose-700' : 'bg-slate-100'}`}
              >
                «{vacio ? '(vacío)' : visible(it.valor)}»
              </span>
              <span className="text-slate-400">→</span>
              <span className="font-mono text-sky-700">/zapatos/{s || '???'}</span>
              <span className="text-slate-500">
                {it.productos.length} producto{it.productos.length > 1 ? 's' : ''}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TabFicha({ rules, selected }) {
  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-500">
        Así ve la máquina el catálogo con el modelo actual. Los 8 datos esenciales: marca, género, tipo, horma,
        material, color, talla y foto.
      </p>
      <div className="overflow-x-auto">
        <h3 className="text-sm font-semibold mb-1">Tabla Producto</h3>
        <table className="w-full text-xs">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="py-1.5 pr-2">productId</th>
              <th className="pr-2">nombre</th>
              {rules.listas ? (
                <>
                  <th className="pr-2">material_capellada</th>
                  <th className="pr-2">material_suela</th>
                </>
              ) : (
                <th className="pr-2">material</th>
              )}
              {!rules.sku && (
                <>
                  <th className="pr-2">color</th>
                  <th className="pr-2">tallas</th>
                  <th className="pr-2">foto</th>
                </>
              )}
              <th className="text-center">esenciales</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p) => {
              const es = esenciales(p, rules);
              return (
                <tr key={p.productId} className={`border-t border-slate-100 ${p.productId === selected.productId ? 'bg-amber-50' : ''}`}>
                  <td className="py-1.5 pr-2 font-mono">{p.productId}</td>
                  <td className="pr-2">{p.nombre}</td>
                  {rules.listas ? (
                    <>
                      <td className="pr-2">{p.capellada}</td>
                      <td className="pr-2">{p.suela}</td>
                    </>
                  ) : (
                    <td className="pr-2 font-mono">«{visible(p.dirty.material)}»</td>
                  )}
                  {!rules.sku && (
                    <>
                      <td className="pr-2 font-mono">«{visible(rules.listas ? p.colores.join(', ') : p.dirty.color)}»</td>
                      <td className="pr-2 font-mono">«{rules.listas ? p.tallas.join(', ') : p.dirty.tallas}»</td>
                      <td className="pr-2">{p.dirty.foto ? '✓' : <span className="text-rose-600">falta</span>}</td>
                    </>
                  )}
                  <td className="text-center">
                    <span
                      title={es.campos.filter(([, ok]) => !ok).map(([n]) => n).join(', ') || 'completa'}
                      className={`font-semibold ${es.completos === 8 ? 'text-emerald-700' : 'text-rose-700'}`}
                    >
                      {es.completos}/8
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rules.sku ? (
        <div className="overflow-x-auto">
          <h3 className="text-sm font-semibold mb-1">Tabla Variante (SKU) de «{selected.nombre}»</h3>
          <table className="w-full text-xs">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-1.5 pr-2">skuId</th>
                <th className="pr-2">productId (FK)</th>
                <th className="pr-2">talla</th>
                {rules.listas && <th className="pr-2">sistema</th>}
                <th className="pr-2">color</th>
                {rules.listas && <th className="pr-2">plantilla_cm</th>}
                <th>stock</th>
              </tr>
            </thead>
            <tbody>
              {selected.skus.map((s) => (
                <tr key={s.skuId} className="border-t border-slate-100">
                  <td className="py-1.5 pr-2 font-mono">{s.skuId}</td>
                  <td className="pr-2 font-mono">{s.productId}</td>
                  <td className="pr-2">{rules.listas ? s.talla : s.tallaRaw}</td>
                  {rules.listas && <td className="pr-2">CL</td>}
                  <td className="pr-2">{rules.listas ? s.color : (selected.dirty.colorAlias?.[s.color] ?? s.color)}</td>
                  {rules.listas && <td className="pr-2">{s.plantilla_cm.toFixed(1)}</td>}
                  <td>{s.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rules.listas && (
            <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
              Pregunta de realidad: si <code>plantilla_cm</code> no existe hoy en el catálogo, ¿quién mide cada
              zapato con huincha y cuántas horas cuesta?
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
          No existe tabla de variantes: talla, color y foto están metidos como texto en el producto. Prende la
          regla «{ruleName('sku')}» para separarla.
        </p>
      )}
    </div>
  );
}
