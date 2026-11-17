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
      'Cada combinación de talla y color es una fila propia, con su código (skuId). Sin esto, el carro sólo sabe qué modelo dejaste, no qué talla ni qué foto.',
    terminos: [['sku', 'SKU'], ['llave', 'skuId']]
  },
  {
    id: 'listas',
    titulo: 'Listas cerradas: material, color y sistema de talla',
    corto: 'Listas cerradas',
    explica:
      'Material y color se eligen de un menú, no se escriben a mano. Todas las tallas quedan en número chileno (la L pasa a ser 38).',
    terminos: [['lista-cerrada', 'Lista cerrada'], ['sistema-talla', 'Sistema de talla']]
  },
  {
    id: 'email',
    titulo: 'Limpiar el email antes de guardarlo (TRIM + minúsculas)',
    corto: 'Email limpio',
    explica:
      'Se borran los espacios sobrantes y se pasa todo a minúsculas. Así « Ana@Gmail.com » y «ana@gmail.com» son la misma persona en el CRM.',
    terminos: [['trim', 'TRIM'], ['normalizar', 'Normalizar']]
  },
  {
    id: 'consent',
    titulo: 'Consentimiento por canal (email / WhatsApp)',
    corto: 'Consentimiento por canal',
    explica:
      'El permiso se guarda por separado para email y para WhatsApp. Un solo «acepta comunicaciones: Sí» no sabe si aceptó email y rechazó WhatsApp.',
    terminos: [['consentimiento', 'Opt-in / opt-out']]
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

// Cómo llega la tienda a saber quién es el cliente que abandonó el carro
export const IDENTIFICACION = [
  {
    id: 'checkout',
    titulo: 'Escribió su email en el paso 1 del checkout',
    corto: 'email en el checkout',
    detalle: 'La tienda pide el email antes que todo. Se guarda apenas lo escribe, aunque nunca apriete «Pagar».'
  },
  {
    id: 'sesion',
    titulo: 'Tenía su cuenta abierta (sesión iniciada)',
    corto: 'sesión iniciada',
    detalle: 'La tienda sabe quién es desde que entró, sin que escriba nada.'
  },
  {
    id: 'cookie',
    titulo: 'Se suscribió antes al newsletter (cookie)',
    corto: 'cookie de newsletter',
    detalle: 'Hace semanas dejó su email en un popup. Su navegador guardó una cookie que lo reconoce al volver.'
  },
  {
    id: 'anonimo',
    titulo: 'Nadie: visitante anónimo',
    corto: 'anónimo',
    detalle: 'Miró, agregó al carro y se fue sin dejar ningún dato. Para el CRM no existe.'
  }
];

export const esAnonimo = (cliente) => cliente.ident === 'anonimo';

function clienteComoDato(cliente, rules) {
  if (esAnonimo(cliente)) return { visitanteId: 'anon-8f2c1a', email: null };
  return {
    email: rules.email ? normEmail(cliente.email) : cliente.email,
    nombre: cliente.nombre,
    telefono: cliente.telefono,
    identificado_por: IDENTIFICACION.find((i) => i.id === cliente.ident)?.corto
  };
}

function consentComoDato(cliente, rules) {
  if (esAnonimo(cliente)) return null;
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

/**
 * Problemas que tendría la automatización con este evento, en lenguaje simple.
 * `terminos` apunta a entradas del glosario (guia.js).
 */
export function alertasDeEvento(ev, cliente, rules, contactos) {
  const out = [];
  const add = (nivel, texto, regla, terminos = []) => out.push({ nivel, texto, regla, terminos });

  if (esAnonimo(cliente)) {
    add(
      'error',
      'No dejó su email ni tenía sesión iniciada: el CRM no sabe quién es y no le puede escribir. Lo único posible es mostrarle anuncios del producto (remarketing).',
      null,
      ['cookie', 'remarketing']
    );
  }

  ev.items.forEach((it) => {
    const p = productById(it.productId);
    if (esTallaAmbigua(it.talla))
      add(
        'error',
        `«${it.nombre}»: el correo dirá «talla ${it.talla}», porque el sistema no guardó cuál eligió. Sólo guarda las tallas que existen.`,
        'sku',
        ['sku']
      );
    else if (esTallaNoChilena(it.talla))
      add(
        'warn',
        `«${it.nombre}»: la talla «${it.talla}» está en otro sistema y el resto en números chilenos (37, 38…). El sistema no sabe a qué talla chilena equivale.`,
        'listas',
        ['sistema-talla', 'lista-cerrada']
      );
    if (!it.foto)
      add('error', `«${it.nombre}»: no tiene foto. El correo sale con un cuadro vacío.`, 'sku', ['sku']);
    else if (!rules.sku && p.colores.length > 1)
      add(
        'warn',
        `«${it.nombre}»: hay una sola foto para todos los colores. Si eligió otro color, el correo le muestra uno que no eligió.`,
        'sku',
        ['sku']
      );
    if (!rules.listas) {
      if (!p.dirty.material)
        add(
          'error',
          `«${it.nombre}»: no dice de qué material es. No aparece cuando alguien filtra por material.`,
          'listas',
          ['lista-cerrada']
        );
      else if (p.dirty.material.toLowerCase().includes('sint') && p.capellada === 'Cuero' && p.suela !== 'Sintético')
        add(
          'error',
          `«${it.nombre}»: el campo material dice ${p.dirty.material}, pero la descripción dice cuero. Una máquina sólo lee el campo, así que cree que es sintético.`,
          'listas',
          ['lista-cerrada']
        );
      else if (p.dirty.material.includes('/'))
        add(
          'warn',
          `«${it.nombre}»: dice «${p.dirty.material}» en un solo campo. Debería decir capellada: cuero y suela: sintético, cada uno en su campo.`,
          'listas',
          ['lista-cerrada']
        );
    }
  });

  if (ev.cliente.email && ev.cliente.email !== normEmail(ev.cliente.email)) {
    const yaExiste = contactos.some(
      (c) => c.email !== ev.cliente.email && normEmail(c.email) === normEmail(ev.cliente.email)
    );
    add(
      yaExiste ? 'error' : 'warn',
      yaExiste
        ? `El email llegó como «${ev.cliente.email}», con espacios o mayúsculas. Para el CRM eso no es igual a «${normEmail(ev.cliente.email)}», que ya existía, así que crea una persona nueva: queda duplicada.`
        : `El email llegó como «${ev.cliente.email}», con espacios o mayúsculas. Si la próxima vez lo escribe bien, el CRM va a creer que es otra persona.`,
      'email',
      ['trim', 'normalizar', 'llave']
    );
  }

  const m = mensajesPermitidos(cliente, rules);
  if (m.whatsapp && !cliente.okWhatsapp)
    add(
      'error',
      'Se le manda WhatsApp aunque NO lo aceptó. Sólo marcó «acepto email», pero el sistema guarda un único «acepta comunicaciones: Sí» y lo usa para todo.',
      'consent',
      ['consentimiento']
    );
  if (m.email && !cliente.okEmail)
    add(
      'error',
      'Se le manda email aunque NO lo aceptó. Sólo marcó WhatsApp, pero el sistema guarda un único «acepta comunicaciones: Sí».',
      'consent',
      ['consentimiento']
    );

  if (!out.length) add('ok', 'Todo bien: el mensaje se arma con datos claros, sin adivinar nada.');
  return out;
}

/** Qué canales dispara la automatización según el modelo de consentimiento. */
export function mensajesPermitidos(cliente, rules) {
  if (esAnonimo(cliente)) return { email: false, whatsapp: false };
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
