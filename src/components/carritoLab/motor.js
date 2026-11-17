// Motor del laboratorio: traduce lo que el cliente hace en la tienda a los
// datos que viajan al CRM y a Google, según qué reglas del modelo de datos
// estén activas. Todo es local: no hay backend ni CRM real.

import { PRODUCTS, productById, skuOf, shoeSvg } from './catalogo';

export const RULES = [
  {
    id: 'sku',
    titulo: 'Talla, color y foto viven en la variante (SKU)',
    corto: 'SKU por variante',
    explica:
      'Cada combinación talla + color es una fila propia con su skuId. Sin esto, el carrito sólo sabe qué producto dejaste, no qué talla ni qué foto.'
  },
  {
    id: 'listas',
    titulo: 'Listas cerradas: material, color y sistema de talla',
    corto: 'Listas cerradas',
    explica:
      'Material y color se eligen de una lista, no se escriben a mano. Las tallas se guardan en un solo sistema (chileno) con tabla de equivalencias.'
  },
  {
    id: 'email',
    titulo: 'Email normalizado (TRIM + minúsculas) antes de cruzar',
    corto: 'Email normalizado',
    explica:
      'El email es la llave para encontrar al cliente en el CRM. « Ana@Gmail.com » y «ana@gmail.com» deben ser la misma persona.'
  },
  {
    id: 'consent',
    titulo: 'Consentimiento por canal (email / WhatsApp)',
    corto: 'Consentimiento por canal',
    explica:
      'El permiso se guarda por canal en su propia tabla. Un simple «acepta comunicaciones: Sí» no distingue si aceptó email pero rechazó WhatsApp.'
  }
];

export const NO_RULES = { sku: false, listas: false, email: false, consent: false };
export const ALL_RULES = { sku: true, listas: true, email: true, consent: true };

export const normEmail = (e) => (e || '').trim().toLowerCase();

const fmtFecha = () =>
  new Date().toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });

/** Cómo queda una línea del carrito una vez convertida en dato. */
export function lineaComoDato(line, rules) {
  const p = productById(line.productId);
  const d = p.dirty;
  const sku = skuOf(p, line.color, line.talla);
  const material = rules.listas
    ? { material_capellada: p.capellada, material_suela: p.suela }
    : { material: d.material };

  if (!rules.sku) {
    return {
      productId: p.productId,
      nombre: p.nombre,
      ...material,
      color: rules.listas ? p.colores.join(', ') : d.color,
      talla: rules.listas ? p.tallas.join(', ') : d.tallas,
      foto: d.foto ? shoeSvg(d.foto) : null,
      precio: p.precio,
      cantidad: line.qty
    };
  }
  return {
    skuId: sku.skuId,
    productId: p.productId,
    nombre: p.nombre,
    ...material,
    color: rules.listas ? sku.color : (d.colorAlias?.[sku.color] ?? sku.color),
    talla: rules.listas ? sku.talla : sku.tallaRaw,
    ...(rules.listas ? { sistema_talla: 'CL', plantilla_cm: sku.plantilla_cm } : {}),
    foto: shoeSvg(sku.color),
    precio: p.precio,
    cantidad: line.qty
  };
}

function clienteComoDato(cliente, rules) {
  return {
    email: rules.email ? normEmail(cliente.email) : cliente.email,
    nombre: cliente.nombre,
    telefono: cliente.telefono
  };
}

function consentComoDato(cliente, rules) {
  if (rules.consent) {
    return [
      { canal: 'email', estado: cliente.okEmail ? 'opt-in' : 'opt-out' },
      { canal: 'whatsapp', estado: cliente.okWhatsapp ? 'opt-in' : 'opt-out' }
    ];
  }
  return { acepta_comunicaciones: cliente.okEmail || cliente.okWhatsapp ? 'Sí' : 'No' };
}

let seq = 4100;
export const nuevoId = (tipo) => `${tipo === 'abandono' ? 'CART' : 'ORD'}-${++seq}`;

export function buildEvento(tipo, cart, cliente, rules, id, fecha = fmtFecha()) {
  const items = cart.map((l) => lineaComoDato(l, rules));
  const base = {
    evento: tipo === 'abandono' ? 'carrito_abandonado' : 'pedido_pagado',
    [tipo === 'abandono' ? 'cartId' : 'orderId']: id,
    fecha,
    cliente: clienteComoDato(cliente, rules),
    consentimiento: consentComoDato(cliente, rules)
  };
  if (tipo === 'pedido' && !rules.sku) {
    // Sin detalle por SKU, el estado y la talla viven en la cabecera del pedido
    return { ...base, estado: 'pagado', items };
  }
  return {
    ...base,
    items: tipo === 'pedido' ? items.map((i) => ({ ...i, estado: 'comprado' })) : items
  };
}

const esTallaAmbigua = (t) => /[,\s-]/.test(String(t).trim());
const esTallaNoChilena = (t) => /[A-Za-z]/.test(String(t));

/** Problemas que tendría la automatización con este evento. */
export function alertasDeEvento(ev, cliente, rules, contactos) {
  const out = [];
  const add = (nivel, texto, regla) => out.push({ nivel, texto, regla });

  ev.items.forEach((it) => {
    const p = productById(it.productId);
    if (esTallaAmbigua(it.talla))
      add(
        'error',
        `«${it.nombre}»: el evento dice talla «${it.talla}». El correo no sabe cuál dejó en el carro.`,
        'sku'
      );
    else if (esTallaNoChilena(it.talla))
      add(
        'warn',
        `«${it.nombre}»: talla «${it.talla}» convive con tallas 37, 38… sin sistema_talla. No se puede segmentar ni filtrar por talla.`,
        'listas'
      );
    if (!it.foto)
      add('error', `«${it.nombre}»: no hay foto. El correo sale con la imagen rota.`, 'sku');
    else if (!rules.sku && p.colores.length > 1)
      add(
        'warn',
        `«${it.nombre}»: la foto es la del producto, no la de la variante. Puede mostrar otro color del que eligió.`,
        'sku'
      );
    if (!rules.listas) {
      if (!p.dirty.material)
        add('error', `«${it.nombre}»: material vacío. No aparece en ningún filtro.`, 'listas');
      else if (p.dirty.material.toLowerCase().includes('sint') && p.capellada === 'Cuero' && p.suela !== 'Sintético')
        add(
          'error',
          `«${it.nombre}»: el campo dice ${p.dirty.material}, la descripción dice cuero. ¿A quién le cree la automatización?`,
          'listas'
        );
      else if (p.dirty.material.includes('/'))
        add(
          'warn',
          `«${it.nombre}»: «${p.dirty.material}» en un solo campo. Es bimaterial: hace falta capellada y suela por separado.`,
          'listas'
        );
    }
  });

  if (ev.cliente.email !== normEmail(ev.cliente.email)) {
    const yaExiste = contactos.some(
      (c) => c.email !== ev.cliente.email && normEmail(c.email) === normEmail(ev.cliente.email)
    );
    add(
      yaExiste ? 'error' : 'warn',
      yaExiste
        ? `Email «${ev.cliente.email}» sin normalizar: el CRM ya tiene a «${normEmail(ev.cliente.email)}» y crea un contacto duplicado.`
        : `Email «${ev.cliente.email}» sin normalizar (espacios o mayúsculas). La próxima vez que escriba bien su correo será «otra persona».`,
      'email'
    );
  }

  const m = mensajesPermitidos(cliente, rules);
  if (m.whatsapp && !cliente.okWhatsapp)
    add('error', 'Se envía WhatsApp a alguien que NO dio permiso para ese canal.', 'consent');
  if (m.email && !cliente.okEmail)
    add('error', 'Se envía email a alguien que NO dio permiso para ese canal.', 'consent');

  if (!out.length) add('ok', 'Datos limpios: la automatización puede armar el mensaje sin adivinar nada.');
  return out;
}

/** Qué canales dispara la automatización según el modelo de consentimiento. */
export function mensajesPermitidos(cliente, rules) {
  if (rules.consent) return { email: cliente.okEmail, whatsapp: cliente.okWhatsapp };
  const general = cliente.okEmail || cliente.okWhatsapp;
  return { email: general, whatsapp: general };
}

/** Registra o actualiza al cliente en el CRM simulado. */
export function upsertContacto(contactos, ev, cliente, rules, tipo) {
  const key = ev.cliente.email;
  const consent = rules.consent
    ? { email: cliente.okEmail, whatsapp: cliente.okWhatsapp }
    : { general: cliente.okEmail || cliente.okWhatsapp };
  const existe = contactos.find((c) => c.email === key);
  if (existe) {
    return contactos.map((c) =>
      c.email === key
        ? {
            ...c,
            nombre: cliente.nombre || c.nombre,
            consent,
            carros: c.carros + (tipo === 'abandono' ? 1 : 0),
            pedidos: c.pedidos + (tipo === 'pedido' ? 1 : 0)
          }
        : c
    );
  }
  return [
    ...contactos,
    {
      email: key,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      consent,
      carros: tipo === 'abandono' ? 1 : 0,
      pedidos: tipo === 'pedido' ? 1 : 0,
      nuevo: true
    }
  ];
}

export const CONTACTOS_INICIALES = [
  {
    email: 'ana@gmail.com',
    nombre: 'Ana Pérez',
    telefono: '+56 9 1234 5678',
    consent: { email: true, whatsapp: false },
    carros: 0,
    pedidos: 2
  },
  {
    email: 'jose.rojas@outlook.com',
    nombre: 'José Rojas',
    telefono: '+56 9 8765 4321',
    consent: { email: true, whatsapp: true },
    carros: 1,
    pedidos: 0
  }
];

// ---------- SEO ----------

const sinTildes = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Valores de filtro (facetas) que generaría la tienda con el catálogo actual. */
export function facetas(rules) {
  const material = new Map();
  const color = new Map();
  const push = (map, k, nombre) => {
    if (!map.has(k)) map.set(k, new Set());
    map.get(k).add(nombre);
  };
  PRODUCTS.forEach((p) => {
    if (rules.listas) {
      push(material, p.capellada, p.nombre);
      p.colores.forEach((c) => push(color, c, p.nombre));
    } else {
      push(material, p.dirty.material, p.nombre);
      push(color, p.dirty.color, p.nombre);
    }
  });
  const toArr = (map) =>
    [...map.entries()]
      .map(([valor, set]) => ({ valor, productos: [...set] }))
      .sort((a, b) => b.productos.length - a.productos.length);
  return { material: toArr(material), color: toArr(color) };
}

/** Cuántos productos realmente de cuero / negros encuentra un filtro exacto. */
export function encontrables(rules) {
  const f = facetas(rules);
  const cueroReal = PRODUCTS.filter((p) => p.capellada === 'Cuero').length;
  const negroReal = PRODUCTS.filter((p) => p.colores.includes('Negro')).length;
  const cuero = f.material.find((x) => x.valor === 'Cuero')?.productos.length || 0;
  const negro = f.color.find((x) => x.valor === 'Negro')?.productos.length || 0;
  return { cuero, cueroReal, negro, negroReal };
}

export const slug = (s) =>
  sinTildes(String(s))
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function jsonLd(p, rules) {
  if (!rules.sku) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.nombre,
      brand: p.marca,
      description: p.descripcion,
      material: rules.listas ? p.capellada : p.dirty.material,
      color: rules.listas ? p.colores.join(', ') : p.dirty.color,
      size: rules.listas ? p.tallas.join(', ') : p.dirty.tallas,
      image: p.dirty.foto ? `https://pasos.example/img/${p.productId}.png` : null,
      offers: { '@type': 'Offer', price: p.precio, priceCurrency: 'CLP' }
    };
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    productGroupID: p.productId,
    name: p.nombre,
    brand: p.marca,
    description: p.descripcion,
    variesBy: ['https://schema.org/size', 'https://schema.org/color'],
    hasVariant: p.skus.slice(0, 3).map((s) => ({
      '@type': 'Product',
      sku: s.skuId,
      color: rules.listas ? s.color : (p.dirty.colorAlias?.[s.color] ?? s.color),
      size: rules.listas ? { '@type': 'SizeSpecification', name: s.talla, sizeSystem: 'CL' } : s.tallaRaw,
      material: rules.listas ? p.capellada : p.dirty.material,
      image: `https://pasos.example/img/${s.skuId}.png`,
      offers: {
        '@type': 'Offer',
        price: p.precio,
        priceCurrency: 'CLP',
        availability: s.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
      }
    })),
    '…': `${p.skus.length - 3} variantes más`
  };
}

/** Los 8 datos esenciales de una ficha y si están bien declarados. */
export function esenciales(p, rules) {
  const d = p.dirty;
  const ok = (v) => v !== null && v !== undefined && String(v).trim() !== '';
  const materialOk = rules.listas
    ? true
    : ok(d.material) && !(d.material.toLowerCase().includes('sint') && p.capellada === 'Cuero' && p.suela !== 'Sintético') && !d.material.includes('/');
  const colorOk = rules.listas || (ok(d.color) && /^[A-ZÁÉÍÓÚ][a-záéíóú]+$/.test(d.color));
  const tallaOk = rules.sku && rules.listas;
  const fotoOk = rules.sku || ok(d.foto);
  const campos = [
    ['marca', true],
    ['género', true],
    ['tipo', true],
    ['horma', true],
    ['material', materialOk],
    ['color', colorOk],
    ['talla', tallaOk],
    ['foto', fotoOk]
  ];
  return { campos, completos: campos.filter(([, v]) => v).length };
}
