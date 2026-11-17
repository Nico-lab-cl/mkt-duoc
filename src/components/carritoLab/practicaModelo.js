// Lógica de la práctica «Arma tu catálogo»: los alumnos definen sus campos,
// cargan productos y prueban un carro abandonado. Aquí viven los tipos de
// campo, las plantillas iniciales, el revisor de errores y el evento.

import { slug } from './motor';

export const TIPOS = [
  { id: 'id', label: 'ID (llave)', ayuda: 'Código único que identifica la fila. No se repite nunca. Ej: P-001, P-001-NEG-38.' },
  { id: 'texto', label: 'Texto libre', ayuda: 'Se escribe a mano. Sirve para nombre o descripción; no para filtrar.' },
  { id: 'lista', label: 'Lista cerrada', ayuda: 'Se elige de un menú. Cada opción tiene una etiqueta visible y un valor interno.' },
  { id: 'numero', label: 'Número', ayuda: 'Sólo números, con mínimo y máximo. Ej: precio 39990, plantilla 24.5.' },
  { id: 'sino', label: 'Sí / No', ayuda: 'Una casilla. Ej: ¿está en oferta?' },
  { id: 'imagen', label: 'Imagen', ayuda: 'La foto que se muestra en la tienda y en el correo.' }
];

export const tipoLabel = (t) => TIPOS.find((x) => x.id === t)?.label || t;

let n = 0;
export const uid = (p = 'x') => `${p}${Date.now().toString(36)}${(n++).toString(36)}`;

const campo = (interno, etiqueta, tipo, nivel, extra = {}) => ({
  id: uid('c'),
  interno,
  etiqueta,
  tipo,
  nivel,
  obligatorio: tipo === 'id',
  opciones: [],
  min: '',
  max: '',
  ...extra
});

const opts = (...labels) => labels.map((l) => ({ etiqueta: l, valor: slug(l).replace(/-/g, '_') }));

/** Plantillas para empezar */
export function plantillaVacia() {
  const campos = [campo('product_id', 'ID del producto', 'id', 'producto'), campo('nombre', 'Nombre', 'texto', 'producto', { obligatorio: true })];
  return { campos, productos: [] };
}

export function plantillaConErrores() {
  const c = {
    id: campo('ID', 'ID', 'id', 'producto'),
    nombre: campo('Nombre Producto', 'Nombre del producto', 'texto', 'producto', { obligatorio: true }),
    talla: campo('talla', 'Tallas', 'texto', 'producto'),
    color: campo('color', 'Color', 'texto', 'producto'),
    material: campo('Material', 'Material', 'texto', 'producto'),
    precio: campo('precio', 'Precio', 'texto', 'producto'),
    foto: campo('foto', 'Foto', 'imagen', 'producto')
  };
  const v = (o) => Object.fromEntries(Object.entries(o).map(([k, val]) => [c[k].id, val]));
  return {
    campos: Object.values(c),
    productos: [
      {
        uid: uid('p'),
        valores: v({ id: 'Z1', nombre: 'Zapatilla Nube', talla: '37, 38, 39', color: 'Negro/Blanco', material: 'cuero', precio: '$39.990', foto: 'Negro' }),
        variantes: []
      },
      {
        uid: uid('p'),
        valores: v({ id: 'Z1', nombre: 'Bota Andina', talla: 'M, L', color: 'NEGRO ', material: 'Cuero', precio: '54990', foto: '' }),
        variantes: []
      }
    ]
  };
}

// ---------- helpers ----------

const esCampo = (f, ...palabras) => {
  const s = (f.interno + ' ' + f.etiqueta).toLowerCase();
  return palabras.some((p) => s.includes(p));
};
const vacio = (v) => v === undefined || v === null || String(v).trim() === '';
const internoValido = (s) => /^[a-z][a-z0-9_]*$/.test(s);
const valorValido = (s) => /^[a-z0-9][a-z0-9_]*$/.test(s);
const multiValor = (v) => /[,/;]|\sy\s/.test(String(v));
const norm = (v) => String(v).trim().toLowerCase();

/** Busca qué campo usaría el correo para cada dato. */
export function mapeoCorreo(campos) {
  const pick = (...p) => campos.find((f) => esCampo(f, ...p));
  return {
    nombre: pick('nombre', 'name', 'titulo'),
    talla: pick('talla', 'size'),
    color: pick('color'),
    precio: pick('precio', 'price', 'valor'),
    foto: campos.find((f) => f.tipo === 'imagen') || pick('foto', 'imagen', 'image')
  };
}

/** Cómo se ve un valor para una persona (etiqueta) */
export function valorVisible(f, v) {
  if (vacio(v)) return '';
  if (f.tipo === 'lista') return f.opciones.find((o) => o.valor === v)?.etiqueta ?? v;
  if (f.tipo === 'sino') return v ? 'Sí' : 'No';
  return String(v);
}

/** Cómo viaja un valor en el JSON (valor interno) */
function valorInterno(f, v) {
  if (vacio(v)) return null;
  if (f.tipo === 'numero') return Number(v);
  if (f.tipo === 'sino') return Boolean(v);
  if (f.tipo === 'imagen') return `https://mitienda.example/img/${slug(v)}.png`;
  return v;
}

// ---------- revisor ----------

/**
 * Revisa el modelo y los datos. Cada hallazgo: { nivel, donde, texto, arreglo, terminos }
 * nivel: 'error' (rompe la automatización) | 'warn' (te va a dar problemas) | 'ok'
 */
export function revisar({ campos, productos }) {
  const out = [];
  const add = (nivel, donde, texto, arreglo, terminos = []) => out.push({ nivel, donde, texto, arreglo, terminos });
  const prod = campos.filter((f) => f.nivel === 'producto');
  const vari = campos.filter((f) => f.nivel === 'variante');

  // --- Modelo ---
  if (!prod.some((f) => f.tipo === 'id'))
    add('error', 'Campos', 'El producto no tiene un campo de tipo ID.', 'Agrega un campo «product_id» de tipo ID en Producto. Es la llave que identifica cada producto.', ['llave']);
  if (vari.length && !vari.some((f) => f.tipo === 'id'))
    add('error', 'Campos', 'Las variantes no tienen un campo de tipo ID.', 'Agrega «sku_id» de tipo ID en Variante. Es lo que el carro guarda para saber qué par exacto dejaste.', ['sku', 'llave']);

  const vistos = {};
  campos.forEach((f) => {
    const nombre = `«${f.interno || '(sin nombre)'}»`;
    if (!internoValido(f.interno))
      add(
        'error',
        'Campos',
        `El nombre interno ${nombre} tiene mayúsculas, espacios, tildes o símbolos.`,
        `Usa sólo minúsculas, números y guion bajo: «${slug(f.interno || f.etiqueta).replace(/-/g, '_') || 'mi_campo'}». El nombre interno es el que leen las máquinas; la etiqueta es la que ve la gente.`,
        ['interno-etiqueta', 'normalizar']
      );
    const k = norm(f.interno);
    if (k && vistos[k]) add('error', 'Campos', `Hay dos campos con el nombre interno ${nombre}.`, 'Cada campo necesita un nombre interno distinto.', ['llave']);
    vistos[k] = true;

    if (esCampo(f, 'talla', 'size') && f.nivel === 'producto')
      add('error', 'Campos', `${nombre} está en Producto.`, 'Muévelo a Variante: cada talla es un par distinto, con su propio stock. Si queda en Producto, el correo no sabe qué talla dejó el cliente.', ['sku']);
    if (esCampo(f, 'color') && f.nivel === 'producto')
      add('warn', 'Campos', `${nombre} está en Producto.`, 'Si el modelo viene en más de un color, el color va en Variante, junto con su foto.', ['sku']);
    if (f.tipo === 'texto' && esCampo(f, 'talla', 'color', 'material', 'genero', 'género', 'horma', 'marca', 'categor', 'tipo'))
      add('warn', 'Campos', `${nombre} es texto libre.`, 'Si se usa para filtrar o segmentar, conviene que sea Lista cerrada: así nadie escribe «NEGRO», «negro » y «Negro».', ['lista-cerrada']);
    if (esCampo(f, 'precio', 'price') && f.tipo !== 'numero')
      add('error', 'Campos', `${nombre} no es de tipo Número.`, 'El precio debe ser un número (39990), sin «$» ni puntos. Así se puede sumar, ordenar y comparar.', []);
    if (f.tipo === 'lista') {
      if (f.opciones.length < 2) add('warn', 'Campos', `La lista ${nombre} tiene menos de 2 opciones.`, 'Agrega todas las opciones posibles.', ['lista-cerrada']);
      const vs = {};
      f.opciones.forEach((o) => {
        if (!valorValido(o.valor))
          add('error', 'Campos', `En ${nombre}, el valor interno «${o.valor}» no está normalizado.`, `Usa minúsculas sin espacios ni tildes: «${slug(o.etiqueta).replace(/-/g, '_')}».`, ['valor-interno', 'normalizar']);
        if (vs[norm(o.valor)]) add('error', 'Campos', `En ${nombre}, la opción «${o.etiqueta}» está repetida.`, 'Cada opción debe aparecer una sola vez.', ['lista-cerrada']);
        vs[norm(o.valor)] = true;
      });
    }
    if (f.tipo === 'numero' && f.min !== '' && f.max !== '' && Number(f.min) > Number(f.max))
      add('error', 'Campos', `En ${nombre}, el mínimo es mayor que el máximo.`, 'Revisa el rango.', []);
  });
  if (!campos.some((f) => f.tipo === 'imagen'))
    add('warn', 'Campos', 'No hay ningún campo de tipo Imagen.', 'El correo de recuperación necesita una foto. Agrégala en Variante para que cada color tenga la suya.', ['sku']);
  else if (!vari.some((f) => f.tipo === 'imagen') && vari.some((f) => esCampo(f, 'color')))
    add('warn', 'Campos', 'La foto está en Producto pero el color está en Variante.', 'Mueve la foto a Variante: si no, el correo muestra un color que el cliente no eligió.', ['sku']);

  // --- Datos ---
  const revisarFila = (fila, lista, donde) => {
    lista.forEach((f) => {
      const v = fila.valores[f.id];
      const n = `«${f.etiqueta || f.interno}»`;
      if (vacio(v)) {
        if (f.obligatorio) add('error', donde, `${n} está vacío y es obligatorio.`, 'Complétalo.', []);
        else if (f.tipo === 'imagen') add('warn', donde, `${n} no tiene foto.`, 'El correo saldrá con un cuadro vacío.', []);
        return;
      }
      if ((f.tipo === 'texto' || f.tipo === 'id') && multiValor(v) && !esCampo(f, 'nombre', 'descrip'))
        add('error', donde, `${n} tiene varios valores en una celda: «${v}».`, esCampo(f, 'talla', 'color') ? 'Crea una variante por cada talla y color, con un solo valor cada una.' : 'Un campo, un valor. Si de verdad son dos cosas, sepáralas en dos campos (ej: material_capellada y material_suela).', ['sku', 'lista-cerrada']);
      if (f.tipo === 'texto' && v !== String(v).trim())
        add('warn', donde, `${n} tiene espacios de más: «${String(v).replace(/ /g, '␣')}».`, 'Bórralos (eso hace TRIM).', ['trim']);
      if (f.tipo === 'numero') {
        const x = Number(v);
        if (Number.isNaN(x)) add('error', donde, `${n} no es un número: «${v}».`, 'Escribe sólo dígitos.', []);
        else if ((f.min !== '' && x < Number(f.min)) || (f.max !== '' && x > Number(f.max)))
          add('error', donde, `${n} vale ${v}, fuera del rango ${f.min || '−∞'}–${f.max || '∞'}.`, 'Revisa el dato o el rango.', []);
      }
    });
  };

  const ids = {};
  const textos = {};
  productos.forEach((p, i) => {
    const pid = prod.find((f) => f.tipo === 'id');
    const nombreP = `Producto ${i + 1}${pid && p.valores[pid.id] ? ` (${p.valores[pid.id]})` : ''}`;
    revisarFila(p, prod, nombreP);
    if (pid && !vacio(p.valores[pid.id])) {
      const k = norm(p.valores[pid.id]);
      if (ids[k]) add('error', nombreP, `El ID «${p.valores[pid.id]}» ya lo usa otro producto.`, 'Las llaves no se pueden repetir: el sistema mezclaría los dos productos.', ['llave']);
      ids[k] = true;
    }
    if (vari.length && p.variantes.length === 0)
      add('error', nombreP, 'No tiene variantes.', 'Sin variantes no hay nada que agregar al carro. Agrega al menos una (talla + color).', ['sku']);
    const vid = vari.find((f) => f.tipo === 'id');
    p.variantes.forEach((va, j) => {
      const donde = `${nombreP} › variante ${j + 1}`;
      revisarFila(va, vari, donde);
      if (vid && !vacio(va.valores[vid.id])) {
        const k = 'v:' + norm(va.valores[vid.id]);
        if (ids[k]) add('error', donde, `El SKU «${va.valores[vid.id]}» está repetido.`, 'Cada variante necesita su propio código.', ['sku', 'llave']);
        ids[k] = true;
      }
    });
    const juntar = (lista, valores) =>
      lista.forEach((f) => {
        if (f.tipo !== 'texto' || esCampo(f, 'nombre', 'descrip')) return;
        const v = valores[f.id];
        if (!vacio(v)) (textos[f.id] ||= []).push(String(v));
      });
    juntar(prod, p.valores);
    p.variantes.forEach((va) => juntar(vari, va.valores));
  });
  Object.entries(textos).forEach(([fid, vals]) => {
    const grupos = {};
    vals.forEach((v) => (grupos[norm(v)] ||= new Set()).add(v));
    Object.values(grupos).forEach((set) => {
      if (set.size > 1) {
        const f = campos.find((x) => x.id === fid);
        add('warn', 'Datos', `En «${f.etiqueta}» el mismo valor está escrito de ${set.size} formas: ${[...set].map((s) => `«${s.replace(/ /g, '␣')}»`).join(', ')}.`, 'Para una máquina son valores distintos: salen filtros repetidos. Conviértelo en Lista cerrada.', ['lista-cerrada', 'normalizar', 'faceta']);
      }
    });
  });

  if (productos.length === 0) add('warn', 'Datos', 'Todavía no hay productos.', 'Ve al paso 2 y crea al menos uno.', []);
  return out;
}

// ---------- prueba de carro ----------

export function eventoPractica({ campos }, producto, variante, email) {
  const fila = (lista, valores) =>
    Object.fromEntries(lista.map((f) => [f.interno || '(sin_nombre)', valorInterno(f, valores[f.id])]));
  const prod = campos.filter((f) => f.nivel === 'producto');
  const vari = campos.filter((f) => f.nivel === 'variante');
  const item = { ...fila(prod, producto.valores), ...(variante ? fila(vari, variante.valores) : {}), cantidad: 1 };
  return {
    evento: 'carrito_abandonado',
    cartId: 'CART-' + Math.abs(hash(JSON.stringify(item))).toString().slice(0, 4),
    cliente: { email },
    items: [item]
  };
}

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/** Qué mostraría el correo y qué está roto en cada dato. */
export function correoPractica({ campos }, producto, variante) {
  const m = mapeoCorreo(campos);
  const leer = (f) => {
    if (!f) return { valor: null, problema: 'No existe un campo para esto.' };
    const fuente = f.nivel === 'variante' ? variante?.valores : producto.valores;
    if (f.nivel === 'variante' && !variante) return { valor: null, problema: 'Está en Variante, pero el producto no tiene variantes.' };
    const v = fuente?.[f.id];
    if (vacio(v)) return { valor: null, problema: `El campo «${f.interno}» está vacío.` };
    const visible = valorVisible(f, v);
    if (f.tipo !== 'imagen' && multiValor(visible) && !esCampo(f, 'nombre'))
      return { valor: visible, problema: 'Trae varios valores: el correo no sabe cuál eligió el cliente.' };
    if (f.tipo === 'texto' && visible !== visible.trim()) return { valor: visible, problema: 'Tiene espacios de más.' };
    return { valor: visible, problema: null, campo: f };
  };
  const precio = leer(m.precio);
  if (precio.valor && m.precio.tipo !== 'numero') precio.problema = precio.problema || 'Es texto: no se puede calcular un descuento ni ordenar por precio.';
  return {
    nombre: leer(m.nombre),
    talla: leer(m.talla),
    color: leer(m.color),
    precio,
    foto: leer(m.foto),
    mapeo: m
  };
}

// ---------- exportar ----------

export function aCsv({ campos, productos }) {
  const prod = campos.filter((f) => f.nivel === 'producto');
  const vari = campos.filter((f) => f.nivel === 'variante');
  const cols = [...prod, ...vari];
  const esc = (v) => {
    const s = v === undefined || v === null ? '' : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = [cols.map((f) => esc(f.interno)).join(',')];
  productos.forEach((p) => {
    const base = prod.map((f) => esc(p.valores[f.id]));
    if (!p.variantes.length) rows.push([...base, ...vari.map(() => '')].join(','));
    p.variantes.forEach((va) => rows.push([...base, ...vari.map((f) => esc(va.valores[f.id]))].join(',')));
  });
  return rows.join('\n');
}

export const nuevoCampo = (nivel) => campo('', '', 'texto', nivel);
export const opcionesDesde = opts;
